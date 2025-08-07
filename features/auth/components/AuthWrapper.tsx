"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (user && ["/auth/login", "/auth/register"].includes(pathname)) {
      router.replace("/events");
    }
  }, [user, loading, pathname, router]);

  return <>{children}</>;
}
