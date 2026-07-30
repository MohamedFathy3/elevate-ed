/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/student-dashboard/components/AssignmentResultCard.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ClipboardList, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

interface AssignmentResultCardProps {
  assignmentItem: any;
  lang: string;
  slug: string;
  isNature: boolean;
  isDark: boolean;
  cardBg: string;
}

export const AssignmentResultCard = ({ 
  assignmentItem, 
  lang, 
  slug, 
  isNature, 
  isDark, 
  cardBg 
}: AssignmentResultCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const assignment = assignmentItem.exam;
  const studentMark = assignmentItem.student_mark || 0;
  const totalMarks = assignment?.total_marks || 0;
  const percentage = totalMarks > 0 ? (studentMark / totalMarks) * 100 : 0;
  const questions = assignmentItem.questions || [];
  
  const gradientClass = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-accent to-pink-500";
  
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`rounded-xl p-4 transition-all cursor-pointer ${cardBg}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isNature ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-accent/20'}`}>
              <ClipboardList className={`w-4 h-4 ${isNature ? 'text-amber-600' : 'text-accent'}`} />
            </div>
            <h3 className={`font-bold ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>
              {assignment?.title || (lang === "ar" ? "واجب" : "Assignment")}
            </h3>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-sm mt-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "درجتك" : "Your Score"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{studentMark}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "الدرجة الكلية" : "Total Marks"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{totalMarks}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "النسبة" : "Percentage"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{percentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        {/* View Details Button */}
        <Link
          to={`/exam/${assignment?.id}`}
          className={`px-4 py-2 rounded-lg bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold flex items-center gap-1`}
          onClick={(e) => e.stopPropagation()}
        >
          <Eye className="w-4 h-4" />
          {lang === "ar" ? "عرض التفاصيل" : "View Details"}
        </Link>
      </div>
      
      {/* Expanded Questions */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
        >
          <h4 className={`font-semibold mb-3 text-sm ${getTextColor()}`}>
            {lang === "ar" ? "تفاصيل الأسئلة" : "Question Details"}
          </h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((q: any, idx: number) => (
              <QuestionDetailCard 
                key={q.id} 
                question={q} 
                index={idx} 
                lang={lang} 
                isDark={isDark} 
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ✅ Question Detail Card
const QuestionDetailCard = ({ question, index, lang, isDark }: any) => {
  const isCorrect = question.is_correct === true;
  const isEssay = question.correct_answer === null;
  
  return (
    <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : isEssay ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : isEssay ? <Clock className="w-4 h-4 text-yellow-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        <div className="flex-1">
          <p className={`font-medium text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            {index + 1}. {question.question}
          </p>
          <div className="mt-1 text-xs space-y-1">
            <p>
              <span className="text-gray-500 dark:text-gray-400">
                {lang === "ar" ? "إجابتك:" : "Your answer:"}
              </span> 
              {question.student_answer || "-"}
            </p>
            {question.correct_answer && (
              <p>
                <span className="text-gray-500 dark:text-gray-400">
                  {lang === "ar" ? "الإجابة الصحيحة:" : "Correct answer:"}
                </span> 
                <span className="text-green-600">{question.correct_answer}</span>
              </p>
            )}
            <p>
              <span className="text-gray-500 dark:text-gray-400">
                {lang === "ar" ? "الدرجة:" : "Mark:"}
              </span> 
              {question.mark_obtained || 0}/{question.mark}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};