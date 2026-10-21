import { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Phone,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSmartCart } from "@/hooks/useSmartCart";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SmartCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartCartDrawer({ isOpen, onClose }: SmartCartDrawerProps) {
  const { lang } = useI18n();
  const {
    items,
    totalItems,
    subtotalEGP,
    originalSubtotalEGP,
    totalSavingsEGP,
    updateQuantity,
    removeFromCart,
    clearCart,
    isUserLoggedIn,
  } = useSmartCart();

  // Checkout Form State
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [includeInstallation, setIncludeInstallation] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error(
        lang === "ar"
          ? "يرجى كتابة الاسم ورقم الهاتف لإتمام الطلب"
          : "Please provide your name and phone number"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Build order items summary
      const itemsList = items
        .map(
          (i) =>
            `- ${i.titleEn} (${i.variantLabelEn || "Standard"}) × ${i.quantity} = ${(i.priceEGP * i.quantity).toLocaleString()} EGP`
        )
        .join("\n");

      const fullMessage = [
        `=== YSMED SMART HOME CART ORDER ===`,
        `Customer: ${customerName}`,
        `Phone: ${customerPhone}`,
        customerEmail ? `Email: ${customerEmail}` : null,
        customerAddress ? `Address / City: ${customerAddress}` : null,
        `Include Installation Service: ${includeInstallation ? "YES (Installation Required)" : "NO (Supply Only)"}`,
        notes ? `Customer Notes: ${notes}` : null,
        `\n--- ORDER ITEMS (${totalItems} items) ---`,
        itemsList,
        `\nSubtotal: ${subtotalEGP.toLocaleString()} EGP`,
        totalSavingsEGP > 0 ? `Savings / Discounts: ${totalSavingsEGP.toLocaleString()} EGP` : null,
        `Total Estimated: ${subtotalEGP.toLocaleString()} EGP`,
      ]
        .filter(Boolean)
        .join("\n");

      // Save into Supabase inquiries table
      const { data: userRes } = await supabase.auth.getUser();
      const currentUserId = userRes?.user?.id || null;

      const { error } = await supabase.from("inquiries").insert({
        user_id: currentUserId,
        kind: "smart_home_order",
        sector: "smart-buildings",
        name: customerName,
        email: customerEmail || `${customerPhone.replace(/\D/g, "")}@order.ysmed.com`,
        phone: customerPhone,
        company: customerAddress,
        message: fullMessage,
        status: "new",
      });

      if (error) {
        console.error("Cart order submission error:", error);
      }

      const orderRef = `YSM-${Date.now().toString().slice(-6)}`;
      setOrderSuccess(orderRef);
      clearCart();
      toast.success(
        lang === "ar"
          ? `تم استلام طلبك بنجاح! كود الطلب: ${orderRef}`
          : `Order placed successfully! Reference: ${orderRef}`
      );
    } catch (err) {
      console.error(err);
      toast.error(lang === "ar" ? "تعذر إرسال الطلب، يرجى المحاولة لاحقاً" : "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppOrderLink = () => {
    const itemsSummary = items
      .map(
        (i) =>
          `• ${i.titleEn} (${i.variantLabelEn || ""}) × ${i.quantity}`
      )
      .join("%0A");

    const text = encodeURIComponent(
      `Hello YSMED Smart Homes! I would like to order the following items from the website:%0A%0A${itemsSummary}%0A%0ATotal: ${subtotalEGP.toLocaleString()} EGP%0AName: ${customerName || "Customer"}%0APhone: ${customerPhone || ""}`
    );
    return `https://wa.me/201276477831?text=${text}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={lang === "ar" ? "left" : "right"}
        className="w-full sm:max-w-md bg-background/95 backdrop-blur-2xl border-border/80 p-0 flex flex-col justify-between"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border/40 text-start">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-5 text-primary" />
              <SheetTitle className="text-lg font-black text-foreground">
                {lang === "ar" ? "سلة المشتريات الذكية" : "Smart Cart"}
              </SheetTitle>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                {totalItems}
              </span>
            </div>
            {items.length > 0 && !orderSuccess && (
              <button
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                {lang === "ar" ? "إفراغ السلة" : "Clear all"}
              </button>
            )}
          </div>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            {lang === "ar"
              ? "مراجعة الأجهزة المختارة وطلب التوصيل أو المعاينة والتركيب"
              : "Review your selected devices and place an order or installation request"}
          </SheetDescription>
          {isUserLoggedIn && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === "ar" ? "سلة المشتريات متزامنة سحابياً مع حسابك في Supabase" : "Cart is synced with your Supabase account"}</span>
            </div>
          )}
        </SheetHeader>

        {/* ─── Cart Body ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orderSuccess ? (
            /* Order Success State */
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-4 my-8">
              <CheckCircle2 className="size-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-foreground">
                {lang === "ar" ? "تم تسجيل طلبك بنجاح!" : "Order Received Successfully!"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lang === "ar"
                  ? `شكراً لتواصلك مع YSMED. رقم مرجع طلبك هو [${orderSuccess}]. سيتواصل معك أحد مهندسينا لتأكيد موعد التوصيل أو المعاينة.`
                  : `Thank you for choosing YSMED. Your reference number is [${orderSuccess}]. Our engineering team will contact you shortly.`}
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setOrderSuccess(null);
                    setIsCheckingOut(false);
                    onClose();
                  }}
                  variant="hero"
                  size="sm"
                  className="rounded-xl w-full text-xs font-bold"
                >
                  {lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
                </Button>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 space-y-3">
              <ShoppingCart className="size-12 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-bold text-foreground">
                {lang === "ar" ? "سلة المشتريات فارغة حالياً" : "Your cart is empty"}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {lang === "ar"
                  ? "تصفح المفاتيح الذكية والأقفال والباقات في الكتالوج وأضف ما يناسبك."
                  : "Explore our smart switches, biometric locks, and packages to add items."}
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs mt-2"
              >
                {lang === "ar" ? "تصفح المنتجات" : "Browse Products"}
              </Button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form */
            <form onSubmit={handleOrderSubmit} className="space-y-4 text-start">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {lang === "ar" ? "بيانات تأكيد الطلب" : "Customer Details"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {lang === "ar" ? "رجوع للأجهزة" : "Back to Items"}
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "الاسم بالكامل *" : "Full Name *"}
                </label>
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: م. أحمد مجدي" : "e.g. John Doe"}
                  className="w-full rounded-xl border border-input bg-surface/80 p-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "رقم الهاتف / الواتساب *" : "Phone Number (WhatsApp) *"}
                </label>
                <input
                  required
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-xl border border-input bg-surface/80 p-2.5 text-xs text-foreground outline-none focus:border-primary font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "المدينة / العنوان بالتفصيل" : "City / Delivery Address"}
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: التجمع الخامس، القاهرة الجديدة" : "e.g. New Cairo, Fifth Settlement"}
                  className="w-full rounded-xl border border-input bg-surface/80 p-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Installation toggle */}
              <div className="flex items-center justify-between rounded-xl bg-surface/60 p-3 border border-border/50">
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {lang === "ar" ? "إضافة خدمة التركيب والمعاينة؟" : "Include Professional Installation?"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {lang === "ar" ? "يقوم مهندسونا بتركيب وبرمجة الأجهزة" : "Engineers will install and configure your devices"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeInstallation}
                  onChange={(e) => setIncludeInstallation(e.target.checked)}
                  className="size-4 accent-primary rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === "ar" ? "أي متطلبات خاصة بالتشطيب أو المقاسات..." : "Any special requests or room details..."}
                  className="w-full rounded-xl border border-input bg-surface/80 p-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                variant="hero"
                size="lg"
                className="w-full rounded-xl font-bold shadow-glow text-xs flex items-center justify-center gap-2 mt-2"
              >
                <Send className="size-4" />
                <span>
                  {isSubmitting
                    ? lang === "ar"
                      ? "جاري تسجيل الطلب..."
                      : "Submitting..."
                    : lang === "ar"
                    ? `تأكيد الطلب (${subtotalEGP.toLocaleString()} ج.م)`
                    : `Confirm Order (${subtotalEGP.toLocaleString()} EGP)`}
                </span>
              </Button>

              {/* Direct WhatsApp Quick Order */}
              <a
                href={getWhatsAppOrderLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 p-2.5 text-xs font-bold hover:bg-emerald-500/25 transition-colors"
              >
                <Phone className="size-4" />
                <span>{lang === "ar" ? "تأكيد فوري عبر الواتساب" : "Confirm via WhatsApp"}</span>
              </a>
            </form>
          ) : (
            /* Items List */
            items.map((item) => (
              <div
                key={item.id}
                className="glass rounded-2xl p-3 border border-border/60 bg-surface/40 flex items-center gap-3"
              >
                <img
                  src={item.image}
                  alt={item.titleEn}
                  className="size-16 rounded-xl object-cover bg-surface border border-border/50 shrink-0"
                />

                <div className="flex-1 min-w-0 text-start">
                  <h4 className="font-bold text-xs text-foreground truncate">
                    {lang === "ar" ? item.titleAr : item.titleEn}
                  </h4>

                  {(item.variantLabelEn || item.variantLabelAr) && (
                    <p className="text-[10px] text-primary truncate mt-0.5">
                      {lang === "ar" ? item.variantLabelAr : item.variantLabelEn}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-xs text-foreground">
                      {(item.priceEGP * item.quantity).toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 rounded-lg bg-surface border border-border/60 px-1 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="px-1.5 text-xs font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id, lang)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* ─── Cart Footer ──────────────────────────────────────────────────── */}
        {items.length > 0 && !orderSuccess && !isCheckingOut && (
          <SheetFooter className="p-6 border-t border-border/40 bg-surface/50 space-y-3">
            <div className="space-y-1.5 w-full text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{lang === "ar" ? "المجموع الفرعي:" : "Subtotal:"}</span>
                <span className="font-semibold text-foreground">
                  {originalSubtotalEGP.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>

              {totalSavingsEGP > 0 && (
                <div className="flex items-center justify-between text-gold font-bold">
                  <span>{lang === "ar" ? "قيمة الخصومات:" : "Total Savings:"}</span>
                  <span>-{totalSavingsEGP.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm font-black pt-2 border-t border-border/40">
                <span className="text-foreground">{lang === "ar" ? "الإجمالي التقديري:" : "Total Amount:"}</span>
                <span className="text-base text-primary">
                  {subtotalEGP.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsCheckingOut(true)}
              variant="hero"
              size="lg"
              className="w-full rounded-xl font-bold shadow-glow text-xs flex items-center justify-center gap-2"
            >
              <span>{lang === "ar" ? "متابعة الطلب ومعلومات التوصيل" : "Proceed to Checkout"}</span>
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
