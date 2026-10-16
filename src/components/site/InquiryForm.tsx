import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { solutions } from "@/data/solutions";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1).max(2000),
});

const field = "w-full rounded-xl border border-input bg-surface/60 px-4 py-3 text-foreground outline-none focus:border-primary focus:shadow-glow";

export function InquiryForm({ withSector }: { withSector?: boolean }) {
  const { t, tl, lang } = useI18n();
  const [busy, setBusy] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = schema.safeParse(data);
    if (!r.success) { toast.error(lang === "ar" ? "يرجى مراجعة الحقول" : "Please check the highlighted fields"); return; }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.info(lang === "ar" ? "الإرسال عبر الإنترنت سيُفعَّل قريباً." : "Online submission is being activated soon.");
    }, 400);
  };
  return (
    <form onSubmit={submit} className="glass glow-border grid gap-4 rounded-3xl p-6 sm:grid-cols-2 sm:p-8">
      <input name="name" required maxLength={100} placeholder={t("name")} className={field} />
      <input name="email" type="email" required maxLength={255} placeholder={t("email")} className={field} />
      <input name="phone" maxLength={30} placeholder={t("phone")} className={field} />
      {withSector && (
        <select name="sector" className={field}>
          {solutions.map((s) => <option key={s.slug} value={s.slug}>{tl(s.title)}</option>)}
        </select>
      )}
      <textarea name="message" required maxLength={2000} rows={5} placeholder={t("message")} className={`${field} sm:col-span-2`} />
      <Button type="submit" variant="hero" size="xl" disabled={busy} className="sm:col-span-2">{t("send")}</Button>
    </form>
  );
}
