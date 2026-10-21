import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Wrench,
  Send,
  Upload,
  X,
  FileText,
  Phone,
  MessageSquare,
  CheckCircle2,
  Building,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const quoteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  propertyType: z.string().min(1),
  city: z.string().trim().min(1, "City is required"),
  propertySize: z.string().optional(),
  roomsCount: z.string().optional(),
  serviceScope: z.string(),
  budget: z.string().optional(),
  preferredDate: z.string().optional(),
  notes: z.string().optional(),
});

interface InstallationQuoteFormProps {
  prefilledData?: any;
}

export function InstallationQuoteForm({ prefilledData }: InstallationQuoteFormProps) {
  const { lang } = useI18n();
  const [busy, setBusy] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [city, setCity] = useState("New Cairo / التجمع");
  const [propertySize, setPropertySize] = useState("160");
  const [roomsCount, setRoomsCount] = useState("4");
  const [serviceScope, setServiceScope] = useState<"supply_install" | "supply_only">("supply_install");
  const [budget, setBudget] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  // Checkboxes for features
  const [features, setFeatures] = useState<string[]>([
    "Lighting & Switches",
    "Smart AC Control",
    "Motorized Curtains",
    "Smart Door Lock",
  ]);

  // Floor plan file state
  const [planFile, setPlanFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFeature = (f: string) => {
    setFeatures((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        lang === "ar"
          ? "حجم الملف كبير جداً (الحد الأقصى 10 ميجابايت)"
          : "File exceeds 10MB limit"
      );
      return;
    }
    setPlanFile(file);
  };

  const removeFile = () => {
    setPlanFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      phone,
      email: email || undefined,
      propertyType,
      city,
      propertySize,
      roomsCount,
      serviceScope,
      budget,
      preferredDate,
      notes,
    };

    const result = quoteSchema.safeParse(data);
    if (!result.success) {
      toast.error(
        lang === "ar"
          ? "يرجى التأكد من كتابة الاسم ورقم الهاتف والمدينة"
          : "Please check the highlighted required fields"
      );
      return;
    }

    setBusy(true);

    let planUrl: string | null = null;
    let planFileName: string | null = null;

    // Upload floor plan if provided
    if (planFile) {
      try {
        const ext = planFile.name.split(".").pop() || "pdf";
        const cleanName = `plan_${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filePath = `inquiries/plans/${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("inquiry-attachments")
          .upload(filePath, planFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("inquiry-attachments")
            .getPublicUrl(filePath);
          planUrl = urlData.publicUrl;
          planFileName = planFile.name;
        } else {
          console.warn("Storage upload failed, proceeding with text quote:", uploadError);
        }
      } catch (err) {
        console.error("Plan upload error:", err);
      }
    }

    // Build message body
    const formattedMessage = [
      `=== SMART HOME INSTALLATION & QUOTATION REQUEST ===`,
      `Client Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Property Type: ${propertyType}`,
      `City / Area: ${city}`,
      propertySize ? `Property Size: ${propertySize} m²` : null,
      roomsCount ? `Number of Rooms: ${roomsCount}` : null,
      `Scope: ${serviceScope === "supply_install" ? "Hardware Supply + Professional Installation" : "Hardware Supply Only"}`,
      features.length > 0 ? `Interested Features: ${features.join(", ")}` : null,
      budget ? `Approximate Budget: ${budget}` : null,
      preferredDate ? `Preferred Site Inspection Date: ${preferredDate}` : null,
      notes ? `Client Notes: ${notes}` : null,
      planUrl ? `Floor Plan Attached: ${planUrl} (${planFileName})` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const { data: userRes } = await supabase.auth.getUser();
      const currentUserId = userRes?.user?.id || null;

      const { error } = await supabase.from("inquiries").insert({
        user_id: currentUserId,
        kind: "smart_home_installation",
        sector: "smart-buildings",
        name,
        email: email || `${phone.replace(/\D/g, "")}@quote.ysmed.com`,
        phone,
        company: `${propertyType} - ${city}`,
        message: formattedMessage,
        status: "new",
        file_url: planUrl,
        file_name: planFileName,
      });

      if (error) throw error;

      const quoteRef = `YSM-SH-${Date.now().toString().slice(-6)}`;
      setSubmittedRef(quoteRef);
      toast.success(
        lang === "ar"
          ? `تم استلام طلب المقايسة بنجاح! كود المتابعة: ${quoteRef}`
          : `Quote request submitted! Reference: ${quoteRef}`
      );
    } catch (err) {
      console.error(err);
      toast.error(
        lang === "ar"
          ? "تعذر إرسال الطلب، يرجى المحاولة أو التواصل مباشرة عبر الواتساب"
          : "Failed to submit quote. Please contact us directly on WhatsApp."
      );
    } finally {
      setBusy(false);
    }
  };

  const getWhatsAppDirectLink = () => {
    const text = encodeURIComponent(
      `Hello YSMED Engineering! I would like to request an installation consultation for my ${propertyType} in ${city} (approx ${propertySize}m², ${roomsCount} rooms). Name: ${name || "Client"}, Phone: ${phone || ""}.`
    );
    return `https://wa.me/201276477831?text=${text}`;
  };

  return (
    <section id="quote" className="py-16 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-6 sm:p-10 border border-border/80 shadow-2xl backdrop-blur-2xl text-start">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold text-primary shadow-glow">
              <Wrench className="size-3.5" />
              <span>{lang === "ar" ? "نظام المقايسات والمعاينة الهندسية" : "Engineering Consultation & Quote"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {lang === "ar" ? "اطلب مقايسة واستشارة هندسية مجانية" : "Request a Free Engineering Consultation & Quote"}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {lang === "ar"
                ? "أدخل تفاصيل عقارك وسيقوم مهندسونا بمراجعة المتطلبات وإعداد دراسة فنية وعرض سعر تفصيلي خلال 24 ساعة."
                : "Fill in your property details and our engineering team will evaluate your requirements and prepare a detailed turnkey proposal within 24 hours."}
            </p>
          </div>

          {submittedRef ? (
            /* Success confirmation */
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4 max-w-lg mx-auto my-6">
              <CheckCircle2 className="size-14 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-foreground">
                {lang === "ar" ? "تم تسجيل طلبك بنجاح!" : "Quotation Request Received!"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lang === "ar"
                  ? `شكراً لتواصلك مع YSMED. كود طلبك هو [${submittedRef}]. سيتصل بك أحد مهندسينا المختصين لتحديد موعد المعاينة ومناقشة تفاصيل النظام.`
                  : `Your request reference code is [${submittedRef}]. A specialized smart automation engineer will contact you shortly to arrange a survey.`}
              </p>
              <div className="pt-2 flex justify-center">
                <Button
                  onClick={() => setSubmittedRef(null)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-bold"
                >
                  {lang === "ar" ? "إرسال طلب إضافي" : "Submit Another Request"}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name, Phone, Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "الاسم الكامل *" : "Full Name *"}
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: م. أحمد مجدي" : "e.g. John Doe"}
                    className="w-full rounded-xl border border-input bg-surface/80 p-3 text-xs text-foreground outline-none focus:border-primary focus:shadow-glow"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "رقم الهاتف / الواتساب *" : "Phone Number (WhatsApp) *"}
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full rounded-xl border border-input bg-surface/80 p-3 text-xs text-foreground outline-none focus:border-primary focus:shadow-glow font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-input bg-surface/80 p-3 text-xs text-foreground outline-none focus:border-primary"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 2: Property Type, City, Size, Rooms */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "نوع العقار *" : "Property Type *"}
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full rounded-xl border border-input bg-surface/80 p-3 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Apartment">{lang === "ar" ? "شقة سكنية" : "Apartment"}</option>
                    <option value="Villa">{lang === "ar" ? "فيلا مستقلة" : "Stand-alone Villa"}</option>
                    <option value="Duplex / Penthouse">{lang === "ar" ? "دوبلكس / بنتهاوس" : "Duplex / Penthouse"}</option>
                    <option value="Townhouse">{lang === "ar" ? "تاون / توين هاوس" : "Town / Twin House"}</option>
                    <option value="Office">{lang === "ar" ? "مقر شركة / مكتب" : "Corporate Office"}</option>
                    <option value="Hotel / Resort">{lang === "ar" ? "فندق / شاليه سياحي" : "Hotel / Resort"}</option>
                    <option value="Factory / Industrial">{lang === "ar" ? "منشأة صناعية" : "Industrial Facility"}</option>
                    <option value="Commercial">{lang === "ar" ? "معرض / محل تجاري" : "Retail / Commercial"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "المدينة / المنطقة *" : "City / Region *"}
                  </label>
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={lang === "ar" ? "التجمع، الشيخ زايد، الإسكندرية..." : "New Cairo, Zayed, Alex..."}
                    className="w-full rounded-xl border border-input bg-surface/80 p-3 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "المساحة التقديرية (م²)" : "Property Size (m²)"}
                  </label>
                  <input
                    type="number"
                    value={propertySize}
                    onChange={(e) => setPropertySize(e.target.value)}
                    placeholder="180"
                    className="w-full rounded-xl border border-input bg-surface/80 p-3 text-xs text-foreground outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "إجمالي عدد الغرف" : "Number of Rooms"}
                  </label>
                  <input
                    type="number"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(e.target.value)}
                    placeholder="4"
                    className="w-full rounded-xl border border-input bg-surface/80 p-3 text-xs text-foreground outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Scope of Service (Supply vs Installation) */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">
                  {lang === "ar" ? "نطاق الخدمة المطلوب:" : "Scope of Requirement:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setServiceScope("supply_install")}
                    className={`flex items-center gap-3 rounded-2xl p-3.5 border cursor-pointer transition-all ${
                      serviceScope === "supply_install"
                        ? "bg-primary/20 border-primary text-foreground ring-1 ring-primary shadow-glow"
                        : "bg-surface/60 border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Wrench className="size-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {lang === "ar" ? "توريد الأجهزة + التركيب والبرمجة (موصى به)" : "Hardware Supply + Turnkey Installation"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {lang === "ar" ? "معاينة هندسية، تركيب بدون تكسير، وضمان شامل" : "Engineering survey, clean install, and warranty"}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setServiceScope("supply_only")}
                    className={`flex items-center gap-3 rounded-2xl p-3.5 border cursor-pointer transition-all ${
                      serviceScope === "supply_only"
                        ? "bg-primary/20 border-primary text-foreground ring-1 ring-primary shadow-glow"
                        : "bg-surface/60 border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Building className="size-5 text-gold shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {lang === "ar" ? "توريد الأجهزة الذكية فقط" : "Hardware Supply Only"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {lang === "ar" ? "توصيل المنتجات مع مخططات التوصيل والدعم الفني" : "Direct delivery with wiring schematics & support"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Interested Smart Features Checkboxes */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">
                  {lang === "ar" ? "الأنظمة والتقنيات التي تهتم بها:" : "Interested Smart Technologies:"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "Lighting & Switches",
                    "Smart AC Control",
                    "Motorized Curtains",
                    "Smart Door Lock",
                    "Sensors & Alarm Siren",
                    "Wall Touch Panels",
                    "In-Ceiling Audio",
                    "Garden & Irrigation",
                  ].map((feat) => {
                    const checked = features.includes(feat);
                    return (
                      <div
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                          checked
                            ? "bg-primary/15 border-primary text-foreground font-bold"
                            : "bg-surface/50 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div
                          className={`size-4 rounded flex items-center justify-center shrink-0 border ${
                            checked ? "bg-primary border-primary text-background" : "border-border"
                          }`}
                        >
                          {checked && <CheckCircle2 className="size-3.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{feat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Floor Plan Upload & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "رفع مخطط الشقة / الرسم الهندسي (اختياري)" : "Attach Floor Plan / Drawing (Optional)"}
                  </label>
                  {planFile ? (
                    <div className="flex items-center justify-between rounded-xl bg-surface p-3 border border-primary/50 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="size-4 text-primary shrink-0" />
                        <span className="truncate font-semibold text-foreground">{planFile.name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                          ({(planFile.size / (1024 * 1024)).toFixed(1)}MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border hover:border-primary bg-surface/40 p-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      <Upload className="size-4 text-primary" />
                      <span>{lang === "ar" ? "اضغط لرفع ملف PDF أو صورة (حتى 10MB)" : "Upload PDF, PNG, or JPG (Up to 10MB)"}</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    {lang === "ar" ? "الميزانية التقريبية المرصودة (اختياري)" : "Approximate Budget (Optional)"}
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-xl border border-input bg-surface/80 p-3 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="">{lang === "ar" ? "دع YSMED تقدم أفضل مقايسة" : "Let YSMED recommend optimal estimate"}</option>
                    <option value="10k - 25k EGP">10,000 – 25,000 EGP</option>
                    <option value="25k - 50k EGP">25,000 – 50,000 EGP</option>
                    <option value="50k - 100k EGP">50,000 – 100,000 EGP</option>
                    <option value="100k+ EGP">100,000+ EGP (Luxury / Villa)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  {lang === "ar" ? "ملاحظات إضافية أو تفاصيل خاصة بالعقار" : "Additional Notes or Preferences"}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === "ar" ? "هل العقار تحت التشطيب أم مشطب بالكامل؟ هل يوجد أسلاك نيوترال؟ ما هو الموعد المفضل للمعاينة؟" : "Is the property currently being finished or retrofitted? Any specific brand preferences?"}
                  className="w-full rounded-xl border border-input bg-surface/80 p-3 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="submit"
                  disabled={busy}
                  variant="hero"
                  size="lg"
                  className="w-full sm:flex-1 rounded-full font-bold shadow-glow text-sm flex items-center justify-center gap-2"
                >
                  <Send className="size-4" />
                  <span>
                    {busy
                      ? lang === "ar"
                        ? "جاري إرسال الطلب..."
                        : "Submitting..."
                      : lang === "ar"
                      ? "إرسال طلب المقايسة الهندسية"
                      : "Submit Consultation & Quote Request"}
                  </span>
                </Button>

                <a
                  href={getWhatsAppDirectLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-6 py-3 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/25 transition-colors shrink-0"
                >
                  <Phone className="size-4" />
                  <span>{lang === "ar" ? "تواصل مباشر عبر الواتساب" : "Direct WhatsApp Chat"}</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
