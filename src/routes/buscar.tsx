import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MusicianCard } from "@/components/musician-card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { musicians, STYLES, CITIES, type MusicianType } from "@/lib/mock-data";

export const Route = createFileRoute("/buscar")({
  head: () => ({
    meta: [
      { title: "Buscar músicos — FindSinger" },
      { name: "description", content: "Descubra cantores, duplas e bandas perto de você. Filtre por estilo, cidade, preço e disponibilidade." },
    ],
  }),
  component: SearchPage,
});

const TYPES: MusicianType[] = ["Solo", "Dupla", "Banda"];

function SearchPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>("");
  const [styles, setStyles] = useState<string[]>([]);
  const [types, setTypes] = useState<MusicianType[]>([]);
  const [price, setPrice] = useState<number[]>([0, 6000]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => musicians.filter((m) => {
    const q = query.trim().toLowerCase();
    if (q && !`${m.artistName} ${m.shortBio} ${m.styles.join(" ")}`.toLowerCase().includes(q)) return false;
    if (city && !`${m.city}, ${m.state}`.includes(city)) return false;
    if (styles.length && !styles.some((s) => m.styles.includes(s))) return false;
    if (types.length && !types.includes(m.type)) return false;
    if (m.priceMin > price[1] || m.priceMax < price[0]) return false;
    if (onlyAvailable && !m.available) return false;
    return true;
  }), [query, city, styles, types, price, onlyAvailable]);

  const toggle = <T,>(arr: T[], v: T, setter: (n: T[]) => void) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const clearAll = () => {
    setQuery(""); setCity(""); setStyles([]); setTypes([]); setPrice([0, 6000]); setOnlyAvailable(false);
  };

  const Filters = (
    <div className="space-y-7">
      <FilterBlock title="Cidade">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Todas as cidades</option>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </FilterBlock>

      <FilterBlock title="Tipo de formação">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const active = types.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggle(types, t, setTypes)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}
              >{t}</button>
            );
          })}
        </div>
      </FilterBlock>

      <FilterBlock title="Estilo musical">
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => {
            const active = styles.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(styles, s, setStyles)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}
              >{s}</button>
            );
          })}
        </div>
      </FilterBlock>

      <FilterBlock title={`Faixa de preço — R$ ${price[0]} a R$ ${price[1]}`}>
        <Slider min={0} max={6000} step={100} value={price} onValueChange={setPrice} />
      </FilterBlock>

      <FilterBlock title="Disponibilidade">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox checked={onlyAvailable} onCheckedChange={(v) => setOnlyAvailable(!!v)} />
          Apenas disponíveis agora
        </label>
      </FilterBlock>

      <Button variant="outline" className="w-full rounded-full" onClick={clearAll}>
        Limpar filtros
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:px-6">
            <div>
              <h1 className="font-display text-3xl font-semibold md:text-4xl">Encontre seu som.</h1>
              <p className="mt-1 text-muted-foreground">{results.length} artistas encontrados</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nome, estilo ou cidade…"
                  className="h-12 rounded-full pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-full lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold">Filtros</h2>
              <div className="mt-5">{Filters}</div>
            </div>
          </aside>

          <div>
            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-16 text-center">
                <p className="font-display text-xl">Nenhum artista encontrado</p>
                <p className="mt-2 text-muted-foreground">Tente ampliar os filtros.</p>
                <Button onClick={clearAll} className="mt-4 rounded-full">Limpar filtros</Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((m) => <MusicianCard key={m.id} m={m} />)}
              </div>
            )}
          </div>
        </section>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
            <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-background p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Filtros</h2>
                <button onClick={() => setFiltersOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-border">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {Filters}
              <Button className="mt-6 w-full rounded-full" onClick={() => setFiltersOpen(false)}>
                Ver {results.length} artistas
              </Button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}
