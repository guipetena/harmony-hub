import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Mic2, LayoutDashboard, Settings, Calendar, Image, MessageCircle, Heart, History, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item { to: string; label: string; icon: React.ComponentType<{ className?: string }>; }

export function DashboardLayout({ role }: { role: "musico" | "estabelecimento" }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items: Item[] = role === "musico" ? [
    { to: "/dashboard/musico", label: "Visão geral", icon: LayoutDashboard },
    { to: "/dashboard/musico", label: "Perfil", icon: Settings },
    { to: "/dashboard/musico", label: "Agenda", icon: Calendar },
    { to: "/dashboard/musico", label: "Mídias", icon: Image },
    { to: "/dashboard/musico", label: "Solicitações", icon: MessageCircle },
  ] : [
    { to: "/dashboard/estabelecimento", label: "Visão geral", icon: LayoutDashboard },
    { to: "/dashboard/estabelecimento", label: "Favoritos", icon: Heart },
    { to: "/dashboard/estabelecimento", label: "Solicitações", icon: MessageCircle },
    { to: "/dashboard/estabelecimento", label: "Histórico", icon: History },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <Link to="/" className="flex h-16 items-center gap-2 border-b border-border px-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Mic2 className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold">FindSinger</span>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((it, i) => (
            <Link
              key={i}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                i === 0 && path === it.to ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Sair
          </Link>
        </div>
      </aside>

      <div className="flex w-full flex-col">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Mic2 className="h-4 w-4" />
            </span>
            <span className="font-display font-semibold">FindSinger</span>
          </Link>
          <span className="text-xs text-muted-foreground">{role === "musico" ? "Painel do músico" : "Painel"}</span>
        </header>

        <main className="flex-1 p-4 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
