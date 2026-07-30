// src/pages/stages/components/StagesHeader.tsx

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { StagesHeaderProps } from "../StagesPage.types";

export const StagesHeader = ({ lang, totalStages }: StagesHeaderProps) => {
  return (
    <div className="text-center max-w-4xl mx-auto mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-5 backdrop-blur-sm"
      >
        <GraduationCap className="w-4 h-4" />
        {lang === "ar" ? "جميع المراحل الدراسية" : "All Educational Stages"}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-display font-black text-4xl md:text-6xl tracking-tight"
      >
        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          {lang === "ar" ? "اختر مرحلتك الدراسية" : "Choose Your Educational Stage"}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto"
      >
        {lang === "ar" 
          ? "نقدم برامج تعليمية متكاملة تناسب جميع المراحل الدراسية"
          : "We offer integrated educational programs for all stages"}
      </motion.p>
    </div>
  );
};