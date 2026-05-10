import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic2, Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta — FindSinger" }] }),
  component: SignupPage,
});

type Role = "musico" | "estabelecimento" | null;

function SignupPage() {
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState<"role" | "form">("role");
  const navigate = useNavigate();

  return (
    <AuthShell
      title={step === "role" ? "Crie sua conta" : "Quase lá!"}
      subtitle={step === "role" ? "Como você quer usar o FindSinger?" : "Conte um pouco sobre você."}
      footer={<>Já tem conta? <Link to="/login" className="font-semibold text-primary hover:underline">Entrar</Link></>}
    >
      {step === "role" ? (
        <div className="space-y-3">
          <RoleCard
            active={role === "musico"}
            onClick={() => setRole("musico")}
            icon={Mic2}
            title="Sou músico"
            desc="Quero criar um perfil e receber contatos."
          />
          <RoleCard
            active={role === "estabelecimento"}
            onClick={() => setRole("estabelecimento")}
            icon={Building2}
            title="Quero contratar"
            desc="Sou estabelecimento ou organizo eventos."
          />
          <Button
            disabled={!role}
            onClick={() => setStep("form")}
            className="mt-4 h-11 w-full rounded-xl"
          >
            Continuar
          </Button>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: role === "musico" ? "/dashboard/musico" : "/dashboard/estabelecimento" });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">{role === "musico" ? "Nome artístico" : "Nome do estabelecimento"}</Label>
            <Input id="name" required className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required className="h-11 rounded-xl" />
          </div>
          <Button type="submit" className="h-11 w-full rounded-xl">Criar conta</Button>
          <button
            type="button"
            onClick={() => setStep("role")}
            className="block w-full text-center text-xs text-muted-foreground hover:underline"
          >
            ← Trocar tipo de conta
          </button>
        </form>
      )}
    </AuthShell>
  );
}

function RoleCard({ active, onClick, icon: Icon, title, desc }: {
  active: boolean; onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string; desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-foreground/30"}`}
    >
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {active && <Check className="h-5 w-5 text-primary" />}
    </button>
  );
}
