// src/pages/stages/components/EmptyStages.tsx

import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { EmptyStagesProps } from "../StagesPage.types";

export const EmptyStages = ({ slug, lang }: EmptyStagesProps) => {
  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-950/30 grid place-items-center">
          <GraduationCap className="w-16 h-16 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
          {lang === "ar" ? "لا توجد مراحل دراسية" : "No Stages Found"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {lang === "ar" 
            ? "لم يتم إضافة أي مراحل دراسية بعد"
            : "No educational stages have been added yet"}
        </p>
        <Link
          to={`/`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
};