import { Link } from "@tanstack/react-router";
import { Mic2, Instagram, Twitter, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Mic2 className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold">FindSinger</span>
          </div>
          <p className="text-sm text-muted-foreground">
            A plataforma que conecta música ao vivo e quem faz a noite acontecer.
          </p>
          <div className="flex gap-2 pt-2">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Para músicos" links={[
          { to: "/cadastro", label: "Criar perfil" },
          { to: "/para-musicos", label: "Como funciona" },
          { to: "/dashboard/musico", label: "Painel" },
        ]} />

        <FooterCol title="Para estabelecimentos" links={[
          { to: "/buscar", label: "Buscar músicos" },
          { to: "/para-estabelecimentos", label: "Como contratar" },
          { to: "/dashboard/estabelecimento", label: "Meu painel" },
        ]} />

        <FooterCol title="Empresa" links={[
          { to: "/", label: "Sobre" },
          { to: "/", label: "Termos" },
          { to: "/", label: "Privacidade" },
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} FindSinger. Todos os direitos reservados.</p>
          <p>Feito com 🎤 no Brasil</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
