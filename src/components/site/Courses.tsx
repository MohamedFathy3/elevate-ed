import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { ArrowRight, ArrowLeft, Clock, BookOpen, Atom, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseItem } from "@/data/teachers";

const ICONS = [Atom, Zap, BookOpen, Sparkles];
const COLORS = [
  "gradient-primary",
  "bg-gradient-to-br from-orange-400 to-pink-500",
  "bg-gradient-to-br from-blue-500 to-indigo-600",
  "bg-gradient-to-br from-emerald-400 to-teal-600",
  "bg-gradient-to-br from-purple-500 to-fuchsia-600",
  "bg-gradient-to-br from-rose-400 to-red-500",
];

export const CourseCard = ({ c, index, slug }: { c: CourseItem; index: number; slug: string }) => {
  const { dir, lang } = useLang();
  const { pick } = useTeacher();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const Icon = ICONS[index % ICONS.length];
  const color = COLORS[index % COLORS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -8 }}
      className="group relative bg-card rounded-3xl p-6 shadow-card hover:shadow-elegant transition-shadow duration-500 overflow-hidden flex flex-col"
    >
      <div className={`relative -mx-6 -mt-6 mb-5 h-32 ${color} overflow-hidden`}>
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "30px 30px, 40px 40px",
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -right-6 -top-6 opacity-30"
        >
          <Icon className="w-32 h-32 text-white" strokeWidth={1} />
        </motion.div>

        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex gap-2">
          <span className="px-3 py-1 rounded-full bg-white/95 text-foreground text-xs font-bold">
            {pick(c.level, c.level_ar)}
          </span>
        </div>
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold inline-flex items-center gap-1 shadow-soft">
          <Atom className="w-3 h-3 text-primary" />
          {pick(c.subject, c.subject_ar)}
        </div>
      </div>

      <h3 className="font-bold text-lg leading-snug min-h-[3.5rem]">{pick(c.title, c.title_ar)}</h3>
      <p className="mt-2 text-sm text-foreground/60 leading-relaxed line-clamp-2 min-h-[2.5rem]">
        {pick(c.description, c.description_ar)}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-foreground/60">
        <Clock className="w-3.5 h-3.5" />
        {lang === "ar" ? `وصول ${c.duration_days} يوم` : `${c.duration_days} days access`}
      </div>

      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between gap-3 mt-auto">
        <div>
          <div className="text-2xl font-black text-foreground">{c.price}</div>
          <div className="text-[10px] text-foreground/50 font-medium">EGP</div>
        </div>

        <Link
          to={`/${slug}/courses/${c.id}`}
          className="group/btn inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl gradient-accent text-white font-semibold text-sm shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95"
        >
          {lang === "ar" ? "اعرف التفاصيل" : "View details"}
          <Arrow className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
};

export const Courses = ({ limit }: { limit?: number }) => {
  const { lang, dir } = useLang();
  const { teacher, slug } = useTeacher();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const courses = limit ? teacher.website.courses.slice(0, limit) : teacher.website.courses;

  return (
    <section id="courses" className="py-24 md:py-32 relative">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-5"
          >
            <BookOpen className="w-4 h-4" />
            {lang === "ar" ? "أحدث الكورسات" : "Latest Courses"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance leading-[1.1]"
          >
            {lang === "ar" ? "اكتشف محتوى يساعدك تتفوق" : "Discover content that helps you excel"}
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {courses.map((c, i) => (
            <CourseCard key={c.id} c={c} index={i} slug={slug} />
          ))}
        </div>

        {limit && teacher.website.courses.length > limit && (
          <div className="mt-12 text-center">
            <Link
              to={`/${slug}/courses`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-primary text-white font-semibold shadow-soft hover:shadow-glow transition-all hover:scale-105"
            >
              {lang === "ar" ? "كل الكورسات" : "View all courses"}
              <Arrow className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
