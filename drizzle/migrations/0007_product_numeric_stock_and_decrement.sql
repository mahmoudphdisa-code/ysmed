-- Migration 0007: Numeric Inventory Stock Quantity & Atomic Decrement on Purchase
-- Adds stock_quantity integer column and atomic PostgreSQL RPC function for order fulfillment

-- 1. Add stock_quantity column to smart_products if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'smart_products' 
      AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE public.smart_products ADD COLUMN stock_quantity integer NOT NULL DEFAULT 25;
  END IF;
END $$;

-- 2. Stored Procedure: Atomically decrement stock when an order is confirmed
CREATE OR REPLACE FUNCTION public.decrement_smart_product_stock(order_items jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item jsonb;
  target_id text;
  req_qty integer;
  updated_count integer := 0;
  row_stock integer;
BEGIN
  IF order_items IS NULL OR jsonb_array_length(order_items) = 0 THEN
    RETURN jsonb_build_object('success', true, 'updated', 0);
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(order_items)
  LOOP
    target_id := COALESCE(item->>'productId', item->>'id', item->>'slug');
    req_qty := GREATEST(1, COALESCE((item->>'quantity')::integer, 1));

    IF target_id IS NOT NULL THEN
      -- Match by slug or UUID text
      UPDATE public.smart_products
      SET 
        stock_quantity = GREATEST(0, stock_quantity - req_qty),
        in_stock = (GREATEST(0, stock_quantity - req_qty) > 0),
        updated_at = now()
      WHERE slug = target_id OR id::text = target_id;

      IF FOUND THEN
        updated_count := updated_count + 1;
      END IF;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'updated', updated_count);
END;
$$;

-- 3. Stored Procedure: Direct Admin Stock Adjustment
CREATE OR REPLACE FUNCTION public.set_smart_product_stock(p_product_id text, p_quantity integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.smart_products
  SET 
    stock_quantity = GREATEST(0, p_quantity),
    in_stock = (GREATEST(0, p_quantity) > 0),
    updated_at = now()
  WHERE slug = p_product_id OR id::text = p_product_id;

  RETURN jsonb_build_object('success', FOUND, 'new_quantity', GREATEST(0, p_quantity));
END;
$$;

-- Grants
GRANT EXECUTE ON FUNCTION public.decrement_smart_product_stock(jsonb) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.set_smart_product_stock(text, integer) TO authenticated, service_role;
