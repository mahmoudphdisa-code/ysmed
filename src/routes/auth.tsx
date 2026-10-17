import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — YSMED" },
      { name: "description", content: "Sign in or create your YSMED account." },
      { property: "og:title", content: "Sign In — YSMED" },
      { property: "og:description", content: "Access your YSMED account." },
    ],
  }),
  component: Page,
});

const field =
  "w-full rounded-xl border border-input bg-surface/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:shadow-glow sm:text-base";

const signupSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(150).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72),
});

function Page() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ to: "/account", replace: true });
      }
    });
  }, [navigate]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    try {
      if (mode === "signup") {
        const r = signupSchema.safeParse(data);
        if (!r.success) {
          toast.error(lang === "ar" ? "يرجى مراجعة الحقول" : "Please check the highlighted fields");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: r.data.email,
          password: r.data.password,
          options: {
            data: { full_name: r.data.name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          await supabase
            .from("profiles")
            .update({ phone: r.data.phone ?? "", company: r.data.company ?? "" })
            .eq("id", sessionData.session.user.id);
          navigate({ to: "/account" });
        } else {
          toast.success(t("checkEmail"));
        }
      } else {
        const r = loginSchema.safeParse(data);
        if (!r.success) {
          toast.error(lang === "ar" ? "يرجى مراجعة الحقول" : "Please check the highlighted fields");
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: r.data.email,
          password: r.data.password,
        });
        if (error) throw error;
        navigate({ to: "/account" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const social = async (provider: "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <>
      <PageHeader title={mode === "login" ? t("login") : t("signup")} subtitle={t("ctaText")} />
      <Section className="max-w-xl pt-0">
        <form onSubmit={submit} className="glass glow-border grid gap-4 rounded-3xl p-5 sm:p-8">
          {mode === "signup" && (
            <>
              <input name="name" required maxLength={100} placeholder={t("name")} className={field} />
              <input name="phone" maxLength={30} placeholder={t("phone")} className={field} />
              <input name="company" maxLength={150} placeholder={t("company")} className={field} />
            </>
          )}
          <input name="email" type="email" required maxLength={255} placeholder={t("email")} className={field} />
          <input
            name="password"
            type="password"
            required
            minLength={mode === "signup" ? 6 : 1}
            maxLength={72}
            placeholder={t("password")}
            className={field}
          />
          <Button type="submit" variant="hero" size="xl" disabled={busy}>
            {mode === "login" ? t("login") : t("signup")}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-sm text-primary hover:underline"
          >
            {mode === "login" ? t("noAccount") : t("haveAccount")}
          </button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t("orContinue")}
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button type="button" variant="outline" onClick={() => social("google")}>
            Google
          </Button>
        </form>
      </Section>
    </>
  );
}
