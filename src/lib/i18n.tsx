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
