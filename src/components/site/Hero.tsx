import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { Zap, ArrowRight, ArrowLeft, Lightbulb, Atom, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { dir, lang } = useLang();
  const { teacher, slug, pick } = useTeacher();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const home = teacher.website.home;

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden gradient-hero-bg">
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.08) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[5%] w-32 h-32 rounded-full border-2 border-primary/15 hidden md:block"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] right-[3%] w-24 h-24 hidden md:block"
      >
        <Atom className="w-full h-full text-primary/15" strokeWidth={1} />
      </motion.div>

      <div className="container-tight relative grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 text-primary font-semibold text-sm"
          >
            <Sparkles className="w-4 h-4" fill="currentColor" />
            {lang === "ar" ? "أهلاً بك في" : "Welcome to"}
          </motion.div>

          <h1 className="font-display font-black tracking-tight text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="block text-gradient-rainbow"
            >
              {pick(home.title, home.title_ar)}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 text-lg md:text-xl text-foreground/70 leading-relaxed max-w-xl"
          >
            {pick(home.sub_title, home.sub_title_ar)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 p-5 md:p-6 rounded-3xl surface-card border border-border shadow-soft max-w-xl"
          >
            <div className="flex gap-4">
              <div className="shrink-0 w-9 h-9 rounded-full gradient-accent grid place-items-center shadow-soft">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                {pick(home.description, home.description_ar)}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to={`/${slug}/register`}
              className="group inline-flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 rounded-2xl gradient-accent text-white font-bold text-base md:text-lg shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-5 h-5" fill="white" />
              <span>{lang === "ar" ? "سجّل دلوقتي" : "Register Now"}</span>
              <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              to={`/${slug}/courses`}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-card border border-border font-semibold hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              {lang === "ar" ? "تصفح الكورسات" : "Browse Courses"}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative aspect-square max-w-lg mx-auto w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-primary/25"
          >
            <span className="absolute -top-2 left-1/2 w-4 h-4 rounded-full gradient-accent shadow-glow" />
            <span className="absolute top-1/2 -right-2 w-3 h-3 rounded-full bg-[hsl(var(--cyan))] shadow-glow" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border-2 border-[hsl(var(--pink))]/30"
          >
            <span className="absolute -bottom-1.5 left-1/3 w-3 h-3 rounded-full bg-[hsl(var(--pink))] shadow-glow" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute inset-12 rounded-full border border-primary/15"
          />

          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-16 rounded-full gradient-primary blur-2xl"
          />

          <div className="absolute inset-16 rounded-full bg-card shadow-glow overflow-hidden">
            <img
              src={home.imageUrl}
              alt={pick(teacher.name, teacher.name_ar)}
              className="w-full h-full object-cover"
            />
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 right-2 md:right-0 w-16 h-16 rounded-2xl bg-card shadow-card grid place-items-center"
          >
            <Zap className="w-7 h-7 text-accent" fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-12 left-2 md:left-0 w-16 h-16 rounded-2xl bg-card shadow-card grid place-items-center"
          >
            <Lightbulb className="w-7 h-7 text-amber-400" fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 left-0 md:-left-4 w-14 h-14 rounded-2xl gradient-primary shadow-card grid place-items-center"
          >
            <Atom className="w-7 h-7 text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
