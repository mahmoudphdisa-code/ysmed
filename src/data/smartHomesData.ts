import type { L } from "@/lib/i18n";

export type Protocol = "Wi-Fi" | "Zigbee" | "KNX" | "Hybrid (Wi-Fi + Zigbee)";
export type SwitchColor = "Black" | "White" | "Gold" | "Gray";
export type GangCount = 1 | 2 | 3 | 4;

export interface ProductVariant {
  id: string;
  sku: string;
  gangCount?: GangCount | undefined;
  protocol: Protocol;
  color: SwitchColor;
  priceEGP: number;
  originalPriceEGP?: number | undefined;
  inStock: boolean;
  image?: string | undefined;
}

export interface SmartProduct {
  id: string;
  slug: string;
  title: L;
  category: string; // e.g. 'switches', 'gateways', 'locks', 'panels', 'lighting', 'curtains', 'security', 'audio', 'climate', 'energy', 'appliances'
  categoryName: L;
  description: L;
  features: L[];
  specs: {
    protocol: Protocol;
    voltage: string;
    neutralWireRequired: boolean | string;
    voiceCompatibility: string[];
    appControl: string;
    dimensions?: string | undefined;
    maxLoad?: string | undefined;
  };
  basePriceEGP: number;
  originalPriceEGP?: number | undefined;
  images: string[];
  protocol: Protocol;
  inStock: boolean;
  isPopular?: boolean | undefined;
  isDeal?: boolean | undefined;
  rating: number;
  reviewsCount: number;
  variants?: ProductVariant[] | undefined;
  availableColors?: SwitchColor[] | undefined;
  availableGangs?: GangCount[] | undefined;
}

export interface SmartPackage {
  id: string;
  slug: string;
  name: L;
  propertyType: L;
  roomsCount: number;
  tagline: L;
  description: L;
  includedDevices: {
    name: L;
    quantity: number;
    icon: string;
  }[];
  systemType: Protocol;
  mainFeatures: L[];
  equipmentPriceEGP: number;
  installationPriceEGP: number;
  discountPercentage?: number | undefined;
  isPopular?: boolean | undefined;
  isRecommended?: boolean | undefined;
  idealFor: L;
  image: string;
}

export interface TechComparisonItem {
  id: string;
  name: string;
  badge: L;
  tagline: L;
  pros: L[];
  cons: L[];
  idealFor: L;
  hubRequired: boolean | L;
  rangeMesh: L;
  powerConsumption: L;
  latency: L;
  brandRecommendation: L;
}

const i18 = (en: string, ar: string): L => ({ en, ar });

// ═════════════════════════════════════════════════════════════════════════════
// 1. PRODUCT CATEGORIES DEFINITIONS
// ═════════════════════════════════════════════════════════════════════════════
export const smartCategories = [
  { id: "all", name: i18("All Devices", "جميع الأجهزة"), icon: "Sparkles", count: 24 },
  { id: "switches", name: i18("Smart Wall Switches", "مفاتيح الحائط الذكية"), icon: "ToggleLeft", count: 6 },
  { id: "gateways", name: i18("Hubs & Gateways", "بوابات ومركبات التحكم"), icon: "Radio", count: 2 },
  { id: "locks", name: i18("Smart Door Locks", "الأقفال الذكية والأبواب"), icon: "Lock", count: 2 },
  { id: "panels", name: i18("Touch Control Panels", "شاشات اللمس الجدارية"), icon: "Tablet", count: 2 },
  { id: "lighting", name: i18("Smart Lighting & Dimmers", "الإضاءة والدايمر الذكي"), icon: "Lightbulb", count: 2 },
  { id: "curtains", name: i18("Curtain & Blind Motors", "محركات الستائر والشيش"), icon: "Blinds", count: 2 },
  { id: "security", name: i18("Surveillance & Sensors", "أنظمة الأمان والمستشعرات"), icon: "ShieldAlert", count: 2 },
  { id: "audio", name: i18("Multi-Room Audio", "الأنظمة الصوتية متعددة الغرف"), icon: "Speaker", count: 2 },
  { id: "climate", name: i18("AC & Climate Control", "التحكم بالتكييف والمناخ"), icon: "ThermometerSnowflake", count: 2 },
  { id: "energy", name: i18("Power & Energy Meters", "المقابس وإدارة الطاقة"), icon: "Zap", count: 2 },
];

