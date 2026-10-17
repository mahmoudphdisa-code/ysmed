import { useState, useRef, type FormEvent, type ChangeEvent, type DragEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, FileText, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { solutions } from "@/data/solutions";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1).max(2000),
});

const field =
  "w-full rounded-xl border border-input bg-surface/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:shadow-glow sm:text-base";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10 MB

export function InquiryForm({ withSector }: { withSector?: boolean }) {
  const { t, tl, lang } = useI18n();
  const [busy, setBusy] = useState(false);

  // Photo state
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoDragging, setPhotoDragging] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Document file state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docDragging, setDocDragging] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Photo handlers
  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(lang === "ar" ? "يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)" : "Please select a valid image file");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      toast.error(t("photoTooLarge"));
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhoto(null);
    setPreviewUrl(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  // Document file handlers
  const handleDocFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_DOC_SIZE) {
      toast.error(t("fileTooLarge"));
      return;
    }
    setDocFile(file);
  };

  const removeDocFile = () => {
    setDocFile(null);
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    return bytes / (1024 * 1024) >= 1
      ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = schema.safeParse(data);
    if (!r.success) {
      toast.error(lang === "ar" ? "يرجى مراجعة الحقول" : "Please check the highlighted fields");
      return;
    }
    setBusy(true);
    const form = e.currentTarget;

    let uploadedPhotoUrl: string | null = null;
    let uploadedDocUrl: string | null = null;

    // 1. Upload photo if present
    if (photo) {
      try {
        const ext = photo.name.split(".").pop() || "jpg";
        const cleanName = `photo_${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const filePath = `inquiries/photos/${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("inquiry-attachments")
          .upload(filePath, photo, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Photo upload error:", uploadError);
          toast.error(
            lang === "ar"
              ? `تعذر رفع الصورة: ${uploadError.message}. يرجى تفعيل Storage Bucket.`
              : `Could not upload photo: ${uploadError.message}. Please check storage bucket.`
          );
          setBusy(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("inquiry-attachments")
          .getPublicUrl(filePath);

        uploadedPhotoUrl = urlData.publicUrl;
      } catch (uploadErr) {
        console.error("Upload error:", uploadErr);
        toast.error(uploadErr instanceof Error ? uploadErr.message : "Error uploading photo");
        setBusy(false);
        return;
      }
    }

    // 2. Upload document file if present
    if (docFile) {
      try {
        const ext = docFile.name.split(".").pop() || "bin";
        const cleanName = `doc_${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const filePath = `inquiries/docs/${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("inquiry-attachments")
          .upload(filePath, docFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Document upload error:", uploadError);
          toast.error(
            lang === "ar"
              ? `تعذر رفع الملف: ${uploadError.message}. يرجى تفعيل Storage Bucket.`
              : `Could not upload document: ${uploadError.message}. Please check storage bucket.`
          );
          setBusy(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("inquiry-attachments")
          .getPublicUrl(filePath);

        uploadedDocUrl = urlData.publicUrl;
      } catch (uploadErr) {
        console.error("Document upload error:", uploadErr);
        toast.error(uploadErr instanceof Error ? uploadErr.message : "Error uploading document");
        setBusy(false);
        return;
      }
    }

    const { data: u } = await supabase.auth.getUser();

    let finalMessage = r.data.message;
    if (uploadedPhotoUrl) {
      finalMessage += `\n\n[Attached Photo]: ${uploadedPhotoUrl}`;
    }
    if (uploadedDocUrl && docFile) {
      finalMessage += `\n\n[Attached Document (${docFile.name})]: ${uploadedDocUrl}`;
    }

    const insertData: Record<string, unknown> = {
      user_id: u.user?.id ?? null,
      kind: withSector ? "request" : "contact",
      sector: withSector ? String(data["sector"] ?? "") : null,
      name: r.data.name,
      email: r.data.email,
      phone: r.data.phone || null,
      message: finalMessage,
    };

    if (uploadedPhotoUrl) {
      insertData["photo_url"] = uploadedPhotoUrl;
    }
    if (uploadedDocUrl && docFile) {
      insertData["file_url"] = uploadedDocUrl;
      insertData["file_name"] = docFile.name;
    }

    let { error } = await supabase.from("inquiries").insert(insertData as never);

    // If database table does not have photo_url, file_url, or file_name column yet, fallback safely
    if (
      error &&
      (error.message?.includes("photo_url") ||
        error.message?.includes("file_url") ||
        error.message?.includes("file_name"))
    ) {
      delete insertData["photo_url"];
      delete insertData["file_url"];
      delete insertData["file_name"];
      const retry = await supabase.from("inquiries").insert(insertData as never);
      error = retry.error;
    }

    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    form.reset();
    removePhoto();
    removeDocFile();
    toast.success(t("inquirySent"));
  };

  return (
    <form
      onSubmit={submit}
      className="glass glow-border grid gap-3 rounded-3xl p-5 sm:grid-cols-2 sm:gap-4 sm:p-8"
    >
      <input
        name="name"
        required
        maxLength={100}
        placeholder={t("name")}
        className={field}
      />
      <input
        name="email"
        type="email"
        required
        maxLength={255}
        placeholder={t("email")}
        className={field}
      />
      <input
        name="phone"
        maxLength={30}
        placeholder={t("phone")}
        className={field}
      />
      {withSector && (
        <select name="sector" className={field}>
          {solutions.map((s) => (
            <option key={s.slug} value={s.slug}>
              {tl(s.title)}
            </option>
          ))}
        </select>
      )}
      <textarea
        name="message"
        required
        maxLength={2000}
        rows={4}
        placeholder={t("message")}
        className={`${field} sm:col-span-2`}
      />

      {/* ─── Attachments Grid (Photo + File) ───────────────────────────────── */}
      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 sm:gap-4">
        {/* 1. Photo Upload */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("attachPhoto")}
          </label>

          <input
            type="file"
            ref={photoInputRef}
            onChange={(e) => handlePhoto(e.target.files?.[0])}
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
          />

          {!previewUrl ? (
            <div
              onClick={() => photoInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setPhotoDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setPhotoDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setPhotoDragging(false);
                handlePhoto(e.dataTransfer.files?.[0]);
              }}
              className={`group flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
                photoDragging
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border/80 bg-surface/40 hover:border-primary/60 hover:bg-surface/80"
              }`}
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <ImageIcon className="size-5" />
              </div>
              <p className="mt-2 text-xs font-medium text-foreground">
                {t("dropPhoto")}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {t("photoFormats")}
              </p>
            </div>
          ) : (
            <div className="relative flex items-center gap-3 rounded-2xl border border-primary/40 bg-surface/80 p-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <ImageIcon className="size-3.5" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    {lang === "ar" ? "صورة محددة" : "Image selected"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs font-medium text-foreground">
                  {photo?.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {photo ? formatFileSize(photo.size) : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={removePhoto}
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                title={t("removePhoto")}
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 2. File / Document Upload */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("attachFile")}
          </label>

          <input
            type="file"
            ref={docInputRef}
            onChange={(e) => handleDocFile(e.target.files?.[0])}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt,.csv,.dwg"
            className="hidden"
          />

          {!docFile ? (
            <div
              onClick={() => docInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDocDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDocDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDocDragging(false);
                handleDocFile(e.dataTransfer.files?.[0]);
              }}
              className={`group flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
                docDragging
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border/80 bg-surface/40 hover:border-primary/60 hover:bg-surface/80"
              }`}
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-gold/15 text-gold transition-transform group-hover:scale-110">
                <Paperclip className="size-5" />
              </div>
              <p className="mt-2 text-xs font-medium text-foreground">
                {t("dropFile")}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {t("fileFormats")}
              </p>
            </div>
          ) : (
            <div className="relative flex items-center gap-3 rounded-2xl border border-gold/40 bg-surface/80 p-3">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                <FileText className="size-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs text-gold">
                  <Paperclip className="size-3.5" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    {lang === "ar" ? "ملف محدد" : "File selected"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs font-medium text-foreground">
                  {docFile.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatFileSize(docFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={removeDocFile}
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                title={t("removePhoto")}
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="xl"
        disabled={busy}
        className="w-full sm:col-span-2 mt-2"
      >
        {busy ? (photo || docFile ? t("uploadingFiles") : "...") : t("send")}
      </Button>
    </form>
  );
}
