-- Migration 0006: Dedicated Database-Synced Cart Table for Registered Users
-- Syncs shopping cart items across devices for authenticated users while maintaining guest support

CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id text NOT NULL, -- unique cart item id (e.g. productId + variant id)
  product_id text NOT NULL,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  variant_label_en text,
  variant_label_ar text,
  gang_count integer,
  protocol text,
  color text,
  price_egp integer NOT NULL,
  original_price_egp integer,
  quantity integer NOT NULL DEFAULT 1,
  image text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cart_items_user_item_unique UNIQUE (user_id, item_id)
);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;

-- RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- 1. Users can read their own cart items
DROP POLICY IF EXISTS "Users can read own cart items" ON public.cart_items;
CREATE POLICY "Users can read own cart items"
  ON public.cart_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2. Users can insert their own cart items
DROP POLICY IF EXISTS "Users can insert own cart items" ON public.cart_items;
CREATE POLICY "Users can insert own cart items"
  ON public.cart_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own cart items
DROP POLICY IF EXISTS "Users can update own cart items" ON public.cart_items;
CREATE POLICY "Users can update own cart items"
  ON public.cart_items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own cart items
DROP POLICY IF EXISTS "Users can delete own cart items" ON public.cart_items;
CREATE POLICY "Users can delete own cart items"
  ON public.cart_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 5. Admins can view all cart items for CRM / customer support insights
DROP POLICY IF EXISTS "Admins can view all cart items" ON public.cart_items;
CREATE POLICY "Admins can view all cart items"
  ON public.cart_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
