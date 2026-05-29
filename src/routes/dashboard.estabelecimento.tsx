import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, History, Star, Search, Check, X, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { formatBRL, whatsappLink } from "@/lib/mock-data";
import {
  listBookings,
  updateBookingStatus,
  getStoredUser,
  type BookingRequest,
} from "@/lib/api";

export const Route = createFileRoute("/dashboard/estabelecimento")({
  head: () => ({ meta: [{ title: "Painel — FindSinger" }] }),
  component: () => <DashboardLayout role="estabelecimento"><VenueDashboard /></DashboardLayout>,
});

const STATUS_LABEL: Record<BookingRequest["status"], string> = {
  PENDING: "Aguardando",
  ACCEPTED: "Confirmado",
  REJECTED: "Rejeitado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const STATUS_CLASS: Record<BookingRequest["status"], string> = {
  PENDING: "bg-primary/15 text-primary",
  ACCEPTED: "bg-success/15 text-success",
  REJECTED: "bg-destructive/15 text-destructive",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
};

function VenueDashboard() {
  const qc = useQueryClient();
  const storedUser = getStoredUser();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: listBookings,
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingRequest["status"] }) =>
      updateBookingStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const active = bookings.filter((b) => ["PENDING", "ACCEPTED"].includes(b.status));
  const completed = bookings.filter((b) => b.status === "COMPLETED");

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Olá, {storedUser?.name?.split(" ")[0] ?? ""}! 👋</p>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">Seu painel</h1>
        </div>
        <Button asChild className="gap-2 rounded-full">
          <Link to="/buscar"><Search className="h-4 w-4" />Buscar músicos</Link>
        </Button>
      </header>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={MessageCircle} label="Solicitações ativas" value={String(active.length)} />
        <Metric icon={History} label="Contratações concluídas" value={String(completed.length)} />
        <Metric icon={Star} label="Total de solicitações" value={String(bookings.length)} />
      </div>

      {/* Bookings */}
      <Card title="Solicitações enviadas">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma solicitação enviada ainda.</p>
            <Button asChild className="mt-4 gap-2 rounded-full">
              <Link to="/buscar"><Search className="h-4 w-4" />Encontrar músicos</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-lg font-bold text-muted-foreground">
                    {b.artistProfile.artisticName[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{b.artistProfile.artisticName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(b.eventDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      {b.estimatedBudget ? ` · ${formatBRL(b.estimatedBudget)}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                  {b.status === "ACCEPTED" && b.establishmentProfile.whatsapp && (
                    <Button asChild size="sm" variant="outline" className="gap-1 rounded-full">
                      <a href={whatsappLink(b.establishmentProfile.whatsapp, b.artistProfile.artisticName)} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-3.5 w-3.5" /> Conversar
                      </a>
                    </Button>
                  )}
                  {b.status === "ACCEPTED" && (
                    <Button
                      size="sm"
                      className="gap-1 rounded-full"
                      disabled={changeStatus.isPending}
                      onClick={() => changeStatus.mutate({ id: b.id, status: "COMPLETED" })}
                    >
                      <Check className="h-3.5 w-3.5" /> Concluir
                    </Button>
                  )}
                  {["PENDING", "ACCEPTED"].includes(b.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 rounded-full text-destructive hover:text-destructive"
                      disabled={changeStatus.isPending}
                      onClick={() => changeStatus.mutate({ id: b.id, status: "CANCELLED" })}
                    >
                      <X className="h-3.5 w-3.5" /> Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Completed history */}
      {completed.length > 0 && (
        <Card title="Histórico de contratações concluídas">
          <div className="divide-y divide-border">
            {completed.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-lg font-bold text-muted-foreground">
                    {b.artistProfile.artisticName[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{b.artistProfile.artisticName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(b.eventDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">Concluído</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
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
