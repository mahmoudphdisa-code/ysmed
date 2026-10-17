import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  User,
  Shield,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
  MessageSquare,
  Building,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  PlusCircle,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — YSMED" },
      { name: "description", content: "Manage your YSMED account details, security, and messages." },
    ],
  }),
  component: Page,
});

const field =
  "w-full rounded-xl border border-input bg-surface/60 px-4 py-3 text-foreground outline-none focus:border-primary focus:shadow-glow text-sm sm:text-base";

type Inquiry = {
  id: string;
  kind: string;
  sector: string | null;
  message: string;
  created_at: string;
  status?: string;
  photo_url?: string | null;
  file_url?: string | null;
  file_name?: string | null;
};

function Page() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  // User state
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState({ full_name: "", phone: "", company: "" });
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "requests">("profile");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          navigate({ to: "/auth", replace: true });
          return;
        }

        if (!active) return;
        setUserId(userData.user.id);
        setEmail(userData.user.email ?? "");
        setCreatedAt(userData.user.created_at ?? "");

        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (active) setIsAdmin(!!role);

        const [{ data: p }, { data: inq }] = await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, phone, company")
            .eq("id", userData.user.id)
            .maybeSingle(),
          supabase
            .from("inquiries")
            .select("id, kind, sector, message, created_at, status, photo_url, file_url, file_name")
            .order("created_at", { ascending: false }),
        ]);

        if (active) {
          if (p) setProfile({ full_name: p.full_name || "", phone: p.phone || "", company: p.company || "" });
          if (inq) setInquiries(inq as Inquiry[]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Account load error:", err);
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [navigate]);

  // Save profile information
  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          company: profile.company,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      toast.success(t("profileSaved"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setBusy(false);
    }
  };

  // Change password
  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error(t("passwordLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    setPasswordBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success(t("passwordUpdated"));
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setPasswordBusy(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(lang === "ar" ? "تم تسجيل الخروج بنجاح" : "Signed out successfully");
      navigate({ to: "/auth", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign out failed");
    }
  };

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : email
    ? email.slice(0, 2).toUpperCase()
    : "YS";

  const memberDate = createdAt
    ? new Date(createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground">{lang === "ar" ? "جاري تحميل الحساب..." : "Loading account..."}</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={t("account")}
        subtitle={`${t("welcomeBack")}, ${profile.full_name || email}`}
      />

      <Section className="grid max-w-5xl gap-8 pt-0">
        {/* ─── Profile Overview Card ────────────────────────────────────── */}
        <div className="glass glow-border relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="circuit-grid absolute inset-0 opacity-40 pointer-events-none" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Initials Avatar */}
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/30 to-gold/30 border border-primary/40 font-bold text-xl text-foreground shadow-glow sm:size-20 sm:text-2xl">
                {initials}
              </div>

              {/* Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold sm:text-2xl text-foreground">
                    {profile.full_name || email.split("@")[0]}
                  </h2>
                  {isAdmin ? (
                    <span className="flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-gold border border-gold/30">
                      <Shield className="size-3" />
                      {t("administrator")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/25">
                      <User className="size-3" />
                      {t("client")}
                    </span>
                  )}
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" />
                    {email}
                  </span>
                  {memberDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-gold" />
                      {t("memberSince")} {memberDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
              {isAdmin && (
                <Button asChild variant="gold" size="sm" className="rounded-xl shadow-glow">
                  <Link to="/admin">
                    <Shield className="size-4" />
                    {t("admin")}
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive"
              >
                <LogOut className="size-4" />
                {t("logout")}
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="relative mt-8 flex border-b border-border/60 text-sm overflow-x-auto no-scrollbar gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 border-b-2 px-3 py-2.5 font-medium transition-all ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="size-4" />
              {t("profileTab")}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 border-b-2 px-3 py-2.5 font-medium transition-all ${
                activeTab === "security"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="size-4" />
              {t("securityTab")}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-2 border-b-2 px-3 py-2.5 font-medium transition-all ${
                activeTab === "requests"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="size-4" />
              {t("requestsTab")}
              {inquiries.length > 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary font-bold">
                  {inquiries.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ─── TAB 1: Profile Details ────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="glass glow-border rounded-3xl p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold sm:text-xl text-foreground">
                {t("profileTab")}
              </h3>
              <p className="text-xs text-muted-foreground sm:text-sm mt-1">
                {lang === "ar"
                  ? "قم بتحديث معلوماتك الشخصية وبيانات شركتك للتواصل السريع."
                  : "Update your contact information and company details for project communications."}
              </p>
            </div>

            <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  {t("name")}
                </label>
                <div className="relative">
                  <User className="absolute start-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    maxLength={100}
                    placeholder={t("name")}
                    className={`${field} ps-10`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  {t("phone")}
                </label>
                <div className="relative">
                  <Phone className="absolute start-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    maxLength={30}
                    placeholder={t("phone")}
                    className={`${field} ps-10`}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  {t("company")}
                </label>
                <div className="relative">
                  <Building className="absolute start-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    maxLength={150}
                    placeholder={t("company")}
                    className={`${field} ps-10`}
                  />
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <Button type="submit" variant="hero" disabled={busy} className="w-full sm:w-auto px-8">
                  {busy ? "..." : t("saveProfile")}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TAB 2: Security & Password ───────────────────────────────── */}
        {activeTab === "security" && (
          <div className="glass glow-border rounded-3xl p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold sm:text-xl text-foreground">
                {t("changePassword")}
              </h3>
              <p className="text-xs text-muted-foreground sm:text-sm mt-1">
                {lang === "ar"
                  ? "اختر كلمة مرور قوية تتكون من 6 أحرف على الأقل للحفاظ على أمان حسابك."
                  : "Choose a strong password with at least 6 characters to secure your account."}
              </p>
            </div>

            <form onSubmit={changePassword} className="grid max-w-xl gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  {t("newPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    maxLength={72}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${field} ps-10 pe-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  {t("confirmPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    maxLength={72}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${field} ps-10`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  disabled={passwordBusy || !newPassword}
                  className="w-full sm:w-auto px-8"
                >
                  {passwordBusy ? "..." : t("updatePassword")}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TAB 3: My Requests & Inquiries ───────────────────────────── */}
        {activeTab === "requests" && (
          <div className="glass glow-border rounded-3xl p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold sm:text-xl text-foreground">
                  {t("myInquiries")}
                </h3>
                <p className="text-xs text-muted-foreground sm:text-sm mt-0.5">
                  {lang === "ar"
                    ? "سجل كامل بجميع طلبات المشاريع والرسائل التي أرسلتها مع حالات المتابعة."
                    : "Complete record of your project requests and messages with live tracking status."}
                </p>
              </div>

              <Button asChild variant="hero" size="sm" className="rounded-xl">
                <Link to="/request">
                  <PlusCircle className="size-4" />
                  {t("request")}
                </Link>
              </Button>
            </div>

            {inquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 py-12 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MessageSquare className="size-7" />
                </div>
                <p className="mt-4 font-semibold text-foreground">
                  {t("noRequestsYet")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                  {t("ctaText")}
                </p>
                <Button asChild variant="gold" size="sm" className="mt-6 rounded-xl">
                  <Link to="/request">{t("request")}</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {inquiries.map((i) => (
                  <div
                    key={i.id}
                    className="relative rounded-2xl border border-border/80 bg-surface/50 p-4 transition-all hover:border-primary/40 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/15 px-3 py-1 font-medium text-primary">
                          {i.kind === "request" ? t("request") : t("contact")}
                        </span>
                        {i.sector && (
                          <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-gold font-medium">
                            {i.sector}
                          </span>
                        )}
                        {i.status && (
                          <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-muted-foreground">
                            {t(`st_${i.status}` as "st_new") || i.status}
                          </span>
                        )}
                      </div>

                      <span className="text-muted-foreground">
                        {new Date(i.created_at).toLocaleDateString(
                          lang === "ar" ? "ar-EG" : "en-GB",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
                      {i.message}
                    </p>

                    {i.photo_url && (
                      <div className="mt-3.5">
                        <a
                          href={i.photo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-3 rounded-xl border border-border bg-surface p-2 text-xs text-primary transition-all hover:border-primary hover:bg-surface/80"
                        >
                          <img
                            src={i.photo_url}
                            alt="Attached photo"
                            className="size-14 rounded-lg object-cover border border-border"
                          />
                          <div>
                            <span className="font-semibold text-foreground group-hover:text-primary">
                              {t("viewPhoto")} ↗
                            </span>
                            <p className="text-[11px] text-muted-foreground">
                              {lang === "ar" ? "اضغط للمعاينة الكاملة" : "Click to view image"}
                            </p>
                          </div>
                        </a>
                      </div>
                    )}

                    {i.file_url && (
                      <div className="mt-2.5">
                        <a
                          href={i.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="group inline-flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5 text-xs text-foreground transition-all hover:border-primary hover:bg-surface/80"
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                            <FileText className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-foreground group-hover:text-primary truncate block max-w-xs">
                              {i.file_name || t("viewFile")} ↗
                            </span>
                            <p className="text-[11px] text-muted-foreground">
                              {t("viewFile")}
                            </p>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Section>
    </>
  );
}
