import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";

function extractPublicId(url: string): string {
  const matches = url.match(/upload\/v\d+\/(.+)\.[a-zA-Z]+$/);
  return matches ? matches[1] : "";
}

async function deleteFromCloudinary(imageUrl: string) {
  const publicId = extractPublicId(imageUrl);
  if (!publicId) throw new Error("No se pudo extraer el publicId de la imagen.");
  const response = await fetch('http://localhost:3000/api/delete-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar la imagen de Cloudinary.");
  }
}

export async function deleteEventWithImage(eventId: string, imageUrl?: string) {
  if (imageUrl) {
    await deleteFromCloudinary(imageUrl);
  }

  await deleteDoc(doc(db, "events", eventId));
}
