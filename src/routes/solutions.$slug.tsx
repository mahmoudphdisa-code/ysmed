import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, ArrowLeft } from "lucide-react";
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

      {/* Back button */}
      <div className="mx-auto -mt-4 mb-6 max-w-7xl px-4 sm:-mt-6 sm:mb-8 sm:px-6">
        <Button asChild variant="glass" size="sm" className="rounded-full">
          <Link to="/" hash="industries">
            <ArrowLeft className="rtl:rotate-180" /> {t("backToIndustries")}
          </Link>
        </Button>
      </div>

      <Section className="grid gap-8 pt-0 sm:gap-10 lg:grid-cols-2">
        {/* Image / icon */}
        <div className="glass overflow-hidden rounded-3xl">
          {s.image ? (
            <img
              src={s.image}
              alt=""
              className="h-56 w-full object-cover sm:h-72 lg:h-full"
            />
          ) : (
            <div className="circuit-grid flex aspect-video items-center justify-center lg:aspect-[4/3]">
              <Icon className="size-20 text-primary sm:size-28" strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Feature list */}
        <div>
          <ul className="grid gap-2.5 sm:gap-3">
            {s.items.map((it, i) => (
              <li key={i} className="glass flex items-center gap-3 rounded-xl p-3.5 sm:p-4">
                <CheckCircle2 className="size-4 shrink-0 text-gold sm:size-5" />
                <span className="text-sm sm:text-base">{tl(it)}</span>
              </li>
            ))}
          </ul>
          <Button
            asChild
            variant="gold"
            size="xl"
            className="mt-6 w-full sm:mt-8 sm:w-auto"
          >
            <Link to="/request">{t("request")}</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
