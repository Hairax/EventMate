import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getEventById(id: string) {
  const ref = doc(db, "events", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Evento no encontrado");
  return { id: snap.id, ...snap.data() };
}
