import {googleAI} from "@genkit-ai/googleai";
import {genkit, z} from "genkit";
import {logger} from "genkit/logging";
import {onCallGenkit} from "firebase-functions/https";
import {credential} from "firebase-admin";
import {applicationDefault, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {setGlobalOptions} from "firebase-functions";
import {defineSecret} from "firebase-functions/params";
import {BookAnalysisSchema, BookAnalysis} from "./types";
import {addBook, getBookAnalysis} from "./utilities/database";
import {getBook, getRecommendations} from "./utilities/api";

// ----------------------------------------- Initializations
const debug = true; // TODO: turn to false
const app = initializeApp({
    credential: debug ? credential.cert("./firebase-creds.json") : applicationDefault(),
});
const firestore = getFirestore(app);
setGlobalOptions({maxInstances: 10});

// Secrets
const genaiKey = defineSecret("GOOGLE_GENAI_API_KEY");
const qlooKey = defineSecret("QLOO_API_KEY");

// ----------------------------------------- Configurations
const ai = genkit({
    plugins: [googleAI()],
});
logger.setLogLevel(debug ? "debug" : "info");

// ----------------------------------------- Prompts
const enhanceResultsPrompt = ai.definePrompt(
    {
        name: "enhanceResultsPrompt",
        input: {
            schema: z.object({
                name: z.string(),
                tags: z.array(z.string()),
                description: z.string(),
            })
        },
        output: {
            format: "json",
            schema: z.object({points: z.array(z.string())}),
        },
    },
    `Based on the name, description and tags of the book. Create a profile of the reader of such book is most interested in as a form of list of points.
    - Name: {{name}}
    - Description: {{description}}
    - Tags: {{tags}}`
);

// ----------------------------------------- Flows
const analyzeBookFlow = ai.defineFlow(
    {
        name: "analyze-book-flow",
        inputSchema: z.object({name: z.string()}),
        outputSchema: BookAnalysisSchema.or(z.object({error: z.string()})),
    },
    async (input, {context}) => {
        // Check if the user is not authenticated
        if (!context?.auth) {
            return {error: "Access denied. Please re-login and try again"};
        }

        try {
            // Get Book Details
            const bookResult = await getBook(qlooKey.value(), input.name);
            if (bookResult) {
                // Check if the Article already exists
                const analysis: BookAnalysis | undefined = await getBookAnalysis(firestore, bookResult.entity_id);
                if (analysis) return analysis; // already exists, return it
                else {
                    // ------------------------ Get Insights
                    const books = await getRecommendations(qlooKey.value(), bookResult.entity_id);

                    // ------------------------ Enhance results
                    const response = (await enhanceResultsPrompt({
                        name: input.name,
                        tags: bookResult.book.tags,
                        description: bookResult.book.description
                    }));
                    const points = response.output!.points;

                    // ------------------------ Save Results
                    const analysis : BookAnalysis = {
                        book: bookResult.book,
                        profile: points,
                        recommendations: books ?? [],
                        created_at: (new Date()).toDateString()
                    }
                    await addBook(firestore, bookResult.entity_id, analysis);

                    // ------------------------ Return Results
                    return analysis;
                }
            } else return {error: "Book not found. Try a different title."};
        } catch (e) {
            // not saved, it's ok for now
            return {error: "Oops! Something went wrong. Try again shortly."};
        }
    }
)

// ----------------------------------------- Starting...
export const analyzeBook = onCallGenkit({
    enforceAppCheck: false,
    secrets: [genaiKey, qlooKey],
}, analyzeBookFlow);
