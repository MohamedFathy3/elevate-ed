// features/exam/components/ExamHeader.tsx
import { Clock, FileQuestion, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExamHeaderProps {
  title: string;
  description?: string;
  image?: string;
  totalQuestions: number;
  totalMarks: number;
  duration?: number;
  answeredCount: number;
  onBack: () => void;
}

export const ExamHeader = ({
  title,
  description,
  image,
  totalQuestions,
  totalMarks,
  duration,
  answeredCount,
  onBack
}: ExamHeaderProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 transition-all"
        >
          <span>←</span>
          <span>العودة</span>
        </button>
        
        <div className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium">
          {answeredCount}/{totalQuestions} تمت الإجابة
        </div>
      </div>
      
      <div className="text-center mb-6">
        {image && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg"
          >
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </motion.div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && (
          <p className="text-foreground/50 mt-2 max-w-xl mx-auto">{description}</p>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
          <FileQuestion className="w-4 h-4 text-primary" />
          <span>{totalQuestions} أسئلة</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
          <Award className="w-4 h-4 text-amber-500" />
          <span>{totalMarks} درجة</span>
        </div>
        {duration && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{duration} دقائق</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};