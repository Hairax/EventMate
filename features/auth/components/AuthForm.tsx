"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginWithEmail, registerWithEmail, loginWithGoogle } from "../services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      try {
        let userCredential;
        if (mode === "login") {
          userCredential = await loginWithEmail(data.email, data.password);
          toast.success("Sesión iniciada");
        } else {
          userCredential = await registerWithEmail(data.email, data.password);
          toast.success("Usuario registrado");
        }
        // Guardar el token en la cookie
        if (userCredential?.user) {
          const token = await userCredential.user.getIdToken();
          document.cookie = `__session=${token}; path=/`;
          console.log("Token guardado en cookie __session:", token);
        } else {
          console.log("No se obtuvo userCredential.user");
        }
        router.push("/events");
      } catch (err: unknown) {
        console.error("Error en login/register:", err);
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Error desconocido");
        }
      }
    });
  };

  const handleGoogleLogin = async () => {
    startTransition(async () => {
      try {

        const userCredential = await loginWithGoogle();
        toast.success("Sesión iniciada con Google");
        
        if (userCredential?.user) {
          const token = await userCredential.user.getIdToken();
          document.cookie = `__session=${token}; path=/`;
          console.log("Token de Google guardado en cookie __session:", token);
          router.push("/events");
        } else {
          console.log("No se obtuvo userCredential.user de Google");
          toast.error("No se pudo completar el inicio de sesión con Google.");
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes("popup-closed-by-user")) {
          toast.info("La ventana de inicio de sesión fue cerrada.");
        } else {
          toast.error("Error al iniciar sesión con Google");
        }
        console.error(err);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm w-full">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" {...register("email")} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input type="password" {...register("password")} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {mode === "login" ? "Iniciar sesión" : "Registrarse"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
      >
        Continuar con Google
      </Button>
    </form>
  );
}
