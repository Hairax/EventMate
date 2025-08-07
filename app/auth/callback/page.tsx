"use client";

import { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          toast.success("Google login exitoso");

          // ---- INICIO DE LA SOLUCIÓN ----

          // 1. Obtenemos el token de ID del usuario recién autenticado.
          const token = await result.user.getIdToken();

          // 2. Guardamos el token en la cookie manualmente.
          // Esto garantiza que el middleware la encontrará en la siguiente navegación.
          document.cookie = `__session=${token}; path=/`;
          
          // 3. Ahora sí, redirigimos al usuario a la página de eventos.
          router.push("/events");
          
          // ---- FIN DE LA SOLUCIÓN ----

        } else {
          // Si el usuario vuelve a esta página sin un resultado (p.ej. recargando),
          // lo mandamos al login para evitar que se quede en una página en blanco.
          router.replace("/auth/login");
        }
      } catch (err: unknown) {
        toast.error("Error al procesar login con Google");
        console.error(err);
        router.replace("/auth/login");
      }
    };

    processRedirect();
  }, [router]);

  return <div className="p-4">Procesando inicio de sesión...</div>;
}