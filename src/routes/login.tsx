import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth-shell";
import { login, ApiError } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — FindSinger" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    setLoading(true);
    try {
      const { user } = await login(email, password);
      navigate({ to: user.role === "ARTIST" ? "/dashboard/musico" : "/dashboard/estabelecimento" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para continuar."
      footer={<>Não tem conta? <Link to="/cadastro" className="font-semibold text-primary hover:underline">Cadastre-se</Link></>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="voce@exemplo.com" className="h-11 rounded-xl" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" className="h-11 rounded-xl" required />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl">
          {loading ? "Entrando…" : "Entrar"}
        </Button>
        <Button type="button" variant="outline" className="h-11 w-full rounded-xl">Continuar com Google</Button>
      </form>
    </AuthShell>
  );
}
