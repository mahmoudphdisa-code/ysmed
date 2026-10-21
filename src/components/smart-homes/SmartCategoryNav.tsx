import {
  Sparkles,
  ToggleLeft,
  Radio,
  Lock,
  Tablet,
  Lightbulb,
  Blinds,
  ShieldAlert,
  Speaker,
  ThermometerSnowflake,
  Zap,
} from "lucide-react";
import { smartCategories } from "@/data/smartHomesData";
import { useI18n } from "@/lib/i18n";

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  ToggleLeft,
  Radio,
  Lock,
  Tablet,
  Lightbulb,
  Blinds,
  ShieldAlert,
  Speaker,
  ThermometerSnowflake,
  Zap,
};

interface SmartCategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function SmartCategoryNav({ selectedCategory, onSelectCategory }: SmartCategoryNavProps) {
  const { lang, tl } = useI18n();

  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max pb-2">
        {smartCategories.map((cat) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all border ${
                isSelected
                  ? "bg-primary text-background border-primary shadow-glow scale-105"
                  : "bg-surface/70 border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-surface"
              }`}
            >
              <Icon className={`size-4 shrink-0 transition-transform ${isSelected ? "text-background scale-110" : "text-primary"}`} />
              <span>{tl(cat.name)}</span>
              {cat.id !== "all" && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                    isSelected ? "bg-background/25 text-background" : "bg-surface border border-border/60 text-muted-foreground"
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
