import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { AuthWrapper } from "@/features/auth/components/AuthWrapper";

export const metadata: Metadata = {
  title: "EventMate",
  description: "Gestor colaborativo de eventos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Toaster position="top-center" />
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
