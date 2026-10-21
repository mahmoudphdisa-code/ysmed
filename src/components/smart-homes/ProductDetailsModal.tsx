import { useState, useMemo } from "react";
import {
  X,
  ShoppingCart,
  Heart,
  CheckCircle2,
  Radio,
  Zap,
  Star,
  ShieldCheck,
  Wrench,
  Info,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { SmartProduct, SwitchColor, GangCount, Protocol } from "@/data/smartHomesData";
import { useSmartCart } from "@/hooks/useSmartCart";
import { useSmartWishlist } from "@/hooks/useSmartWishlist";

interface ProductDetailsModalProps {
  product: SmartProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestInstallation?: ((product: SmartProduct) => void) | undefined;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onRequestInstallation,
}: ProductDetailsModalProps) {
  const { lang, tl } = useI18n();
  const { addToCart } = useSmartCart();
  const { isWishlisted, toggleWishlist } = useSmartWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedGang, setSelectedGang] = useState<GangCount>(
    product?.availableGangs?.[0] || 2
  );
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol>(
    product?.protocol || "Wi-Fi"
  );
  const [selectedColor, setSelectedColor] = useState<SwitchColor>(
    product?.availableColors?.[0] || "Black"
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // Active price calculation
  const activePriceInfo = (() => {
    if (product.variants && product.variants.length > 0) {
      const match =
        product.variants.find(
          (v) =>
            (!v.gangCount || v.gangCount === selectedGang) &&
            v.color === selectedColor &&
            v.protocol === selectedProtocol
        ) ||
        product.variants.find((v) => !v.gangCount || v.gangCount === selectedGang) ||
        product.variants[0];

      if (match) {
        const discountPct = match.originalPriceEGP
          ? Math.round(
              ((match.originalPriceEGP - match.priceEGP) / match.originalPriceEGP) * 100
            )
          : null;
        return {
          priceEGP: match.priceEGP,
          originalPriceEGP: match.originalPriceEGP,
          discountPct,
        };
      }
    }

    const discountPct = product.originalPriceEGP
      ? Math.round(
          ((product.originalPriceEGP - product.basePriceEGP) / product.originalPriceEGP) * 100
        )
      : null;

    return {
      priceEGP: product.basePriceEGP,
      originalPriceEGP: product.originalPriceEGP,
      discountPct,
    };
  })();

  const isFav = isWishlisted(product.id);

  const handleAddToCart = () => {
    const variantDescEn = [
      product.availableGangs ? `${selectedGang}-Gang` : null,
      selectedProtocol,
      selectedColor,
    ]
      .filter(Boolean)
      .join(" • ");

    const variantDescAr = [
      product.availableGangs ? `${selectedGang} خط` : null,
      selectedProtocol,
      selectedColor === "Black"
        ? "أسود"
        : selectedColor === "White"
        ? "أبيض"
        : selectedColor === "Gold"
        ? "ذهبي"
        : "رمادي",
    ]
      .filter(Boolean)
      .join(" • ");

    addToCart(
      {
        id: `${product.id}-${selectedGang}-${selectedProtocol}-${selectedColor}`,
        productId: product.id,
        titleEn: product.title.en,
        titleAr: product.title.ar,
        variantLabelEn: variantDescEn,
        variantLabelAr: variantDescAr,
        gangCount: selectedGang,
        protocol: selectedProtocol,
        color: selectedColor,
        priceEGP: activePriceInfo.priceEGP,
        originalPriceEGP: activePriceInfo.originalPriceEGP,
        image: product.images[activeImageIndex] || product.images[0] || "",
        quantity,
      },
      lang
    );
  };

  const colorHex: Record<SwitchColor, string> = {
    Black: "#0f172a",
    White: "#f8fafc",
    Gold: "#FFD000",
    Gray: "#64748b",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto glass glow-border rounded-3xl border-border/80 p-6 sm:p-8">
        <DialogHeader className="sr-only">
          <DialogTitle>{tl(product.title)}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 md:grid-cols-12 items-start text-start">
          {/* ═══════════════════════════════════════════════════════════════════
              LEFT: GALLERY & THUMBNAILS (5 COLS)
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-surface/80">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={tl(product.title)}
                className="h-full w-full object-cover"
              />

              {activePriceInfo.discountPct && activePriceInfo.discountPct > 0 && (
                <span className="absolute top-3 start-3 rounded-full bg-gold px-3 py-0.5 text-xs font-black text-slate-950 shadow-gold">
                  {activePriceInfo.discountPct}% {lang === "ar" ? "خصم خاص" : "OFF"}
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product.id, product.title, lang)}
                className={`absolute top-3 end-3 flex size-9 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
                  isFav
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/50"
                    : "bg-slate-950/70 text-muted-foreground hover:text-white border border-border/60"
                }`}
              >
                <Heart className={`size-4.5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`size-16 shrink-0 overflow-hidden rounded-xl border transition-all ${
                      activeImageIndex === idx
                        ? "border-primary ring-2 ring-primary/40 scale-105"
                        : "border-border/60 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Fast Features Badges */}
            <div className="rounded-2xl bg-surface/60 p-3.5 border border-border/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{lang === "ar" ? "متوفر بالمخزون للتوصيل الفوري في مصر" : "In Stock for Fast Delivery in Egypt"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                <span>{lang === "ar" ? "ضمان استبدال وصيانة رسمي من YSMED" : "Official YSMED Replacement Warranty"}</span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              RIGHT: SPECS, PRICING & CONFIGURATION (7 COLS)
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="md:col-span-7 space-y-5">
            {/* Category & Title */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {tl(product.categoryName)}
                </span>
                <div className="flex items-center gap-1 text-gold text-xs font-bold">
                  <Star className="size-3.5 fill-gold text-gold" />
                  <span>{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="mt-1 text-xl sm:text-2xl font-black text-foreground">
                {tl(product.title)}
              </h2>
            </div>

            {/* Price Banner */}
            <div className="flex items-baseline gap-3 rounded-2xl bg-surface/80 p-4 border border-border/60">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {activePriceInfo.priceEGP.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-primary">
                {lang === "ar" ? "جنيه مصري" : "EGP"}
              </span>

              {activePriceInfo.originalPriceEGP && (
                <span className="text-sm text-muted-foreground line-through ms-2">
                  {activePriceInfo.originalPriceEGP.toLocaleString()} EGP
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {tl(product.description)}
            </p>

            {/* ─── VARIANT SELECTORS ────────────────────────────────────────── */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              {/* Gangs selector */}
              {product.availableGangs && product.availableGangs.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "عدد خطوط المفتاح (Gangs):" : "Number of Gangs:"}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {product.availableGangs.map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGang(g)}
                        className={`rounded-xl py-2 text-xs font-bold border transition-all ${
                          selectedGang === g
                            ? "bg-primary text-background border-primary shadow-glow"
                            : "bg-surface border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {g} {lang === "ar" ? "خط" : "Gang"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Protocol selector */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  {lang === "ar" ? "بروتوكول الاتصال اللاسلكي:" : "Connectivity Protocol:"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Wi-Fi", "Zigbee"] as Protocol[]).map((proto) => (
                    <button
                      key={proto}
                      onClick={() => setSelectedProtocol(proto)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold border transition-all ${
                        selectedProtocol === proto
                          ? "bg-primary/20 text-primary border-primary"
                          : "bg-surface border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {proto === "Zigbee" ? <Radio className="size-3.5" /> : <Zap className="size-3.5" />}
                      <span>{proto}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color swatches */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "اللون والتصميم الخارجي:" : "Finish / Color:"}
                  </label>
                  <div className="flex items-center gap-2">
                    {product.availableColors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border text-xs font-medium transition-all ${
                          selectedColor === col
                            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                            : "border-border bg-surface text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span
                          className="size-3 rounded-full border border-white/20"
                          style={{ backgroundColor: colorHex[col] }}
                        />
                        <span>{col}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key Features Bullets */}
            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <span className="text-xs font-bold text-foreground block mb-1">
                {lang === "ar" ? "أهم المميزات الهندسية:" : "Key Technical Features:"}
              </span>
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{tl(feat)}</span>
                </div>
              ))}
            </div>

            {/* Specifications Table */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <span className="text-xs font-bold text-foreground block">
                {lang === "ar" ? "المواصفات الفنية ومتطلبات التركيب:" : "Technical Specifications:"}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-surface/50 p-2.5 border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "الجهد الكهربائي" : "Voltage"}</span>
                  <span className="font-semibold text-foreground">{product.specs.voltage}</span>
                </div>
                <div className="rounded-xl bg-surface/50 p-2.5 border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "متطلب سلك النيوترال" : "Neutral Wire"}</span>
                  <span className="font-semibold text-foreground">
                    {typeof product.specs.neutralWireRequired === "boolean"
                      ? product.specs.neutralWireRequired
                        ? lang === "ar" ? "يتطلب نيوترال" : "Required"
                        : lang === "ar" ? "بدون نيوترال" : "No-Neutral Supported"
                      : product.specs.neutralWireRequired}
                  </span>
                </div>
                <div className="rounded-xl bg-surface/50 p-2.5 border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "التحكم الصوتي" : "Voice Assistants"}</span>
                  <span className="font-semibold text-foreground">{product.specs.voiceCompatibility.join(", ")}</span>
                </div>
                <div className="rounded-xl bg-surface/50 p-2.5 border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "تطبيق التحكم" : "Mobile App"}</span>
                  <span className="font-semibold text-foreground">{product.specs.appControl}</span>
                </div>
              </div>
            </div>

            {/* ─── ACTION BUTTONS: CART & INSTALLATION ───────────────────────── */}
            <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center rounded-xl border border-border bg-surface px-2 py-1 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="size-7 rounded-lg text-muted-foreground hover:text-foreground font-bold"
                >
                  -
                </button>
                <span className="px-3 font-bold text-sm text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="size-7 rounded-lg text-muted-foreground hover:text-foreground font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <Button
                onClick={() => {
                  handleAddToCart();
                  onClose();
                }}
                variant="hero"
                size="lg"
                className="rounded-xl w-full sm:flex-1 font-bold shadow-glow flex items-center justify-center gap-2"
              >
                <ShoppingCart className="size-4" />
                <span>
                  {lang === "ar"
                    ? `أضف للسلة (${(activePriceInfo.priceEGP * quantity).toLocaleString()} ج.م)`
                    : `Add to Cart (${(activePriceInfo.priceEGP * quantity).toLocaleString()} EGP)`}
                </span>
              </Button>

              {/* Request Installation Quote Button */}
              <Button
                onClick={() => {
                  onClose();
                  if (onRequestInstallation) {
                    onRequestInstallation(product);
                  } else {
                    const el = document.getElementById("quote");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                variant="gold"
                size="lg"
                className="rounded-xl w-full sm:w-auto font-bold shadow-gold flex items-center justify-center gap-2"
              >
                <Wrench className="size-4" />
                <span>{lang === "ar" ? "طلب تركيب" : "Install"}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
