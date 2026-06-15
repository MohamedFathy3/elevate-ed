/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface Planet {
  size: number;
  top: string;
  left: string;
  depth: number;
  gradient: string;
  ring?: boolean;
  glow: string;
}

const PlanetEl = ({ p, mx, my, scrollY, isNature, isDark }: any) => {
  const mxT = useTransform(mx, (v: number) => v * p.depth * 8);
  const myT = useTransform(my, (v: number) => v * p.depth * 8);
  const scrollOffset = useTransform(scrollY, (v: number) => -v * (p.depth * 0.08));
  const isTop = parseFloat(p.top) < 50;
  const shrinkFactor = isTop ? 0.0008 : 0.0003;
  const scale = useTransform(scrollY, (v: number) => Math.max(0.5, 1 - v * shrinkFactor));
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
              borderColor: isNature ? "hsl(35 100% 70% / 0.4)" : "hsl(220 80% 70% / 0.4)",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

const Star = ({ top, left, size, delay, isDark }: any) => (
  <motion.div
    className="absolute rounded-full"
    style={{ 
      top, left, width: size, height: size, 
      boxShadow: `0 0 ${size * 3}px ${isDark ? 'white' : 'hsl(220 55% 52% / 0.5)'}`,
      backgroundColor: isDark ? 'white' : 'hsl(220 55% 52%)'
    }}
    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

export const PlanetsBackground = () => {
  const { theme, colorMode, apiColors } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 40, damping: 20, mass: 1 });
  const my = useSpring(myRaw, { stiffness: 40, damping: 20, mass: 1 });
  const { scrollY: scrollYRaw } = useScroll();
  const scrollY = useSpring(scrollYRaw, { stiffness: 60, damping: 25, mass: 0.8 });
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const bgColor = apiColors?.background || (isDark ? '#0f172a' : '#ffffff');

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mxRaw.set(x);
      myRaw.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mxRaw, myRaw]);

  // Generate planets based on theme
  const getPlanets = (): Planet[] => {
    if (isNature) {
      // Nature theme planets - warm colors
      return [
        { 
          size: 280, top: "8%", left: "6%", depth: 1.5, 
          gradient: "radial-gradient(circle at 30% 30%, hsl(35 50% 65%), hsl(30 55% 45%) 60%, hsl(25 40% 20%))",
          glow: "hsl(35 55% 52% / 0.35)"
        },
        { 
          size: 180, top: "65%", left: "82%", depth: 3, 
          gradient: "radial-gradient(circle at 35% 30%, hsl(30 50% 65%), hsl(25 55% 45%) 55%, hsl(20 40% 25%))",
          ring: true,
          glow: "hsl(30 55% 50% / 0.35)"
        },
        { 
          size: 120, top: "75%", left: "8%", depth: 4, 
          gradient: "radial-gradient(circle at 30% 30%, hsl(145 45% 55%), hsl(145 50% 35%) 60%, hsl(135 40% 20%))",
          glow: "hsl(145 50% 45% / 0.4)"
        },
        { 
          size: 90, top: "20%", left: "78%", depth: 5, 
          gradient: "radial-gradient(circle at 30% 30%, hsl(350 50% 65%), hsl(350 50% 50%) 55%, hsl(340 40% 25%))",
          glow: "hsl(350 55% 55% / 0.35)"
        },
        { 
          size: 60, top: "45%", left: "45%", depth: 2.5, 
          gradient: "radial-gradient(circle at 30% 30%, hsl(40 55% 65%), hsl(35 55% 50%) 60%, hsl(30 40% 25%))",
          glow: "hsl(40 55% 55% / 0.35)"
        },
        { 
          size: 40, top: "35%", left: "20%", depth: 6, 
          gradient: "radial-gradient(circle at 30% 30%, hsl(35 20% 85%), hsl(30 25% 65%))",
          glow: "hsl(35 30% 65% / 0.35)"
        },
      ];
    }
    
    // Default theme planets - cool colors
    return [
      { 
        size: 280, top: "8%", left: "6%", depth: 1.5, 
        gradient: "radial-gradient(circle at 30% 30%, hsl(220 50% 70%), hsl(220 55% 45%) 60%, hsl(222 40% 18%))",
        glow: "hsl(220 55% 52% / 0.35)"
      },
      { 
        size: 180, top: "65%", left: "82%", depth: 3, 
        gradient: "radial-gradient(circle at 35% 30%, hsl(260 50% 65%), hsl(260 55% 45%) 55%, hsl(250 40% 25%))",
        ring: true,
        glow: "hsl(260 55% 50% / 0.35)"
      },
      { 
        size: 120, top: "75%", left: "8%", depth: 4, 
        gradient: "radial-gradient(circle at 30% 30%, hsl(175 45% 65%), hsl(175 50% 40%) 60%, hsl(195 40% 20%))",
        glow: "hsl(175 50% 50% / 0.4)"
      },
      { 
        size: 90, top: "20%", left: "78%", depth: 5, 
        gradient: "radial-gradient(circle at 30% 30%, hsl(340 50% 75%), hsl(340 50% 55%) 55%, hsl(330 40% 25%))",
        glow: "hsl(340 55% 60% / 0.35)"
      },
      { 
        size: 60, top: "45%", left: "45%", depth: 2.5, 
        gradient: "radial-gradient(circle at 30% 30%, hsl(45 55% 75%), hsl(40 55% 55%) 60%, hsl(30 40% 25%))",
        glow: "hsl(40 55% 60% / 0.35)"
      },
      { 
        size: 40, top: "35%", left: "20%", depth: 6, 
        gradient: "radial-gradient(circle at 30% 30%, hsl(220 20% 92%), hsl(220 25% 70%))",
        glow: "hsl(220 30% 70% / 0.35)"
      },
    ];
  };

  const planets = getPlanets();

  // Generate stars
  const stars = Array.from({ length: isNature ? 40 : 60 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    key: i,
  }));

  // Background gradient based on theme
  const getBackgroundStyle = () => {
    if (isNature) {
      if (isDark) {
        return {
          background: `radial-gradient(ellipse at top, hsl(35 30% 10%) 0%, hsl(30 20% 5%) 60%, #0a0a0a 100%)`
        };
      }
      return {
        background: `radial-gradient(ellipse at top, hsl(45 30% 96%) 0%, hsl(35 20% 90%) 60%, hsl(30 15% 85%) 100%)`
      };
    }
    
    if (isDark) {
      return {
        background: `radial-gradient(ellipse at top, hsl(262 50% 15%) 0%, hsl(250 60% 8%) 60%, #000 100%)`
      };
    }
    
    return {
      background: `radial-gradient(ellipse at top, hsl(220 30% 97%) 0%, hsl(220 20% 92%) 60%, hsl(220 15% 88%) 100%)`
    };
  };

  return (
    <div
      ref={ref}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Background with theme colors */}
      <div className="absolute inset-0" style={getBackgroundStyle()} />
      
      {/* Additional overlay from API color */}
      {apiColors && !isDark && !isNature && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{ backgroundColor: apiColors.background }}
        />
      )}

      {/* Nature theme texture overlay */}
      {isNature && !isDark && (
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 20% 40%, rgba(139, 69, 19, 0.1) 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }} />
      )}

      {/* Stars */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark || isNature ? 'opacity-100' : 'opacity-40'}`}>
        {stars.map((s) => (
          <Star key={s.key} top={s.top} left={s.left} size={s.size} delay={s.delay} isDark={isDark} />
        ))}
      </div>

      {/* Planets */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-90' : 'opacity-50'}`}>
        {planets.map((p, i) => (
          <PlanetEl 
            key={i} 
            p={p} 
            mx={mx} 
            my={my} 
            scrollY={scrollY}
            isNature={isNature}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Soft vignette */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40 ${
        isDark ? 'dark:to-black/60' : ''
      }`} />
      
      {/* Nature theme sun glow */}
      {isNature && (
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      )}
    </div>
  );
};