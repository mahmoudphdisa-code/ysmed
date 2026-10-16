import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { solutions } from "@/data/solutions";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & Portfolio — YSMED" },
      { name: "description", content: "YSMED project portfolio and illustrative solution concepts across smart technology and energy." },
      { property: "og:title", content: "Projects & Portfolio — YSMED" },
      { property: "og:description", content: "Explore YSMED work and solution concepts." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t, tl, lang } = useI18n();
  return (
    <>
      <PageHeader title={t("projects")} subtitle={lang === "ar" ? "ستظهر هنا المشاريع المنفذة فور نشرها. وفي الأسفل تصورات توضيحية لتطبيقات حلولنا." : "Completed projects will appear here as they are published. Below are illustrative concepts of how our solutions are applied."} />
      <Section className="pt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => { const I = s.icon; return (
            <Link key={s.slug} to="/solutions/$slug" params={{ slug: s.slug }} className="glass group overflow-hidden rounded-2xl transition-all hover:border-primary/50 hover:shadow-glow">
              <div className="relative h-44 bg-surface">
                {s.image ? <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="circuit-grid flex h-full items-center justify-center"><I className="size-14 text-primary/70" strokeWidth={1.2} /></div>}
                <span className="absolute start-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">{t("concept")}</span>
              </div>
              <div className="p-5"><h3 className="font-semibold">{tl(s.title)}</h3><p className="mt-2 text-sm text-muted-foreground">{tl(s.summary)}</p></div>
            </Link>
          ); })}
        </div>
      </Section>
    </>
  );
}
