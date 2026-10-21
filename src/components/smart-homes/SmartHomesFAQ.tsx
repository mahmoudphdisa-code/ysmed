import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { smartHomeFaqs } from "@/data/smartHomesData";
import { useI18n } from "@/lib/i18n";

export function SmartHomesFAQ() {
  const { lang, tl } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((cur) => (cur === idx ? null : idx));
  };

  return (
    <section className="py-16 border-b border-border/40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface px-4 py-1.5 text-xs font-bold text-primary shadow-glow">
            <HelpCircle className="size-3.5" />
            <span>{lang === "ar" ? "الأسئلة الشائعة والأجوبة الفنية" : "Smart Home FAQ"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {lang === "ar"
              ? "كل ما تحتاج معرفته عن المنازل الذكية"
              : "Frequently Asked Questions About Smart Living"}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "إجابات واضحة وموثوقة من مهندسي YSMED حول التوافق، متطلبات سلك النيوترال، وبوابات التحكم والتركيب."
              : "Clear, factual guidance from YSMED engineers regarding compatibility, neutral wire wiring, and protocols."}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {smartHomeFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`glass rounded-2xl border transition-all duration-300 overflow-hidden text-start ${
                  isOpen
                    ? "border-primary/60 bg-surface/60 shadow-glow"
                    : "border-border/70 bg-surface/30 hover:border-border"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-start gap-4 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {tl(faq.q)}
                  </span>
                  <div
                    className={`size-7 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                      isOpen
                        ? "bg-primary text-background border-primary rotate-180"
                        : "bg-surface border-border text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3 animate-rise">
                    {tl(faq.a)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
