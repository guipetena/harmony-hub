import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — FindSinger" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para continuar."
      footer={<>Não tem conta? <Link to="/cadastro" className="font-semibold text-primary hover:underline">Cadastre-se</Link></>}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard/musico" }); }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="voce@exemplo.com" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
        </div>
        <div className="flex justify-end">
          <a href="#" className="text-xs font-medium text-primary hover:underline">Esqueci minha senha</a>
        </div>
        <Button type="submit" className="h-11 w-full rounded-xl">Entrar</Button>
        <Button type="button" variant="outline" className="h-11 w-full rounded-xl">Continuar com Google</Button>
      </form>
    </AuthShell>
  );
}
