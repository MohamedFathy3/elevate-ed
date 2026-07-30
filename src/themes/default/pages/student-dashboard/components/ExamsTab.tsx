// src/pages/student-dashboard/components/ExamsTab.tsx

import { FileQuestion } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ExamResultCard } from "./ExamResultCard";

export const ExamsTab = ({ examsList, slug, lang, isNature, isDark, cardBg }: any) => {
  if (examsList.length === 0) {
    return (
      <EmptyState
        icon={<FileQuestion className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد امتحانات" : "No Exams"}
        message={lang === "ar" ? "لم تقم بأي امتحانات بعد" : "You haven't taken any exams yet"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <FileQuestion className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {lang === "ar" ? "الامتحانات التي قمت بها" : "Completed Exams"}
        </h2>
      </div>

      <div className="space-y-3">
        {examsList.map((examItem: any, idx: number) => (
          <ExamResultCard
            key={examItem.exam?.id || idx}
            examItem={examItem}
            lang={lang}
            slug={slug!}
            isNature={isNature}
            isDark={isDark}
            cardBg={cardBg}
          />
        ))}
      </div>
    </div>
  );
};