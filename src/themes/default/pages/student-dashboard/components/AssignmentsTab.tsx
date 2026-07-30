// src/pages/student-dashboard/components/AssignmentsTab.tsx

import { ClipboardList } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { AssignmentResultCard } from "./AssignmentResultCard";

export const AssignmentsTab = ({ assignmentsList, slug, lang, isNature, isDark, cardBg }: any) => {
  if (assignmentsList.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد واجبات" : "No Assignments"}
        message={lang === "ar" ? "لم تقم بأي واجبات بعد" : "You haven't completed any assignments yet"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <ClipboardList className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {lang === "ar" ? "الواجبات التي قمت بها" : "Completed Assignments"}
        </h2>
      </div>

      <div className="space-y-3">
        {assignmentsList.map((assignmentItem: any, idx: number) => (
          <AssignmentResultCard
            key={assignmentItem.exam?.id || idx}
            assignmentItem={assignmentItem}
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