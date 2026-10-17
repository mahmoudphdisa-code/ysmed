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
    <Link to="/solutions/$slug" params={{ slug: s.slug }} className="glass group relative flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
      <div className="relative h-40 overflow-hidden bg-surface">
        {s.image ? (
          <img src={s.image} alt="" loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="circuit-grid flex h-full items-center justify-center"><Icon className="size-14 text-primary/70" strokeWidth={1.2} /></div>
        )}
        <div className="bg-fade-up absolute inset-0" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-primary"><Icon className="size-5" /><h3 className="font-semibold text-foreground">{tl(s.title)}</h3></div>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{tl(s.summary)}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">{t("viewSolution")} <ArrowRight className="size-4 rtl:rotate-180" /></span>
      </div>
    </Link>
  );
}

function Index() {
  const { t, tl } = useI18n();
  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        <img src={hero} alt="" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="bg-hero-fade absolute inset-0 rtl:-scale-x-100" />
        <div className="circuit-grid absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div className="max-w-2xl">
            <img src={logo} alt="YSMED" className="animate-rise animate-pulse-glow mb-8 h-24 w-auto" />
            <h1 className="animate-rise text-4xl font-bold leading-tight sm:text-6xl [animation-delay:0.1s]">
              <span className="text-gradient">{t("heroTitle")}</span>
            </h1>
            <p className="animate-rise mt-6 text-lg text-muted-foreground [animation-delay:0.2s]">{t("heroText")}</p>
            <div className="animate-rise mt-9 flex flex-wrap gap-3 [animation-delay:0.3s]">
              <Button asChild variant="hero" size="xl"><Link to="/solutions">{t("explore")}</Link></Button>
              <Button asChild variant="gold" size="xl"><Link to="/request">{t("request")}</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <Section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">{t("whoWeAre")}</p>
          <p className="mt-4 text-2xl leading-relaxed sm:text-3xl">{t("whoText")}</p>
          <Button asChild variant="link" className="mt-4 px-0"><Link to="/about">{t("learnMore")} <ArrowRight className="rtl:rotate-180" /></Link></Button>
        </div>
        <div className="glass glow-border rounded-3xl p-8">
          <div className="grid grid-cols-2 gap-4">
            {solutions.slice(0, 6).map((s) => { const I = s.icon; return (
              <div key={s.slug} className="flex items-center gap-3 rounded-xl bg-surface/60 p-3 text-sm"><I className="size-5 shrink-0 text-primary" />{tl(s.title)}</div>
            ); })}
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold sm:text-4xl">{t("capabilities")}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <div key={i} className="glass group flex items-center gap-4 rounded-2xl p-5 transition-all hover:border-primary/50 hover:shadow-glow">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Cpu className="size-5" /></span>
              <span className="font-medium">{tl(c)}</span>
            </div>
          ))}
        </div>
      </Section>

      <div id="industries" className="scroll-mt-16" />
      <Section>
        <h2 className="text-3xl font-bold sm:text-4xl">{t("industries")}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {solutions.map((s) => <SolutionCard key={s.slug} s={s} />)}
        </div>
      </Section>

      <Section>
        <div className="glass glow-border relative overflow-hidden rounded-3xl p-10 text-center sm:p-16">
          <div className="circuit-grid absolute inset-0" />
          <h2 className="relative text-3xl font-bold sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">{t("ctaText")}</p>
          <Button asChild variant="gold" size="xl" className="relative mt-8"><Link to="/request">{t("request")}</Link></Button>
        </div>
      </Section>
    </>
  );
}
