import { useEffect, useState } from "react";
import logo from "@/assets/ysmed-logo.png";
import { useI18n } from "@/lib/i18n";

export function Splash() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("ysmed-splash")) return;
    sessionStorage.setItem("ysmed-splash", "1");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShow(true);
    const a = setTimeout(() => setLeaving(true), reduced ? 400 : 2100);
    const b = setTimeout(() => setShow(false), reduced ? 700 : 2600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  if (!show) return null;
  const close = () => { setLeaving(true); setTimeout(() => setShow(false), 400); };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`}>
      <div className="circuit-grid absolute inset-0" />
      <div className="relative overflow-hidden rounded-2xl p-4">
        <img src={logo} alt="YSMED" className="animate-rise animate-pulse-glow h-auto w-56 sm:w-72" />
        <span className="animate-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>
      <p className="animate-rise relative mt-6 font-display text-xl font-semibold [animation-delay:0.9s]">YSMED for Innovative Solutions</p>
      <p className="animate-rise relative mt-1 text-sm text-gold [animation-delay:1.2s]">{t("magdy")}</p>
      <button onClick={close} className="absolute bottom-8 end-8 text-sm text-muted-foreground hover:text-primary">{t("skip")} →</button>
    </div>
  );
}
