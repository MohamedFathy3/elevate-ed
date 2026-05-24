import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { Clock, Atom, ArrowLeft, ArrowRight, CheckCircle2, PlayCircle, ShoppingCart } from "lucide-react";

const CourseDetail = () => {
  const { lang, dir } = useLang();
  const { teacher, slug, pick } = useTeacher();
  const { courseId } = useParams();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const course = teacher.website.courses.find((c) => String(c.id) === courseId);
  if (!course) return <Navigate to={`/${slug}/courses`} replace />;

  const highlights =
    lang === "ar"
      ? ["شرح كامل من الصفر", "تمارين وامتحانات", "دعم مباشر من المستر", "وصول لمدة 30 يوم"]
      : ["Full from-scratch explanation", "Quizzes & exams included", "Direct teacher support", "30 days access"];

  return (
    <section className="pt-36 md:pt-40 pb-24">
      <div className="container-tight">
        <Link
          to={`/${slug}/courses`}
          className="inline-flex items-center gap-2 text-sm text-foreground/65 hover:text-primary mb-8"
        >
          <Arrow className="w-4 h-4 rotate-180 rtl:rotate-0" />
          {lang === "ar" ? "كل الكورسات" : "All courses"}
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-elegant bg-secondary">
              <img src={course.imageUrl} alt={pick(course.title, course.title_ar)} className="w-full h-full object-cover" />
              <button className="absolute inset-0 grid place-items-center bg-black/30 hover:bg-black/40 transition">
                <span className="w-20 h-20 rounded-full bg-white/95 grid place-items-center shadow-glow">
                  <PlayCircle className="w-10 h-10 text-primary" />
                </span>
              </button>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{pick(course.level, course.level_ar)}</span>
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold inline-flex items-center gap-1">
                  <Atom className="w-3 h-3" />
                  {pick(course.subject, course.subject_ar)}
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-bold inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lang === "ar" ? `${course.duration_days} يوم وصول` : `${course.duration_days} days access`}
                </span>
              </div>

              <h1 className="font-display font-black text-3xl md:text-5xl tracking-tight">
                {pick(course.title, course.title_ar)}
              </h1>
              <p className="mt-4 text-lg text-foreground/70 leading-relaxed">
                {pick(course.description, course.description_ar)}
              </p>

              <h2 className="mt-10 font-bold text-xl mb-4">{lang === "ar" ? "اللي هتاخده" : "What you'll get"}</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm">{h}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-28 bg-card rounded-3xl p-7 shadow-card border border-border">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-gradient">{course.price}</span>
                <span className="text-sm text-foreground/60 font-semibold">EGP</span>
              </div>
              <p className="text-sm text-foreground/60 mb-6">{lang === "ar" ? "دفعة واحدة" : "One-time payment"}</p>

              <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl gradient-primary text-white font-bold shadow-soft hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95">
                <ShoppingCart className="w-5 h-5" />
                {lang === "ar" ? "اشتري الكورس" : "Enroll now"}
              </button>

              <Link
                to={`/${slug}/login`}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-sm font-semibold hover:bg-primary/10 transition"
              >
                {lang === "ar" ? "عندك حساب؟ سجّل دخول" : "Already have an account? Login"}
              </Link>

              <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">{lang === "ar" ? "المرحلة" : "Stage"}</span>
                  <span className="font-semibold">{pick(course.level, course.level_ar)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">{lang === "ar" ? "المادة" : "Subject"}</span>
                  <span className="font-semibold">{pick(course.subject, course.subject_ar)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">{lang === "ar" ? "المدة" : "Duration"}</span>
                  <span className="font-semibold">
                    {course.duration_days} {lang === "ar" ? "يوم" : "days"}
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default CourseDetail;
