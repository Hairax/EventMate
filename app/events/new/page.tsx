"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { createEvent } from "@/features/events/services/createEvent";
import { useAuth } from "@/features/auth/hooks/useAuth";

const schema = z.object({
  title: z.string().min(1, "Requerido"),
  description: z.string().min(1, "Requerido"),
  date: z.string().min(1, "Seleccioná una fecha"),
  location: z.string().min(1, "Requerido"),
  category: z.string().min(1, "Requerido"),
  image: z.instanceof(File),
});

type FormValues = z.infer<typeof schema>;

export default function NewEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (data: FormValues) => {
    if (!user) return toast.error("Usuario no autenticado");

    startTransition(async () => {
      try {
        const imageUrl = await uploadImageToCloudinary(data.image);

        // Convert string date to Timestamp
        const { Timestamp } = await import("firebase/firestore");
        await createEvent({
          title: data.title,
          description: data.description,
          date: Timestamp.fromDate(new Date(data.date)),
          location: data.location,
          category: data.category,
          imageUrl: imageUrl.url,
          guests: [],
          ownerId: user.uid,
        });

        toast.success("Evento creado correctamente");
        router.push("/events");
      } catch (err: unknown) {
        toast.error("Error al crear el evento");
        console.error(err);
      }
    });
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear nuevo evento</h1>
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
          <Label>Imagen destacada</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("image", file);
            }}
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        <Button type="submit" disabled={isPending}>
          Crear evento
        </Button>
      </form>
    </main>
  );
}
