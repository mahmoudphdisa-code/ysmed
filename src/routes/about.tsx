import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, ShieldCheck, Network } from "lucide-react";
import { PageHeader, Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — YSMED" },
      { name: "description", content: "YSMED for Innovative Solutions is a Magdy Group company connecting engineering expertise with innovative technology." },
      { property: "og:title", content: "About YSMED" },
      { property: "og:description", content: "A Magdy Group company engineering smarter solutions." },
    ],
  }),
  component: Page,
});

const values = [
  { icon: Lightbulb, en: ["Innovation", "Practical technology that solves real operational problems."], ar: ["الابتكار", "تقنيات عملية تحل مشكلات تشغيلية حقيقية."] },
  { icon: ShieldCheck, en: ["Reliability", "Engineering built for continuity, safety, and long-term support."], ar: ["الموثوقية", "هندسة مبنية للاستمرارية والأمان والدعم طويل المدى."] },
  { icon: Network, en: ["Integration", "One partner from design through installation and monitoring."], ar: ["التكامل", "شريك واحد من التصميم حتى التركيب والمراقبة."] },
];

function Page() {
  const { t, lang } = useI18n();
  return (
    <>
      <PageHeader title={t("about")} subtitle={t("magdy")} />
      <Section className="pt-0">
        <p className="max-w-3xl text-lg leading-relaxed sm:text-xl lg:text-2xl">{t("whoText")}</p>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
          {values.map((v) => {
            const [h, p] = v[lang];
            return (
              <div key={h} className="glass rounded-2xl p-5 sm:p-6">
                <v.icon className="size-7 text-gold sm:size-8" />
                <h3 className="mt-3 text-lg font-semibold sm:mt-4 sm:text-xl">{h}</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{p}</p>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
