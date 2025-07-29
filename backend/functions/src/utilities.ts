import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;
import {Item} from "./types";

export async function getItem(firestore: Firestore, url: string): Promise<Item | undefined> {
    const response = await firestore.collection("items").where("url", "==", url).get();
    if (!response.empty) {
        return response.docs[0].data() as Item;
    } else return undefined;
}

export async function addItem(firestore: Firestore, item: Item): Promise<string> {
    return (await firestore.collection("items").add(item)).id as string;
}
