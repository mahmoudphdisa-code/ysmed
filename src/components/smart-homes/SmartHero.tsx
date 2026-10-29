import { useState } from "react";
import {
  Sparkles,
  ShoppingBag,
  Package,
  Wrench,
  Sun,
  Moon,
  ShieldCheck,
  Tv,
  Blinds,
  Sliders,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type LightingColor = "cyan" | "warm" | "gold" | "purple";
type SceneMode = "morning" | "movie" | "away" | "welcome";

export function SmartHero() {
  const { lang } = useI18n();

  // Interactive Demonstration State
  const [lightsOn, setLightsOn] = useState(true);
  const [lightColor, setLightColor] = useState<LightingColor>("cyan");
  const [curtainsOpen, setCurtainsOpen] = useState(true);
  const [activeScene, setActiveScene] = useState<SceneMode>("welcome");

  const handleSceneChange = (scene: SceneMode) => {
    setActiveScene(scene);
    if (scene === "morning") {
      setLightsOn(true);
      setLightColor("warm");
      setCurtainsOpen(true);
    } else if (scene === "movie") {
      setLightsOn(true);
      setLightColor("cyan");
      setCurtainsOpen(false);
    } else if (scene === "away") {
      setLightsOn(false);
      setCurtainsOpen(false);
    } else if (scene === "welcome") {
      setLightsOn(true);
      setLightColor("gold");
      setCurtainsOpen(true);
    }
  };

  const colorStyles: Record<LightingColor, { glow: string; text: string; bg: string }> = {
    cyan: {
      glow: "rgba(4, 184, 244, 0.45)",
      text: "text-[#04B8F4]",
      bg: "bg-[#04B8F4]",
    },
    warm: {
      glow: "rgba(255, 215, 140, 0.45)",
      text: "text-amber-300",
      bg: "bg-amber-300",
    },
    gold: {
      glow: "rgba(255, 208, 0, 0.45)",
      text: "text-[#FFD000]",
      bg: "bg-[#FFD000]",
    },
    purple: {
      glow: "rgba(180, 100, 255, 0.45)",
      text: "text-purple-400",
      bg: "bg-purple-400",
    },
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-border/40">
      {/* Background High-Tech Mesh Grid and Controlled Glow */}
      <div className="absolute inset-0 circuit-grid pointer-events-none opacity-40" />
      <div
        className="absolute -top-40 start-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700"
        style={{
          background: lightsOn
            ? `radial-gradient(circle, ${colorStyles[lightColor].glow} 0%, transparent 70%)`
            : "radial-gradient(circle, rgba(17, 29, 48, 0.5) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* ═══════════════════════════════════════════════════════════════════
              LEFT: HEADLINE & ACTIONS (7 COLS)
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6 text-start">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface/80 px-4 py-1.5 backdrop-blur-md shadow-glow">
              <Sparkles className="size-4 text-gold animate-pulse" />
              <span className="text-xs font-semibold tracking-wide uppercase text-foreground">
                {lang === "ar"
                  ? "YSMED Smart Homes — تقنيات المنازل الذكية الفاخرة"
                  : "YSMED Smart Homes — Premium Smart Living Solutions"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
              {lang === "ar" ? (
                <>
                  حوّل مساحتك إلى <span className="text-gradient">عالم ذكي</span> متكامل
                </>
              ) : (
                <>
                  Transform Your Space Into a <span className="text-gradient">Smart World</span>
                </>
              )}
            </h1>

            {/* Supporting Headline */}
            <p className="text-lg font-semibold text-primary sm:text-xl">
              {lang === "ar"
                ? "معيشة ذكية. تحكم سلس. إمكانيات بلا حدود."
                : "Intelligent Living. Seamless Control. Unlimited Possibilities."}
            </p>

            {/* Detailed Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {lang === "ar"
                ? "اكتشف أحدث تقنيات المنازل الذكية من YSMED إحدى شركات مجدي جروب. تحكم في الإضاءة والأمان والتكييف والترفيه والستائر من أي مكان بالعالم. تسوق أحدث الأجهزة الذكية أو دع مهندسينا يصممون وينفذون نظاماً متكاملاً مصمماً خصيصاً لعقارك."
                : "Discover advanced smart home technologies from YSMED, a member of Magdy Group. Control your lighting, security, climate, entertainment, and appliances from anywhere. Shop smart devices or let our specialists design and install a complete intelligent system tailored to your property."}
            </p>

            {/* 3 Prominent Hero Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                variant="hero"
                size="lg"
                className="rounded-full px-6 shadow-glow font-bold text-sm"
              >
                <a href="#catalog" className="flex items-center gap-2">
                  <ShoppingBag className="size-4" />
                  <span>
                    {lang === "ar" ? "استكشف الأجهزة الذكية" : "Explore Smart Products"}
                  </span>
                </a>
              </Button>

              <Button
                asChild
                variant="gold"
                size="lg"
                className="rounded-full px-6 font-bold text-sm shadow-gold"
              >
                <a href="#packages" className="flex items-center gap-2">
                  <Package className="size-4" />
                  <span>
                    {lang === "ar" ? "باقات المنازل الجاهزة" : "Shop Smart Packages"}
                  </span>
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-6 font-semibold text-sm bg-surface/60 border-border hover:border-primary"
              >
                <a href="#quote" className="flex items-center gap-2">
                  <Wrench className="size-4 text-primary" />
                  <span>
                    {lang === "ar" ? "طلب معاينة وتركيب" : "Request Installation"}
                  </span>
                </a>
              </Button>
            </div>

            {/* Key Trust Highlights */}
            <div className="pt-4 border-t border-border/40 grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span className="text-muted-foreground">
                  {lang === "ar" ? "ضمان رسمي ودعم فني" : "Official Warranty & Support"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span className="text-muted-foreground">
                  {lang === "ar" ? "تركيب بدون تكسير" : "No-Masonry Retrofit"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span className="text-muted-foreground">
                  {lang === "ar" ? "توافق مع أليكسا وسيري" : "Alexa & Siri Compatible"}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              RIGHT: INTERACTIVE SMART ROOM DEMO CONSOLE (5 COLS)
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5">
            <div className="glass relative rounded-3xl p-6 border border-border/80 shadow-2xl backdrop-blur-xl glow-border">
              {/* Header with Interactive Demo Disclaimer */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {lang === "ar" ? "محاكي الغرفة التفاعلي" : "Interactive Room Preview"}
                  </span>
                </div>
                <span className="text-[10px] rounded-full bg-surface px-2.5 py-0.5 text-muted-foreground border border-border">
                  {lang === "ar" ? "عرض تفاعلي مباشر" : "Live Simulation"}
                </span>
              </div>

              {/* Virtual Room Graphic Preview with Dynamic Ambient Illumination */}
              <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-surface transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Luxury Smart Living Room"
                  className={`h-full w-full object-cover transition-all duration-700 ${lightsOn ? "brightness-100 contrast-105" : "brightness-[0.35] contrast-90"
                    }`}
                />

                {/* Simulated Ambient Light Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-700 mix-blend-screen"
                  style={{
                    backgroundColor: lightsOn ? colorStyles[lightColor].glow : "transparent",
                    opacity: lightsOn ? 0.6 : 0,
                  }}
                />

                {/* Animated Smart Device Nodes */}
                {lightsOn && (
                  <>
                    {/* Node 1: Wall Switch */}
                    <div className="absolute top-[52%] start-[18%] flex items-center gap-1.5 animate-pulse">
                      <span className="size-2 rounded-full bg-primary shadow-glow" />
                      <span className="rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                        {lang === "ar" ? "مفتاح زجاجي" : "Smart Switch"}
                      </span>
                    </div>

                    {/* Node 2: Smart Curtains */}
                    <div className="absolute top-[28%] end-[16%] flex items-center gap-1.5">
                      <span
                        className={`size-2 rounded-full ${curtainsOpen ? "bg-emerald-400" : "bg-gold"
                          } shadow-glow`}
                      />
                      <span className="rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                        {curtainsOpen
                          ? lang === "ar"
                            ? "الستائر: مفتوحة"
                            : "Curtains: Open"
                          : lang === "ar"
                            ? "الستائر: مغلقة"
                            : "Curtains: Closed"}
                      </span>
                    </div>

                    {/* Node 3: Touch Panel / Climate */}
                    <div className="absolute bottom-[22%] start-[38%] flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-gold shadow-gold" />
                      <span className="rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                        {lang === "ar" ? "التكييف 22°C" : "AC: 22°C Eco"}
                      </span>
                    </div>
                  </>
                )}

                {/* Virtual Curtain Graphic Layer */}
                <div
                  className={`absolute inset-y-0 end-0 bg-slate-900/85 backdrop-blur-sm border-s border-white/20 transition-all duration-700 pointer-events-none flex items-center justify-center ${curtainsOpen ? "w-0 opacity-0" : "w-1/3 opacity-100"
                    }`}
                >
                  <Blinds className="size-6 text-muted-foreground opacity-50" />
                </div>
              </div>

              {/* Interactive Controls Bar */}
              <div className="mt-5 space-y-4">
                {/* 1. Master Lighting & Curtains Toggles */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setLightsOn(!lightsOn)}
                    className={`flex items-center justify-between rounded-2xl p-3 border text-xs font-bold transition-all ${lightsOn
                        ? "bg-primary/15 border-primary/40 text-primary shadow-glow"
                        : "bg-surface/60 border-border text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sun className="size-4" />
                      {lang === "ar" ? "إضاءة الغرفة" : "Room Lights"}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${lightsOn ? "bg-primary text-background" : "bg-surface"
                        }`}
                    >
                      {lightsOn ? (lang === "ar" ? "تشغيل" : "ON") : (lang === "ar" ? "إيقاف" : "OFF")}
                    </span>
                  </button>

                  <button
                    onClick={() => setCurtainsOpen(!curtainsOpen)}
                    className={`flex items-center justify-between rounded-2xl p-3 border text-xs font-bold transition-all ${curtainsOpen
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : "bg-gold/15 border-gold/40 text-gold"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Blinds className="size-4" />
                      {lang === "ar" ? "الستائر الذكية" : "Smart Curtains"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border">
                      {curtainsOpen
                        ? lang === "ar"
                          ? "مفتوحة"
                          : "Open"
                        : lang === "ar"
                          ? "مغلقة"
                          : "Closed"}
                    </span>
                  </button>
                </div>

                {/* 2. Color Temperature Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                    <span>{lang === "ar" ? "لون الإضاءة الذكية:" : "Ambient Light Spectrum:"}</span>
                    <span className="capitalize text-foreground font-semibold">
                      {lightColor}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(["cyan", "warm", "gold", "purple"] as LightingColor[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setLightColor(c);
                          if (!lightsOn) setLightsOn(true);
                        }}
                        className={`h-8 rounded-xl border transition-all flex items-center justify-center gap-1.5 text-[11px] font-semibold ${lightColor === c && lightsOn
                            ? "border-white ring-2 ring-primary/50 shadow-glow"
                            : "border-border/60 hover:border-border"
                          }`}
                        style={{
                          background:
                            c === "cyan"
                              ? "#04B8F4"
                              : c === "warm"
                                ? "#fde047"
                                : c === "gold"
                                  ? "#FFD000"
                                  : "#c084fc",
                          color: "#080D16",
                        }}
                      >
                        {lightColor === c && lightsOn && <CheckCircle2 className="size-3.5" />}
                        <span className="capitalize">{c}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Preset Scene Modes */}
                <div>
                  <div className="text-xs text-muted-foreground mb-1.5 font-medium flex items-center gap-1.5">
                    <Sliders className="size-3.5 text-primary" />
                    <span>{lang === "ar" ? "تجربة السيناريوهات الذكية:" : "Simulate Smart Scenes:"}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[
                      { id: "morning", label: lang === "ar" ? "الصباح" : "Morning", icon: Sun },
                      { id: "movie", label: lang === "ar" ? "سينما" : "Cinema", icon: Tv },
                      { id: "away", label: lang === "ar" ? "خروج" : "Away", icon: ShieldCheck },
                      { id: "welcome", label: lang === "ar" ? "ترحيب" : "Welcome", icon: Moon },
                    ].map((s) => {
                      const Icon = s.icon;
                      const active = activeScene === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleSceneChange(s.id as SceneMode)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-semibold transition-all ${active
                              ? "bg-primary text-background border-primary shadow-glow"
                              : "bg-surface/60 border-border text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          <Icon className="size-3.5 mb-1" />
                          <span>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
