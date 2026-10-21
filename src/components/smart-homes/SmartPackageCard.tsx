import { useState } from "react";
import {
  Package,
  Wrench,
  ShoppingCart,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Eye,
  Star,
  Zap,
  Radio,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { SmartPackage } from "@/data/smartHomesData";
import { useSmartCart } from "@/hooks/useSmartCart";

interface SmartPackageCardProps {
  pkg: SmartPackage;
  onCustomize: (pkg: SmartPackage) => void;
  onViewDetails: (pkg: SmartPackage) => void;
  onRequestQuote: (pkg: SmartPackage) => void;
}

export function SmartPackageCard({
  pkg,
  onCustomize,
  onViewDetails,
  onRequestQuote,
}: SmartPackageCardProps) {
  const { lang, tl } = useI18n();
  const { addToCart } = useSmartCart();

  const handleAddPackageToCart = () => {
    addToCart(
      {
        id: `pkg-${pkg.id}`,
        productId: pkg.id,
        titleEn: `${pkg.name.en} Package`,
        titleAr: `${pkg.name.ar}`,
        variantLabelEn: `${pkg.propertyType.en} • ${pkg.systemType}`,
        variantLabelAr: `${pkg.propertyType.ar} • ${pkg.systemType}`,
        priceEGP: pkg.equipmentPriceEGP,
        originalPriceEGP: pkg.discountPercentage
          ? Math.round(pkg.equipmentPriceEGP / (1 - pkg.discountPercentage / 100))
          : undefined,
        image: pkg.image,
      },
      lang
    );
  };

  return (
    <div
      className={`glass group relative flex flex-col justify-between rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
        pkg.isRecommended
          ? "border-primary/80 bg-surface/50 shadow-glow ring-1 ring-primary/40"
          : "border-border/80 bg-surface/30 hover:border-primary/50 hover:shadow-lg"
      } p-5 sm:p-6`}
    >
      {/* Popular / Recommended Badge */}
      {pkg.isRecommended && (
        <span className="absolute -top-3 start-6 rounded-full bg-primary px-3.5 py-0.5 text-[11px] font-black text-background uppercase tracking-wider shadow-glow">
          {lang === "ar" ? "الأكثر طلباً وموصى بها" : "Most Popular Choice"}
        </span>
      )}

      <div>
        {/* Representative Interior Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface/80 border border-border/50 mb-4">
          <img
            src={pkg.image}
            alt={tl(pkg.name)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Rooms Badge */}
          <span className="absolute top-2.5 start-2.5 flex items-center gap-1.5 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-foreground border border-border/60">
            <Building className="size-3 text-primary" />
            <span>{tl(pkg.propertyType)}</span>
          </span>

          {/* Protocol Badge */}
          <span className="absolute bottom-2.5 start-2.5 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/30">
            {pkg.systemType}
          </span>

          {/* Discount Tag */}
          {pkg.discountPercentage && (
            <span className="absolute top-2.5 end-2.5 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-black text-slate-950 shadow-gold">
              {pkg.discountPercentage}% {lang === "ar" ? "وفر" : "SAVE"}
            </span>
          )}
        </div>

        {/* Package Title & Tagline */}
        <div className="text-start">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-foreground">{tl(pkg.name)}</h3>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {pkg.roomsCount} {lang === "ar" ? "غرف / مناطق" : "Zones"}
            </span>
          </div>
          <p className="mt-1 text-xs text-primary font-medium">{tl(pkg.tagline)}</p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {tl(pkg.description)}
          </p>
        </div>

        {/* Included Devices List */}
        <div className="mt-4 pt-3 border-t border-border/40 text-start">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
            {lang === "ar" ? "محتويات باقة الأجهزة:" : "Package Hardware Included:"}
          </span>
          <div className="space-y-1.5">
            {pkg.includedDevices.slice(0, 4).map((dev, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-foreground/90">
                <span className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{tl(dev.name)}</span>
                </span>
                <span className="ms-2 font-mono font-bold text-xs text-primary shrink-0">
                  ×{dev.quantity}
                </span>
              </div>
            ))}
            {pkg.includedDevices.length > 4 && (
              <p
                onClick={() => onViewDetails(pkg)}
                className="text-[11px] text-primary hover:underline cursor-pointer font-semibold pt-1"
              >
                +{pkg.includedDevices.length - 4} {lang === "ar" ? "أجهزة ومستشعرات إضافية (عرض الكل)" : "more devices (view all)"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bottom Pricing & Package Actions ──────────────────────────────── */}
      <div className="mt-6 pt-4 border-t border-border/40 text-start space-y-3">
        {/* Pricing Breakdown */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-muted-foreground block">
              {lang === "ar" ? "تكلفة الأجهزة والمعدات:" : "Equipment Price:"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-foreground">
                {pkg.equipmentPriceEGP.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-primary">
                {lang === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>
          </div>

          <div className="text-end">
            <span className="text-xs text-muted-foreground block">
              {lang === "ar" ? "التركيب والبرمجة:" : "Installation:"}
            </span>
            <span className="text-xs font-semibold text-foreground">
              +{pkg.installationPriceEGP.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
            </span>
          </div>
        </div>

        {/* 4 Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            onClick={() => onCustomize(pkg)}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-bold bg-surface border-border hover:border-primary flex items-center justify-center gap-1.5"
          >
            <Sliders className="size-3.5 text-primary" />
            <span>{lang === "ar" ? "تخصيص الباقة" : "Customize"}</span>
          </Button>

          <Button
            onClick={handleAddPackageToCart}
            variant="hero"
            size="sm"
            className="rounded-xl text-xs font-bold shadow-glow flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="size-3.5" />
            <span>{lang === "ar" ? "أضف للسلة" : "Add to Cart"}</span>
          </Button>

          <Button
            onClick={() => onViewDetails(pkg)}
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Eye className="size-3.5 me-1" />
            <span>{lang === "ar" ? "تفاصيل الباقة" : "View Package"}</span>
          </Button>

          <Button
            onClick={() => onRequestQuote(pkg)}
            variant="gold"
            size="sm"
            className="rounded-xl text-xs font-bold shadow-gold flex items-center justify-center gap-1"
          >
            <Wrench className="size-3.5" />
            <span>{lang === "ar" ? "طلب معاينة" : "Get Quote"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
