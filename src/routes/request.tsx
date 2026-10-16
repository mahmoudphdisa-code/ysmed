import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Layout";
import { InquiryForm } from "@/components/site/InquiryForm";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "Request a Project — YSMED" },
      { name: "description", content: "Describe your project and YSMED engineers will design the right smart solution." },
      { property: "og:title", content: "Request a Project — YSMED" },
      { property: "og:description", content: "Start your smart engineering project with YSMED." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t("request")} subtitle={t("ctaText")} />
      <Section className="max-w-3xl pt-0"><InquiryForm withSector /></Section>
    </>
  );
}
