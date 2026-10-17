import { useState, useRef, type FormEvent, type ChangeEvent, type DragEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
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

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function InquiryForm({ withSector }: { withSector?: boolean }) {
  const { t, tl, lang } = useI18n();
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(lang === "ar" ? "يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)" : "Please select a valid image file");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(t("photoTooLarge"));
      return;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const removePhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhoto(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    if (photo) {
      try {
        const ext = photo.name.split(".").pop() || "jpg";
        const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const filePath = `inquiries/${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("inquiry-attachments")
          .upload(filePath, photo, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          // If storage bucket isn't set up yet, notify user with explanation
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

    const { data: u } = await supabase.auth.getUser();

    const insertData: Record<string, unknown> = {
      user_id: u.user?.id ?? null,
      kind: withSector ? "request" : "contact",
      sector: withSector ? String(data["sector"] ?? "") : null,
      name: r.data.name,
      email: r.data.email,
      phone: r.data.phone || null,
      message: uploadedPhotoUrl
        ? `${r.data.message}\n\n[Attached Photo]: ${uploadedPhotoUrl}`
        : r.data.message,
    };

    if (uploadedPhotoUrl) {
      insertData["photo_url"] = uploadedPhotoUrl;
    }

    let { error } = await supabase.from("inquiries").insert(insertData as never);

    // If database table does not have photo_url column yet, retry without photo_url column
    if (error && error.message?.includes("photo_url")) {
      delete insertData["photo_url"];
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

      {/* ─── Photo Upload Section ─────────────────────────────────────────── */}
      <div className="sm:col-span-2">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("attachPhoto")}
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileInputChange}
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
        />

        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              isDragging
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border/80 bg-surface/40 hover:border-primary/60 hover:bg-surface/80"
            }`}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Upload className="size-6" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              {t("dropPhoto")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("photoFormats")}
            </p>
          </div>
        ) : (
          <div className="relative flex items-center gap-4 rounded-2xl border border-primary/40 bg-surface/80 p-3 sm:p-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-background sm:size-20">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <ImageIcon className="size-3.5" />
                <span className="font-semibold uppercase tracking-wider">
                  {lang === "ar" ? "صورة محددة" : "Image selected"}
                </span>
              </div>
              <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                {photo?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {photo ? (photo.size / (1024 * 1024) >= 1 ? `${(photo.size / (1024 * 1024)).toFixed(2)} MB` : `${(photo.size / 1024).toFixed(0)} KB`) : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={removePhoto}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
              title={t("removePhoto")}
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="hero"
        size="xl"
        disabled={busy}
        className="w-full sm:col-span-2"
      >
        {busy ? (photo ? t("uploadingPhoto") : "...") : t("send")}
      </Button>
    </form>
  );
}
