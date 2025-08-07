import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { Event } from "@/features/types";

interface Props {
  params: { id: string };
}

async function getEvent(id: string) {
  const docRef = doc(db, "events", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data?.title ?? "",
    description: data?.description ?? "",
    date: data?.date?.toDate ? data.date.toDate().toISOString() : "",
    location: data?.location ?? "",
    category: data?.category ?? "",
    imageUrl: data?.imageUrl ?? "",
    ownerId: data?.ownerId ?? "",
    guests: Array.isArray(data?.guests) ? data.guests : [],
  } as Event;
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEvent(params.id);
  if (!event) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <section className="mb-8">
        <div className="rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-100">
          <div className="p-8 text-center">
            <h1 className="text-4xl font-extrabold mb-2 text-indigo-700 drop-shadow-lg tracking-tight">{event.title}</h1>
            <span className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-5 py-2 rounded-full text-base font-semibold shadow">
              {event.category}
            </span>
          </div>
          {event.imageUrl && (
            <div className="relative w-full h-64 md:h-80">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="object-cover w-full h-full rounded-b-xl border-t border-indigo-100 shadow"
                style={{ maxHeight: '320px' }}
              />
            </div>
          )}
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
            <span>📝</span> Descripción
          </h2>
          <p className="text-gray-700 text-base leading-relaxed">{event.description}</p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-indigo-600">📅 Fecha:</span>
              <span>{typeof event.date === "string" ? new Date(event.date).toLocaleString("es-AR") : event.date?.toDate?.() ? event.date.toDate().toLocaleString("es-AR") : ""}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-indigo-600">📍 Lugar:</span>
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-indigo-600">🏷️ Categoría:</span>
              <span>{event.category}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
            <span>👥</span> Invitados
          </h2>
          {event.guests.length > 0 ? (
            <ul className="space-y-2">
              {event.guests.map((guest, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50 text-indigo-900 shadow-sm">
                  <span className="font-semibold">{guest}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 italic">No hay invitados registrados.</div>
          )}
        </div>
      </section>
    </main>
  );
}
