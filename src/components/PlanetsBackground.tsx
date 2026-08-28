/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Planet {
  size: number;
  top: string;
  left: string;
  gradient: string;
  ring?: boolean;
  glow: string;
}

// ✅ Planet ثابت - منغير أي حركة أو أنيميشن
const PlanetEl = ({ p }: { p: Planet }) => {
  return (
    <div
      className="absolute pointer-events-none origin-center"
      style={{
        top: p.top,
        left: p.left,
        width: p.size,
        height: p.size,
      }}
    >
      <div className="relative w-full h-full">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: p.gradient,
            boxShadow: `0 0 30px ${p.glow}`,
          }}
        />
        {p.ring && (
          <div
            className="absolute left-1/2 top-1/2 rounded-full border-[2px]"
            style={{
              width: p.size * 1.3,
              height: p.size * 0.25,
              transform: "translate(-50%, -50%) rotate(-20deg)",
              borderColor: "hsl(220 80% 70% / 0.2)",
            }}
          />
        )}
      </div>
    </div>
  );
};

// ✅ Star ثابتة - منغير أي حركة
const Star = ({ top, left, size, isDark }: any) => {
  return (
    <div
      className="absolute rounded-full"
      style={{
        top,
        left,
        width: size,
        height: size,
        opacity: 0.4,
        boxShadow: `0 0 ${size * 1.5}px ${isDark ? 'white' : 'hsl(220 55% 52% / 0.2)'}`,
        backgroundColor: isDark ? 'white' : 'hsl(220 55% 52%)',
      }}
    />
  );
};

export const PlanetsBackground = () => {
  const { theme, colorMode } = useTheme();
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';

  // ✅ كواكب قليلة جداً وبسيطة
  const planets = useMemo(() => {
    const allPlanets = getPlanets(isNature);
    // ✅ خلي بالك 3 كواكب بس وقلل حجمهم
    return allPlanets.slice(0, 3).map(p => ({
      ...p,
      size: Math.floor(p.size * 0.6),
      glow: p.glow.replace(/0\.\d+/, '0.1'),
    }));
  }, [isNature]);

  // ✅ نجوم قليلة جداً
  const stars = useMemo(() => {
    // ✅ 12 نجمة بس
    return Array.from({ length: 12 }).map((_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.2 + 0.5,
      key: i,
    }));
  }, []);

  // ✅ Background Style بسيط
  const getBackgroundStyle = () => {
    if (isNature) {
      return isDark 
        ? { background: `radial-gradient(ellipse at top, #1a1410 0%, #0d0a08 60%, #000 100%)` }
        : { background: `radial-gradient(ellipse at top, #f5efe8 0%, #e8ddd0 60%, #dcd0c5 100%)` };
    }
    return isDark
      ? { background: `radial-gradient(ellipse at top, #0f0a1a 0%, #08040d 60%, #000 100%)` }
      : { background: `radial-gradient(ellipse at top, #f0f2f8 0%, #e0e4ed 60%, #d5d9e3 100%)` };
  };

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Background */}
      <div className="absolute inset-0" style={getBackgroundStyle()} />

      {/* Stars - 12 نجمة ثابتة */}
      <div className={`absolute inset-0 ${isDark || isNature ? 'opacity-80' : 'opacity-30'}`}>
        {stars.map((s, i) => (
          <Star key={i} {...s} isDark={isDark} />
        ))}
      </div>

      {/* Planets - 3 كواكب ثابتة */}
      <div className="absolute inset-0">
        {planets.map((p, i) => (
          <PlanetEl key={i} p={p} />
        ))}
      </div>

      {/* Vignette خفيفة */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 ${
        isDark ? 'to-black/50' : ''
      }`} />
    </div>
  );
};

// ✅ Helper function - كواكب بسيطة
function getPlanets(isNature: boolean): Planet[] {
  if (isNature) {
    return [
      { 
        size: 150, top: "15%", left: "10%",
        gradient: "radial-gradient(circle at 30% 30%, #c4a882, #8b7355 60%, #5a4a3a)",
        glow: "rgba(139, 115, 85, 0.2)"
      },
      { 
        size: 100, top: "70%", left: "75%",
        gradient: "radial-gradient(circle at 35% 30%, #b8a088, #7d6b5a 55%, #4d3d2e)",
        ring: true,
        glow: "rgba(125, 107, 90, 0.2)"
      },
      { 
        size: 70, top: "80%", left: "15%",
        gradient: "radial-gradient(circle at 30% 30%, #7a9a7a, #4a7a5a 60%, #2a4a3a)",
        glow: "rgba(74, 122, 90, 0.2)"
      },
    ];
  }
  
  return [
    { 
      size: 160, top: "15%", left: "10%",
      gradient: "radial-gradient(circle at 30% 30%, #8899bb, #445577 60%, #223355)",
      glow: "rgba(68, 85, 119, 0.2)"
    },
    { 
      size: 110, top: "70%", left: "75%",
      gradient: "radial-gradient(circle at 35% 30%, #9988bb, #6655aa 55%, #443388)",
      ring: true,
      glow: "rgba(102, 85, 170, 0.2)"
    },
    { 
      size: 75, top: "80%", left: "15%",
      gradient: "radial-gradient(circle at 30% 30%, #66aabb, #338899 60%, #226677)",
      glow: "rgba(51, 136, 153, 0.2)"
    },
  ];
}