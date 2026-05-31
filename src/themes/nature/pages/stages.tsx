import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { stages, courses } from "@/lib/data";

export const Route = createFileRoute("/stages")({
  head: () => ({ meta: [{ title: "Stages — د/ إيمان عمران" }, { name: "description", content: "Academic stages" }] }),
  component: StagesPage,
});

function StagesPage() {
  const { t, lang } = useI18n();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <PageShell>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black animate-fade-up">{t("stages_title")}</h1>
          <p className="mt-3 text-lg text-muted-foreground animate-fade-up delay-100">{t("stages_sub")}</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          {stages.map((s, i) => {
            const count = courses.filter((c) => c.stageId === s.id).length;
            return (
              <Link
                key={s.id}
                to="/courses"
                style={{ animationDelay: `${i * 0.12}s` }}
                className={`group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${s.color} shadow-card hover:shadow-soft border hover-lift animate-fade-up`}
              >
                <div className="absolute -left-8 -bottom-8 size-40 rounded-full bg-white/40 dark:bg-white/5 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                <div className="relative">
                  <p className="text-sm font-bold text-primary/80">{s.sub[lang]}</p>
                  <h3 className="mt-2 text-2xl font-black">{s.title[lang]}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{count} {lang === "ar" ? "كورس" : "courses"}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-primary font-bold">
                    {t("view_courses")} <Arrow className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
