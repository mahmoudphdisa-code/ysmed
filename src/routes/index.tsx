import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cpu } from "lucide-react";
import hero from "@/assets/hero.jpg";
import logo from "@/assets/ysmed-logo.png";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { solutions, capabilities } from "@/data/solutions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YSMED for Innovative Solutions — Smart Engineering & Energy" },
      { name: "description", content: "IoT, AI, industrial automation, renewable energy and power protection solutions from YSMED, a Magdy Group company." },
      { property: "og:title", content: "YSMED for Innovative Solutions" },
      { property: "og:description", content: "Engineering smarter solutions for a better future." },
    ],
  }),
  component: Index,
});

export function SolutionCard({ s }: { s: (typeof solutions)[number] }) {
  const { tl, t } = useI18n();
  const Icon = s.icon;
  return (
    <Link
      to="/solutions/$slug"
      params={{ slug: s.slug }}
      className="glass group relative flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
    >
      <div className="relative h-36 overflow-hidden bg-surface sm:h-40">
        {s.image ? (
          <img
            src={s.image}
            alt=""
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="circuit-grid flex h-full items-center justify-center">
            <Icon className="size-12 text-primary/70 sm:size-14" strokeWidth={1.2} />
          </div>
        )}
        <div className="bg-fade-up absolute inset-0" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-2 text-primary">
          <Icon className="size-4 shrink-0 sm:size-5" />
          <h3 className="text-sm font-semibold text-foreground sm:text-base">{tl(s.title)}</h3>
        </div>
        <p className="mt-2 flex-1 text-xs text-muted-foreground sm:text-sm">{tl(s.summary)}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary sm:mt-4 sm:text-sm">
          {t("viewSolution")} <ArrowRight className="size-3 rtl:rotate-180 sm:size-4" />
        </span>
      </div>
    </Link>
  );
}

function Index() {
  const { t, tl } = useI18n();
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-14 sm:pt-16">
        <img
          src={hero}
          alt=""
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-center sm:object-right"
        />
        <div className="bg-hero-fade absolute inset-0 rtl:-scale-x-100" />
        <div className="circuit-grid absolute inset-0" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="max-w-xl sm:max-w-2xl">
            <img
              src={logo}
              alt="YSMED"
              className="animate-rise animate-pulse-glow mb-6 h-16 w-auto sm:mb-8 sm:h-24"
            />
            <h1 className="animate-rise text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl [animation-delay:0.1s]">
              <span className="text-gradient">{t("heroTitle")}</span>
            </h1>
            <p className="animate-rise mt-4 text-base text-muted-foreground sm:mt-6 sm:text-lg [animation-delay:0.2s]">
              {t("heroText")}
            </p>
            <div className="animate-rise mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap [animation-delay:0.3s]">
              <Button asChild variant="hero" size="xl" className="w-full sm:w-auto">
                <Link to="/solutions">{t("explore")}</Link>
              </Button>
              <Button asChild variant="gold" size="xl" className="w-full sm:w-auto">
                <Link to="/request">{t("request")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Who We Are ──────────────────────────────────────────────────── */}
      <Section className="grid items-center gap-8 md:gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold sm:text-sm">
            {t("whoWeAre")}
          </p>
          <p className="mt-3 text-xl leading-relaxed sm:mt-4 sm:text-2xl lg:text-3xl">
            {t("whoText")}
          </p>
          <Button asChild variant="link" className="mt-4 px-0">
            <Link to="/about">
              {t("learnMore")} <ArrowRight className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
        <div className="glass glow-border rounded-3xl p-5 sm:p-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {solutions.slice(0, 6).map((s) => {
              const I = s.icon;
              return (
                <div
                  key={s.slug}
                  className="flex items-center gap-2 rounded-xl bg-surface/60 p-2.5 text-xs sm:gap-3 sm:p-3 sm:text-sm"
                >
                  <I className="size-4 shrink-0 text-primary sm:size-5" />
                  <span className="leading-tight">{tl(s.title)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ─── Capabilities ────────────────────────────────────────────────── */}
      <Section>
        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{t("capabilities")}</h2>
        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <div
              key={i}
              className="glass group flex items-center gap-3 rounded-2xl p-4 transition-all hover:border-primary/50 hover:shadow-glow sm:gap-4 sm:p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:size-11">
                <Cpu className="size-4 sm:size-5" />
              </span>
              <span className="text-sm font-medium sm:text-base">{tl(c)}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Industries ──────────────────────────────────────────────────── */}
      <div id="industries" className="scroll-mt-16" />
      <Section>
        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{t("industries")}</h2>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {solutions.map((s) => (
            <SolutionCard key={s.slug} s={s} />
          ))}
        </div>
      </Section>

      {/* ─── CTA Banner ──────────────────────────────────────────────────── */}
      <Section>
        <div className="glass glow-border relative overflow-hidden rounded-3xl p-8 text-center sm:p-12 lg:p-16">
          <div className="circuit-grid absolute inset-0" />
          <h2 className="relative text-2xl font-bold sm:text-3xl lg:text-4xl">{t("ctaTitle")}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:text-base">
            {t("ctaText")}
          </p>
          <Button asChild variant="gold" size="xl" className="relative mt-6 w-full sm:mt-8 sm:w-auto">
            <Link to="/request">{t("request")}</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
