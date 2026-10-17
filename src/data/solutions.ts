import type { LucideIcon } from "lucide-react";
import { Sprout, Factory, HeartPulse, Fish, Egg, Sun, Wind, Home, Gauge, BatteryCharging } from "lucide-react";
import agri from "@/assets/agri.jpg";
import industry from "@/assets/industry.jpg";
import energy from "@/assets/energy.jpg";
import healthcare from "@/assets/healthcare.jpg";
import aquaculture from "@/assets/aquaculture.jpg";
import poultry from "@/assets/poultry.jpg";
import wind from "@/assets/wind.jpg";
import buildings from "@/assets/buildings.jpg";
import stabilizers from "@/assets/stabilizers.jpg";
import ups from "@/assets/ups.jpg";
import type { L } from "@/lib/i18n";

export type Solution = { slug: string; icon: LucideIcon; image?: string; title: L; summary: L; items: L[] };

const i = (en: string, ar: string): L => ({ en, ar });

export const solutions: Solution[] = [
  {
    slug: "smart-agriculture", icon: Sprout, image: agri,
    title: i("Smart Agriculture", "الزراعة الذكية"),
    summary: i("Intelligent irrigation, fertigation, and greenhouse automation driven by real-time field data.", "ري وتسميد ذكي وأتمتة للصوب الزراعية تعتمد على بيانات الحقل اللحظية."),
    items: [i("Intelligent irrigation systems", "أنظمة ري ذكية"), i("Soil moisture monitoring", "مراقبة رطوبة التربة"), i("Smart fertigation", "التسميد الذكي"), i("Weather station integration", "ربط محطات الطقس"), i("Automated greenhouse management", "إدارة آلية للصوب"), i("Remote pump and valve control", "تحكم عن بعد في المضخات والمحابس"), i("Water consumption monitoring", "مراقبة استهلاك المياه"), i("AI-assisted agricultural analytics", "تحليلات زراعية بالذكاء الاصطناعي")],
  },
  {
    slug: "smart-industrial", icon: Factory, image: industry,
    title: i("Smart Industrial Solutions", "الحلول الصناعية الذكية"),
    summary: i("PLC, SCADA, and Industrial IoT systems for efficient, monitored, and predictable production.", "أنظمة PLC وSCADA وإنترنت الأشياء الصناعي لإنتاج فعّال ومراقَب."),
    items: [i("Industrial automation", "الأتمتة الصناعية"), i("PLC-based control systems", "أنظمة تحكم PLC"), i("SCADA monitoring", "مراقبة SCADA"), i("Industrial IoT", "إنترنت الأشياء الصناعي"), i("Predictive maintenance", "الصيانة التنبؤية"), i("Factory energy monitoring", "مراقبة طاقة المصانع"), i("Real-time process dashboards", "لوحات عمليات لحظية")],
  },
  {
    slug: "smart-healthcare", icon: HeartPulse, image: healthcare,
    title: i("Smart Medical & Healthcare", "التقنيات الطبية الذكية"),
    summary: i("Monitored, automated, and power-protected infrastructure for healthcare facilities.", "بنية تحتية مراقَبة ومؤتمتة ومحمية كهربائياً للمنشآت الصحية."),
    items: [i("Smart healthcare facility infrastructure", "بنية تحتية ذكية للمنشآت الصحية"), i("Environmental monitoring", "المراقبة البيئية"), i("Medical equipment status monitoring", "مراقبة حالة الأجهزة الطبية"), i("Medical refrigerator temperature monitoring", "مراقبة حرارة الثلاجات الطبية"), i("Facility automation", "أتمتة المنشآت"), i("Uninterrupted power for healthcare", "طاقة غير منقطعة للرعاية الصحية")],
  },
  {
    slug: "smart-aquaculture", icon: Fish, image: aquaculture,
    title: i("Smart Aquaculture & Fish Farms", "الاستزراع السمكي الذكي"),
    summary: i("Water quality, oxygen, and feeding automation for healthier, more productive fish farms.", "أتمتة جودة المياه والأكسجين والتغذية لمزارع سمكية أكثر إنتاجية."),
    items: [i("Automated fish feeding", "التغذية الآلية"), i("Dissolved oxygen monitoring", "مراقبة الأكسجين المذاب"), i("Water temperature & pH monitoring", "مراقبة الحرارة ودرجة الحموضة"), i("Smart aeration systems", "أنظمة تهوية ذكية"), i("Pump automation", "أتمتة المضخات"), i("Remote alarm systems", "أنظمة إنذار عن بعد")],
  },
  {
    slug: "smart-poultry", icon: Egg, image: poultry,
    title: i("Smart Poultry Farms", "مزارع الدواجن الذكية"),
    summary: i("Climate, feeding, water, and air-quality automation with intelligent alerts.", "أتمتة المناخ والتغذية والمياه وجودة الهواء مع تنبيهات ذكية."),
    items: [i("Automated feeding & drinking", "تغذية وسقاية آلية"), i("Temperature and humidity monitoring", "مراقبة الحرارة والرطوبة"), i("Ventilation and fan automation", "أتمتة التهوية والمراوح"), i("Ammonia and air quality monitoring", "مراقبة الأمونيا وجودة الهواء"), i("Automated lighting schedules", "جداول إضاءة آلية"), i("Automated cleaning systems", "أنظمة تنظيف آلية"), i("Remote control dashboards", "لوحات تحكم عن بعد")],
  },
  {
    slug: "solar-energy", icon: Sun, image: energy,
    title: i("Solar Energy Solutions", "حلول الطاقة الشمسية"),
    summary: i("Solar PV design, hybrid systems, and battery storage with full energy monitoring.", "تصميم أنظمة شمسية وهجينة وتخزين بطاريات مع مراقبة كاملة للطاقة."),
    items: [i("Solar PV system design", "تصميم الأنظمة الشمسية"), i("Solar panel installation", "تركيب الألواح الشمسية"), i("Solar-powered irrigation", "الري بالطاقة الشمسية"), i("Hybrid power systems", "أنظمة طاقة هجينة"), i("Battery storage integration", "دمج تخزين البطاريات"), i("Maintenance and monitoring", "الصيانة والمراقبة")],
  },
  {
    slug: "wind-energy", icon: Wind, image: wind,
    title: i("Wind Energy Solutions", "حلول طاقة الرياح"),
    summary: i("Feasibility, small-scale turbines, and hybrid solar–wind systems.", "دراسات جدوى وتوربينات صغيرة وأنظمة هجينة شمسية-رياح."),
    items: [i("Wind energy feasibility", "دراسات جدوى طاقة الرياح"), i("Small-scale wind turbines", "توربينات رياح صغيرة"), i("Hybrid solar and wind systems", "أنظمة هجينة شمسية ورياح"), i("Battery storage integration", "دمج تخزين البطاريات"), i("Wind-powered remote applications", "تطبيقات نائية بطاقة الرياح")],
  },
  {
    slug: "smart-buildings", icon: Home, image: buildings,
    title: i("Smart Homes & Buildings", "المنازل والمباني الذكية"),
    summary: i("Integrated automation, security, and smart finishing for homes and buildings.", "أتمتة وأمن وتشطيبات ذكية متكاملة للمنازل والمباني."),
    items: [i("Smart home automation", "أتمتة المنازل"), i("Intelligent lighting", "الإضاءة الذكية"), i("Smart curtains and blinds", "الستائر الذكية"), i("Access control & smart locks", "التحكم في الدخول والأقفال الذكية"), i("CCTV integration", "دمج كاميرات المراقبة"), i("Smart HVAC controls", "تحكم ذكي في التكييف"), i("Smart building management", "إدارة المباني الذكية")],
  },
  {
    slug: "voltage-stabilizers", icon: Gauge, image: stabilizers,
    title: i("Voltage Stabilizers & Power Protection", "منظمات الجهد وحماية الطاقة"),
    summary: i("Supply, installation, and maintenance of voltage regulation and protection systems.", "توريد وتركيب وصيانة أنظمة تنظيم الجهد والحماية."),
    items: [i("Voltage stabilizer supply & installation", "توريد وتركيب منظمات الجهد"), i("Industrial voltage regulation", "تنظيم الجهد الصناعي"), i("Electrical load assessment", "تقييم الأحمال الكهربائية"), i("Power quality monitoring", "مراقبة جودة الطاقة"), i("Scheduled maintenance", "الصيانة الدورية")],
  },
  {
    slug: "ups-systems", icon: BatteryCharging, image: ups,
    title: i("UPS & Uninterruptible Power", "أنظمة UPS والطاقة غير المنقطعة"),
    summary: i("Backup power design, UPS sizing, and battery integration for critical facilities.", "تصميم الطاقة الاحتياطية واختيار سعات UPS ودمج البطاريات للمنشآت الحرجة."),
    items: [i("UPS supply and installation", "توريد وتركيب UPS"), i("Backup power system design", "تصميم أنظمة الطاقة الاحتياطية"), i("UPS capacity selection", "اختيار سعة UPS"), i("Industrial & commercial UPS", "UPS صناعي وتجاري"), i("Healthcare power continuity", "استمرارية الطاقة للرعاية الصحية"), i("UPS maintenance", "صيانة UPS")],
  },
];

export const capabilities: L[] = [
  i("Smart Systems Design", "تصميم الأنظمة الذكية"),
  i("Internet of Things (IoT)", "إنترنت الأشياء"),
  i("AI & Analytics", "الذكاء الاصطناعي والتحليلات"),
  i("Industrial Automation", "الأتمتة الصناعية"),
  i("Remote Monitoring & Control", "المراقبة والتحكم عن بعد"),
  i("Electrical & Power Engineering", "الهندسة الكهربائية"),
  i("Renewable Energy Integration", "دمج الطاقة المتجددة"),
  i("Smart Infrastructure", "البنية التحتية الذكية"),
  i("Systems Integration & Support", "تكامل الأنظمة والدعم الفني"),
];
