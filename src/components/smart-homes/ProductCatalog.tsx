import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Tag,
  Check,
} from "lucide-react";
import { type SmartProduct, type Protocol, type SwitchColor, type GangCount } from "@/data/smartHomesData";
import { useSmartProducts } from "@/hooks/useSmartProducts";
import { ProductCard } from "./ProductCard";
import { SmartCategoryNav } from "./SmartCategoryNav";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { useI18n } from "@/lib/i18n";

interface ProductCatalogProps {
  onRequestInstallation?: (product: SmartProduct) => void;
}

export function ProductCatalog({ onRequestInstallation }: ProductCatalogProps) {
  const { lang, tl } = useI18n();
  const { products } = useSmartProducts();

  // Search and filter states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProtocol, setSelectedProtocol] = useState<string>("all");
  const [selectedGang, setSelectedGang] = useState<number | "all">("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [dealsOnly, setDealsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "discount" | "rating">("featured");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Modal state
  const [quickViewProduct, setQuickViewProduct] = useState<SmartProduct | null>(null);

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "all" && p.category !== selectedCategory) return false;

        // Protocol filter
        if (selectedProtocol !== "all" && p.protocol !== selectedProtocol) return false;

        // Gang filter
        if (selectedGang !== "all") {
          if (!p.availableGangs || !p.availableGangs.includes(selectedGang as GangCount)) return false;
        }

        // Color filter
        if (selectedColor !== "all") {
          if (!p.availableColors || !p.availableColors.includes(selectedColor as SwitchColor)) return false;
        }

        // Deals only
        if (dealsOnly && (!p.originalPriceEGP || p.originalPriceEGP <= p.basePriceEGP)) return false;

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = p.title.en.toLowerCase().includes(q) || p.title.ar.toLowerCase().includes(q);
          const matchDesc = p.description.en.toLowerCase().includes(q) || p.description.ar.toLowerCase().includes(q);
          const matchCategory = p.categoryName.en.toLowerCase().includes(q) || p.categoryName.ar.toLowerCase().includes(q);
          const matchProtocol = p.protocol.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCategory && !matchProtocol) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.basePriceEGP - b.basePriceEGP;
        if (sortBy === "price-desc") return b.basePriceEGP - a.basePriceEGP;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "discount") {
          const discA = a.originalPriceEGP ? a.originalPriceEGP - a.basePriceEGP : 0;
          const discB = b.originalPriceEGP ? b.originalPriceEGP - b.basePriceEGP : 0;
          return discB - discA;
        }
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [products, selectedCategory, selectedProtocol, selectedGang, selectedColor, dealsOnly, search, sortBy]);

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedProtocol !== "all" ||
    selectedGang !== "all" ||
    selectedColor !== "all" ||
    dealsOnly ||
    search.trim() !== "";

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedProtocol("all");
    setSelectedGang("all");
    setSelectedColor("all");
    setDealsOnly(false);
    setSearch("");
  };

  return (
    <section id="catalog" className="py-16 scroll-mt-20 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface px-4 py-1.5 text-xs font-bold text-primary shadow-glow">
            <Sparkles className="size-3.5 text-gold" />
            <span>{lang === "ar" ? "كتالوج الأجهزة والأنظمة الذكية" : "Smart Hardware Catalog"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {lang === "ar"
              ? "استكشف أحدث منتجات المنازل الذكية في مصر"
              : "Explore Certified Smart Home Hardware"}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "تصفح المفاتيح الذكية الكريستالية، الشاشات الجدارية، بوابات التحكم، أقفال الأبواب، وأنظمة الإضاءة والتكييف المتوافقة مع العلب الجدارية المصرية والمساعدات الصوتية."
              : "Browse luxury crystal touch switches, wall touchscreen consoles, Zigbee hubs, biometric smart locks, curtain motors, and climate controllers with local Egyptian warranty."}
          </p>
        </div>

        {/* ─── Category Navigation Bar ─────────────────────────────────────── */}
        <div className="mb-6">
          <SmartCategoryNav
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => setSelectedCategory(id)}
          />
        </div>

        {/* ─── Search, Filter Bar & Sort Controls ──────────────────────────── */}
        <div className="glass rounded-3xl p-4 sm:p-5 border border-border/80 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute start-3.5 top-3.5 size-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "ابحث باسم المنتج، النوع، بروتوكول الاتصال (Wi-Fi أو Zigbee)..."
                    : "Search by device name, category, or protocol (e.g. Zigbee, Switch)..."
                }
                className="w-full rounded-2xl border border-input bg-surface/80 ps-10 pe-9 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:shadow-glow transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute end-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full rounded-2xl border border-input bg-surface/90 px-3.5 py-2.5 text-xs font-bold text-foreground outline-none focus:border-primary cursor-pointer"
                >
                  <option value="featured">{lang === "ar" ? "الأكثر تميزاً" : "Featured & Popular"}</option>
                  <option value="price-asc">{lang === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
                  <option value="price-desc">{lang === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
                  <option value="discount">{lang === "ar" ? "أكبر نسبة خصم" : "Largest Discount"}</option>
                  <option value="rating">{lang === "ar" ? "الأعلى تقييماً" : "Highest Customer Rating"}</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className={`flex sm:hidden items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-bold border transition-colors ${
                  showFiltersMobile
                    ? "bg-primary text-background border-primary"
                    : "bg-surface border-border text-foreground"
                }`}
              >
                <SlidersHorizontal className="size-4" />
                <span>{lang === "ar" ? "تصفية" : "Filter"}</span>
              </button>
            </div>
          </div>

          {/* Secondary Filter Chips (Desktop & Mobile Drawer) */}
          <div className={`grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 pt-2 border-t border-border/40 ${showFiltersMobile ? "block" : "hidden sm:flex"}`}>
            {/* Protocol Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground me-1 hidden lg:inline">
                {lang === "ar" ? "البروتوكول:" : "Protocol:"}
              </span>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                className="rounded-xl border border-input bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer w-full sm:w-auto"
              >
                <option value="all">{lang === "ar" ? "كل البروتوكولات" : "All Protocols"}</option>
                <option value="Wi-Fi">Wi-Fi</option>
                <option value="Zigbee">Zigbee 3.0</option>
                <option value="Hybrid (Wi-Fi + Zigbee)">Hybrid Mesh</option>
              </select>
            </div>

            {/* Gang Count Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground me-1 hidden lg:inline">
                {lang === "ar" ? "الخطوط:" : "Gangs:"}
              </span>
              <select
                value={selectedGang.toString()}
                onChange={(e) =>
                  setSelectedGang(e.target.value === "all" ? "all" : parseInt(e.target.value, 10))
                }
                className="rounded-xl border border-input bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer w-full sm:w-auto"
              >
                <option value="all">{lang === "ar" ? "جميع الخطوط" : "All Gangs"}</option>
                <option value="1">1 Gang</option>
                <option value="2">2 Gang</option>
                <option value="3">3 Gang</option>
                <option value="4">4 Gang</option>
              </select>
            </div>

            {/* Color Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground me-1 hidden lg:inline">
                {lang === "ar" ? "اللون:" : "Color:"}
              </span>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="rounded-xl border border-input bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer w-full sm:w-auto"
              >
                <option value="all">{lang === "ar" ? "جميع الألوان" : "All Colors"}</option>
                <option value="Black">{lang === "ar" ? "أسود" : "Black"}</option>
                <option value="White">{lang === "ar" ? "أبيض" : "White"}</option>
                <option value="Gold">{lang === "ar" ? "ذهبي" : "Gold"}</option>
                <option value="Gray">{lang === "ar" ? "رمادي" : "Gray"}</option>
              </select>
            </div>

            {/* Deals Only Toggle */}
            <button
              onClick={() => setDealsOnly(!dealsOnly)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition-all col-span-2 sm:col-span-1 justify-center sm:justify-start ${
                dealsOnly
                  ? "bg-gold text-slate-950 border-gold shadow-gold"
                  : "bg-surface border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Tag className="size-3.5" />
              <span>{lang === "ar" ? "العروض والخصومات فقط" : "Deals & Offers Only"}</span>
            </button>

            {/* Clear All */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:underline font-semibold ms-auto flex items-center gap-1 col-span-2 sm:col-span-1 justify-center"
              >
                <X className="size-3" />
                <span>{lang === "ar" ? "إعادة تعيين الفلاتر" : "Reset Filters"}</span>
              </button>
            )}
          </div>
        </div>

        {/* ─── Results Counter ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6 text-xs text-muted-foreground px-1">
          <span>
            {lang === "ar"
              ? `عرض ${filteredProducts.length} من أصل ${smartProducts.length} جهاز ذكي`
              : `Showing ${filteredProducts.length} of ${smartProducts.length} smart devices`}
          </span>
          <span className="hidden sm:inline text-primary">
            {lang === "ar" ? "أسعار رسمية بالجنيه المصري (EGP) معتمدة" : "All prices in Egyptian Pounds (EGP)"}
          </span>
        </div>

        {/* ─── Product Cards Grid ─────────────────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-border/80 max-w-lg mx-auto">
            <Search className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-foreground">
              {lang === "ar" ? "لا توجد أجهزة مطابقة للبحث" : "No devices match your search"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4 leading-relaxed">
              {lang === "ar"
                ? "جرب إزالة بعض الفلاتر أو البحث بكلمات أخرى مثل 'مفتاح' أو 'قفل' أو 'Zigbee'."
                : "Try clearing selected filters or search with terms like 'Switch', 'Zigbee', or 'Lock'."}
            </p>
            <button
              onClick={clearAllFilters}
              className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-background shadow-glow"
            >
              {lang === "ar" ? "عرض جميع الأجهزة" : "View All Devices"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View / Full Details Modal */}
      <ProductDetailsModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onRequestInstallation={onRequestInstallation}
      />
    </section>
  );
}
