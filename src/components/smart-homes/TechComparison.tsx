import { useState } from "react";
import {
  Wifi,
  Radio,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Wrench,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { techComparisons } from "@/data/smartHomesData";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function TechComparison() {
  const { lang, tl } = useI18n();

  return (
    <section className="py-16 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface px-4 py-1.5 text-xs font-bold text-primary shadow-glow">
            <Radio className="size-3.5" />
            <span>{lang === "ar" ? "دليل البروتوكولات الهندسية" : "Technology Architecture Guide"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {lang === "ar"
              ? "مقارنة التقنيات: Wi-Fi مقابل Zigbee مقابل KNX"
              : "Wi-Fi vs Zigbee vs KNX — Which Architecture Fits You?"}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "فهم الفروق التقنية بين بروتوكولات المنازل الذكية يساعدك في بناء منزل مستقر يدوم لسنوات دون مشاكل في الشبكة أو انقطاع الإشارة."
              : "Choosing the right smart home backbone prevents network bottlenecking, extends sensor battery life, and ensures lightning-fast tactile response."}
          </p>
        </div>

        {/* ─── 3 TECHNOLOGY CARDS ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techComparisons.map((tech) => {
            const isZigbee = tech.id === "zigbee";
            const Icon = tech.id === "wifi" ? Wifi : tech.id === "zigbee" ? Radio : Layers;

            return (
              <div
                key={tech.id}
                className={`glass relative flex flex-col justify-between rounded-3xl p-6 border transition-all duration-300 text-start ${
                  isZigbee
                    ? "border-primary bg-surface/60 shadow-glow ring-1 ring-primary/40 -translate-y-1"
                    : "border-border/80 bg-surface/30 hover:border-primary/50"
                }`}
              >
                {isZigbee && (
                  <span className="absolute -top-3 start-6 rounded-full bg-primary px-3.5 py-0.5 text-[10px] font-black text-background uppercase tracking-wider shadow-glow">
                    {lang === "ar" ? "الخيار الأفضل لـ 90% من المنازل" : "Most Recommended Standard"}
                  </span>
                )}

                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/20">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-base text-foreground">{tech.name}</h3>
                        <span className="text-[11px] font-bold text-primary">{tl(tech.badge)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {tl(tech.tagline)}
                  </p>

                  {/* Core Metrics Table */}
                  <div className="rounded-2xl bg-surface/60 p-3.5 border border-border/40 space-y-2 text-xs mb-5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "الهاب / البوابة:" : "Hub Required:"}</span>
                      <span className="font-bold text-foreground">
                        {typeof tech.hubRequired === "boolean"
                          ? tech.hubRequired
                            ? lang === "ar" ? "نعم (بوابة واحدة للمنزل)" : "Yes (1 Hub for home)"
                            : lang === "ar" ? "لا (اتصال مباشر بالراوتر)" : "No (Direct Wi-Fi)"
                          : tl(tech.hubRequired)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "سرعة الاستجابة:" : "Latency:"}</span>
                      <span className="font-bold text-primary">{tl(tech.latency)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "استهلاك الطاقة:" : "Power Draw:"}</span>
                      <span className="font-medium text-foreground">{tl(tech.powerConsumption)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "نوع التغطية:" : "Topology:"}</span>
                      <span className="font-medium text-foreground text-[11px] truncate max-w-[160px]">{tl(tech.rangeMesh)}</span>
                    </div>
                  </div>

                  {/* Pros */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      {lang === "ar" ? "نقاط القوة:" : "Advantages:"}
                    </span>
                    {tech.pros.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tl(p)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cons */}
                  <div className="space-y-1.5 mb-5">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      {lang === "ar" ? "الاعتبارات وحدود الاستخدام:" : "Considerations:"}
                    </span>
                    {tech.cons.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <XCircle className="size-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                        <span>{tl(c)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Recommendation */}
                <div className="pt-3 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground block mb-1">
                    {lang === "ar" ? "العقار والمساحة المناسبة:" : "Best Application:"}
                  </span>
                  <p className="text-xs font-bold text-primary">
                    {tl(tech.idealFor)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Let Experts Help Banner */}
        <div className="mt-10 glass rounded-3xl p-6 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3.5 text-start">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30 shrink-0">
              <Sparkles className="size-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                {lang === "ar" ? "محتار في اختيار البنية المناسبة لعقارك؟" : "Unsure Which Architecture Fits Your Property?"}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "ar"
                  ? "مهندسونا جاهزون لمراجعة مخططك المعماري ومساعدتك في اختيار النظام الأنسب بالمجان."
                  : "Our engineering consultants will review your floor plan and recommend the optimal solution."}
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="hero"
            size="sm"
            className="rounded-xl px-5 text-xs font-bold shadow-glow shrink-0 w-full sm:w-auto"
          >
            <a href="#quote" className="flex items-center gap-1.5">
              <Wrench className="size-3.5" />
              <span>{lang === "ar" ? "دع مهندسينا يساعدونك" : "Let Our Experts Help You"}</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
