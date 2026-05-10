import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Calendar, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import musicianImg from "@/assets/musician-4.jpg";

export const Route = createFileRoute("/para-musicos")({
  head: () => ({ meta: [{ title: "Para músicos — FindSinger" }] }),
  component: ForMusiciansPage,
});

function ForMusiciansPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Para músicos
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold md:text-6xl">Mais palcos.<br />Menos esforço.</h1>
              <p className="mt-5 text-lg text-muted-foreground">
                Crie um perfil profissional, mostre seu trabalho e seja encontrado por estabelecimentos que querem música ao vivo.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full"><Link to="/cadastro">Criar perfil grátis</Link></Button>
                <Button asChild variant="outline" size="lg" className="rounded-full"><Link to="/buscar">Ver outros artistas</Link></Button>
              </div>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-elevated">
              <img src={musicianImg} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="font-display text-3xl font-semibold md:text-5xl">Tudo que você precisa pra crescer.</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Sparkles, title: "Perfil profissional", desc: "Vídeos, fotos, repertório e avaliações em uma página linda." },
                { icon: Calendar, title: "Agenda integrada", desc: "Bloqueie datas e sinalize quando estiver disponível." },
                { icon: MessageCircle, title: "Contato direto", desc: "Receba solicitações no WhatsApp, sem intermediários." },
                { icon: ShieldCheck, title: "Selo verificado", desc: "Conquiste a confiança dos contratantes com avaliações." },
              ].map((b) => (
                <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><b.icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
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
