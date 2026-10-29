-- Migration 0008: Engineering Project Support & Prototyping Platform
-- Adds tables, RLS policies, trigger functions, and seed data for the engineering services section.

-- 1. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  description_ar text NOT NULL,
  description_en text NOT NULL,
  icon text NOT NULL DEFAULT 'Cpu',
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Project Requests Table
CREATE TABLE IF NOT EXISTS public.project_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text NOT NULL UNIQUE,
  guest_access_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  user_type text NOT NULL DEFAULT 'student',
  university text,
  department text,
  project_title text NOT NULL,
  project_category text NOT NULL,
  project_description text NOT NULL,
  objectives text,
  required_features text,
  current_stage text NOT NULL DEFAULT 'idea',
  existing_technologies text,
  technical_challenges text,
  conditional_details jsonb DEFAULT '{}'::jsonb,
  deadline date,
  urgency text NOT NULL DEFAULT 'normal',
  budget_min numeric,
  budget_max numeric,
  budget_currency text DEFAULT 'EGP',
  preferred_contact_method text DEFAULT 'whatsapp',
  additional_notes text,
  status text NOT NULL DEFAULT 'new',
  assigned_admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Project Request Services Link Table
CREATE TABLE IF NOT EXISTS public.project_request_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_request_id uuid NOT NULL REFERENCES public.project_requests(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Project Files Table
CREATE TABLE IF NOT EXISTS public.project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_request_id uuid NOT NULL REFERENCES public.project_requests(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  uploader_role text NOT NULL DEFAULT 'customer',
  file_name text NOT NULL,
  file_path text NOT NULL,
  mime_type text,
  file_size bigint,
  file_category text DEFAULT 'attachment',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Project Messages Table
CREATE TABLE IF NOT EXISTS public.project_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_request_id uuid NOT NULL REFERENCES public.project_requests(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name text NOT NULL,
  sender_role text NOT NULL DEFAULT 'customer',
  message text NOT NULL,
  is_internal boolean NOT NULL DEFAULT false,
  attachment_url text,
  attachment_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Project Status History Table
CREATE TABLE IF NOT EXISTS public.project_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_request_id uuid NOT NULL REFERENCES public.project_requests(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  notes text,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Project Quotes Table
CREATE TABLE IF NOT EXISTS public.project_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_request_id uuid NOT NULL REFERENCES public.project_requests(id) ON DELETE CASCADE,
  quote_number text NOT NULL UNIQUE,
  scope text NOT NULL,
  deliverables text NOT NULL,
  estimated_cost numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EGP',
  estimated_duration text NOT NULL,
  terms text,
  quote_status text NOT NULL DEFAULT 'sent',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Project Milestones Table
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_request_id uuid NOT NULL REFERENCES public.project_requests(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  due_date date,
  completed_at timestamptz,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. Project Showcase Table
CREATE TABLE IF NOT EXISTS public.project_showcase (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  description_ar text NOT NULL,
  description_en text NOT NULL,
  category text NOT NULL,
  technologies text[] NOT NULL DEFAULT '{}',
  image_path text,
  video_url text,
  is_published boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 10. Admin Notifications Table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_request_id uuid REFERENCES public.project_requests(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  title text NOT NULL,
  content text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_project_requests_ref ON public.project_requests(reference_number);
CREATE INDEX IF NOT EXISTS idx_project_requests_token ON public.project_requests(guest_access_token);
CREATE INDEX IF NOT EXISTS idx_project_requests_customer ON public.project_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON public.project_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_messages_req ON public.project_messages(project_request_id);
CREATE INDEX IF NOT EXISTS idx_project_files_req ON public.project_files(project_request_id);
CREATE INDEX IF NOT EXISTS idx_project_quotes_req ON public.project_quotes(project_request_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_req ON public.project_milestones(project_request_id);

-- Grants
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.project_showcase TO anon, authenticated;
GRANT INSERT, SELECT, UPDATE ON public.project_requests TO anon, authenticated;
GRANT INSERT, SELECT ON public.project_request_services TO anon, authenticated;
GRANT INSERT, SELECT, DELETE ON public.project_files TO anon, authenticated;
GRANT INSERT, SELECT ON public.project_messages TO anon, authenticated;
GRANT SELECT ON public.project_status_history TO anon, authenticated;
GRANT SELECT, UPDATE ON public.project_quotes TO anon, authenticated;
GRANT SELECT ON public.project_milestones TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_request_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- 1. Services Policies
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services"
  ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Project Requests Policies
DROP POLICY IF EXISTS "Anyone can submit a project request" ON public.project_requests;
CREATE POLICY "Anyone can submit a project request"
  ON public.project_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own project requests" ON public.project_requests;
CREATE POLICY "Users can read own project requests"
  ON public.project_requests FOR SELECT TO authenticated
  USING (auth.uid() = customer_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update project requests" ON public.project_requests;
CREATE POLICY "Admins can update project requests"
  ON public.project_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete project requests" ON public.project_requests;
CREATE POLICY "Admins can delete project requests"
  ON public.project_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Project Request Services Policies
DROP POLICY IF EXISTS "Anyone can insert project services" ON public.project_request_services;
CREATE POLICY "Anyone can insert project services"
  ON public.project_request_services FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users view own project services" ON public.project_request_services;
CREATE POLICY "Users view own project services"
  ON public.project_request_services FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.project_requests pr 
      WHERE pr.id = project_request_id AND (pr.customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- 4. Project Files Policies
DROP POLICY IF EXISTS "Anyone can insert project files" ON public.project_files;
CREATE POLICY "Anyone can insert project files"
  ON public.project_files FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users view own project files" ON public.project_files;
CREATE POLICY "Users view own project files"
  ON public.project_files FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.project_requests pr 
      WHERE pr.id = project_request_id AND (pr.customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- 5. Project Messages Policies
DROP POLICY IF EXISTS "Users view own non-internal messages" ON public.project_messages;
CREATE POLICY "Users view own non-internal messages"
  ON public.project_messages FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR (
      is_internal = false AND EXISTS (
        SELECT 1 FROM public.project_requests pr 
        WHERE pr.id = project_request_id AND pr.customer_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users and Admins insert messages" ON public.project_messages;
CREATE POLICY "Users and Admins insert messages"
  ON public.project_messages FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR (
      is_internal = false AND EXISTS (
        SELECT 1 FROM public.project_requests pr 
        WHERE pr.id = project_request_id AND pr.customer_id = auth.uid()
      )
    )
  );

-- 6. Project Status History Policies
DROP POLICY IF EXISTS "Users view own status history" ON public.project_status_history;
CREATE POLICY "Users view own status history"
  ON public.project_status_history FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.project_requests pr 
      WHERE pr.id = project_request_id AND pr.customer_id = auth.uid()
    )
  );

-- 7. Project Quotes Policies
DROP POLICY IF EXISTS "Users view quotes for own requests" ON public.project_quotes;
CREATE POLICY "Users view quotes for own requests"
  ON public.project_quotes FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.project_requests pr 
      WHERE pr.id = project_request_id AND pr.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users update own quote status" ON public.project_quotes;
CREATE POLICY "Users update own quote status"
  ON public.project_quotes FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.project_requests pr 
      WHERE pr.id = project_request_id AND pr.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins manage all quotes" ON public.project_quotes;
CREATE POLICY "Admins manage all quotes"
  ON public.project_quotes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. Project Milestones Policies
DROP POLICY IF EXISTS "Users view own milestones" ON public.project_milestones;
CREATE POLICY "Users view own milestones"
  ON public.project_milestones FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.project_requests pr 
      WHERE pr.id = project_request_id AND pr.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins manage milestones" ON public.project_milestones;
CREATE POLICY "Admins manage milestones"
  ON public.project_milestones FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 9. Showcase Policies
DROP POLICY IF EXISTS "Public can view published showcase" ON public.project_showcase;
CREATE POLICY "Public can view published showcase"
  ON public.project_showcase FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage showcase" ON public.project_showcase;
CREATE POLICY "Admins manage showcase"
  ON public.project_showcase FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 10. Admin Notifications Policies
DROP POLICY IF EXISTS "Admins read notifications" ON public.admin_notifications;
CREATE POLICY "Admins read notifications"
  ON public.admin_notifications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Secure Function for Guest Request Verification
CREATE OR REPLACE FUNCTION public.verify_guest_project(
  p_reference text,
  p_token text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_project jsonb;
  v_services jsonb;
  v_files jsonb;
  v_messages jsonb;
  v_history jsonb;
  v_quotes jsonb;
  v_milestones jsonb;
  v_id uuid;
BEGIN
  SELECT id INTO v_id 
  FROM public.project_requests
  WHERE reference_number = trim(p_reference) 
    AND guest_access_token = trim(p_token);

  IF v_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT to_jsonb(pr) INTO v_project 
  FROM public.project_requests pr 
  WHERE pr.id = v_id;

  SELECT COALESCE(jsonb_agg(to_jsonb(prs)), '[]'::jsonb) INTO v_services
  FROM public.project_request_services prs
  WHERE prs.project_request_id = v_id;

  SELECT COALESCE(jsonb_agg(to_jsonb(pf)), '[]'::jsonb) INTO v_files
  FROM public.project_files pf
  WHERE pf.project_request_id = v_id;

  SELECT COALESCE(jsonb_agg(to_jsonb(pm) ORDER BY pm.created_at ASC), '[]'::jsonb) INTO v_messages
  FROM public.project_messages pm
  WHERE pm.project_request_id = v_id AND pm.is_internal = false;

  SELECT COALESCE(jsonb_agg(to_jsonb(psh) ORDER BY psh.created_at ASC), '[]'::jsonb) INTO v_history
  FROM public.project_status_history psh
  WHERE psh.project_request_id = v_id;

  SELECT COALESCE(jsonb_agg(to_jsonb(pq) ORDER BY pq.created_at DESC), '[]'::jsonb) INTO v_quotes
  FROM public.project_quotes pq
  WHERE pq.project_request_id = v_id;

  SELECT COALESCE(jsonb_agg(to_jsonb(pms) ORDER BY pms.order_index ASC), '[]'::jsonb) INTO v_milestones
  FROM public.project_milestones pms
  WHERE pms.project_request_id = v_id;

  RETURN jsonb_build_object(
    'project', v_project,
    'services', v_services,
    'files', v_files,
    'messages', v_messages,
    'history', v_history,
    'quotes', v_quotes,
    'milestones', v_milestones
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.verify_guest_project(text, text) TO anon, authenticated;

-- Function for guest sending message
CREATE OR REPLACE FUNCTION public.guest_send_message(
  p_reference text,
  p_token text,
  p_sender_name text,
  p_message text,
  p_attachment_url text DEFAULT NULL,
  p_attachment_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_new_msg jsonb;
BEGIN
  SELECT id INTO v_id 
  FROM public.project_requests
  WHERE reference_number = trim(p_reference) 
    AND guest_access_token = trim(p_token);

  IF v_id IS NULL THEN
    RAISE EXCEPTION 'Invalid project reference or access token';
  END IF;

  INSERT INTO public.project_messages (
    project_request_id,
    sender_name,
    sender_role,
    message,
    is_internal,
    attachment_url,
    attachment_name
  ) VALUES (
    v_id,
    COALESCE(NULLIF(trim(p_sender_name), ''), 'Customer'),
    'customer',
    trim(p_message),
    false,
    p_attachment_url,
    p_attachment_name
  ) RETURNING to_jsonb(public.project_messages.*) INTO v_new_msg;

  -- Notify admins
  INSERT INTO public.admin_notifications (
    project_request_id,
    notification_type,
    title,
    content
  ) VALUES (
    v_id,
    'new_message',
    'رسالة جديدة من عميل: ' || p_reference,
    substring(trim(p_message) from 1 for 120)
  );

  RETURN v_new_msg;
END;
$$;
GRANT EXECUTE ON FUNCTION public.guest_send_message(text, text, text, text, text, text) TO anon, authenticated;

-- Trigger to track status history automatically
CREATE OR REPLACE FUNCTION public.handle_project_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.project_status_history (
      project_request_id,
      previous_status,
      new_status,
      notes
    ) VALUES (
      NEW.id,
      NULL,
      NEW.status,
      'تم إنشاء الطلب بنجاح في النظام'
    );
  ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.project_status_history (
      project_request_id,
      previous_status,
      new_status,
      notes,
      changed_by
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      'تحديث حالة الطلب بواسطة الفريق الهندسي',
      auth.uid()
    );
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_project_status_change ON public.project_requests;
CREATE TRIGGER trg_project_status_change
  AFTER INSERT OR UPDATE OF status ON public.project_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_project_status_change();

-- Seed Core Services
INSERT INTO public.services (name_ar, name_en, slug, description_ar, description_en, icon, order_index)
VALUES 
(
  'دعم مشاريع التخرج',
  'Graduation Project Support',
  'graduation-projects',
  'إشراف ودعم فني متكامل لمشاريع تخرج الهندسة وحاسبات ومعلومات، وتوجيه معماري وتصحيح أكواد وتكامل عملي واختبارات قياسية.',
  'Comprehensive mentorship and technical assistance for engineering and computer science graduation projects, including architecture, debugging, integration, and testing.',
  'GraduationCap',
  1
),
(
  'الهندسة الإلكترونية والأنظمة المدمجة',
  'Hardware Engineering',
  'hardware-engineering',
  'برمجة المتحكمات الدقيقة Arduino و ESP32 و ARM، تصميم دوائر PCB، أنظمة إنترنت الأشياء IoT، الروبوتات والأتمتة، والتحكم بالمحركات والحساسات.',
  'Arduino & ESP32 development, microcontroller programming, embedded systems, robotics, IoT, sensor integration, electronic circuit and PCB design.',
  'Cpu',
  2
),
(
  'تطوير البرمجيات والذكاء الاصطناعي',
  'Software Development',
  'software-development',
  'تطبيقات ويب وموبايل، لوحات تحكم متقدمة، رؤية حاسوبية، ذكاء اصطناعي وتعلم آلة، قواعد بيانات، وتكامل متكامل بين الهاردوير والسوفتوير.',
  'Web & mobile apps, Python, AI/ML, computer vision, database systems, APIs, dashboards, and hardware/software communication.',
  'Code2',
  3
),
(
  'تصنيع وتجميع المشاريع الكاملة',
  'Complete Project Manufacturing & Assembly',
  'project-manufacturing',
  'توفير وتوريد المكونات الإلكترونية، تصنيع وتجميع بوردات PCB، طباعة 3D وهياكل ميكانيكية، توصيلات قياسية، واختبار تشغيلي وضمان جودة.',
  'Hardware component sourcing, electronic circuit manufacturing, PCB fabrication, 3D printing & enclosures, wiring, firmware, and quality assurance.',
  'Factory',
  4
),
(
  'تطوير النماذج الأولية المخصصة',
  'Custom Prototype Development',
  'prototype-development',
  'للطلاب والمبتكرين والشركات الناشئة والمؤسسات، تحويل الأفكار والابتكارات إلى نماذج أولية عملية PoC و MVP قابلة للتشغيل والعرض على المستثمرين.',
  'Idea feasibility assessment, proof of concept, prototype architecture, hardware/software implementation, and functional prototype delivery.',
  'Sparkles',
  5
),
(
  'الاستشارات الفنية واستكشاف الأعطال',
  'Technical Consulting & Troubleshooting',
  'technical-consulting',
  'استشارات هندسية متخصصة، تقييم وتدقيق الأنظمة القائمة، فحص وتصليح الأعطال الإلكترونية والبرمجية، وتحسين الأداء واستقرار التشغيل.',
  'Technical consultations, system evaluation, hardware/software debugging, performance improvement, and implementation guidance.',
  'Wrench',
  6
)
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  icon = EXCLUDED.icon,
  order_index = EXCLUDED.order_index;

-- Seed Sample Engineering Showcase Projects
INSERT INTO public.project_showcase (title_ar, title_en, description_ar, description_en, category, technologies, order_index, is_published)
VALUES
(
  'نظام فرز صناعي ذكي بالرؤية الحاسوبية والذراع الروبوتية',
  'AI-Powered Industrial Robotic Sorting System',
  'نظام متكامل يجمع بين كاميرا صناعية وخوارزمية YOLOv8 لاكتشاف العيوب والفرز الآلي، مع ذراع روبوتية 6 محاور وتحكم كامل عبر ESP32 ولوحة تحكم ويب.',
  'Integrated system combining industrial camera with YOLOv8 defect detection, a 6-axis robotic arm, ESP32 microcontroller control, and real-time web dashboard.',
  'Robotics',
  ARRAY['Python', 'OpenCV', 'YOLOv8', 'ESP32', 'Robotics', 'WebSockets', 'Next.js'],
  1,
  true
),
(
  'جهاز مراقبة وتحكم زراعي ذكي متعدد الحساسات بتقنية LoRaWAN',
  'Smart Agricultural IoT Monitoring & Automation System',
  'محطة رصد متقدمة تقيس رطوبة التربة والحرارة وحموضة المياه وتتحكم آلياً في صمامات الري ومضخات التسميد مع لوحة متابعة سحابية.',
  'Field telemetry station monitoring soil moisture, temperature, and pH, automating irrigation valves and fertigation pumps via LoRaWAN with cloud analytics.',
  'IoT',
  ARRAY['ESP32', 'LoRaWAN', 'PCB Design', 'Solar Power', 'React', 'Supabase', 'MQTT'],
  2,
  true
),
(
  'جهاز تخطيط قلب متنقل مع تشخيص فوري بالذكاء الاصطناعي',
  'Portable 12-Lead ECG Device with On-Device AI Diagnosis',
  'جهاز طبي محمول لتسجيل إشارات القلب الحيوية مع خوارزمية ذكاء اصطناعي للكشف المبكر عن اضطرابات النبض وتطبيق موبايل للأطباء.',
  'Portable medical diagnostic tool recording cardiac bio-potentials with on-device edge AI for arrhythmia detection and real-time physician mobile app.',
  'AI',
  ARRAY['Bio-Sensors', 'STM32', 'Edge AI', 'Flutter', 'Bluetooth Low Energy', 'DSP'],
  3,
  true
),
(
  'نظام إدارة طاقة ذكي للمصانع مع تنبؤ بالأحمال والتحكم بالأجهزة',
  'Factory Smart Energy Management & Predictive Load Shedding',
  'نظام إلكتروني صناعي يقيس استهلاك الطاقة على كل خط إنتاج، يحلل جودة القدرة، ويتنبأ بالذروة لمنع الغرامات مع تحكم أوتوماتيكي.',
  'Industrial energy audit hardware measuring phase currents, analyzing power factor, and predicting peak demand to prevent utility surcharges.',
  'Hardware',
  ARRAY['Current Transformers', 'Modbus RTU', 'RS485', 'Raspberry Pi', 'Python', 'Tailwind CSS'],
  4,
  true
)
ON CONFLICT DO NOTHING;
