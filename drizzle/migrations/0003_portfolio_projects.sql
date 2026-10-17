-- 0003_portfolio_projects.sql
-- Table to manage Company Profile / Implemented Projects (سابقة أعمال)

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  client_name text,
  sector text,
  image_url text NOT NULL,
  location text,
  year text,
  is_hidden boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Grants
GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
GRANT ALL ON public.portfolio_projects TO authenticated;

-- RLS
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Anyone (public or logged in) can view visible projects
CREATE POLICY "Public can view visible portfolio projects"
  ON public.portfolio_projects FOR SELECT TO anon, authenticated
  USING (is_hidden = false OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin')));

-- Admins can insert, update, delete projects
CREATE POLICY "Admins insert portfolio projects"
  ON public.portfolio_projects FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update portfolio projects"
  ON public.portfolio_projects FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete portfolio projects"
  ON public.portfolio_projects FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
