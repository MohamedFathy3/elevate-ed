import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Star, Users, BookOpen, Calendar } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { courses, stages } from "@/lib/data";

export const Route = createFileRoute("/courses")({
  head: () => ({ meta: [{ title: "All Courses — د/ إيمان عمران" }, { name: "description", content: "Browse all courses." }] }),
  component: CoursesPage,
});

function CoursesPage() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = courses.filter((c) => {
    if (filter !== "all" && c.stageId !== filter) return false;
    if (q && !c.title[lang].toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black animate-fade-up">{t("courses_title")}</h1>
          <p className="mt-3 text-lg text-muted-foreground animate-fade-up delay-100">{t("courses_sub")}</p>

          <div className="mt-8 max-w-xl mx-auto animate-fade-up delay-200">
            <div className="relative flex items-center bg-card border rounded-2xl shadow-card focus-within:ring-2 focus-within:ring-primary/40">
              <Search className="size-4 mx-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("search")}
                className="flex-1 bg-transparent py-3.5 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>{t("filter_all")}</Chip>
            {stages.map((s) => (
              <Chip key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>{s.title[lang]}</Chip>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => (
              <Link
                key={c.id}
                to="/courses/$courseId"
                params={{ courseId: c.id }}
                style={{ animationDelay: `${i * 0.08}s` }}
                className="group bg-card rounded-3xl overflow-hidden shadow-card border flex flex-col hover-lift animate-fade-up"
              >
                <div className="relative h-44 bg-gradient-to-br from-brand to-[oklch(0.72_0.18_60)] grid place-items-center overflow-hidden">
                  <BookOpen className="size-16 text-white/80 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12" />
                  {c.tag && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-black shadow-soft">{c.tag[lang]}</span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-extrabold text-lg leading-snug">{c.title[lang]}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc[lang]}</p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Star className="size-3.5 text-brand" /> {c.rating}</span>
                    <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {c.students}</span>
                    <span className="inline-flex items-center gap-1"><BookOpen className="size-3.5" /> {c.lessons} {t("lessons")}</span>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1"><Calendar className="size-3.5" /> {t("starts")} {c.start[lang]}</p>

                  <div className="mt-auto pt-5 flex items-center justify-between">
                    <span className="text-xl font-black text-primary">
                      {c.price} {lang === "ar" ? "ج.م" : "EGP"}
                      {c.oldPrice && <span className="ms-2 text-sm font-bold text-muted-foreground line-through">{c.oldPrice}</span>}
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-brand text-brand-foreground text-sm font-bold group-hover:bg-primary group-hover:text-primary-foreground transition">
                      {t("details")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">— {lang === "ar" ? "مفيش كورسات بنفس الفلتر" : "No courses match this filter"} —</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Chip({ active, children, ...rest }: { active?: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`px-5 py-2 rounded-full text-sm font-bold border transition hover-lift ${
        active ? "bg-primary text-primary-foreground border-primary shadow-soft" : "bg-card hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
