import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  FileText,
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Plus,
  RefreshCw,
  Download,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Shield,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  DollarSign,
  Receipt,
  Sparkles,
  Lock,
  Eye,
  Trash2,
  Check,
  X,
  Cpu,
  Factory,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAllAdminRequests,
  adminUpdateRequestStatus,
  adminSendProjectMessage,
  adminCreateQuotation,
  adminAddMilestone,
  adminToggleMilestoneStatus,
  type StoredProjectRequest,
} from "@/services/engineeringService";
import {
  requestStatuses,
  projectCategories,
  engineeringServices,
} from "@/data/engineeringData";

export const Route = createFileRoute("/_authenticated/admin/engineering-requests")({
  head: () => ({
    meta: [
      { title: "Engineering Requests Administration — YSMED" },
      { name: "description", content: "Manage client engineering prototyping requests and consultations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

export function Page() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const navigate = useNavigate();

  // Auth & Admin check
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);

  // Requests state
  const [requests, setRequests] = useState<StoredProjectRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [activeRequest, setActiveRequest] = useState<StoredProjectRequest | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  // Detail view active tab: 'overview' | 'chat' | 'quote' | 'milestones'
  const [detailTab, setDetailTab] = useState<"overview" | "chat" | "quote" | "milestones">("overview");

  // Admin chat reply input
  const [adminMessageText, setAdminMessageText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [sendingAdminMsg, setSendingAdminMsg] = useState(false);

  // New Quote form state
  const [quoteScope, setQuoteScope] = useState("");
  const [quoteDeliverables, setQuoteDeliverables] = useState("");
  const [quoteCost, setQuoteCost] = useState("");
  const [quoteDuration, setQuoteDuration] = useState("");
  const [quoteTerms, setQuoteTerms] = useState("");
  const [creatingQuote, setCreatingQuote] = useState(false);

  // New Milestone form state
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDesc, setMilestoneDesc] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [addingMilestone, setAddingMilestone] = useState(false);

  // Check admin role
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) {
          if (active) {
            setIsAdmin(false);
            setLoadingAdminCheck(false);
            navigate({ to: "/auth", replace: true });
          }
          return;
        }

        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (active) {
          setIsAdmin(!!roleData);
          setLoadingAdminCheck(false);
        }
      } catch {
        if (active) {
          setIsAdmin(false);
          setLoadingAdminCheck(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [navigate]);

  // Load requests
  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await fetchAllAdminRequests();
      setRequests(data);
      if (data.length > 0 && !activeRequest && data[0]) {
        setActiveRequest(data[0]);
      } else if (activeRequest) {
        const refreshed = data.find((r) => r.id === activeRequest.id);
        if (refreshed) setActiveRequest(refreshed);
      }
    } catch (err) {
      console.error(err);
      toast.error(isAr ? "فشل تحميل الطلبات" : "Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadRequests();
    }
  }, [isAdmin]);

  // KPI Calculations
  const totalCount = requests.length;
  const newCount = requests.filter((r) => r.status === "new").length;
  const reviewCount = requests.filter((r) => r.status === "under_review").length;
  const activeCount = requests.filter((r) => ["in_progress", "testing"].includes(r.status)).length;
  const quotesCount = requests.filter((r) => r.status === "quotation_sent").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.project_title.toLowerCase().includes(q);
        const matchRef = r.reference_number.toLowerCase().includes(q);
        const matchName = r.full_name.toLowerCase().includes(q);
        const matchEmail = r.email.toLowerCase().includes(q);
        const matchPhone = r.phone.includes(q);
        if (!matchTitle && !matchRef && !matchName && !matchEmail && !matchPhone) return false;
      }

      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (categoryFilter !== "all" && r.project_category !== categoryFilter) return false;
      if (urgencyFilter !== "all" && r.urgency !== urgencyFilter) return false;

      return true;
    });
  }, [requests, searchQuery, statusFilter, categoryFilter, urgencyFilter]);

  // Change request status
  const handleStatusChange = async (newStatus: string) => {
    if (!activeRequest) return;
    try {
      await adminUpdateRequestStatus(activeRequest.id, newStatus);
      toast.success(isAr ? "تم تحديث حالة الطلب بنجاح" : "Status updated");
      loadRequests();
    } catch {
      toast.error(isAr ? "فشل التحديث" : "Update failed");
    }
  };

  // Send admin message
  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest || !adminMessageText.trim()) return;

    setSendingAdminMsg(true);
    try {
      await adminSendProjectMessage(
        activeRequest.id,
        adminMessageText,
        isInternalNote
      );
      toast.success(
        isInternalNote
          ? isAr ? "تم حفظ الملاحظة الداخلية" : "Internal note saved"
          : isAr ? "تم إرسال الرسالة إلى العميل" : "Message sent to customer"
      );
      setAdminMessageText("");
      loadRequests();
    } catch {
      toast.error(isAr ? "فشل إرسال الرسالة" : "Failed to send");
    } finally {
      setSendingAdminMsg(false);
    }
  };

  // Create Quotation
  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest || !quoteScope || !quoteCost) {
      toast.error(isAr ? "يرجى ملء النطاق والتكلفة" : "Please fill scope and cost");
      return;
    }

    setCreatingQuote(true);
    try {
      await adminCreateQuotation(
        activeRequest.id,
        quoteScope,
        quoteDeliverables,
        parseFloat(quoteCost),
        "EGP",
        quoteDuration || (isAr ? "14 يوم عمل" : "14 business days"),
        quoteTerms
      );
      toast.success(isAr ? "تم إصدار عرض السعر وإرساله للعميل بنجاح" : "Quotation created and sent");
      setQuoteScope("");
      setQuoteDeliverables("");
      setQuoteCost("");
      loadRequests();
    } catch {
      toast.error(isAr ? "فشل إنشاء المقايسة" : "Failed to create quote");
    } finally {
      setCreatingQuote(false);
    }
  };

  // Add Milestone
  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest || !milestoneTitle) return;

    setAddingMilestone(true);
    try {
      await adminAddMilestone(activeRequest.id, milestoneTitle, milestoneDesc, milestoneDate);
      toast.success(isAr ? "تمت إضافة مرحلة الإنجاز" : "Milestone added");
      setMilestoneTitle("");
      setMilestoneDesc("");
      setMilestoneDate("");
      loadRequests();
    } catch {
      toast.error(isAr ? "فشل إضافة المرحلة" : "Failed to add milestone");
    } finally {
      setAddingMilestone(false);
    }
  };

  // Export to Excel / CSV with UTF-8 BOM
  const exportToExcel = () => {
    const headers = [
      "رقم المرجع",
      "اسم العميل",
      "البريد الإلكتروني",
      "الهاتف",
      "عنوان المشروع",
      "التصنيف",
      "الحالة",
      "الأولوية",
      "الميزانية التقديرية",
      "تاريخ الإرسال",
    ];

    const rows = filteredRequests.map((r) => [
      r.reference_number,
      r.full_name,
      r.email,
      r.phone,
      r.project_title,
      r.project_category,
      r.status,
      r.urgency,
      r.budget_min ? `${r.budget_min} ${r.budget_currency}` : "غير محدد",
      new Date(r.created_at).toLocaleDateString(),
    ]);

    const bom = "\uFEFF";
    const escapeCell = (val: any) => `"${String(val || "").replace(/"/g, '""')}"`;
    const csvContent = [
      headers.map(escapeCell).join(","),
      ...rows.map((row) => row.map(escapeCell).join(",")),
    ].join("\r\n");

    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ysmed_engineering_requests_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingAdminCheck) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <Lock className="size-12 text-destructive mb-3" />
        <h2 className="text-xl font-bold text-foreground">
          {isAr ? "منطقة مخصصة لمسؤولي YSMED فقط" : "Restricted Administrator Area"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAr ? "ليس لديك صلاحية وصول إلى لوحة طلبات المشاريع الهندسية." : "You do not have administrative privileges."}
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-xl">
          <Link to="/">
            {isAr ? "العودة للرئيسية" : "Go Home"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Shield className="size-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                YSMED ADMIN CONSOLE
              </span>
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl text-foreground">
              {isAr ? "إدارة طلبات المشاريع الهندسية والنماذج" : "Engineering Requests & Prototyping Admin"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              className="rounded-xl gap-2"
            >
              <Download className="size-4" />
              <span>{isAr ? "تصدير إلى Excel" : "Export Excel"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={loadRequests}
              className="rounded-xl gap-2"
            >
              <RefreshCw className={`size-4 ${loadingRequests ? "animate-spin" : ""}`} />
              <span>{isAr ? "تحديث" : "Refresh"}</span>
            </Button>

            <Button asChild variant="hero" size="sm" className="rounded-xl shadow-glow gap-1.5">
              <Link to="/admin">
                <span>{isAr ? "لوحة الإدارة العامة" : "Main Admin"}</span>
                <ChevronRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="glass rounded-xl p-4 border border-border/60">
            <span className="text-xs text-muted-foreground">{isAr ? "إجمالي الطلبات" : "Total Requests"}</span>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground">{totalCount}</p>
          </div>
          <div className="glass rounded-xl p-4 border border-blue-500/30 bg-blue-500/5">
            <span className="text-xs text-blue-400">{isAr ? "طلبات جديدة" : "New Requests"}</span>
            <p className="mt-1 font-mono text-2xl font-bold text-blue-400">{newCount}</p>
          </div>
          <div className="glass rounded-xl p-4 border border-amber-500/30 bg-amber-500/5">
            <span className="text-xs text-amber-400">{isAr ? "قيد المراجعة" : "Under Review"}</span>
            <p className="mt-1 font-mono text-2xl font-bold text-amber-400">{reviewCount}</p>
          </div>
          <div className="glass rounded-xl p-4 border border-cyan-500/30 bg-cyan-500/5">
            <span className="text-xs text-cyan-400">{isAr ? "عروض الأسعار" : "Pending Quotes"}</span>
            <p className="mt-1 font-mono text-2xl font-bold text-cyan-400">{quotesCount}</p>
          </div>
          <div className="glass rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/5">
            <span className="text-xs text-emerald-400">{isAr ? "قيد التنفيذ" : "Active Development"}</span>
            <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">{activeCount}</p>
          </div>
          <div className="glass rounded-xl p-4 border border-green-500/30 bg-green-500/5">
            <span className="text-xs text-green-400">{isAr ? "مكتملة ومُسلّمة" : "Completed"}</span>
            <p className="mt-1 font-mono text-2xl font-bold text-green-400">{completedCount}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "بحث بالمرجع، اسم العميل، الهاتف، أو العنوان..." : "Search by reference, name, phone..."}
              className="w-full rounded-xl border border-input bg-surface/70 px-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <Search className="pointer-events-none absolute end-3 top-2.5 size-3.5 text-muted-foreground" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-input bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">{isAr ? "كل الحالات" : "All Statuses"}</option>
              {requestStatuses.map((st) => (
                <option key={st.value} value={st.value}>
                  {isAr ? st.labelAr : st.labelEn}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-input bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">{isAr ? "كل التصنيفات" : "All Categories"}</option>
              {projectCategories.map((c) => (
                <option key={c.value} value={c.value}>
                  {isAr ? c.labelAr : c.labelEn}
                </option>
              ))}
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="rounded-xl border border-input bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">{isAr ? "كل الأولويات" : "All Urgencies"}</option>
              <option value="normal">{isAr ? "أولوية عادية" : "Normal"}</option>
              <option value="high">{isAr ? "أولوية هامة" : "High"}</option>
              <option value="urgent">{isAr ? "عاجل جداً" : "Urgent"}</option>
            </select>
          </div>
        </div>

        {/* TWO-COLUMN WORKSPACE: Requests List & Active Drawer */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Requests List Column */}
          <div className="lg:col-span-5 space-y-3 max-h-[780px] overflow-y-auto pe-1">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((r) => {
                const isSelected = activeRequest?.id === r.id;
                const st = requestStatuses.find((s) => s.value === r.status);
                return (
                  <div
                    key={r.id}
                    onClick={() => setActiveRequest(r)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border/60 bg-surface/30 hover:border-border hover:bg-surface/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {r.reference_number}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${st?.color || ""}`}>
                        {isAr ? st?.labelAr : st?.labelEn}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-foreground truncate">
                      {r.project_title}
                    </h4>

                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{r.full_name}</span>
                      <span className="font-mono text-[11px]">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-border/60 bg-surface/20 p-8 text-center text-xs text-muted-foreground">
                {isAr ? "لا توجد طلبات تطابق معايير البحث." : "No requests found matching criteria."}
              </div>
            )}
          </div>

          {/* Active Request Details Workspace */}
          <div className="lg:col-span-7">
            {activeRequest ? (
              <div className="glass glow-border rounded-2xl p-6 flex flex-col justify-between min-h-[600px]">
                <div>
                  {/* Top Header of Active Request */}
                  <div className="flex flex-col justify-between gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-base font-bold text-primary">
                          {activeRequest.reference_number}
                        </span>
                        <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted-foreground border border-border/50">
                          {activeRequest.project_category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {activeRequest.project_title}
                      </h3>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{isAr ? "الحالة:" : "Status:"}</span>
                      <select
                        value={activeRequest.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="rounded-xl border border-primary/40 bg-surface px-3 py-1.5 text-xs font-bold text-primary focus:outline-none"
                      >
                        {requestStatuses.map((s) => (
                          <option key={s.value} value={s.value}>
                            {isAr ? s.labelAr : s.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Customer Quick Contact Banner */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-surface/50 p-3 text-xs">
                    <span className="font-bold text-foreground">{activeRequest.full_name}</span>
                    <a
                      href={`tel:${activeRequest.phone}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Phone className="size-3" />
                      <span>{activeRequest.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${activeRequest.whatsapp?.replace(/[^0-9]/g, "") || activeRequest.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:underline"
                    >
                      <MessageSquare className="size-3" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:${activeRequest.email}`}
                      className="flex items-center gap-1 text-muted-foreground hover:underline"
                    >
                      <Mail className="size-3" />
                      <span>{activeRequest.email}</span>
                    </a>
                    {activeRequest.university && (
                      <span className="text-muted-foreground">
                        • {activeRequest.university}
                      </span>
                    )}
                  </div>

                  {/* Tabs: Overview, Chat, Quotation, Milestones */}
                  <div className="mt-5 flex border-b border-border/60">
                    {[
                      { id: "overview", labelAr: "التفاصيل والمرفقات", labelEn: "Overview & Specs" },
                      { id: "chat", labelAr: "المحادثة والملاحظات", labelEn: "Messages & Notes" },
                      { id: "quote", labelAr: "عروض الأسعار", labelEn: "Quotations" },
                      { id: "milestones", labelAr: "مراحل الإنجاز", labelEn: "Milestones" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDetailTab(tab.id as any)}
                        className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                          detailTab === tab.id
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isAr ? tab.labelAr : tab.labelEn}
                      </button>
                    ))}
                  </div>

                  {/* TAB 1: Overview & Specs */}
                  {detailTab === "overview" && (
                    <div className="mt-5 space-y-4 text-xs leading-relaxed animate-rise">
                      <div>
                        <span className="font-bold text-foreground block mb-1">
                          {isAr ? "الوصف التفصيلي للمشروع:" : "Detailed Description:"}
                        </span>
                        <p className="rounded-xl border border-border/50 bg-surface/30 p-3 text-muted-foreground whitespace-pre-line">
                          {activeRequest.project_description}
                        </p>
                      </div>

                      {activeRequest.required_features && (
                        <div>
                          <span className="font-bold text-foreground block mb-1">
                            {isAr ? "المخرجات والوظائف المستهدفة:" : "Deliverables & Features:"}
                          </span>
                          <p className="rounded-xl border border-border/50 bg-surface/30 p-3 text-muted-foreground">
                            {activeRequest.required_features}
                          </p>
                        </div>
                      )}

                      {/* Attachments Section */}
                      <div>
                        <span className="font-bold text-foreground block mb-2">
                          {isAr ? `الملفات والمخططات المرفقة (${activeRequest.files?.length || 0}):` : `Attachments (${activeRequest.files?.length || 0}):`}
                        </span>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {activeRequest.files && activeRequest.files.length > 0 ? (
                            activeRequest.files.map((f) => (
                              <div
                                key={f.id}
                                className="flex items-center justify-between rounded-xl border border-border/50 bg-surface/40 p-2.5"
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <FileText className="size-4 text-primary shrink-0" />
                                  <span className="truncate font-medium text-foreground">{f.file_name}</span>
                                </div>
                                <a
                                  href={f.file_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-bold shrink-0 text-[11px]"
                                >
                                  {isAr ? "تحميل" : "Download"}
                                </a>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground text-[11px]">
                              {isAr ? "لا توجد ملفات مرفقة مع هذا الطلب." : "No attachments."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Messages & Internal Notes */}
                  {detailTab === "chat" && (
                    <div className="mt-5 space-y-4 animate-rise">
                      {/* Messages Feed */}
                      <div className="max-h-80 overflow-y-auto space-y-3 pe-2">
                        {activeRequest.messages && activeRequest.messages.length > 0 ? (
                          activeRequest.messages.map((m) => (
                            <div
                              key={m.id}
                              className={`rounded-xl p-3 text-xs border ${
                                m.is_internal
                                  ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                                  : m.sender_role === "admin"
                                  ? "border-primary/30 bg-primary/10 text-foreground"
                                  : "border-border/60 bg-surface/50 text-foreground"
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                                <span className="font-bold">
                                  {m.is_internal ? (isAr ? "ملاحظة داخلية للمشرفين فقط" : "Internal Admin Note") : m.sender_name}
                                </span>
                                <span>{new Date(m.created_at).toLocaleString()}</span>
                              </div>
                              <p className="whitespace-pre-line">{m.message}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-6">
                            {isAr ? "لا توجد رسائل بعد." : "No messages yet."}
                          </p>
                        )}
                      </div>

                      {/* Send Form */}
                      <form onSubmit={handleSendAdminMessage} className="border-t border-border/50 pt-3 space-y-2">
                        <textarea
                          rows={2}
                          value={adminMessageText}
                          onChange={(e) => setAdminMessageText(e.target.value)}
                          placeholder={
                            isInternalNote
                              ? isAr ? "اكتب ملاحظة داخلية سرية للمشرفين فقط..." : "Type internal staff note..."
                              : isAr ? "اكتب رداً يصل للعميل مباشرة في بوابته..." : "Type customer reply..."
                          }
                          className="w-full rounded-xl border border-input bg-surface/70 p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                        />

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                            <input
                              type="checkbox"
                              checked={isInternalNote}
                              onChange={(e) => setIsInternalNote(e.target.checked)}
                              className="rounded border-border text-amber-500 focus:ring-amber-500"
                            />
                            <span className={isInternalNote ? "text-amber-400 font-bold" : "text-muted-foreground"}>
                              {isAr ? "ملاحظة داخلية خاصة (مخفية عن العميل)" : "Internal note (Hidden from client)"}
                            </span>
                          </label>

                          <Button
                            type="submit"
                            disabled={sendingAdminMsg || !adminMessageText.trim()}
                            variant="hero"
                            size="sm"
                            className="rounded-xl px-4 gap-1.5"
                          >
                            <Send className="size-3.5" />
                            <span>{isAr ? "إرسال" : "Send"}</span>
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* TAB 3: Quotations Management */}
                  {detailTab === "quote" && (
                    <div className="mt-5 space-y-5 animate-rise">
                      {/* Existing Quotes */}
                      {activeRequest.quotes && activeRequest.quotes.length > 0 && (
                        <div className="space-y-3">
                          <span className="font-bold text-xs text-foreground block">
                            {isAr ? "عروض الأسعار الصادرة:" : "Existing Quotations:"}
                          </span>
                          {activeRequest.quotes.map((q) => (
                            <div key={q.id} className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-xs">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono font-bold text-cyan-400">{q.quote_number}</span>
                                <span className="font-bold text-foreground">{q.estimated_cost} {q.currency}</span>
                              </div>
                              <p className="text-muted-foreground whitespace-pre-line">{q.scope}</p>
                              <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
                                <span>{isAr ? `الحالة: ${q.quote_status}` : `Status: ${q.quote_status}`}</span>
                                <span>{new Date(q.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Create New Quote Form */}
                      <form onSubmit={handleCreateQuotation} className="rounded-xl border border-border/60 bg-surface/40 p-4 space-y-3 text-xs">
                        <span className="font-bold text-sm text-foreground block">
                          {isAr ? "إصدار عرض سعر جديد للعميل" : "Issue New Quotation"}
                        </span>

                        <div>
                          <label className="block text-muted-foreground mb-1">{isAr ? "نطاق العمل الفني *" : "Technical Scope *"}</label>
                          <textarea
                            rows={2}
                            required
                            value={quoteScope}
                            onChange={(e) => setQuoteScope(e.target.value)}
                            placeholder={isAr ? "تفاصيل ما سيتم تنفيذه..." : "Scope details..."}
                            className="w-full rounded-xl border border-input bg-surface p-2 text-xs text-foreground focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-muted-foreground mb-1">{isAr ? "البنود المسلمة *" : "Deliverables *"}</label>
                          <input
                            type="text"
                            required
                            value={quoteDeliverables}
                            onChange={(e) => setQuoteDeliverables(e.target.value)}
                            placeholder={isAr ? "بوردة PCB مجمعة + أكواد المصدر + وثائق التشغيل" : "Deliverables"}
                            className="w-full rounded-xl border border-input bg-surface p-2 text-xs text-foreground focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-muted-foreground mb-1">{isAr ? "التكلفة التقديرية (EGP) *" : "Price (EGP) *"}</label>
                            <input
                              type="number"
                              required
                              value={quoteCost}
                              onChange={(e) => setQuoteCost(e.target.value)}
                              placeholder="7500"
                              className="w-full rounded-xl border border-input bg-surface p-2 text-xs text-foreground focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-muted-foreground mb-1">{isAr ? "مدة التنفيذ المقترحة" : "Estimated Duration"}</label>
                            <input
                              type="text"
                              value={quoteDuration}
                              onChange={(e) => setQuoteDuration(e.target.value)}
                              placeholder={isAr ? "14 يوم عمل" : "14 business days"}
                              className="w-full rounded-xl border border-input bg-surface p-2 text-xs text-foreground focus:outline-none"
                            />
                          </div>
                        </div>

                        <Button type="submit" disabled={creatingQuote} variant="hero" size="sm" className="w-full rounded-xl shadow-glow">
                          <Receipt className="size-4" />
                          <span>{isAr ? "إرسال عرض السعر للعميل" : "Send Quotation"}</span>
                        </Button>
                      </form>
                    </div>
                  )}

                  {/* TAB 4: Milestones Management */}
                  {detailTab === "milestones" && (
                    <div className="mt-5 space-y-5 animate-rise">
                      {/* Milestones List */}
                      <div className="space-y-2">
                        {activeRequest.milestones?.map((ml) => (
                          <div
                            key={ml.id}
                            className="flex items-center justify-between rounded-xl border border-border/50 bg-surface/40 p-3 text-xs"
                          >
                            <div>
                              <p className="font-bold text-foreground">{ml.title}</p>
                              {ml.description && <p className="text-[11px] text-muted-foreground">{ml.description}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={ml.status}
                                onChange={(e) => adminToggleMilestoneStatus(ml.id, e.target.value as any)}
                                className="rounded-lg border border-border bg-surface px-2 py-1 text-[11px] font-bold"
                              >
                                <option value="pending">{isAr ? "قيد الانتظار" : "Pending"}</option>
                                <option value="in_progress">{isAr ? "قيد العمل" : "In Progress"}</option>
                                <option value="completed">{isAr ? "مكتمل" : "Completed"}</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Milestone Form */}
                      <form onSubmit={handleAddMilestone} className="rounded-xl border border-border/60 bg-surface/40 p-4 space-y-3 text-xs">
                        <span className="font-bold text-sm text-foreground block">
                          {isAr ? "إضافة مرحلة عمل جديدة (Milestone)" : "Add New Milestone"}
                        </span>
                        <input
                          type="text"
                          required
                          value={milestoneTitle}
                          onChange={(e) => setMilestoneTitle(e.target.value)}
                          placeholder={isAr ? "عنوان المرحلة..." : "Milestone title..."}
                          className="w-full rounded-xl border border-input bg-surface p-2 text-xs text-foreground focus:outline-none"
                        />
                        <input
                          type="text"
                          value={milestoneDesc}
                          onChange={(e) => setMilestoneDesc(e.target.value)}
                          placeholder={isAr ? "وصف مخرجات المرحلة..." : "Deliverables description..."}
                          className="w-full rounded-xl border border-input bg-surface p-2 text-xs text-foreground focus:outline-none"
                        />
                        <Button type="submit" disabled={addingMilestone} variant="outline" size="sm" className="w-full rounded-xl gap-2">
                          <Plus className="size-4" />
                          <span>{isAr ? "إضافة المرحلة" : "Add Milestone"}</span>
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-border/60 text-xs text-muted-foreground">
                {isAr ? "اختر طلباً من القائمة لعرض تفاصيله وإدارته" : "Select a request from the list"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
