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
  heroTitle: { en: "Engineering Smarter Solutions for a Better Future", ar: "نطور حلولاً أذكى لمستقبل أفضل" },
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
  attachPhoto: { en: "Attach a Photo or Diagram (optional)", ar: "إرفاق صورة أو مخطط (اختياري)" },
  dropPhoto: { en: "Click to select a photo or drag & drop", ar: "اضغط لاختيار صورة أو اسحبها هنا" },
  photoFormats: { en: "PNG, JPG, WEBP up to 5MB", ar: "PNG أو JPG أو WEBP حتى 5 ميجابايت" },
  removePhoto: { en: "Remove", ar: "إزالة" },
  photoTooLarge: { en: "Image is too large (maximum 5MB)", ar: "حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)" },
  uploadingPhoto: { en: "Uploading photo...", ar: "جاري رفع الصورة..." },
  viewPhoto: { en: "View Attached Photo", ar: "عرض الصورة المرفقة" },
  attachFile: { en: "Attach Document / Specs (optional)", ar: "إرفاق ملف أو مواصفات المشروع (اختياري)" },
  dropFile: { en: "Click to select a document or drag & drop", ar: "اضغط لاختيار ملف أو اسحبه هنا" },
  fileFormats: { en: "PDF, DOCX, XLSX, ZIP up to 10MB", ar: "PDF أو DOCX أو XLSX أو ZIP حتى 10 ميجابايت" },
  fileTooLarge: { en: "File is too large (maximum 10MB)", ar: "حجم الملف كبير جداً (الحد الأقصى 10 ميجابايت)" },
  uploadingFiles: { en: "Uploading attachments...", ar: "جاري رفع المرفقات..." },
  viewFile: { en: "Download Attached File", ar: "تحميل الملف المرفق" },
  profileTab: { en: "Profile Details", ar: "بيانات الحساب" },
  securityTab: { en: "Security & Password", ar: "الأمان وكلمة المرور" },
  requestsTab: { en: "My Requests & Messages", ar: "طلباتي ورسائلي" },
  changePassword: { en: "Change Password", ar: "تغيير كلمة المرور" },
  newPassword: { en: "New Password", ar: "كلمة المرور الجديدة" },
  confirmPassword: { en: "Confirm New Password", ar: "تأكيد كلمة المرور الجديدة" },
  updatePassword: { en: "Update Password", ar: "تحديث كلمة المرور" },
  passwordMismatch: { en: "Passwords do not match.", ar: "كلمتا المرور غير متطابقتين." },
  passwordUpdated: { en: "Your password has been updated successfully.", ar: "تم تحديث كلمة المرور بنجاح." },
  passwordLength: { en: "Password must be at least 6 characters.", ar: "يجب ألا تقل كلمة المرور عن 6 أحرف." },
  memberSince: { en: "Member since", ar: "عضو منذ" },
  verified: { en: "Verified", ar: "مؤكد" },
  client: { en: "Client Account", ar: "حساب عميل" },
  administrator: { en: "Administrator", ar: "مدير النظام" },
  confirmSignOut: { en: "Are you sure you want to sign out?", ar: "هل أنت متأكد من تسجيل الخروج؟" },
  noRequestsYet: { en: "You haven't submitted any project requests or messages yet.", ar: "لم تقدم أي طلبات مشاريع أو رسائل بعد." },
  exportExcel: { en: "Export to Excel", ar: "تصدير إلى Excel" },
  exportUsers: { en: "Export Users (Excel)", ar: "تصدير المستخدمين (Excel)" },
  exportInquiries: { en: "Export Requests (Excel)", ar: "تصدير الطلبات (Excel)" },
  deleteUser: { en: "Delete User", ar: "حذف المستخدم" },
  confirmDeleteUser: { en: "Are you sure you want to delete this user?", ar: "هل أنت متأكد من رغبتك في حذف هذا المستخدم؟" },
  userDeleted: { en: "User deleted successfully.", ar: "تم حذف المستخدم بنجاح." },
  searchPlaceholder: { en: "Search by name, email, phone...", ar: "بحث بالاسم، البريد، الهاتف..." },
  registered: { en: "Registration Date", ar: "تاريخ التسجيل" },
  role: { en: "Role", ar: "الصلاحية" },
  actions: { en: "Actions", ar: "الإجراءات" },
  totalUsers: { en: "Total Users", ar: "إجمالي المستخدمين" },
  noUsersFound: { en: "No users found matching your search.", ar: "لم يتم العثور على مستخدمين يطابقون بحثك." },
  overview: { en: "Overview & Analytics", ar: "النظرة العامة والتحليلات" },
  inquiriesTab: { en: "Inquiries & Requests", ar: "الطلبات والرسائل" },
  liveSync: { en: "Live Realtime", ar: "مزامنة لحظية" },
  refresh: { en: "Refresh", ar: "تحديث" },
  lastUpdated: { en: "Last updated", ar: "آخر تحديث" },
  allSectors: { en: "All Sectors", ar: "كل القطاعات" },
  sortBy: { en: "Sort by", ar: "ترتيب حسب" },
  newestFirst: { en: "Newest first", ar: "الأحدث أولاً" },
  oldestFirst: { en: "Oldest first", ar: "الأقدم أولاً" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل" },
  close: { en: "Close", ar: "إغلاق" },
  quickReply: { en: "Quick Reply", ar: "رد سريع" },
  copyInfo: { en: "Copy Info", ar: "نسخ البيانات" },
  infoCopied: { en: "Contact details copied to clipboard!", ar: "تم نسخ بيانات التواصل إلى الحافظة!" },
  customerHistory: { en: "Customer Inquiries History", ar: "سجل طلبات العميل" },
  noInquiriesCustomer: { en: "This customer hasn't submitted any inquiries yet.", ar: "لم يقدم هذا العميل أي طلبات بعد." },
  makeAdmin: { en: "Make Administrator", ar: "تعيين كمسؤول" },
  makeClient: { en: "Demote to Client", ar: "تعيين كعميل" },
  roleUpdated: { en: "User role has been updated.", ar: "تم تحديث صلاحية المستخدم بنجاح." },
  cannotDemoteSelf: { en: "You cannot change your own admin role.", ar: "لا يمكنك تغيير صلاحية حسابك الخاص." },
  topSectors: { en: "Most Requested Sectors", ar: "أكثر القطاعات طلباً" },
  requestsVsContact: { en: "Project Requests vs Inquiries", ar: "طلبات المشاريع مقابل الرسائل" },
  completionRate: { en: "Resolution Rate", ar: "نسبة الإنجاز" },
  recentActivity: { en: "Recent Activity Stream", ar: "شريط النشاط الأخير" },
  viewInquiries: { en: "View Inquiries", ar: "عرض الطلبات" },
  inquiryType: { en: "Type", ar: "النوع" },
  submissionDate: { en: "Submission Date", ar: "تاريخ الإرسال" },
  inquiryDetails: { en: "Inquiry Details", ar: "تفاصيل الطلب" },
  userProfile: { en: "Client Profile", ar: "ملف العميل" },
  whatsapp: { en: "WhatsApp", ar: "واتساب" },
  emailClient: { en: "Email Client", ar: "مراسلة بالبريد" },
  allTime: { en: "All Time", ar: "كل الأوقات" },
  dateFilter: { en: "Date Range", ar: "الفترة الزمنية" },
  today: { en: "Today", ar: "اليوم" },
  last7Days: { en: "Last 7 Days", ar: "آخر 7 أيام" },
  last30Days: { en: "Last 30 Days", ar: "آخر 30 يوماً" },
  quickStats: { en: "Quick Stats", ar: "إحصائيات سريعة" },
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
