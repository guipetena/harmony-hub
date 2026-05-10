import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Heart, MessageCircle, Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import musicianImg from "@/assets/musician-2.jpg";

export const Route = createFileRoute("/para-estabelecimentos")({
  head: () => ({ meta: [{ title: "Para estabelecimentos — FindSinger" }] }),
  component: ForVenuesPage,
});

function ForVenuesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-elevated md:order-2">
              <img src={musicianImg} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="md:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Para estabelecimentos
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold md:text-6xl">A trilha sonora certa<br />pro seu lugar.</h1>
              <p className="mt-5 text-lg text-muted-foreground">
                Encontre cantores, duplas e bandas locais para tornar suas noites inesquecíveis. Sem cadastro obrigatório, sem comissões.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full"><Link to="/buscar">Buscar agora</Link></Button>
                <Button asChild variant="outline" size="lg" className="rounded-full"><Link to="/cadastro">Criar conta grátis</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="font-display text-3xl font-semibold md:text-5xl">Como funciona</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Search, title: "Busque", desc: "Filtre por estilo, cidade e orçamento." },
                { icon: Heart, title: "Favorite", desc: "Salve os artistas que mais combinam." },
                { icon: MessageCircle, title: "Converse", desc: "Negocie tudo direto pelo WhatsApp." },
                { icon: Star, title: "Avalie", desc: "Compartilhe sua experiência no fim." },
              ].map((s, i) => (
                <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <span className="absolute right-5 top-5 font-display text-3xl font-semibold text-muted/60">0{i+1}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
