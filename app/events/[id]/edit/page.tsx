"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { getEventById } from "@/features/events/services/getEventById";
import { updateEvent } from "@/features/events/services/updateEvent";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Timestamp } from "firebase/firestore";
import { Event } from "@/features/types";

const schema = z.object({
  title: z.string().min(1, "Requerido"),
  description: z.string().min(1, "Requerido"),
  date: z.string().min(1, "Seleccioná una fecha"),
  location: z.string().min(1, "Requerido"),
  category: z.string().min(1, "Requerido"),
  image: z.any().optional(), // opcional
});

type FormValues = z.infer<typeof schema>;

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isPending, startTransition] = useTransition();
  const [event, setEvent] = useState<Event | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const image = watch("image");

  // Obtener evento por ID
  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        const eventData = data as Event;
        setEvent(eventData);

        // Prellenar formulario
        setValue("title", eventData.title);
        setValue("description", eventData.description);
        setValue("location", eventData.location);
        setValue("category", eventData.category);
        setValue("date", new Date(eventData.date.toDate()).toISOString().slice(0, 16));
      } catch (error) {
        toast.error("Error al cargar el evento");
        router.push("/events");
      }
    };

    fetchEvent();
  }, [id, router, setValue]);

  const onSubmit = (data: FormValues) => {
    if (!id || typeof id !== "string") return;

    startTransition(async () => {
      try {
        let imageUrl = event?.imageUrl;

        if (data.image instanceof File) {
          imageUrl = await uploadImageToCloudinary(data.image);
        }

        await updateEvent(id, {
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          category: data.category,
          imageUrl,
        });

        toast.success("Evento actualizado");
        router.push("/events");
      } catch (error) {
        toast.error("Error al actualizar el evento");
        console.error(error);
      }
    });
  };

  if (!event) return <div className="p-6">Cargando evento...</div>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar evento</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Título</Label>
          <Input {...register("title")} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <Label>Fecha</Label>
          <Input type="datetime-local" {...register("date")} />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        <div>
          <Label>Lugar</Label>
          <Input {...register("location")} />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div>
          <Label>Categoría</Label>
          <Input {...register("category")} />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div>
          <Label>Nueva imagen (opcional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("image", file);
            }}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          Guardar cambios
        </Button>
      </form>
    </main>
  );
}
