import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { GraduationCap, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

export const Stage = () => {
  const { lang, dir } = useLang();
  const { teacher, pick } = useTeacher();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section id="stages" className="py-24 md:py-32 relative">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-5"
          >
            <GraduationCap className="w-4 h-4" />
            {lang === "ar" ? "المراحل الدراسية" : "Educational Stages"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            <span className="text-gradient-rainbow">
              {lang === "ar" ? "اختر مرحلتك" : "Pick your stage"}
            </span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {teacher.website.stages.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl p-8 bg-card border border-border shadow-card hover:shadow-elegant transition-all"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full gradient-primary opacity-10 group-hover:opacity-20 transition-opacity blur-2xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl gradient-primary grid place-items-center shadow-soft mb-5 font-display font-black text-white text-xl">
                  {i + 1}
                </div>
                <h3 className="font-display font-bold text-2xl mb-2">{pick(s.name, s.name_ar)}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  {pick(s.description, s.description_ar)}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="w-4 h-4" />
                  {lang === "ar" ? "اكتشف الكورسات" : "Explore courses"}
                  <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
