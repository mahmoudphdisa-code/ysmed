import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DbCartRow = Database["public"]["Tables"]["cart_items"]["Row"];

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

function mapDbRowToCartItem(row: DbCartRow): CartItem {
  return {
    id: row.item_id,
    productId: row.product_id,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    variantLabelEn: row.variant_label_en || undefined,
    variantLabelAr: row.variant_label_ar || undefined,
    gangCount: row.gang_count || undefined,
    protocol: row.protocol || undefined,
    color: row.color || undefined,
    priceEGP: row.price_egp,
    originalPriceEGP: row.original_price_egp || undefined,
    quantity: row.quantity,
    image: row.image,
  };
}

function mapCartItemToDbRow(item: CartItem, userId: string) {
  return {
    user_id: userId,
    item_id: item.id,
    product_id: item.productId,
    title_en: item.titleEn,
    title_ar: item.titleAr,
    variant_label_en: item.variantLabelEn || null,
    variant_label_ar: item.variantLabelAr || null,
    gang_count: item.gangCount || null,
    protocol: item.protocol || null,
    color: item.color || null,
    price_egp: item.priceEGP,
    original_price_egp: item.originalPriceEGP || null,
    quantity: item.quantity,
    image: item.image,
    updated_at: new Date().toISOString(),
  };
}

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

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  userIdRef.current = currentUserId;

  // Persist to local storage and broadcast to other components
  const persistLocally = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, []);

  // Sync / fetch cart from Supabase when user logs in or mounts
  const syncWithSupabase = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", uid);

      if (error) {
        // Table might not exist yet if migration hasn't run, fall back silently
        console.warn("Could not query cart_items from Supabase:", error.message);
        return;
      }

      const dbCartItems: CartItem[] = (data || []).map(mapDbRowToCartItem);

      // Check if there were guest items stored in localStorage before login
      let guestItems: CartItem[] = [];
      try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) guestItems = JSON.parse(s);
      } catch (err) {
        console.error(err);
      }

      if (guestItems.length > 0) {
        // Merge guest items into DB cart
        const mergedMap = new Map<string, CartItem>();
        dbCartItems.forEach((item) => mergedMap.set(item.id, item));

        for (const guestItem of guestItems) {
          if (mergedMap.has(guestItem.id)) {
            const existing = mergedMap.get(guestItem.id)!;
            mergedMap.set(guestItem.id, {
              ...existing,
              quantity: existing.quantity + guestItem.quantity,
            });
          } else {
            mergedMap.set(guestItem.id, guestItem);
          }
        }

        const mergedItems = Array.from(mergedMap.values());
        persistLocally(mergedItems);

        // Upsert merged list to Supabase
        const payload = mergedItems.map((item) => mapCartItemToDbRow(item, uid));
        await supabase.from("cart_items").upsert(payload, { onConflict: "user_id, item_id" });
      } else {
        persistLocally(dbCartItems);
      }
    } catch (err) {
      console.error("Failed to sync cart with Supabase:", err);
    }
  }, [persistLocally]);

  // Auth state listener
  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data: userRes }) => {
      if (!active) return;
      const uid = userRes?.user?.id || null;
      setCurrentUserId(uid);
      if (uid) {
        syncWithSupabase(uid);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id || null;
      setCurrentUserId(uid);
      if (uid) {
        syncWithSupabase(uid);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [syncWithSupabase]);

  // Listen for cross-component / cross-tab updates
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
      let targetItem: CartItem;

      const existing = existingIndex > -1 ? current[existingIndex] : undefined;
      if (existing) {
        targetItem = {
          ...existing,
          quantity: existing.quantity + qtyToAdd,
        };
        updated = [...current];
        updated[existingIndex] = targetItem;
      } else {
        const { quantity: _q, ...rest } = item;
        targetItem = {
          ...rest,
          quantity: qtyToAdd,
        };
        updated = [...current, targetItem];
      }

      persistLocally(updated);

      // If user is logged in, sync to Supabase
      const uid = userIdRef.current;
      if (uid) {
        supabase
          .from("cart_items")
          .upsert(mapCartItemToDbRow(targetItem, uid), { onConflict: "user_id, item_id" })
          .then(({ error }) => {
            if (error) console.warn("Supabase cart upsert error:", error.message);
          });
      }

      toast.success(
        lang === "ar"
          ? `تمت إضافة "${item.titleAr}" إلى سلة المشتريات!`
          : `Added "${item.titleEn}" to your cart!`
      );
    },
    [persistLocally]
  );

  const updateQuantity = useCallback(
    (id: string, delta: number) => {
      const current = (() => {
        try {
          const s = localStorage.getItem(STORAGE_KEY);
          return s ? (JSON.parse(s) as CartItem[]) : [];
        } catch {
          return [];
        }
      })();

      let updatedTarget: CartItem | null = null;
      let willDelete = false;

      const updated = current
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty > 0) {
              updatedTarget = { ...item, quantity: newQty };
              return updatedTarget;
            }
            willDelete = true;
            return null;
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null);

      persistLocally(updated);

      const uid = userIdRef.current;
      if (uid) {
        if (willDelete) {
          supabase
            .from("cart_items")
            .delete()
            .match({ user_id: uid, item_id: id })
            .then(({ error }) => {
              if (error) console.warn("Supabase cart delete error:", error.message);
            });
        } else if (updatedTarget) {
          supabase
            .from("cart_items")
            .update({
              quantity: (updatedTarget as CartItem).quantity,
              updated_at: new Date().toISOString(),
            })
            .match({ user_id: uid, item_id: id })
            .then(({ error }) => {
              if (error) console.warn("Supabase cart update error:", error.message);
            });
        }
      }
    },
    [persistLocally]
  );

  const removeFromCart = useCallback(
    (id: string, lang: "en" | "ar" = "en") => {
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
      persistLocally(updated);

      const uid = userIdRef.current;
      if (uid) {
        supabase
          .from("cart_items")
          .delete()
          .match({ user_id: uid, item_id: id })
          .then(({ error }) => {
            if (error) console.warn("Supabase cart delete error:", error.message);
          });
      }

      if (item) {
        toast.info(lang === "ar" ? "تم حذف المنتج من السلة" : "Removed item from cart");
      }
    },
    [persistLocally]
  );

  const clearCart = useCallback(() => {
    persistLocally([]);
    const uid = userIdRef.current;
    if (uid) {
      supabase
        .from("cart_items")
        .delete()
        .eq("user_id", uid)
        .then(({ error }) => {
          if (error) console.warn("Supabase cart clear error:", error.message);
        });
    }
  }, [persistLocally]);

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
    isUserLoggedIn: !!currentUserId,
  };
}
