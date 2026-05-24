import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { Sparkles, ClipboardCheck, RefreshCw, MessageCircle, LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Sparkles, ClipboardCheck, RefreshCw, MessageCircle];
const COLORS = [
  "gradient-primary",
  "gradient-accent",
  "bg-gradient-to-br from-blue-500 to-indigo-600",
  "bg-gradient-to-br from-emerald-400 to-teal-600",
];

export const About = () => {
  const { lang } = useLang();
  const { teacher, pick } = useTeacher();
  const features = teacher.website.features;

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-5"
          >
            <Sparkles className="w-4 h-4" />
            {lang === "ar" ? "عن المنصة" : "About the Platform"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            <span className="text-gradient-rainbow">
              {pick(teacher.website.about.title, teacher.website.about.title_ar)}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-foreground/65"
          >
            {pick(teacher.website.about.description, teacher.website.about.description_ar)}
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-16">
          {features.map((f, i) => {
            const Icon = ICONS[i % ICONS.length];
            const color = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -8, rotate: -1 }}
                className="group relative bg-card rounded-3xl p-7 shadow-card hover:shadow-elegant transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute -inset-px rounded-3xl ${color} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-0`} />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-2xl ${color} grid place-items-center mb-5 shadow-soft group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </motion.div>
                  <h3 className="font-bold text-xl mb-2">{pick(f.name, f.name_ar)}</h3>
                  <p className="text-sm text-foreground/65 leading-relaxed">
                    {pick(f.description, f.description_ar)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {teacher.website.about.stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="bg-card rounded-2xl p-6 text-center shadow-soft border border-border hover:shadow-card hover:border-primary/30 transition-all"
            >
              <div className="font-display font-black text-3xl md:text-4xl text-gradient">
                {s.value.toLocaleString()}{s.suffix}
              </div>
              <div className="text-xs text-foreground/60 mt-2 font-medium">
                {pick(s.label, s.label_ar)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
