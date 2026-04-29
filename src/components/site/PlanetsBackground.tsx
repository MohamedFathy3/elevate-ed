import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

interface Planet {
  size: number;
  top: string;
  left: string;
  depth: number; // 1 = far (slow), 5 = close (fast)
  gradient: string;
  ring?: boolean;
  glow?: string;
}

const PLANETS: Planet[] = [
  { size: 280, top: "8%", left: "6%", depth: 1.5, gradient: "radial-gradient(circle at 30% 30%, hsl(220 50% 70%), hsl(220 55% 45%) 60%, hsl(222 40% 18%))", glow: "hsl(220 55% 52% / 0.35)" },
  { size: 180, top: "65%", left: "82%", depth: 3, gradient: "radial-gradient(circle at 35% 30%, hsl(30 50% 70%), hsl(25 55% 50%) 55%, hsl(20 40% 25%))", ring: true, glow: "hsl(25 55% 55% / 0.35)" },
  { size: 120, top: "75%", left: "8%", depth: 4, gradient: "radial-gradient(circle at 30% 30%, hsl(175 45% 65%), hsl(175 50% 40%) 60%, hsl(195 40% 20%))", glow: "hsl(175 50% 50% / 0.4)" },
  { size: 90, top: "20%", left: "78%", depth: 5, gradient: "radial-gradient(circle at 30% 30%, hsl(340 50% 75%), hsl(340 50% 55%) 55%, hsl(330 40% 25%))", glow: "hsl(340 55% 60% / 0.35)" },
  { size: 60, top: "45%", left: "45%", depth: 2.5, gradient: "radial-gradient(circle at 30% 30%, hsl(45 55% 75%), hsl(40 55% 55%) 60%, hsl(30 40% 25%))", glow: "hsl(40 55% 60% / 0.35)" },
  { size: 40, top: "35%", left: "20%", depth: 6, gradient: "radial-gradient(circle at 30% 30%, hsl(220 20% 92%), hsl(220 25% 70%))", glow: "hsl(220 30% 70% / 0.35)" },
];

const PlanetEl = ({ p, mx, my, scrollY }: { p: Planet; mx: any; my: any; scrollY: any }) => {
  // mouse parallax
  const mxT = useTransform(mx, (v: number) => v * p.depth * 8);
  const myT = useTransform(my, (v: number) => v * p.depth * 8);
  // scroll parallax — deeper planets move slower (smaller multiplier), closer ones drift more
  const scrollOffset = useTransform(scrollY, (v: number) => -v * (p.depth * 0.08));
  // shrink as user scrolls (more for top/closer planets)
  const isTop = parseFloat(p.top) < 50;
  const shrinkFactor = isTop ? 0.0008 : 0.0003;
  const scale = useTransform(scrollY, (v: number) => Math.max(0.5, 1 - v * shrinkFactor));
  // combine mouse + scroll on Y
  const ty = useTransform([myT, scrollOffset], ([m, s]: any) => m + s);

  return (
    <motion.div
      style={{ x: mxT, y: ty, scale, top: p.top, left: p.left, width: p.size, height: p.size }}
      className="absolute pointer-events-none origin-center"
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6 + p.depth, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: p.gradient,
            boxShadow: `0 0 80px ${p.glow}, inset -20px -30px 60px rgba(0,0,0,0.4)`,
          }}
        />
        {p.ring && (
          <div
            className="absolute left-1/2 top-1/2 rounded-full border-[6px]"
            style={{
              width: p.size * 1.6,
              height: p.size * 0.4,
              transform: "translate(-50%, -50%) rotate(-20deg)",
              borderColor: "hsl(35 100% 70% / 0.4)",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

const Star = ({ top, left, size, delay }: { top: string; left: string; size: number; delay: number }) => (
  <motion.div
    className="absolute rounded-full bg-white"
    style={{ top, left, width: size, height: size, boxShadow: `0 0 ${size * 3}px white` }}
    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

export const PlanetsBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 40, damping: 20, mass: 1 });
  const my = useSpring(myRaw, { stiffness: 40, damping: 20, mass: 1 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mxRaw.set(x);
      myRaw.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mxRaw, myRaw]);

  // Pre-generated stars
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    key: i,
  }));

  return (
    <div
      ref={ref}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Dark mode space gradient overlay */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top,hsl(262_50%_15%)_0%,hsl(250_60%_5%)_60%,#000_100%)]" />

      {/* Stars (only visible in dark) */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
        {stars.map((s) => (
          <Star key={s.key} top={s.top} left={s.left} size={s.size} delay={s.delay} />
        ))}
      </div>

      {/* Planets */}
      <div className="absolute inset-0 opacity-60 dark:opacity-90">
        {PLANETS.map((p, i) => (
          <PlanetEl key={i} p={p} mx={mx} my={my} />
        ))}
      </div>

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40 dark:to-black/60" />
    </div>
  );
};
