import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, MessageCircle, Star, Edit3, Check, X, Loader2, Music } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { formatBRL } from "@/lib/mock-data";
import { ApiError,
  getMyArtistProfile,
  updateMyArtistProfile,
  listBookings,
  updateBookingStatus,
  getStoredUser,
  type BookingRequest,
} from "@/lib/api";

export const Route = createFileRoute("/dashboard/musico")({
  head: () => ({ meta: [{ title: "Painel do músico — FindSinger" }] }),
  component: () => <DashboardLayout role="musico"><MusicianDashboard /></DashboardLayout>,
});

const STATUS_LABEL: Record<BookingRequest["status"], string> = {
  PENDING: "Nova",
  ACCEPTED: "Confirmada",
  REJECTED: "Rejeitada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

const STATUS_CLASS: Record<BookingRequest["status"], string> = {
  PENDING: "bg-primary/15 text-primary",
  ACCEPTED: "bg-success/15 text-success",
  REJECTED: "bg-destructive/15 text-destructive",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
};

function MusicianDashboard() {
  const qc = useQueryClient();
  const storedUser = getStoredUser();

  const { data: profile, isLoading: loadingProfile, error: profileError } = useQuery({
    queryKey: ["my-artist-profile"],
    queryFn: getMyArtistProfile,
    retry: false,
  });

  // Artista recém-cadastrado ainda não criou o perfil artístico
  const noProfile = profileError instanceof ApiError && profileError.status === 404;

  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: listBookings,
  });

  const toggleAvailable = useMutation({
    mutationFn: (available: boolean) => updateMyArtistProfile({ available }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-artist-profile"] }),
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingRequest["status"] }) =>
      updateBookingStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });

  // Onboarding: artista criou conta mas ainda não completou o perfil artístico
  if (noProfile) {
    return (
      <DashboardLayout role="musico">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-20 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-primary/10 text-primary">
            <Music className="h-10 w-10" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold">Complete seu perfil</h1>
            <p className="mt-2 text-muted-foreground">
              Antes de receber solicitações, você precisa criar seu perfil artístico para aparecer nas buscas.
            </p>
          </div>
          <Button size="lg" className="rounded-full" onClick={() => alert("Em breve: tela de criação de perfil artístico")}>
            Criar meu perfil agora
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const image = profile?.medias.find((m) => m.type === "IMAGE")?.url
    ?? `https://picsum.photos/seed/${profile?.slug ?? "artist"}/400/400`;

  const accepted = bookings.filter((b) => b.status === "ACCEPTED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const reviews = profile?.reviews ?? [];
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const firstName = profile?.artisticName.split(" ")[0] ?? storedUser?.name?.split(" ")[0] ?? "";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Olá, {firstName} 👋</p>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">Seu painel</h1>
        </div>
        <Button className="gap-2 rounded-full"><Edit3 className="h-4 w-4" />Editar perfil</Button>
      </header>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={MessageCircle} label="Solicitações" value={String(bookings.length)} trend={`${bookings.filter(b => b.status === "PENDING").length} pendentes`} />
        <Metric icon={Check} label="Confirmados" value={String(accepted)} trend="aguardando evento" />
        <Metric icon={Calendar} label="Concluídos" value={String(completed)} trend="shows realizados" />
        <Metric icon={Star} label="Avaliação" value={avgRating} trend={`${reviews.length} avaliações`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card title="Meu perfil" className="lg:col-span-1">
          {loadingProfile ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : profile ? (
            <>
              <img src={image} alt={profile.artisticName} className="aspect-square w-full rounded-2xl object-cover" />
              <p className="mt-4 font-display text-xl font-semibold">{profile.artisticName}</p>
              <p className="text-sm text-muted-foreground">{profile.city}, {profile.state} · {profile.type}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.musicalStyles.map((s) => (
                  <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{s}</span>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground">Faixa de preço</p>
                <p className="font-semibold">{formatBRL(profile.priceMin)} – {formatBRL(profile.priceMax)}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Perfil não encontrado.</p>
          )}
        </Card>

        {/* Availability toggle */}
        <Card title="Disponibilidade" className="lg:col-span-2">
          <div className="flex items-center justify-between rounded-xl bg-secondary p-4">
            <div>
              <p className="font-semibold">Aceitando novas solicitações</p>
              <p className="text-sm text-muted-foreground">Seu perfil aparece como "disponível" na busca.</p>
            </div>
            <Switch
              checked={profile?.available ?? true}
              disabled={toggleAvailable.isPending || loadingProfile}
              onCheckedChange={(v) => toggleAvailable.mutate(v)}
            />
          </div>
        </Card>

        {/* Requests */}
        <Card title="Solicitações recebidas" className="lg:col-span-3">
          {loadingBookings ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma solicitação recebida ainda.</p>
          ) : (
            <div className="divide-y divide-border">
              {bookings.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-semibold">{b.establishmentProfile.establishmentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(b.eventDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      {b.estimatedBudget ? ` · ${formatBRL(b.estimatedBudget)}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                    {b.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="gap-1 rounded-full"
                          disabled={changeStatus.isPending}
                          onClick={() => changeStatus.mutate({ id: b.id, status: "ACCEPTED" })}
                        >
                          <Check className="h-3.5 w-3.5" /> Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 rounded-full"
                          disabled={changeStatus.isPending}
                          onClick={() => changeStatus.mutate({ id: b.id, status: "REJECTED" })}
                        >
                          <X className="h-3.5 w-3.5" /> Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
