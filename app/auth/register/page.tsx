import { AuthForm } from "@/features/auth/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
