import { useState } from "react";
import {
  Package,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
  ShoppingCart,
  Wrench,
  Building,
  ShieldCheck,
} from "lucide-react";
import { smartPackages, type SmartPackage } from "@/data/smartHomesData";
import { SmartPackageCard } from "./SmartPackageCard";
import { useI18n } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSmartCart } from "@/hooks/useSmartCart";

interface SmartPackageSelectorProps {
  onCustomizePackage: (pkg: SmartPackage) => void;
  onRequestQuotePackage: (pkg: SmartPackage) => void;
}

export function SmartPackageSelector({
  onCustomizePackage,
  onRequestQuotePackage,
}: SmartPackageSelectorProps) {
  const { lang, tl } = useI18n();
  const { addToCart } = useSmartCart();

  const [activeFilter, setActiveFilter] = useState<"all" | "small" | "medium" | "large">("all");
  const [selectedDetailsPkg, setSelectedDetailsPkg] = useState<SmartPackage | null>(null);

  const filteredPackages = smartPackages.filter((p) => {
    if (activeFilter === "small") return p.roomsCount <= 2;
    if (activeFilter === "medium") return p.roomsCount === 3 || p.roomsCount === 4;
    if (activeFilter === "large") return p.roomsCount >= 5;
    return true;
  });

  return (
    <section id="packages" className="py-16 scroll-mt-20 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold shadow-gold">
            <Package className="size-3.5" />
            <span>{lang === "ar" ? "باقات المعيشة الذكية الجاهزة" : "Smart Living Packages"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {lang === "ar"
              ? "اختر باقة المنزل الذكي المثالية لمساحة عقارك"
              : "Choose the Perfect Smart Home Package for Your Space"}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "باقات هندسية متكاملة ومدروسة لتناسب مختلف مساحات الشقق والفيلات. تشمل الأجهزة الأصلية مع إمكانية إضافة التركيب والبرمجة الاحترافية مع خصم خاص على الباقة."
              : "Turnkey engineered packages sized for studios, family apartments, penthouses, and luxury villas. All packages include genuine hardware with optional professional installation."}
          </p>

          {/* Size Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "all", label: lang === "ar" ? "جميع الباقات (7)" : "All Packages (7)" },
              { id: "small", label: lang === "ar" ? "استوديو وغرفة واحدة (1-2)" : "Studio & 1-Bed (1-2 Rooms)" },
              { id: "medium", label: lang === "ar" ? "شقق عائلية (3-4 غرف)" : "Family Flats (3-4 Rooms)" },
              { id: "large", label: lang === "ar" ? "شقق كبرى وفيلات (5+)" : "Large Estates & Villas (5+)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`rounded-full px-4 py-2 text-xs font-bold border transition-all ${
                  activeFilter === f.id
                    ? "bg-primary text-background border-primary shadow-glow scale-105"
                    : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <SmartPackageCard
              key={pkg.id}
              pkg={pkg}
              onCustomize={onCustomizePackage}
              onViewDetails={(p) => setSelectedDetailsPkg(p)}
              onRequestQuote={onRequestQuotePackage}
            />
          ))}
        </div>
      </div>

      {/* ─── PACKAGE FULL DETAILS MODAL ────────────────────────────────────── */}
      <Dialog
        open={!!selectedDetailsPkg}
        onOpenChange={(open) => !open && setSelectedDetailsPkg(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass glow-border rounded-3xl border-border/80 p-6 sm:p-8 text-start">
          {selectedDetailsPkg && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                  <Building className="size-4" />
                  <span>{tl(selectedDetailsPkg.propertyType)}</span>
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-black text-foreground mt-1">
                  {tl(selectedDetailsPkg.name)}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {tl(selectedDetailsPkg.description)}
                </DialogDescription>
              </DialogHeader>

              {/* Price Banner */}
              <div className="flex flex-wrap items-baseline justify-between rounded-2xl bg-surface/80 p-4 border border-border/60 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">
                    {lang === "ar" ? "سعر أجهزة الباقة بعد الخصم:" : "Package Equipment Price:"}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-foreground">
                      {selectedDetailsPkg.equipmentPriceEGP.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {lang === "ar" ? "ج.م" : "EGP"}
                    </span>
                    {selectedDetailsPkg.discountPercentage && (
                      <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-black text-slate-950 ms-2">
                        {selectedDetailsPkg.discountPercentage}% {lang === "ar" ? "خصم الباقة" : "OFF"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-end">
                  <span className="text-xs text-muted-foreground block">
                    {lang === "ar" ? "خدمة التركيب والبرمجة الهندسية:" : "Installation & Commissioning:"}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    +{selectedDetailsPkg.installationPriceEGP.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                  </span>
                </div>
              </div>

              {/* Complete Included Devices List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  {lang === "ar" ? "مكونات وتجهيزات الباقة بالكامل:" : "Full Device Breakdown:"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedDetailsPkg.includedDevices.map((dev, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl bg-surface/50 p-3 border border-border/40"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                        <span className="font-medium text-foreground">{tl(dev.name)}</span>
                      </span>
                      <span className="font-mono font-bold text-xs text-primary bg-surface px-2 py-0.5 rounded-md border border-border">
                        ×{dev.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Features */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  {lang === "ar" ? "السيناريوهات والقدرات المدعومة:" : "Automation Scenarios Included:"}
                </h4>
                <div className="space-y-1.5">
                  {selectedDetailsPkg.mainFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Sparkles className="size-3.5 text-gold shrink-0 mt-0.5" />
                      <span>{tl(feat)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warranty Guarantee */}
              <div className="flex items-center gap-3 rounded-2xl bg-primary/10 border border-primary/20 p-3.5 text-xs">
                <ShieldCheck className="size-5 text-primary shrink-0" />
                <span className="text-foreground">
                  {lang === "ar"
                    ? "تأتي جميع باقات YSMED بضمان معتمد، مع دعم فني مستمر وإمكانية توسيع النظام لاحقاً في أي وقت."
                    : "All YSMED packages include certified warranty, continuous support, and modular future expansion."}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/40">
                <Button
                  onClick={() => {
                    const pkg = selectedDetailsPkg;
                    setSelectedDetailsPkg(null);
                    onCustomizePackage(pkg);
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-xl w-full sm:w-auto text-xs font-bold"
                >
                  <Sliders className="size-3.5 me-1.5 text-primary" />
                  <span>{lang === "ar" ? "تعديل محتويات الباقة" : "Customize Package"}</span>
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      addToCart(
                        {
                          id: `pkg-${selectedDetailsPkg.id}`,
                          productId: selectedDetailsPkg.id,
                          titleEn: `${selectedDetailsPkg.name.en} Package`,
                          titleAr: `${selectedDetailsPkg.name.ar}`,
                          priceEGP: selectedDetailsPkg.equipmentPriceEGP,
                          image: selectedDetailsPkg.image,
                        },
                        lang
                      );
                      setSelectedDetailsPkg(null);
                    }}
                    variant="hero"
                    size="sm"
                    className="rounded-xl flex-1 sm:flex-initial text-xs font-bold shadow-glow"
                  >
                    <ShoppingCart className="size-3.5 me-1.5" />
                    <span>{lang === "ar" ? "أضف الباقة للسلة" : "Add to Cart"}</span>
                  </Button>

                  <Button
                    onClick={() => {
                      const pkg = selectedDetailsPkg;
                      setSelectedDetailsPkg(null);
                      onRequestQuotePackage(pkg);
                    }}
                    variant="gold"
                    size="sm"
                    className="rounded-xl flex-1 sm:flex-initial text-xs font-bold shadow-gold"
                  >
                    <Wrench className="size-3.5 me-1.5" />
                    <span>{lang === "ar" ? "طلب معاينة" : "Get Quote"}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
