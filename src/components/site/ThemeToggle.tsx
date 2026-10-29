import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const label = isDark ? t("switchToLight") : t("switchToDark");

  const buttonElement = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-2 text-muted-foreground",
        "transition-colors hover:bg-surface hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-95 cursor-pointer select-none",
        className
      )}
    >
      <div className="relative size-5 flex items-center justify-center">
        {/* Sun icon for switching to Light Mode (visible in Dark Mode) */}
        <Sun
          className={cn(
            "size-5 transition-all duration-300 ease-spring text-amber-400 absolute",
            isDark
              ? "rotate-0 scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              : "-rotate-90 scale-0 opacity-0"
          )}
          aria-hidden="true"
        />
        {/* Moon icon for switching to Dark Mode (visible in Light Mode) */}
        <Moon
          className={cn(
            "size-5 transition-all duration-300 ease-spring text-primary absolute",
            !isDark
              ? "rotate-0 scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(8,145,178,0.5)]"
              : "rotate-90 scale-0 opacity-0"
          )}
          aria-hidden="true"
        />
      </div>
      {showLabel && (
        <span className="ms-2 text-sm font-medium">
          {isDark ? t("lightMode") : t("darkMode")}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </button>
  );

  // If on mobile or tooltip not needed, return the accessible button directly
  if (showLabel) {
    return buttonElement;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {buttonElement}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

