import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — YSMED" },
      { name: "description", content: "Manage your YSMED account details and messages." },
    ],
  }),
  component: Page,
});

const field =
  "w-full rounded-xl border border-input bg-surface/60 px-4 py-3 text-foreground outline-none focus:border-primary focus:shadow-glow";

type Inquiry = {
  id: string;
  kind: string;
  sector: string | null;
  message: string;
  created_at: string;
};

function Page() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState({ full_name: "", phone: "", company: "" });
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setEmail(data.user.email ?? "");
      const [{ data: p }, { data: inq }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone, company").eq("id", data.user.id).maybeSingle(),
        supabase.from("inquiries").select("id, kind, sector, message, created_at").order("created_at", { ascending: false }),
      ]);
      if (p) setProfile({ full_name: p.full_name, phone: p.phone, company: p.company });
      if (inq) setInquiries(inq);
    })();
  }, []);

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { error } = await supabase.from("profiles").update(profile).eq("id", data.user.id);
      if (error) toast.error(error.message);
      else toast.success(t("profileSaved"));
    }
    setBusy(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <>
      <PageHeader title={t("account")} subtitle={`${t("welcomeBack")} — ${email}`} />
      <Section className="grid max-w-4xl gap-10 pt-0">
        <form onSubmit={save} className="glass glow-border grid gap-4 rounded-3xl p-6 sm:grid-cols-2 sm:p-8">
          <input
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            maxLength={100}
            placeholder={t("name")}
            className={field}
          />
          <input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            maxLength={30}
            placeholder={t("phone")}
            className={field}
          />
          <input
            value={profile.company}
            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            maxLength={150}
            placeholder={t("company")}
            className={field}
          />
          <div className="flex gap-3">
            <Button type="submit" variant="hero" disabled={busy}>
              {t("saveProfile")}
            </Button>
            <Button type="button" variant="outline" onClick={logout}>
              {t("logout")}
            </Button>
          </div>
        </form>

        <div>
          <h2 className="text-2xl font-semibold">{t("myInquiries")}</h2>
          <div className="mt-4 grid gap-4">
            {inquiries.length === 0 && <p className="text-muted-foreground">{t("noInquiries")}</p>}
            {inquiries.map((i) => (
              <div key={i.id} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">
                    {i.kind === "request" ? t("request") : t("contact")}
                  </span>
                  <span>{new Date(i.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB")}</span>
                </div>
                <p className="mt-3 text-sm text-foreground">{i.message}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
