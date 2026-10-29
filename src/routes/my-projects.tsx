import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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

interface SearchParams {
  ref?: string | undefined;
  token?: string | undefined;
}

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
      { title: "متابعة مشاريعي الهندسية — YSMED" },
      { name: "description", content: "بوابة العميل لمتابعة حالة المشاريع الهندسية وعروض الأسعار والرسائل." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

export function Page() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const search = useSearch({ from: "/my-projects" });

  // Lookup inputs
  const [lookupRef, setLookupRef] = useState(search.ref || "");
  const [lookupToken, setLookupToken] = useState(search.token || "");
  const [lookupLoading, setLookupLoading] = useState(false);

  // Loaded active project
  const [activeProject, setActiveProject] = useState<StoredProjectRequest | null>(null);
  const [userProjectsList, setUserProjectsList] = useState<StoredProjectRequest[]>([]);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  // Chat message input
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Copy states
  const [copiedRef, setCopiedRef] = useState(false);

  // Load user session and projects on mount
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (active && authData?.user) {
          setAuthUserId(authData.user.id);
          const projects = await fetchCustomerProjects(authData.user.id);
          if (active && projects.length > 0) {
            setUserProjectsList(projects);
            if (!search.ref && projects[0]) {
              setActiveProject(projects[0]);
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

  const currentStatusObj = requestStatuses.find(
    (s) => s.value === (activeProject?.status || "new")
  );

  return (
    <div className="relative min-h-screen px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
      <div className="circuit-grid fixed inset-0 pointer-events-none opacity-30 z-0" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/25 mb-2">
              <Sparkles className="size-3.5" />
              {isAr ? "بوابة متابعة المشاريع الهندسية" : "Client Engineering Portal"}
            </span>
            <h1 className="text-2xl font-bold sm:text-4xl text-foreground">
              {isAr ? "مشاريعي وطلباتي الهندسية" : "My Engineering Projects"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {isAr
                ? "تابع مراحل التنفيذ، راجع عروض الأسعار والمخططات، وتواصل مباشرة مع الفريق الهندسي المشرف."
                : "Track development milestones, review quotations, and chat directly with your engineering leads."}
            </p>
          </div>

          <Button asChild variant="hero" className="rounded-xl gap-2 self-start sm:self-auto shadow-glow">
            <Link to="/engineering-services">
              <span>{isAr ? "تقديم طلب مشروع جديد" : "New Project Request"}</span>
              <ChevronRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        {/* Project Lookup Bar (If not loaded or to switch) */}
        <div className="mt-8 rounded-2xl border border-border/70 bg-surface/40 p-4 sm:p-6">
          <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={lookupRef}
                onChange={(e) => setLookupRef(e.target.value)}
                placeholder={isAr ? "أدخل رقم المرجع (مثال: PRJ-2026-4891)" : "Enter Reference Number (e.g. PRJ-2026-4891)"}
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
              <span>{isAr ? "طلباتك السابقة:" : "Your Recent Requests:"}</span>
              {userProjectsList.map((p) => (
                <button
                  key={p.reference_number}
                  type="button"
                  onClick={() => setActiveProject(p)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all border ${
                    activeProject?.reference_number === p.reference_number
                      ? "border-primary bg-primary/20 text-primary font-bold"
                      : "border-border/60 bg-surface/50 text-foreground hover:bg-surface"
                  }`}
                >
                  {p.reference_number} • {p.project_title.slice(0, 18)}...
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ACTIVE PROJECT DETAILS */}
        {activeProject ? (
          <div className="mt-8 space-y-8 animate-rise">
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
                      activeProject.milestones.map((ml, idx) => (
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
          /* Empty / Initial State */
          <div className="mt-12 text-center py-16 glass rounded-3xl p-8 max-w-xl mx-auto">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow mb-4">
              <Search className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {isAr ? "تتبع حالة مشروعك الهندسي" : "Track Your Engineering Request"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "أدخل رقم المرجع الذي حصلت عليه عند تقديم الطلب (مثال: PRJ-2026-4891) ورمز المتابعة للاطلاع على التحديثات والمراسلات والمقايسات."
                : "Enter your reference number (e.g. PRJ-2026-4891) and access key above to view live progress and quotations."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
