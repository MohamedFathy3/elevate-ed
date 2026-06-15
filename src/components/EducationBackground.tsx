/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/EducationBackground.tsx

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";

interface FloatingElement {
  id: number;
  type: "book" | "pen" | "certificate" | "star" | "lightbulb" | "target" | "compass" | "leaf";
  top: string;
  left: string;
  size: number;
  depth: number; // 1 = far (slow), 5 = close (fast)
  rotation: number;
  delay: number;
  duration: number;
  opacity: number;
}

// أيقونات SVG مبسطة
const BookIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const PenIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const CertificateIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M5 12v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    <path d="M12 16v4" />
    <path d="M9 20h6" />
  </svg>
);

const StarIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const LightbulbIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const TargetIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const CompassIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14 14 7.76 16.24 10 10 16.24 7.76" />
  </svg>
);

const LeafIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

// تعريف العناصر العائمة
const FLOATING_ELEMENTS: FloatingElement[] = [
  // كتب
  { id: 1, type: "book", top: "5%", left: "3%", size: 32, depth: 1.5, rotation: -5, delay: 0, duration: 8, opacity: 0.4 },
  { id: 2, type: "book", top: "70%", left: "85%", size: 28, depth: 2, rotation: 8, delay: 1, duration: 10, opacity: 0.35 },
  { id: 3, type: "book", top: "85%", left: "10%", size: 24, depth: 2.5, rotation: -3, delay: 2, duration: 9, opacity: 0.3 },
  
  // أقلام
  { id: 4, type: "pen", top: "15%", left: "88%", size: 30, depth: 2, rotation: 15, delay: 0.5, duration: 7, opacity: 0.45 },
  { id: 5, type: "pen", top: "55%", left: "5%", size: 26, depth: 2.5, rotation: -10, delay: 1.5, duration: 8.5, opacity: 0.4 },
  
  // شهادات
  { id: 6, type: "certificate", top: "25%", left: "92%", size: 35, depth: 1.8, rotation: 5, delay: 2, duration: 12, opacity: 0.3 },
  { id: 7, type: "certificate", top: "60%", left: "2%", size: 30, depth: 2.2, rotation: -8, delay: 3, duration: 11, opacity: 0.35 },
  
  // نجوم
  { id: 8, type: "star", top: "10%", left: "50%", size: 20, depth: 1.2, rotation: 0, delay: 0.3, duration: 6, opacity: 0.5 },
  { id: 9, type: "star", top: "40%", left: "95%", size: 18, depth: 1.5, rotation: 0, delay: 1.2, duration: 7, opacity: 0.45 },
  { id: 10, type: "star", top: "80%", left: "45%", size: 16, depth: 1.8, rotation: 0, delay: 2.5, duration: 8, opacity: 0.4 },
  
  // لمبات (إبداع)
  { id: 11, type: "lightbulb", top: "35%", left: "1%", size: 28, depth: 3, rotation: 0, delay: 0.8, duration: 9, opacity: 0.35 },
  { id: 12, type: "lightbulb", top: "75%", left: "75%", size: 24, depth: 3.5, rotation: 0, delay: 1.8, duration: 10, opacity: 0.3 },
  
  // أهداف
  { id: 13, type: "target", top: "20%", left: "20%", size: 30, depth: 2.8, rotation: 0, delay: 1, duration: 8, opacity: 0.35 },
  { id: 14, type: "target", top: "50%", left: "80%", size: 26, depth: 3.2, rotation: 0, delay: 2, duration: 9, opacity: 0.3 },
  
  // بوصلة
  { id: 15, type: "compass", top: "65%", left: "15%", size: 28, depth: 2.5, rotation: 0, delay: 1.5, duration: 11, opacity: 0.35 },
  { id: 16, type: "compass", top: "30%", left: "70%", size: 24, depth: 3, rotation: 0, delay: 2.5, duration: 10, opacity: 0.3 },
  
  // أوراق (طبيعة للعلوم)
  { id: 17, type: "leaf", top: "45%", left: "12%", size: 22, depth: 2, rotation: 0, delay: 0.6, duration: 7, opacity: 0.35 },
  { id: 18, type: "leaf", top: "90%", left: "60%", size: 20, depth: 2.2, rotation: 0, delay: 1.2, duration: 8, opacity: 0.3 },
];

