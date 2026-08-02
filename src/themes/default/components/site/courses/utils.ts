/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/site/courses/utils.ts

import { Leaf, Flower2, Trees, Sparkles, Award, BookMarked } from "lucide-react";
import { Atom, Zap, BookOpen } from "lucide-react";

export const NATURE_ICONS = [Leaf, Flower2, Trees, Sparkles, Award, BookMarked];
export const DEFAULT_ICONS = [Atom, Zap, BookOpen, Sparkles, Award, BookMarked];

export const LIGHT_COLORS = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-purple-500 to-purple-600",
  "from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600",
  "from-cyan-500 to-cyan-600",
];

export const DARK_COLORS = [
  "from-blue-400 to-blue-500",
  "from-emerald-400 to-emerald-500",
  "from-purple-400 to-purple-500",
  "from-rose-400 to-rose-500",
  "from-amber-400 to-amber-500",
  "from-cyan-400 to-cyan-500",
];

export const getCoursePrice = (course: any) => {
  const originalPrice = parseFloat(course?.price) || 0;
  const discountPercent = parseFloat(course?.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  return { originalPrice, discountPercent, finalPrice, hasDiscount: discountPercent > 0 };
};

export const getCourseType = (course: any, lang: string) => {
  return course?.type === "online" 
    ? (lang === "ar" ? "أونلاين" : "Online") 
    : (lang === "ar" ? "سنتر" : "Center");
};