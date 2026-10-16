import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Globe } from "lucide-react";
import logo from "@/assets/ysmed-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const nav = [
  { to: "/", k: "home" },
  { to: "/solutions", k: "solutions" },
  { to: "/projects", k: "projects" },
  { to: "/about", k: "about" },
  { to: "/contact", k: "contact" },
] as const;

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-primary" aria-label="Switch language">
      <Globe className="size-4" /> {lang === "en" ? "العربية" : "English"}
    </button>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <header className="glass fixed inset-x-0 top-0 z-50 border-x-0 border-t-0">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center"><img src={logo.url} alt="YSMED" className="h-11 w-auto" /></Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary">
              {t(n.k)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <LangSwitch />
          <Button asChild variant="hero" size="sm" className="rounded-full px-4"><Link to="/request">{t("request")}</Link></Button>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t px-4 pb-6 pt-2 lg:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-3 text-foreground data-[status=active]:text-primary">{t(n.k)}</Link>
          ))}
          <div className="mt-3 flex items-center justify-between">
            <LangSwitch />
            <Button asChild variant="hero" className="rounded-full"><Link to="/request" onClick={() => setOpen(false)}>{t("request")}</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <img src={logo.url} alt="YSMED" className="h-14 w-auto" />
          <p className="mt-3 text-sm text-gold">{t("magdy")}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {nav.map((n) => <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-primary">{t(n.k)}</Link>)}
        </div>
        <div className="text-sm text-muted-foreground">
          <Link to="/request" className="text-primary hover:underline">{t("request")} →</Link>
        </div>
      </div>
      <p className="border-t py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} YSMED for Innovative Solutions. {t("rights")}</p>
    </footer>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-32">
      <div className="circuit-grid absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6">
        <h1 className="animate-rise text-4xl font-bold sm:text-5xl"><span className="text-gradient">{title}</span></h1>
        {subtitle && <p className="animate-rise mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-6 py-20 ${className}`}>{children}</section>;
}