// مكون العنصر العائم
const FloatingElementEl = ({ 
  element, 
  mx, 
  my, 
  scrollY 
}: { 
  element: FloatingElement; 
  mx: any; 
  my: any; 
  scrollY: any;
}) => {
  const mxT = useTransform(mx, (v: number) => v * element.depth * 15);
  const myT = useTransform(my, (v: number) => v * element.depth * 15);
  const scrollOffset = useTransform(scrollY, (v: number) => -v * (element.depth * 0.05));
  const opacity = useTransform(scrollY, (v: number) => Math.max(0.2, element.opacity - v * 0.0005));
  const ty = useTransform([myT, scrollOffset], ([m, s]: any) => m + s);
  const rotate = useTransform(scrollY, (v: number) => element.rotation + v * 0.02);

  const getIcon = () => {
    const color = element.type === "book" ? "#10b981" 
      : element.type === "pen" ? "#f59e0b"
      : element.type === "certificate" ? "#3b82f6"
      : element.type === "star" ? "#fbbf24"
      : element.type === "lightbulb" ? "#f59e0b"
      : element.type === "target" ? "#ef4444"
      : element.type === "compass" ? "#8b5cf6"
      : "#84cc16";
    
    switch (element.type) {
      case "book": return <BookIcon size={element.size} color={color} />;
      case "pen": return <PenIcon size={element.size} color={color} />;
      case "certificate": return <CertificateIcon size={element.size} color={color} />;
      case "star": return <StarIcon size={element.size} color={color} />;
      case "lightbulb": return <LightbulbIcon size={element.size} color={color} />;
      case "target": return <TargetIcon size={element.size} color={color} />;
      case "compass": return <CompassIcon size={element.size} color={color} />;
      case "leaf": return <LeafIcon size={element.size} color={color} />;
      default: return null;
    }
  };

  return (
    <motion.div
      style={{ 
        x: mxT, 
        y: ty, 
        top: element.top, 
        left: element.left, 
        opacity,
        rotate,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))"
      }}
      className="absolute pointer-events-none"
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: element.duration, repeat: Infinity, ease: "easeInOut", delay: element.delay }}
        className="relative"
      >
        {getIcon()}
      </motion.div>
    </motion.div>
  );
};

// جزيئات متحركة خلفية
const BackgroundParticle = ({ top, left, size, delay, duration }: any) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20"
    style={{ top, left, width: size, height: size }}
    animate={{ 
      y: [0, -50, 0],
      x: [0, (Math.random() - 0.5) * 50, 0],
      opacity: [0, 0.5, 0]
    }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

export const EducationBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 40, damping: 20, mass: 1 });
  const my = useSpring(myRaw, { stiffness: 40, damping: 20, mass: 1 });
  const { scrollY: scrollYRaw } = useScroll();
  const scrollY = useSpring(scrollYRaw, { stiffness: 60, damping: 25, mass: 0.8 });

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

  // جزيئات خلفية
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 10,
    duration: 5 + Math.random() * 8,
    key: i,
  }));

  return (
    <div
      ref={ref}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Base gradient */}
      <div className="absolute inset-0   to-teal-50/30  dark:via-slate-900 dark:to-teal-950/20" />
      
      {/* Soft pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M0 20 L20 0 L40 20 L20 40 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* جزيئات خلفية */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <BackgroundParticle key={p.key} {...p} />
        ))}
      </div>

      {/* العناصر التعليمية العائمة */}
      <div className="absolute inset-0">
        {FLOATING_ELEMENTS.map((element) => (
          <FloatingElementEl
            key={element.id}
            element={element}
            mx={mx}
            my={my}
            scrollY={scrollY}
          />
        ))}
      </div>

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20 dark:from-black/40 dark:via-transparent dark:to-black/20" />
      
      {/* Soft glow in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-emerald-500/5 to-teal-500/5 blur-3xl" />
    </div>
  );
};