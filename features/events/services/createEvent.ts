import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Event } from "../../types";

type CreateEventInput = Omit<Event, "id">;

export async function createEvent(event: CreateEventInput) {
  const docRef = await addDoc(collection(db, "events"), {
    ...event,
    date: event.date,
  });
  return docRef.id;
}
