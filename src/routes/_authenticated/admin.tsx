import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Trash2,
  FileText,
  Download,
  Search,
  Users,
  MessageSquare,
  Shield,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  UserCheck,
  Building,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
  Activity,
  TrendingUp,
  BarChart3,
  Eye,
  Copy,
  Check,
  X,
  Send,
  Filter,
  Sparkles,
  Layers,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { solutions } from "@/data/solutions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — YSMED" },
      { name: "description", content: "Manage YSMED messages, project requests and customers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

type Inquiry = {
  id: string;
  user_id?: string | null;
  kind: string;
  sector: string | null;
  name: string;
  company?: string | null;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
  photo_url?: string | null;
  file_url?: string | null;
  file_name?: string | null;
};

type Profile = {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  company: string;
  created_at: string;
};

const statuses = ["new", "in_progress", "done"] as const;

// Helper to export data to CSV (Excel compatible with UTF-8 BOM for Arabic & English)
function exportToCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const bom = "\uFEFF";
  const escapeCell = (val: string | number | null | undefined) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ].join("\r\n");

  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function Page() {
  const { t, tl, lang } = useI18n();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [rolesMap, setRolesMap] = useState<Record<string, string>>({});
  
  // Navigation & Tabs
  const [tab, setTab] = useState<"overview" | "inquiries" | "customers">("overview");
  
  // Inquiries Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7days" | "30days">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [search, setSearch] = useState<string>("");

  // Customers Filters
  const [customerRoleFilter, setCustomerRoleFilter] = useState<"all" | "admin" | "user">("all");

  // Loading & Sync state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Modals state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Profile | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Fetch all admin data
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        setIsAdmin(false);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      setCurrentUserId(u.user.id);

      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!role) {
        setIsAdmin(false);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setIsAdmin(true);

      const [{ data: inq }, { data: prof }, { data: allRoles }] = await Promise.all([
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name, email, phone, company, created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);

      setRows((inq as Inquiry[]) ?? []);
      setCustomers((prof as Profile[]) ?? []);

      if (allRoles) {
        const rMap: Record<string, string> = {};
        allRoles.forEach((r) => {
          rMap[r.user_id] = r.role;
        });
        setRolesMap(rMap);
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Admin data load error:", err);
      toast.error(lang === "ar" ? "تعذر تحميل البيانات" : "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lang]);

  // Initial Load & Realtime Subscriptions
  useEffect(() => {
    fetchData();

    // Setup Supabase Realtime Channels for live synchronization
    const inqChannel = supabase
      .channel("admin-inquiries-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inquiries" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newInq = payload.new as Inquiry;
            setRows((prev) => [newInq, ...prev.filter((x) => x.id !== newInq.id)]);
            toast.info(lang === "ar" ? "طلب جديد وصل للتو!" : "New inquiry received!");
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Inquiry;
            setRows((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
            setSelectedInquiry((cur) => (cur?.id === updated.id ? { ...cur, ...updated } : cur));
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as Record<string, unknown>)["id"] as string | undefined;
            if (oldId) {
              setRows((prev) => prev.filter((x) => x.id !== oldId));
              setSelectedInquiry((cur) => (cur?.id === oldId ? null : cur));
            }
          }
        }
      )
      .subscribe();

    const profChannel = supabase
      .channel("admin-profiles-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newProf = payload.new as Profile;
            setCustomers((prev) => [newProf, ...prev.filter((x) => x.id !== newProf.id)]);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Profile;
            setCustomers((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
            setSelectedCustomer((cur) => (cur?.id === updated.id ? { ...cur, ...updated } : cur));
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as Record<string, unknown>)["id"] as string | undefined;
            if (oldId) {
              setCustomers((prev) => prev.filter((x) => x.id !== oldId));
              setSelectedCustomer((cur) => (cur?.id === oldId ? null : cur));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inqChannel);
      supabase.removeChannel(profChannel);
    };
  }, [fetchData, lang]);

  // Status counts
  const counts = useMemo(
    () => Object.fromEntries(statuses.map((s) => [s, rows.filter((r) => r.status === s).length])),
    [rows]
  );

  // Sector helper
  const getSector = useCallback((slug: string | null) => {
    if (!slug) return null;
    return solutions.find((x) => x.slug === slug);
  }, []);

  const sectorName = useCallback((slug: string | null) => {
    const s = getSector(slug);
    return s ? tl(s.title) : null;
  }, [getSector, tl]);

  // Filtered inquiries
  const filteredRows = useMemo(() => {
    const now = Date.now();
    return rows
      .filter((r) => {
        // Status filter
        if (statusFilter !== "all" && r.status !== statusFilter) return false;

        // Kind filter
        if (kindFilter !== "all" && r.kind !== kindFilter) return false;

        // Sector filter
        if (sectorFilter !== "all" && r.sector !== sectorFilter) return false;

        // Date filter
        if (dateFilter !== "all") {
          const itemTime = new Date(r.created_at).getTime();
          const diffHours = (now - itemTime) / (1000 * 60 * 60);
          if (dateFilter === "today" && diffHours > 24) return false;
          if (dateFilter === "7days" && diffHours > 24 * 7) return false;
          if (dateFilter === "30days" && diffHours > 24 * 30) return false;
        }

        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const match =
            r.name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            (r.phone && r.phone.toLowerCase().includes(q)) ||
            (r.company && r.company.toLowerCase().includes(q)) ||
            r.message.toLowerCase().includes(q) ||
            (r.sector && r.sector.toLowerCase().includes(q));
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortBy === "newest" ? timeB - timeA : timeA - timeB;
      });
  }, [rows, statusFilter, kindFilter, sectorFilter, dateFilter, search, sortBy]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (customerRoleFilter !== "all") {
        const isAdm = rolesMap[c.id] === "admin";
        if (customerRoleFilter === "admin" && !isAdm) return false;
        if (customerRoleFilter === "user" && isAdm) return false;
      }

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (c.full_name && c.full_name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.company && c.company.toLowerCase().includes(q))
      );
    });
  }, [customers, customerRoleFilter, search, rolesMap]);

  // Sector demand counts for analytics
  const sectorDemand = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      if (r.sector) {
        map[r.sector] = (map[r.sector] || 0) + 1;
      }
    });
    return Object.entries(map)
      .map(([slug, count]) => ({
        slug,
        count,
        sector: solutions.find((s) => s.slug === slug),
      }))
      .sort((a, b) => b.count - a.count);
  }, [rows]);

  // Formatting helpers
  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString(lang === "ar" ? "ar-EG" : "en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return d;
    }
  };

  const timeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return lang === "ar" ? "الآن" : "Just now";
    if (diffMins < 60) return lang === "ar" ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return lang === "ar" ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return lang === "ar" ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
  };

  // Actions
  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
    }
    toast.success(lang === "ar" ? "تم تحديث حالة الطلب" : "Status updated");
  };

  const removeInquiry = async (id: string) => {
    if (!confirm(lang === "ar" ? "هل أنت متأكد من حذف هذه الرسالة نهائياً؟" : "Are you sure you want to delete this message?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
    toast.success(lang === "ar" ? "تم حذف الرسالة بنجاح" : "Message deleted");
  };

  const deleteUser = async (id: string, name: string) => {
    if (id === currentUserId) {
      toast.error(t("cannotDemoteSelf"));
      return;
    }

    if (
      !confirm(
        lang === "ar"
          ? `هل أنت متأكد من رغبتك في حذف المستخدم "${name || id}"؟ سيتم حذف جميع بياناته.`
          : `Are you sure you want to delete user "${name || id}"? All their data will be deleted.`
      )
    ) {
      return;
    }

    try {
      const { error: rpcError } = await supabase.rpc("delete_user_by_admin" as never, {
        target_user_id: id,
      } as never);

      if (rpcError) {
        const { error: profileError } = await supabase.from("profiles").delete().eq("id", id);
        if (profileError) throw profileError;
      }

      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setRows((prev) => prev.filter((r) => r.user_id !== id));
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
      toast.success(t("userDeleted"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  // Toggle user role between admin and user
  const updateUserRole = async (targetUserId: string, newRole: "admin" | "user") => {
    if (targetUserId === currentUserId && newRole !== "admin") {
      toast.error(t("cannotDemoteSelf"));
      return;
    }

    try {
      if (newRole === "admin") {
        const { error } = await supabase.from("user_roles").upsert(
          { user_id: targetUserId, role: "admin" },
          { onConflict: "user_id,role" }
        );
        if (error) throw error;
        setRolesMap((prev) => ({ ...prev, [targetUserId]: "admin" }));
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", targetUserId)
          .eq("role", "admin");
        if (error) throw error;
        setRolesMap((prev) => {
          const next = { ...prev };
          delete next[targetUserId];
          return next;
        });
      }
      toast.success(t("roleUpdated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  // Copy contact info to clipboard
  const copyContactInfo = (inq: Inquiry) => {
    const lines = [
      `Name: ${inq.name}`,
      inq.company ? `Company: ${inq.company}` : null,
      `Email: ${inq.email}`,
      inq.phone ? `Phone: ${inq.phone}` : null,
      inq.sector ? `Sector: ${inq.sector}` : null,
      `Type: ${inq.kind === "request" ? "Project Request" : "Contact Inquiry"}`,
      `Message: ${inq.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(lines);
    toast.success(t("infoCopied"));
  };

  // Quick communication helpers
  const getMailtoUrl = (inq: Inquiry) => {
    const subject = encodeURIComponent(
      inq.kind === "request"
        ? `Regarding your YSMED Project Request: ${sectorName(inq.sector) || "Engineering Solutions"}`
        : "Regarding your inquiry on YSMED"
    );
    const body = encodeURIComponent(
      `Dear ${inq.name},\n\nThank you for reaching out to YSMED regarding your inquiry:\n"${inq.message}"\n\nBest regards,\nYSMED Engineering Solutions`
    );
    return `mailto:${inq.email}?subject=${subject}&body=${body}`;
  };

  const getWhatsAppUrl = (phone: string | null, name: string) => {
    if (!phone) return null;
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      lang === "ar"
        ? `مرحباً ${name}، نتواصل معك من فريق YSMED للحلول الهندسية والتقنية بخصوص طلبك.`
        : `Hello ${name}, this is YSMED Engineering Solutions following up on your inquiry.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  // Export Users to Excel / CSV
  const exportUsersToExcel = () => {
    const headers = [
      lang === "ar" ? "المعرف" : "User ID",
      lang === "ar" ? "الاسم الكامل" : "Full Name",
      lang === "ar" ? "البريد الإلكتروني" : "Email",
      lang === "ar" ? "الهاتف" : "Phone",
      lang === "ar" ? "الشركة" : "Company",
      lang === "ar" ? "الصلاحية" : "Role",
      lang === "ar" ? "تاريخ التسجيل" : "Registration Date",
    ];

    const data = filteredCustomers.map((c) => [
      c.id,
      c.full_name || "",
      c.email || "",
      c.phone || "",
      c.company || "",
      rolesMap[c.id] === "admin"
        ? lang === "ar"
          ? "مسؤول"
          : "Admin"
        : lang === "ar"
        ? "عميل"
        : "Client",
      new Date(c.created_at).toLocaleString(lang === "ar" ? "ar-EG" : "en-US"),
    ]);

    exportToCsv(`ysmed_users_${new Date().toISOString().slice(0, 10)}.csv`, headers, data);
    toast.success(lang === "ar" ? "تم تصدير ملف Excel بنجاح" : "Excel file exported successfully");
  };

  // Export Inquiries to Excel / CSV
  const exportInquiriesToExcel = () => {
    const headers = [
      lang === "ar" ? "المعرف" : "Inquiry ID",
      lang === "ar" ? "النوع" : "Type",
      lang === "ar" ? "القطاع" : "Sector",
      lang === "ar" ? "الحالة" : "Status",
      lang === "ar" ? "الاسم" : "Name",
      lang === "ar" ? "الشركة" : "Company",
      lang === "ar" ? "البريد الإلكتروني" : "Email",
      lang === "ar" ? "الهاتف" : "Phone",
      lang === "ar" ? "الرسالة" : "Message",
      lang === "ar" ? "رابط الصورة" : "Photo URL",
      lang === "ar" ? "رابط الملف" : "File URL",
      lang === "ar" ? "اسم الملف" : "File Name",
      lang === "ar" ? "تاريخ الإرسال" : "Submission Date",
    ];

    const data = filteredRows.map((r) => [
      r.id,
      r.kind === "request"
        ? lang === "ar"
          ? "طلب مشروع"
          : "Project Request"
        : lang === "ar"
        ? "رسالة تواصل"
        : "Contact Message",
      sectorName(r.sector) || r.sector || "",
      t(`st_${r.status}` as "st_new") || r.status,
      r.name,
      r.company || "",
      r.email,
      r.phone || "",
      r.message,
      r.photo_url || "",
      r.file_url || "",
      r.file_name || "",
      new Date(r.created_at).toLocaleString(lang === "ar" ? "ar-EG" : "en-US"),
    ]);

    exportToCsv(`ysmed_inquiries_${new Date().toISOString().slice(0, 10)}.csv`, headers, data);
    toast.success(lang === "ar" ? "تم تصدير ملف Excel بنجاح" : "Excel file exported successfully");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="size-9 animate-spin rounded-full border-2 border-primary border-t-transparent shadow-glow" />
        <p className="text-xs text-muted-foreground animate-pulse">
          {lang === "ar" ? "جاري التحقق من الصلاحيات وتحميل لوحة الإدارة..." : "Checking permissions & loading admin dashboard..."}
        </p>
      </div>
    );
  }

  if (isAdmin === null || !isAdmin) {
    return (
      <>
        <PageHeader title={t("admin")} subtitle={t("notAdmin")} />
        <Section className="pt-0 max-w-lg mx-auto text-center">
          <div className="glass glow-border rounded-3xl p-8 border border-destructive/30">
            <Shield className="size-14 text-destructive mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-foreground">{t("notAdmin")}</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {lang === "ar"
                ? "يجب تعيين حسابك كمسؤول (admin) في جدول user_roles في Supabase للوصول إلى لوحة التحكم هذه."
                : "Your account must be granted the 'admin' role in the Supabase user_roles table to access this dashboard."}
            </p>
          </div>
        </Section>
      </>
    );
  }

  // Calculate resolution rate
  const completionRate = rows.length > 0 ? Math.round(((counts["done"] || 0) / rows.length) * 100) : 0;
  const projectRequestsCount = rows.filter((r) => r.kind === "request").length;
  const contactMessagesCount = rows.filter((r) => r.kind !== "request").length;

  return (
    <>
      {/* ─── Top Header with Live Realtime Status & Manual Refresh ─────────────── */}
      <div className="border-b border-border/40 bg-surface/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {t("liveSync")}
              </span>
              <span className="text-xs text-muted-foreground">
                • {t("lastUpdated")}: {lastRefreshed.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-GB")}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {t("admin")}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {lang === "ar"
                ? "التحكم الشامل بطلبات المشاريع الهندسية، رسائل العملاء، والبيانات اللحظية"
                : "Full control over engineering project requests, inquiries, and client relationships"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchData()}
              disabled={refreshing}
              className="rounded-xl flex items-center gap-2 bg-surface/80 border-border hover:border-primary"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
              {t("refresh")}
            </Button>
          </div>
        </div>
      </div>

      <Section className="pt-6 max-w-7xl">
        {/* ─── 5 Top Metric Cards ─────────────────────────────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {/* 1. All Inquiries */}
          <div
            onClick={() => {
              setTab("inquiries");
              setStatusFilter("all");
            }}
            className="glass rounded-2xl p-4 sm:p-5 border-l-4 border-l-primary cursor-pointer transition-all hover:scale-[1.02] hover:shadow-glow"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{t("allInquiries")}</p>
              <MessageSquare className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{rows.length}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {projectRequestsCount} {t("request")} • {contactMessagesCount} {t("contact")}
            </p>
          </div>

          {/* 2. New (Attention needed) */}
          <div
            onClick={() => {
              setTab("inquiries");
              setStatusFilter("new");
            }}
            className="glass rounded-2xl p-4 sm:p-5 border-l-4 border-l-blue-500 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{t("st_new")}</p>
              <span className="relative flex size-2">
                {(counts["new"] || 0) > 0 && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                )}
                <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-400">{counts["new"] || 0}</p>
            <p className="mt-1 text-[11px] text-blue-400/80">
              {lang === "ar" ? "بانتظار الرد والمراجعة" : "Awaiting initial review"}
            </p>
          </div>

          {/* 3. In Progress */}
          <div
            onClick={() => {
              setTab("inquiries");
              setStatusFilter("in_progress");
            }}
            className="glass rounded-2xl p-4 sm:p-5 border-l-4 border-l-gold cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{t("st_in_progress")}</p>
              <Clock className="size-4 text-gold" />
            </div>
            <p className="mt-2 text-2xl font-bold text-gold">{counts["in_progress"] || 0}</p>
            <p className="mt-1 text-[11px] text-gold/80">
              {lang === "ar" ? "قيد الدراسة والتواصل" : "In engineering evaluation"}
            </p>
          </div>

          {/* 4. Resolved / Done */}
          <div
            onClick={() => {
              setTab("inquiries");
              setStatusFilter("done");
            }}
            className="glass rounded-2xl p-4 sm:p-5 border-l-4 border-l-emerald-500 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{t("st_done")}</p>
              <CheckCircle className="size-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-400">{counts["done"] || 0}</p>
            <p className="mt-1 text-[11px] text-emerald-400/80">
              {completionRate}% {t("completionRate")}
            </p>
          </div>

          {/* 5. Registered Customers */}
          <div
            onClick={() => setTab("customers")}
            className="glass rounded-2xl p-4 sm:p-5 border-l-4 border-l-purple-500 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{t("totalUsers")}</p>
              <Users className="size-4 text-purple-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-purple-400">{customers.length}</p>
            <p className="mt-1 text-[11px] text-purple-400/80">
              {Object.values(rolesMap).filter((r) => r === "admin").length} {t("administrator")}
            </p>
          </div>
        </div>

        {/* ─── Navigation Tabs Bar ────────────────────────────────────────── */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
          {/* Main Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={tab === "overview" ? "hero" : "outline"}
              size="sm"
              onClick={() => setTab("overview")}
              className="rounded-xl flex items-center gap-1.5"
            >
              <BarChart3 className="size-4" />
              {t("overview")}
            </Button>

            <Button
              variant={tab === "inquiries" ? "hero" : "outline"}
              size="sm"
              onClick={() => {
                setTab("inquiries");
                setSearch("");
              }}
              className="rounded-xl flex items-center gap-1.5"
            >
              <MessageSquare className="size-4" />
              {t("inquiriesTab")} ({rows.length})
            </Button>

            <Button
              variant={tab === "customers" ? "hero" : "outline"}
              size="sm"
              onClick={() => {
                setTab("customers");
                setSearch("");
              }}
              className="rounded-xl flex items-center gap-1.5"
            >
              <Users className="size-4" />
              {t("customers")} ({customers.length})
            </Button>
          </div>

          {/* Right Action: CSV/Excel Exports */}
          <div className="flex items-center gap-2">
            {tab === "inquiries" && (
              <Button
                variant="gold"
                size="sm"
                onClick={exportInquiriesToExcel}
                className="rounded-xl flex items-center gap-2 shadow-glow w-full sm:w-auto"
              >
                <Download className="size-4" />
                {t("exportInquiries")}
              </Button>
            )}

            {tab === "customers" && (
              <Button
                variant="gold"
                size="sm"
                onClick={exportUsersToExcel}
                className="rounded-xl flex items-center gap-2 shadow-glow w-full sm:w-auto"
              >
                <Download className="size-4" />
                {t("exportUsers")}
              </Button>
            )}

            {tab === "overview" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportInquiriesToExcel}
                  className="rounded-xl flex items-center gap-1.5 text-xs bg-surface/60"
                >
                  <Download className="size-3.5" />
                  {t("exportInquiries")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportUsersToExcel}
                  className="rounded-xl flex items-center gap-1.5 text-xs bg-surface/60"
                >
                  <Download className="size-3.5" />
                  {t("exportUsers")}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW & ANALYTICS
        ═══════════════════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <div className="mt-6 space-y-6">
            {/* Top Row: Visual Breakdown & Ratio */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1: Request vs Contact Distribution */}
              <div className="glass rounded-3xl p-6 border border-border/80">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" />
                    {t("requestsVsContact")}
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">{rows.length} total</span>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-primary flex items-center gap-1">
                        <Sparkles className="size-3" />
                        {t("request")}
                      </span>
                      <span>
                        {projectRequestsCount} (
                        {rows.length > 0 ? Math.round((projectRequestsCount / rows.length) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{
                          width: `${rows.length > 0 ? (projectRequestsCount / rows.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">{t("contact")}</span>
                      <span>
                        {contactMessagesCount} (
                        {rows.length > 0 ? Math.round((contactMessagesCount / rows.length) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full bg-muted-foreground/60 transition-all duration-500 rounded-full"
                        style={{
                          width: `${rows.length > 0 ? (contactMessagesCount / rows.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-border/40 pt-4 text-xs text-muted-foreground leading-relaxed">
                  {lang === "ar"
                    ? "طلبات المشاريع تمثل عملاء جادين يبحثون عن حلول هندسية وتوريدات متخصصة."
                    : "Project requests represent high-value leads looking for customized engineering and deployment."}
                </div>
              </div>

              {/* Card 2: Status Pipeline Breakdown */}
              <div className="glass rounded-3xl p-6 border border-border/80">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                    <Activity className="size-4 text-gold" />
                    {lang === "ar" ? "مسار معالجة الطلبات" : "Inquiry Pipeline"}
                  </h3>
                  <span className="text-xs font-bold text-emerald-400">{completionRate}% Done</span>
                </div>

                <div className="mt-5 space-y-3">
                  {/* New */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-foreground font-medium">
                      <span className="size-2.5 rounded-full bg-blue-500" />
                      {t("st_new")}
                    </span>
                    <span className="font-bold text-blue-400">{counts["new"] || 0}</span>
                  </div>

                  {/* In progress */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-foreground font-medium">
                      <span className="size-2.5 rounded-full bg-gold" />
                      {t("st_in_progress")}
                    </span>
                    <span className="font-bold text-gold">{counts["in_progress"] || 0}</span>
                  </div>

                  {/* Done */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-foreground font-medium">
                      <span className="size-2.5 rounded-full bg-emerald-500" />
                      {t("st_done")}
                    </span>
                    <span className="font-bold text-emerald-400">{counts["done"] || 0}</span>
                  </div>

                  {/* Progress multi-segment bar */}
                  <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-surface gap-0.5">
                    <div
                      title="New"
                      className="bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${rows.length > 0 ? ((counts["new"] || 0) / rows.length) * 100 : 0}%`,
                      }}
                    />
                    <div
                      title="In Progress"
                      className="bg-gold transition-all duration-500"
                      style={{
                        width: `${rows.length > 0 ? ((counts["in_progress"] || 0) / rows.length) * 100 : 0}%`,
                      }}
                    />
                    <div
                      title="Done"
                      className="bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${rows.length > 0 ? ((counts["done"] || 0) / rows.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-border/40 pt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{lang === "ar" ? "سرعة الاستجابة" : "Avg response priority"}</span>
                  <span className="font-semibold text-primary">
                    {(counts["new"] || 0) > 0 ? `${counts["new"]} pending review` : "All reviewed ✓"}
                  </span>
                </div>
              </div>

              {/* Card 3: Quick Stats & Attachments */}
              <div className="glass rounded-3xl p-6 border border-border/80">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    {t("quickStats")}
                  </h3>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-2xl border border-border/60 bg-surface/50 p-3">
                    <p className="text-xl font-extrabold text-foreground">
                      {rows.filter((r) => r.photo_url).length}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {lang === "ar" ? "صور ومخططات" : "Attached Photos"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-surface/50 p-3">
                    <p className="text-xl font-extrabold text-gold">
                      {rows.filter((r) => r.file_url).length}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {lang === "ar" ? "ملفات ومواصفات" : "Attached Docs"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-surface/50 p-3">
                    <p className="text-xl font-extrabold text-purple-400">
                      {customers.filter((c) => c.phone).length}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {lang === "ar" ? "هواتف مسجلة" : "Direct Phones"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-surface/50 p-3">
                    <p className="text-xl font-extrabold text-blue-400">
                      {customers.filter((c) => c.company).length}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {lang === "ar" ? "شركات مسجلة" : "Companies"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-border/40 pt-3 text-center">
                  <button
                    onClick={() => setTab("inquiries")}
                    className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    {t("viewInquiries")}
                    <ChevronRight className="size-3 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Sector Demand Breakdown & Recent Activity Stream */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Sector Demand Breakdown */}
              <div className="glass rounded-3xl p-6 border border-border/80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                    <Layers className="size-4 text-gold" />
                    {t("topSectors")}
                  </h3>
                  <span className="text-xs text-muted-foreground">{sectorDemand.length} {lang === "ar" ? "قطاعات مطلوبة" : "active sectors"}</span>
                </div>

                {sectorDemand.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    {lang === "ar" ? "لا توجد طلبات مرتبطة بقطاعات محددة بعد." : "No sector-specific inquiries yet."}
                  </p>
                ) : (
                  <div className="space-y-3.5 max-h-[380px] overflow-y-auto pe-1">
                    {sectorDemand.map(({ slug, count, sector }) => {
                      const Icon = sector?.icon || Building;
                      const title = sector ? tl(sector.title) : slug;
                      const percentage = rows.length > 0 ? Math.round((count / rows.length) * 100) : 0;

                      return (
                        <div
                          key={slug}
                          onClick={() => {
                            setTab("inquiries");
                            setSectorFilter(slug);
                          }}
                          className="group rounded-2xl border border-border/50 bg-surface/40 p-3 transition-all hover:border-primary/50 hover:bg-surface/80 cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 font-semibold text-foreground">
                              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Icon className="size-3.5" />
                              </div>
                              <span className="truncate max-w-[200px]">{title}</span>
                            </div>
                            <span className="font-bold text-primary">
                              {count} {lang === "ar" ? "طلب" : "req"} ({percentage}%)
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-gold transition-all duration-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Activity Stream */}
              <div className="glass rounded-3xl p-6 border border-border/80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    {t("recentActivity")}
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">Live</span>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pe-1">
                  {rows.slice(0, 6).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSelectedInquiry(r)}
                      className="group flex items-start gap-3 rounded-2xl border border-border/40 bg-surface/40 p-3 transition-all hover:border-primary/40 hover:bg-surface/70 cursor-pointer"
                    >
                      <div
                        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          r.kind === "request"
                            ? "bg-primary/20 text-primary"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {r.kind === "request" ? "REQ" : "MSG"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-xs text-foreground truncate group-hover:text-primary">
                            {r.name}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {timeAgo(r.created_at)}
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {r.message}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-[10px]">
                          {sectorName(r.sector) && (
                            <span className="text-gold truncate max-w-[140px]">
                              {sectorName(r.sector)}
                            </span>
                          )}
                          <span
                            className={`rounded-full px-1.5 py-0.2 font-medium ${
                              r.status === "done"
                                ? "text-emerald-400"
                                : r.status === "in_progress"
                                ? "text-gold"
                                : "text-blue-400"
                            }`}
                          >
                            • {t(`st_${r.status}` as "st_new")}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="size-4 text-muted-foreground opacity-50 group-hover:opacity-100 rtl:rotate-180 self-center" />
                    </div>
                  ))}

                  {rows.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">
                      {lang === "ar" ? "لا توجد أنشطة حديثة بعد." : "No recent activity yet."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: INQUIRIES & REQUESTS MANAGEMENT
        ═══════════════════════════════════════════════════════════════════ */}
        {tab === "inquiries" && (
          <div className="mt-6 space-y-5">
            {/* Filter Bar with Search, Status, Type, Sector, Date */}
            <div className="glass rounded-3xl p-5 border border-border/80 space-y-4">
              {/* Row 1: Search & Sector & Date dropdowns */}
              <div className="grid gap-3 sm:grid-cols-12">
                {/* Search */}
                <div className="relative sm:col-span-5">
                  <Search className="absolute start-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full rounded-2xl border border-input bg-surface/80 ps-10 pe-9 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:shadow-glow transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute end-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {/* Sector filter dropdown */}
                <div className="sm:col-span-3">
                  <select
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-surface/80 px-3.5 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="all">{t("allSectors")}</option>
                    {solutions.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {tl(s.title)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date range filter */}
                <div className="sm:col-span-2">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as "all" | "today" | "7days" | "30days")}
                    className="w-full rounded-2xl border border-input bg-surface/80 px-3 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="all">{t("allTime")}</option>
                    <option value="today">{t("today")}</option>
                    <option value="7days">{t("last7Days")}</option>
                    <option value="30days">{t("last30Days")}</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="sm:col-span-2">
                  <button
                    onClick={() => setSortBy((prev) => (prev === "newest" ? "oldest" : "newest"))}
                    className="w-full rounded-2xl border border-input bg-surface/80 px-3 py-2.5 text-xs font-medium text-foreground outline-none hover:border-primary flex items-center justify-center gap-1.5"
                  >
                    <ArrowUpDown className="size-3.5" />
                    {sortBy === "newest" ? t("newestFirst") : t("oldestFirst")}
                  </button>
                </div>
              </div>

              {/* Row 2: Status & Type Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
                {/* Status Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground me-1 font-semibold">{t("status")}:</span>
                  {["all", ...statuses].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`rounded-full border px-3 py-1 font-medium transition-all ${
                        statusFilter === st
                          ? "border-primary bg-primary/15 text-primary shadow-glow font-bold"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      {st === "all" ? t("all") : t(`st_${st}` as "st_new")}{" "}
                      <span className="text-[10px] opacity-75">
                        ({st === "all" ? rows.length : counts[st] || 0})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Kind Filter (Requests vs Contact) */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground me-1 font-semibold">{t("inquiryType")}:</span>
                  {[
                    { id: "all", label: t("all") },
                    { id: "request", label: t("request") },
                    { id: "contact", label: t("contact") },
                  ].map((k) => (
                    <button
                      key={k.id}
                      onClick={() => setKindFilter(k.id)}
                      className={`rounded-full border px-3 py-1 font-medium transition-all ${
                        kindFilter === k.id
                          ? "border-gold bg-gold/15 text-gold shadow-gold font-bold"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count & Active Filters Indicator */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
              <p>
                {lang === "ar"
                  ? `عرض ${filteredRows.length} من إجمالي ${rows.length} رسالة وطلب`
                  : `Showing ${filteredRows.length} of ${rows.length} total inquiries`}
              </p>

              {(statusFilter !== "all" || kindFilter !== "all" || sectorFilter !== "all" || search) && (
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setKindFilter("all");
                    setSectorFilter("all");
                    setSearch("");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {lang === "ar" ? "إعادة تعيين الفلاتر" : "Reset filters"}
                </button>
              )}
            </div>

            {/* Inquiries Cards Grid */}
            <div className="grid gap-4">
              {filteredRows.length === 0 && (
                <div className="glass rounded-3xl p-12 text-center text-muted-foreground border border-border/60">
                  <MessageSquare className="size-12 mx-auto mb-3 opacity-30 text-primary" />
                  <p className="text-base font-semibold">{t("noInquiries")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === "ar"
                      ? "جرب تغيير معايير البحث أو الفلتر أعلاه لعرض النتائج."
                      : "Try adjusting your search query or filters above."}
                  </p>
                </div>
              )}

              {filteredRows.map((r) => {
                const sector = getSector(r.sector);
                const SectorIcon = sector?.icon || Building;
                const whatsappUrl = getWhatsAppUrl(r.phone, r.name);
                const mailtoUrl = getMailtoUrl(r);

                return (
                  <div
                    key={r.id}
                    className="glass rounded-3xl p-5 sm:p-6 border border-border/80 transition-all hover:border-primary/50 hover:shadow-glow space-y-4"
                  >
                    {/* Header: Badges & Status Selector */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Kind badge */}
                        <span
                          className={`rounded-full px-3 py-1 font-bold ${
                            r.kind === "request"
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {r.kind === "request" ? t("request") : t("contact")}
                        </span>

                        {/* Sector badge */}
                        {sector && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-gold font-medium border border-gold/30">
                            <SectorIcon className="size-3.5" />
                            {tl(sector.title)}
                          </span>
                        )}

                        {/* Date and time ago */}
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDate(r.created_at)} ({timeAgo(r.created_at)})
                        </span>
                      </div>

                      {/* Right: Status selector & Delete button */}
                      <div className="flex items-center gap-2">
                        <select
                          value={r.status}
                          onChange={(e) => setStatus(r.id, e.target.value)}
                          className={`rounded-xl border px-3 py-1 text-xs font-semibold outline-none transition-colors cursor-pointer ${
                            r.status === "done"
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                              : r.status === "in_progress"
                              ? "border-gold/40 bg-gold/10 text-gold"
                              : "border-blue-500/40 bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s} className="bg-surface text-foreground">
                              {t(`st_${s}` as "st_new")}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => removeInquiry(r.id)}
                          aria-label="Delete"
                          title={lang === "ar" ? "حذف الرسالة" : "Delete message"}
                          className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sender Identity & Contacts */}
                    <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 border-y border-border/40 py-2.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-base text-foreground">{r.name}</span>
                        {r.company && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-surface/80 px-2 py-0.5 text-xs text-muted-foreground border border-border/50">
                            <Building className="size-3 text-gold" />
                            {r.company}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <a
                          href={`mailto:${r.email}`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Mail className="size-3" />
                          {r.email}
                        </a>

                        {r.phone && (
                          <a
                            href={`tel:${r.phone}`}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <Phone className="size-3" />
                            {r.phone}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="rounded-2xl bg-surface/50 p-4 border border-border/40 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {r.message}
                    </div>

                    {/* Attachments Section */}
                    {(r.photo_url || r.file_url) && (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {/* Attached Photo */}
                        {r.photo_url && (
                          <div
                            onClick={() => setPreviewPhoto(r.photo_url || null)}
                            className="group inline-flex items-center gap-3 rounded-2xl border border-border bg-surface/70 p-2 text-xs transition-all hover:border-primary cursor-pointer hover:bg-surface"
                          >
                            <img
                              src={r.photo_url}
                              alt="Attached photo thumbnail"
                              className="size-12 rounded-xl object-cover border border-border"
                            />
                            <div className="pe-2">
                              <p className="font-semibold text-foreground group-hover:text-primary flex items-center gap-1">
                                <Eye className="size-3.5" />
                                {t("viewPhoto")}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {lang === "ar" ? "اضغط للمعاينة بالحجم الكامل" : "Click to view full preview"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Attached Document File */}
                        {r.file_url && (
                          <a
                            href={r.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="group inline-flex items-center gap-3 rounded-2xl border border-border bg-surface/70 p-2 text-xs text-foreground transition-all hover:border-primary hover:bg-surface"
                          >
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                              <FileText className="size-6" />
                            </div>
                            <div className="min-w-0 pe-3">
                              <p className="font-semibold text-foreground group-hover:text-primary truncate max-w-[200px]">
                                {r.file_name || t("viewFile")}
                              </p>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Download className="size-3 text-gold" />
                                {t("viewFile")}
                              </p>
                            </div>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Bottom Quick Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Quick Reply via Email */}
                        <a
                          href={mailtoUrl}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          <Send className="size-3.5 text-primary" />
                          {t("emailClient")}
                        </a>

                        {/* Quick WhatsApp */}
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          >
                            <Phone className="size-3.5" />
                            {t("whatsapp")}
                          </a>
                        )}

                        {/* Copy contact info */}
                        <button
                          onClick={() => copyContactInfo(r)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="size-3.5" />
                          {t("copyInfo")}
                        </button>
                      </div>

                      {/* View Full Details Modal Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInquiry(r)}
                        className="rounded-xl text-xs flex items-center gap-1.5"
                      >
                        <Eye className="size-3.5" />
                        {t("viewDetails")}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: CUSTOMERS & CRM
        ═══════════════════════════════════════════════════════════════════ */}
        {tab === "customers" && (
          <div className="mt-6 space-y-5">
            {/* Filter Bar */}
            <div className="glass rounded-3xl p-5 border border-border/80 space-y-4">
              <div className="grid gap-3 sm:grid-cols-12">
                {/* Search */}
                <div className="relative sm:col-span-8">
                  <Search className="absolute start-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full rounded-2xl border border-input bg-surface/80 ps-10 pe-9 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:shadow-glow transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute end-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {/* Role Filter */}
                <div className="sm:col-span-4">
                  <select
                    value={customerRoleFilter}
                    onChange={(e) => setCustomerRoleFilter(e.target.value as "all" | "admin" | "user")}
                    className="w-full rounded-2xl border border-input bg-surface/80 px-3.5 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="all">{t("all")} Roles</option>
                    <option value="admin">{t("administrator")}</option>
                    <option value="user">{t("client")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="glass overflow-x-auto rounded-3xl border border-border/80">
              <table className="w-full text-sm text-start">
                <thead className="border-b border-border bg-surface/80 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4 text-start">{t("name")}</th>
                    <th className="p-4 text-start">{t("phone")}</th>
                    <th className="p-4 text-start">{t("company")}</th>
                    <th className="p-4 text-start">{lang === "ar" ? "الطلبات" : "Inquiries"}</th>
                    <th className="p-4 text-start">{t("role")}</th>
                    <th className="p-4 text-start">{t("registered")}</th>
                    <th className="p-4 text-end">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-muted-foreground">
                        <Users className="size-8 mx-auto mb-2 opacity-30" />
                        <p>{t("noUsersFound")}</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => {
                      const isUserAdmin = rolesMap[c.id] === "admin";
                      const isSelf = c.id === currentUserId;
                      const userInitial = (c.full_name?.charAt(0) || c.email?.charAt(0) || "U").toUpperCase();

                      // Inquiries submitted by this user
                      const userInquiries = rows.filter(
                        (r) => r.user_id === c.id || (c.email && r.email.toLowerCase() === c.email.toLowerCase())
                      );

                      return (
                        <tr key={c.id} className="transition-colors hover:bg-surface/40">
                          {/* Name & Email */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                                  isUserAdmin
                                    ? "bg-gold/20 text-gold border border-gold/40 shadow-gold"
                                    : "bg-primary/20 text-primary border border-primary/30"
                                }`}
                              >
                                {userInitial}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground flex items-center gap-1.5">
                                  {c.full_name || "—"}
                                  {isSelf && (
                                    <span className="rounded-md bg-primary/20 px-1.5 py-0.2 text-[10px] text-primary">
                                      {lang === "ar" ? "أنت" : "You"}
                                    </span>
                                  )}
                                </p>
                                {c.email && (
                                  <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="p-4 text-muted-foreground">
                            {c.phone ? (
                              <a href={`tel:${c.phone}`} className="hover:text-primary font-mono text-xs">
                                {c.phone}
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>

                          {/* Company */}
                          <td className="p-4 text-muted-foreground">
                            {c.company ? (
                              <span className="font-medium text-foreground">{c.company}</span>
                            ) : (
                              "—"
                            )}
                          </td>

                          {/* Inquiries Count Button (Opens Customer Inquiries Modal) */}
                          <td className="p-4">
                            {userInquiries.length > 0 ? (
                              <button
                                onClick={() => setSelectedCustomer(c)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
                              >
                                <MessageSquare className="size-3" />
                                {userInquiries.length} {lang === "ar" ? "طلب" : "req"}
                              </button>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>

                          {/* Role with Toggle Action */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {isUserAdmin ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold border border-gold/30">
                                  <Shield className="size-3" />
                                  {t("administrator")}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                                  {t("client")}
                                </span>
                              )}

                              {/* Toggle Role Button */}
                              {!isSelf && (
                                <button
                                  onClick={() =>
                                    updateUserRole(c.id, isUserAdmin ? "user" : "admin")
                                  }
                                  title={isUserAdmin ? t("makeClient") : t("makeAdmin")}
                                  className="text-[11px] text-muted-foreground hover:text-primary underline px-1"
                                >
                                  {isUserAdmin ? t("makeClient") : t("makeAdmin")}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Created At */}
                          <td className="p-4 text-xs text-muted-foreground">
                            {formatDate(c.created_at)}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-end">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => setSelectedCustomer(c)}
                                title={t("viewDetails")}
                                className="inline-flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                              >
                                <Eye className="size-4" />
                              </button>

                              {!isSelf && (
                                <button
                                  onClick={() => deleteUser(c.id, c.full_name || c.email || c.id)}
                                  title={t("deleteUser")}
                                  className="inline-flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL 1: INQUIRY FULL DETAILS MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={!!selectedInquiry}
        onOpenChange={(open) => !open && setSelectedInquiry(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass glow-border rounded-3xl border-border/80 p-6">
          {selectedInquiry && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      selectedInquiry.kind === "request"
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {selectedInquiry.kind === "request" ? t("request") : t("contact")}
                  </span>

                  {selectedInquiry.sector && (
                    <span className="rounded-full bg-gold/15 px-3 py-0.5 text-xs text-gold font-medium border border-gold/30">
                      {sectorName(selectedInquiry.sector)}
                    </span>
                  )}
                </div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {selectedInquiry.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {t("submissionDate")}: {formatDate(selectedInquiry.created_at)} (
                  {timeAgo(selectedInquiry.created_at)})
                </DialogDescription>
              </DialogHeader>

              {/* Status & Change */}
              <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-4 border border-border/40">
                <span className="text-xs font-semibold text-foreground">{t("status")}:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => setStatus(selectedInquiry.id, e.target.value)}
                  className="rounded-xl border border-input bg-surface px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {t(`st_${s}` as "st_new")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Info Grid */}
              <div className="grid gap-3 sm:grid-cols-2 rounded-2xl bg-surface/40 p-4 border border-border/40 text-xs">
                <div>
                  <span className="text-muted-foreground block">{t("name")}</span>
                  <span className="font-semibold text-foreground text-sm">
                    {selectedInquiry.name}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block">{t("company")}</span>
                  <span className="font-semibold text-foreground text-sm">
                    {selectedInquiry.company || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block">{t("email")}</span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>

                <div>
                  <span className="text-muted-foreground block">{t("phone")}</span>
                  {selectedInquiry.phone ? (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="font-semibold text-foreground hover:underline font-mono"
                    >
                      {selectedInquiry.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  {t("message")}
                </label>
                <div className="rounded-2xl bg-surface/80 p-4 border border-border/60 text-sm text-foreground/95 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Attachments */}
              {(selectedInquiry.photo_url || selectedInquiry.file_url) && (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <label className="text-xs font-semibold text-muted-foreground block">
                    {lang === "ar" ? "المرفقات" : "Attachments"}
                  </label>

                  {selectedInquiry.photo_url && (
                    <div className="rounded-2xl border border-border bg-surface/60 p-3">
                      <p className="text-xs font-semibold text-foreground mb-2">{t("viewPhoto")}</p>
                      <img
                        src={selectedInquiry.photo_url}
                        alt="Attached document"
                        onClick={() => setPreviewPhoto(selectedInquiry.photo_url || null)}
                        className="max-h-48 w-auto rounded-xl object-contain border border-border cursor-pointer hover:opacity-90"
                      />
                    </div>
                  )}

                  {selectedInquiry.file_url && (
                    <a
                      href={selectedInquiry.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center gap-3 rounded-2xl border border-border bg-surface/60 p-3 hover:border-primary transition-colors text-xs"
                    >
                      <FileText className="size-6 text-gold" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">
                          {selectedInquiry.file_name || t("viewFile")}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{t("viewFile")}</p>
                      </div>
                      <Download className="size-4 text-muted-foreground" />
                    </a>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <DialogFooter className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/40">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={getMailtoUrl(selectedInquiry)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Mail className="size-3.5 text-primary" />
                    {t("emailClient")}
                  </a>

                  {getWhatsAppUrl(selectedInquiry.phone, selectedInquiry.name) && (
                    <a
                      href={getWhatsAppUrl(selectedInquiry.phone, selectedInquiry.name) || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <Phone className="size-3.5" />
                      {t("whatsapp")}
                    </a>
                  )}

                  <button
                    onClick={() => copyContactInfo(selectedInquiry)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="size-3.5" />
                    {t("copyInfo")}
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-xl text-xs"
                >
                  {t("close")}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL 2: CUSTOMER PROFILE & INQUIRIES HISTORY MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={!!selectedCustomer}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass glow-border rounded-3xl border-border/80 p-6">
          {selectedCustomer && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary font-bold text-lg">
                    {(selectedCustomer.full_name?.charAt(0) || selectedCustomer.email?.charAt(0) || "U").toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                      {selectedCustomer.full_name || t("userProfile")}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      {t("registered")}: {formatDate(selectedCustomer.created_at)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Contact Details Card */}
              <div className="grid gap-3 sm:grid-cols-2 rounded-2xl bg-surface/50 p-4 border border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground block">{t("email")}</span>
                  {selectedCustomer.email ? (
                    <a
                      href={`mailto:${selectedCustomer.email}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {selectedCustomer.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>

                <div>
                  <span className="text-muted-foreground block">{t("phone")}</span>
                  {selectedCustomer.phone ? (
                    <a
                      href={`tel:${selectedCustomer.phone}`}
                      className="font-semibold text-foreground hover:underline font-mono"
                    >
                      {selectedCustomer.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>

                <div>
                  <span className="text-muted-foreground block">{t("company")}</span>
                  <span className="font-semibold text-foreground">
                    {selectedCustomer.company || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block">{t("role")}</span>
                  <span className="font-semibold text-gold">
                    {rolesMap[selectedCustomer.id] === "admin"
                      ? t("administrator")
                      : t("client")}
                  </span>
                </div>
              </div>

              {/* History of inquiries submitted by this customer */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  {t("customerHistory")}
                </h4>

                {(() => {
                  const custInquiries = rows.filter(
                    (r) =>
                      r.user_id === selectedCustomer.id ||
                      (selectedCustomer.email &&
                        r.email.toLowerCase() === selectedCustomer.email.toLowerCase())
                  );

                  if (custInquiries.length === 0) {
                    return (
                      <p className="text-xs text-muted-foreground py-4 text-center rounded-2xl bg-surface/30">
                        {t("noInquiriesCustomer")}
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-3 max-h-72 overflow-y-auto pe-1">
                      {custInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="rounded-2xl border border-border/50 bg-surface/60 p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`rounded-full px-2 py-0.5 font-semibold text-[11px] ${
                                inq.kind === "request"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {inq.kind === "request" ? t("request") : t("contact")}
                            </span>

                            <span className="text-muted-foreground text-[11px]">
                              {formatDate(inq.created_at)}
                            </span>
                          </div>

                          <p className="text-xs text-foreground/90 whitespace-pre-wrap line-clamp-3">
                            {inq.message}
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[11px]">
                            <span className="text-muted-foreground">
                              {t("status")}:{" "}
                              <strong className="text-primary">
                                {t(`st_${inq.status}` as "st_new")}
                              </strong>
                            </span>

                            <button
                              onClick={() => {
                                setSelectedCustomer(null);
                                setSelectedInquiry(inq);
                              }}
                              className="text-primary hover:underline font-semibold"
                            >
                              {t("viewDetails")} →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <DialogFooter className="pt-3 border-t border-border/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                  className="rounded-xl text-xs"
                >
                  {t("close")}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL 3: PHOTO LIGHTBOX PREVIEW MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={!!previewPhoto}
        onOpenChange={(open) => !open && setPreviewPhoto(null)}
      >
        <DialogContent className="max-w-3xl glass glow-border rounded-3xl border-border/80 p-4">
          {previewPhoto && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={previewPhoto}
                alt="Attachment full preview"
                className="max-h-[75vh] w-auto rounded-2xl object-contain border border-border"
              />
              <div className="flex items-center gap-2">
                <a
                  href={previewPhoto}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-glow"
                >
                  <Download className="size-4" />
                  {lang === "ar" ? "تحميل الصورة الأصلية" : "Download Original Image"}
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewPhoto(null)}
                  className="rounded-xl text-xs"
                >
                  {t("close")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
