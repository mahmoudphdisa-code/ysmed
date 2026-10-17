import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  QrCode,
  MapPin,
  Send,
  Building,
} from "lucide-react";
import { PageHeader, Section } from "@/components/site/Layout";
import { InquiryForm } from "@/components/site/InquiryForm";
import { useI18n } from "@/lib/i18n";
import contactQr from "@/assets/contact-qr.png";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — YSMED" },
      { name: "description", content: "Get in touch with YSMED for Innovative Solutions via phone, WhatsApp, email, or direct message." },
      { property: "og:title", content: "Contact YSMED for Innovative Solutions" },
      { property: "og:description", content: "Talk to our engineering and technical support team." },
    ],
  }),
  component: Page,
});

// Official Contact Coordinates
const CONTACT_PHONE = "01147797766";
const CONTACT_PHONE_INTL = "+201147797766";
const CONTACT_WHATSAPP = "01276477831";
const CONTACT_WHATSAPP_CLEAN = "201276477831";
const CONTACT_EMAIL = "info@ysmed.com";
const FACEBOOK_URL = "https://facebook.com/ysmed.solutions";
const INSTAGRAM_URL = "https://instagram.com/ysmed.solutions";

// Custom Social SVG Icons
function FacebookIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function Page() {
  const { t, lang } = useI18n();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(
      lang === "ar"
        ? `تم نسخ ${label} إلى الحافظة!`
        : `${label} copied to clipboard!`
    );
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    lang === "ar"
      ? "مرحباً، أود التواصل مع فريق YSMED للحلول الهندسية للاستفسار عن خدماتكم."
      : "Hello, I would like to inquire about YSMED engineering solutions."
  );

  return (
    <>
      <PageHeader
        title={t("contact")}
        subtitle={t("contactSubtitle")}
      />

      <Section className="pt-0 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* ═══════════════════════════════════════════════════════════════════
              LEFT COLUMN: DIRECT CHANNELS & SOCIAL HUB (5 COLS)
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex size-2 rounded-full bg-primary animate-ping" />
              <h2 className="text-base font-bold text-foreground">
                {t("directChannels")}
              </h2>
            </div>

            {/* 1. Phone Card */}
            <div className="glass group rounded-3xl p-5 border border-border/80 transition-all hover:border-primary/50 hover:shadow-glow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/20 shadow-glow">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("callUs")}
                    </p>
                    <a
                      href={`tel:${CONTACT_PHONE_INTL}`}
                      className="font-bold text-lg text-foreground hover:text-primary transition-colors font-mono tracking-wide mt-0.5 block"
                      dir="ltr"
                    >
                      {CONTACT_PHONE}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      CONTACT_PHONE,
                      "phone",
                      lang === "ar" ? "رقم الهاتف" : "Phone number"
                    )
                  }
                  title={t("copyPhone")}
                  className="flex size-9 items-center justify-center rounded-xl bg-surface/80 border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedKey === "phone" ? (
                    <Check className="size-4 text-emerald-400" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>

              <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3 text-gold" />
                  {lang === "ar" ? "متاح خلال ساعات العمل الرسمية" : "Available during working hours"}
                </span>
                <a
                  href={`tel:${CONTACT_PHONE_INTL}`}
                  className="text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  {lang === "ar" ? "اتصل الآن" : "Call Now"} →
                </a>
              </div>
            </div>

            {/* 2. WhatsApp Card */}
            <div className="glass group rounded-3xl p-5 border border-emerald-500/30 bg-emerald-500/5 transition-all hover:border-emerald-500/60 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md">
                    <WhatsAppIcon className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t("chatWhatsApp")}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-bold text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/${CONTACT_WHATSAPP_CLEAN}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-lg text-foreground hover:text-emerald-400 transition-colors font-mono tracking-wide mt-0.5 block"
                      dir="ltr"
                    >
                      {CONTACT_WHATSAPP}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      CONTACT_WHATSAPP,
                      "whatsapp",
                      lang === "ar" ? "رقم الواتساب" : "WhatsApp number"
                    )
                  }
                  title={lang === "ar" ? "نسخ رقم الواتساب" : "Copy WhatsApp number"}
                  className="flex size-9 items-center justify-center rounded-xl bg-surface/80 border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedKey === "whatsapp" ? (
                    <Check className="size-4 text-emerald-400" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>

              <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "استجابة فورية من المهندسين" : "Instant chat & engineering support"}
                </span>
                <a
                  href={`https://wa.me/${CONTACT_WHATSAPP_CLEAN}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  {t("chatWhatsApp")} ↗
                </a>
              </div>
            </div>

            {/* 3. Email Card */}
            <div className="glass group rounded-3xl p-5 border border-border/80 transition-all hover:border-gold/50 hover:shadow-gold">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("emailUs")}
                    </p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Inquiry%20to%20YSMED`}
                      className="font-bold text-base text-foreground hover:text-gold transition-colors font-mono mt-0.5 block truncate max-w-[220px] sm:max-w-none"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      CONTACT_EMAIL,
                      "email",
                      lang === "ar" ? "البريد الإلكتروني" : "Email"
                    )
                  }
                  title={t("copyEmail")}
                  className="flex size-9 items-center justify-center rounded-xl bg-surface/80 border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedKey === "email" ? (
                    <Check className="size-4 text-emerald-400" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>

              <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "للعروض الفنية والتعاقدات" : "Proposals & technical inquiries"}
                </span>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Inquiry%20to%20YSMED`}
                  className="text-gold font-semibold hover:underline inline-flex items-center gap-1"
                >
                  {lang === "ar" ? "إرسال بريد" : "Send Email"} ↗
                </a>
              </div>
            </div>

            {/* 4. Social Media Channels Card */}
            <div className="glass rounded-3xl p-5 border border-border/80 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("followSocial")}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* Facebook */}
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3 text-xs font-semibold text-foreground transition-all hover:bg-blue-500/20 hover:border-blue-500/60"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-md">
                    <FacebookIcon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-foreground group-hover:text-primary truncate">
                      {t("facebook")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      @ysmed.solutions ↗
                    </span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-pink-500/30 bg-pink-500/10 p-3 text-xs font-semibold text-foreground transition-all hover:bg-pink-500/20 hover:border-pink-500/60"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md">
                    <InstagramIcon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-foreground group-hover:text-primary truncate">
                      {t("instagram")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      @ysmed.solutions ↗
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* 5. Digital Contact QR Card & Working Hours */}
            <div className="glass rounded-3xl p-5 border border-border/80">
              <div className="flex items-center gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-primary/30 bg-white p-1 shadow-glow">
                  <img
                    src={contactQr}
                    alt="Contact QR Code"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <QrCode className="size-4 text-primary" />
                    {t("quickScan")}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {t("quickScanDesc")}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-gold shrink-0" />
                  <span>{t("workingHours")}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <ShieldCheck className="size-3.5 shrink-0" />
                  <span>{t("responseGuarantee")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              RIGHT COLUMN: INTERACTIVE ONLINE INQUIRY FORM (7 COLS)
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7">
            <div className="glass glow-border rounded-3xl p-6 sm:p-8 border border-border/80 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Send className="size-5 text-primary" />
                    {t("sendMessageOnline")}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lang === "ar"
                      ? "أرسل تفاصيل مشروعك أو استفسارك وسيقوم مهندسونا بدراسته والتواصل معك."
                      : "Submit your inquiry or project specifications for review by our engineering team."}
                  </p>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                  <Sparkles className="size-3" />
                  {lang === "ar" ? "خدمة سريعة" : "Priority Service"}
                </span>
              </div>

              <InquiryForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
