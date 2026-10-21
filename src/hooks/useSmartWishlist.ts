import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "ysmed_smart_wishlist_v1";
const EVENT_NAME = "ysmed_wishlist_updated";

export function useSmartWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setWishlistIds(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const saveIds = (ids: string[]) => {
    setWishlistIds(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWishlist = useCallback(
    (productId: string, productTitle?: { en: string; ar: string }, lang: "en" | "ar" = "en") => {
      const current = (() => {
        try {
          const s = localStorage.getItem(STORAGE_KEY);
          return s ? (JSON.parse(s) as string[]) : [];
        } catch {
          return [];
        }
      })();

      const exists = current.includes(productId);
      const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];

      saveIds(updated);

      if (productTitle) {
        if (!exists) {
          toast.success(
            lang === "ar"
              ? `تمت إضافة "${productTitle.ar}" إلى المفضلة`
              : `Added "${productTitle.en}" to your wishlist`
          );
        } else {
          toast.info(
            lang === "ar"
              ? `تمت إزالة "${productTitle.ar}" من المفضلة`
              : `Removed "${productTitle.en}" from your wishlist`
          );
        }
      }
    },
    []
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const clearWishlist = useCallback(() => {
    saveIds([]);
  }, []);

  return {
    wishlistIds,
    wishlistCount: wishlistIds.length,
    toggleWishlist,
    isWishlisted,
    clearWishlist,
  };
}
