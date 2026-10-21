import { useState, useMemo } from "react";
import {
  Heart,
  ShoppingCart,
  Eye,
  Check,
  Zap,
  Radio,
  Star,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { SmartProduct, SwitchColor, GangCount, Protocol } from "@/data/smartHomesData";
import { useSmartCart } from "@/hooks/useSmartCart";
import { useSmartWishlist } from "@/hooks/useSmartWishlist";

interface ProductCardProps {
  product: SmartProduct;
  onQuickView: (product: SmartProduct, selectedVariant?: any) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { lang, tl } = useI18n();
  const { addToCart } = useSmartCart();
  const { isWishlisted, toggleWishlist } = useSmartWishlist();

  // Active variant state
  const [selectedGang, setSelectedGang] = useState<GangCount>(
    product.availableGangs?.[0] || 2
  );
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol>(
    product.protocol || "Wi-Fi"
  );
  const [selectedColor, setSelectedColor] = useState<SwitchColor>(
    product.availableColors?.[0] || "Black"
  );

  // Compute active price and discount
  const activePriceInfo = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      const match = product.variants.find(
        (v) =>
          (!v.gangCount || v.gangCount === selectedGang) &&
          v.color === selectedColor &&
          v.protocol === selectedProtocol
      ) || product.variants.find(
        (v) => (!v.gangCount || v.gangCount === selectedGang)
      ) || product.variants[0];

      if (match) {
        const discountPct = match.originalPriceEGP
          ? Math.round(((match.originalPriceEGP - match.priceEGP) / match.originalPriceEGP) * 100)
          : null;
        return {
          priceEGP: match.priceEGP,
          originalPriceEGP: match.originalPriceEGP,
          discountPct,
          variant: match,
        };
      }
    }

    const discountPct = product.originalPriceEGP
      ? Math.round(((product.originalPriceEGP - product.basePriceEGP) / product.originalPriceEGP) * 100)
      : null;

    return {
      priceEGP: product.basePriceEGP,
      originalPriceEGP: product.originalPriceEGP,
      discountPct,
      variant: undefined,
    };
  }, [product, selectedGang, selectedColor, selectedProtocol]);

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
      selectedColor === "Black" ? "أسود" : selectedColor === "White" ? "أبيض" : selectedColor === "Gold" ? "ذهبي" : "رمادي",
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
        image: product.images[0] || "",
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
    <div className="glass group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/40 p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-glow hover:-translate-y-1">
      {/* ─── Top Media & Badges ────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface/80 border border-border/50">
        <img
          src={product.images[0]}
          alt={tl(product.title)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dynamic Discount Badge */}
        {activePriceInfo.discountPct && activePriceInfo.discountPct > 0 && (
          <span className="absolute top-2.5 start-2.5 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-extrabold text-slate-950 shadow-gold">
            {activePriceInfo.discountPct}% {lang === "ar" ? "خصم" : "OFF"}
          </span>
        )}

        {/* Protocol Badge */}
        <span className="absolute bottom-2.5 start-2.5 flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/30">
          {product.protocol === "Zigbee" ? <Radio className="size-3" /> : <Zap className="size-3" />}
          <span>{product.protocol}</span>
        </span>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id, product.title, lang);
          }}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 end-2.5 flex size-8 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
            isFav
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/50"
              : "bg-slate-950/60 text-muted-foreground hover:text-white border border-border/60 hover:bg-slate-950"
          }`}
        >
          <Heart className={`size-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Quick View Button on Image Hover */}
        <button
          onClick={() => onQuickView(product, activePriceInfo.variant)}
          className="absolute inset-x-4 bottom-3 hidden group-hover:flex items-center justify-center gap-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md py-2 text-xs font-semibold text-foreground border border-border/60 shadow-lg hover:border-primary transition-all animate-rise"
        >
          <Eye className="size-3.5 text-primary" />
          <span>{lang === "ar" ? "نظرة سريعة" : "Quick View"}</span>
        </button>
      </div>

      {/* ─── Details Section ──────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="font-medium text-primary/90">{tl(product.categoryName)}</span>
            <div className="flex items-center gap-1 text-gold font-semibold">
              <Star className="size-3 fill-gold text-gold" />
              <span>{product.rating}</span>
              <span className="text-muted-foreground/60 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product, activePriceInfo.variant)}
            className="mt-1.5 font-bold text-sm text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
          >
            {tl(product.title)}
          </h3>

          {/* Short Description */}
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tl(product.description)}
          </p>

          {/* ─── Variant Switchers (For Switches / Configurable items) ──────── */}
          {product.availableGangs && product.availableGangs.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-border/40">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">{lang === "ar" ? "عدد الخطوط:" : "Gangs:"}</span>
                <span className="font-bold text-foreground">{selectedGang} {lang === "ar" ? "خط" : "Gang"}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {product.availableGangs.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGang(g)}
                    className={`rounded-lg py-1 text-[11px] font-bold border transition-all ${
                      selectedGang === g
                        ? "bg-primary text-background border-primary"
                        : "bg-surface/80 border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g}G
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Swatches */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {lang === "ar" ? "اللون:" : "Color:"}
              </span>
              <div className="flex items-center gap-1.5">
                {product.availableColors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    title={col}
                    className={`size-4.5 rounded-full border transition-all ${
                      selectedColor === col ? "ring-2 ring-primary ring-offset-1 ring-offset-surface scale-110" : "opacity-75 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: colorHex[col] }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Bottom Pricing & Add to Cart ─────────────────────────────────── */}
        <div className="mt-4 pt-3 border-t border-border/40">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-base sm:text-lg font-black text-foreground">
                {activePriceInfo.priceEGP.toLocaleString()}
              </span>{" "}
              <span className="text-xs font-semibold text-primary">
                {lang === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>

            {activePriceInfo.originalPriceEGP && (
              <span className="text-xs text-muted-foreground line-through">
                {activePriceInfo.originalPriceEGP.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onQuickView(product, activePriceInfo.variant)}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold bg-surface/70 border-border hover:border-primary"
            >
              {lang === "ar" ? "التفاصيل" : "Details"}
            </Button>

            <Button
              onClick={handleAddToCart}
              variant="hero"
              size="sm"
              className="rounded-xl text-xs font-bold shadow-glow flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="size-3.5" />
              <span>{lang === "ar" ? "أضف للسلة" : "Add to Cart"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
