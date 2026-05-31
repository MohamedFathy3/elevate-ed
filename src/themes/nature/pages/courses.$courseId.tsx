import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Calendar, Clock, Users, Star, BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { courses, stages } from "@/lib/data";
import heroTeacher from "@/assets/hero-teacher.png";

export const Route = createFileRoute("/courses/$courseId")({
  head: ({ params }) => ({
    meta: [
      { title: `${courses.find((c) => c.id === params.courseId)?.title.en ?? "Course"} — د/ إيمان عمران` },
      { name: "description", content: courses.find((c) => c.id === params.courseId)?.desc.en ?? "Course details" },
    ],
  }),
  loader: ({ params }) => {
    const c = courses.find((x) => x.id === params.courseId);
    if (!c) throw notFound();
    return c;
  },
  component: CourseDetailsPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-black">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block text-primary font-bold underline">Back to courses</Link>
      </div>
    </PageShell>
  ),
});

function CourseDetailsPage() {
  const c = Route.useLoaderData();
  const { t, lang } = useI18n();
  const stage = stages.find((s) => s.id === c.stageId);
  const ArrowBack = lang === "ar" ? ArrowLeft : ArrowRight;

  const learn = lang === "ar"
    ? ["فهم عميق للمفاهيم الأساسية", "تطبيقات عملية على كل درس", "مراجعات نهائية شاملة", "حل امتحانات سنوات سابقة"]
    : ["Deep understanding of core concepts", "Hands-on practice on every lesson", "Comprehensive final reviews", "Past exam papers solved"];

  const curriculum = Array.from({ length: Math.min(c.lessons, 8) }).map((_, i) => ({
    n: i + 1,
    title: lang === "ar" ? `الحصة ${i + 1}` : `Lesson ${i + 1}`,
    duration: `${30 + (i % 4) * 10} min`,
  }));

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition mb-6">
            <ArrowBack className="size-4" />
            {t("back")}
          </Link>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
            <div className="animate-fade-up">
              {stage && (
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{stage.title[lang]}</span>
              )}
              <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight">{c.title[lang]}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{c.desc[lang]}</p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <Stat icon={<Star className="size-4 text-brand" />} label={`${c.rating} ${t("rating")}`} />
                <Stat icon={<Users className="size-4" />} label={`${c.students} ${t("students")}`} />
                <Stat icon={<BookOpen className="size-4" />} label={`${c.lessons} ${t("lessons")}`} />
                <Stat icon={<Calendar className="size-4" />} label={`${t("starts")} ${c.start[lang]}`} />
                <Stat icon={<Clock className="size-4" />} label={`${t("ends")} ${c.end[lang]}`} />
              </div>
            </div>

            <div className="bg-card rounded-3xl shadow-soft border overflow-hidden animate-scale-in">
              <div className="relative h-56 bg-gradient-to-br from-brand to-[oklch(0.72_0.18_60)] grid place-items-center overflow-hidden">
                <img src={heroTeacher} alt="" className="h-full object-cover animate-float" />
                {c.tag && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-black shadow-soft">{c.tag[lang]}</span>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-primary">
                    {c.price} {lang === "ar" ? "ج.م" : "EGP"}
                  </span>
                  {c.oldPrice && <span className="text-base font-bold text-muted-foreground line-through">{c.oldPrice}</span>}
                </div>
                <button className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-extrabold shadow-soft hover-lift">{t("enroll")}</button>
                <button className="w-full py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-bold border hover-lift">{t("details")}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1.6fr_1fr] gap-10">
          <div className="space-y-12">
            <div className="animate-fade-up">
              <h2 className="text-2xl font-black mb-3">{t("about_course")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {lang === "ar"
                  ? "كورس متكامل بيغطي كل أجزاء المنهج بشرح بسيط وأمثلة من الواقع، مع متابعة دورية وامتحانات لقياس مستواك خطوة بخطوة. هتلاقي كل اللي محتاجه عشان تتفوق."
                  : "An end-to-end course covering the full syllabus with simple explanations and real-world examples, with regular check-ins and assessments so you progress with confidence."}
              </p>
            </div>

            <div className="animate-fade-up delay-100">
              <h2 className="text-2xl font-black mb-4">{t("what_youll_learn")}</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {learn.map((l) => (
                  <li key={l} className="flex items-start gap-3 bg-card rounded-2xl p-4 border shadow-card hover-lift">
                    <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-fade-up delay-200">
              <h2 className="text-2xl font-black mb-4">{t("curriculum")}</h2>
              <ol className="space-y-2">
                {curriculum.map((l, i) => (
                  <li
                    key={l.n}
                    style={{ animationDelay: `${i * 0.05}s` }}
                    className="flex items-center gap-4 bg-card border rounded-2xl px-4 py-3 hover-lift animate-fade-up"
                  >
                    <span className="size-9 rounded-full bg-primary/10 text-primary font-black grid place-items-center text-sm">{l.n}</span>
                    <span className="flex-1 font-bold">{l.title}</span>
                    <span className="text-xs text-muted-foreground">{l.duration}</span>
                    <PlayCircle className="size-5 text-primary" />
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-card rounded-3xl border shadow-card p-6 animate-fade-up">
              <h3 className="font-black mb-3">{t("instructor")}</h3>
              <div className="flex items-center gap-3">
                <img src={heroTeacher} alt="" className="size-16 rounded-full object-cover border-2 border-brand" />
                <div>
                  <p className="font-extrabold">{t("brand")}</p>
                  <p className="text-xs text-muted-foreground">Integrated Science</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-card border text-foreground/80 font-bold">
      {icon} {label}
    </span>
  );
}
