import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Copy,
  Check,
  Building,
  User,
  Calendar,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
  Download,
  Receipt,
  FileCheck,
  GraduationCap,
  Cpu,
  Home,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Paperclip,
  Image as ImageIcon,
  LogIn,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchProjectDetails,
  fetchCustomerProjects,
  sendCustomerMessage,
  respondToQuotation,
  type StoredProjectRequest,
} from "@/services/engineeringService";
import { requestStatuses } from "@/data/engineeringData";
import { solutions } from "@/data/solutions";
import { cn } from "@/lib/utils";

interface SearchParams {
  ref?: string | undefined;
  token?: string | undefined;
}

export type Inquiry = {
  id: string;
  kind: string;
  sector: string | null;
  message: string;
  created_at: string;
  status?: string;
  photo_url?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
};

export const Route = createFileRoute("/my-projects")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const rawRef = search["ref"];
    const rawToken = search["token"];
    return {
      ref: typeof rawRef === "string" ? rawRef : undefined,
      token: typeof rawToken === "string" ? rawToken : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "طلباتي ومشاريعي — My Requests | YSMED" },
      { name: "description", content: "بوابة العميل الموحدة لمتابعة طلبات مشاريع التخرج، المنازل الذكية، والحلول المبتكرة." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

export function Page() {
  const { lang, t } = useI18n();
  const isAr = lang === "ar";
  const search = useSearch({ from: "/my-projects" });

  // Main Category Tab state
  const [activeMainTab, setActiveMainTab] = useState<"graduation" | "smart-homes" | "solutions">("graduation");

  // Lookup inputs
  const [lookupRef, setLookupRef] = useState(search.ref || "");
  const [lookupToken, setLookupToken] = useState(search.token || "");
  const [lookupLoading, setLookupLoading] = useState(false);

  // Loaded active project & user projects
  const [activeProject, setActiveProject] = useState<StoredProjectRequest | null>(null);
  const [userProjectsList, setUserProjectsList] = useState<StoredProjectRequest[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  // Chat message input
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Copy states
  const [copiedRef, setCopiedRef] = useState(false);

  // Load user session, projects, and inquiries on mount
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (active && authData?.user) {
          setAuthUserId(authData.user.id);
          const [projects, inqRes] = await Promise.all([
            fetchCustomerProjects(authData.user.id),
            supabase
              .from("inquiries")
              .select("*")
              .order("created_at", { ascending: false }),
          ]);

          if (active) {
            if (projects && projects.length > 0) {
              setUserProjectsList(projects);
              if (!search.ref && projects[0]) {
                setActiveProject(projects[0]);
              }
            }
            if (inqRes.data) {
              setInquiries(inqRes.data as Inquiry[]);
            }
          }
        } else {
          // Check local stored projects
          const localList = await fetchCustomerProjects();
          if (active && localList.length > 0) {
            setUserProjectsList(localList);
          }
        }

        // If search params provided, load specified project
        if (search.ref) {
          setLookupLoading(true);
          const p = await fetchProjectDetails(search.ref, search.token);
          if (active) {
            if (p) {
              setActiveProject(p);
              setActiveMainTab("graduation");
            } else {
              toast.error(
                isAr
                  ? "لم يتم العثور على مشروع بهذا الرقم أو الرمز"
                  : "No project found with these credentials"
              );
            }
            setLookupLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
        if (active) setLookupLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [search.ref, search.token]);

  // Handle Manual Lookup
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupRef.trim()) {
      toast.error(isAr ? "يرجى إدخال رقم المرجع" : "Please enter a reference number");
      return;
    }

    setLookupLoading(true);
    try {
      const p = await fetchProjectDetails(lookupRef, lookupToken);
      if (p) {
        setActiveProject(p);
        setActiveMainTab("graduation");
        toast.success(isAr ? "تم تحميل بيانات المشروع بنجاح" : "Project loaded successfully");
      } else {
        toast.error(
          isAr
            ? "تعذر العثور على المشروع. يرجى التأكد من رقم المرجع ورمز المتابعة."
            : "Project not found. Please verify your reference number and access key."
        );
      }
    } catch {
      toast.error(isAr ? "حدث خطأ أثناء البحث" : "Error searching for project");
    } finally {
      setLookupLoading(false);
    }
  };

  // Handle Send Customer Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !replyMessage.trim()) return;

    setSendingMessage(true);
    try {
      const ok = await sendCustomerMessage(
        activeProject.id,
        activeProject.reference_number,
        activeProject.guest_access_token,
        activeProject.full_name,
        replyMessage
      );

      if (ok) {
        toast.success(isAr ? "تم إرسال رسالتك إلى الفريق الهندسي" : "Message sent to engineers");
        setReplyMessage("");
        // Reload project details
        const updated = await fetchProjectDetails(
          activeProject.reference_number,
          activeProject.guest_access_token
        );
        if (updated) setActiveProject(updated);
      }
    } catch {
      toast.error(isAr ? "فشل إرسال الرسالة" : "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle Quotation Response
  const handleQuoteDecision = async (quoteId: string, decision: "approved" | "declined") => {
    if (!activeProject) return;

    try {
      await respondToQuotation(
        quoteId,
        activeProject.id,
        activeProject.reference_number,
        decision
      );

      toast.success(
        decision === "approved"
          ? isAr
            ? "تم اعتماد عرض السعر بنجاح وبدء التنفيذ!"
            : "Quotation approved! Project kickoff initialized."
          : isAr
          ? "تم تسجيل الملاحظة وطلب تعديل المقايسة"
          : "Revision request recorded."
      );

      // Reload
      const updated = await fetchProjectDetails(
        activeProject.reference_number,
        activeProject.guest_access_token
      );
      if (updated) setActiveProject(updated);
    } catch {
      toast.error(isAr ? "حدث خطأ أثناء تحديث عرض السعر" : "Error updating quotation");
    }
  };

  const copyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
    toast.success(isAr ? "تم النسخ" : "Copied");
  };

  // Filter inquiries into Smart Homes vs Innovative Solutions
  const smartHomeInquiries = inquiries.filter(
    (i) =>
      i.kind === "smart_home_installation" ||
      i.kind === "smart_home_order" ||
      i.sector === "smart-buildings"
  );

  const solutionsInquiries = inquiries.filter(
    (i) =>
      i.kind !== "smart_home_installation" &&
      i.kind !== "smart_home_order" &&
      i.sector !== "smart-buildings"
  );

  const currentStatusObj = requestStatuses.find(
    (s) => s.value === (activeProject?.status || "new")
  );

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "done":
      case "completed":
        return {
          label: isAr ? "مكتمل ومُسلّم" : "Completed",
          color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        };
      case "in_progress":
        return {
          label: isAr ? "قيد التنفيذ والمتابعة" : "In Progress",
          color: "bg-primary/20 text-primary border-primary/30",
        };
      case "under_review":
        return {
          label: isAr ? "قيد المراجعة الفنية" : "Under Review",
          color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        };
      case "new":
      default:
        return {
          label: isAr ? "طلب جديد" : "New Request",
          color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
        };
    }
  };

  return (
    <div className="relative min-h-screen px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
      <div className="circuit-grid fixed inset-0 pointer-events-none opacity-30 z-0" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/25 mb-2">
              <Sparkles className="size-3.5" />
              {isAr ? "بوابة العميل الموحدة للطلبات" : "Unified Client Requests Portal"}
            </span>
            <h1 className="text-2xl font-bold sm:text-4xl text-foreground">
              {isAr ? "طلباتي" : "My Requests"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {isAr
                ? "متابعة شاملة لحالة طلباتك، عروض الأسعار، والمقايسات عبر مشاريع التخرج، المنازل الذكية، والحلول المبتكرة."
                : "Track all your active requests, quotations, and progress across Graduation Project Services, Smart Homes, and Innovative Solutions."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <Button asChild variant="hero" className="rounded-xl gap-2 shadow-glow">
              <Link to="/engineering-services">
                <span>{isAr ? "تقديم طلب مشروع جديد" : "New Project Request"}</span>
                <ChevronRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Guest Banner if not logged in */}
        {!authUserId && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <LogIn className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {isAr ? "سجّل الدخول لعرض جميع طلباتك في مكان واحد" : "Sign In to Access All Your Requests"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isAr
                    ? "يتيح لك تسجيل الدخول استعراض كافة طلباتك ومقايساتك عبر الأقسام الثلاثة بسهولة."
                    : "Logging in enables full tracking of your Graduation Projects, Smart Homes quotes, and Solution inquiries."}
                </p>
              </div>
            </div>
            <Button asChild variant="hero" size="sm" className="rounded-xl shrink-0">
              <Link to="/auth">{isAr ? "تسجيل الدخول / إنشاء حساب" : "Sign In / Register"}</Link>
            </Button>
          </div>
        )}

        {/* ─── 3 PRIMARY TABS ──────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5 border-b border-border/60 pb-3">
          {/* Tab 1: Graduation Project Services */}
          <button
            type="button"
            onClick={() => setActiveMainTab("graduation")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer",
              activeMainTab === "graduation"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:bg-surface hover:text-foreground border border-border/50"
            )}
          >
            <GraduationCap className="size-4" />
            <span>{t("engineeringServices")}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-bold",
                activeMainTab === "graduation"
                  ? "bg-white/20 text-white"
                  : "bg-primary/15 text-primary"
              )}
            >
              {userProjectsList.length}
            </span>
          </button>

          {/* Tab 2: Smart Homes */}
          <button
            type="button"
            onClick={() => setActiveMainTab("smart-homes")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer",
              activeMainTab === "smart-homes"
                ? "bg-gold text-slate-950 font-bold shadow-glow"
                : "text-muted-foreground hover:bg-surface hover:text-foreground border border-border/50"
            )}
          >
            <Sparkles className="size-4" />
            <span>{t("smartHomes")}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-bold",
                activeMainTab === "smart-homes"
                  ? "bg-black/20 text-slate-950"
                  : "bg-gold/15 text-gold"
              )}
            >
              {smartHomeInquiries.length}
            </span>
          </button>

          {/* Tab 3: Innovative Solutions */}
          <button
            type="button"
            onClick={() => setActiveMainTab("solutions")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer",
              activeMainTab === "solutions"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:bg-surface hover:text-foreground border border-border/50"
            )}
          >
            <Cpu className="size-4" />
            <span>{t("solutions")}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-bold",
                activeMainTab === "solutions"
                  ? "bg-white/20 text-white"
                  : "bg-primary/15 text-primary"
              )}
            >
              {solutionsInquiries.length}
            </span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: GRADUATION PROJECT SERVICES CONTENT                             */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {activeMainTab === "graduation" && (
          <div className="space-y-6">
            {/* Project Lookup Bar (always accessible for direct token/ref tracking) */}
            <div className="mt-6 rounded-2xl border border-border/70 bg-surface/40 p-4 sm:p-6">
              <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={lookupRef}
                    onChange={(e) => setLookupRef(e.target.value)}
                    placeholder={
                      isAr
                        ? "أدخل رقم المرجع (مثال: PRJ-2026-4891)"
                        : "Enter Reference Number (e.g. PRJ-2026-4891)"
                    }
                    className="w-full rounded-xl border border-input bg-surface/70 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  <Search className="pointer-events-none absolute end-3.5 top-3 size-4 text-muted-foreground" />
                </div>

                <div className="sm:w-72">
                  <input
                    type="text"
                    value={lookupToken}
                    onChange={(e) => setLookupToken(e.target.value)}
                    placeholder={isAr ? "رمز المتابعة السري (Access Key)" : "Secure Access Key (Optional)"}
                    className="w-full rounded-xl border border-input bg-surface/70 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <Button type="submit" disabled={lookupLoading} variant="outline" className="rounded-xl gap-2">
                  {lookupLoading ? (
                    <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  <span>{isAr ? "بحث وتتبع" : "Track Request"}</span>
                </Button>
              </form>

              {/* Quick switcher if user has saved projects */}
              {userProjectsList.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3 text-xs text-muted-foreground">
                  <span className="font-semibold">{isAr ? "طلباتك الهندسية المسجلة:" : "Your Graduation Requests:"}</span>
                  {userProjectsList.map((p) => (
                    <button
                      key={p.reference_number}
                      type="button"
                      onClick={() => setActiveProject(p)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all border cursor-pointer ${
                        activeProject?.reference_number === p.reference_number
                          ? "border-primary bg-primary/20 text-primary font-bold shadow-glow"
                          : "border-border/60 bg-surface/50 text-foreground hover:bg-surface"
                      }`}
                    >
                      {p.reference_number} • {p.project_title.slice(0, 20)}...
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ACTIVE PROJECT DETAILS */}
            {activeProject ? (
              <div className="mt-6 space-y-8 animate-rise">
                {/* Top Project Card */}
                <div className="glass glow-border rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span
                          onClick={() => copyRef(activeProject.reference_number)}
                          className="cursor-pointer font-mono text-sm font-bold text-primary flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 border border-primary/20 hover:bg-primary/20"
                        >
                          <span>{activeProject.reference_number}</span>
                          {copiedRef ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${
                            currentStatusObj?.color || "bg-primary/20 text-primary border-primary/30"
                          }`}
                        >
                          {isAr ? currentStatusObj?.labelAr : currentStatusObj?.labelEn}
                        </span>

                        <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted-foreground border border-border/50">
                          {activeProject.urgency === "urgent"
                            ? isAr ? "عاجل جداً" : "Critical"
                            : activeProject.urgency === "high"
                            ? isAr ? "أولوية هامة" : "High Priority"
                            : isAr ? "أولوية عادية" : "Standard"}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold sm:text-2xl text-foreground">
                        {activeProject.project_title}
                      </h2>

                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                        {activeProject.project_description}
                      </p>
                    </div>

                    <div className="text-start sm:text-end font-mono text-xs text-muted-foreground shrink-0">
                      <p>{isAr ? "تاريخ الطلب:" : "Created:"} {new Date(activeProject.created_at).toLocaleDateString()}</p>
                      {activeProject.deadline && (
                        <p className="mt-1 text-gold font-bold">
                          {isAr ? "الموعد المستهدف:" : "Target Deadline:"} {activeProject.deadline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Progression Bar */}
                  <div className="mt-6">
                    <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {isAr ? "مسار مراحل تنفيذ المشروع (Project Progress Pipeline):" : "Execution Timeline Pipeline:"}
                    </span>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 text-center text-xs">
                      {[
                        { key: "new", labelAr: "طلب جديد", labelEn: "New Request" },
                        { key: "under_review", labelAr: "قيد المراجعة", labelEn: "Under Review" },
                        { key: "quotation_sent", labelAr: "عرض السعر", labelEn: "Quotation" },
                        { key: "in_progress", labelAr: "قيد التنفيذ", labelEn: "In Progress" },
                        { key: "testing", labelAr: "فحص واختبار", labelEn: "Testing & QA" },
                        { key: "completed", labelAr: "مكتمل ومُسلّم", labelEn: "Completed" },
                      ].map((st, idx) => {
                        const statusOrder = ["new", "under_review", "quotation_sent", "in_progress", "testing", "completed"];
                        const currentIdx = statusOrder.indexOf(activeProject.status);
                        const isDone = currentIdx >= idx;
                        const isCurrent = activeProject.status === st.key;

                        return (
                          <div
                            key={st.key}
                            className={`rounded-xl border p-2.5 transition-all ${
                              isCurrent
                                ? "border-primary bg-primary/20 text-primary font-bold shadow-glow"
                                : isDone
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium"
                                : "border-border/50 bg-surface/30 text-muted-foreground"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1 mb-1">
                              {isDone ? (
                                <CheckCircle2 className="size-3.5 text-emerald-400" />
                              ) : (
                                <Clock className="size-3.5 opacity-50" />
                              )}
                              <span className="font-mono text-[10px]">0{idx + 1}</span>
                            </div>
                            <p className="truncate text-[11px]">{isAr ? st.labelAr : st.labelEn}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* QUOTATION REVIEW SECTION (If Quote Exists) */}
                {activeProject.quotes && activeProject.quotes.length > 0 && activeProject.quotes[0] && (() => {
                  const currentQuote = activeProject.quotes[0];
                  return (
                    <div className="glass glow-border rounded-2xl border-cyan-500/40 p-6 sm:p-8 bg-cyan-950/10">
                      <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 shadow-glow">
                            <Receipt className="size-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-cyan-400">
                                {currentQuote.quote_number}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  currentQuote.quote_status === "approved"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : currentQuote.quote_status === "declined"
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {currentQuote.quote_status === "approved"
                                  ? isAr ? "معتمد من العميل" : "Approved"
                                  : currentQuote.quote_status === "declined"
                                  ? isAr ? "طلب مراجعة وتعديل" : "Revision Requested"
                                  : isAr ? "في انتظار اعتمادك" : "Awaiting Your Decision"}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-foreground mt-0.5">
                              {isAr ? "عرض السعر والمقايسة الهندسية الرسمية" : "Official Engineering Quotation"}
                            </h3>
                          </div>
                        </div>

                        <div className="text-start sm:text-end">
                          <span className="text-xs text-muted-foreground">{isAr ? "التكلفة التقديرية الإجمالية:" : "Total Estimated Cost:"}</span>
                          <p className="text-2xl font-bold font-mono text-gradient">
                            {currentQuote.estimated_cost.toLocaleString()} {currentQuote.currency}
                          </p>
                          <span className="text-[11px] text-muted-foreground">
                            {isAr ? `مدة التنفيذ: ${currentQuote.estimated_duration}` : `Duration: ${currentQuote.estimated_duration}`}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2 text-xs leading-relaxed">
                        <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                          <span className="font-bold text-foreground block mb-1">
                            {isAr ? "نطاق العمل الهندسي (Scope of Work):" : "Scope of Work:"}
                          </span>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {currentQuote.scope}
                          </p>
                        </div>

                        <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                          <span className="font-bold text-foreground block mb-1">
                            {isAr ? "المخرجات والبنود المسلّمة (Deliverables):" : "Deliverables & Handover:"}
                          </span>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {currentQuote.deliverables}
                          </p>
                        </div>
                      </div>

                      {/* Approve / Decline Actions */}
                      {currentQuote.quote_status === "sent" && (
                        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border/50 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => handleQuoteDecision(currentQuote.id, "declined")}
                            className="rounded-xl border-border text-muted-foreground hover:bg-surface"
                          >
                            {isAr ? "طلب تعديل على البنود أو الميزانية" : "Request Revisions"}
                          </Button>

                          <Button
                            variant="hero"
                            onClick={() => handleQuoteDecision(currentQuote.id, "approved")}
                            className="rounded-xl gap-2 px-6 shadow-glow"
                          >
                            <CheckCircle2 className="size-4" />
                            <span>{isAr ? "الموافقة على عرض السعر والبدء بالتنفيذ" : "Approve Quote & Start Development"}</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* TWO COLUMNS: Chat Messaging & Milestones/Files */}
                <div className="grid gap-8 lg:grid-cols-12">
                  {/* Left Column: Direct Chat with Engineers */}
                  <div className="lg:col-span-7 glass rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
                        <div className="flex items-center gap-2.5">
                          <MessageSquare className="size-5 text-primary" />
                          <h3 className="font-bold text-base text-foreground">
                            {isAr ? "محادثة المشروع المباشرة مع الفريق الهندسي" : "Direct Project Chat"}
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {isAr ? "رسائل مشفرة وآمنة" : "Encrypted Channel"}
                        </span>
                      </div>

                      {/* Messages Bubble Area */}
                      <div className="space-y-4 max-h-96 overflow-y-auto pe-2">
                        {activeProject.messages && activeProject.messages.length > 0 ? (
                          activeProject.messages.map((m) => {
                            const isAdminMsg = m.sender_role === "admin";
                            return (
                              <div
                                key={m.id}
                                className={`flex flex-col ${isAdminMsg ? "items-start" : "items-end"}`}
                              >
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                                  <span className="font-semibold">{m.sender_name}</span>
                                  <span>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>

                                <div
                                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                                    isAdminMsg
                                      ? "rounded-ss-none border border-primary/20 bg-surface/90 text-foreground"
                                      : "rounded-se-none bg-primary text-primary-foreground font-medium shadow-glow"
                                  }`}
                                >
                                  <p className="whitespace-pre-line">{m.message}</p>
                                  {m.attachment_url && (
                                    <a
                                      href={m.attachment_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-black/20 px-2.5 py-1 text-[11px] underline"
                                    >
                                      <FileText className="size-3" />
                                      <span>{m.attachment_name || "Attachment"}</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center text-xs text-muted-foreground py-8">
                            {isAr ? "لا توجد رسائل سابقة. يمكنك كتابة استفسارك هنا." : "No messages yet."}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Chat Input Box */}
                    <form onSubmit={handleSendMessage} className="mt-6 border-t border-border/50 pt-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder={
                            isAr
                              ? "اكتب رسالتك أو استفسارك للمهندس المشرف..."
                              : "Type your message or inquiry to the engineering lead..."
                          }
                          className="flex-1 rounded-xl border border-input bg-surface/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                        <Button
                          type="submit"
                          disabled={sendingMessage || !replyMessage.trim()}
                          variant="hero"
                          size="sm"
                          className="rounded-xl px-4 gap-1.5"
                        >
                          {sendingMessage ? (
                            <div className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          ) : (
                            <Send className="size-3.5" />
                          )}
                          <span>{isAr ? "إرسال" : "Send"}</span>
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Milestones & Attachments */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Milestones Card */}
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Layers className="size-4 text-primary" />
                          <h3 className="font-bold text-sm text-foreground">
                            {isAr ? "مراحل الإنجاز (Milestones)" : "Project Milestones"}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {activeProject.milestones && activeProject.milestones.length > 0 ? (
                          activeProject.milestones.map((ml) => (
                            <div
                              key={ml.id}
                              className="flex items-start gap-3 rounded-xl border border-border/50 bg-surface/40 p-3 text-xs"
                            >
                              <div className="mt-0.5">
                                {ml.status === "completed" ? (
                                  <CheckCircle2 className="size-4 text-emerald-400" />
                                ) : ml.status === "in_progress" ? (
                                  <Clock className="size-4 text-primary animate-pulse" />
                                ) : (
                                  <div className="size-4 rounded-full border border-border" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-foreground">{ml.title}</p>
                                {ml.description && (
                                  <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {ml.description}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                  ml.status === "completed"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : ml.status === "in_progress"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {ml.status === "completed"
                                  ? isAr ? "مكتمل" : "Done"
                                  : ml.status === "in_progress"
                                  ? isAr ? "قيد العمل" : "Active"
                                  : isAr ? "قيد الانتظار" : "Pending"}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            {isAr ? "سيتم إدراج مراحل العمل فور اعتماد الخطة الهندسية." : "Milestones will appear upon scope kickoff."}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Attachments Card */}
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <FileCheck className="size-4 text-primary" />
                          <h3 className="font-bold text-sm text-foreground">
                            {isAr ? "ملفات ومخططات المشروع" : "Project Attachments"}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {activeProject.files && activeProject.files.length > 0 ? (
                          activeProject.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between rounded-xl border border-border/50 bg-surface/40 p-2.5 text-xs"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="size-4 text-primary shrink-0" />
                                <span className="truncate font-medium text-foreground">{file.file_name}</span>
                              </div>
                              <a
                                href={file.file_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-semibold shrink-0"
                              >
                                {isAr ? "تحميل" : "Download"}
                              </a>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            {isAr ? "لم يتم إرفاق ملفات مع الطلب الأصلي." : "No attachments submitted."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Graduation Projects State */
              <div className="mt-8 text-center py-16 glass rounded-3xl p-8 max-w-xl mx-auto space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow">
                  <GraduationCap className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {isAr ? "لا توجد طلبات مشاريع تخرج مسجلة حتى الآن" : "No Graduation Project Requests Yet"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isAr
                    ? "هل تعمل على فكرة مشروع تخرج هندسي أو برمجي؟ يمكنك تقديم طلبك الآن للحصول على الاستشارة الفنية والمقايسة التفصيلية."
                    : "Have an engineering or software graduation project in mind? Submit your request to get technical consultation and quotation."}
                </p>
                <div className="pt-2">
                  <Button asChild variant="hero" className="rounded-xl shadow-glow">
                    <Link to="/engineering-services">
                      {isAr ? "طلب دعم مشروع تخرج" : "Request Graduation Project Support"}
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: SMART HOMES REQUESTS & ORDERS CONTENT                           */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {activeMainTab === "smart-homes" && (
          <div className="mt-6 space-y-6">
            {smartHomeInquiries.length > 0 ? (
              <div className="grid gap-5">
                {smartHomeInquiries.map((inq) => {
                  const statusObj = getStatusBadge(inq.status);
                  const isStoreOrder = inq.kind === "smart_home_order";

                  return (
                    <div
                      key={inq.id}
                      className="glass glow-border rounded-2xl p-6 sm:p-7 space-y-4 transition-all hover:border-gold/40"
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/50 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 items-center justify-center rounded-2xl bg-gold/15 text-gold shadow-glow shrink-0">
                            {isStoreOrder ? <PackageCheck className="size-6" /> : <Sparkles className="size-6" />}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-foreground">
                                {isStoreOrder
                                  ? isAr ? "طلب شراء أجهزة ذكية (Smart Store)" : "Smart Home Products Order"
                                  : isAr ? "طلب معاينة ومقايسة ذكية (Installation Quote)" : "Smart Home Installation Request"}
                              </span>
                              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold border", statusObj.color)}>
                                {statusObj.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 font-mono">
                              <Calendar className="size-3 text-gold" />
                              {new Date(inq.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        {inq.phone && (
                          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-surface/60 px-3 py-1.5 border border-border/50">
                            <Phone className="size-3.5 text-gold" />
                            {inq.phone}
                          </span>
                        )}
                      </div>

                      {/* Client Info & Location */}
                      {(inq.company || inq.name) && (
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
                          {inq.name && (
                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                              <User className="size-3.5 text-gold" />
                              {inq.name}
                            </span>
                          )}
                          {inq.company && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="size-3.5 text-gold" />
                              {inq.company}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Request Details / Cart Items Payload */}
                      <div className="rounded-xl border border-border/60 bg-surface/50 p-4 text-xs leading-relaxed text-foreground/90 whitespace-pre-line font-mono">
                        {inq.message}
                      </div>

                      {/* Attachments if any (Floor Plan or Photo) */}
                      {(inq.file_url || inq.photo_url) && (
                        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-border/40">
                          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                            <Paperclip className="size-3.5 text-gold" />
                            {isAr ? "مرفقات المقايسة:" : "Quote Attachments:"}
                          </span>
                          {inq.file_url && (
                            <a
                              href={inq.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-gold/15 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/25 transition-colors border border-gold/30"
                            >
                              <FileText className="size-3.5" />
                              <span>{inq.file_name || (isAr ? "تحميل المخطط المعماري" : "Download Floor Plan")}</span>
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                          {inq.photo_url && (
                            <a
                              href={inq.photo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/25 transition-colors border border-primary/30"
                            >
                              <ImageIcon className="size-3.5" />
                              <span>{isAr ? "عرض الصورة المرفقة" : "View Attached Image"}</span>
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end pt-2">
                  <Button asChild variant="gold" className="rounded-xl shadow-glow gap-2">
                    <Link to="/smart-homes">
                      <Sparkles className="size-4" />
                      <span>{isAr ? "طلب مقايسة منزل ذكي جديدة" : "Request New Smart Home Quote"}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              /* Empty Smart Homes State */
              <div className="mt-8 text-center py-16 glass rounded-3xl p-8 max-w-xl mx-auto space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gold/10 text-gold shadow-glow">
                  <Sparkles className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {isAr ? "لا توجد طلبات أو مقايسات للمنازل الذكية حتى الآن" : "No Smart Home Requests or Orders Yet"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isAr
                    ? "حوّل منزلك أو فيلتك لنظام ذكي متكامل. يمكنك طلب مقايسة مجانية لتوريد وتركيب أحدث مفاتيح الإضاءة والتكييف والستائر الذكية."
                    : "Transform your villa or apartment with integrated smart living. Request a customized turnkey installation quote today."}
                </p>
                <div className="pt-2">
                  <Button asChild variant="gold" className="rounded-xl shadow-glow">
                    <Link to="/smart-homes">
                      {isAr ? "استكشاف المنازل الذكية وطلب مقايسة" : "Explore Smart Living & Request a Quote"}
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: INNOVATIVE SOLUTIONS REQUESTS CONTENT                           */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {activeMainTab === "solutions" && (
          <div className="mt-6 space-y-6">
            {solutionsInquiries.length > 0 ? (
              <div className="grid gap-5">
                {solutionsInquiries.map((inq) => {
                  const statusObj = getStatusBadge(inq.status);
                  const sectorObj = solutions.find((s) => s.slug === inq.sector);
                  const SectorIcon = sectorObj?.icon || Cpu;

                  return (
                    <div
                      key={inq.id}
                      className="glass glow-border rounded-2xl p-6 sm:p-7 space-y-4 transition-all hover:border-primary/40"
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/50 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-glow shrink-0">
                            <SectorIcon className="size-6" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-foreground">
                                {sectorObj
                                  ? (isAr ? sectorObj.title.ar : sectorObj.title.en)
                                  : (isAr ? "استفسار حلول هندسية متكاملة" : "Engineering Solution Request")}
                              </span>
                              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold border", statusObj.color)}>
                                {statusObj.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 font-mono">
                              <Calendar className="size-3 text-primary" />
                              {new Date(inq.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        {inq.company && (
                          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-surface/60 px-3 py-1.5 border border-border/50">
                            <Building className="size-3.5 text-primary" />
                            {inq.company}
                          </span>
                        )}
                      </div>

                      {/* Client Info */}
                      {(inq.name || inq.phone) && (
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
                          {inq.name && (
                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                              <User className="size-3.5 text-primary" />
                              {inq.name}
                            </span>
                          )}
                          {inq.phone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="size-3.5 text-muted-foreground" />
                              {inq.phone}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Inquiry Message */}
                      <div className="rounded-xl border border-border/60 bg-surface/50 p-4 text-xs leading-relaxed text-foreground/90 whitespace-pre-line">
                        {inq.message}
                      </div>

                      {/* Attachments */}
                      {(inq.file_url || inq.photo_url) && (
                        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-border/40">
                          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                            <Paperclip className="size-3.5 text-primary" />
                            {isAr ? "المرفقات الفنية والمخططات:" : "Technical Attachments:"}
                          </span>
                          {inq.file_url && (
                            <a
                              href={inq.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/25 transition-colors border border-primary/30"
                            >
                              <FileText className="size-3.5" />
                              <span>{inq.file_name || (isAr ? "تحميل المواصفات الفنية" : "Download Attached Document")}</span>
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                          {inq.photo_url && (
                            <a
                              href={inq.photo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/25 transition-colors border border-primary/30"
                            >
                              <ImageIcon className="size-3.5" />
                              <span>{isAr ? "عرض المخطط أو الصورة" : "View Attached Photo"}</span>
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end pt-2">
                  <Button asChild variant="hero" className="rounded-xl shadow-glow gap-2">
                    <Link to="/solutions">
                      <Cpu className="size-4" />
                      <span>{isAr ? "تقديم طلب حل هندسي جديد" : "Submit New Solution Request"}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              /* Empty Solutions State */
              <div className="mt-8 text-center py-16 glass rounded-3xl p-8 max-w-xl mx-auto space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow">
                  <Cpu className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {isAr ? "لا توجد طلبات للحلول المبتكرة حتى الآن" : "No Innovative Solutions Inquiries Yet"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isAr
                    ? "هل تحتاج إلى أتمتة مصنع، أنظمة طاقة شمسية، ري ذكي، أو حماية وموازنة أحمال الكهرباء؟ مهندسونا جاهزون لتصميم وتنفيذ الحل المناسب."
                    : "Need industrial automation, solar energy, smart agriculture, or power protection systems? Explore our solutions and send your requirements."}
                </p>
                <div className="pt-2">
                  <Button asChild variant="hero" className="rounded-xl shadow-glow">
                    <Link to="/solutions">
                      {isAr ? "استكشاف الحلول المبتكرة وتقديم طلب" : "Explore Innovative Solutions"}
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
