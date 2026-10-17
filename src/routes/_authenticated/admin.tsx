import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { solutions } from "@/data/solutions";

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
  id: string; kind: string; sector: string | null; name: string; email: string;
  phone: string | null; message: string; status: string; created_at: string;
};
type Profile = { id: string; full_name: string; phone: string; company: string; created_at: string };
const statuses = ["new", "in_progress", "done"] as const;

function Page() {
  const { t, tl, lang } = useI18n();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [tab, setTab] = useState<"inquiries" | "customers">("inquiries");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      if (!role) { setIsAdmin(false); return; }
      setIsAdmin(true);
      const [{ data: inq }, { data: prof }] = await Promise.all([
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name, phone, company, created_at").order("created_at", { ascending: false }),
      ]);
      setRows((inq as Inquiry[]) ?? []);
      setCustomers(prof ?? []);
    })();
  }, []);

  const counts = useMemo(() => Object.fromEntries(statuses.map((s) => [s, rows.filter((r) => r.status === s).length])), [rows]);
  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter || r.kind === filter);
  const date = (d: string) => new Date(d).toLocaleString(lang === "ar" ? "ar-EG" : "en-GB");

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  };
  const remove = async (id: string) => {
    if (!confirm(lang === "ar" ? "حذف هذه الرسالة؟" : "Delete this message?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
  };

  if (isAdmin === null) return <PageHeader title={t("admin")} />;
  if (!isAdmin) return <PageHeader title={t("admin")} subtitle={t("notAdmin")} />;

  const sectorName = (slug: string | null) => { const s = solutions.find((x) => x.slug === slug); return s ? tl(s.title) : null; };

  return (
    <>
      <PageHeader title={t("admin")} />
      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-4">
          {[["all", rows.length], ...statuses.map((s) => [s, counts[s]])].map(([k, n]) => (
            <div key={k} className="glass rounded-2xl p-5">
              <p className="text-sm text-muted-foreground">{k === "all" ? t("allInquiries") : t(`st_${k}` as "st_new")}</p>
              <p className="mt-2 text-3xl font-bold text-primary">{n}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button variant={tab === "inquiries" ? "hero" : "outline"} size="sm" onClick={() => setTab("inquiries")}>{t("allInquiries")}</Button>
          <Button variant={tab === "customers" ? "hero" : "outline"} size="sm" onClick={() => setTab("customers")}>{t("customers")} ({customers.length})</Button>
        </div>

        {tab === "inquiries" ? (
          <>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {["all", ...statuses, "contact", "request"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-3 py-1 ${filter === f ? "border-primary text-primary" : "text-muted-foreground"}`}>
                  {f === "all" ? t("all") : f === "contact" ? t("contact") : f === "request" ? t("request") : t(`st_${f}` as "st_new")}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-4">
              {shown.length === 0 && <p className="text-muted-foreground">{t("noInquiries")}</p>}
              {shown.map((r) => (
                <div key={r.id} className="glass rounded-2xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">{r.kind === "request" ? t("request") : t("contact")}</span>
                      {sectorName(r.sector) && <span className="rounded-full bg-gold/15 px-3 py-1 text-gold">{sectorName(r.sector)}</span>}
                      <span className="text-muted-foreground">{date(r.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="rounded-lg border border-input bg-surface px-2 py-1 text-sm">
                        {statuses.map((s) => <option key={s} value={s}>{t(`st_${s}` as "st_new")}</option>)}
                      </select>
                      <button onClick={() => remove(r.id)} aria-label="Delete" className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                  <p className="mt-3 font-semibold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <a href={`mailto:${r.email}`} className="hover:text-primary">{r.email}</a>{r.phone && <> · <a href={`tel:${r.phone}`} className="hover:text-primary">{r.phone}</a></>}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm">{r.message}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="glass mt-6 overflow-x-auto rounded-2xl">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground"><tr className="border-b">
                <th className="p-4 text-start">{t("name")}</th><th className="p-4 text-start">{t("phone")}</th><th className="p-4 text-start">{t("company")}</th><th className="p-4 text-start">—</th>
              </tr></thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="p-4">{c.full_name || "—"}</td><td className="p-4">{c.phone || "—"}</td><td className="p-4">{c.company || "—"}</td><td className="p-4 text-muted-foreground">{date(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </>
  );
}
