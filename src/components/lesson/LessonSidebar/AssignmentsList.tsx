/* eslint-disable @typescript-eslint/no-explicit-any */
// components/lesson/AssignmentsList.tsx
import { motion } from 'framer-motion';
import { ClipboardList, FileText, Award, Calendar } from 'lucide-react';

interface AssignmentsListProps {
  assignments: any[];
  onStartAssignment: (assignment: any) => void;
  lang: string;
}

export const AssignmentsList = ({ assignments, onStartAssignment, lang }: AssignmentsListProps) => {
  if (assignments.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          {lang === "ar" ? "الواجبات" : "Assignments"}
        </h3>
      </div>

      <div className="space-y-3">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{assignment.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{assignment.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span><Award className="w-3 h-3 inline" /> {assignment.total_marks} {lang === "ar" ? "درجة" : "marks"}</span>
              {assignment.time_end && (
                <span><Calendar className="w-3 h-3 inline" /> {new Date(assignment.time_end).toLocaleDateString()}</span>
              )}
            </div>
            <button
              onClick={() => onStartAssignment(assignment)}
              className="w-full mt-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <FileText className="w-3 h-3" />
              {lang === "ar" ? "حل الواجب" : "Solve Assignment"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};