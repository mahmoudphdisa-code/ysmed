import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";
export type L = { en: string; ar: string };

const dict = {
  home: { en: "Home", ar: "الرئيسية" },
  solutions: { en: "Our Solutions", ar: "حلولنا" },
  projects: { en: "Projects", ar: "المشاريع" },
  about: { en: "About Us", ar: "من نحن" },
  contact: { en: "Contact Us", ar: "تواصل معنا" },
  request: { en: "Request a Project", ar: "اطلب مشروعاً" },
  login: { en: "Login", ar: "تسجيل الدخول" },
  heroTitle: { en: "Engineering Smarter Solutions for a Better Future", ar: "نهندس حلولاً أذكى لمستقبل أفضل" },
  heroText: {
    en: "YSMED for Innovative Solutions, a Magdy Group company, delivers integrated smart technologies, engineering automation, intelligent infrastructure, renewable energy systems, and reliable power solutions across diverse industries.",
    ar: "تقدم YSMED للحلول المبتكرة، إحدى شركات مجموعة مجدي، تقنيات ذكية متكاملة وأتمتة هندسية وبنية تحتية ذكية وأنظمة طاقة متجددة وحلول طاقة موثوقة لمختلف القطاعات.",
  },
  explore: { en: "Explore Our Solutions", ar: "استكشف حلولنا" },
  viewProjects: { en: "View Our Projects", ar: "شاهد مشاريعنا" },
  whoWeAre: { en: "Who We Are", ar: "من نحن" },
  whoText: {
    en: "At YSMED, we connect engineering expertise with innovative technologies to develop practical and scalable solutions for agriculture, industry, healthcare, aquaculture, poultry production, clean energy, smart buildings, and electrical power continuity.",
    ar: "في YSMED نربط الخبرة الهندسية بالتقنيات المبتكرة لتطوير حلول عملية وقابلة للتوسع للزراعة والصناعة والرعاية الصحية والاستزراع السمكي والدواجن والطاقة النظيفة والمباني الذكية واستمرارية الطاقة الكهربائية.",
  },
  learnMore: { en: "Learn more", ar: "اعرف المزيد" },
  capabilities: { en: "Our Core Capabilities", ar: "قدراتنا الأساسية" },
  industries: { en: "Industries & Solutions", ar: "القطاعات والحلول" },
  viewSolution: { en: "View solution", ar: "عرض الحل" },
  ctaTitle: { en: "Have a project in mind?", ar: "لديك مشروع في ذهنك؟" },
  ctaText: { en: "Tell us about your goals and our engineers will design the right solution.", ar: "أخبرنا بأهدافك وسيصمم مهندسونا الحل المناسب." },
  magdy: { en: "A Magdy Group Company", ar: "إحدى شركات مجموعة مجدي" },
  skip: { en: "Skip", ar: "تخطي" },
  rights: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  concept: { en: "Solution Concept", ar: "تصور للحل" },
  name: { en: "Full name", ar: "الاسم الكامل" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  phone: { en: "Phone", ar: "الهاتف" },
  message: { en: "Message", ar: "الرسالة" },
  send: { en: "Send", ar: "إرسال" },
  company: { en: "Company", ar: "الشركة" },
  password: { en: "Password", ar: "كلمة المرور" },
  signup: { en: "Create Account", ar: "إنشاء حساب" },
  haveAccount: { en: "Already have an account? Sign in", ar: "لديك حساب؟ سجّل الدخول" },
  noAccount: { en: "New here? Create an account", ar: "جديد هنا؟ أنشئ حساباً" },
  orContinue: { en: "or continue with", ar: "أو تابع عبر" },
  account: { en: "My Account", ar: "حسابي" },
  logout: { en: "Sign Out", ar: "تسجيل الخروج" },
  myInquiries: { en: "My Messages & Requests", ar: "رسائلي وطلباتي" },
  saveProfile: { en: "Save Details", ar: "حفظ البيانات" },
  profileSaved: { en: "Your details were saved.", ar: "تم حفظ بياناتك." },
  inquirySent: { en: "Thank you! Your message was sent. Our team will contact you soon.", ar: "شكراً لك! تم إرسال رسالتك وسيتواصل معك فريقنا قريباً." },
  checkEmail: { en: "Please check your email to confirm your account.", ar: "يرجى تفقد بريدك الإلكتروني لتأكيد حسابك." },
  welcomeBack: { en: "Welcome back", ar: "مرحباً بعودتك" },
  noInquiries: { en: "You haven't sent any messages yet.", ar: "لم ترسل أي رسائل بعد." },
  backToIndustries: { en: "Back to Industries & Solutions", ar: "العودة إلى القطاعات والحلول" },
  admin: { en: "Admin Dashboard", ar: "لوحة الإدارة" },
  allInquiries: { en: "All Messages & Requests", ar: "كل الرسائل والطلبات" },
  customers: { en: "Customers", ar: "العملاء" },
  status: { en: "Status", ar: "الحالة" },
  st_new: { en: "New", ar: "جديد" },
  st_in_progress: { en: "In progress", ar: "قيد المتابعة" },
  st_done: { en: "Done", ar: "مكتمل" },
  all: { en: "All", ar: "الكل" },
  notAdmin: { en: "This area is for YSMED administrators only.", ar: "هذه المنطقة مخصصة لإدارة YSMED فقط." },
} satisfies Record<string, L>;

type Key = keyof typeof dict;
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string; tl: (v: L) => string };
const I18n = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("ysmed-lang");
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => {
    localStorage.setItem("ysmed-lang", l);
    setLangState(l);
  };
  return (
    <I18n.Provider value={{ lang, setLang, t: (k) => dict[k][lang], tl: (v) => v[lang] }}>
      {children}
    </I18n.Provider>
  );
}

export function useI18n() {
  const c = useContext(I18n);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
