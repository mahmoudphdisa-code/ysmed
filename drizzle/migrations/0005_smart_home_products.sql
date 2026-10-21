-- Migration 0005: Smart Home Products & Pricing Catalog
-- Allows dynamic pricing, stock management, adding and editing smart products from the Admin Dashboard

CREATE TABLE IF NOT EXISTS public.smart_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  category text NOT NULL,
  category_name_en text NOT NULL,
  category_name_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  features_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  features_ar jsonb NOT NULL DEFAULT '[]'::jsonb,
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  base_price_egp integer NOT NULL,
  original_price_egp integer,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  protocol text NOT NULL,
  in_stock boolean NOT NULL DEFAULT true,
  is_popular boolean NOT NULL DEFAULT false,
  is_deal boolean NOT NULL DEFAULT false,
  is_hidden boolean NOT NULL DEFAULT false,
  rating numeric(3,1) NOT NULL DEFAULT 4.9,
  reviews_count integer NOT NULL DEFAULT 15,
  variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  available_colors jsonb NOT NULL DEFAULT '["Black", "White", "Gold", "Gray"]'::jsonb,
  available_gangs jsonb NOT NULL DEFAULT '[1, 2, 3, 4]'::jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Grants
GRANT SELECT ON public.smart_products TO anon, authenticated;
GRANT ALL ON public.smart_products TO service_role;
GRANT ALL ON public.smart_products TO authenticated;

-- RLS
ALTER TABLE public.smart_products ENABLE ROW LEVEL SECURITY;

