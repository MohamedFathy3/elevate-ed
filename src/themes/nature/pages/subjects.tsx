import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { subjects, courses } from "@/lib/data";

export const Route = createFileRoute("/subjects")({
  head: () => ({ meta: [{ title: "Subjects — د/ إيمان عمران" }, { name: "description", content: "All subjects" }] }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const { t, lang } = useI18n();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <PageShell>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black animate-fade-up">{t("subjects_title")}</h1>
          <p className="mt-3 text-lg text-muted-foreground animate-fade-up delay-100">{t("subjects_sub")}</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((s, i) => {
            const count = courses.filter((c) => c.subjectId === s.id).length;
            return (
              <Link
                key={s.id}
                to="/courses"
                style={{ animationDelay: `${i * 0.1}s` }}
                className="group bg-card rounded-3xl p-6 shadow-card border hover-lift animate-fade-up"
              >
                <div className="size-16 rounded-2xl bg-brand/20 grid place-items-center text-4xl mb-4 group-hover:rotate-6 transition-transform duration-500">
                  {s.icon}
                </div>
                <h3 className="font-extrabold text-xl">{s.title[lang]}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc[lang]}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{count} {lang === "ar" ? "كورس" : "courses"}</span>
                  <Arrow className="size-4 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
