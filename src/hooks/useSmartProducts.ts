import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { smartProducts as initialSmartProducts, type SmartProduct, type Protocol, type SwitchColor, type GangCount } from "@/data/smartHomesData";

export function useSmartProducts() {
  const [products, setProducts] = useState<SmartProduct[]>(initialSmartProducts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error: fetchErr } = await supabase
        .from("smart_products")
        .select("*")
        .order("order_index", { ascending: true });

      if (fetchErr) {
        // Table might not exist yet before migration is applied by admin, fall back gracefully
        console.warn("Could not fetch smart_products from Supabase, using initial catalog:", fetchErr.message);
        setProducts(initialSmartProducts);
        setError(fetchErr.message);
        return;
      }

      if (data && data.length > 0) {
        const mapped: SmartProduct[] = data.map((row) => {
          const specsRaw = (typeof row.specs === "object" && row.specs !== null ? row.specs : {}) as Record<string, unknown>;
          const featuresEn = Array.isArray(row.features_en) ? (row.features_en as string[]) : [];
          const featuresAr = Array.isArray(row.features_ar) ? (row.features_ar as string[]) : [];
          const imagesArr = Array.isArray(row.images) ? (row.images as string[]) : [];
          const colorsArr = Array.isArray(row.available_colors) ? (row.available_colors as SwitchColor[]) : undefined;
          const gangsArr = Array.isArray(row.available_gangs) ? (row.available_gangs as GangCount[]) : undefined;
          const variantsArr = Array.isArray(row.variants) && row.variants.length > 0 ? (row.variants as SmartProduct["variants"]) : undefined;

          // Merge features into L[]
          const maxFeatLen = Math.max(featuresEn.length, featuresAr.length);
          const features = Array.from({ length: maxFeatLen }).map((_, idx) => ({
            en: featuresEn[idx] || featuresAr[idx] || "",
            ar: featuresAr[idx] || featuresEn[idx] || "",
          }));

          return {
            id: row.id,
            slug: row.slug,
            title: {
              en: row.title_en,
              ar: row.title_ar,
            },
            category: row.category,
            categoryName: {
              en: row.category_name_en,
              ar: row.category_name_ar,
            },
            description: {
              en: row.description_en,
              ar: row.description_ar,
            },
            features: features.length > 0 ? features : [
              { en: "High quality smart automation component", ar: "مكون أتمتة ذكي عالي الجودة والاعتمادية" }
            ],
            specs: {
              protocol: (row.protocol as Protocol) || "Wi-Fi",
              voltage: (specsRaw["voltage"] as string) || "100V–240V AC",
              neutralWireRequired: specsRaw["neutralWireRequired"] !== undefined ? (specsRaw["neutralWireRequired"] as boolean | string) : "Flexible",
              voiceCompatibility: Array.isArray(specsRaw["voiceCompatibility"]) ? (specsRaw["voiceCompatibility"] as string[]) : ["Alexa", "Google Assistant"],
              appControl: (specsRaw["appControl"] as string) || "Smart Life / Tuya",
              dimensions: specsRaw["dimensions"] as string | undefined,
              maxLoad: specsRaw["maxLoad"] as string | undefined,
            },
            basePriceEGP: row.base_price_egp,
            originalPriceEGP: row.original_price_egp || undefined,
            images: imagesArr.length > 0 ? imagesArr : [
              "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
            ],
            protocol: (row.protocol as Protocol) || "Wi-Fi",
            inStock: row.in_stock && (row.stock_quantity === undefined || row.stock_quantity > 0),
            stockQuantity: typeof row.stock_quantity === "number" ? row.stock_quantity : (row.in_stock ? 25 : 0),
            isPopular: row.is_popular,
            isDeal: row.is_deal,
            rating: Number(row.rating) || 4.9,
            reviewsCount: row.reviews_count || 12,
            availableColors: colorsArr,
            availableGangs: gangsArr,
            variants: variantsArr,
          };
        });

        setProducts(mapped);
      } else {
        // Table exists but is empty, fallback to initial catalog
        setProducts(initialSmartProducts);
      }
    } catch (err: unknown) {
      console.error("Error in useSmartProducts fetch:", err);
      setProducts(initialSmartProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // Subscribe to Supabase Realtime updates on public.smart_products
    const channel = supabase
      .channel("smart-products-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "smart_products" },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}
