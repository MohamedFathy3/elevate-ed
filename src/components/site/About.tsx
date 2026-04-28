import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import aboutImg from "@/assets/about.jpg";

export const About = () => {
  const { t } = useLang();

  const stats = [
    { v: "120K+", k: t("about.stat1") },
    { v: "200+", k: t("about.stat2") },
    { v: "94%", k: t("about.stat3") },
  ];

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container-tight grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t("about.eyebrow")}
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-balance">
            {t("about.title")}
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-md">
            {t("about.body")}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="font-display font-bold text-2xl md:text-3xl">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.k}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="relative group overflow-hidden rounded-2xl shadow-elegant"
        >
          <img
            src={aboutImg}
            alt="Student learning"
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full h-full object-cover aspect-[4/5] transition-transform duration-[1.2s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};
