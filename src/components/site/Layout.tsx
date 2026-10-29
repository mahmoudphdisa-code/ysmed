import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Menu, X, Globe, ChevronRight, ChevronDown, User, Sparkles, GraduationCap, Cpu } from "lucide-react";
import logo from "@/assets/ysmed-logo.png";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const serviceItems = [
  {
    to: "/engineering-services",
    k: "engineeringServices",
    icon: GraduationCap,
    descEn: "Turnkey graduation projects & academic engineering support",
    descAr: "دعم واستشارات هندسية متكاملة لمشاريع التخرج",
    color: "text-primary bg-primary/15",
  },
  {
    to: "/smart-homes",
    k: "smartHomes",
    icon: Sparkles,
    descEn: "Smart living, premium automation & IoT systems",
    descAr: "حلول المنازل الذكية الفاخرة والأتمتة المتقدمة",
    color: "text-gold bg-gold/15",
  },
  {
    to: "/solutions",
    k: "solutions",
    icon: Cpu,
    descEn: "Renewable energy, industry, agriculture & power continuity",
    descAr: "حلول الطاقة والقطاعات الصناعية والزراعية الذكية",
    color: "text-emerald-400 bg-emerald-500/15",
  },
] as const;

const nav = [
  { to: "/", k: "home" },
  { to: "/engineering-services", k: "engineeringServices", isHighlighted: true },
  { to: "/smart-homes", k: "smartHomes", isSpecial: true },
  { to: "/solutions", k: "solutions" },
  { to: "/my-projects", k: "myProjects" },
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
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isServicesActive =
    pathname.startsWith("/engineering-services") ||
    pathname.startsWith("/smart-homes") ||
    pathname.startsWith("/solutions");

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 150);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
    });

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const close = () => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <header className="glass fixed inset-x-0 top-0 z-50 border-x-0 border-t-0">
      {/* Desktop / main bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center" onClick={close}>
          <img src={logo} alt="YSMED" className="h-9 w-auto sm:h-11" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
          >
            {t("home")}
          </Link>

          {/* Services Dropdown (Smooth, Flicker-Free Hover & Click) */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all hover:text-primary outline-none cursor-pointer select-none",
                isServicesActive
                  ? "bg-primary/10 text-primary border border-primary/30 font-bold"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              )}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              <Sparkles className="size-3.5 text-primary" />
              <span>{t("services")}</span>
              <ChevronDown
                className={cn(
                  "size-3.5 text-muted-foreground transition-transform duration-200",
                  servicesOpen && "rotate-180"
                )}
              />
            </button>

            {/* In-tree hover panel with seamless bridge (pt-2) */}
            {servicesOpen && (
              <div className="absolute start-0 top-full pt-2 z-50">
                <div className="w-80 glass border-border/80 bg-background/95 backdrop-blur-xl p-2 rounded-2xl shadow-2xl space-y-1 animate-in fade-in-0 zoom-in-95 duration-150">
                  {serviceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => {
                          setServicesOpen(false);
                          close();
                        }}
                        className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface/80 cursor-pointer outline-none w-full text-start"
                      >
                        <div
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                            item.color
                          )}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="flex flex-col text-start">
                          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {t(item.k as any)}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {lang === "ar" ? item.descAr : item.descEn}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/my-projects"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
          >
            {t("myProjects")}
          </Link>
          <a
            href="/#company-profile"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("companyProfile")}
          </a>
          <Link
            to="/about"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
          >
            {t("about")}
          </Link>
          <Link
            to="/contact"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
          >
            {t("contact")}
          </Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <LangSwitch />
          <Link
            to={hasSession ? "/account" : "/auth"}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <User className="size-4" />
            {hasSession ? t("account") : t("login")}
          </Link>
          <Button asChild variant="hero" size="sm" className="rounded-full px-4">
            <Link to="/engineering-services">{t("request")}</Link>
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
          open ? "max-h-[640px] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6 pt-3">
          {/* Nav links */}
          <nav className="flex flex-col">
            <Link
              to="/"
              onClick={close}
              className="flex items-center justify-between border-b border-border/50 py-3.5 text-base text-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              <span>{t("home")}</span>
              <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
            </Link>

            {/* Mobile Services Accordion */}
            <div className="border-b border-border/50 py-2">
              <button
                type="button"
                onClick={() => setMobileServicesOpen((v) => !v)}
                className="flex w-full items-center justify-between py-2 text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span>{t("services")}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    mobileServicesOpen && "rotate-180"
                  )}
                />
              </button>
              {mobileServicesOpen && (
                <div className="mt-1 flex flex-col gap-1.5 pl-3 rtl:pl-0 rtl:pr-3 border-l-2 rtl:border-l-0 rtl:border-r-2 border-primary/30">
                  {serviceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={close}
                        className="flex items-center justify-between rounded-xl px-2.5 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-primary transition-colors data-[status=active]:text-primary data-[status=active]:font-semibold"
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="size-4 text-primary" />
                          <span>{t(item.k as any)}</span>
                        </span>
                        <ChevronRight className="size-3.5 text-muted-foreground rtl:rotate-180" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              to="/my-projects"
              onClick={close}
              className="flex items-center justify-between border-b border-border/50 py-3.5 text-base text-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              <span>{t("myProjects")}</span>
              <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
            </Link>
            <a
              href="/#company-profile"
              onClick={close}
              className="flex items-center justify-between border-b border-border/50 py-3.5 text-base text-foreground transition-colors hover:text-primary"
            >
              <span>{t("companyProfile")}</span>
              <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
            </a>
            <Link
              to="/about"
              onClick={close}
              className="flex items-center justify-between border-b border-border/50 py-3.5 text-base text-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              <span>{t("about")}</span>
              <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
            </Link>
            <Link
              to="/contact"
              onClick={close}
              className="flex items-center justify-between border-b border-border/50 py-3.5 text-base text-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              <span>{t("contact")}</span>
              <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
            </Link>
          </nav>

          {/* Bottom actions */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <LangSwitch />
              <Link
                to={hasSession ? "/account" : "/auth"}
                onClick={close}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <User className="size-4" />
                {hasSession ? t("account") : t("login")}
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
              to="/engineering-services"
              className="w-fit text-primary font-bold transition-colors hover:underline"
            >
              {t("engineeringServices")} →
            </Link>
            <Link
              to="/my-projects"
              className="w-fit text-muted-foreground transition-colors hover:text-primary"
            >
              {t("myProjects")}
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
