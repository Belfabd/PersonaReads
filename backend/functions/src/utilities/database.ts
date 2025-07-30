import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;
import {BookAnalysis} from "../types";

export async function getBookAnalysis(firestore: Firestore, id: string): Promise<BookAnalysis | undefined> {
    const response = await firestore.collection("items").doc(id).get();
    if (!response.exists) {
        return response.data() as BookAnalysis;
    } else return undefined;
}

export async function addBook(firestore: Firestore, entityId: string, book: BookAnalysis) {
    await firestore.collection("items").doc(entityId).set(book);
}
