"use client";

import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteEventWithImage } from "../services/deleteEvent";
import { toast } from "sonner";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

type Props = {
  id: string;
  title: string;
  description: string;
  date: Timestamp | string | Date;
  location: string;
  category: string;
  imageUrl?: string;
  guests: string[];
};

export function EventCard({
  id,
  title,
  description,
  date,
  location,
  category,
  imageUrl,
  guests,
}: Props) {
  const router = useRouter();
  const dateObj: Date =
    typeof date === "string"
      ? new Date(date)
      : (date instanceof Timestamp && date.toDate())
      ? date.toDate()
      : date instanceof Date
      ? date
      : new Date();

  const dateString = dateObj.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="overflow-hidden shadow-md border border-border hover:shadow-lg transition-all duration-200">
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="space-y-2 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
            {category}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="text-sm flex flex-col gap-1">
          <span>📅 {dateString}</span>
          <span>📍 {location}</span>
          <span>👥 {guests.length} invitado(s)</span>
        </div>
      </CardContent>
      <CardContent className="flex justify-end p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/events/${id}`)}
        >
          Ver detalles
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/events/${id}/edit`)}
        >
          Editar evento
        </Button>
        <Button
          variant="destructive"
          onClick={async () => {
            const confirmed = confirm("¿Estás seguro que querés eliminar este evento?");
            if (!confirmed) return;
            try {
              await deleteEventWithImage(id, imageUrl);
              toast.success("Evento eliminado");
              router.refresh(); // o router.push("/events")
            } catch (error: any) {
              console.error("Error al eliminar evento:", error);
              toast.error("Error al eliminar evento: " + (error?.message || JSON.stringify(error)));
            }
          }}
        >
          Eliminar
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            const email = prompt("Ingrese el email del invitado:");
            if (!email) return;

            try {
              const inviteToEvent = httpsCallable(functions, "inviteToEvent");
              const result = await inviteToEvent({ eventId: id, email });
              toast.success(result.data.message);
            } catch (err: any) {
              console.error(err);
              toast.error(err.message || "Error al invitar");
            }
          }}
        >
          Invitar
        </Button>
      </CardContent>
    </Card>
  );
}
