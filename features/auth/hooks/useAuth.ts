import { useEffect, useState } from "react";
import { logout } from "@/features/auth/services/authService";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      console.log("Auth state changed:", user ? "Logged in" : "Logged out");
      // Si hay usuario, guardar el token en la cookie
      if (user) {
        const token = await user.getIdToken();
        document.cookie = `__session=${token}; path=/`;
        //console.log("Token guardado en cookie __session (useAuth):", token);
      } else {
        // Si no hay usuario, eliminar la cookie
        document.cookie = "__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      }
    });

    return () => unsub();
  }, []);

  return { user, loading, logout };
}
