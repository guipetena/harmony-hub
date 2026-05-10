import { Link } from "@tanstack/react-router";
import { Mic2 } from "lucide-react";
import heroImg from "@/assets/hero-stage.jpg";

export function AuthShell({ title, subtitle, children, footer }: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-radial-stage lg:block">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-ink-foreground">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Mic2 className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold">FindSinger</span>
          </Link>
          <div>
            <p className="font-display text-3xl font-semibold leading-tight md:text-4xl">
              "Em 2 meses dobramos as noites de música ao vivo no nosso bar."
            </p>
            <p className="mt-4 text-sm text-white/70">— Carla Mendes, Bar do Lago</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 md:px-16">
        <Link to="/" className="mb-10 flex items-center gap-2 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Mic2 className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold">FindSinger</span>
        </Link>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
