import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { BookOpen, Users, Clock, Award, MessagesSquare, Infinity as InfinityIcon } from "lucide-react";

export const Features = () => {
  const { t } = useLang();

  const items = [
    { icon: BookOpen, title: t("f1.title"), body: t("f1.body") },
    { icon: MessagesSquare, title: t("f2.title"), body: t("f2.body") },
    { icon: Clock, title: t("f3.title"), body: t("f3.body") },
    { icon: Award, title: t("f4.title"), body: t("f4.body") },
    { icon: Users, title: t("f5.title"), body: t("f5.body") },
    { icon: InfinityIcon, title: t("f6.title"), body: t("f6.body") },
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-secondary/40">
      <div className="container-tight">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4"
          >
            {t("features.eyebrow")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-bold text-4xl md:text-5xl tracking-tight text-balance"
          >
            {t("features.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-muted-foreground text-lg"
          >
            {t("features.subtitle")}
          </motion.p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -6 }}
                className="group p-7 rounded-2xl bg-background border border-border hover:border-foreground/20 hover:shadow-elegant transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-foreground text-background grid place-items-center mb-5 group-hover:bg-accent transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-lg tracking-tight">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
