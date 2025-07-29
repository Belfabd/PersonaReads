import {z} from "genkit";

export const ItemSchema = z.object({
    url: z.string(),
    created_at: z.string(),
});
export type Item = z.infer<typeof ItemSchema>;
