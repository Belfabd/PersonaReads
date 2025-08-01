export type BookAnalysis = {
    book: Book,
    recommendations: Book[]
}

export type Book = {
    name: string,
    imageUrl: string,
    description: string,
    tags: string[],
    relation?: string,
}

export type Persona = {
    id: string,
    analyzedOn: number
}

export type PersonaDetailed = {
    id: string,
    name: string,
    description: string,
    image: string
}

export type User = {
    personas: Persona[],
    progression?: string,
}
