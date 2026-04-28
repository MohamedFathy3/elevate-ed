import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { SplitText } from "./SplitText";

export const Hero = () => {
  const { t, dir } = useLang();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden gradient-hero-bg">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 30, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/15 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -90, 50, 0], y: [0, 70, -40, 0], scale: [1, 0.85, 1.15, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-foreground/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl"
        />
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-[8%] w-16 h-16 rounded-2xl border border-foreground/15 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-[6%] w-12 h-12 rounded-full border border-accent/40 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-[10%] w-8 h-8 bg-accent/20 rounded-md hidden lg:block"
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div style={{ y, opacity, scale }} className="container-tight relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-background/60 backdrop-blur-sm text-xs font-medium text-muted-foreground mb-8"
        >
          <Sparkles className="w-3 h-3 text-accent" />
          {t("hero.eyebrow")}
        </motion.div>

        <h1 className="font-display font-bold tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] text-balance max-w-5xl overflow-hidden">
          <span className="block overflow-hidden">
            <SplitText text={t("hero.title")} delay={0.2} />
          </span>
          <span className="block overflow-hidden text-muted-foreground/60">
            <SplitText text={t("hero.title2")} delay={0.6} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400 }}>
            <Button size="lg" className="rounded-full h-12 px-7 text-base group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                {t("hero.cta")}
                <Arrow className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
              <span className="absolute inset-0 gradient-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400 }}>
            <Button size="lg" variant="ghost" className="rounded-full h-12 px-6 text-base">
              {t("hero.cta2")}
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-foreground/40 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