// ═════════════════════════════════════════════════════════════════════════════
// 2. PRODUCT CATALOG DATA
// ═════════════════════════════════════════════════════════════════════════════
export const smartProducts: SmartProduct[] = [
  // ─── A. SMART SWITCHES ──────────────────────────────────────────────────────
  {
    id: "ys-switch-glass",
    slug: "luxury-glass-touch-switch",
    title: i18("Luxury Crystal Glass Smart Switch", "مفتاح لمس ذكي من الزجاج الكريستالي الفاخر"),
    category: "switches",
    categoryName: i18("Smart Wall Switches", "مفاتيح الحائط الذكية"),
    description: i18(
      "Premium tempered crystal glass wall switch with micro-backlit touch buttons, responsive haptic feedback, and multi-protocol smart connectivity. Supports scheduling, scene control, and remote app management.",
      "مفتاح جداري فاخر من الزجاج المقسى الكريستالي مع إضاءة خلفية دقيقة واستجابة لمسية سريعة. يدعم الجداول الزمنية والسيناريوهات والتحكم عن بعد عبر الموبايل."
    ),
    features: [
      i18("Scratch-resistant tempered crystal glass front", "واجهة زجاجية مقساة مقاومة للخدوش والبصمات"),
      i18("Soft LED status backlight (customizable night mode)", "إضاءة ليلية ناعمة قابلة للتخصيص للراحة في الظلام"),
      i18("Works with neutral wire or no-neutral wire (capacitor included)", "يعمل مع خط محايد (نيوترال) أو بدون نيوترال بمكثف مدمج"),
      i18("Alexa, Google Home & Siri Voice Control", "تحكم صوتي فوري عبر أليكسا ومساعد جوجل وسيري"),
      i18("Timer, countdown, and smart scenario binding", "مؤقتات زمنية وسيناريوهات ذكية مترابطة مع المستشعرات"),
    ],
    specs: {
      protocol: "Wi-Fi",
      voltage: "100V–240V AC 50/60Hz",
      neutralWireRequired: "Flexible (Neutral / No-Neutral supported)",
      voiceCompatibility: ["Amazon Alexa", "Google Assistant", "Apple Siri Shortcuts"],
      appControl: "Smart Life / Tuya Smart / YSMED Cloud",
      dimensions: "86 × 86 × 35 mm (Standard Egyptian/EU Wall Box)",
      maxLoad: "600W / Gang (Resistive) | 150W / Gang (LED)",
    },
    basePriceEGP: 890,
    originalPriceEGP: 1150,
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Wi-Fi",
    inStock: true,
    isPopular: true,
    isDeal: true,
    rating: 4.9,
    reviewsCount: 38,
    availableColors: ["Black", "White", "Gold", "Gray"],
    availableGangs: [1, 2, 3, 4],
    variants: [
      { id: "v1-1g-wifi-black", sku: "SW-GLS-1G-W-BLK", gangCount: 1, protocol: "Wi-Fi", color: "Black", priceEGP: 890, originalPriceEGP: 1150, inStock: true },
      { id: "v1-2g-wifi-black", sku: "SW-GLS-2G-W-BLK", gangCount: 2, protocol: "Wi-Fi", color: "Black", priceEGP: 990, originalPriceEGP: 1250, inStock: true },
      { id: "v1-3g-wifi-black", sku: "SW-GLS-3G-W-BLK", gangCount: 3, protocol: "Wi-Fi", color: "Black", priceEGP: 1090, originalPriceEGP: 1390, inStock: true },
      { id: "v1-4g-wifi-black", sku: "SW-GLS-4G-W-BLK", gangCount: 4, protocol: "Wi-Fi", color: "Black", priceEGP: 1190, originalPriceEGP: 1490, inStock: true },
      { id: "v1-2g-zigbee-black", sku: "SW-GLS-2G-Z-BLK", gangCount: 2, protocol: "Zigbee", color: "Black", priceEGP: 1050, originalPriceEGP: 1320, inStock: true },
      { id: "v1-3g-zigbee-black", sku: "SW-GLS-3G-Z-BLK", gangCount: 3, protocol: "Zigbee", color: "Black", priceEGP: 1150, originalPriceEGP: 1450, inStock: true },
      { id: "v1-2g-wifi-white", sku: "SW-GLS-2G-W-WHT", gangCount: 2, protocol: "Wi-Fi", color: "White", priceEGP: 990, originalPriceEGP: 1250, inStock: true },
      { id: "v1-2g-wifi-gold", sku: "SW-GLS-2G-W-GLD", gangCount: 2, protocol: "Wi-Fi", color: "Gold", priceEGP: 1050, originalPriceEGP: 1290, inStock: true },
    ],
  },
  {
    id: "ys-switch-zigbee-pro",
    slug: "ultra-mesh-zigbee-switch",
    title: i18("Zigbee 3.0 Ultra-Mesh Smart Switch", "مفتاح ذكي زيجبي 3.0 بتقنية التوصيل الشبكي"),
    category: "switches",
    categoryName: i18("Smart Wall Switches", "مفاتيح الحائط الذكية"),
    description: i18(
      "High-reliability Zigbee 3.0 smart switch designed for robust multi-room installations. Extends the Zigbee mesh network automatically, works even during internet outages, and ensures zero network congestion.",
      "مفتاح ذكي زيجبي 3.0 عالي الاعتمادية مصمم للمنازل والفيلات. يوسع تغطية الشبكة لاسلكياً ويعمل محلياً حتى في حال انقطاع الإنترنت بالكامل دون أي بطء."
    ),
    features: [
      i18("Zigbee 3.0 Mesh repeater capability", "مكرر ومقوي لشبكة الزيجبي في جميع أنحاء المنزل"),
      i18("Local execution continues without internet", "التحكم الموضعي والمؤقتات تستمر حتى عند انقطاع الإنترنت"),
      i18("Minimal power draw with ultra-fast sub-50ms latency", "استجابة فائقة السرعة أقل من 50 مللي ثانية واستهلاك ضئيل"),
      i18("Physical luxury tactile push button or smooth touch", "زر لمسي ميكانيكي مريح أو لوح زجاجي أملس"),
    ],
    specs: {
      protocol: "Zigbee",
      voltage: "110V–240V AC",
      neutralWireRequired: true,
      voiceCompatibility: ["Amazon Alexa (with Hub)", "Google Home", "Home Assistant"],
      appControl: "Tuya / Smart Life / Home Assistant",
      dimensions: "86 × 86 × 37 mm",
      maxLoad: "800W / Gang",
    },
    basePriceEGP: 1050,
    originalPriceEGP: 1350,
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Zigbee",
    inStock: true,
    isPopular: true,
    rating: 5.0,
    reviewsCount: 29,
    availableColors: ["Black", "White", "Gold", "Gray"],
    availableGangs: [1, 2, 3, 4],
    variants: [
      { id: "z-1g", sku: "ZB-PRO-1G", gangCount: 1, protocol: "Zigbee", color: "Black", priceEGP: 950, originalPriceEGP: 1200, inStock: true },
      { id: "z-2g", sku: "ZB-PRO-2G", gangCount: 2, protocol: "Zigbee", color: "Black", priceEGP: 1050, originalPriceEGP: 1350, inStock: true },
      { id: "z-3g", sku: "ZB-PRO-3G", gangCount: 3, protocol: "Zigbee", color: "Black", priceEGP: 1190, originalPriceEGP: 1490, inStock: true },
      { id: "z-4g", sku: "ZB-PRO-4G", gangCount: 4, protocol: "Zigbee", color: "Black", priceEGP: 1290, originalPriceEGP: 1590, inStock: true },
    ],
  },
  {
    id: "ys-smart-dimmer",
    slug: "smart-rotary-touch-dimmer",
    title: i18("Intelligent Rotary & Touch LED Dimmer", "دايمر إضاءة ذكي دائري ولمسي لمصابيح LED"),
    category: "lighting",
    categoryName: i18("Smart Lighting & Dimmers", "الإضاءة والدايمر الذكي"),
    description: i18(
      "Precision LED brightness controller with stepless dimming from 1% to 100%. Create cozy cinema atmospheres, gradual sunrise wakeups, and energy-saving lighting modes.",
      "مفتاح خافت إضاءة رقمي متطور يتيح ضبط سطوع لمبات الـ LED بسلاسة من 1% إلى 100%. مناسب لأجواء السينما والنوم والاستيقاظ التدريجي وتوفير الكهرباء."
    ),
    features: [
      i18("Smooth flicker-free dimming curve", "تعتيم ناعم ومستقر بدون أي وميض للعين"),
      i18("Remembers last brightness setting on power cycle", "ذاكرة ذكية تحفظ درجة السطوع المفضلة بعد انقطاع الكهرباء"),
      i18("Voice control: 'Alexa, set living room to 40%'", "تحكم صوتي: 'أليكسا، اضبطي إضاءة الصالون على 40%'"),
      i18("RGB color temperature synchronization", "دعم مزامنة درجات حرارة الإضاءة بين الأبيض الدافئ والبارد"),
    ],
    specs: {
      protocol: "Wi-Fi",
      voltage: "220V–240V AC",
      neutralWireRequired: true,
      voiceCompatibility: ["Alexa", "Google Assistant"],
      appControl: "Smart Life / Tuya",
      dimensions: "86 × 86 mm",
      maxLoad: "300W Dimmable LED",
    },
    basePriceEGP: 1250,
    originalPriceEGP: 1550,
    images: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Wi-Fi",
    inStock: true,
    rating: 4.8,
    reviewsCount: 16,
    availableColors: ["Black", "White", "Gold"],
  },

  // ─── B. HUBS & GATEWAYS ─────────────────────────────────────────────────────
  {
    id: "ys-hub-hybrid",
    slug: "multi-mode-zigbee-ble-gateway",
    title: i18("YSMED Multi-Mode Gateway (Zigbee 3.0 + Bluetooth + Wi-Fi)", "بوابة تحكم مركزية متعددة البروتوكولات (زيجبي + بلوتوث + واي فاي)"),
    category: "gateways",
    categoryName: i18("Hubs & Gateways", "بوابات ومركبات التحكم"),
    description: i18(
      "The brain of your smart home. Connects up to 128 Zigbee and Bluetooth devices simultaneously, freeing your home Wi-Fi router from device overload while enabling local automation scenes.",
      "عقل منزلك الذكي. يربط حتى 128 جهازاً ومستشعراً في وقت واحد عبر بروتوكول Zigbee 3.0 لرفع العبء عن راوتر الواي فاي المنزلي وتنفيذ السيناريوهات بسرعة خيالية محلياً."
    ),
    features: [
      i18("Connects up to 128 smart devices simultaneously", "ربط حتى 128 جهاز ومستشعر في نفس الوقت"),
      i18("Supports Zigbee 3.0, BLE Mesh, and Wi-Fi", "دعم شامل لزيجبي 3.0 وبلوتوث ميش وواي فاي"),
      i18("Local scene execution ensures automation runs 24/7", "تنفيذ السيناريوهات محلياً حتى دون إنترنت"),
      i18("Ethernet RJ45 port + High-gain dual internal antennas", "منفذ شبكة كابل إيثرنت وهوائي داخلي عالي التغطية"),
    ],
    specs: {
      protocol: "Hybrid (Wi-Fi + Zigbee)",
      voltage: "5V 1A DC (Type-C power adapter included)",
      neutralWireRequired: "N/A (Standard Plug-in)",
      voiceCompatibility: ["Amazon Alexa", "Google Home", "Home Assistant"],
      appControl: "Smart Life / Tuya / YSMED Hub App",
      dimensions: "90 × 90 × 20 mm",
    },
    basePriceEGP: 1750,
    originalPriceEGP: 2200,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Hybrid (Wi-Fi + Zigbee)",
    inStock: true,
    isPopular: true,
    isDeal: true,
    rating: 4.95,
    reviewsCount: 42,
  },

  // ─── C. SMART LOCKS ─────────────────────────────────────────────────────────
  {
    id: "ys-lock-face-pro",
    slug: "biometric-face-video-smart-lock",
    title: i18("Biometric 3D Face Recognition & Video Intercom Smart Lock", "قفل باب ذكي ببصمة الوجه ثلاثية الأبعاد والشاشة والكاميرا التفاعلية"),
    category: "locks",
    categoryName: i18("Smart Door Locks", "الأقفال الذكية والأبواب"),
    description: i18(
      "Luxury aviation-grade aluminum smart lock with built-in 1080p wide-angle camera, color interior display screen, 3D facial recognition, live mobile intercom, fingerprint reader, RFID cards, PIN codes, and temporary guest passwords.",
      "قفل أبواب فاخر من الألومنيوم المقاوم للسرقة مع كاميرا مدمجة وشاشة داخلية بدقة فائقة. يدعم بصمة الوجه ثلاثية الأبعاد، بصمة الإصبع، بطاقات RFID، الأرقام السرية، والتحدث مع الزائر عبر الموبايل من أي مكان."
    ),
    features: [
      i18("3D structured light facial unlock in under 0.5s", "فتح فوري ببصمة الوجه ثلاثية الأبعاد في نصف ثانية"),
      i18("Built-in video doorbell with two-way voice call", "جرس فيديو ذكي ومكالمة ثنائية مباشرة مع الزائر على الهاتف"),
      i18("7 Unlock Methods: Face, Fingerprint, App, PIN, RFID, Key, OTP", "7 طرق لفتح الباب: وجه، بصمة، تطبيق، رمز، كارت، مفتاح، رمز مؤقت"),
      i18("Stainless steel multi-point anti-theft mortise", "كالون أمان متين متعدد النقاط من الفولاذ المقاوم للصدأ"),
      i18("Rechargeable 4200mAh lithium battery (8-10 months life)", "بطارية ليثيوم قابلة لإعادة الشحن تكفي 8 إلى 10 أشهر"),
    ],
    specs: {
      protocol: "Wi-Fi",
      voltage: "7.4V Rechargeable Li-Ion Battery",
      neutralWireRequired: "Battery Operated",
      voiceCompatibility: ["Live App Video Notification"],
      appControl: "Smart Life / Tuya",
      dimensions: "400 × 75 × 25 mm",
    },
    basePriceEGP: 6850,
    originalPriceEGP: 8500,
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Wi-Fi",
    inStock: true,
    isPopular: true,
    isDeal: true,
    rating: 4.9,
    reviewsCount: 24,
    availableColors: ["Black", "Gray"],
  },

  // ─── D. TOUCH CONTROL PANELS ───────────────────────────────────────────────
  {
    id: "ys-panel-10inch",
    slug: "luxury-wall-automation-screen",
    title: i18("YSMED Horizon 10.1\" Smart Wall Automation Console", "شاشة تحكم جدارية ذكية 10.1 بوصة للمنازل والفيلات"),
    category: "panels",
    categoryName: i18("Touch Control Panels", "شاشات اللمس الجدارية"),
    description: i18(
      "The ultimate whole-home control center. High-resolution IPS touchscreen with built-in Zigbee gateway, video intercom, multi-room music streaming, climate management, and camera monitor feeds.",
      "مركز التحكم المتكامل لمنزلك. شاشة لمس جدارية IPS مدمج بها بوابة زيجبي، وتتيح التحكم في الإضاءة والمكيفات والستائر، مع عرض كاميرات المراقبة وتشغيل الموسيقى في كل غرفة."
    ),
    features: [
      i18("10.1\" 1920×1200 IPS high-definition display", "شاشة 10.1 بوصة عالية الدقة بألوان زاهية وزوايا رؤية واسعة"),
      i18("Built-in Zigbee Gateway + Dual-band Wi-Fi + Bluetooth", "بوابة زيجبي مدمجة وبلوتوث وواي فاي مزدوج النطاق"),
      i18("Dual integrated high-fidelity stereo speakers (2×5W)", "مكبرات صوت استريو مدمجة عالية النقاء"),
      i18("Live camera stream viewing and video door intercom", "عرض مباشر لكاميرات المراقبة والتحدث مع جرس الباب الذكي"),
    ],
    specs: {
      protocol: "Hybrid (Wi-Fi + Zigbee)",
      voltage: "110V–240V AC (Standard Wall Flush Box)",
      neutralWireRequired: true,
      voiceCompatibility: ["Built-in Voice Assistant", "Alexa Sync"],
      appControl: "Wall Touch + Android OS + YSMED Cloud",
      dimensions: "250 × 170 × 11 mm",
    },
    basePriceEGP: 9400,
    originalPriceEGP: 11800,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Hybrid (Wi-Fi + Zigbee)",
    inStock: true,
    isPopular: true,
    rating: 5.0,
    reviewsCount: 19,
  },

  // ─── E. SMART CURTAINS & BLINDS ────────────────────────────────────────────
  {
    id: "ys-curtain-motor",
    slug: "whisper-silent-smart-curtain-system",
    title: i18("Whisper-Quiet Electric Smart Curtain Motor & Track", "محرك ومجرى الستائر الذكية فائقة الهدوء"),
    category: "curtains",
    categoryName: i18("Curtain & Blind Motors", "محركات الستائر والشيش"),
    description: i18(
      "Heavy-duty, whisper-quiet motorized curtain system supporting up to 50kg fabric. Open or close by voice, app, scheduled sunrise/sunset times, or gentle hand pull.",
      "نظام ستائر كهربائي ذكي صامت يتحمل أقمشة وبلاك آوت حتى 50 كجم. تحكم بالصوت، الموبايل، مواعيد الشروق والغروب، أو بالسحب اليدوي الخفيف ليبدأ التحرك تلقائياً."
    ),
    features: [
      i18("Whisper-quiet motor (<30dB noise level)", "محرك فائق الهدوء بأقل من 30 ديسيبل لا يوقظ النائم"),
      i18("Touch-Motion trigger: pull gently to start opening", "خاصية اللمس: شد الستارة برفق لتبدأ بالحركة الذاتية"),
      i18("Percentage position control (e.g. open 65% for sun)", "التحكم في نسبة الفتح بدقة (مثل فتح 50% أو 80%)"),
      i18("Customizable heavy-gauge aluminum track length (up to 6m)", "مجرى ألومنيوم مقوى قابل للقص حسب مقاس غرفتك حتى 6 أمتار"),
    ],
    specs: {
      protocol: "Zigbee",
      voltage: "100V–240V AC",
      neutralWireRequired: true,
      voiceCompatibility: ["Alexa", "Google Assistant", "Siri Shortcuts"],
      appControl: "Smart Life / Tuya",
      maxLoad: "Up to 50kg curtain weight",
    },
    basePriceEGP: 3850,
    originalPriceEGP: 4600,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Zigbee",
    inStock: true,
    isPopular: true,
    rating: 4.85,
    reviewsCount: 31,
  },

  // ─── F. SMART SECURITY & SENSORS ──────────────────────────────────────────
  {
    id: "ys-security-kit",
    slug: "complete-perimeter-smart-alarm-kit",
    title: i18("Smart Home Perimeter Defense & Sensor Kit", "باقة أمان متكاملة: مستشعرات الأبواب والحركة وصفارة الإنذار"),
    category: "security",
    categoryName: i18("Surveillance & Sensors", "أنظمة الأمان والمستشعرات"),
    description: i18(
      "Comprehensive wireless security bundle featuring PIR motion sensors, magnetic door/window contact sensors, and a loud 110dB strobe siren with instant mobile alerts.",
      "منظومة حماية متكاملة تضم حساسات حركة بالأشعة تحت الحمراء، حساسات لفتح النوافذ والأبواب، وصفارة إنذار ضوئية وصوتية 110 ديسيبل مع إشعارات فورية على الهاتف."
    ),
    features: [
      i18("Instant intrusion alert notifications on iOS & Android", "إشعارات تنبيه فورية عند رصد أي اختراق أو فتح باب"),
      i18("Loud 110dB strobe siren with backup battery", "صفارة إنذار 110 ديسيبل قوية مع إضاءة ستروب للردع"),
      i18("Tamper-proof casing with battery life up to 2 years", "تصميم محمي من العبث وبطاريات تدوم حتى سنتين"),
      i18("Automated actions (e.g. turn all lights red on breach)", "أتمتة متقدمة: إضاءة جميع لمبات المنزل بلون أحمر عند الخطر"),
    ],
    specs: {
      protocol: "Zigbee",
      voltage: "CR2032 / CR123A Lithium Batteries",
      neutralWireRequired: "Wireless / Battery Operated",
      voiceCompatibility: ["Alexa Security Arm/Disarm"],
      appControl: "Tuya / Smart Life",
    },
    basePriceEGP: 2350,
    originalPriceEGP: 2900,
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Zigbee",
    inStock: true,
    rating: 4.9,
    reviewsCount: 18,
  },

  // ─── G. CLIMATE CONTROL ───────────────────────────────────────────────────
  {
    id: "ys-climate-controller",
    slug: "smart-infrared-ac-climate-hub",
    title: i18("Smart Omni-Directional AC & Climate Controller", "وحدة التحكم الذكية في المكيفات والشاشات بزاوية 360 درجة"),
    category: "climate",
    categoryName: i18("AC & Climate Control", "التحكم بالتكييف والمناخ"),
    description: i18(
      "Turn any traditional split or VRF air conditioner into a smart AC. Control temperature from outside your home, automate cooling before you arrive, and maintain comfortable humidity levels.",
      "حول تكييفك العادي إلى تكييف فائق الذكاء. شغل التكييف واضبط البرودة وأنت في طريقك إلى المنزل، ووفر حتى 30% من استهلاك الكهرباء عبر الجداول الذكية ومستشعرات الحرارة."
    ),
    features: [
      i18("Pre-cool your home before arriving during hot summers", "تشغيل التبريد المسبق للصالون أو غرفة النوم قبل وصولك"),
      i18("Built-in temperature & humidity sensor with OLED screen", "شاشة مدمجة تعرض الحرارة والرطوبة في الغرفة لحظياً"),
      i18("Over 5,000 AC brand codes supported (Sharp, Carrier, LG, Gree...)", "متوافق مع جميع ماركات التكييف بمصر (شارب، كاريير، إل جي، جيري...)"),
      i18("Saves up to 30% on electricity bills via eco-schedules", "توفير حتى 30% من فاتورة الكهرباء عبر الإطفاء الآلي عند مغادرة الغرفة"),
    ],
    specs: {
      protocol: "Wi-Fi",
      voltage: "5V 1A USB",
      neutralWireRequired: "N/A",
      voiceCompatibility: ["Alexa", "Google Assistant"],
      appControl: "Smart Life / Tuya",
      dimensions: "65 × 65 × 17 mm",
    },
    basePriceEGP: 950,
    originalPriceEGP: 1200,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Wi-Fi",
    inStock: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 45,
  },

  // ─── H. SMART POWER & ENERGY ──────────────────────────────────────────────
  {
    id: "ys-smart-plug-meter",
    slug: "smart-plug-with-energy-monitoring",
    title: i18("16A Smart Socket Plug with Live Energy Meter", "فيشة ذكية 16 أمبير مع قياس ومراقبة استهلاك الكهرباء"),
    category: "energy",
    categoryName: i18("Power & Energy Meters", "المقابس وإدارة الطاقة"),
    description: i18(
      "Heavy-duty smart plug capable of running water heaters, irons, espresso machines, and heaters up to 3600W. Tracks kWh consumption in real time and cuts off power on overload.",
      "فيشة ذكية تتحمل أحمالاً ثقيلة حتى 16 أمبير (3600 واط) للسخانات وماكينات القهوة والدفايات. تقيس استهلاك الكيلوواط لحظياً وتقطع الكهرباء عند الحمل الزائد لحماية أجهزتك."
    ),
    features: [
      i18("Real-time voltage, current, and wattage monitoring", "مراقبة لحظية للفولت والأمبير والواط المستهلك"),
      i18("Child-safety shutter and flame-retardant casing", "أمان وحماية للأطفال ومقاومة عالية للاشتعال"),
      i18("Overload & surge protection with automatic cutoff", "فصل أوتوماتيكي سريع عند تذبذب الجهد أو زيادة الحمل"),
      i18("Schedule water heater to operate only when needed", "تشغيل سخان المياه أوتوماتيكياً قبل الاستيقاظ وإطفائه لتوفير الكهرباء"),
    ],
    specs: {
      protocol: "Wi-Fi",
      voltage: "100V–240V AC 16A Max",
      neutralWireRequired: "Plug-in",
      voiceCompatibility: ["Alexa", "Google Assistant"],
      appControl: "Tuya / Smart Life",
      maxLoad: "3680W (16A)",
    },
    basePriceEGP: 480,
    originalPriceEGP: 650,
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Wi-Fi",
    inStock: true,
    isDeal: true,
    rating: 4.75,
    reviewsCount: 52,
  },

  // ─── I. VOICE ASSISTANT ───────────────────────────────────────────────────
  {
    id: "ys-voice-echo-hub",
    slug: "alexa-voice-assistant-hub",
    title: i18("Smart Home Voice Controller (Alexa & Display Compatible)", "مساعد صوتي ذكي للمنزل يدعم الأوامر الصوتية باللغتين"),
    category: "gateways",
    categoryName: i18("Voice Assistant Controllers", "وحدات المساعد الصوتي"),
    description: i18(
      "High-fidelity smart speaker with far-field voice recognition. Speak natural commands to turn off lights, adjust AC, play music, or activate whole-house security.",
      "مكبر صوت ذكي بميكروفونات بعيدة المدى لالتقاط صوتك من أي زاوية في الغرفة. تحكم في إضاءة منزلك، التكييف، تشغيل الموسيقى والقرآن، وتفعيل وضع الخروج بصوتك."
    ),
    features: [
      i18("Far-field microphones hear you across the room", "ميكروفونات متطورة تسمع صوتك حتى أثناء تشغيل الموسيقى"),
      i18("Bilingual voice command recognition", "دعم الأوامر الصوتية باللغتين الإنجليزية والعربية"),
      i18("High-clarity 360-degree room filling sound", "صوت محيطي نقي وعميق 360 درجة"),
    ],
    specs: {
      protocol: "Wi-Fi",
      voltage: "12V DC Adapter",
      neutralWireRequired: "Standard Adapter",
      voiceCompatibility: ["Amazon Alexa", "YSMED Integration"],
      appControl: "Alexa / Smart Life",
    },
    basePriceEGP: 2850,
    originalPriceEGP: 3400,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Wi-Fi",
    inStock: true,
    rating: 4.9,
    reviewsCount: 36,
  },

  // ─── J. MULTI-ROOM AUDIO ──────────────────────────────────────────────────
  {
    id: "ys-audio-ceiling",
    slug: "hifi-in-ceiling-smart-speakers",
    title: i18("In-Ceiling Hi-Fi Smart Audio System & Bluetooth Amp", "نظام صوتي مدمج بالسقف مع مكبر صوت رقمي وبلوتوث"),
    category: "audio",
    categoryName: i18("Multi-Room Audio", "الأنظمة الصوتية متعددة الغرف"),
    description: i18(
      "Discreet frameless in-ceiling speaker pair with a wall-mounted touch Bluetooth & Wi-Fi amplifier. Stream your favorite playlists or holy Quran independently in every room.",
      "زوج من السماعات السقفية الفاخرة بدون إطار مع مضخم صوت رقمي مدمج بالحائط. تشغيل الموسيقى أو القرآن في كل غرفة على حدة أو مزامنة الصوت في الشقة بأكملها."
    ),
    features: [
      i18("Frameless magnetic white grille paints to match ceiling", "شبكة مغناطيسية بيضاء بدون حواف تندمج تماماً مع ديكور السقف"),
      i18("Crystal-clear acoustic clarity with 6.5\" Kevlar drivers", "صوت فائق الوضوح ومضخم بيز قوي"),
      i18("Bluetooth 5.0, Wi-Fi AirPlay, and AUX input", "دعم البلوتوث والواي فاي والمدخل الصوتي السلكي"),
    ],
    specs: {
      protocol: "Wi-Fi",
      voltage: "220V AC",
      neutralWireRequired: true,
      voiceCompatibility: ["AirPlay", "Spotify Connect", "Bluetooth"],
      appControl: "WiiM / Tuya / Direct Bluetooth",
      maxLoad: "60W + 60W RMS",
    },
    basePriceEGP: 4950,
    originalPriceEGP: 5900,
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    ],
    protocol: "Wi-Fi",
    inStock: true,
    rating: 4.88,
    reviewsCount: 14,
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// 3. READY-MADE SMART HOME PACKAGES (APARTMENTS & VILLAS)
// ═════════════════════════════════════════════════════════════════════════════
export const smartPackages: SmartPackage[] = [
  {
    id: "pkg-studio",
    slug: "studio-smart",
    name: i18("Studio Smart", "باقة الاستوديو الذكي"),
    propertyType: i18("Studio Apartment", "استوديو / شقة صغيرة"),
    roomsCount: 1,
    tagline: i18("Entry-level automation for studios and compact spaces", "أتمتة أساسية ومريحة للاستوديوهات والمساحات المدمجة"),
    description: i18(
      "Ideal starter package providing complete control over studio lighting, main appliances, and entrance access without rewiring.",
      "باقة مثالية للمبتدئين توفر تحكماً كاملاً في إضاءة الاستوديو، الأجهزة الكهربائية الرئيسية، وتأمين باب الدخول دون أي تكسير."
    ),
    includedDevices: [
      { name: i18("Luxury Crystal Glass Smart Switch (2-Gang)", "مفتاح زجاجي ذكي ثنائي اللمس"), quantity: 2, icon: "ToggleLeft" },
      { name: i18("Smart Wi-Fi Multi-Mode Hub", "بوابة تحكم مركزية ذكية"), quantity: 1, icon: "Radio" },
      { name: i18("Heavy-Duty Smart Socket Plug (16A)", "فيشة ذكية 16 أمبير للأجهزة"), quantity: 1, icon: "Zap" },
      { name: i18("Smart Door/Window Sensor", "مستشعر أمان لفتح الباب والنافذة"), quantity: 1, icon: "Shield" },
      { name: i18("Omni-Directional AC Climate Controller", "وحدة تحكم ذكية في التكييف"), quantity: 1, icon: "ThermometerSnowflake" },
    ],
    systemType: "Wi-Fi",
    mainFeatures: [
      i18("Remote lighting control from anywhere via phone", "تحكم في الإضاءة من الهاتف من أي مكان في العالم"),
      i18("Turn on AC automatically before returning home", "تشغيل التكييف مسبقاً قبل وصولك للمنزل"),
      i18("Instant notification if studio door is opened", "إشعار فوري على هاتفك عند فتح باب الاستوديو"),
      i18("Voice assistant compatibility (Alexa & Google)", "متوافقة مع المساعد الصوتي أليكسا وجوجل"),
    ],
    equipmentPriceEGP: 4890,
    installationPriceEGP: 1200,
    discountPercentage: 15,
    idealFor: i18("Studio apartments, student flats, and bachelor pads", "الاستوديوهات، سكن الطلبة، والشقق المدمجة"),
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pkg-1bed",
    slug: "smart-start-1bed",
    name: i18("Smart Start", "باقة البداية الذكية"),
    propertyType: i18("1 Bedroom Apartment", "شقة غرفة نوم وصالة"),
    roomsCount: 2,
    tagline: i18("Essential smart living for modern couples & singles", "المعيشة الذكية الأساسية للشباب والعائلات الصغيرة"),
    description: i18(
      "Complete lighting and climate control for the master bedroom, living hall, bathroom, and kitchen with security entrance alert.",
      "تحكم متكامل في إضاءة وتكييف غرفة النوم الرئيسية والصالة والمطبخ، مع حماية أمنية على باب الشقة."
    ),
    includedDevices: [
      { name: i18("Luxury Smart Wall Switches (2/3 Gang)", "مفاتيح حائط ذكية زجاجية ثنائية وثلاثية"), quantity: 3, icon: "ToggleLeft" },
      { name: i18("Hybrid Zigbee + Wi-Fi Hub", "بوابة تحكم زيجبي وواي فاي"), quantity: 1, icon: "Radio" },
      { name: i18("Smart AC Climate Controllers", "وحدات تحكم في تكييفات الغرفة والصالة"), quantity: 2, icon: "ThermometerSnowflake" },
      { name: i18("Smart Plugs with Energy Monitor", "أفياش ذكية بمراقبة استهلاك الطاقة"), quantity: 2, icon: "Zap" },
      { name: i18("Magnetic Door Contact Sensor", "مستشعر مغناطيسي لباب الدخول"), quantity: 1, icon: "Shield" },
    ],
    systemType: "Hybrid (Wi-Fi + Zigbee)",
    mainFeatures: [
      i18("Separate Bedroom & Living Room smart lighting scenes", "أجواء إضاءة مستقلة لغرفة النوم والصالون"),
      i18("Auto-turn off water heater and appliances on sleep", "إطفاء السخان والأجهزة تلقائياً عند النوم"),
      i18("Energy saving of up to 25% on electricity bills", "توفير يصل إلى 25% من استهلاك الكهرباء"),
    ],
    equipmentPriceEGP: 7450,
    installationPriceEGP: 1800,
    discountPercentage: 15,
    idealFor: i18("Modern 1-bedroom apartments (60–90 m²)", "شقق غرفة وصالة بمساحة 60 إلى 90 متر مربع"),
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pkg-2bed",
    slug: "smart-comfort-2bed",
    name: i18("Smart Comfort", "باقة الراحة الذكية"),
    propertyType: i18("2 Bedrooms Apartment", "شقة غرفتين وصالة"),
    roomsCount: 3,
    tagline: i18("Everyday home automation for growing modern families", "الأتمتة المنزلية المتكاملة للعائلات العصرية"),
    description: i18(
      "Adds automated motorized curtains, multi-room lighting, dual AC controls, and water-leak protection for complete everyday peace of mind.",
      "تضيف ستائر كهربائية ذكية، أتمتة إضاءة لكافة الغرف، تحكم بالمكيفات، ومستشعرات أمان وحماية من تسريب المياه."
    ),
    includedDevices: [
      { name: i18("Crystal Glass Smart Switches (2/3 Gang)", "مفاتيح حائط ذكية لكافة الغرف"), quantity: 5, icon: "ToggleLeft" },
      { name: i18("Zigbee 3.0 Ultra Hub Gateway", "بوابة تحكم شبكية زيجبي 3.0"), quantity: 1, icon: "Radio" },
      { name: i18("Whisper-Quiet Smart Curtain Motor & Track", "محرك ومجرى ستارة ذكية لغرفة المعيشة"), quantity: 1, icon: "Blinds" },
      { name: i18("Smart AC Controllers", "أجهزة تحكم بالتكييفات"), quantity: 2, icon: "ThermometerSnowflake" },
      { name: i18("Smart Plugs (16A Heavy Duty)", "أفياش ذكية للأجهزة الثقيلة"), quantity: 2, icon: "Zap" },
      { name: i18("Door & Window Security Sensors", "مستشعرات أمان للأبواب والشبابيك"), quantity: 3, icon: "Shield" },
      { name: i18("Water Leak Sensor", "مستشعر كشف تسريب المياه بالمطبخ/الحمام"), quantity: 1, icon: "Droplet" },
    ],
    systemType: "Zigbee",
    mainFeatures: [
      i18("Motorized curtain opens automatically with morning sun", "فتح الستائر تلقائياً مع شروق الشمس وغلقها بالمساء"),
      i18("Full family access via individual smartphones", "مشاركة التحكم مع كافة أفراد العائلة عبر هواتفهم"),
      i18("Water leak automatic shutoff alert to prevent damage", "إنذار فوري عند تسريب المياه لتفادي أي أضرار بالباركيه"),
    ],
    equipmentPriceEGP: 12900,
    installationPriceEGP: 2600,
    discountPercentage: 18,
    isPopular: true,
    idealFor: i18("Standard 2-bedroom apartments (100–140 m²)", "شقق غرفتين نوم وصالة بمساحة 100 إلى 140 متر مربع"),
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pkg-3bed",
    slug: "smart-plus-3bed",
    name: i18("Smart Plus", "باقة سمارت بلس الشاملة"),
    propertyType: i18("3 Bedrooms Apartment", "شقة 3 غرف نوم وريسبشن"),
    roomsCount: 4,
    tagline: i18("Expanded whole-home control & biometric smart security", "تحكم شامل بالمنزل بالكامل مع أمان بيومتري متقدم"),
    description: i18(
      "Our most popular residential package. Includes biometric face & fingerprint smart door lock, motorized curtains for salon & master bed, 7 smart switches, AC controls, and perimeter security.",
      "الباقة الأكثر طلباً في مصر. تشمل قفل باب ذكي ببصمة الوجه والإصبع، ستائر كهربائية للريسبشن والماستر، 7 مفاتيح ذكية، ومستشعرات أمان شاملة."
    ),
    includedDevices: [
      { name: i18("Luxury Crystal Smart Switches (1/2/3 Gang)", "مفاتيح زجاجية لمسية لكافة الغرف"), quantity: 7, icon: "ToggleLeft" },
      { name: i18("Biometric Face & Fingerprint Smart Lock", "قفل باب ذكي ببصمة الوجه والكاميرا"), quantity: 1, icon: "Lock" },
      { name: i18("Multi-Mode Zigbee 3.0 Pro Gateway", "بوابة تحكم زيجبي احترافية عالية التغطية"), quantity: 1, icon: "Radio" },
      { name: i18("Whisper Smart Curtain Motors & Tracks", "نظامي ستائر ذكية للريسبشن وغرفة النوم"), quantity: 2, icon: "Blinds" },
      { name: i18("Smart AC Controllers", "أجهزة تحكم بالتكييفات"), quantity: 3, icon: "ThermometerSnowflake" },
      { name: i18("LED Dimmer Controllers", "دايمر إضاءة ذكي للصالون"), quantity: 1, icon: "Lightbulb" },
      { name: i18("Smart Plugs (16A)", "أفياش ذكية للغسالة والسخان"), quantity: 3, icon: "Zap" },
      { name: i18("Security Motion & Door Sensors", "مستشعرات أمان وحركة كاملة"), quantity: 4, icon: "Shield" },
    ],
    systemType: "Hybrid (Wi-Fi + Zigbee)",
    mainFeatures: [
      i18("Keyless entry: unlock by face, fingerprint, or mobile", "دخول بدون مفاتيح: فتح بالوجه أو البصمة أو الموبايل"),
      i18("One-touch 'Goodbye Mode' turns off everything safely", "زر 'مغادرة المنزل' يغلق جميع الإضاءات والمكيفات بلمسة واحدة"),
      i18("Live doorbell video call on your smartphone", "اتصال فيديو مباشر من جرس الباب إلى هاتفك أينما كنت"),
      i18("Automated cinema mode with dimmed lights & closed blinds", "وضع السينما: خفض الإضاءة وغلق الستائر بكلمة واحدة"),
    ],
    equipmentPriceEGP: 22800,
    installationPriceEGP: 3800,
    discountPercentage: 20,
    isPopular: true,
    isRecommended: true,
    idealFor: i18("3-bedroom family apartments (150–220 m²)", "شقق 3 غرف وريسبشن بمساحة 150 إلى 220 متر مربع"),
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pkg-4bed",
    slug: "smart-premium-4bed",
    name: i18("Smart Premium", "باقة بريميوم الفاخرة"),
    propertyType: i18("4 Bedrooms Apartment / Duplex", "شقة 4 غرف / دوبلكس"),
    roomsCount: 5,
    tagline: i18("Advanced automation, touch console & integrated audio", "أتمتة متطورة مع شاشة تحكم جدارية ونظام صوتي"),
    description: i18(
      "High-luxury living with a 10.1\" wall automation screen, in-ceiling smart audio system, 10 smart switches, 3 motorized curtains, smart lock, and full multi-zone climate control.",
      "مستوى الرفاهية الكامل: شاشة جدارية لمسية 10.1 بوصة، نظام صوتي سقف فاخر، 10 مفاتيح ذكية، 3 ستائر كهربائية، قفل إلكتروني وتحكم كامل بالمناخ."
    ),
    includedDevices: [
      { name: i18("Wall Touch Automation Screen (10.1\")", "شاشة تحكم جدارية ذكية 10.1 بوصة"), quantity: 1, icon: "Tablet" },
      { name: i18("Luxury Crystal Smart Switches (1/2/3 Gang)", "مفاتيح حائط ذكية لكافة مساحات الشقة"), quantity: 10, icon: "ToggleLeft" },
      { name: i18("Face Recognition & Video Smart Lock", "قفل باب ذكي ببصمة الوجه والشاشة"), quantity: 1, icon: "Lock" },
      { name: i18("Smart Curtain Motors & Tracks", "أنظمة ستائر ذكية صامتة"), quantity: 3, icon: "Blinds" },
      { name: i18("In-Ceiling Hi-Fi Audio System & Amp", "نظام صوتي سقف ستيريو فاخر"), quantity: 1, icon: "Speaker" },
      { name: i18("Dual Zigbee 3.0 Mesh Gateways", "بوابتا تحكم زيجبي شبكية فائقة الاستقرار"), quantity: 2, icon: "Radio" },
      { name: i18("Smart AC Controllers", "أجهزة تحكم بالتكييفات"), quantity: 4, icon: "ThermometerSnowflake" },
      { name: i18("Smart Plugs & Relays", "أفياش وقواطع طاقة ذكية"), quantity: 4, icon: "Zap" },
      { name: i18("Complete Security & Surveillance Kit", "منظومة أمان وحساسات حركة كاملة"), quantity: 5, icon: "Shield" },
    ],
    systemType: "Hybrid (Wi-Fi + Zigbee)",
    mainFeatures: [
      i18("Central 10.1\" touchscreen controls entire residence", "شاشة مركزية فاخرة بالصالون للتحكم بكامل البيت وعرض الكاميرات"),
      i18("Multi-room sound streaming from Spotify, Quran, or Bluetooth", "بث صوتي عالي النقاء للقرآن والموسيقى بالسقف"),
      i18("Multi-floor or duplex interconnected automation", "ربط كامل بين طابقي الدوبلكس دون انقطاع الإشارة"),
    ],
    equipmentPriceEGP: 38500,
    installationPriceEGP: 5500,
    discountPercentage: 22,
    idealFor: i18("Large 4-bedroom apartments and duplexes (220–350 m²)", "الشقق الكبيرة 4 غرف والدوبلكس (220 إلى 350 متر)"),
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pkg-luxury",
    slug: "smart-luxury-5bed",
    name: i18("Smart Luxury", "باقة الرفاهية المطلقة"),
    propertyType: i18("5+ Bedrooms / Penthouse", "شقق 5 غرف وبنتهاوس"),
    roomsCount: 6,
    tagline: i18("Uncompromising smart luxury tailored for prestigious estates", "الفخامة والتحكم التام لأرقى المساحات والبنتهاوس"),
    description: i18(
      "Comprehensive multi-zone automation with dual touchscreen consoles, multi-room audio in salon & master, motorized curtains across all zones, and integration with outdoor lighting.",
      "أتمتة شاملة متعددة المناطق مع شاشتي تحكم جداريتين، نظام صوتي متعدد الغرف، ستائر كهربائية لجميع الواجهات وإضاءة خارجية ذكية."
    ),
    includedDevices: [
      { name: i18("10.1\" Wall Touch Consoles", "شاشات تحكم جدارية ذكية"), quantity: 2, icon: "Tablet" },
      { name: i18("Crystal Glass Smart Switches", "مفاتيح زجاجية كريستالية لمسية"), quantity: 14, icon: "ToggleLeft" },
      { name: i18("Biometric Face Smart Lock Pro", "قفل باب رئيسي بيومتري بالكاميرا"), quantity: 1, icon: "Lock" },
      { name: i18("Smart Curtain Motors & Tracks", "ستائر كهربائية ذكية"), quantity: 5, icon: "Blinds" },
      { name: i18("Multi-Room Audio Amplifiers & Speakers", "أنظمة صوتية سقفية مستقلة"), quantity: 2, icon: "Speaker" },
      { name: i18("Smart AC Controllers", "أجهزة تحكم ذكية بالمكيفات"), quantity: 6, icon: "ThermometerSnowflake" },
      { name: i18("High-Density Zigbee Gateways", "بوابات ربط شبكي متعددة"), quantity: 3, icon: "Radio" },
      { name: i18("Full Security Suite + Siren", "منظومة إنذار وحساسات اختراق وصفارة"), quantity: 8, icon: "Shield" },
    ],
    systemType: "Hybrid (Wi-Fi + Zigbee)",
    mainFeatures: [
      i18("Customized architectural lighting scenes (Welcoming, Party, Relaxation)", "سيناريوهات إضاءة معمارية فاخرة (استقبال، هدوء، سفر)"),
      i18("Separate audio zones: Quran in salon, lounge music on terrace", "مناطق صوتية منفصلة للصالون وغرفة النوم والتراس"),
      i18("Dedicated YSMED priority engineering support", "دعم فني هندسي مميز وأولوية في الصيانة"),
    ],
    equipmentPriceEGP: 56900,
    installationPriceEGP: 7500,
    discountPercentage: 25,
    idealFor: i18("Penthouses and large residences (350–550 m²)", "شقق البنتهاوس والقصور السكنية الكبيرة"),
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pkg-villa",
    slug: "smart-villa-estate",
    name: i18("Smart Villa & Palace Estate", "باقة الفيلات والقصور المتكاملة"),
    propertyType: i18("Villa / Palace / Compound", "فيلا مستقلة / قصر / توين هاوس"),
    roomsCount: 8,
    tagline: i18("Multi-zone architectural integration across indoors, gardens & gates", "تكامل هندسي ذكي يشمل الفيلات والحدائق والبوابات والمسابح"),
    description: i18(
      "The pinnacle of smart engineering. Covers central HVAC, outdoor facade lighting, smart garden irrigation, motorized vehicle gates, access control, multi-zone audio, and central monitoring.",
      "قمة الهندسة الذكية. تشمل أتمتة التكييف المركزي، إضاءة الواجهات الخارجية، الري الذكي للحديقة، بوابات السيارات الأوتوماتيكية، والتحكم الصوتي والمرئي."
    ),
    includedDevices: [
      { name: i18("Master Control Wall Screens (10.1\")", "شاشات تحكم جدارية مركزية للفيلا"), quantity: 3, icon: "Tablet" },
      { name: i18("Smart Switches & Dimmer Panels", "مفاتيح حائط ذكية لكافة الأدوار"), quantity: 22, icon: "ToggleLeft" },
      { name: i18("Smart Gates & Access Control", "تحكم في بوابات السيارات وباب الفيلا"), quantity: 2, icon: "Lock" },
      { name: i18("Smart Garden Irrigation Automation", "نظام ري ذكي للحديقة حسب رطوبة التربة"), quantity: 1, icon: "Sprout" },
      { name: i18("Motorized Curtain Systems", "ستائر كهربائية لكافة صالات الاستقبال"), quantity: 8, icon: "Blinds" },
      { name: i18("Multi-Zone Audio Systems", "أنظمة صوتية سقفية وخارجية مقاومة للطقس"), quantity: 4, icon: "Speaker" },
      { name: i18("AC & Central HVAC Controllers", "تحكم في التكييفات المركزية والاسبليت"), quantity: 8, icon: "ThermometerSnowflake" },
      { name: i18("Industrial-Grade Zigbee / KNX Backbone", "بنية شبكية صناعية زيجبي وKNX"), quantity: 1, icon: "Radio" },
    ],
    systemType: "KNX",
    mainFeatures: [
      i18("Automatic garden irrigation based on weather forecasts", "ري الحديقة أوتوماتيكياً استناداً إلى الطقس ورطوبة التربة"),
      i18("Facade & landscape lighting schedule with astronomical clock", "جدولة إضاءة الواجهات والحديقة وفقاً لغروب وشروق الشمس الفلكي"),
      i18("Car gate opens automatically via smart app or RFID", "فتح بوابات السيارات تلقائياً عبر الموبايل أو كارت السيارة"),
      i18("Complete system design and turnkey installation by YSMED engineers", "تصميم هندسي وتنفيذ متكامل من فريق مهندسي YSMED"),
    ],
    equipmentPriceEGP: 89000,
    installationPriceEGP: 12000,
    discountPercentage: 25,
    idealFor: i18("Stand-alone villas, twin houses, and luxury estates (450+ m²)", "الفيلات المستقلة والتوين هاوس والقصور (450 متر فما فوق)"),
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// 4. TECHNOLOGY COMPARISON (Wi-Fi vs Zigbee vs KNX)
// ═════════════════════════════════════════════════════════════════════════════
export const techComparisons: TechComparisonItem[] = [
  {
    id: "wifi",
    name: "Wi-Fi Smart Home",
    badge: i18("Direct Connect & Budget-Friendly", "اتصال مباشر واقتصادي"),
    tagline: i18("Direct connectivity through your existing home router without extra hub costs", "اتصال مباشر براوتر منزلك دون الحاجة لشراء جهاز بوابة منفصل"),
    pros: [
      i18("No separate hub or coordinator required", "لا يحتاج إلى جهاز هاب أو وسيط مستقل"),
      i18("Lower upfront investment for small apartments (1-2 rooms)", "تكلفة مبدئية اقتصادية للشقق الصغيرة"),
      i18("Easy direct smartphone pairing and setup", "سهولة تامة في الربط المباشر مع الهاتف"),
    ],
    cons: [
      i18("Can overload home Wi-Fi if adding more than 20–30 devices", "قد يثقل راوتر المنزل عند تركيب أكثر من 25 جهازاً"),
      i18("Dependent on internet and local Wi-Fi router availability", "يعتمد على استقرار راوتر الواي فاي المنزلي"),
    ],
    idealFor: i18("Apartments under 100 m² with under 15 smart devices", "الشقق حتى 100 متر والمشاريع التي تقل عن 15 جهازاً"),
    hubRequired: false,
    rangeMesh: i18("Limited to Wi-Fi router coverage (can use Wi-Fi extenders)", "محدد بمدى الراوتر المنزلي"),
    powerConsumption: i18("Medium (requires continuous AC power)", "متوسط (يحتاج كهرباء مستمرة)"),
    latency: i18("100ms – 300ms", "100 إلى 300 مللي ثانية"),
    brandRecommendation: i18("Best for starters and single-room upgrades", "الخيار الأفضل للبدايات وتطوير الغرف الفردية"),
  },
  {
    id: "zigbee",
    name: "Zigbee 3.0 Mesh",
    badge: i18("The Global Smart Standard — Recommended", "المعيار العالمي الموصى به"),
    tagline: i18("Ultra-low power, lightning-fast local mesh that strengthens with every device added", "شبكة محلية فائقة السرعة تزداد قوة وتغطية مع كل مفتاح جديد"),
    pros: [
      i18("Mesh topology: each mains-powered switch acts as a signal booster", "كل مفتاح يعمل كمكرر ومقوي إشارة تلقائي لبقية أرجاء المنزل"),
      i18("Zero Wi-Fi overload: 100+ devices operate smoothly on 1 hub", "لا يشغل راوتر الواي فاي: أكثر من 100 جهاز على هاب واحد"),
      i18("Local execution: scenes and automation work without internet", "تنفيذ السيناريوهات والمؤقتات محلياً حتى في حال انقطاع الإنترنت"),
      i18("Ultra-low latency (<50ms) and minimal battery drain for sensors", "استجابة فائقة السرعة وبطاريات تدوم لسنتين للمستشعرات"),
    ],
    cons: [
      i18("Requires one Zigbee 3.0 gateway hub (included in packages)", "يتطلب وجود بوابة هاب زيجبي 3.0 واحدة في المنزل"),
    ],
    idealFor: i18("2 to 5-bedroom apartments, duplexes, and family homes", "شقق غرفتين إلى 5 غرف والدوبلكس والشقق العائلية"),
    hubRequired: true,
    rangeMesh: i18("Whole-home mesh coverage expanding with each switch", "تغطية كاملة للمنزل تتوسع ذاتياً مع كل مفتاح"),
    powerConsumption: i18("Ultra-low (sensors last 2+ years on coin battery)", "منخفض جداً (المستشعرات تعمل بالبطارية لسنتين)"),
    latency: i18("<50ms (Instant tactile feel)", "أقل من 50 مللي ثانية (استجابة فورية)"),
    brandRecommendation: i18("YSMED's #1 recommended protocol for 90% of residential homes", "بروتوكول YSMED الأول والموصى به لـ 90% من المنازل"),
  },
  {
    id: "knx",
    name: "KNX Wired Automation",
    badge: i18("Industrial Luxury & Commercial Buildings", "أعلى معايير الفخامة والمنشآت الكبرى"),
    tagline: i18("Hardwired professional building management standard with 30+ year lifespan", "المعيار السلكي العالمي المخصص للفيلات الكبرى والفنادق والمباني الذكية"),
    pros: [
      i18("Industrial-grade reliability with dedicated shielded bus cabling", "اعتمادية صناعية مطلقة عبر كابلات حافلة بيانات مخصصة"),
      i18("Decentralized architecture: no single point of failure", "نظام لامركزي: تعطل أي وحدة لا يؤثر إطلاقاً على باقي النظام"),
      i18("30+ year service life and universal multi-vendor compatibility", "عمر افتراضي يتجاوز 30 عاماً وتوافق عالمي"),
    ],
    cons: [
      i18("Requires specialized pre-wiring during initial construction or renovation", "يتطلب تأسيس وتمديد كابلات خاصة أثناء مرحلة التشطيب"),
      i18("Higher capital investment for hardware and engineering commissioning", "تكلفة استثمارية وتأسيسية أعلى"),
    ],
    idealFor: i18("Large luxury villas, hotels, corporate headquarters, and factories", "الفيلات الكبرى، الفنادق، مقرات الشركات والمصانع"),
    hubRequired: i18("KNX IP Router & Power Supply", "راوتر ومصدر طاقة KNX مخصص"),
    rangeMesh: i18("Up to 1,000 meters per line segment with bus amplifiers", "حتى 1000 متر عبر الكابلات المجدولة"),
    powerConsumption: i18("Engineered low-voltage DC bus", "جهد منخفض موفر للطاقة"),
    latency: i18("<10ms (Real-time hardwired)", "أقل من 10 مللي ثانية (فوري سلكي)"),
    brandRecommendation: i18("Ideal for new construction villas and commercial developments", "الخيار الهندسي الأمثل للفيلات تحت التشطيب والمشاريع التجارية"),
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// 5. SMART HOME FAQ
// ═════════════════════════════════════════════════════════════════════════════
export const smartHomeFaqs = [
  {
    q: i18("Can I control my home remotely while away or traveling abroad?", "هل يمكنني التحكم في منزلي عن بُعد أثناء السفر أو خارج المنزل؟"),
    a: i18(
      "Yes, completely. Once your YSMED smart devices are linked to the cloud, you can turn lights on or off, check if doors are locked, inspect camera feeds, and operate your AC from anywhere in the world with an active internet connection on your phone.",
      "نعم بكل تأكيد. بمجرد ربط الأجهزة بالتطبيق السحابي، يمكنك تشغيل وإطفاء الإضاءات، التحقق من قفل الأبواب، متابعة الكاميرات، وضبط التكييف من أي مكان في العالم عبر هاتفك الذكي."
    ),
  },
  {
    q: i18("Do Zigbee switches require a hub?", "هل تحتاج مفاتيح زيجبي (Zigbee) إلى جهاز هاب أو موزع؟"),
    a: i18(
      "Yes. Zigbee devices communicate via an ultra-low-power radio protocol that requires a Zigbee 3.0 gateway hub to bridge them to your home network. The benefit is massive: 100+ devices run with sub-50ms latency without crowding your Wi-Fi router, and local automation runs even if internet goes down.",
      "نعم. تتواصل أجهزة ومستشعرات الزيجبي عبر تردد لاسلكي موفر للطاقة يتطلب وجود بوابة (Hub) للربط بالإنترنت. الميزة الكبرى هي أن أكثر من 100 مفتاح ومستشعر تعمل بسرعة فائقة دون التأثير على سرعة الواي فاي، وتستمر الأتمتة حتى عند انقطاع الإنترنت."
    ),
  },
  {
    q: i18("Can I install smart switches in an existing apartment without remodeling?", "هل يمكن تركيب المفاتيح الذكية في شقة مشطبة حالياً دون تكسير في الجدران؟"),
    a: i18(
      "Absolutely! YSMED smart wall switches fit standard Egyptian wall junction boxes (86×86 mm). We offer models that support 'No-Neutral Wire' setups using an included micro-capacitor, meaning you can swap out traditional switches in under 15 minutes with zero wall damage.",
      "بالتأكيد! مفاتيح YSMED الذكية مصممة لتناسب مقاسات العلب الجدارية القياسية في مصر (علبة ماجيك 86×86 مم). نوفر أيضاً موديلات تعمل بدون خط محايد (نيوترال) بمكثف مدمج، مما يتيح استبدال المفاتيح القديمة في دقائق معدودة دون أي تكسير أو تشويه للدهانات."
    ),
  },
  {
    q: i18("Is a neutral wire required for smart switches?", "هل يلزم وجود خط نيوترال (Neutral Wire) لتركيب المفاتيح الذكية؟"),
    a: i18(
      "We offer two distinct versions: Neutral Wire versions (ideal for new apartments or when neutral is pulled to the switch box for maximum stability), and No-Neutral versions (perfect for older or existing apartments where only the live line is present in the wall box).",
      "نوفر خيارين: موديلات تتطلب خط نيوترال (وهي الأفضل والأعلى ثباتاً للشقق تحت التشطيب)، وموديلات تعمل بدون نيوترال للشقق المشطبة التي لا يتوفر في علبها سوى السلك الحار (Line)، ليتم التركيب فوراً بسهولة."
    ),
  },
  {
    q: i18("Can I use Alexa or Google Assistant to control my smart home?", "هل يمكنني استخدام أليكسا أو مساعد جوجل للتحكم الصوتي؟"),
    a: i18(
      "Yes. All YSMED smart devices are fully compatible with Amazon Alexa and Google Assistant. You can say 'Alexa, turn on the salon lights', 'Hey Google, set temperature to 23 degrees', or activate preset scenes like 'Movie Night'.",
      "نعم. كافة أجهزة YSMED متوافقة بالكامل مع أمازون أليكسا ومساعد جوجل الصوتي. يمكنك قول: 'أليكسا، شغلي إضاءة الصالون' أو 'Hey Google, set temperature to 23' أو تشغيل سيناريوهات مثل 'وضع السينما' بالأوامر الصوتية."
    ),
  },
  {
    q: i18("Can I combine Wi-Fi and Zigbee devices in the same home?", "هل يمكنني الجمع بين أجهزة الواي فاي وأجهزة الزيجبي في نفس المنزل؟"),
    a: i18(
      "Yes. Through the unified Smart Life / Tuya ecosystem used by YSMED, both Wi-Fi and Zigbee devices appear seamlessly on the exact same dashboard and can trigger each other (e.g., a Zigbee door sensor can turn on a Wi-Fi living room switch instantly).",
      "نعم بكل سلاسة. تعمل جميع أجهزة YSMED ضمن تطبيق موحد، حيث تظهر أجهزة الواي فاي والزيجبي معاً في نفس الواجهة ويمكن ربطها بسيناريو واحد (مثلاً: حساس باب زيجبي يضيء مفتاح صالون واي فاي فوراً)."
    ),
  },
  {
    q: i18("Can YSMED design and install smart systems for villas, hotels, and offices?", "هل تقدم YSMED خدمات التصميم والتركيب المتكامل للفيلات والفنادق والشركات؟"),
    a: i18(
      "Yes. YSMED, as a member of Magdy Group, provides end-to-end engineering services: from electrical layout design and neutral wire infrastructure planning to device supply, physical installation, network optimization, and on-site user training with genuine warranty.",
      "نعم. تقدم YSMED، كإحدى شركات مجموعة مجدي، خدمات هندسية متكاملة تشمل: المعاينة الهندسية وتصميم المخططات الكهربائية، توريد الأجهزة الأصلية، التركيب والبرمجة، ضبط شبكات التغطية، وتدريب العميل مع ضمان معتمد وخدمات ما بعد البيع."
    ),
  },
  {
    q: i18("Can I purchase products without requesting an installation service?", "هل يمكنني شراء الأجهزة فقط بدون طلب خدمة التركيب؟"),
    a: i18(
      "Certainly. You can add any smart switch, lock, or sensor to your shopping cart and order it for delivery anywhere in Egypt. Every product arrives with clear wiring schematics and configuration guides.",
      "بالتأكيد. يمكنك طلب أي جهاز أو مفتاح أو مستشعر وشحنه إلى باب منزلك في أي محافظة داخل مصر، حيث يأتي كل منتج مع مخططات توصيل كهربائي واضحة ودليل إرشادي للتثبيت."
    ),
  },
  {
    q: i18("How do I request a customized smart home package for my specific floor plan?", "كيف يمكنني طلب باقة مخصصة تناسب مساحة ومخطط منزلي تحديداً؟"),
    a: i18(
      "You can use our interactive 'Build Your Own Smart Home' tool above, or fill out the Installation Quotation Form on this page with your room counts. You can even upload your architectural floor plan, and our engineering team will send you a detailed itemized quote within 24 hours.",
      "يمكنك استخدام أداة 'صمم منزلك الذكي' التفاعلية في هذه الصفحة، أو تعبئة نموذج طلب التركيب مع تحديد عدد الغرف ورفع مخطط الشقة، وسيقوم مهندسونا بإرسال مقايسة تفصيلية مدروسة خلال 24 ساعة."
    ),
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// 6. INSTALLATION SERVICES BREAKDOWN
// ═════════════════════════════════════════════════════════════════════════════
export const smartServices = [
  {
    id: "apartments",
    title: i18("Smart Apartments & Penthouses", "الشقق السكنية والبنتهاوس"),
    description: i18(
      "Complete smart conversion for lighting, curtains, climate, and security with zero masonry damage.",
      "تحويل شامل للإضاءات والستائر والمكيفات والأمان دون أي تكسير، للشقق المشطبة وتحت الإنشاء."
    ),
    highlights: [i18("Retrofit existing wall boxes", "تعديل علب الكهرباء القائمة"), i18("Voice & mobile app control", "تحكم صوتي وتطبيق ذكي"), i18("Energy-saving automation", "أتمتة توفير استهلاك الطاقة")],
    icon: "Home",
  },
  {
    id: "villas",
    title: i18("Luxury Villas & Estates", "الفيلات والقصور الفاخرة"),
    description: i18(
      "Multi-zone architectural integration: central HVAC, outdoor landscape lighting, electric gates, and garden irrigation.",
      "تكامل معماري متعدد المناطق: تكييف مركزي، إضاءة واجهات وحدائق، بوابات سيارات، وري ذكي."
    ),
    highlights: [i18("Multi-floor Zigbee/KNX backbone", "بنية شبكية متعددة الطوابق"), i18("Smart garden & perimeter defense", "أمان للأسوار وري الحدائق"), i18("Touchscreen consoles in all halls", "شاشات لمس جدارية مركزية")],
    icon: "Building2",
  },
  {
    id: "hotels",
    title: i18("Smart Hotels & Hospitality", "الفنادق والضيافة الذكية"),
    description: i18(
      "Guest-room energy management (GRMS), smart RFID locks, welcome scenes, and centralized management console.",
      "أنظمة إدارة غرف النزلاء (GRMS)، أقفال ذكية بالبطاقة، سيناريوهات ترحيب، وتحكم مركزي موفر للطاقة."
    ),
    highlights: [i18("Keycard energy saver switches", "أنظمة توفير الطاقة بكارت الغرفة"), i18("Central reception dashboard", "لوحة تحكم مركزية للاستقبال"), i18("Curtain & climate guest control", "راحة الضيف في التكييف والستائر")],
    icon: "Hotel",
  },
  {
    id: "offices",
    title: i18("Smart Offices & Boardrooms", "الشركات وقاعات الاجتماعات"),
    description: i18(
      "Automated presentation scenes, smart access control, occupancy sensors, and meeting room booking indicators.",
      "سيناريوهات عرض للعروض التقديمية، أقفال ذكية للأبواب، حساسات وجود لتوفير الكهرباء، وأتمتة الاجتماعات."
    ),
    highlights: [i18("Presence & occupancy lighting", "إضاءة ذكية بمستشعرات الحركة"), i18("Biometric staff access control", "تحكم في الدخول ببصمات الموظفين"), i18("Conference scene automation", "سيناريوهات المؤتمرات والشاشات")],
    icon: "Briefcase",
  },
  {
    id: "factories",
    title: i18("Smart Industrial & Facility IoT", "المصانع والمرافق التجارية"),
    description: i18(
      "Energy monitoring on heavy loads, automated perimeter lighting, industrial gateways, and temperature alerts.",
      "مراقبة استهلاك الطاقة للأحمال الكبرى، إضاءة أمنية آلية للمحيط الخارجي، وتنبيهات درجات الحرارة."
    ),
    highlights: [i18("DIN-rail smart circuit breakers", "قواطع لوحات كهربائية ذكية"), i18("High-capacity power monitoring", "مراقبة أحمال استهلاك المصانع"), i18("Industrial sensor telemetry", "ربط مستشعرات السلامة والمخازن")],
    icon: "Factory",
  },
  {
    id: "commercial",
    title: i18("Commercial Showrooms & Retail", "المعارض والمحلات التجارية"),
    description: i18(
      "Scheduled store illumination, smart security alarms, automated motorized shutters, and customer welcoming scenes.",
      "جدولة إضاءات واجهات المحلات، أجهزة إنذار ذكية، أتمتة الشيش الحصير والستائر، وترحيب بالعملاء."
    ),
    highlights: [i18("Scheduled window display lights", "جدولة إضاءة المعارض ليلاً"), i18("Smart shutter automation", "أتمتة الشيش والبوابات المتحركة"), i18("Remote off-hours alarm monitoring", "مراقبة أمنية خارج أوقات العمل")],
    icon: "Store",
  },
];
