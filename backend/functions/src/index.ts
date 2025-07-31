import {googleAI} from "@genkit-ai/googleai";
import {genkit, z} from "genkit";
import {logger} from "genkit/logging";
import {onCallGenkit} from "firebase-functions/https";
import {credential} from "firebase-admin";
import {applicationDefault, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {setGlobalOptions} from "firebase-functions";
import {defineSecret} from "firebase-functions/params";
import {BookAnalysisSchema, User} from "./types";
import {getBook, getRecommendations} from "./utilities/api";
import {getUserDetails, updateUser} from "./utilities/database";
import {enhanceResultsPrompt, getPersonasPrompt} from "./utilities/prompts";

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

// ----------------------------------------- Flows
const analyzeBookFlow = ai.defineFlow(
    {
        name: "analyze-book-flow",
        inputSchema: z.object({name: z.string(), userId: z.string()}),
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
                // ------------------------ Get Recommendations & Enhance results
                const books = await getRecommendations(qlooKey.value(), bookResult.entity_id) ?? [];
                if (books.length == 0) return {error: "No similar books found. Try a different title."}

                // Continue, there's recommendations
                const response = (await enhanceResultsPrompt(ai)({
                    book: {
                        name: input.name,
                        description: bookResult.book.description
                    },
                    recommendations: books.map((book) => ({name: book.name, description: book.description}))
                }));
                const relations = response.output!.relations;

                // ------------------------ Update Personas
                const user: User | undefined = (await getUserDetails(firestore, input.userId));
                const newPersona = (await getPersonasPrompt(ai)({
                    book: {
                        name: input.name,
                        description: bookResult.book.description,
                        tags: bookResult.book.tags,
                    },
                    personas: user?.personas.sort((a, b) => a.analyzedOn - b.analyzedOn).map((p) => ({
                        persona: p.id,
                        date: (new Date(p.analyzedOn)).toLocaleString()
                    })) ?? [],
                })).output!.result;

                const persona = {id: newPersona.persona, analyzedOn: (new Date()).getTime()}
                await updateUser(firestore, input.userId, {
                    progression: newPersona.progression,
                    personas: user ? user.personas.concat([persona]) : [persona]
                })

                // ------------------------ Return Results
                return {
                    book: bookResult.book,
                    recommendations: books.map((book) => ({
                        ...book,
                        relation: relations.find((relation) => relation.name == book.name)!!.relation
                    }))
                };
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
