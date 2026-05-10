import { Link } from "@tanstack/react-router";
import { Star, MapPin, Users, BadgeCheck } from "lucide-react";
import type { Musician } from "@/lib/mock-data";
import { formatBRL } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export function MusicianCard({ m }: { m: Musician }) {
  return (
    <Link
      to="/musicos/$slug"
      params={{ slug: m.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={m.image}
          alt={m.artistName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {m.available ? (
            <Badge className="rounded-full bg-success text-success-foreground hover:bg-success">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success-foreground" />
              Disponível
            </Badge>
          ) : (
            <Badge variant="secondary" className="rounded-full">Agenda cheia</Badge>
          )}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          {m.rating.toFixed(1)}
          <span className="text-muted-foreground">({m.reviewsCount})</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="flex items-center gap-1.5 font-display text-xl font-semibold leading-tight">
            {m.artistName}
            <BadgeCheck className="h-4 w-4 text-primary" />
          </h3>
          <p className="text-xs text-white/80">{m.shortBio}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {m.styles.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {s}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{m.city}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{m.type}</span>
        </div>
        <div className="mt-auto flex items-baseline justify-between border-t border-border pt-3">
          <div>
            <p className="text-xs text-muted-foreground">A partir de</p>
            <p className="font-display text-lg font-semibold">{formatBRL(m.priceMin)}</p>
          </div>
          <span className="text-xs font-medium text-primary group-hover:underline">Ver perfil →</span>
        </div>
      </div>
    </Link>
  );
}
