import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  ShoppingCart,
  Heart,
  Sparkles,
  ArrowUp,
  Sliders,
  Wrench,
  Package,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSmartCart } from "@/hooks/useSmartCart";
import { useSmartWishlist } from "@/hooks/useSmartWishlist";
import { SmartHero } from "@/components/smart-homes/SmartHero";
import { SmartDealsBanner } from "@/components/smart-homes/SmartDealsBanner";
import { ProductCatalog } from "@/components/smart-homes/ProductCatalog";
import { SmartDemoShowroom } from "@/components/smart-homes/SmartDemoShowroom";
import { SmartPackageSelector } from "@/components/smart-homes/SmartPackageSelector";
import { PackageCustomizer } from "@/components/smart-homes/PackageCustomizer";
import { InstallationServices } from "@/components/smart-homes/InstallationServices";
import { TechComparison } from "@/components/smart-homes/TechComparison";
import { InstallationQuoteForm } from "@/components/smart-homes/InstallationQuoteForm";
import { SmartHomesFAQ } from "@/components/smart-homes/SmartHomesFAQ";
import { SmartCartDrawer } from "@/components/smart-homes/SmartCartDrawer";
import { SmartWishlistModal } from "@/components/smart-homes/SmartWishlistModal";
import type { SmartProduct, SmartPackage } from "@/data/smartHomesData";

export const Route = createFileRoute("/smart-homes")({
  head: () => ({
    meta: [
      { title: "YSMED Smart Homes — Luxury Smart Living & Turnkey Engineering Solutions" },
      {
        name: "description",
        content:
          "Explore luxury crystal glass switches, biometric door locks, automation consoles, smart home packages, and turnkey engineering installation by YSMED, a Magdy Group company.",
      },
      { property: "og:title", content: "YSMED Smart Homes — Intelligent Living in Egypt" },
      {
        property: "og:description",
        content:
          "Transform your apartment or villa into a smart world. Shop certified smart hardware or request a custom turnkey engineering quote.",
      },
    ],
  }),
  component: SmartHomesPage,
});

function SmartHomesPage() {
  const { lang } = useI18n();
  const { totalItems } = useSmartCart();
  const { wishlistCount } = useSmartWishlist();

  // Drawers and Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [customizerPackage, setCustomizerPackage] = useState<SmartPackage | null>(null);

  // Handlers
  const handleCustomizePackage = useCallback((pkg: SmartPackage) => {
    setCustomizerPackage(pkg);
    const el = document.getElementById("customizer");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleRequestQuotePackage = useCallback((pkg: SmartPackage) => {
    const el = document.getElementById("quote");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleRequestInstallationForProduct = useCallback((product: SmartProduct) => {
    const el = document.getElementById("quote");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-20">
      {/* ─── 1. IMMERSIVE HERO SECTION ───────────────────────────────────────── */}
      <SmartHero />

      {/* ─── 2. PROMOTIONAL DEALS BANNER ─────────────────────────────────────── */}
      <SmartDealsBanner />

      {/* ─── 3. PRODUCT CATALOG (E-COMMERCE BROWSING) ────────────────────────── */}
      <ProductCatalog onRequestInstallation={handleRequestInstallationForProduct} />

      {/* ─── 4. INTERACTIVE DEMO SHOWROOM (SCENE SIMULATOR) ──────────────────── */}
      <SmartDemoShowroom />

      {/* ─── 5. READY-MADE SMART LIVING PACKAGES (APARTMENTS & VILLAS) ───────── */}
      <SmartPackageSelector
        onCustomizePackage={handleCustomizePackage}
        onRequestQuotePackage={handleRequestQuotePackage}
      />

      {/* ─── 6. INTERACTIVE 5-STEP PACKAGE CUSTOMIZER TOOL ──────────────────── */}
      <PackageCustomizer initialPackage={customizerPackage} />

      {/* ─── 7. INSTALLATION SERVICES & ENGINEERING LIFECYCLE ───────────────── */}
      <InstallationServices />

      {/* ─── 8. TECHNOLOGY COMPARISON (WI-FI VS ZIGBEE VS KNX) ───────────────── */}
      <TechComparison />

      {/* ─── 9. CONSULTATION & INSTALLATION QUOTE FORM ───────────────────────── */}
      <InstallationQuoteForm />

      {/* ─── 10. COMPREHENSIVE SMART HOME FAQ ─────────────────────────────────── */}
      <SmartHomesFAQ />

      {/* ═══════════════════════════════════════════════════════════════════════
          FLOATING SHOPPING PILL (CART & WISHLIST QUICK ACCESS)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 end-6 z-40 flex items-center gap-2">
        {/* Wishlist Pill */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="flex size-12 items-center justify-center rounded-full bg-slate-950/90 backdrop-blur-xl border border-border/80 text-foreground shadow-2xl hover:border-rose-500/50 hover:text-rose-400 transition-all active:scale-95 relative"
          aria-label="Open Wishlist"
        >
          <Heart className="size-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -end-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart Pill */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-background font-black text-xs shadow-glow transition-all hover:scale-105 active:scale-95"
          aria-label="Open Cart"
        >
          <ShoppingCart className="size-5" />
          <span className="hidden sm:inline">
            {lang === "ar" ? "سلة المشتريات" : "Smart Cart"}
          </span>
          <span className="flex size-5 items-center justify-center rounded-full bg-background text-[11px] font-black text-primary">
            {totalItems}
          </span>
        </button>
      </div>

      {/* ─── SLIDE-OUT CART DRAWER & WISHLIST MODAL ──────────────────────────── */}
      <SmartCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SmartWishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onSelectProduct={(p) => {
          setIsWishlistOpen(false);
          const el = document.getElementById("catalog");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
