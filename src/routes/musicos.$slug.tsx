import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, MapPin, Users, Calendar, MessageCircle, Heart, Share2, BadgeCheck, PlayCircle, ChevronLeft, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { formatBRL, whatsappLink } from "@/lib/mock-data";
import { getArtist } from "@/lib/api";

export const Route = createFileRoute("/musicos/$slug")({
  component: MusicianProfile,
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center p-10 text-center">
        <div>
          <h1 className="font-display text-4xl font-semibold">Artista não encontrado</h1>
          <Button asChild className="mt-4 rounded-full"><Link to="/buscar">Ver outros músicos</Link></Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  ),
});

function MusicianProfile() {
  const { slug } = Route.useParams();
  const { data: m, isLoading, isError } = useQuery({
    queryKey: ["artist", slug],
    queryFn: () => getArtist(slug),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (isError || !m) throw notFound();

  const banner = m.medias.find((med) => med.type === "IMAGE")?.url ?? `https://picsum.photos/seed/${m.slug}/1200/400`;
  const image = m.medias.find((med) => med.type === "IMAGE")?.url ?? `https://picsum.photos/seed/${m.slug}/400/400`;
  const gallery = m.medias.filter((med) => med.type === "IMAGE");
  const reviews = m.reviews ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-56 overflow-hidden bg-ink md:h-80">
          <img src={banner} alt="" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          <Link to="/buscar" className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1.5 text-sm font-medium backdrop-blur md:left-6 md:top-6">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <img
              src={image}
              alt={m.artisticName}
              className="relative z-10 -mt-16 h-32 w-32 shrink-0 rounded-3xl border-4 border-background object-cover shadow-elevated md:-mt-24 md:h-44 md:w-44"
            />
            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="flex flex-wrap items-center gap-2 font-display text-3xl font-semibold leading-tight pb-1 md:text-5xl">
                    <span className="break-words">{m.artisticName}</span>
                    {m.verified && <BadgeCheck className="h-6 w-6 shrink-0 text-primary" />}
                  </h1>
                </div>
                <p className="mt-1 text-muted-foreground">{m.shortBio}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  {reviews.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                      <span className="text-muted-foreground">({reviews.length} avaliações)</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{m.city}, {m.state}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" />{m.type} · {m.membersCount} {m.membersCount === 1 ? "integrante" : "integrantes"}</span>
                  {m.available ? (
                    <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">Disponível</span>
                  ) : (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">Agenda cheia</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full"><Heart className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-10">
              <Section title="Sobre">
                <p className="text-muted-foreground">{m.bio ?? m.shortBio ?? "Sem descrição."}</p>
              </Section>

              <Section title="Estilos musicais">
                <div className="flex flex-wrap gap-2">
                  {m.musicalStyles.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">{s}</span>
                  ))}
                </div>
              </Section>

              {gallery.length > 0 && (
                <Section title="Fotos">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {gallery.map((g) => (
                      <img key={g.id} src={g.url} alt="" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
                    ))}
                  </div>
                </Section>
              )}

              <Section title={`Avaliações (${reviews.length})`}>
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma avaliação ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{r.establishmentProfile.establishmentName}</p>
                          <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div className="mt-1 flex gap-0.5 text-primary">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                        </div>
                        {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">A partir de</p>
                <p className="font-display text-3xl font-semibold">{formatBRL(m.priceMin)}</p>
                <p className="text-sm text-muted-foreground">até {formatBRL(m.priceMax)} por show</p>

                <div className="my-5 h-px bg-border" />

                <div className="space-y-3 text-sm">
                  <Row icon={Calendar} label="Disponibilidade" value={m.available ? "Disponível para novas datas" : "Agenda cheia este mês"} />
                  <Row icon={Users} label="Formação" value={`${m.type} (${m.membersCount})`} />
                  <Row icon={MapPin} label="Atende" value={`${m.city} e região`} />
                </div>

                {m.whatsapp ? (
                  <Button asChild size="lg" className="mt-6 w-full gap-2 rounded-full bg-success text-success-foreground hover:bg-success/90">
                    <a href={whatsappLink(m.whatsapp, m.artisticName)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      Contato no WhatsApp
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" className="mt-6 w-full gap-2 rounded-full" disabled>
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp disponível após contratação
                  </Button>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Sem taxas. Negocie direto com o artista.
                </p>
              </div>
            </aside>
          </div>
        </div>

        <div className="h-20" />
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
