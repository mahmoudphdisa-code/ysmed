import { useEffect, useState } from "react";
import logo from "@/assets/ysmed-logo.png";
import { useI18n } from "@/lib/i18n";

// Module-level: survives React Strict Mode's intentional unmount/remount cycle.
// Stores when the splash animation started so we can reschedule timers after cleanup.
let _startedAt: number | null = null;

const FADE_MS = 2200;
const REMOVE_MS = 2750;
const FADE_MS_REDUCED = 400;
const REMOVE_MS_REDUCED = 700;

export function Splash() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeMs = reduced ? FADE_MS_REDUCED : FADE_MS;
    const removeMs = reduced ? REMOVE_MS_REDUCED : REMOVE_MS;
    const now = Date.now();

    if (_startedAt === null) {
      // First-ever call — check if this session already saw the splash
      if (sessionStorage.getItem("ysmed-splash")) return;
      // Mark session + record start time
      sessionStorage.setItem("ysmed-splash", "1");
      _startedAt = now;
      setShow(true);
    }
    // _startedAt is set (either fresh or after Strict Mode cleanup/remount):
    // Reschedule with remaining time so timers survive the cleanup cycle.
    const elapsed = now - _startedAt;
    const fadeIn = Math.max(0, fadeMs - elapsed);
    const removeIn = Math.max(0, removeMs - elapsed);

    const a = setTimeout(() => setLeaving(true), fadeIn);
    const b = setTimeout(() => setShow(false), removeIn);

    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  if (!show) return null;

  const close = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => setShow(false), 500);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="circuit-grid absolute inset-0" />
      <div className="relative overflow-hidden rounded-2xl p-4">
        <img
          src={logo}
          alt="YSMED"
          className="animate-rise animate-pulse-glow h-auto w-56 sm:w-72"
        />
        <span className="animate-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>
      <p className="animate-rise relative mt-6 font-display text-xl font-semibold [animation-delay:0.9s]">
        YSMED for Innovative Solutions
      </p>
      <p className="animate-rise relative mt-1 text-sm text-gold [animation-delay:1.2s]">
        {t("magdy")}
      </p>
      <button
        onClick={close}
        className="absolute bottom-8 end-8 text-sm text-muted-foreground hover:text-primary"
      >
        {t("skip")} →
      </button>
    </div>
  );
}
