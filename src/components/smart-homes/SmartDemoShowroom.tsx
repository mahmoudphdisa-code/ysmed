import { useState } from "react";
import {
  Sun,
  Tv,
  ShieldCheck,
  Moon,
  Sparkles,
  Lightbulb,
  Blinds,
  ThermometerSnowflake,
  Volume2,
  Lock,
  Play,
  RotateCcw,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

type DemoScenario = "morning" | "movie" | "away" | "welcome";

export function SmartDemoShowroom() {
  const { lang } = useI18n();
  const [activeScenario, setActiveScenario] = useState<DemoScenario>("welcome");

  const scenarios: Record<
    DemoScenario,
    {
      titleEn: string;
      titleAr: string;
      subtitleEn: string;
      subtitleAr: string;
      lightingEn: string;
      lightingAr: string;
      curtainState: "open" | "closed";
      acTemp: string;
      securityStateEn: string;
      securityStateAr: string;
      audioStateEn: string;
      audioStateAr: string;
      image: string;
      ambientGlow: string;
    }
  > = {
    morning: {
      titleEn: "Good Morning Scene",
      titleAr: "سيناريو صباح الخير",
      subtitleEn: "Wake up naturally with gentle sunrise illumination and opening curtains",
      subtitleAr: "استيقظ بنشاط مع ضوء الشروق التدريجي وفتح الستائر التلقائي",
      lightingEn: "Warm White 100% Brightness",
      lightingAr: "أبيض دافئ سطوع 100%",
      curtainState: "open",
      acTemp: "24°C Comfort",
      securityStateEn: "Perimeter Disarmed",
      securityStateAr: "حماية الأسوار معطلة",
      audioStateEn: "Morning News / Ambient Radio",
      audioStateAr: "الإذاعة الصباحية والأذكار",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
      ambientGlow: "rgba(253, 224, 71, 0.45)",
    },
    movie: {
      titleEn: "Movie & Cinema Night",
      titleAr: "سيناريو سهرة السينما",
      subtitleEn: "Lights dim to deep cyan, curtains seal out ambient light, sound centers",
      subtitleAr: "خفت الأضواء لدرجة السينما، غلق تام للستائر، وتشغيل الصوت المحيطي",
      lightingEn: "Cyber Cyan Dimmed (15%)",
      lightingAr: "أزرق سماوي خافت (15%)",
      curtainState: "closed",
      acTemp: "21°C Cool",
      securityStateEn: "Exterior Cameras Active",
      securityStateAr: "كاميرات المحيط الخارجي نشطة",
      audioStateEn: "Surround Cinema 5.1",
      audioStateAr: "صوت سينمائي محيطي 5.1",
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80",
      ambientGlow: "rgba(4, 184, 244, 0.5)",
    },
    away: {
      titleEn: "Away & Vacation Mode",
      titleAr: "سيناريو مغادرة المنزل",
      subtitleEn: "All lights and non-essential sockets cut off, full perimeter defense armed",
      subtitleAr: "إطفاء كافة الإضاءات والأجهزة تلقائياً، وتفعيل الإنذار الأمني الشامل",
      lightingEn: "All Lights OFF (Simulated Occupancy)",
      lightingAr: "جميع الأضواء مطفأة (محاكاة وجود عشوائية)",
      curtainState: "closed",
      acTemp: "ECO Mode OFF",
      securityStateEn: "ARMED — Siren & Sensors Active",
      securityStateAr: "المنظومة مفعلة — المستشعرات نشطة",
      audioStateEn: "Muted / Silent",
      audioStateAr: "صامت تماماً",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80",
      ambientGlow: "rgba(239, 68, 68, 0.35)",
    },
    welcome: {
      titleEn: "Welcome Home Scene",
      titleAr: "سيناريو العودة للمنزل",
      subtitleEn: "Pathway lighting illuminates, temperature cools, favorite playlist plays",
      subtitleAr: "إضاءة ترحيبية بالمدخل، تبريد التكييف، وتشغيل الأجواء المفضلة فور الدخول",
      lightingEn: "Golden Luxury Ambiance (70%)",
      lightingAr: "إضاءة ذهبية دافئة فاخرة (70%)",
      curtainState: "open",
      acTemp: "22°C Ideal",
      securityStateEn: "Disarmed via Door Smart Lock",
      securityStateAr: "معطلة تلقائياً بفتح الباب بالبصمة",
      audioStateEn: "Welcome Playlist Streaming",
      audioStateAr: "تشغيل القائمة الصوتية المفضلة",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      ambientGlow: "rgba(255, 208, 0, 0.45)",
    },
  };

  const current = scenarios[activeScenario];

  return (
    <section className="py-16 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface px-4 py-1.5 text-xs font-bold text-primary shadow-glow">
            <Sparkles className="size-3.5 text-gold" />
            <span>{lang === "ar" ? "قوة الأتمتة والسيناريوهات الذكية" : "Experience the Power of Smart Living"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {lang === "ar"
              ? "شاهد كيف يتفاعل منزلك بضغطة زر واحدة"
              : "Witness Intelligent Home Scenes in Action"}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "المنزل الذكي الحقيقي لا يقتصر على فتح وإغلاق لمبة واحدة، بل يربط الإضاءات والستائر والمكيفات والصوتيات والأمان في تجربة معيشية متكاملة بلمسة واحدة أو أمر صوتي."
              : "A true smart home orchestrates lighting, motorized curtains, climate control, multi-room sound, and security into unified, effortless living scenes."}
          </p>
        </div>

        {/* ─── SCENARIO CONTROLS BAR ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
          {[
            { id: "welcome", labelEn: "Welcome Home", labelAr: "العودة للمنزل", icon: Sparkles },
            { id: "movie", labelEn: "Movie Night", labelAr: "سهرة السينما", icon: Tv },
            { id: "morning", labelEn: "Good Morning", labelAr: "صباح الخير", icon: Sun },
            { id: "away", labelEn: "Away / Security", labelAr: "مغادرة المنزل", icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeScenario === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScenario(item.id as DemoScenario)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 rounded-2xl p-3.5 border transition-all text-xs font-bold ${
                  isSelected
                    ? "bg-primary text-background border-primary shadow-glow scale-[1.03]"
                    : "bg-surface/60 border-border text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{lang === "ar" ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* ─── INTERACTIVE ROOM PREVIEW STAGE ───────────────────────────────── */}
        <div className="glass max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 border border-border/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-start">
            {/* Visual Stage Window (7 COLS) */}
            <div className="lg:col-span-7 relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/60 bg-surface">
              <img
                src={current.image}
                alt={current.titleEn}
                className="h-full w-full object-cover transition-all duration-700"
              />

              {/* Dynamic Simulated Color Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-700 mix-blend-screen opacity-65"
                style={{ backgroundColor: current.ambientGlow }}
              />

              {/* Live Status Pill */}
              <div className="absolute top-3 start-3 flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-foreground border border-border/60">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{lang === "ar" ? current.titleAr : current.titleEn}</span>
              </div>
            </div>

            {/* Scenario Breakdown Metrics (5 COLS) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h3 className="text-xl font-black text-foreground">
                  {lang === "ar" ? current.titleAr : current.titleEn}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {lang === "ar" ? current.subtitleAr : current.subtitleEn}
                </p>
              </div>

              {/* 4 Synchronized System States */}
              <div className="space-y-2.5 text-xs">
                {/* Lighting State */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface/70 border border-border/40">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <Lightbulb className="size-4 text-gold shrink-0" />
                    <span>{lang === "ar" ? "نظام الإضاءة:" : "Lighting Status:"}</span>
                  </span>
                  <span className="font-bold text-primary">
                    {lang === "ar" ? current.lightingAr : current.lightingEn}
                  </span>
                </div>

                {/* Curtain State */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface/70 border border-border/40">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <Blinds className="size-4 text-primary shrink-0" />
                    <span>{lang === "ar" ? "الستائر الكهربائية:" : "Motorized Curtains:"}</span>
                  </span>
                  <span className="font-bold text-foreground">
                    {current.curtainState === "open"
                      ? lang === "ar" ? "مفتوحة بالكامل" : "Fully Opened"
                      : lang === "ar" ? "مغلقة بإحكام" : "Fully Closed"}
                  </span>
                </div>

                {/* Climate State */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface/70 border border-border/40">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <ThermometerSnowflake className="size-4 text-cyan-400 shrink-0" />
                    <span>{lang === "ar" ? "التكييف والمناخ:" : "Climate Control:"}</span>
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {current.acTemp}
                  </span>
                </div>

                {/* Security State */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface/70 border border-border/40">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                    <span>{lang === "ar" ? "منظومة الأمان:" : "Security Perimeter:"}</span>
                  </span>
                  <span className="font-bold text-emerald-400">
                    {lang === "ar" ? current.securityStateAr : current.securityStateEn}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" />
                <span>
                  {lang === "ar"
                    ? "يمكن تفعيل هذا السيناريو بضغطة زر جداري، أو أمر صوتي، أو بمجرد وصولك للمنزل."
                    : "Triggerable via wall keypad, Alexa voice command, or geo-location."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
