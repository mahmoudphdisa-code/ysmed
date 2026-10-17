import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Eye,
  Filter,
  Grid,
  Layers,
  List,
  MapPin,
  Search,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { solutions } from "@/data/solutions";
import { initialProjects, type PortfolioProject } from "@/data/portfolio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function CompanyProfileSection() {
  const { t, tl, lang } = useI18n();
  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);

  // Fetch visible portfolio projects from Supabase
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio_projects")
          .select("*")
          .eq("is_hidden", false)
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0 && isMounted) {
          setProjects(data as PortfolioProject[]);
        }
      } catch (err) {
        // Fallback gracefully to initialProjects if table not yet created
        console.warn("Using default portfolio projects:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    // Listen for realtime changes on portfolio_projects
    const channel = supabase
      .channel("public-portfolio-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "portfolio_projects" },
        async () => {
          const { data } = await supabase
            .from("portfolio_projects")
            .select("*")
            .eq("is_hidden", false)
            .order("order_index", { ascending: true });
          if (data && data.length > 0 && isMounted) {
            setProjects(data as PortfolioProject[]);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedSector !== "all" && p.sector !== selectedSector) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          p.title_en.toLowerCase().includes(q) ||
          p.title_ar.toLowerCase().includes(q) ||
          p.description_en.toLowerCase().includes(q) ||
          p.description_ar.toLowerCase().includes(q) ||
          (p.client_name && p.client_name.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [projects, selectedSector, search]);

  const getSector = (slug: string | null | undefined) => {
    if (!slug) return null;
    return solutions.find((s) => s.slug === slug);
  };

  return (
    <Section id="company-profile" className="scroll-mt-16">
      {/* ─── Section Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold text-gold mb-3 shadow-gold">
            <Sparkles className="size-3.5" />
            <span>{t("companyProfile")}</span>
            <span className="opacity-60">•</span>
            <span>{lang === "ar" ? "سابقة أعمالنا الهندسية" : "Engineered Track Record"}</span>
          </div>

          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl text-foreground">
            {t("companyProfile")}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base max-w-2xl leading-relaxed">
            {t("companyProfileSubtitle")}
          </p>
        </div>

        {/* View Mode Switcher (Table Matrix vs Cards Showcase) */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <div className="flex items-center rounded-2xl border border-border/80 bg-surface/60 p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="size-3.5" />
              <span>{t("tabularView")}</span>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "cards"
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="size-3.5" />
              <span>{t("cardsView")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Filter & Search Bar ────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-border/60 bg-surface/40 p-3 sm:p-4">
        {/* Sector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedSector("all")}
            className={`rounded-full border px-3 py-1.5 font-medium transition-all ${
              selectedSector === "all"
                ? "border-primary bg-primary/20 text-primary font-bold shadow-glow"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            {t("all")} ({projects.length})
          </button>

          {solutions.slice(0, 5).map((s) => {
            const count = projects.filter((p) => p.sector === s.slug).length;
            if (count === 0 && selectedSector !== s.slug) return null;
            return (
              <button
                key={s.slug}
                onClick={() => setSelectedSector(s.slug)}
                className={`rounded-full border px-3 py-1.5 font-medium transition-all ${
                  selectedSector === s.slug
                    ? "border-gold bg-gold/20 text-gold font-bold shadow-gold"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                {tl(s.title)} ({count})
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[220px] sm:w-64">
          <Search className="absolute start-3 top-2.5 size-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "ar" ? "ابحث في سابقة الأعمال..." : "Search implemented projects..."}
            className="w-full rounded-2xl border border-input bg-surface/80 ps-9 pe-8 py-2 text-xs text-foreground outline-none focus:border-primary transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute end-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ─── TABULAR MATRIX VIEW ────────────────────────────────────────── */}
      {viewMode === "table" ? (
        <div className="mt-6 glass overflow-hidden rounded-3xl border border-border/80 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="border-b border-border bg-surface/90 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4 text-start">{lang === "ar" ? "المشروع / المعاينة" : "Project / Preview"}</th>
                  <th className="p-4 text-start">{t("client")} & {t("location")}</th>
                  <th className="p-4 text-start hidden md:table-cell">{t("scope")}</th>
                  <th className="p-4 text-start">{t("status")}</th>
                  <th className="p-4 text-end">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-muted-foreground">
                      <Layers className="size-8 mx-auto mb-2 opacity-30 text-primary" />
                      <p>{lang === "ar" ? "لا توجد مشاريع مطابقة لبحثك." : "No projects match your search."}</p>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => {
                    const sector = getSector(p.sector);
                    const SectorIcon = sector?.icon || Building2;
                    const projectTitle = lang === "ar" ? p.title_ar : p.title_en;
                    const projectDesc = lang === "ar" ? p.description_ar : p.description_en;

                    return (
                      <tr
                        key={p.id}
                        className="group transition-colors hover:bg-surface/50 cursor-pointer"
                        onClick={() => setActiveProject(p)}
                      >
                        {/* 1. Preview & Title */}
                        <td className="p-4">
                          <div className="flex items-center gap-3.5">
                            <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-md group-hover:border-primary/60 transition-colors">
                              <img
                                src={p.image_url}
                                alt={projectTitle}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="size-4 text-white drop-shadow" />
                              </div>
                            </div>

                            <div className="min-w-0">
                              <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors leading-snug">
                                {projectTitle}
                              </p>
                              {sector && (
                                <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                  <SectorIcon className="size-3" />
                                  {tl(sector.title)}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Client & Location */}
                        <td className="p-4 text-xs text-muted-foreground">
                          {p.client_name && (
                            <p className="font-semibold text-foreground flex items-center gap-1 truncate max-w-[180px]">
                              <Building2 className="size-3 text-gold shrink-0" />
                              {p.client_name}
                            </p>
                          )}
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                            {p.location && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="size-3 text-muted-foreground" />
                                {p.location}
                              </span>
                            )}
                            {p.year && (
                              <span className="flex items-center gap-0.5 rounded bg-surface px-1.5 py-0.2 font-mono">
                                <Calendar className="size-3 text-muted-foreground" />
                                {p.year}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 3. Scope & Description */}
                        <td className="p-4 hidden md:table-cell text-xs text-muted-foreground max-w-sm">
                          <p className="line-clamp-2 leading-relaxed">{projectDesc}</p>
                        </td>

                        {/* 4. Status Badge */}
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="size-3.5" />
                            {t("statusCompleted")}
                          </span>
                        </td>

                        {/* 5. Actions */}
                        <td className="p-4 text-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveProject(p);
                            }}
                            className="rounded-xl text-xs flex items-center gap-1 ms-auto"
                          >
                            <Eye className="size-3.5" />
                            <span className="hidden sm:inline">{t("viewDetails")}</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ─── CARDS SHOWCASE VIEW ────────────────────────────────────────── */
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => {
            const sector = getSector(p.sector);
            const SectorIcon = sector?.icon || Building2;
            const projectTitle = lang === "ar" ? p.title_ar : p.title_en;
            const projectDesc = lang === "ar" ? p.description_ar : p.description_en;

            return (
              <div
                key={p.id}
                onClick={() => setActiveProject(p)}
                className="glass group flex flex-col overflow-hidden rounded-3xl border border-border/70 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow cursor-pointer"
              >
                {/* Image Cover */}
                <div className="relative h-48 w-full overflow-hidden bg-surface">
                  <img
                    src={p.image_url}
                    alt={projectTitle}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="bg-fade-up absolute inset-0" />

                  {/* Badges on cover */}
                  <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md">
                      <CheckCircle2 className="size-3" />
                      {t("statusCompleted")}
                    </span>

                    {p.year && (
                      <span className="rounded-full bg-surface/80 backdrop-blur-md px-2 py-0.5 text-[11px] font-mono text-foreground border border-border/50">
                        {p.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {sector && (
                    <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-2">
                      <SectorIcon className="size-3.5" />
                      <span>{tl(sector.title)}</span>
                    </div>
                  )}

                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                    {projectTitle}
                  </h3>

                  <p className="mt-2.5 flex-1 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {projectDesc}
                  </p>

                  {/* Client & Location footer */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate font-medium text-foreground">
                      {p.client_name || p.location || "YSMED Delivered"}
                    </span>

                    <span className="inline-flex items-center gap-1 text-primary font-semibold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                      {t("viewDetails")} →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── PROJECT DETAILS MODAL ────────────────────────────────────────── */}
      <Dialog open={!!activeProject} onOpenChange={(open) => !open && setActiveProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass glow-border rounded-3xl border-border/80 p-6">
          {activeProject && (
            <div className="space-y-5">
              {/* Photo & Badges */}
              <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-border/80 bg-surface">
                <img
                  src={activeProject.image_url}
                  alt={lang === "ar" ? activeProject.title_ar : activeProject.title_en}
                  className="h-full w-full object-cover"
                />
                <div className="bg-fade-up absolute inset-0" />
                <div className="absolute bottom-3 start-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    <CheckCircle2 className="size-3.5" />
                    {t("statusCompleted")}
                  </span>
                  {activeProject.year && (
                    <span className="rounded-full bg-surface/90 px-2.5 py-1 text-xs font-mono font-bold text-foreground border border-border">
                      {activeProject.year}
                    </span>
                  )}
                </div>
              </div>

              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  {getSector(activeProject.sector) && (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                      {tl(getSector(activeProject.sector)!.title)}
                    </span>
                  )}
                  {activeProject.location && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3 text-gold" />
                      {activeProject.location}
                    </span>
                  )}
                </div>

                <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
                  {lang === "ar" ? activeProject.title_ar : activeProject.title_en}
                </DialogTitle>
                {activeProject.client_name && (
                  <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Building2 className="size-3 text-gold" />
                    {t("client")}: <strong className="text-foreground">{activeProject.client_name}</strong>
                  </DialogDescription>
                )}
              </DialogHeader>

              {/* Description Body */}
              <div className="rounded-2xl bg-surface/60 p-4 border border-border/60 text-sm text-foreground/95 leading-relaxed space-y-3">
                <p className="whitespace-pre-wrap">
                  {lang === "ar" ? activeProject.description_ar : activeProject.description_en}
                </p>

                {/* Show other language text if available */}
                <div className="pt-3 border-t border-border/40 text-xs text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground/80 mb-1">
                    {lang === "ar" ? "الوصف بالإنجليزية:" : "Arabic Summary:"}
                  </p>
                  <p className="italic">
                    {lang === "ar" ? activeProject.description_en : activeProject.description_ar}
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <DialogFooter className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
                <Button asChild variant="gold" className="rounded-xl shadow-glow">
                  <Link to="/request">
                    <Sparkles className="size-4" />
                    {t("requestSimilar")}
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveProject(null)}
                  className="rounded-xl text-xs"
                >
                  {t("close")}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