-- 1. Public can view visible (non-hidden) smart products
DROP POLICY IF EXISTS "Public can view visible smart products" ON public.smart_products;
CREATE POLICY "Public can view visible smart products"
  ON public.smart_products FOR SELECT TO anon, authenticated
  USING (is_hidden = false OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin')));

-- 2. Admins can insert, update, and delete smart products
DROP POLICY IF EXISTS "Admins insert smart products" ON public.smart_products;
CREATE POLICY "Admins insert smart products"
  ON public.smart_products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update smart products" ON public.smart_products;
CREATE POLICY "Admins update smart products"
  ON public.smart_products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete smart products" ON public.smart_products;
CREATE POLICY "Admins delete smart products"
  ON public.smart_products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Initial Seed Data: 12 Premium Smart Home Products
INSERT INTO public.smart_products (
  slug, title_en, title_ar, category, category_name_en, category_name_ar,
  description_en, description_ar, base_price_egp, original_price_egp, protocol,
  in_stock, is_popular, is_deal, order_index, images, specs, available_colors, available_gangs
)
VALUES
(
  'luxury-glass-touch-switch',
  'Luxury Crystal Glass Smart Switch',
  'مفتاح لمس ذكي من الزجاج الكريستالي الفاخر',
  'switches',
  'Smart Wall Switches',
  'مفاتيح الحائط الذكية',
  'Premium tempered crystal glass wall switch with micro-backlit touch buttons, responsive haptic feedback, and multi-protocol smart connectivity.',
  'مفتاح جداري فاخر من الزجاج المقسى الكريستالي مع إضاءة خلفية دقيقة واستجابة لمسية سريعة. يدعم الجداول الزمنية والسيناريوهات والتحكم عن بعد.',
  890,
  1150,
  'Wi-Fi',
  true,
  true,
  true,
  1,
  '["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Wi-Fi", "voltage": "100V–240V AC", "neutralWireRequired": "Flexible (Neutral / No-Neutral supported)", "dimensions": "86 × 86 × 35 mm", "maxLoad": "600W / Gang"}'::jsonb,
  '["Black", "White", "Gold", "Gray"]'::jsonb,
  '[1, 2, 3, 4]'::jsonb
),
(
  'ultra-mesh-zigbee-switch',
  'Zigbee 3.0 Ultra-Mesh Smart Switch',
  'مفتاح ذكي زيجبي 3.0 بتقنية التوصيل الشبكي',
  'switches',
  'Smart Wall Switches',
  'مفاتيح الحائط الذكية',
  'High-reliability Zigbee 3.0 smart switch designed for robust multi-room installations. Extends the Zigbee mesh network automatically.',
  'مفتاح ذكي زيجبي 3.0 عالي الاعتمادية مصمم للمنازل والفيلات. يوسع تغطية الشبكة لاسلكياً ويعمل محلياً حتى في حال انقطاع الإنترنت.',
  1050,
  1350,
  'Zigbee',
  true,
  true,
  false,
  2,
  '["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Zigbee", "voltage": "110V–240V AC", "neutralWireRequired": true, "dimensions": "86 × 86 × 37 mm", "maxLoad": "800W / Gang"}'::jsonb,
  '["Black", "White", "Gold", "Gray"]'::jsonb,
  '[1, 2, 3, 4]'::jsonb
),
(
  'smart-rotary-touch-dimmer',
  'Intelligent Rotary & Touch LED Dimmer',
  'دايمر إضاءة ذكي دائري ولمسي لمصابيح LED',
  'lighting',
  'Smart Lighting & Dimmers',
  'الإضاءة والدايمر الذكي',
  'Precision LED brightness controller with stepless dimming from 1% to 100%. Create cozy cinema atmospheres and gradual sunrise wakeups.',
  'مفتاح خافت إضاءة رقمي متطور يتيح ضبط سطوع لمبات الـ LED بسلاسة من 1% إلى 100%. مناسب لأجواء السينما والنوم والاستيقاظ التدريجي.',
  1250,
  1550,
  'Wi-Fi',
  true,
  false,
  false,
  3,
  '["https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Wi-Fi", "voltage": "220V–240V AC", "neutralWireRequired": true, "dimensions": "86 × 86 mm", "maxLoad": "300W Dimmable LED"}'::jsonb,
  '["Black", "White", "Gold"]'::jsonb,
  '[]'::jsonb
),
(
  'multi-mode-zigbee-ble-gateway',
  'YSMED Multi-Mode Gateway (Zigbee 3.0 + Bluetooth + Wi-Fi)',
  'بوابة تحكم مركزية متعددة البروتوكولات (زيجبي + بلوتوث + واي فاي)',
  'gateways',
  'Hubs & Gateways',
  'بوابات ومركبات التحكم',
  'The central brain for whole-home automation. Connects up to 128 Zigbee and Bluetooth devices to your home network with local execution.',
  'العقل المركزي لمنظومة المنزل الذكي. يربط حتى 128 جهاز وحساس ومفتاح زيجبي وبلوتوث بالشبكة مع تنفيذ السيناريوهات محلياً بسرعة فائقة.',
  1750,
  2200,
  'Zigbee',
  true,
  true,
  true,
  4,
  '["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Zigbee", "voltage": "5V 1A Micro-USB / Type-C", "neutralWireRequired": false, "dimensions": "65 × 65 × 14 mm"}'::jsonb,
  '["White"]'::jsonb,
  '[]'::jsonb
),
(
  'biometric-face-fingerprint-smart-lock',
  'Biometric 3D Face ID & Fingerprint Smart Lock',
  'قفل ذكي فندقي ببصمة الوجه ثلاثية الأبعاد وبصمة الإصبع',
  'locks',
  'Smart Door Locks',
  'الأقفال الذكية والأبواب',
  'Enterprise security smart door lock featuring 3D infrared facial recognition, semiconductor fingerprint reader, PIN passcode, RFID card, and mechanical key.',
  'قفل ذكي فائق الأمان للأبواب المصفحة والخشبية مزود بكاميرا تعرف على الوجه ثلاثية الأبعاد بالأشعة تحت الحمراء، وقارئ بصمة إصبع شبه موصل، وأرقام سرية وبطاقات RFID.',
  8450,
  10500,
  'Wi-Fi',
  true,
  true,
  true,
  5,
  '["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Wi-Fi", "voltage": "7.4V Rechargeable Lithium Battery (4200mAh)", "neutralWireRequired": false, "dimensions": "410 × 78 × 65 mm"}'::jsonb,
  '["Black", "Gray"]'::jsonb,
  '[]'::jsonb
),
(
  'smart-touch-control-center-panel',
  '4-Inch Smart Wall Touch Control Center',
  'شاشة حائط ذكية تعمل باللمس 4 بوصة للتحكم المركزي',
  'panels',
  'Touch Control Panels',
  'شاشات اللمس الجدارية',
  'In-wall Linux/Android touch screen panel replacing multiple light switches. Features integrated Zigbee gateway, two physical relays, and scene controls.',
  'شاشة لمس جدارية أنيقة مقاس 4 بوصة تحل محل المفاتيح التقليدية وتعمل كشاشة تحكم موحدة لكافة إضاءات ومكيفات وسيناريوهات المنزل.',
  5800,
  6900,
  'Hybrid (Wi-Fi + Zigbee)',
  true,
  true,
  false,
  6,
  '["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Hybrid (Wi-Fi + Zigbee)", "voltage": "100V–240V AC", "neutralWireRequired": true, "dimensions": "86 × 86 × 36 mm"}'::jsonb,
  '["Black", "White"]'::jsonb,
  '[]'::jsonb
),
(
  'silent-motorized-smart-curtain-track',
  'Ultra-Quiet Motorized Smart Curtain Track (Wi-Fi / Zigbee)',
  'موتور ومجرى ستائر ذكي فائق الهدوء',
  'curtains',
  'Curtain & Blind Motors',
  'محركات الستائر والشيش',
  'Heavy-duty motorized curtain motor with custom aluminum track. Whisper-quiet operation under 30dB, gentle manual pull start, and percentage opening.',
  'محرك ومجرى ستائر كهربائي فائق الهدوء (أقل من 30 ديسيبل). يدعم الفتح والإغلاق بالنسب المئوية (مثل فتح 50%) والتشغيل بالسحب اليدوي اللطيف.',
  3950,
  4800,
  'Wi-Fi',
  true,
  false,
  true,
  7,
  '["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Wi-Fi", "voltage": "100V–240V AC", "neutralWireRequired": true, "dimensions": "Track: Up to 5.2m expandable", "maxLoad": "Supports up to 50kg fabric"}'::jsonb,
  '["White"]'::jsonb,
  '[]'::jsonb
),
(
  'universal-smart-ir-ac-controller',
  'Universal Smart IR Remote & Climate Controller',
  'ريموت ذكي شامل بالأشعة تحت الحمراء للتحكم بالتكييف والتلفزيون',
  'climate',
  'AC & Climate Control',
  'التحكم بالتكييف والمناخ',
  '360-degree infrared blaster that turns all existing air conditioners, TVs, satellite receivers, and audio bars into smart devices.',
  'جهاز إرسال وتحكم بالأشعة تحت الحمراء بزاوية 360 درجة يحول التكييفات والتلفزيونات والرسيفرات التقليدية إلى أجهزة ذكية يتم التحكم بها عبر الهاتف.',
  590,
  750,
  'Wi-Fi',
  true,
  false,
  false,
  8,
  '["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Wi-Fi", "voltage": "5V DC 1A Micro-USB", "neutralWireRequired": false, "dimensions": "68 × 68 × 27 mm"}'::jsonb,
  '["Black"]'::jsonb,
  '[]'::jsonb
),
(
  'smart-power-monitoring-socket',
  '16A Smart Wall Socket with Real-Time Power Metering',
  'بريزة حائط ذكية 16 أمبير مع قياس ومراقبة استهلاك الكهرباء',
  'energy',
  'Power & Energy Meters',
  'المقابس وإدارة الطاقة',
  'Heavy-duty 16A wall outlet with tempered glass finish and integrated active kilowatt-hour metering. Prevent overloads and monitor appliance costs.',
  'مقبس حائط ذكي 16 أمبير مصمم للأجهزة ذات الاستهلاك العالي (سخانات، غسالات، ثلاجات). يقيس استهلاك الكهرباء والوات فوري ويعطي تقارير شهرية.',
  780,
  950,
  'Wi-Fi',
  true,
  false,
  false,
  9,
  '["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Wi-Fi", "voltage": "100V–250V AC 16A", "neutralWireRequired": true, "dimensions": "86 × 86 × 40 mm", "maxLoad": "3680W Max Load"}'::jsonb,
  '["Black", "White", "Gold"]'::jsonb,
  '[]'::jsonb
),
(
  'outdoor-ai-solar-security-camera',
  '4K Outdoor Solar-Powered 4G/Wi-Fi PTZ Security Camera',
  'كاميرا مراقبة خارجية متحركة 4K تعمل بالطاقة الشمسية وشريحة البيانات',
  'security',
  'Surveillance & Sensors',
  'أنظمة الأمان والمستشعرات',
  '100% wire-free outdoor PTZ camera with high-efficiency solar panel, PIR human detection, color night vision, two-way audio, and siren alarm.',
  'كاميرا حراسة خارجية متحركة 360 درجة تعمل بالطاقة الشمسية وبطاريات مدمجة، دون الحاجة لأي تمديدات أسلاك. مزودة برؤية ليلية ملونة وصفارة إنذار.',
  4600,
  5500,
  'Wi-Fi',
  true,
  true,
  true,
  10,
  '["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Wi-Fi", "voltage": "8W Solar Panel + 15000mAh Battery", "neutralWireRequired": false, "dimensions": "Weatherproof IP66"}'::jsonb,
  '["White"]'::jsonb,
  '[]'::jsonb
),
(
  'smart-motion-illumination-sensor',
  'Zigbee 3.0 PIR Motion & Ambient Light Sensor',
  'مستشعر حركة ذكي مدمج مع مقياس شدة الإضاءة زيجبي 3.0',
  'security',
  'Surveillance & Sensors',
  'أنظمة الأمان والمستشعرات',
  'Ultra-compact PIR movement detector with integrated lux meter. Automatically triggers hallway lights when entering in the dark, and alerts for intruders.',
  'حساس حركة مدمج مع مقياس لشدة الضوء. يشعل إضاءة الطرقة أو الحمام تلقائياً عند الدخول ليلاً، ويرسل تنبيهاً فورياً لهاتفك عند رصد أي حركة أثناء تفعيل وضع الأمان.',
  620,
  790,
  'Zigbee',
  true,
  false,
  false,
  11,
  '["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Zigbee", "voltage": "CR2450 Coin Battery (2 Years Lifespan)", "neutralWireRequired": false, "dimensions": "33 × 33 × 41 mm"}'::jsonb,
  '["White"]'::jsonb,
  '[]'::jsonb
),
(
  'in-wall-bluetooth-wifi-amplifier',
  'In-Wall Multi-Room Smart Audio Amplifier with Touch Screen',
  'مضخم صوت جداري ذكي متعدد الغرف مع شاشة لمس وبلوتوث',
  'audio',
  'Multi-Room Audio',
  'الأنظمة الصوتية متعددة الغرف',
  'Premium in-wall digital amplifier with color touch screen, Bluetooth 5.0, Wi-Fi streaming, AUX input, and dual-zone speaker outputs.',
  'أمبليفاير ومضخم صوت جداري رقمي فخم مع شاشة لمس ملونة، بلوتوث 5.0، تشغيل عبر الواي فاي، ومخارج صوت لتوزيع الموسيقى والقرآن الكريم في الغرف.',
  4200,
  5100,
  'Wi-Fi',
  true,
  false,
  false,
  12,
  '["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '{"protocol": "Wi-Fi", "voltage": "100V–240V AC", "neutralWireRequired": true, "dimensions": "86 × 86 × 38 mm", "maxLoad": "2 × 25W RMS Output"}'::jsonb,
  '["Black", "Gold"]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  base_price_egp = EXCLUDED.base_price_egp,
  original_price_egp = EXCLUDED.original_price_egp,
  in_stock = EXCLUDED.in_stock,
  is_deal = EXCLUDED.is_deal,
  is_popular = EXCLUDED.is_popular,
  updated_at = now();
