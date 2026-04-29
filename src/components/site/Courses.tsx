import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight, ArrowLeft, Clock, BookOpen, Atom, Zap } from "lucide-react";

interface Course {
  grade: string;
  title: string;
  body: string;
  price: string;
  color: string;
  icon: typeof Atom;
}

const CourseCard = ({ c, index }: { c: Course; index: number }) => {
  const { t, dir } = useLang();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const Icon = c.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -8 }}
      className="group relative bg-card rounded-3xl p-6 shadow-card hover:shadow-elegant transition-shadow duration-500 overflow-hidden"
    >
      {/* Top decorative panel */}
      <div className={`relative -mx-6 -mt-6 mb-5 h-32 ${c.color} overflow-hidden`}>
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

        {/* Top tags */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex gap-2">
          <span className="px-3 py-1 rounded-full bg-white/95 text-foreground text-xs font-bold">
            {c.grade}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-semibold inline-flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {t("courses.individual")}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-lg leading-snug min-h-[3.5rem]">{c.title}</h3>
      <p className="mt-2 text-sm text-foreground/60 leading-relaxed line-clamp-2 min-h-[2.5rem]">
        {c.body}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-foreground/60">
        <Clock className="w-3.5 h-3.5" />
        {t("courses.access")}
      </div>

      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-black text-foreground">{c.price}</div>
          <div className="text-[10px] text-foreground/50 font-medium">EGP</div>
        </div>

        <button className="group/btn inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl gradient-accent text-white font-semibold text-sm shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95">
          {t("courses.cta")}
          <Arrow className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5" />
        </button>
      </div>

      {/* Subject ribbon */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold inline-flex items-center gap-1 shadow-soft">
        <Atom className="w-3 h-3 text-primary" />
        {t("courses.subject")}
      </div>
    </motion.article>
  );
};

export const Courses = () => {
  const { t } = useLang();

  const courses: Course[] = [
    { grade: t("c1.grade"), title: t("c1.title"), body: t("c1.body"), price: "70.00", color: "gradient-primary", icon: Atom },
    { grade: t("c2.grade"), title: t("c2.title"), body: t("c2.body"), price: "70.00", color: "bg-gradient-to-br from-orange-400 to-pink-500", icon: Zap },
    { grade: t("c3.grade"), title: t("c3.title"), body: t("c3.body"), price: "85.00", color: "bg-gradient-to-br from-blue-500 to-indigo-600", icon: BookOpen },
    { grade: t("c4.grade"), title: t("c4.title"), body: t("c4.body"), price: "75.00", color: "bg-gradient-to-br from-emerald-400 to-teal-600", icon: Atom },
  ];

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
            {t("courses.eyebrow")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance leading-[1.1]"
          >
            {t("courses.title")}
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {courses.map((c, i) => (
            <CourseCard key={i} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
