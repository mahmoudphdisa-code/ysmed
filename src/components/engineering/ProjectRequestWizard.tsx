import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Cpu,
  Code2,
  Factory,
  Sparkles,
  Wrench,
  UploadCloud,
  FileText,
  Calendar,
  Clock,
  DollarSign,
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Bot,
  Zap,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  engineeringServices,
  projectCategories,
  projectStages,
  userTypes,
  type EngineeringServiceItem,
} from "@/data/engineeringData";
import { submitProjectRequest } from "@/services/engineeringService";

interface WizardProps {
  initialServiceSlug?: string;
  onSuccess?: (ref: string, token: string) => void;
  className?: string;
}

export function ProjectRequestWizard({
  initialServiceSlug,
  onSuccess,
  className = "",
}: WizardProps) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const navigate = useNavigate();

  // Step state (1 to 6)
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Step 1: Contact
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [userType, setUserType] = useState("student");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");

  // Step 2: Services
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialServiceSlug ? [initialServiceSlug] : ["graduation-projects"]
  );

  // Step 3: Project Technical Details
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("embedded_systems");
  const [currentStage, setCurrentStage] = useState("idea");
  const [projectDescription, setProjectDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [requiredFeatures, setRequiredFeatures] = useState("");
  const [existingTechnologies, setExistingTechnologies] = useState("");
  const [technicalChallenges, setTechnicalChallenges] = useState("");

  // Step 3: Conditionals
  const [hwMicrocontroller, setHwMicrocontroller] = useState("");
  const [hwSensors, setHwSensors] = useState("");
  const [hwPcbLayers, setHwPcbLayers] = useState("2-layer");
  const [swPlatforms, setSwPlatforms] = useState<string[]>(["web"]);
  const [swTechStack, setSwTechStack] = useState("");
  const [mfgQuantity, setMfgQuantity] = useState("1");
  const [mfgEnclosure, setMfgEnclosure] = useState("custom_3d");
  const [gradDeadline, setGradDeadline] = useState("");
  const [protoOutcome, setProtoOutcome] = useState("working_mvp");

  // Step 4: Files
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 5: Timeline & Budget
  const [targetDate, setTargetDate] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [budgetEstimate, setBudgetEstimate] = useState("");
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Step 6: Review & Submit
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    referenceNumber: string;
    accessToken: string;
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // If initialServiceSlug changes externally
  useEffect(() => {
    if (initialServiceSlug && !selectedServices.includes(initialServiceSlug)) {
      setSelectedServices((prev) => [...prev, initialServiceSlug]);
    }
  }, [initialServiceSlug]);

  // Conditional flags
  const isHardwareSelected =
    selectedServices.includes("hardware-engineering") ||
    selectedServices.includes("project-manufacturing") ||
    ["robotics", "embedded_systems", "electronics", "iot"].includes(projectCategory);

  const isSoftwareSelected =
    selectedServices.includes("software-development") ||
    ["web_app", "mobile_app", "ai_ml", "computer_vision", "data_science"].includes(projectCategory);

  const isManufacturingSelected =
    selectedServices.includes("project-manufacturing") ||
    currentStage === "manufacturing";

  const isGraduationSelected =
    selectedServices.includes("graduation-projects") || userType === "student";

  const isPrototypeSelected = selectedServices.includes("prototype-development");

  // Toggle service selection
  const toggleService = (slug: string) => {
    setSelectedServices((prev) =>
      prev.includes(slug)
        ? prev.length > 1
          ? prev.filter((s) => s !== slug)
          : prev
        : [...prev, slug]
    );
  };

  // Toggle software platform
  const togglePlatform = (p: string) => {
    setSwPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  // File handling
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid: File[] = [];
    const maxSizeBytes = 25 * 1024 * 1024; // 25MB

    for (let i = 0; i < files.length; i++) {
      const f = files.item(i);
      if (!f) continue;
      if (f.size > maxSizeBytes) {
        toast.error(
          isAr
            ? `الملف ${f.name} يتجاوز الحد الأقصى (25 ميجابايت)`
            : `File ${f.name} exceeds maximum size (25MB)`
        );
        continue;
      }
      valid.push(f);
    }

    setAttachedFiles((prev) => [...prev, ...valid].slice(0, 10));
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!fullName.trim()) {
        toast.error(isAr ? "يرجى إدخال الاسم الكامل" : "Please enter your full name");
        return false;
      }
      if (!email.trim() || !email.includes("@")) {
        toast.error(isAr ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email");
        return false;
      }
      if (!phone.trim()) {
        toast.error(isAr ? "يرجى إدخال رقم الهاتف" : "Please enter your phone number");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (selectedServices.length === 0) {
        toast.error(isAr ? "يرجى اختيار خدمة واحدة على الأقل" : "Please select at least one service");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!projectTitle.trim()) {
        toast.error(isAr ? "يرجى كتابة عنوان للمشروع" : "Please enter a project title");
        return false;
      }
      if (!projectDescription.trim() || projectDescription.trim().length < 15) {
        toast.error(
          isAr
            ? "يرجى تقديم وصف أوضح لفكرة المشروع (15 حرفاً على الأقل)"
            : "Please provide a more detailed project description"
        );
        return false;
      }
      return true;
    }

    if (step === 5) {
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 300, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  // Final Submit
  const handleSubmit = async () => {
    if (!termsAgreed) {
      toast.error(
        isAr
          ? "يرجى الموافقة على شروط الخدمة واتفاقية الحفاظ على سرية الفكرة"
          : "Please agree to the service terms and confidentiality pledge"
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitProjectRequest({
        fullName,
        email,
        phone,
        whatsapp: whatsapp || phone,
        userType,
        university,
        department,
        projectTitle,
        projectCategory,
        projectDescription,
        objectives,
        requiredFeatures,
        currentStage,
        existingTechnologies,
        technicalChallenges,
        conditionalDetails: {
          hwMicrocontroller,
          hwSensors,
          hwPcbLayers,
          swPlatforms,
          swTechStack,
          mfgQuantity,
          mfgEnclosure,
          gradDeadline,
          protoOutcome,
        },
        services: selectedServices,
        deadline: targetDate || gradDeadline,
        urgency,
        budgetMin: budgetEstimate ? parseFloat(budgetEstimate) : undefined,
        preferredContactMethod: contactMethod,
        additionalNotes,
        files: attachedFiles,
      });

      if (res.success) {
        setSubmissionResult({
          referenceNumber: res.referenceNumber,
          accessToken: res.accessToken,
        });
        toast.success(
          isAr ? "تم إرسال طلب المشروع بنجاح!" : "Project request submitted successfully!"
        );
        if (onSuccess) {
          onSuccess(res.referenceNumber, res.accessToken);
        }
      } else {
        toast.error(res.error || (isAr ? "فشل إرسال الطلب، يرجى المحاولة ثانية" : "Submission failed"));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(isAr ? "حدث خطأ غير متوقع أثناء الإرسال" : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: "ref" | "token") => {
    navigator.clipboard.writeText(text);
    if (type === "ref") {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
    toast.success(isAr ? "تم النسخ إلى الحافظة" : "Copied to clipboard");
  };

  const fieldClass =
    "w-full rounded-xl border border-input bg-surface/50 px-4 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:bg-surface focus:shadow-glow focus:outline-none";

  // If successfully submitted, render celebration confirmation screen
  if (submissionResult) {
    return (
      <div className={`glass relative overflow-hidden rounded-2xl p-6 sm:p-10 ${className}`}>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/20 text-primary shadow-glow">
            <CheckCircle2 className="size-10" />
          </div>

          <h2 className="text-2xl font-bold sm:text-3xl text-gradient">
            {isAr ? "تم استلام طلب مشروعك الهندسي بنجاح!" : "Project Request Received Successfully!"}
          </h2>

          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {isAr
              ? "يقوم مهندسونا المتخصصون بمراجعة متطلباتك ومرفقاتك بدقة. سنوافيك بالتقييم الفني وعرض السعر خلال 24 ساعة."
              : "Our senior engineering team is reviewing your technical specifications. You will receive an assessment and itemized quotation within 24 business hours."}
          </p>

          {/* Reference & Token Card */}
          <div className="mt-8 space-y-4 rounded-xl border border-primary/30 bg-surface/80 p-5 text-start sm:p-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isAr ? "رقم المرجع للمشروع (Project Reference)" : "Project Reference Number"}
                </span>
                <p className="font-mono text-2xl font-bold text-primary">
                  {submissionResult.referenceNumber}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 self-start sm:self-center"
                onClick={() => copyToClipboard(submissionResult.referenceNumber, "ref")}
              >
                {copiedRef ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                <span>{copiedRef ? (isAr ? "تم النسخ" : "Copied") : isAr ? "نسخ الرقم" : "Copy"}</span>
              </Button>
            </div>

            <div className="border-t border-border/50 pt-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isAr ? "رمز المتابعة السري (Access Key)" : "Secure Access Key"}
                </span>
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {submissionResult.accessToken}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 self-start sm:self-center"
                onClick={() => copyToClipboard(submissionResult.accessToken, "token")}
              >
                {copiedToken ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                <span>{copiedToken ? (isAr ? "تم النسخ" : "Copied") : isAr ? "نسخ الرمز" : "Copy"}</span>
              </Button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg" className="rounded-xl px-8 shadow-glow">
              <Link
                to="/my-projects"
                search={{
                  ref: submissionResult.referenceNumber,
                  token: submissionResult.accessToken,
                }}
              >
                <span>{isAr ? "متابعة حالة المشروع الآن" : "Track Project Status Now"}</span>
                <ChevronRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-xl"
              onClick={() => {
                setSubmissionResult(null);
                setCurrentStep(1);
                setProjectTitle("");
                setProjectDescription("");
                setAttachedFiles([]);
              }}
            >
              {isAr ? "تقديم طلب مشروع آخر" : "Submit Another Request"}
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-400" />
            <span>
              {isAr
                ? "بياناتك ومخططاتك محمية ومحفوظة بموجب سياسة عدم الإفصاح والسرية الهندسية."
                : "Your data and schematics are encrypted and protected by strict engineering NDA."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass relative overflow-hidden rounded-2xl p-5 sm:p-8 md:p-10 ${className}`}>
      {/* Wizard Header & Progress */}
      <div className="mb-8 border-b border-border/60 pb-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/25">
              <Sparkles className="size-3.5" />
              {isAr ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
            </span>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl text-foreground">
              {currentStep === 1 && (isAr ? "بيانات التواصل ومقدم الطلب" : "Contact & Applicant Details")}
              {currentStep === 2 && (isAr ? "تحديد الخدمات الهندسية المطلوبة" : "Select Required Engineering Services")}
              {currentStep === 3 && (isAr ? "المواصفات الفنية وتفاصيل المشروع" : "Project Specifications & Details")}
              {currentStep === 4 && (isAr ? "إرفاق الملفات والمخططات الهندسية" : "Schematics & Project Files")}
              {currentStep === 5 && (isAr ? "الجدول الزمني والميزانية التقديرية" : "Timeline, Urgency & Budget")}
              {currentStep === 6 && (isAr ? "مراجعة الطلب والاعتماد النهائي" : "Review & Submit Request")}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <span>{Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}%</span>
            <span>{isAr ? "مكتمل" : "completed"}</span>
          </div>
        </div>

        {/* Progress Bar with 6 Nodes */}
        <div className="mt-5">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface">
            <div
              className="h-full bg-gradient-to-r from-primary via-cyan-400 to-gold transition-all duration-300 ease-out"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>
              {isAr ? "1. التواصل" : "1. Contact"}
            </span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>
              {isAr ? "2. الخدمات" : "2. Services"}
            </span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>
              {isAr ? "3. التفاصيل" : "3. Details"}
            </span>
            <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>
              {isAr ? "4. الملفات" : "4. Files"}
            </span>
            <span className={currentStep >= 5 ? "text-primary font-medium" : ""}>
              {isAr ? "5. الموعد" : "5. Schedule"}
            </span>
            <span className={currentStep >= 6 ? "text-primary font-medium" : ""}>
              {isAr ? "6. الإرسال" : "6. Review"}
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: Contact Information */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-rise">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "الاسم الكامل *" : "Full Name *"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isAr ? "المهندس / أحمد محمد" : "Eng. John Doe"}
                  className={fieldClass}
                />
                <User className="pointer-events-none absolute end-3.5 top-3.5 size-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "البريد الإلكتروني *" : "Email Address *"}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={fieldClass}
                />
                <Mail className="pointer-events-none absolute end-3.5 top-3.5 size-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "رقم الهاتف / الاتصال *" : "Phone Number *"}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className={fieldClass}
                />
                <Phone className="pointer-events-none absolute end-3.5 top-3.5 size-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? "رقم الواتساب (اختياري)" : "WhatsApp Number (Optional)"}
                </label>
                {phone && (
                  <button
                    type="button"
                    onClick={() => setWhatsapp(phone)}
                    className="text-[11px] text-primary hover:underline"
                  >
                    {isAr ? "نفس رقم الهاتف" : "Same as phone"}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className={fieldClass}
                />
                <span className="pointer-events-none absolute end-3.5 top-3.5 text-xs text-emerald-400 font-bold">
                  WA
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-foreground">
              {isAr ? "صفة مقدم الطلب *" : "Applicant Category *"}
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              {userTypes.map((ut) => (
                <button
                  key={ut.value}
                  type="button"
                  onClick={() => setUserType(ut.value)}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-start text-xs font-medium transition-all ${
                    userType === ut.value
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border/60 bg-surface/40 text-muted-foreground hover:border-border hover:bg-surface"
                  }`}
                >
                  <span className={`size-2.5 rounded-full ${userType === ut.value ? "bg-primary" : "bg-muted-foreground/40"}`} />
                  <span>{isAr ? ut.labelAr : ut.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {userType === "student"
                  ? isAr ? "الجامعة / المعهد *" : "University / Institute *"
                  : isAr ? "الجهة / الشركة / المؤسسة (اختياري)" : "Organization / Company (Optional)"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder={
                    userType === "student"
                      ? isAr ? "جامعة القاهرة / جامعة عين شمس..." : "Cairo University..."
                      : isAr ? "اسم الشركة أو الجهة" : "Organization name"
                  }
                  className={fieldClass}
                />
                <Building className="pointer-events-none absolute end-3.5 top-3.5 size-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {userType === "student"
                  ? isAr ? "الكلية / القسم الأكاديمي" : "Faculty / Department"
                  : isAr ? "التخصص / الإدارة" : "Department / Role"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder={
                    userType === "student"
                      ? isAr ? "هندسة حاسبات / اتصالات / ميكاترونكس" : "Computer / Mechatronics"
                      : isAr ? "قسم التطوير الهندسي" : "R&D Department"
                  }
                  className={fieldClass}
                />
                <GraduationCap className="pointer-events-none absolute end-3.5 top-3.5 size-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Service Selection */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-rise">
          <p className="text-sm text-muted-foreground">
            {isAr
              ? "يمكنك اختيار خدمة واحدة أو عدة خدمات مجتمعة (مثال: دعم تخرج + تصنيع بوردة PCB + برمجة سوفتوير)."
              : "Select one or multiple services. We handle comprehensive multidisciplinary projects seamlessly."}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {engineeringServices.map((srv) => {
              const isSelected = selectedServices.includes(srv.slug);
              return (
                <div
                  key={srv.slug}
                  onClick={() => toggleService(srv.slug)}
                  className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 select-none ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border/60 bg-surface/30 hover:border-primary/40 hover:bg-surface/60"
                  }`}
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/60 bg-surface/40 mb-3.5">
                    <img
                      src={srv.image}
                      alt={isAr ? srv.titleAr : srv.titleEn}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute top-2 start-2">
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-background/80 text-primary border border-primary/20"
                        }`}
                      >
                        {srv.icon === "GraduationCap" && <GraduationCap className="size-4" />}
                        {srv.icon === "Cpu" && <Cpu className="size-4" />}
                        {srv.icon === "Code2" && <Code2 className="size-4" />}
                        {srv.icon === "Factory" && <Factory className="size-4" />}
                        {srv.icon === "Sparkles" && <Sparkles className="size-4" />}
                        {srv.icon === "Wrench" && <Wrench className="size-4" />}
                      </div>
                    </div>

                    <div
                      className={`absolute top-2 end-2 flex size-6 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/80 bg-background/80 text-transparent backdrop-blur-sm"
                      }`}
                    >
                      <Check className="size-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {isAr ? srv.titleAr : srv.titleEn}
                  </h3>

                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                    {isAr ? srv.shortDescAr : srv.shortDescEn}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {srv.tags.slice(0, 2).map((tg) => (
                      <span
                        key={tg}
                        className="rounded-md bg-surface/80 px-2 py-0.5 text-[10px] text-muted-foreground border border-border/50"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Project Details & Conditionals */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-rise">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "عنوان أو اسم المشروع *" : "Project Title *"}
              </label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder={isAr ? "مثال: ذراع روبوتية لفرز المنتجات بالرؤية الحاسوبية" : "e.g. AI Autonomous Sorting Arm"}
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "تصنيف ومجال المشروع *" : "Project Category *"}
              </label>
              <select
                value={projectCategory}
                onChange={(e) => setProjectCategory(e.target.value)}
                className={fieldClass}
              >
                {projectCategories.map((c) => (
                  <option key={c.value} value={c.value} className="bg-background text-foreground">
                    {isAr ? c.labelAr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "المرحلة الحالية للمشروع *" : "Current Project Stage *"}
              </label>
              <select
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value)}
                className={fieldClass}
              >
                {projectStages.map((st) => (
                  <option key={st.value} value={st.value} className="bg-background text-foreground">
                    {isAr ? st.labelAr : st.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "التقنيات المستخدمة حالياً (إن وجدت)" : "Existing Technologies (If any)"}
              </label>
              <input
                type="text"
                value={existingTechnologies}
                onChange={(e) => setExistingTechnologies(e.target.value)}
                placeholder="ESP32, Python, OpenCV, React..."
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-foreground">
              {isAr ? "الوصف التفصيلي لفكرة المشروع ومتطلباته *" : "Detailed Project Description & Scope *"}
            </label>
            <textarea
              required
              rows={4}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder={
                isAr
                  ? "اشرح فكرة المشروع، كيف سيعمل النظام، وما هي المدخلات والمخرجات المطلوبة..."
                  : "Explain the project concept, operational flow, inputs, outputs, and specific requirements..."
              }
              className={fieldClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "المخرجات والوظائف المستهدفة (Objectives)" : "Key Expected Functions & Deliverables"}
              </label>
              <textarea
                rows={3}
                value={requiredFeatures}
                onChange={(e) => setRequiredFeatures(e.target.value)}
                placeholder={
                  isAr
                    ? "مثال: قراءة 4 حساسات، حفظ البيانات سحابياً، تطبيق للمتابعة، إطلاق تنبيه عند الخطر..."
                    : "e.g. Read 4 sensors, log to cloud, real-time alert buzzer, mobile dashboard..."
                }
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "المشاكل الفنية أو التحديات التي تواجهك" : "Specific Technical Challenges or Bugs"}
              </label>
              <textarea
                rows={3}
                value={technicalChallenges}
                onChange={(e) => setTechnicalChallenges(e.target.value)}
                placeholder={
                  isAr
                    ? "مثال: عدم استقرار إشارة الحساس، بطء معالجة الصور، احتراق منظم الجهد..."
                    : "e.g. Noise on analog signal, frame rate drops in inference, voltage drops..."
                }
                className={fieldClass}
              />
            </div>
          </div>

          {/* CONDITIONAL SECTION: Hardware / Embedded */}
          {isHardwareSelected && (
            <div className="rounded-xl border border-primary/20 bg-surface/40 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                <Cpu className="size-4" />
                <span>{isAr ? "متطلبات الهاردوير والإلكترونيات" : "Hardware & Electronics Specifications"}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    {isAr ? "المتحكم المقترح / المفضل" : "Target Microcontroller / Board"}
                  </label>
                  <input
                    type="text"
                    value={hwMicrocontroller}
                    onChange={(e) => setHwMicrocontroller(e.target.value)}
                    placeholder="ESP32, STM32, Arduino, Raspberry Pi..."
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    {isAr ? "الحساسات والمحركات المطلوبة" : "Sensors & Actuators"}
                  </label>
                  <input
                    type="text"
                    value={hwSensors}
                    onChange={(e) => setHwSensors(e.target.value)}
                    placeholder="Ultrasonic, Stepper, IMU, Relay..."
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    {isAr ? "تصميم وتصنيع PCB" : "PCB Design Type"}
                  </label>
                  <select
                    value={hwPcbLayers}
                    onChange={(e) => setHwPcbLayers(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="none">{isAr ? "لا أحتاج PCB حالياً" : "No PCB required"}</option>
                    <option value="2-layer">{isAr ? "بوردة طبقتين (2-Layer)" : "2-Layer Standard PCB"}</option>
                    <option value="4-layer">{isAr ? "بوردة 4 طبقات متعددة (4-Layer)" : "4-Layer Advanced PCB"}</option>
                    <option value="smt-assembly">{isAr ? "تصنيع وتجميع المكونات ولحام SMT" : "PCB + Full SMT Assembly"}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONAL SECTION: Software & AI */}
          {isSoftwareSelected && (
            <div className="rounded-xl border border-primary/20 bg-surface/40 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                <Code2 className="size-4" />
                <span>{isAr ? "متطلبات البرمجيات والذكاء الاصطناعي" : "Software & AI Platforms"}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">
                    {isAr ? "المنصات المستهدفة (اختر المنصات)" : "Target Platforms"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "web", label: "Web Portal" },
                      { id: "android", label: "Android App" },
                      { id: "ios", label: "iOS App" },
                      { id: "desktop", label: "Desktop Dashboard" },
                      { id: "cloud", label: "Cloud API / Backend" },
                    ].map((plt) => (
                      <button
                        key={plt.id}
                        type="button"
                        onClick={() => togglePlatform(plt.id)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          swPlatforms.includes(plt.id)
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-border bg-surface text-muted-foreground hover:bg-surface/80"
                        }`}
                      >
                        {plt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    {isAr ? "التقنيات البرمجية المفضلة (إن وجدت)" : "Tech Stack Preferences"}
                  </label>
                  <input
                    type="text"
                    value={swTechStack}
                    onChange={(e) => setSwTechStack(e.target.value)}
                    placeholder="React, Next.js, Python, YOLOv8, Supabase..."
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONAL SECTION: Manufacturing */}
          {isManufacturingSelected && (
            <div className="rounded-xl border border-primary/20 bg-surface/40 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                <Factory className="size-4" />
                <span>{isAr ? "مواصفات التصنيع والتجميع" : "Manufacturing & Assembly Details"}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    {isAr ? "الكمية المطلوبة للتصنيع" : "Production Quantity"}
                  </label>
                  <select
                    value={mfgQuantity}
                    onChange={(e) => setMfgQuantity(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="1">{isAr ? "نموذج واحد (Single Unit / Prototype)" : "Single Unit / Prototype"}</option>
                    <option value="2-5">{isAr ? "2 إلى 5 نماذج تجريبية" : "2 – 5 Pilot Units"}</option>
                    <option value="10-50">{isAr ? "دفعة إنتاجية صغيرة (10 - 50 قطعة)" : "Small Batch (10 – 50 Units)"}</option>
                    <option value="50+">{isAr ? "أكثر من 50 قطعة" : "50+ Units"}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    {isAr ? "الهيكل الخارجي والكيس (Enclosure)" : "Enclosure / Mechanical Casing"}
                  </label>
                  <select
                    value={mfgEnclosure}
                    onChange={(e) => setMfgEnclosure(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="custom_3d">{isAr ? "تصميم وطباعة 3D مخصصة بالكامل" : "Custom 3D-Printed Enclosure"}</option>
                    <option value="standard_box">{isAr ? "علبة صناعية معيارية DIN-Rail أو IP65" : "Standard Industrial Box (IP65 / DIN)"}</option>
                    <option value="laser_cut">{isAr ? "أكريليك وتقطيع ليزر" : "Laser-cut Acrylic Housing"}</option>
                    <option value="none">{isAr ? "لا أحتاج كيس خارجي" : "No Enclosure Needed"}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Files and Attachments */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-rise">
          <div>
            <p className="text-sm text-muted-foreground">
              {isAr
                ? "ارفع المخططات، ملفات الأكواد، ملفات KiCad / Altium، تصميمات CAD ثلاثية الأبعاد، أو أي ملفات توضيحية. أقصى حجم لكل ملف 25 ميجابايت."
                : "Upload existing schematics, code archives, KiCad/Altium PCB files, or CAD 3D models. Max 25MB per file."}
            </p>
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border/80 bg-surface/30 hover:border-primary/50 hover:bg-surface/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
            />

            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow mb-4">
              <UploadCloud className="size-7" />
            </div>

            <p className="text-base font-semibold text-foreground">
              {isAr ? "اضغط لاختيار الملفات أو اسحبها هنا" : "Click to browse or drag & drop files here"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {isAr
                ? "يدعم صيغ PDF, DOCX, ZIP, PNG, JPG, Gerber, KiCad, STL (حتى 10 ملفات)"
                : "Supports PDF, DOCX, ZIP, PNG, JPG, Gerber, KiCad, STL (Up to 10 files)"}
            </p>
          </div>

          {/* Uploaded Files List */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground">
                {isAr ? `الملفات المرفقة (${attachedFiles.length}):` : `Attached Files (${attachedFiles.length}):`}
              </span>

              <div className="grid gap-2 sm:grid-cols-2">
                {attachedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-surface/60 p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="size-4 shrink-0 text-primary" />
                      <div className="overflow-hidden">
                        <p className="truncate font-medium text-foreground">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                      aria-label="Remove file"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
            <ShieldCheck className="size-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <span className="font-bold text-foreground">
                {isAr ? "ضمان السرية والملكية الفكرية: " : "Confidentiality & IP Protection: "}
              </span>
              {isAr
                ? "يتم تشفير كافة الملفات والمخططات المرفوعة وتخزينها في مستودع سحابي خاص وآمن، وتخضع لسياسة سرية المعلومات الصارمة."
                : "All files and schematics are encrypted and stored in private secure cloud storage under strict confidentiality policies."}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Timeline & Budget */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-rise">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "تاريخ التسليم المستهدف أو المفضل" : "Target Completion Date"}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className={fieldClass}
                />
                <Calendar className="pointer-events-none absolute end-3.5 top-3.5 size-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "مستوى الأولوية والاستعجال *" : "Project Urgency Level *"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "normal", labelAr: "عادي", labelEn: "Standard", color: "text-blue-400" },
                  { id: "high", labelAr: "هام", labelEn: "High", color: "text-amber-400" },
                  { id: "urgent", labelAr: "عاجل جداً", labelEn: "Critical", color: "text-rose-400" },
                ].map((urg) => (
                  <button
                    key={urg.id}
                    type="button"
                    onClick={() => setUrgency(urg.id)}
                    className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                      urgency === urg.id
                        ? "border-primary bg-primary/20 text-primary shadow-glow"
                        : "border-border/60 bg-surface/40 text-muted-foreground hover:bg-surface"
                    }`}
                  >
                    {isAr ? urg.labelAr : urg.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? "الميزانية المتوقعة (اختياري - ج.م)" : "Estimated Budget (Optional - EGP)"}
                </label>
                <span className="text-[10px] text-muted-foreground">
                  {isAr ? "غير ملزم" : "Non-binding"}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={budgetEstimate}
                  onChange={(e) => setBudgetEstimate(e.target.value)}
                  placeholder={isAr ? "مثال: 5000" : "e.g. 5000"}
                  className={fieldClass}
                />
                <DollarSign className="pointer-events-none absolute end-3.5 top-3.5 size-4 text-muted-foreground" />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {isAr
                  ? "السعر الفعلي يتحدد بدقة في عرض السعر الرسمي بناءً على المكونات وساعات العمل."
                  : "Final cost is itemized in your official quote based on component costs and scope."}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground">
                {isAr ? "وسيلة التواصل المفضلة للمتابعة" : "Preferred Communication Method"}
              </label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                className={fieldClass}
              >
                <option value="whatsapp">{isAr ? "واتساب (WhatsApp - محادثة فورية)" : "WhatsApp"}</option>
                <option value="phone">{isAr ? "مكالمة هاتفية مباشرة" : "Phone Call"}</option>
                <option value="email">{isAr ? "البريد الإلكتروني الرسمي" : "Email"}</option>
                <option value="meeting">{isAr ? "جلسة فيديو عبر Google Meet / Zoom" : "Video Meeting (Meet/Zoom)"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-foreground">
              {isAr ? "ملاحظات أو اشتراطات فنية إضافية" : "Additional Technical Constraints or Notes"}
            </label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder={
                isAr
                  ? "أية تفاصيل أخرى مثل متطلبات الطاقة، درجة حرارة التشغيل، أو شروط خاصة بالجامعة..."
                  : "Any other details such as operating temperature, power rails, or academic constraints..."
              }
              className={fieldClass}
            />
          </div>
        </div>
      )}

      {/* STEP 6: Review & Final Submit */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-rise">
          <p className="text-sm text-muted-foreground">
            {isAr
              ? "يرجى مراجعة تفاصيل طلبك قبل الإرسال. يمكنك العودة لأي خطوة سابقة لتعديل البيانات."
              : "Please review your request summary before submission. You can jump back to edit any section."}
          </p>

          <div className="space-y-4 rounded-xl border border-border/80 bg-surface/40 p-5 text-xs">
            {/* Contact */}
            <div className="flex items-start justify-between border-b border-border/50 pb-3">
              <div>
                <span className="font-bold text-foreground">
                  {isAr ? "بيانات مقدم الطلب:" : "Applicant Info:"}
                </span>
                <p className="text-muted-foreground mt-0.5">
                  {fullName} • {email} • {phone}
                  {university && ` • (${university}${department ? ` - ${department}` : ""})`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-primary hover:underline font-semibold"
              >
                {isAr ? "تعديل" : "Edit"}
              </button>
            </div>

            {/* Services */}
            <div className="flex items-start justify-between border-b border-border/50 pb-3">
              <div>
                <span className="font-bold text-foreground">
                  {isAr ? "الخدمات المختارة:" : "Selected Services:"}
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedServices.map((slug) => {
                    const srv = engineeringServices.find((s) => s.slug === slug);
                    return (
                      <span
                        key={slug}
                        className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary border border-primary/30"
                      >
                        {isAr ? srv?.titleAr : srv?.titleEn}
                      </span>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-primary hover:underline font-semibold"
              >
                {isAr ? "تعديل" : "Edit"}
              </button>
            </div>

            {/* Project Details */}
            <div className="flex items-start justify-between border-b border-border/50 pb-3">
              <div>
                <span className="font-bold text-foreground">
                  {isAr ? "تفاصيل المشروع:" : "Project Details:"}
                </span>
                <p className="text-primary font-medium mt-0.5">{projectTitle}</p>
                <p className="text-muted-foreground mt-1 line-clamp-2">{projectDescription}</p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-primary hover:underline font-semibold"
              >
                {isAr ? "تعديل" : "Edit"}
              </button>
            </div>

            {/* Files & Timeline */}
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-foreground">
                  {isAr ? "المرفقات والجدول الزمني:" : "Files & Timeline:"}
                </span>
                <p className="text-muted-foreground mt-0.5">
                  {isAr ? `${attachedFiles.length} ملفات مرفقة` : `${attachedFiles.length} files attached`} •{" "}
                  {targetDate
                    ? isAr ? `التسليم المطلوب: ${targetDate}` : `Target: ${targetDate}`
                    : isAr ? "موعد مرن" : "Flexible schedule"} •{" "}
                  {isAr ? `الأولوية: ${urgency}` : `Urgency: ${urgency}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="text-primary hover:underline font-semibold"
              >
                {isAr ? "تعديل" : "Edit"}
              </button>
            </div>
          </div>

          {/* Terms & NDA Checkbox */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-1 size-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-xs text-foreground leading-relaxed">
                {isAr
                  ? "أوافق على سياسة الخدمة وأتعهد بدقة البيانات الفنية المقدمة. أتفهم التزام شركة YSMED الصارم بالحفاظ على سرية الفكرة وحماية الملكية الفكرية وعدم مشاركة أية مخططات أو أكواد مع أي طرف ثالث."
                  : "I agree to the service terms and certify the accuracy of submitted technical details. I understand YSMED strictly upholds intellectual property protection and confidentiality."}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Navigation Buttons Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={submitting}
            className="rounded-xl gap-1.5"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
            <span>{isAr ? "الخطوة السابقة" : "Previous"}</span>
          </Button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <Button
            type="button"
            variant="hero"
            onClick={handleNext}
            className="rounded-xl gap-1.5 px-6 shadow-glow"
          >
            <span>{isAr ? "الخطوة التالية" : "Continue"}</span>
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="hero"
            disabled={submitting || !termsAgreed}
            onClick={handleSubmit}
            className="rounded-xl gap-2 px-8 shadow-glow text-base"
          >
            {submitting ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>{isAr ? "جاري الإرسال والتأمين..." : "Submitting..."}</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>{isAr ? "إرسال طلب المشروع الآن" : "Submit Project Request"}</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
