import {googleAI} from "@genkit-ai/googleai";
import {genkit, z} from "genkit";
import {logger} from "genkit/logging";
import {onCallGenkit} from "firebase-functions/https";
import {credential} from "firebase-admin";
import {applicationDefault, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {setGlobalOptions} from "firebase-functions";
import {defineSecret} from "firebase-functions/params";
import {Item, ItemSchema} from "./types";
import {addItem, getItem} from "./utilities";

// ----------------------------------------- Initializations
const debug = false;
const app = initializeApp({
    credential: debug ?
        credential.cert("./firebase-creds.json") : applicationDefault(),
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

// ----------------------------------------- Flows
const analyzeItemFlow = ai.defineFlow(
    {
        name: "analyze-item-flow",
        inputSchema: z.object({url: z.string(), title: z.string()}),
        outputSchema: ItemSchema.or(z.object({error: z.string()})),
    },
    async (input, {context}) => {
        // Check if the user is not authenticated
        if (!context?.auth) {
            return {error: "Access denied. Please re-login and try again"};
        }

        try {
            // Check if the Article already exists
            const item: Item | undefined = await getItem(firestore, input.url);
            if (item) return item; // already exists, return it
            else {
                // ------------------------ TODO: Fetch some content
                // ------------------------ TODO: Extract most important name
                // ------------------------ TODO: Use API
                // ------------------------ TODO: Enhance results
                // ------------------------ TODO: More enhancements with WikiPedia

                // ------------------------ Save Results
                await addItem(firestore, {url: "", created_at: ""}); //TODO: use proper

                // ------------------------ Return Results
                return {url: "", created_at: ""}; // TODO: return proper
            }
        } catch (e) {
            // not saved, it's ok for now
            return {error: "Access denied. Please re-login and try again"}; //TODO: new error message
        }
    }
)

// ----------------------------------------- Starting...
export const analyzeItem = onCallGenkit({
    enforceAppCheck: false,
    secrets: [genaiKey, qlooKey],
}, analyzeItemFlow);
