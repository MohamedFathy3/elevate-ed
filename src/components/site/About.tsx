import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import aboutImg from "@/assets/about.jpg";

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

export const About = () => {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const stats = [
    { num: 120, suffix: "K+", k: t("about.stat1") },
    { num: 200, suffix: "+", k: t("about.stat2") },
    { num: 94, suffix: "%", k: t("about.stat3") },
  ];

  return (
    <section ref={ref} id="about" className="py-24 md:py-32 overflow-hidden">
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
                <div className="font-display font-bold text-2xl md:text-3xl">
                  <Counter value={s.num} suffix={s.suffix} />
                </div>
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
          <motion.img
            style={{ y: imgY, scale: 1.15 }}
            src={aboutImg}
            alt="Student learning"
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full h-full object-cover aspect-[4/5] transition-transform duration-[1.2s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent pointer-events-none" />
          <motion.div
            initial={{ x: "-100%" }}
            whileInView={{ x: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-background/30 to-transparent skew-x-12 pointer-events-none"
          />
        </motion.div>
      </div>
    </section>
  );
};
