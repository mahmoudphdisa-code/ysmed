import agri from "@/assets/agri.jpg";
import industry from "@/assets/industry.jpg";
import energy from "@/assets/energy.jpg";
import healthcare from "@/assets/healthcare.jpg";
import poultry from "@/assets/poultry.jpg";
import ups from "@/assets/ups.jpg";
import aquaculture from "@/assets/aquaculture.jpg";

export type PortfolioProject = {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  client_name?: string | null;
  sector?: string | null;
  image_url: string;
  location?: string | null;
  year?: string | null;
  is_hidden: boolean;
  order_index?: number;
  created_at?: string;
};

export const initialProjects: PortfolioProject[] = [
  {
    id: "proj-1",
    title_en: "Automated Fertigation & Smart Greenhouse Complex",
    title_ar: "مجمع الصوب الزراعية الذكية ومنظومة التسميد والري الآلي",
    description_en: "Engineered and deployed an integrated precision agriculture system featuring IoT soil sensor arrays, automated weather-responsive fertigation pumps, and remote smartphone monitoring.",
    description_ar: "تصميم وتنفيذ منظومة زراعة دقيقة متكاملة تشمل مصفوفات حساسات التربة بتقنية إنترنت الأشياء، ومضخات تسميد ذكية متوافقة مع محطات الطقس، مع تحكم ومراقبة سحابية عن بعد.",
    client_name: "Al-Namaa Agricultural Development",
    sector: "smart-agriculture",
    image_url: agri,
    location: "Nubaria, Egypt",
    year: "2024",
    is_hidden: false,
    order_index: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "proj-2",
    title_en: "Industrial SCADA & PLC Production Line Automation",
    title_ar: "أتمتة خطوط الإنتاج الصناعية بأنظمة SCADA وPLC المتطورة",
    description_en: "Turnkey automation overhaul for high-capacity manufacturing lines including Siemens PLC programming, centralized SCADA telemetry, and predictive vibration monitoring.",
    description_ar: "تطوير شامل ومؤتمت لخطوط إنتاج المصانع الكبرى بواسطة برمجة وحدات تحكم Siemens PLC، وشبكة SCADA مركزية، ومنظومة تنبؤية لمراقبة الاهتزازات وحالة المحركات.",
    client_name: "PharmaTech Industries",
    sector: "smart-industrial",
    image_url: industry,
    location: "6th of October City",
    year: "2024",
    is_hidden: false,
    order_index: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: "proj-3",
    title_en: "Hospital ICU Critical Power Continuity & Environmental Monitoring",
    title_ar: "تأمين استمرارية الطاقة الحرجة والمراقبة البيئية لغرف العناية المركزة",
    description_en: "Designed high-availability industrial UPS infrastructure with medical isolation transformers and real-time cryogenic/cold-chain temperature loggers for surgical wings.",
    description_ar: "تصميم وتنفيذ بنية تحتية عالية الاعتمادية لأنظمة UPS الصناعية مع محولات عزل طبية، وحساسات مراقبة لحظية لدرجات حرارة بنوك الدم وغرف العمليات الجراحية.",
    client_name: "Elite Specialized Healthcare Group",
    sector: "smart-healthcare",
    image_url: healthcare,
    location: "New Cairo, Egypt",
    year: "2023",
    is_hidden: false,
    order_index: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "proj-4",
    title_en: "Hybrid Solar Microgrid & Energy Storage Facility (600 kWp)",
    title_ar: "محطة طاقة شمسية هجينة مع تخزين البطاريات بقدرة 600 كيلوواط",
    description_en: "Engineered off-grid utility-grade solar photovoltaic array with lithium battery storage and automated diesel generator failover synchronization for remote desert reclamation.",
    description_ar: "تصميم وتنفيذ محطة طاقة شمسية كهروضوئية هجينة مع بنوك بطاريات الليثيوم ونظام مزامنة آلي مع مولدات الديزل لتغذية مشروعات الاستصلاح الزراعي في المناطق النائية.",
    client_name: "Wadi Solar Energy Consortium",
    sector: "solar-energy",
    image_url: energy,
    location: "Bahariya Oasis",
    year: "2024",
    is_hidden: false,
    order_index: 4,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: "proj-5",
    title_en: "Commercial Poultry Farm Automated Climate & Ventilation System",
    title_ar: "نظام تحكم مناخي وتهوية مؤتمت لمزارع الدواجن والإنتاج الداجني",
    description_en: "Fully automated negative-pressure tunnel ventilation, evaporative cooling pads, and ammonia level gas detection ensuring optimal biosecurity and feed conversion ratios.",
    description_ar: "نظام تهوية نفقية بالضغط السلبي وتبريد تبخيري مؤتمت بالكامل، مع رصد دقيق لغازات الأمونيا لضمان أعلى معايير الأمان الحيوي ومعدلات التحويل الغذائي.",
    client_name: "Delta Poultry Farms Co.",
    sector: "smart-poultry",
    image_url: poultry,
    location: "Menoufia, Egypt",
    year: "2023",
    is_hidden: false,
    order_index: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "proj-6",
    title_en: "Smart Aquaculture Dissolved Oxygen & Water Quality Station",
    title_ar: "محطة مراقبة الأكسجين الذائب وجودة المياه لمزارع الاستزراع السمكي",
    description_en: "Continuous automated optical dissolved oxygen sensing, smart aeration paddlewheel triggers, and automated feed dispensaries linked to central alarm relays.",
    description_ar: "رصد مستمر لمستويات الأكسجين الذائب وحموضة المياه وتفعيل آلي لبدالات التهوية وموزعات الأعلاف الذكية مع ربطها بغرفة التحكم المركزية.",
    client_name: "Blue Nile Aquaculture",
    sector: "smart-aquaculture",
    image_url: aquaculture,
    location: "Kafr El Sheikh, Egypt",
    year: "2024",
    is_hidden: false,
    order_index: 6,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];
