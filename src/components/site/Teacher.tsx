import { motion } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { GraduationCap, Users, BookOpen, Award, Trophy } from "lucide-react";
import teacherImg from "@/assets/teacher.jpg";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        const el = ref.current;
        if (!el) return;
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * value).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
    >
      0{suffix}
    </motion.span>
  );
};

export const Teacher = () => {
  const { t } = useLang();

  const stats = [
    { icon: Users, num: 12000, suffix: "+", label: t("stats.students") },
    { icon: BookOpen, num: 250, suffix: "+", label: t("stats.lectures") },
    { icon: Award, num: 8, suffix: "+", label: t("stats.years") },
    { icon: Trophy, num: 95, suffix: "%", label: t("stats.success") },
  ];

  return (
    <section id="teacher" className="py-24 md:py-32 relative">
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Teacher image card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[2.5rem] overflow-hidden shadow-elegant gradient-primary p-2">
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-secondary">
                <img
                  src={teacherImg}
                  alt={t("teacher.title")}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card rounded-2xl px-5 py-3 shadow-card flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl gradient-accent grid place-items-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-foreground/60 font-medium">Volt Physics</div>
                <div className="text-sm font-bold">{t("teacher.title")}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-5">
              <GraduationCap className="w-4 h-4" />
              {t("teacher.eyebrow")}
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight">
              <span className="text-gradient-rainbow">{t("teacher.title")}</span>
            </h2>
            <p className="mt-5 text-lg text-foreground/65 leading-relaxed max-w-xl">
              {t("teacher.body")}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    className="group bg-card rounded-2xl p-5 shadow-soft border border-border hover:shadow-card hover:border-primary/30 transition-all"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-10 h-10 rounded-xl gradient-primary grid place-items-center mb-3 shadow-soft"
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="font-display font-black text-2xl md:text-3xl text-gradient">
                      <Counter value={s.num} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-foreground/60 mt-1 font-medium">{s.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
