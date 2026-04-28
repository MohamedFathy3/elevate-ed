import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { BookOpen, Users, Clock, Award, MessagesSquare, Infinity as InfinityIcon, LucideIcon, ArrowUpRight } from "lucide-react";
import { MouseEvent, useRef } from "react";

const FeatureCard = ({
  icon: Icon,
  title,
  body,
  index,
  number,
  large,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  index: number;
  number: string;
  large?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);
  const glow = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, hsl(var(--accent) / 0.18), transparent 55%)`
  );

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200, transformStyle: "preserve-3d" }}
      className={`group relative rounded-3xl bg-background border border-border overflow-hidden transition-all duration-500 hover:border-foreground/30 hover:shadow-elegant ${
        large ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {/* Animated glow */}
      <motion.div
        style={{ background: glow }}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      {/* Number watermark */}
      <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[10px] font-mono tracking-widest text-muted-foreground/50 z-10">
        {number}
      </div>

      {/* Hover arrow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
        whileHover={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        className="absolute top-5 left-5 rtl:left-auto rtl:right-5 z-10"
      >
        <div className="w-8 h-8 rounded-full bg-foreground text-background grid place-items-center opacity-0 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-500 -rotate-45">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </motion.div>

      <div
        style={{ transform: "translateZ(40px)" }}
        className={`relative ${large ? "p-10 md:p-12 h-full flex flex-col justify-between min-h-[420px]" : "p-7"}`}
      >
        {/* Icon orb */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative ${large ? "w-20 h-20" : "w-14 h-14"} rounded-2xl bg-secondary grid place-items-center mb-6 overflow-hidden`}
          >
            <div className="absolute inset-0 gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Icon
              className={`${large ? "w-9 h-9" : "w-6 h-6"} relative z-10 text-foreground group-hover:text-accent-foreground transition-colors duration-500`}
              strokeWidth={1.5}
            />
          </motion.div>
        </div>

        <div className={large ? "mt-auto" : ""}>
          <h3 className={`font-display font-semibold tracking-tight ${large ? "text-3xl md:text-4xl" : "text-xl"}`}>
            {title}
          </h3>
          <p className={`mt-3 text-muted-foreground leading-relaxed ${large ? "text-base md:text-lg max-w-md" : "text-sm"}`}>
            {body}
          </p>

          {large && (
            <div className="mt-8 flex items-center gap-3 text-sm font-medium">
              <span className="w-10 h-px bg-foreground" />
              <span className="uppercase tracking-[0.2em] text-xs">Featured</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const Features = () => {
  const { t, lang } = useLang();

  const items = [
    { icon: BookOpen, title: t("f1.title"), body: t("f1.body"), n: "01", large: true },
    { icon: MessagesSquare, title: t("f2.title"), body: t("f2.body"), n: "02" },
    { icon: Clock, title: t("f3.title"), body: t("f3.body"), n: "03" },
    { icon: Award, title: t("f4.title"), body: t("f4.body"), n: "04" },
    { icon: Users, title: t("f5.title"), body: t("f5.body"), n: "05" },
    { icon: InfinityIcon, title: t("f6.title"), body: t("f6.body"), n: "06" },
  ];

  const headline = t("features.title");
  const words = headline.split(" ");

  return (
    <section id="features" className="py-28 md:py-40 bg-secondary/30 relative overflow-hidden">
      {/* Floating ambient blobs */}
      <motion.div
        animate={{ x: [0, 120, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-foreground/5 blur-3xl pointer-events-none"
      />

      {/* Dotted pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container-tight relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="w-8 h-px bg-foreground" />
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium">
                {t("features.eyebrow")}
              </span>
            </motion.div>

            <h2 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight text-balance leading-[1.05]">
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                  className="inline-block mr-[0.25em] rtl:mr-0 rtl:ml-[0.25em]"
                >
                  {i === words.length - 1 ? (
                    <span className="italic font-light text-muted-foreground/70">{w}</span>
                  ) : (
                    w
                  )}
                </motion.span>
              ))}
            </h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg max-w-sm leading-relaxed md:text-right rtl:md:text-left"
          >
            {t("features.subtitle")}
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[220px] gap-5">
          {items.map((it, i) => (
            <FeatureCard
              key={i}
              icon={it.icon}
              title={it.title}
              body={it.body}
              index={i}
              number={it.n}
              large={it.large}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
