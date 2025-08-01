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
    tags?: ItemTag[];
    properties: {
        image: { url: string; }
        description: string;
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
export const UserSchema = z.object({
    personas: z.array(z.object({id: z.string(), analyzedOn: z.number()})),
    progression: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const BookSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    relation: z.string().optional()
});
export type Book = z.infer<typeof BookSchema>;

export const BookAnalysisSchema = z.object({
    book: BookSchema,
    recommendations: z.array(BookSchema)
});
