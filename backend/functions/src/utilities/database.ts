import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;
import {User} from "../types";

export async function getUserDetails(firestore: Firestore, userId: string): Promise<User | undefined> {
  const response = await firestore.collection("users").doc(userId).get();
  if (response.exists) return response.data() as User;
  else return undefined;
}

export async function updateUser(firestore: Firestore, userId: string, user: User) {
  await firestore.collection("users").doc(userId).set(user);
}
