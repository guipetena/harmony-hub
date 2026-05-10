import { Link, useRouterState } from "@tanstack/react-router";
import { Mic2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/buscar", label: "Buscar músicos" },
  { to: "/para-musicos", label: "Para músicos" },
  { to: "/para-estabelecimentos", label: "Para estabelecimentos" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Mic2 className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">FindSinger</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                path === l.to && "bg-muted text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/cadastro">Cadastrar</Link>
          </Button>
        </div>

        <button
          aria-label="Abrir menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-base font-medium hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" className="flex-1 rounded-full">
                <Link to="/login" onClick={() => setOpen(false)}>Entrar</Link>
              </Button>
              <Button asChild className="flex-1 rounded-full">
                <Link to="/cadastro" onClick={() => setOpen(false)}>Cadastrar</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
