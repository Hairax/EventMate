import { AuthForm } from "@/features/auth/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
