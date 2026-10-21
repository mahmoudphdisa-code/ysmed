import { useState, useMemo } from "react";
import {
  Sliders,
  Home,
  Building,
  Building2,
  Hotel,
  Factory,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  Zap,
  Radio,
  Layers,
  Wrench,
  ShoppingCart,
  Send,
  Lightbulb,
  Blinds,
  Mic,
  Lock,
  ShieldAlert,
  ThermometerSnowflake,
  Speaker,
  Tablet,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useSmartCart } from "@/hooks/useSmartCart";
import { toast } from "sonner";
import type { SmartPackage } from "@/data/smartHomesData";

interface PackageCustomizerProps {
  initialPackage?: SmartPackage | null;
  onConsultationRequest?: (customData: any) => void;
}

export function PackageCustomizer({
  initialPackage,
  onConsultationRequest,
}: PackageCustomizerProps) {
  const { lang } = useI18n();
  const { addToCart } = useSmartCart();

  // Wizard Steps (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Property Type
  const [propertyType, setPropertyType] = useState<string>("apartment");

  // Step 2: Rooms & Area
  const [bedrooms, setBedrooms] = useState(3);
  const [livingRooms, setLivingRooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(2);
  const [kitchens, setKitchens] = useState(1);
  const [areaSqm, setAreaSqm] = useState(160);

  // Step 3: Selected Features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "switches",
    "curtains",
    "locks",
    "climate",
    "voice",
  ]);

  // Step 4: Connectivity Preference
  const [connectivity, setConnectivity] = useState<string>("zigbee");

  // Toggle Feature
  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Step 5: Dynamic Equipment & Pricing Calculator
  const calculation = useMemo(() => {
    const totalRooms = bedrooms + livingRooms + bathrooms + kitchens;

    // Device quantities formulas based on rooms and chosen features
    const switchesCount = selectedFeatures.includes("switches")
      ? Math.max(2, bedrooms * 2 + livingRooms * 2 + kitchens + bathrooms)
      : 0;

    const curtainMotorsCount = selectedFeatures.includes("curtains")
      ? Math.max(1, livingRooms + Math.floor(bedrooms / 2))
      : 0;

    const acControllersCount = selectedFeatures.includes("climate")
      ? Math.max(1, bedrooms + livingRooms)
      : 0;

    const smartLocksCount = selectedFeatures.includes("locks") ? 1 : 0;

    const securitySensorsCount = selectedFeatures.includes("security")
      ? Math.max(2, 2 + bedrooms)
      : 0;

    const audioZonesCount = selectedFeatures.includes("audio")
      ? Math.max(1, livingRooms)
      : 0;

    const smartPanelsCount = selectedFeatures.includes("panels")
      ? propertyType === "villa" || propertyType === "duplex"
        ? 2
        : 1
      : 0;

    const smartPlugsCount = selectedFeatures.includes("energy")
      ? Math.max(2, bathrooms + kitchens + 1)
      : 0;

    const hubsRequired =
      connectivity === "zigbee" || connectivity === "hybrid" || connectivity === "recommend"
        ? Math.max(1, Math.ceil(totalRooms / 6))
        : 0;

    // Unit prices in EGP
    const costSwitches = switchesCount * 990;
    const costCurtains = curtainMotorsCount * 3850;
    const costAc = acControllersCount * 950;
    const costLocks = smartLocksCount * 6850;
    const costSecurity = securitySensorsCount * 550;
    const costAudio = audioZonesCount * 4950;
    const costPanels = smartPanelsCount * 9400;
    const costPlugs = smartPlugsCount * 480;
    const costHubs = hubsRequired * 1750;

    const equipmentSubtotal =
      costSwitches +
      costCurtains +
      costAc +
      costLocks +
      costSecurity +
      costAudio +
      costPanels +
      costPlugs +
      costHubs;

    // Installation estimate formula
    const totalDevices =
      switchesCount +
      curtainMotorsCount +
      acControllersCount +
      smartLocksCount +
      securitySensorsCount +
      audioZonesCount +
      smartPanelsCount +
      smartPlugsCount +
      hubsRequired;

    const installationEstimate = Math.max(1500, Math.round(totalDevices * 220));

    // Custom package bundle discount (15% - 20%)
    const bundleDiscount = Math.round(equipmentSubtotal * 0.18);
    const finalEquipmentPrice = Math.max(0, equipmentSubtotal - bundleDiscount);
    const grandTotal = finalEquipmentPrice + installationEstimate;

    return {
      totalRooms,
      totalDevices,
      switchesCount,
      curtainMotorsCount,
      acControllersCount,
      smartLocksCount,
      securitySensorsCount,
      audioZonesCount,
      smartPanelsCount,
      smartPlugsCount,
      hubsRequired,
      equipmentSubtotal,
      bundleDiscount,
      finalEquipmentPrice,
      installationEstimate,
      grandTotal,
    };
  }, [bedrooms, livingRooms, bathrooms, kitchens, areaSqm, selectedFeatures, connectivity, propertyType]);

  const handleAddToCartCustom = () => {
    addToCart(
      {
        id: `custom-pkg-${Date.now()}`,
        productId: `custom-package`,
        titleEn: `Custom Smart Home System (${propertyType.toUpperCase()} - ${calculation.totalRooms} Rooms)`,
        titleAr: `نظام منزلي ذكي مخصص (${calculation.totalRooms} غرف - ${areaSqm}م²)`,
        variantLabelEn: `${connectivity.toUpperCase()} • ${calculation.totalDevices} Devices`,
        variantLabelAr: `${connectivity.toUpperCase()} • ${calculation.totalDevices} جهاز ومستشعر`,
        priceEGP: calculation.finalEquipmentPrice,
        originalPriceEGP: calculation.equipmentSubtotal,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      },
      lang
    );
  };

  const handleRequestConsultation = () => {
    const summaryData = {
      propertyType,
      bedrooms,
      livingRooms,
      bathrooms,
      kitchens,
      areaSqm,
      selectedFeatures,
      connectivity,
      estimatedEquipmentPrice: calculation.finalEquipmentPrice,
      estimatedInstallation: calculation.installationEstimate,
      totalEstimated: calculation.grandTotal,
    };

    if (onConsultationRequest) {
      onConsultationRequest(summaryData);
    } else {
      const el = document.getElementById("quote");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      toast.info(
        lang === "ar"
          ? "تم تجهيز ملخص الباقة المخصصة في نموذج طلب المعاينة أدناه."
          : "Your custom package summary has been transferred to the quote form below."
      );
    }
  };

  return (
    <section id="customizer" className="py-16 scroll-mt-20 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-glow">
            <Sliders className="size-3.5" />
            <span>{lang === "ar" ? "أداة التصميم التفاعلية" : "Build Your Own Smart Home"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {lang === "ar"
              ? "صمم نظام منزلك الذكي خطوة بخطوة"
              : "Design Your Custom Smart Living System"}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "حدد نوع ومساحة عقارك والخصائص الذكية التي ترغب بها، وسيقوم النظام فوراً باحتساب عدد الأجهزة المطلوبة وتقديم تقدير فوري للتكلفة والأجهزة المناسبة."
              : "Select your property size, room counts, and desired automation capabilities. Our interactive engine instantly calculates required devices, gateways, and cost estimates."}
          </p>
        </div>

        {/* ─── 5-STEP WIZARD PROGRESS BAR ─────────────────────────────────── */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { num: 1, labelEn: "Property", labelAr: "نوع العقار" },
              { num: 2, labelEn: "Rooms", labelAr: "الغرف والمساحة" },
              { num: 3, labelEn: "Features", labelAr: "التقنيات المطلوبة" },
              { num: 4, labelEn: "Connectivity", labelAr: "طريقة الاتصال" },
              { num: 5, labelEn: "Summary", labelAr: "المقايسة والملخص" },
            ].map((step) => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={`size-8 sm:size-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all mb-1 ${
                      isCurrent
                        ? "bg-primary text-background ring-4 ring-primary/30 shadow-glow"
                        : isPast
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-surface border border-border text-muted-foreground"
                    }`}
                  >
                    {isPast ? <Check className="size-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold truncate ${
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {lang === "ar" ? step.labelAr : step.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── WIZARD CONTAINER ────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto glass rounded-3xl p-6 sm:p-8 border border-border/80 shadow-2xl backdrop-blur-xl">
          {/* ═════════════════════════════════════════════════════════════════
              STEP 1: PROPERTY TYPE
          ═════════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 text-start animate-rise">
              <div>
                <h3 className="text-lg font-black text-foreground">
                  {lang === "ar" ? "الخطوة 1: اختر نوع العقار" : "Step 1: Select Property Type"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar"
                    ? "يساعدنا نوع العقار في اختيار البروتوكول والشبكة المناسبة لحجم المبنى."
                    : "Property structure determines the ideal wireless mesh protocol and wiring."}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "studio", labelEn: "Studio", labelAr: "استوديو", icon: Home },
                  { id: "apartment", labelEn: "Apartment", labelAr: "شقة سكنية", icon: Building },
                  { id: "duplex", labelEn: "Duplex", labelAr: "دوبلكس", icon: Layers },
                  { id: "villa", labelEn: "Villa / Estate", labelAr: "فيلا / قصر", icon: Building2 },
                  { id: "office", labelEn: "Office", labelAr: "مكتب / شركة", icon: Building },
                  { id: "hotel", labelEn: "Hotel Rooms", labelAr: "فندق / شاليه", icon: Hotel },
                  { id: "factory", labelEn: "Industrial / Factory", labelAr: "مصنع / مستودع", icon: Factory },
                  { id: "other", labelEn: "Commercial / Other", labelAr: "مبنى تجاري آخر", icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = propertyType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPropertyType(item.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center ${
                        isSelected
                          ? "bg-primary/20 border-primary text-primary ring-2 ring-primary/40 shadow-glow scale-[1.02]"
                          : "bg-surface/60 border-border text-muted-foreground hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      <Icon className="size-6 mb-2" />
                      <span className="text-xs font-bold">
                        {lang === "ar" ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button
                  onClick={() => setCurrentStep(2)}
                  variant="hero"
                  size="sm"
                  className="rounded-xl px-6 font-bold shadow-glow"
                >
                  <span>{lang === "ar" ? "التالي: الغرف والمساحة" : "Next: Room Configuration"}</span>
                  <ChevronRight className="size-4 ms-1 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              STEP 2: PROPERTY CONFIGURATION (ROOMS & SQM)
          ═════════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-6 text-start animate-rise">
              <div>
                <h3 className="text-lg font-black text-foreground">
                  {lang === "ar" ? "الخطوة 2: مواصفات وتقسيم الغرف" : "Step 2: Room Configuration"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar"
                    ? "حدد عدد الغرف والمساحة التقديرية بالمتر المربع لاحتساب عدد المفاتيح وأجهزة التكييف."
                    : "Specify the number of rooms and approximate area to size devices and switches accurately."}
                </p>
              </div>

              {/* Room Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bedrooms */}
                <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-3.5 border border-border/50">
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {lang === "ar" ? "غرف النوم (Bedrooms)" : "Bedrooms"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {lang === "ar" ? "تشمل الماستر والأطفال" : "Master & guest bedrooms"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBedrooms((b) => Math.max(1, b - 1))}
                      className="size-8 rounded-lg bg-surface border border-border text-foreground font-bold flex items-center justify-center hover:border-primary"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-primary w-6 text-center">{bedrooms}</span>
                    <button
                      onClick={() => setBedrooms((b) => b + 1)}
                      className="size-8 rounded-lg bg-surface border border-border text-foreground font-bold flex items-center justify-center hover:border-primary"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Living Rooms */}
                <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-3.5 border border-border/50">
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {lang === "ar" ? "الصالون والاستقبال (Living Rooms)" : "Living Rooms & Salons"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {lang === "ar" ? "صالات الاستقبال والمعيشة" : "Reception & dining zones"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLivingRooms((l) => Math.max(1, l - 1))}
                      className="size-8 rounded-lg bg-surface border border-border text-foreground font-bold flex items-center justify-center hover:border-primary"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-primary w-6 text-center">{livingRooms}</span>
                    <button
                      onClick={() => setLivingRooms((l) => l + 1)}
                      className="size-8 rounded-lg bg-surface border border-border text-foreground font-bold flex items-center justify-center hover:border-primary"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-3.5 border border-border/50">
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {lang === "ar" ? "الحمامات (Bathrooms)" : "Bathrooms"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {lang === "ar" ? "تشمل حمام الضيوف والماستر" : "Guest & en-suite bathrooms"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBathrooms((b) => Math.max(1, b - 1))}
                      className="size-8 rounded-lg bg-surface border border-border text-foreground font-bold flex items-center justify-center hover:border-primary"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-primary w-6 text-center">{bathrooms}</span>
                    <button
                      onClick={() => setBathrooms((b) => b + 1)}
                      className="size-8 rounded-lg bg-surface border border-border text-foreground font-bold flex items-center justify-center hover:border-primary"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Kitchens */}
                <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-3.5 border border-border/50">
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {lang === "ar" ? "المطابخ (Kitchens)" : "Kitchens"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {lang === "ar" ? "المطبخ الرئيسي أو الأوفيس" : "Main kitchen & pantry"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setKitchens((k) => Math.max(1, k - 1))}
                      className="size-8 rounded-lg bg-surface border border-border text-foreground font-bold flex items-center justify-center hover:border-primary"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-primary w-6 text-center">{kitchens}</span>
                    <button
                      onClick={() => setKitchens((k) => k + 1)}
                      className="size-8 rounded-lg bg-surface border border-border text-foreground font-bold flex items-center justify-center hover:border-primary"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Area Slider */}
              <div className="rounded-2xl bg-surface/60 p-4 border border-border/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>{lang === "ar" ? "المساحة الإجمالية للعقار تقريباً:" : "Approximate Property Area (m²):"}</span>
                  <span className="text-primary font-mono text-sm">{areaSqm} m²</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="800"
                  step="10"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(parseInt(e.target.value, 10))}
                  className="w-full accent-primary h-2 bg-surface rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>40 m²</span>
                  <span>200 m²</span>
                  <span>450 m²</span>
                  <span>800+ m²</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border/40">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs"
                >
                  <ChevronLeft className="size-4 me-1 rtl:rotate-180" />
                  <span>{lang === "ar" ? "السابق" : "Previous"}</span>
                </Button>

                <Button
                  onClick={() => setCurrentStep(3)}
                  variant="hero"
                  size="sm"
                  className="rounded-xl px-6 font-bold shadow-glow"
                >
                  <span>{lang === "ar" ? "التالي: التقنيات المطلوبة" : "Next: Smart Features"}</span>
                  <ChevronRight className="size-4 ms-1 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              STEP 3: SMART FEATURES SELECTION
          ═════════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 text-start animate-rise">
              <div>
                <h3 className="text-lg font-black text-foreground">
                  {lang === "ar" ? "الخطوة 3: اختر الأنظمة الذكية المرغوبة" : "Step 3: Select Smart Features"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar"
                    ? "اختر ما ترغب بأتمتته في منزلك. يمكنك تحديد خيار واحد أو دمج كافة الأنظمة معاً."
                    : "Choose which systems you want to automate. You can mix and match any combination."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "switches", labelEn: "Smart Lighting & Switches", labelAr: "الإضاءة والمفاتيح الذكية", icon: Lightbulb, desc: "Crystal glass touch switches" },
                  { id: "curtains", labelEn: "Motorized Curtains", labelAr: "الستائر الكهربائية الذكية", icon: Blinds, desc: "Whisper-quiet curtain motors" },
                  { id: "locks", labelEn: "Biometric Smart Door Lock", labelAr: "قفل الأبواب الذكي بالبصمة", icon: Lock, desc: "Face, fingerprint & video intercom" },
                  { id: "climate", labelEn: "Smart AC & Climate Control", labelAr: "التحكم بالتكييف والمناخ", icon: ThermometerSnowflake, desc: "Pre-cooling & energy saving" },
                  { id: "security", labelEn: "Sensors & Siren Security", labelAr: "مستشعرات الأمان وصفارة الإنذار", icon: ShieldAlert, desc: "Door, window & motion detection" },
                  { id: "voice", labelEn: "Voice Assistant Integration", labelAr: "المساعد الصوتي (أليكسا/جوجل)", icon: Mic, desc: "Hands-free voice automation" },
                  { id: "audio", labelEn: "In-Ceiling Multi-Room Audio", labelAr: "الأنظمة الصوتية بالسقف", icon: Speaker, desc: "Hi-Fi audio in every room" },
                  { id: "panels", labelEn: "Wall Touch Control Console", labelAr: "شاشة تحكم جدارية ذكية 10\"", icon: Tablet, desc: "Central IPS command center" },
                  { id: "energy", labelEn: "Energy Meters & Heavy Plugs", labelAr: "المقابس ومراقبة الطاقة", icon: Zap, desc: "16A plugs & heater automation" },
                ].map((feat) => {
                  const Icon = feat.icon;
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`flex items-start gap-3 rounded-2xl p-4 border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-primary/15 border-primary text-foreground shadow-glow"
                          : "bg-surface/50 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`size-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                          isChecked
                            ? "bg-primary border-primary text-background"
                            : "border-border bg-surface"
                        }`}
                      >
                        {isChecked && <Check className="size-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon className={`size-4 ${isChecked ? "text-primary" : "text-muted-foreground"}`} />
                          <h4 className="font-bold text-xs text-foreground truncate">
                            {lang === "ar" ? feat.labelAr : feat.labelEn}
                          </h4>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-border/40">
                <Button
                  onClick={() => setCurrentStep(2)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs"
                >
                  <ChevronLeft className="size-4 me-1 rtl:rotate-180" />
                  <span>{lang === "ar" ? "السابق" : "Previous"}</span>
                </Button>

                <Button
                  onClick={() => setCurrentStep(4)}
                  variant="hero"
                  size="sm"
                  className="rounded-xl px-6 font-bold shadow-glow"
                >
                  <span>{lang === "ar" ? "التالي: بروتوكول الاتصال" : "Next: Connectivity"}</span>
                  <ChevronRight className="size-4 ms-1 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              STEP 4: CONNECTIVITY PREFERENCE
          ═════════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-6 text-start animate-rise">
              <div>
                <h3 className="text-lg font-black text-foreground">
                  {lang === "ar" ? "الخطوة 4: اختر تقنية الاتصال المفضلة" : "Step 4: Connectivity Preference"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar"
                    ? "اختر البروتوكول اللاسلكي الذي تفضله أو دع فريق YSMED يختار الأنسب لمساحة عقارك."
                    : "Choose your preferred protocol or let YSMED engineers recommend the best architecture."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: "zigbee",
                    name: "Zigbee 3.0 Ultra-Mesh (Recommended)",
                    nameAr: "زيجبي 3.0 ميش (الموصى به لـ 90% من المنازل)",
                    badge: "Best Performance",
                    desc: "Ultra-low latency, zero Wi-Fi congestion, runs locally without internet.",
                    descAr: "سرعة فائقة، لا يثقل راوتر الواي فاي، ويعمل محلياً حتى دون إنترنت.",
                  },
                  {
                    id: "hybrid",
                    name: "Hybrid Wi-Fi + Zigbee",
                    nameAr: "نظام هجين (واي فاي + زيجبي)",
                    badge: "Maximum Flexibility",
                    desc: "Direct Wi-Fi for cameras/panels, Zigbee for wall switches and sensors.",
                    descAr: "واي فاي للكاميرات والشاشات، وزيجبي للمفاتيح والمستشعرات لتحقيق أقصى استقرار.",
                  },
                  {
                    id: "wifi",
                    name: "Direct Wi-Fi Only",
                    nameAr: "واي فاي مباشر (بدون هاب)",
                    badge: "Budget Friendly",
                    desc: "No gateway hub required, economical for studios and small apartments.",
                    descAr: "لا يحتاج هاب مستقل، ومناسب جداً للشقق الصغيرة والاستوديوهات.",
                  },
                  {
                    id: "knx",
                    name: "Professional Wired / KNX",
                    nameAr: "النظام السلكي KNX الفاخر",
                    badge: "Villas & Hotels",
                    desc: "Industrial bus wiring for villas under finishing and commercial buildings.",
                    descAr: "تمديد كابلات مخصصة للفيلات تحت التشطيب والفنادق بأعلى اعتمادية عالمية.",
                  },
                ].map((item) => {
                  const isSelected = connectivity === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setConnectivity(item.id)}
                      className={`rounded-2xl p-4 border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary/15 border-primary text-foreground shadow-glow ring-1 ring-primary"
                          : "bg-surface/50 border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-foreground">
                          {lang === "ar" ? item.nameAr : item.name}
                        </span>
                        <span className="text-[10px] font-bold rounded-full bg-primary/20 text-primary px-2 py-0.5">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {lang === "ar" ? item.descAr : item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-border/40">
                <Button
                  onClick={() => setCurrentStep(3)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs"
                >
                  <ChevronLeft className="size-4 me-1 rtl:rotate-180" />
                  <span>{lang === "ar" ? "السابق" : "Previous"}</span>
                </Button>

                <Button
                  onClick={() => setCurrentStep(5)}
                  variant="hero"
                  size="sm"
                  className="rounded-xl px-6 font-bold shadow-glow"
                >
                  <span>{lang === "ar" ? "التالي: عرض المقايسة والملخص" : "Next: View Summary & Price"}</span>
                  <ChevronRight className="size-4 ms-1 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              STEP 5: DYNAMIC SUMMARY & RECOMMENDATION
          ═════════════════════════════════════════════════════════════════ */}
          {currentStep === 5 && (
            <div className="space-y-6 text-start animate-rise">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div>
                  <h3 className="text-lg font-black text-foreground">
                    {lang === "ar" ? "الخطوة 5: ملخص باقتك المخصصة والمقايسة" : "Step 5: Custom System Specification"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "ar"
                      ? "تم حساب عدد الأجهزة والشبكة المطلوبة وفقاً لمساحة عقارك والخصائص المحددة."
                      : "Devices and network topology dynamically sized for your property."}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold">
                  {calculation.totalDevices} {lang === "ar" ? "أجهزة ومستشعرات" : "Smart Units"}
                </span>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="rounded-xl bg-surface/60 p-3 border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "نوع العقار" : "Property"}</span>
                  <span className="font-bold text-foreground capitalize">{propertyType} ({areaSqm} m²)</span>
                </div>
                <div className="rounded-xl bg-surface/60 p-3 border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "إجمالي الغرف" : "Rooms"}</span>
                  <span className="font-bold text-foreground">{calculation.totalRooms} {lang === "ar" ? "غرفة ومنطقة" : "Zones"}</span>
                </div>
                <div className="rounded-xl bg-surface/60 p-3 border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "بروتوكول الشبكة" : "Protocol"}</span>
                  <span className="font-bold text-primary uppercase">{connectivity}</span>
                </div>
                <div className="rounded-xl bg-surface/60 p-3 border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "بوابات التحكم" : "Gateways"}</span>
                  <span className="font-bold text-foreground">{calculation.hubsRequired} {lang === "ar" ? "بوابة مركزية" : "Hubs"}</span>
                </div>
              </div>

              {/* Recommended Equipment Breakdown List */}
              <div className="rounded-2xl bg-surface/40 p-4 border border-border/50 space-y-2.5">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                  {lang === "ar" ? "قائمة الأجهزة المقترحة لباقة منزلك:" : "Calculated Equipment List:"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {calculation.switchesCount > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/30">
                      <span>{lang === "ar" ? "مفاتيح زجاجية ذكية (2/3/4 Gang)" : "Smart Crystal Wall Switches"}</span>
                      <span className="font-mono font-bold text-primary">×{calculation.switchesCount}</span>
                    </div>
                  )}
                  {calculation.curtainMotorsCount > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/30">
                      <span>{lang === "ar" ? "محركات ومجاري ستائر ذكية" : "Motorized Curtain Systems"}</span>
                      <span className="font-mono font-bold text-primary">×{calculation.curtainMotorsCount}</span>
                    </div>
                  )}
                  {calculation.acControllersCount > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/30">
                      <span>{lang === "ar" ? "أجهزة تحكم ذكية بالمكيفات" : "Smart AC Controllers"}</span>
                      <span className="font-mono font-bold text-primary">×{calculation.acControllersCount}</span>
                    </div>
                  )}
                  {calculation.smartLocksCount > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/30">
                      <span>{lang === "ar" ? "قفل باب ذكي ببصمة الوجه والشاشة" : "Biometric Face & Video Smart Lock"}</span>
                      <span className="font-mono font-bold text-primary">×1</span>
                    </div>
                  )}
                  {calculation.securitySensorsCount > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/30">
                      <span>{lang === "ar" ? "مستشعرات أمان وحركة وإنذار" : "Security Contact & Motion Sensors"}</span>
                      <span className="font-mono font-bold text-primary">×{calculation.securitySensorsCount}</span>
                    </div>
                  )}
                  {calculation.audioZonesCount > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/30">
                      <span>{lang === "ar" ? "أنظمة صوتية سقفية ومضخم بلوتوث" : "In-Ceiling Audio Systems"}</span>
                      <span className="font-mono font-bold text-primary">×{calculation.audioZonesCount}</span>
                    </div>
                  )}
                  {calculation.smartPanelsCount > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/30">
                      <span>{lang === "ar" ? "شاشات تحكم جدارية ذكية 10.1 بوصة" : "Wall Touch Control Consoles"}</span>
                      <span className="font-mono font-bold text-primary">×{calculation.smartPanelsCount}</span>
                    </div>
                  )}
                  {calculation.smartPlugsCount > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/30">
                      <span>{lang === "ar" ? "أفياش وقواطع ذكية للأجهزة (16A)" : "Smart Sockets & Plugs (16A)"}</span>
                      <span className="font-mono font-bold text-primary">×{calculation.smartPlugsCount}</span>
                    </div>
                  )}
                  {calculation.hubsRequired > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/30">
                      <span>{lang === "ar" ? "بوابات ربط شبكي زيجبي 3.0" : "Zigbee 3.0 Gateway Hubs"}</span>
                      <span className="font-mono font-bold text-primary">×{calculation.hubsRequired}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Estimate Card */}
              <div className="rounded-3xl bg-surface/90 border border-primary/40 p-5 space-y-3">
                <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                  <span>{lang === "ar" ? "قيمة الأجهزة الأصلية المنفصلة:" : "Equipment Retail Value:"}</span>
                  <span className="line-through">{calculation.equipmentSubtotal.toLocaleString()} EGP</span>
                </div>

                <div className="flex items-baseline justify-between text-xs text-gold font-bold">
                  <span>{lang === "ar" ? "خصم الباقة المخصصة (18%):" : "Custom Package Bundle Discount (18%):"}</span>
                  <span>-{calculation.bundleDiscount.toLocaleString()} EGP</span>
                </div>

                <div className="flex items-baseline justify-between text-sm font-bold text-foreground pt-1 border-t border-border/40">
                  <span>{lang === "ar" ? "سعر أجهزة الباقة بعد الخصم:" : "Equipment Package Price:"}</span>
                  <span className="text-lg font-black text-primary">
                    {calculation.finalEquipmentPrice.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                  <span>{lang === "ar" ? "تقدير خدمة التركيب والبرمجة الهندسية:" : "Estimated Installation & Commissioning:"}</span>
                  <span>+{calculation.installationEstimate.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}</span>
                </div>

                <div className="flex items-baseline justify-between text-base font-black text-foreground pt-2 border-t border-border/60">
                  <span>{lang === "ar" ? "الإجمالي التقديري الشامل:" : "Total Estimated Turnkey Cost:"}</span>
                  <span className="text-xl sm:text-2xl text-gold">
                    {calculation.grandTotal.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/40">
                <Button
                  onClick={() => setCurrentStep(4)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl w-full sm:w-auto text-xs"
                >
                  <ChevronLeft className="size-4 me-1 rtl:rotate-180" />
                  <span>{lang === "ar" ? "تعديل الخيارات" : "Edit Choices"}</span>
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleAddToCartCustom}
                    variant="hero"
                    size="sm"
                    className="rounded-xl flex-1 sm:flex-initial text-xs font-bold shadow-glow flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="size-4" />
                    <span>{lang === "ar" ? "أضف الباقة للسلة" : "Add Package to Cart"}</span>
                  </Button>

                  <Button
                    onClick={handleRequestConsultation}
                    variant="gold"
                    size="sm"
                    className="rounded-xl flex-1 sm:flex-initial text-xs font-bold shadow-gold flex items-center justify-center gap-1.5"
                  >
                    <Wrench className="size-4" />
                    <span>{lang === "ar" ? "طلب استشارة ومعاينة" : "Request Free Consultation"}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
