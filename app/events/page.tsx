"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getEventsByUser } from "@/features/events/services/eventsService";
import { EventCard } from "@/features/events/components/EventCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Event } from "@/features/types";

export default function EventsPage() {
  const { user, loading, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      const userEvents = await getEventsByUser(user.uid);
      console.log("Eventos traídos de Firestore:", userEvents);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizedEvents = userEvents.map((event: any) => ({
        ...event,
        date:
          event.date?.seconds && event.date?.nanoseconds
            ? event.date
            : new Date(event.date),
      }));

      setEvents(normalizedEvents as Event[]);
    };

    fetchEvents();
  }, [user]);

  if (loading) return <div className="p-4">Cargando eventos...</div>;

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mis eventos</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/events/new")}>Crear evento</Button>
          <Button variant="outline" onClick={logout}>Cerrar sesión</Button>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
              location={event.location}
              category={event.category}
              guests={event.guests}
              imageUrl={event.imageUrl}
              id={event.id}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center">
          No tenés eventos todavía. ¡Creá el primero!
        </p>
      )}
    </main>
  );
}
