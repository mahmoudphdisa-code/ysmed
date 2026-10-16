import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { solutions } from "@/data/solutions";
import { SolutionCard } from "./index";

export const Route = createFileRoute("/solutions/")({
  head: () => ({
    meta: [
      { title: "Our Solutions — YSMED" },
      { name: "description", content: "Smart agriculture, industry, healthcare, aquaculture, poultry, solar, wind, smart buildings, stabilizers and UPS." },
      { property: "og:title", content: "Our Solutions — YSMED" },
      { property: "og:description", content: "Ten industries, one integrated engineering partner." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t("solutions")} subtitle={t("whoText")} />
      <Section className="pt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => <SolutionCard key={s.slug} s={s} />)}
        </div>
      </Section>
    </>
  );
}
