import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Layout";
import { InquiryForm } from "@/components/site/InquiryForm";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — YSMED" },
      { name: "description", content: "Get in touch with YSMED for Innovative Solutions." },
      { property: "og:title", content: "Contact YSMED" },
      { property: "og:description", content: "Talk to our engineering team." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t("contact")} subtitle={t("ctaText")} />
      <Section className="max-w-3xl pt-0"><InquiryForm /></Section>
    </>
  );
}
