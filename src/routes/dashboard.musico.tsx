import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MessageCircle, Eye, Star, Plus, Upload, Edit3 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { musicians, formatBRL } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/musico")({
  head: () => ({ meta: [{ title: "Painel do músico — FindSinger" }] }),
  component: () => <DashboardLayout role="musico"><MusicianDashboard /></DashboardLayout>,
});

function MusicianDashboard() {
  const me = musicians[0];
  const requests = [
    { who: "Bar do Lago", when: "Sáb, 14 jun · 22h", price: 1200, status: "Nova" as const },
    { who: "Hotel Costeira", when: "Sex, 20 jun · 20h", price: 1800, status: "Negociando" as const },
    { who: "Restaurante Madeira", when: "Dom, 22 jun · 19h", price: 900, status: "Confirmada" as const },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Olá, {me.artistName.split(" ")[0]} 👋</p>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">Seu painel</h1>
        </div>
        <Button className="gap-2 rounded-full"><Edit3 className="h-4 w-4" />Editar perfil</Button>
      </header>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Eye} label="Visitas no perfil" value="1.284" trend="+18%" />
        <Metric icon={MessageCircle} label="Solicitações" value="23" trend="+5" />
        <Metric icon={Calendar} label="Shows confirmados" value="9" trend="este mês" />
        <Metric icon={Star} label="Avaliação" value={me.rating.toFixed(1)} trend={`${me.reviewsCount} avaliações`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card title="Meu perfil" className="lg:col-span-1">
          <img src={me.image} alt={me.artistName} className="aspect-square w-full rounded-2xl object-cover" />
          <p className="mt-4 font-display text-xl font-semibold">{me.artistName}</p>
          <p className="text-sm text-muted-foreground">{me.city}, {me.state} · {me.type}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {me.styles.map((s) => <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{s}</span>)}
          </div>
          <div className="mt-4 rounded-xl border border-border p-3">
            <p className="text-xs text-muted-foreground">Faixa de preço</p>
            <p className="font-semibold">{formatBRL(me.priceMin)} – {formatBRL(me.priceMax)}</p>
          </div>
          <Button variant="outline" className="mt-4 w-full gap-2 rounded-full">
            <Upload className="h-4 w-4" /> Upload de mídia
          </Button>
        </Card>

        {/* Availability */}
        <Card title="Disponibilidade" className="lg:col-span-2">
          <div className="flex items-center justify-between rounded-xl bg-secondary p-4">
            <div>
              <p className="font-semibold">Aceitando novas solicitações</p>
              <p className="text-sm text-muted-foreground">Seu perfil aparece como "disponível" na busca.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold">Próximos dias</p>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 14 }).map((_, i) => {
                const busy = [2, 5, 9].includes(i);
                return (
                  <button
                    key={i}
                    className={`aspect-square rounded-xl text-xs font-medium transition-colors ${busy ? "bg-destructive/10 text-destructive" : "bg-card hover:bg-primary hover:text-primary-foreground"} border border-border`}
                  >
                    {i + 10}
                  </button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" className="mt-4 gap-1 rounded-full"><Plus className="h-3.5 w-3.5" />Bloquear data</Button>
          </div>
        </Card>

        {/* Requests */}
        <Card title="Solicitações recebidas" className="lg:col-span-3">
          <div className="divide-y divide-border">
            {requests.map((r) => (
              <div key={r.who} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold">{r.who}</p>
                  <p className="text-sm text-muted-foreground">{r.when}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-semibold">{formatBRL(r.price)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    r.status === "Nova" ? "bg-primary/15 text-primary" :
                    r.status === "Negociando" ? "bg-accent text-accent-foreground" :
                    "bg-success/15 text-success"
                  }`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, trend }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; trend: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-6 shadow-soft ${className}`}>
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
