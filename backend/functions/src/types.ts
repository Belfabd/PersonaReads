import {z} from "genkit";

// ---------------------------------------- QLoo Data
export type ItemTag = {
    name: string,
    tag_id: string;
    type: string;
    value: string;
}

export type ItemResult = {
    name: string;
    entity_id: string;
    types: string[];
    popularity: number;
    properties: {
        image: { url: string; }
        description: string;
        tags: ItemTag[];
    }
}

export type SearchResponse = {
    results: ItemResult[];
}

export type InsightResponse = {
    success: boolean;
    results: { entities: ItemResult[] };
    duration: number;
}


// ---------------------------------------- Data
export const BookSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
});
export type Book = z.infer<typeof BookSchema>;

export const BookAnalysisSchema = z.object({
    book: BookSchema,
    profile: z.array(z.string()),
    recommendations: z.array(BookSchema),
    created_at: z.string(),
});
export type BookAnalysis = z.infer<typeof BookAnalysisSchema>;
