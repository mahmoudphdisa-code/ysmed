import { Tag, Sparkles, ArrowRight, ShieldCheck, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function SmartDealsBanner() {
  const { lang } = useI18n();

  return (
    <section className="py-10 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-r from-surface/90 via-surface/60 to-surface/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -end-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -start-20 -bottom-20 size-72 rounded-full bg-gold/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid items-center gap-6 lg:grid-cols-12 text-start">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/30 px-3.5 py-1 text-xs font-black text-gold shadow-gold">
                <Gift className="size-3.5" />
                <span>{lang === "ar" ? "عرض حصري لفترة محدودة" : "Exclusive Limited Promotion"}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-foreground">
                {lang === "ar"
                  ? "خصم حتى 25% على باقات الشقق والفيلات + معاينة هندسية مجانية"
                  : "Up to 25% OFF Smart Home Packages + Free Engineering Site Survey"}
              </h3>

              <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                {lang === "ar"
                  ? "عند طلب أي من باقات المنازل الذكية الجاهزة أو تصميم باقة مخصصة، احصل على خصم فوري على كافة الأجهزة ومستشعرات الأمان، مع معاينة مجانية داخل القاهرة الكبرى والإسكندرية."
                  : "Order any turnkey smart living package today to unlock bundle discounts on all wall switches and biometric locks, plus a complimentary engineering site survey across Greater Cairo and Alexandria."}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Button
                asChild
                variant="gold"
                size="lg"
                className="rounded-full font-bold shadow-gold text-xs sm:text-sm px-6"
              >
                <a href="#packages" className="flex items-center justify-center gap-2">
                  <span>{lang === "ar" ? "تصفح باقات العروض" : "Shop Package Deals"}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full font-semibold text-xs sm:text-sm px-6 bg-surface/80 border-border hover:border-primary"
              >
                <a href="#customizer" className="flex items-center justify-center gap-2">
                  <span>{lang === "ar" ? "صمم باقتك بخصم 18%" : "Custom Package (18% OFF)"}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
