import { db } from "@/lib/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateEvent(id: string, data: any) {
  const ref = doc(db, "events", id);
  const newData = {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
  };
  await updateDoc(ref, newData);
}
