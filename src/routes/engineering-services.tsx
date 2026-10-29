import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Cpu,
  Code2,
  Factory,
  Sparkles,
  Wrench,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Bot,
  Zap,
  ArrowRight,
  Phone,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Filter,
  Eye,
  ExternalLink,
  UploadCloud,
  FileCheck,
  Flame,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  engineeringServices,
  capabilitiesList,
  processTimeline,
  faqList,
  type EngineeringServiceItem,
} from "@/data/engineeringData";
import { ProjectRequestWizard } from "@/components/engineering/ProjectRequestWizard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/engineering-services")({
  head: () => ({
    meta: [
      {
        title: "الخدمات والاستشارات الهندسية والنماذج الأولية — YSMED",
      },
      {
        name: "description",
        content:
          "دعم وتطوير مشاريع التخرج، الهندسة الإلكترونية والأنظمة المدمجة، تطوير البرمجيات، وتصنيع وتجميع النماذج الأولية والأنظمة الذكية.",
      },
      { property: "og:title", content: "Engineering Project Support & Prototyping — YSMED" },
      {
        property: "og:description",
        content:
          "Turn your engineering idea into a functional prototype. Hardware, software, IoT, robotics, and academic project support.",
      },
    ],
  }),
  component: Page,
});

export function Page() {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  // Selected service to pre-populate form
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>("graduation-projects");
  const wizardRef = useRef<HTMLDivElement>(null);

  // Capabilities category filter
  const [activeCapabilityCat, setActiveCapabilityCat] = useState<string>("All");

  // Dynamic Project Showcase state
  const [showcaseProjects, setShowcaseProjects] = useState<any[]>([]);
  const [showcaseCategory, setShowcaseCategory] = useState<string>("All");
  const [loadingShowcase, setLoadingShowcase] = useState(true);

  // FAQ Accordion open index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Jump to wizard
  const scrollToWizard = (serviceSlug?: string) => {
    if (serviceSlug) {
      setSelectedServiceSlug(serviceSlug);
    }
    wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle scroll to submit-request wizard if navigated with hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#submit-request") {
      setTimeout(() => {
        wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, []);

  // Fetch dynamic showcase from Supabase
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("project_showcase" as any)
          .select("*")
          .eq("is_published", true)
          .order("order_index", { ascending: true });

        if (active) {
          if (!error && data && data.length > 0) {
            setShowcaseProjects(data as any[]);
          }
          setLoadingShowcase(false);
        }
      } catch {
        if (active) setLoadingShowcase(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Filtered capabilities
  const filteredCapabilities =
    activeCapabilityCat === "All"
      ? capabilitiesList
      : capabilitiesList.filter((c) => c.category === activeCapabilityCat);

  // Filtered showcase
  const filteredShowcase =
    showcaseCategory === "All"
      ? showcaseProjects
      : showcaseProjects.filter((p) => p.category === showcaseCategory);

  return (
    <div className="relative overflow-hidden pt-16 sm:pt-20">
      {/* Background Circuit Grid & Glow Accents */}
      <div className="circuit-grid fixed inset-0 pointer-events-none opacity-40 z-0" />
      <div className="fixed top-1/4 -start-48 size-96 rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-1/4 -end-48 size-96 rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

      {/* ========================================================
          SECTION A: HERO SECTION
      ======================================================== */}
      <section className="relative z-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left/Main Column: Headings & CTAs */}
            <div className="lg:col-span-7 text-start">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-glow mb-6">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {isAr
                    ? "المنصة الهندسية المتكاملة للحلول والنماذج الأولية"
                    : "Turnkey Engineering Prototyping & Consultation"}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.18]">
                {isAr ? (
                  <>
                    من فكرتك إلى <span className="text-gradient">مشروع حقيقي يعمل</span>
                  </>
                ) : (
                  <>
                    From Your Idea to a <span className="text-gradient">Real Working Project</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {isAr
                  ? "نقدم حلولاً هندسية متكاملة لدعم مشاريع التخرج، وتطوير البرمجيات والأنظمة الإلكترونية، وتصنيع وتجميع النماذج الأولية، بدايةً من الاستشارة الفنية وحتى الاختبار والتشغيل."
                  : "We deliver turnkey engineering solutions: graduation project mentorship, embedded hardware, custom software, PCB manufacturing, and functional prototype fabrication from technical consulting to testing."}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() => scrollToWizard()}
                  className="rounded-xl px-7 py-3 text-base shadow-glow gap-2"
                >
                  <Sparkles className="size-5" />
                  <span>{isAr ? "ابدأ مشروعك الآن" : "Start Your Project Now"}</span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById("services-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-xl px-6 text-base gap-2 border-border/80 hover:bg-surface/80"
                >
                  <span>{isAr ? "استكشف خدماتنا" : "Explore Services"}</span>
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border/50 pt-6 sm:grid-cols-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? "سرية وحماية فكرية 100%" : "100% Confidential"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Cpu className="size-4 text-cyan-400 shrink-0" />
                  <span>{isAr ? "هاردوير وسوفتوير متكامل" : "Hardware & Software"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>{isAr ? "اختبار وفحص قياسي" : "Bench Tested & QA"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MessageSquare className="size-4 text-gold shrink-0" />
                  <span>{isAr ? "متابعة وتواصل مستمر" : "Continuous Support"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Engineering Visual Frame */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="glass glow-border relative overflow-hidden rounded-3xl p-6 sm:p-8">
                  {/* Glowing header bar */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-rose-500/80" />
                      <span className="size-3 rounded-full bg-amber-500/80" />
                      <span className="size-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-xs text-primary font-semibold">
                      YSMED::ENGINEERING_LAB
                    </span>
                  </div>

                  {/* Tech Matrix Card */}
                  <div className="mt-6 space-y-4 font-mono text-xs">
                    <div className="rounded-xl border border-primary/20 bg-surface/80 p-4">
                      <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-2">
                        <span>// ACTIVE SUBSYSTEMS</span>
                        <span className="text-emerald-400">READY</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-foreground font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-primary" />
                          <span>ESP32 / STM32</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-primary" />
                          <span>Multilayer PCB</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-primary" />
                          <span>AI & YOLOv8</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-primary" />
                          <span>Telemetry & IoT</span>
                        </div>
                      </div>
                    </div>

                    {/* Step Card Preview */}
                    <div className="rounded-xl border border-border/80 bg-surface/50 p-4 space-y-2">
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span>// RAPID EXECUTION</span>
                        <span className="text-gold">TURNKEY</span>
                      </div>
                      <p className="text-xs text-foreground font-sans leading-relaxed">
                        {isAr
                          ? "استلم مشروعك مجمعاً، مبرمجاً، ومختبراً مع كود المصدر والمخططات التفصيلية وجاهزاً للعرض الفوري."
                          : "Receive your project fabricated, programmed, and bench-tested with schematics, source code, and live demo."}
                      </p>
                    </div>

                    {/* Interactive Button */}
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => scrollToWizard()}
                      className="w-full rounded-xl gap-2 font-sans font-bold shadow-glow"
                    >
                      <Sparkles className="size-4" />
                      <span>{isAr ? "احصل على استشارة فورية" : "Get Direct Engineering Consultation"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION B: OUR ENGINEERING SERVICES (6 Interactive Cards)
      ======================================================== */}
      <section id="services-section" className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 mb-3">
              {isAr ? "خدماتنا الهندسية المتكاملة" : "Core Engineering Services"}
            </span>
            <h2 className="text-2xl font-bold sm:text-4xl text-foreground">
              {isAr ? "كل ما يلزم مشروعك من الفكرة حتى التشغيل" : "Everything Your Project Needs From Concept to Delivery"}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {isAr
                ? "نوفر الدعم الهندسي المتخصص للطلاب، الباحثين، المبتكرين، والشركات مع ضمان أعلى معايير الجودة والاستقرار."
                : "Dedicated specialized engineering support for students, inventors, researchers, and enterprises."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {engineeringServices.map((service: EngineeringServiceItem) => (
              <div
                key={service.slug}
                className="glass glow-border group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
              >
                <div>
                  {/* Service Image Header with subtle zoom & glass overlay */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/70 bg-surface/80 mb-4 group-hover:border-primary/40 transition-colors">
                    <img
                      src={service.image}
                      alt={isAr ? service.titleAr : service.titleEn}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-black/20 pointer-events-none" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-2.5 start-2.5 flex items-center gap-2">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-background/85 backdrop-blur-md text-primary shadow-glow border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {service.icon === "GraduationCap" && <GraduationCap className="size-4.5" />}
                        {service.icon === "Cpu" && <Cpu className="size-4.5" />}
                        {service.icon === "Code2" && <Code2 className="size-4.5" />}
                        {service.icon === "Factory" && <Factory className="size-4.5" />}
                        {service.icon === "Sparkles" && <Sparkles className="size-4.5" />}
                        {service.icon === "Wrench" && <Wrench className="size-4.5" />}
                      </div>
                    </div>

                    <div className="absolute top-2.5 end-2.5">
                      <span className="rounded-full bg-background/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-gold border border-gold/40 shadow-sm">
                        {service.tags[0]}
                      </span>
                    </div>

                    {/* Highlight in bottom of image */}
                    <div className="absolute bottom-2 start-3 end-3 flex items-center gap-1.5 text-[11px] font-medium text-cyan-300 drop-shadow">
                      <Sparkles className="size-3 shrink-0 text-gold" />
                      <span className="truncate">{isAr ? service.highlightAr : service.highlightEn}</span>
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {isAr ? service.titleAr : service.titleEn}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {isAr ? service.shortDescAr : service.shortDescEn}
                  </p>

                  {/* Features List */}
                  <div className="mt-4 space-y-2 border-t border-border/50 pt-3">
                    {(isAr ? service.featuresAr : service.featuresEn).slice(0, 4).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-5 pt-4 border-t border-border/40">
                  <Button
                    variant="outline"
                    onClick={() => scrollToWizard(service.slug)}
                    className="w-full rounded-xl justify-between border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground group-hover:border-primary transition-all"
                  >
                    <span>{isAr ? "اطلب هذه الخدمة" : "Request This Service"}</span>
                    <ChevronRight className="size-4 rtl:rotate-180" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION C: HOW IT WORKS (Timeline)
      ======================================================== */}
      <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 bg-surface/20 border-y border-border/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 mb-3">
              {isAr ? "خطوات العمل المنظمة" : "Our Proven Process"}
            </span>
            <h2 className="text-2xl font-bold sm:text-4xl text-foreground">
              {isAr ? "كيف نحول فكرتك إلى واقع تشغيلي؟" : "How We Bring Your Idea to Life"}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {isAr
                ? "منهجية هندسية احترافية تضمن لك المتابعة الشفافة والجودة العالية في كل مرحلة."
                : "A structured engineering framework ensuring transparent milestones and peak quality."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {processTimeline.map((step) => (
              <div
                key={step.step}
                className="glass relative flex flex-col justify-between rounded-2xl p-6 border border-border/60 hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 font-mono text-sm font-bold text-primary border border-primary/30">
                      0{step.step}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {isAr ? `المرحلة ${step.step}` : `Phase 0${step.step}`}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {isAr ? step.titleAr : step.titleEn}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {isAr ? step.descAr : step.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION D: OUR CAPABILITIES (12 Tech Categories)
      ======================================================== */}
      <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 mb-3">
              {isAr ? "القدرات والخبرات التكنولوجية" : "Technology Stack & Capabilities"}
            </span>
            <h2 className="text-2xl font-bold sm:text-4xl text-foreground">
              {isAr ? "مجالاتنا التقنية المتخصصة" : "Specialized Engineering Domains"}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {["All", "Hardware", "Software", "Robotics", "IoT", "AI", "Prototyping"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCapabilityCat(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeCapabilityCat === cat
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-surface/60 text-muted-foreground hover:bg-surface hover:text-foreground border border-border/50"
                }`}
              >
                {cat === "All" ? (isAr ? "جميع القدرات" : "All Capabilities") : cat}
              </button>
            ))}
          </div>

          {/* Grid of Capabilities */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCapabilities.map((cap) => (
              <div
                key={cap.id}
                className="glass rounded-2xl p-5 border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      {isAr ? cap.titleAr : cap.titleEn}
                    </h3>
                    <span className="rounded-md bg-surface px-2 py-0.5 text-[10px] text-primary border border-primary/20">
                      {cap.category}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAr ? cap.descAr : cap.descEn}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1 border-t border-border/40 pt-3">
                  {cap.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-surface/80 px-2 py-0.5 text-[10px] text-muted-foreground border border-border/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION E: PROJECT SHOWCASE (Real Supabase Connected)
      ======================================================== */}
      {showcaseProjects.length > 0 && (
        <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 bg-surface/20 border-y border-border/40">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 mb-3">
                {isAr ? "نماذج من المشاريع المنجزة" : "Engineering Showcase"}
              </span>
              <h2 className="text-2xl font-bold sm:text-4xl text-foreground">
                {isAr ? "حلول ونماذج هندسية تم تنفيذها" : "Implemented Systems & Delivered Prototypes"}
              </h2>
            </div>

            {/* Showcase Category Filter */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {["All", "Hardware", "Software", "IoT", "Robotics", "AI"].map((c) => (
                <button
                  key={c}
                  onClick={() => setShowcaseCategory(c)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    showcaseCategory === c
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-surface/60 text-muted-foreground hover:bg-surface hover:text-foreground border border-border/50"
                  }`}
                >
                  {c === "All" ? (isAr ? "جميع المشاريع" : "All Projects") : c}
                </button>
              ))}
            </div>

            {/* Showcase Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredShowcase.map((p) => (
                <div
                  key={p.id}
                  className="glass glow-border rounded-2xl p-6 border border-border/60 hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary border border-primary/25">
                        {p.category}
                      </span>
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" />
                        {isAr ? "مُنفّذ ومُسلّم" : "Delivered & Verified"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground">
                      {isAr ? p.title_ar : p.title_en}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isAr ? p.description_ar : p.description_en}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-border/50 pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(p.technologies || []).map((tech: string) => (
                        <span
                          key={tech}
                          className="rounded-md bg-surface px-2.5 py-1 text-[11px] font-mono text-muted-foreground border border-border/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          ADVANCED PROJECT REQUEST FORM (Wizard Anchor)
      ======================================================== */}
      <section ref={wizardRef} id="submit-request" className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 mb-3">
              {isAr ? "طلب مشروع أو استشارة هندسية" : "Project Request Form"}
            </span>
            <h2 className="text-2xl font-bold sm:text-4xl text-foreground">
              {isAr ? "قدم متطلبات مشروعك وسنبدأ فوراً" : "Submit Your Engineering Requirements"}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-xl mx-auto">
              {isAr
                ? "املأ الخطوات التالية وسيقوم مهندسونا بمراجعة طلبك وإرسال التقييم الفني وعرض السعر."
                : "Complete the guided steps below and our engineers will assess your scope and quote."}
            </p>
          </div>

          <ProjectRequestWizard
            initialServiceSlug={selectedServiceSlug}
            onSuccess={(ref, token) => {
              // Handled by wizard celebration screen
            }}
          />
        </div>
      </section>

      {/* ========================================================
          SECTION F: FREQUENTLY ASKED QUESTIONS (Accordion)
      ======================================================== */}
      <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 bg-surface/20 border-t border-border/40">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 mb-3">
              {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </span>
            <h2 className="text-2xl font-bold sm:text-4xl text-foreground">
              {isAr ? "كل ما تود معرفته عن خدماتنا" : "Common Questions & Clear Answers"}
            </h2>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.id}
                  className="glass rounded-2xl border border-border/60 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-start font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                  >
                    <span>{isAr ? faq.qAr : faq.qEn}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-border/40 px-5 pb-5 pt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isAr ? faq.aAr : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION G: FINAL CALL TO ACTION
      ======================================================== */}
      <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="glass glow-border relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center">
            <div className="mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary border border-primary/25 mb-4">
                <Sparkles className="size-3.5" />
                {isAr ? "فريق هندسي متخصص في انتظارك" : "Engineering Team Ready to Assist"}
              </span>

              <h2 className="text-2xl font-bold sm:text-4xl text-foreground">
                {isAr ? "جاهز لتحويل فكرتك إلى مشروع متكامل؟" : "Ready to Turn Your Idea Into Reality?"}
              </h2>

              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {isAr
                  ? "سواء كنت بحاجة لدعم مشروع تخرج، أو تطوير بوردة إلكترونية، أو برمجة نظام ذكي، نحن هنا لتقديم الحل الأمثل بجودة صناعية."
                  : "Whether you need graduation mentoring, custom electronics, or a full turnkey prototype, we are ready."}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() => scrollToWizard()}
                  className="rounded-xl px-8 shadow-glow text-base gap-2"
                >
                  <Sparkles className="size-5" />
                  <span>{isAr ? "ابدأ مشروعك الآن" : "Submit Your Request"}</span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-xl px-6 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 gap-2"
                >
                  <a
                    href="https://wa.me/201000000000?text=Hello%20YSMED%20Engineering%20Services"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="size-4" />
                    <span>{isAr ? "محادثة واتساب مباشرة" : "WhatsApp Chat"}</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
