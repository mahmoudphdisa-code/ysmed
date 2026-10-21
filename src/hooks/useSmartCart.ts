import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string; // unique cart item id (e.g. productId + variant)
  productId: string;
  titleEn: string;
  titleAr: string;
  variantLabelEn?: string | undefined;
  variantLabelAr?: string | undefined;
  gangCount?: number | undefined;
  protocol?: string | undefined;
  color?: string | undefined;
  priceEGP: number;
  originalPriceEGP?: number | undefined;
  quantity: number;
  image: string;
}

const STORAGE_KEY = "ysmed_smart_cart_v1";
const EVENT_NAME = "ysmed_cart_updated";

export function useSmartCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  });

  // Listen for cross-component updates
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setItems(saved ? JSON.parse(saved) : []);
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

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  };

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number | undefined }, lang: "en" | "ar" = "en") => {
      const qtyToAdd = item.quantity || 1;
      const current = (() => {
        try {
          const s = localStorage.getItem(STORAGE_KEY);
          return s ? (JSON.parse(s) as CartItem[]) : [];
        } catch {
          return [];
        }
      })();

      const existingIndex = current.findIndex((i) => i.id === item.id);
      let updated: CartItem[];

      const existing = existingIndex > -1 ? current[existingIndex] : undefined;
      if (existing) {
        updated = [...current];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + qtyToAdd,
        };
      } else {
        const { quantity: _q, ...rest } = item;
        const newItem: CartItem = {
          ...rest,
          quantity: qtyToAdd,
        };
        updated = [...current, newItem];
      }

      saveItems(updated);
      toast.success(
        lang === "ar"
          ? `تمت إضافة "${item.titleAr}" إلى سلة المشتريات!`
          : `Added "${item.titleEn}" to your cart!`
      );
    },
    []
  );

  const updateQuantity = useCallback((id: string, delta: number) => {
    const current = (() => {
      try {
        const s = localStorage.getItem(STORAGE_KEY);
        return s ? (JSON.parse(s) as CartItem[]) : [];
      } catch {
        return [];
      }
    })();

    const updated = current
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((i): i is CartItem => i !== null);

    saveItems(updated);
  }, []);

  const removeFromCart = useCallback((id: string, lang: "en" | "ar" = "en") => {
    const current = (() => {
      try {
        const s = localStorage.getItem(STORAGE_KEY);
        return s ? (JSON.parse(s) as CartItem[]) : [];
      } catch {
        return [];
      }
    })();

    const item = current.find((i) => i.id === id);
    const updated = current.filter((i) => i.id !== id);
    saveItems(updated);
    if (item) {
      toast.info(lang === "ar" ? "تم حذف المنتج من السلة" : "Removed item from cart");
    }
  }, []);

  const clearCart = useCallback(() => {
    saveItems([]);
  }, []);

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotalEGP = items.reduce((acc, curr) => acc + curr.priceEGP * curr.quantity, 0);
  const originalSubtotalEGP = items.reduce(
    (acc, curr) => acc + (curr.originalPriceEGP || curr.priceEGP) * curr.quantity,
    0
  );
  const totalSavingsEGP = Math.max(0, originalSubtotalEGP - subtotalEGP);

  return {
    items,
    totalItems,
    subtotalEGP,
    originalSubtotalEGP,
    totalSavingsEGP,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}
