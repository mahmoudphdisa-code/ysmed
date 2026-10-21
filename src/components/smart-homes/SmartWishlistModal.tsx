import {
  Heart,
  ShoppingCart,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSmartWishlist } from "@/hooks/useSmartWishlist";
import { useSmartCart } from "@/hooks/useSmartCart";
import { smartProducts, type SmartProduct } from "@/data/smartHomesData";
import { useI18n } from "@/lib/i18n";

interface SmartWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: SmartProduct) => void;
}

export function SmartWishlistModal({
  isOpen,
  onClose,
  onSelectProduct,
}: SmartWishlistModalProps) {
  const { lang, tl } = useI18n();
  const { wishlistIds, toggleWishlist, clearWishlist } = useSmartWishlist();
  const { addToCart } = useSmartCart();

  const savedProducts = smartProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto glass glow-border rounded-3xl border-border/80 p-6">
        <DialogHeader className="text-start pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="size-5 text-rose-500 fill-rose-500" />
              <DialogTitle className="text-lg font-black text-foreground">
                {lang === "ar" ? "قائمة الأجهزة المفضلة" : "My Wishlist"}
              </DialogTitle>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-400">
                {savedProducts.length}
              </span>
            </div>

            {savedProducts.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                {lang === "ar" ? "مسح القائمة" : "Clear all"}
              </button>
            )}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {lang === "ar"
              ? "الأجهزة التي حفظتها للرجوع إليها لاحقاً أو إضافتها لسلة التسوق"
              : "Saved items to review or quickly transfer into your cart"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {savedProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Heart className="size-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-bold text-foreground">
                {lang === "ar" ? "لا توجد أجهزة مفضلة بعد" : "Your wishlist is empty"}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {lang === "ar"
                  ? "اضغط على أيقونة القلب على أي منتج في الكتالوج لحفظه هنا."
                  : "Tap the heart icon on any device in the catalog to save it here."}
              </p>
              <Button onClick={onClose} variant="outline" size="sm" className="rounded-xl text-xs mt-2">
                {lang === "ar" ? "استكشف الأجهزة" : "Explore Products"}
              </Button>
            </div>
          ) : (
            savedProducts.map((p) => (
              <div
                key={p.id}
                className="glass rounded-2xl p-3.5 border border-border/60 bg-surface/40 flex items-center justify-between gap-3 text-start"
              >
                <img
                  src={p.images[0]}
                  alt={tl(p.title)}
                  className="size-16 rounded-xl object-cover bg-surface border border-border/50 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-foreground truncate">
                    {tl(p.title)}
                  </h4>
                  <p className="text-[11px] text-primary truncate mt-0.5">
                    {tl(p.categoryName)} • {p.protocol}
                  </p>
                  <p className="font-black text-xs text-foreground mt-1">
                    {p.basePriceEGP.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    onClick={() => {
                      addToCart(
                        {
                          id: p.id,
                          productId: p.id,
                          titleEn: p.title.en,
                          titleAr: p.title.ar,
                          priceEGP: p.basePriceEGP,
                          originalPriceEGP: p.originalPriceEGP,
                          image: p.images[0] || "",
                        },
                        lang
                      );
                    }}
                    variant="hero"
                    size="sm"
                    className="rounded-xl text-xs h-8 px-2.5 font-bold shadow-glow flex items-center gap-1"
                  >
                    <ShoppingCart className="size-3.5" />
                    <span className="hidden sm:inline">{lang === "ar" ? "أضف" : "Add"}</span>
                  </Button>

                  <button
                    onClick={() => toggleWishlist(p.id, p.title, lang)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg"
                    aria-label="Remove"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
