import {
  Home,
  Building2,
  Hotel,
  Briefcase,
  Factory,
  Store,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  ClipboardList,
  Compass,
  FileCheck,
  Cable,
  Settings,
  Users,
  Headphones,
} from "lucide-react";
import { smartServices } from "@/data/smartHomesData";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const iconMap: Record<string, React.ElementType> = {
  Home,
  Building2,
  Hotel,
  Briefcase,
  Factory,
  Store,
};

export function InstallationServices() {
  const { lang, tl } = useI18n();

  const lifecycleSteps = [
    { num: 1, titleEn: "Consultation", titleAr: "الاستشارة الهندسية", descEn: "Understanding your lifestyle & property goals", descAr: "فهم متطلبات المعيشة وميزانية العميل", icon: ClipboardList },
    { num: 2, titleEn: "Site Survey", titleAr: "المعاينة الميدانية", descEn: "Checking wall boxes, neutral wires & network", descAr: "فحص العلب الجدارية والنيوترال والشبكة", icon: Compass },
    { num: 3, titleEn: "System Design", titleAr: "المخطط الهندسي", descEn: "Custom schematics & device distribution maps", descAr: "تصميم خرائط توزيع المفاتيح والأحمال", icon: FileCheck },
    { num: 4, titleEn: "Hardware Supply", titleAr: "توريد الأجهزة", descEn: "Original certified YSMED equipment & hubs", descAr: "توريد الأجهزة الأصلية بالضمان المعتمد", icon: ShieldCheck },
    { num: 5, titleEn: "Clean Installation", titleAr: "التركيب النظيف", descEn: "Zero wall damage, professional electrical fitting", descAr: "تركيب احترافي بدون تكسير بالدهانات", icon: Cable },
    { num: 6, titleEn: "Scene Programming", titleAr: "البرمجة والربط", descEn: "Automations, schedules & voice setup", descAr: "برمجة السيناريوهات وربط أليكسا وسيري", icon: Settings },
    { num: 7, titleEn: "User Training", titleAr: "التدريب والتسليم", descEn: "Hands-on walkthrough for all family members", descAr: "تدريب العائلة على التطبيق والأوامر الصوتية", icon: Users },
    { num: 8, titleEn: "Ongoing Support", titleAr: "الضمان والدعم", descEn: "Continuous warranty & maintenance service", descAr: "دعم فني مستمر وصيانة معتمدة", icon: Headphones },
  ];

  return (
    <section id="services" className="py-16 scroll-mt-20 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface px-4 py-1.5 text-xs font-bold text-primary shadow-glow">
            <Wrench className="size-3.5 text-gold" />
            <span>{lang === "ar" ? "خدمات التركيب والتكامل الهندسي" : "Turnkey Engineering & Installation"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {lang === "ar"
              ? "نحن لا نبيع أجهزة فقط، بل نجعل عقارك بالكامل ذكياً"
              : "We Don't Just Sell Smart Devices. We Make Your Entire Property Smart."}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "فريق YSMED، إحدى شركات مجدي جروب، يمتلك خبرة هندسية عريقة في توريد وتصميم وتركيب وبرمجة كافة أنظمة المباني الذكية للشقق والفيلات والمشروعات الفندقية والتجارية."
              : "YSMED, a member of Magdy Group, provides comprehensive engineering: from electrical layout design and neutral wire infrastructure planning to device supply, physical installation, and after-sales warranty."}
          </p>
        </div>

        {/* ─── 6 SECTOR SERVICE CARDS ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {smartServices.map((srv) => {
            const Icon = iconMap[srv.icon] || Home;

            return (
              <div
                key={srv.id}
                className="glass rounded-3xl p-6 border border-border/80 bg-surface/30 hover:border-primary/50 hover:shadow-glow transition-all duration-300 text-start flex flex-col justify-between"
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/20 mb-4 shadow-glow">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="text-base font-black text-foreground mb-1.5">
                    {tl(srv.title)}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {tl(srv.description)}
                  </p>

                  <div className="space-y-1.5">
                    {srv.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-foreground/90 font-medium">
                        <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                        <span>{tl(h)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-border/40">
                  <a
                    href="#quote"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>{lang === "ar" ? "طلب استشارة هندسية لهذا القطاع" : "Request Consultation for this sector"}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── 8-STEP LIFECYCLE TIMELINE ────────────────────────────────────── */}
        <div className="glass rounded-3xl p-6 sm:p-10 border border-border/80 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-lg sm:text-xl font-black text-foreground">
              {lang === "ar" ? "منهجية العمل الهندسي لـ YSMED (8 خطوات)" : "Our 8-Step Engineering Methodology"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar"
                ? "من أول مكالمة استشارية حتى تسليم النظام وتدريب أفراد العائلة أو الموظفين."
                : "From initial consultation to clean installation, handover, and ongoing care."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-start">
            {lifecycleSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="rounded-2xl bg-surface/50 p-4 border border-border/40 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary font-black text-xs">
                      {step.num}
                    </div>
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground">
                    {lang === "ar" ? step.titleAr : step.titleEn}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                    {lang === "ar" ? step.descAr : step.descEn}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button
              asChild
              variant="hero"
              size="lg"
              className="rounded-full px-8 font-bold shadow-glow text-sm"
            >
              <a href="#quote">
                <span>{lang === "ar" ? "ابدأ مشروعك الآن — اطلب معاينة" : "Start Your Project — Request Installation"}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
