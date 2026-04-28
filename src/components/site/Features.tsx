import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { BookOpen, Users, Clock, Award, MessagesSquare, Infinity as InfinityIcon, LucideIcon } from "lucide-react";
import { MouseEvent, useRef } from "react";

const FeatureCard = ({ icon: Icon, title, body, index }: { icon: LucideIcon; title: string; body: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className="group relative p-7 rounded-2xl bg-background border border-border hover:border-foreground/20 hover:shadow-elegant transition-shadow duration-500 overflow-hidden"
    >
      <motion.div
        style={{ background: useTransform([glowX, glowY], ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, hsl(var(--accent) / 0.12), transparent 60%)`) }}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />
      <div style={{ transform: "translateZ(30px)" }} className="relative">
        <motion.div
          whileHover={{ rotate: -8, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-11 h-11 rounded-xl bg-foreground text-background grid place-items-center mb-5 group-hover:bg-accent transition-colors"
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        <h3 className="font-display font-semibold text-lg tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </motion.div>
  );
};

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
    <section id="features" className="py-24 md:py-32 bg-secondary/40 relative overflow-hidden">
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl"
      />
      <div className="container-tight relative">
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
          {items.map((it, i) => (
            <FeatureCard key={i} {...it} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
