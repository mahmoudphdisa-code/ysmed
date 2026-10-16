import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { solutions } from "@/data/solutions";

export const Route = createFileRoute("/solutions/$slug")({
  loader: ({ params }) => {
    const s = solutions.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return { slug: s.slug, title: s.title.en, summary: s.summary.en };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — YSMED` },
          { name: "description", content: loaderData.summary },
          { property: "og:title", content: `${loaderData.title} — YSMED` },
          { property: "og:description", content: loaderData.summary },
        ]
      : [{ title: "Unavailable — YSMED" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

function Page() {
  const { slug } = Route.useLoaderData();
  const { tl, t } = useI18n();
  const s = solutions.find((x) => x.slug === slug)!;
  const Icon = s.icon;
  return (
    <>
      <PageHeader title={tl(s.title)} subtitle={tl(s.summary)} />
      <Section className="grid gap-10 pt-0 lg:grid-cols-2">
        <div className="glass overflow-hidden rounded-3xl">
          {s.image ? <img src={s.image} alt="" className="h-full w-full object-cover" /> : <div className="circuit-grid flex aspect-[4/3] items-center justify-center"><Icon className="size-28 text-primary" strokeWidth={1} /></div>}
        </div>
        <div>
          <ul className="grid gap-3">
            {s.items.map((it, i) => (
              <li key={i} className="glass flex items-center gap-3 rounded-xl p-4"><CheckCircle2 className="size-5 shrink-0 text-gold" />{tl(it)}</li>
            ))}
          </ul>
          <Button asChild variant="gold" size="xl" className="mt-8"><Link to="/request">{t("request")}</Link></Button>
        </div>
      </Section>
    </>
  );
}
