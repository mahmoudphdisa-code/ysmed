import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Globe, ChevronRight } from "lucide-react";
import logo from "@/assets/ysmed-logo.png";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const nav = [
  { to: "/", k: "home" },
  { to: "/solutions", k: "solutions" },
  { to: "/about", k: "about" },
  { to: "/contact", k: "contact" },
] as const;

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-primary active:scale-95"
      aria-label="Switch language"
    >
      <Globe className="size-4 shrink-0" />
      <span>{lang === "en" ? "العربية" : "English"}</span>
    </button>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="glass fixed inset-x-0 top-0 z-50 border-x-0 border-t-0">
      {/* Desktop / main bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center" onClick={close}>
          <img src={logo} alt="YSMED" className="h-9 w-auto sm:h-11" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              {t(n.k)}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <LangSwitch />
          <Link
            to="/account"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {t("account")}
          </Link>
          <Button asChild variant="hero" size="sm" className="rounded-full px-4">
            <Link to="/request">{t("request")}</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-surface active:scale-95 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t transition-all duration-300 ease-in-out lg:hidden ${
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6 pt-3">
          {/* Nav links */}
          <nav className="flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={close}
                className="flex items-center justify-between border-b border-border/50 py-3.5 text-base text-foreground transition-colors last:border-0 hover:text-primary data-[status=active]:text-primary"
              >
                <span>{t(n.k)}</span>
                <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
              </Link>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <LangSwitch />
              <Link
                to="/account"
                onClick={close}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("account")}
              </Link>
            </div>
            <Button asChild variant="hero" className="w-full rounded-xl">
              <Link to="/request" onClick={close}>
                {t("request")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Top grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div>
            <img src={logo} alt="YSMED" className="h-12 w-auto sm:h-14" />
            <p className="mt-3 text-sm text-gold">{t("magdy")}</p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Navigation
            </p>
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="w-fit text-muted-foreground transition-colors hover:text-primary"
              >
                {t(n.k)}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Get Started
            </p>
            <Link
              to="/request"
              className="w-fit text-primary transition-colors hover:underline"
            >
              {t("request")} →
            </Link>
            <Link
              to="/contact"
              className="w-fit text-muted-foreground transition-colors hover:text-primary"
            >
              {t("contact")}
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} YSMED for Innovative Solutions. {t("rights")}
        </p>
      </div>
    </footer>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-10 pt-24 sm:pb-14 sm:pt-32">
      <div className="circuit-grid absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="animate-rise text-3xl font-bold sm:text-4xl lg:text-5xl">
          <span className="text-gradient">{title}</span>
        </h1>
        {subtitle && (
          <p className="animate-rise mt-3 max-w-2xl text-base text-muted-foreground sm:mt-4 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20 ${className}`}
    >
      {children}
    </section>
  );
}
