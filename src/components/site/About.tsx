import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Sparkles, ClipboardCheck, RefreshCw, MessageCircle, LucideIcon } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, body, index, color }: { icon: LucideIcon; title: string; body: string; index: number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
    className="group relative bg-white rounded-3xl p-7 shadow-card hover:shadow-elegant transition-shadow duration-500"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} grid place-items-center mb-5 shadow-soft group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
    </div>
    <h3 className="font-bold text-xl mb-2">{title}</h3>
    <p className="text-sm text-foreground/65 leading-relaxed">{body}</p>
  </motion.div>
);

export const About = () => {
  const { t } = useLang();

  const items = [
    { icon: Sparkles, title: t("f1.title"), body: t("f1.body"), color: "gradient-primary" },
    { icon: ClipboardCheck, title: t("f2.title"), body: t("f2.body"), color: "gradient-accent" },
    { icon: RefreshCw, title: t("f3.title"), body: t("f3.body"), color: "bg-gradient-to-br from-blue-500 to-indigo-600" },
    { icon: MessageCircle, title: t("f4.title"), body: t("f4.body"), color: "bg-gradient-to-br from-emerald-400 to-teal-600" },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-5"
          >
            <Sparkles className="w-4 h-4" />
            {t("about.eyebrow")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            {t("about.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-foreground/65"
          >
            {t("about.subtitle")}
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map((it, i) => (
            <FeatureCard key={i} {...it} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
