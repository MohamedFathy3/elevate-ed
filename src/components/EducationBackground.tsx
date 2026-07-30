/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/EducationBackground.tsx

import { memo } from "react";
import { motion } from "framer-motion";

// أيقونات SVG مبسطة وأنيقة - نفس التصميم القديم لكن بدون حركة
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

// عناصر ثابتة - نفس التصميم الأنيق لكن بدون حركة
const FLOATING_ELEMENTS = [
  // كتب
  { id: 1, type: "book", top: "5%", left: "3%", size: 32, rotation: -5, opacity: 0.4 },
  { id: 2, type: "book", top: "70%", left: "85%", size: 28, rotation: 8, opacity: 0.35 },
  { id: 3, type: "book", top: "85%", left: "10%", size: 24, rotation: -3, opacity: 0.3 },
  
  // أقلام
  { id: 4, type: "pen", top: "15%", left: "88%", size: 30, rotation: 15, opacity: 0.45 },
  { id: 5, type: "pen", top: "55%", left: "5%", size: 26, rotation: -10, opacity: 0.4 },
  
  // شهادات
  { id: 6, type: "certificate", top: "25%", left: "92%", size: 35, rotation: 5, opacity: 0.3 },
  { id: 7, type: "certificate", top: "60%", left: "2%", size: 30, rotation: -8, opacity: 0.35 },
  
  // نجوم
  { id: 8, type: "star", top: "10%", left: "50%", size: 20, rotation: 0, opacity: 0.5 },
  { id: 9, type: "star", top: "40%", left: "95%", size: 18, rotation: 0, opacity: 0.45 },
  { id: 10, type: "star", top: "80%", left: "45%", size: 16, rotation: 0, opacity: 0.4 },
  
  // لمبات
  { id: 11, type: "lightbulb", top: "35%", left: "1%", size: 28, rotation: 0, opacity: 0.35 },
  { id: 12, type: "lightbulb", top: "75%", left: "75%", size: 24, rotation: 0, opacity: 0.3 },
  
  // أهداف
  { id: 13, type: "target", top: "20%", left: "20%", size: 30, rotation: 0, opacity: 0.35 },
  { id: 14, type: "target", top: "50%", left: "80%", size: 26, rotation: 0, opacity: 0.3 },
  
  // بوصلة
  { id: 15, type: "compass", top: "65%", left: "15%", size: 28, rotation: 0, opacity: 0.35 },
  { id: 16, type: "compass", top: "30%", left: "70%", size: 24, rotation: 0, opacity: 0.3 },
];

// مكون العنصر الثابت - بدون أي حركة نهائياً
const StaticElement = memo(({ element }: { element: typeof FLOATING_ELEMENTS[0] }) => {
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
      default: return null;
    }
  };

  return (
    <div
      style={{ 
        top: element.top, 
        left: element.left,
        opacity: element.opacity,
        transform: `rotate(${element.rotation}deg)`,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))"
      }}
      className="absolute pointer-events-none select-none transition-opacity duration-300"
    >
      {getIcon()}
    </div>
  );
});

StaticElement.displayName = 'StaticElement';

// مربعات زخرفية أنيقة - نفس اللي كان موجود
const DecorativeSquare = memo(({ 
  top, 
  left, 
  size, 
  rotation, 
  opacity, 
  borderColor 
}: any) => (
  <div
    className="absolute pointer-events-none"
    style={{
      top,
      left,
      width: size,
      height: size,
      border: `1px solid ${borderColor}`,
      transform: `rotate(${rotation}deg)`,
      opacity,
      borderRadius: '2px',
    }}
  />
));

DecorativeSquare.displayName = 'DecorativeSquare';

export const EducationBackground = () => {
  // مربعات زخرفية متناثرة - زي التصميم الأصلي
  const squares = [
    { top: "8%", left: "2%", size: 60, rotation: 15, opacity: 0.15, color: "#10b981" },
    { top: "15%", left: "95%", size: 45, rotation: -20, opacity: 0.12, color: "#3b82f6" },
    { top: "30%", left: "8%", size: 35, rotation: 30, opacity: 0.1, color: "#f59e0b" },
    { top: "45%", left: "92%", size: 50, rotation: -10, opacity: 0.12, color: "#8b5cf6" },
    { top: "60%", left: "3%", size: 40, rotation: 25, opacity: 0.1, color: "#ef4444" },
    { top: "75%", left: "96%", size: 55, rotation: -15, opacity: 0.12, color: "#10b981" },
    { top: "88%", left: "6%", size: 30, rotation: 40, opacity: 0.08, color: "#fbbf24" },
    { top: "5%", left: "45%", size: 25, rotation: 10, opacity: 0.08, color: "#84cc16" },
    { top: "50%", left: "50%", size: 70, rotation: 45, opacity: 0.06, color: "#10b981" },
    { top: "92%", left: "50%", size: 35, rotation: -30, opacity: 0.08, color: "#3b82f6" },
  ];

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* خلفية gradient أنيقة */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-white/30 to-teal-50/30 dark:from-emerald-950/30 dark:via-slate-900/30 dark:to-teal-950/30" />
      
      {/* Pattern شبكي خفيف */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* المربعات الزخرفية */}
      <div className="absolute inset-0">
        {squares.map((square, index) => (
          <DecorativeSquare key={index} {...square} borderColor={square.color} />
        ))}
      </div>

      {/* العناصر التعليمية الثابتة */}
      <div className="absolute inset-0">
        {FLOATING_ELEMENTS.map((element) => (
          <StaticElement key={element.id} element={element} />
        ))}
      </div>

      {/* Soft glow في النص */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-emerald-500/5 to-teal-500/5 blur-2xl" />
      
      {/* Vignette أنيق */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10 dark:from-black/30 dark:via-transparent dark:to-black/10" />
    </div>
  );
};