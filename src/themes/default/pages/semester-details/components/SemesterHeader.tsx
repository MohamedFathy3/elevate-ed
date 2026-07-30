// src/pages/semester-details/components/SemesterHeader.tsx

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SemesterHeaderProps } from "../SemesterDetails.types";

export const SemesterHeader = ({
  semesterName,
  lang,
  isNature,
  totalCourses,
}: SemesterHeaderProps) => {
  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-foreground/60 flex-wrap">
        <Link to={``} className={`hover:${isNature ? 'text-amber-600' : 'text-primary'} transition-colors`}>
          {lang === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/semesters`} className={`hover:${isNature ? 'text-amber-600' : 'text-primary'} transition-colors`}>
          {lang === "ar" ? "الترمات" : "Semesters"}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className={`${isNature ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'} line-clamp-1`}>
          {semesterName}
        </span>
      </div>

      {/* Title - LCP element */}
      <h1 className={`text-3xl md:text-4xl font-black ${isNature ? 'text-amber-800 dark:text-amber-100' : ''}`}>
        {semesterName}
      </h1>
      <p className={`text-foreground/60 mt-2 ${isNature ? 'text-amber-600/70 dark:text-amber-400/70' : ''}`}>
        {lang === "ar" 
          ? `استعرض جميع الكورسات المتاحة في ${semesterName}`
          : `Browse all courses available in ${semesterName}`}
      </p>
    </div>
  );
};