import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MessageCircle, History, Star, Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { musicians, formatBRL, whatsappLink } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/estabelecimento")({
  head: () => ({ meta: [{ title: "Painel — FindSinger" }] }),
  component: () => <DashboardLayout role="estabelecimento"><VenueDashboard /></DashboardLayout>,
});

function VenueDashboard() {
  const favorites = musicians.slice(0, 3);
  const sent = [
    { artist: musicians[1], when: "Sex, 14 jun", status: "Aguardando" },
    { artist: musicians[3], when: "Sáb, 22 jun", status: "Confirmado" },
  ];
  const history = [
    { artist: musicians[5], when: "Há 2 semanas", rating: 5 },
    { artist: musicians[4], when: "Há 1 mês", rating: 4 },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Bem-vindo de volta 👋</p>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">Seu painel</h1>
        </div>
        <Button asChild className="gap-2 rounded-full">
          <Link to="/buscar"><Search className="h-4 w-4" />Buscar músicos</Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={Heart} label="Favoritos" value={String(favorites.length)} />
        <Metric icon={MessageCircle} label="Solicitações ativas" value={String(sent.length)} />
        <Metric icon={History} label="Contratações" value={String(history.length)} />
      </div>

      <Card title="Favoritos">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((m) => (
            <div key={m.id} className="flex gap-3 rounded-2xl border border-border p-3">
              <img src={m.image} alt={m.artistName} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <p className="font-semibold leading-tight">{m.artistName}</p>
                <p className="text-xs text-muted-foreground">{m.city} · {m.type}</p>
                <p className="mt-auto text-sm font-semibold">{formatBRL(m.priceMin)}+</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Solicitações enviadas">
        <div className="divide-y divide-border">
          {sent.map((s) => (
            <div key={s.artist.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <img src={s.artist.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold">{s.artist.artistName}</p>
                  <p className="text-sm text-muted-foreground">{s.when}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.status === "Confirmado" ? "bg-success/15 text-success" : "bg-primary/15 text-primary"}`}>
                  {s.status}
                </span>
                <Button asChild size="sm" variant="outline" className="gap-1 rounded-full">
                  <a href={whatsappLink(s.artist.whatsapp, s.artist.artistName)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-3.5 w-3.5" /> Conversar
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Histórico de contatos">
        <div className="divide-y divide-border">
          {history.map((h) => (
            <div key={h.artist.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <img src={h.artist.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold">{h.artist.artistName}</p>
                  <p className="text-sm text-muted-foreground">{h.when}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: h.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
