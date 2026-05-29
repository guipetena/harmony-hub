import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Sparkles, MessageCircle, Music, ShieldCheck, Star, ArrowRight, Mic2, Calendar, Wallet } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MusicianCard } from "@/components/musician-card";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/lib/mock-data";
import { searchArtists } from "@/lib/api";
import heroImg from "@/assets/hero-stage.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FindSinger — Encontre música ao vivo perto de você" },
      { name: "description", content: "Cantores, duplas e bandas para o seu evento ou estabelecimento. Cadastro grátis e contato direto via WhatsApp." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <FeaturedMusicians />
        <ForMusicians />
        <ForVenues />
        <Benefits />
        <Testimonials />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-radial-stage text-ink-foreground">
      <img
        src={heroImg}
        alt=""
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-6 md:pb-32 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Mais de 1.200 artistas em todo o Brasil
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-7xl">
            Música ao vivo,<br />
            <span className="text-gradient-warm">do seu jeito.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/75 md:text-lg">
            Descubra cantores, duplas e bandas locais. Faça o orçamento direto pelo WhatsApp em segundos.
          </p>

          <form
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-background/95 px-3 text-foreground">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Sua cidade"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-background/95 px-3 text-foreground">
              <Music className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Estilo musical"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button asChild size="lg" className="h-11 gap-2 rounded-xl px-6">
              <Link to="/buscar">
                <Search className="h-4 w-4" />
                Buscar
              </Link>
            </Button>
          </form>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
            <Stat n="1.2k+" l="Artistas" />
            <Divider />
            <Stat n="45+" l="Cidades" />
            <Divider />
            <Stat n="4.9" l="Avaliação média" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-display text-2xl font-semibold text-white">{n}</span>
      <span className="text-xs uppercase tracking-wider">{l}</span>
    </span>
  );
}
function Divider() {
  return <span className="h-4 w-px bg-white/15" />;
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: "Busque", desc: "Filtre por cidade, estilo musical e faixa de preço." },
    { icon: Mic2, title: "Descubra", desc: "Veja perfis com vídeos, fotos e avaliações reais." },
    { icon: MessageCircle, title: "Contrate", desc: "Fale direto com o artista pelo WhatsApp." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Como funciona</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-5xl">Simples como deve ser.</h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="group relative rounded-3xl border border-border bg-card p-8 shadow-soft transition-shadow hover:shadow-elevated">
            <span className="absolute right-6 top-6 font-display text-5xl font-semibold text-muted/60">0{i + 1}</span>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <s.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedMusicians() {
  const { data } = useQuery({
    queryKey: ["artists-featured"],
    queryFn: () => searchArtists({ limit: 4, available: true }),
  });
  const featured = data?.artists ?? [];
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">Em destaque</p>
            <h2 className="mt-3 font-display text-3xl font-semibold md:text-5xl">Artistas do momento</h2>
          </div>
          <Button asChild variant="outline" className="gap-2 rounded-full">
            <Link to="/buscar">Ver todos <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m) => <MusicianCard key={m.id} m={m} />)}
        </div>
      </div>
    </section>
  );
}

function ForMusicians() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Para músicos</span>
          <h2 className="mt-4 font-display text-3xl font-semibold md:text-5xl">Sua música, mais palcos.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Crie um perfil profissional em minutos. Mostre seu trabalho, defina sua disponibilidade e receba contatos qualificados de quem realmente quer contratar.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Perfil completo com vídeos, fotos e avaliações",
              "Visibilidade local para bares, restaurantes e eventos",
              "Contato direto via WhatsApp — sem comissões",
              "Painel para gerenciar sua agenda",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-foreground">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link to="/cadastro">Criar perfil grátis</Link>
          </Button>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-elevated">
            <img src={heroImg} alt="Músico em performance" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden w-64 rounded-2xl border border-border bg-card p-4 shadow-elevated md:block">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Nova solicitação</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Bar do Lago — sábado, 22h</p>
            <p className="mt-2 font-display text-xl font-semibold text-primary">R$ 1.200</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ForVenues() {
  return (
    <section className="border-y border-border bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map((n, i) => (
                <div key={n} className={`overflow-hidden rounded-2xl shadow-elevated ${i % 2 ? "mt-8" : ""}`}>
                  <img src={`https://picsum.photos/seed/venue-${n}/300/400`} alt="Artista" loading="lazy" className="aspect-[3/4] h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Para estabelecimentos</span>
            <h2 className="mt-4 font-display text-3xl font-semibold md:text-5xl">A noite perfeita começa aqui.</h2>
            <p className="mt-4 text-lg text-white/70">
              Restaurantes, bares, hotéis e produtores de eventos: encontre o som certo para o seu público em poucos cliques.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Filtros por estilo, cidade e orçamento",
                "Perfis verificados com avaliações reais",
                "Sem cadastro obrigatório para buscar",
                "Salve favoritos e compare propostas",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-white/90">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link to="/buscar">Encontrar músicos</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: ShieldCheck, title: "Perfis verificados", desc: "Validamos artistas para garantir confiança em cada contratação." },
    { icon: Wallet, title: "Sem comissão", desc: "O orçamento é direto entre você e o artista. Zero taxa por show." },
    { icon: MessageCircle, title: "Contato instantâneo", desc: "Um clique no WhatsApp e você já está conversando." },
    { icon: Star, title: "Avaliações reais", desc: "Veja a opinião de quem já contratou antes de fechar." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Benefícios</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-5xl">Feito para acontecer.</h2>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <b.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold">{b.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Depoimentos</p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-5xl">Histórias que tocam.</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-soft">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-5 flex-1 font-display text-lg leading-snug">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <img src={t.avatar} alt={t.name} loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="overflow-hidden rounded-[2rem] bg-radial-stage px-6 py-16 text-center text-ink-foreground md:px-16 md:py-24">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold md:text-5xl">
          Pronto para fazer música acontecer?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          Cadastre-se grátis em menos de 2 minutos. Seja músico ou estabelecimento, o palco é seu.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/cadastro">Criar minha conta</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            <Link to="/buscar">Explorar músicos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
