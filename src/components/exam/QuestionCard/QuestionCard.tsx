/* eslint-disable @typescript-eslint/no-explicit-any */
// features/exam/components/QuestionCard/QuestionCard.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronUp, ChevronDown, Award, HelpCircle } from 'lucide-react';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { EssayQuestion } from './EssayQuestion';
import { Question } from '@/types/exam.types';

interface QuestionCardProps {
  question: Question;
  index: number;
  value: any;
  onChange: (value: any) => void;
  lang: string;
  disabled?: boolean;
  onEssayImageUpload?: (imageId: number) => void;
  onRemoveEssayImage?: (imageId: number) => void;
  essayImages?: number[];
}

export const QuestionCard = ({
  question,
  index,
  value,
  onChange,
  lang,
  disabled,
  onEssayImageUpload,
  onRemoveEssayImage,
  essayImages = []
}: QuestionCardProps) => {
  const [expanded, setExpanded] = useState(true);
  const questionText = lang === "ar" && question.question_ar ? question.question_ar : question.question;
  const isAnswered = value !== undefined && value !== null && value !== '';

  // ✅ التحقق من الإجابة المقالية
  const isEssayAnswered = (val: any) => {
    if (typeof val === 'object' && val !== null && 'text' in val) {
      return val.text?.trim().length > 0 || val.images?.length > 0;
    }
    return val !== undefined && val !== null && val !== '';
  };

  const answered = isEssayAnswered(value);

  const renderQuestionType = () => {
    switch (question.question_type) {
      case 'true_false':
        return (
          <TrueFalseQuestion
            value={value}
            onChange={onChange}
            disabled={disabled}
            lang={lang}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            options={question.options || []}
            value={value}
            onChange={onChange}
            disabled={disabled}
            lang={lang}
          />
        );
      case 'essay':
        return (
          <EssayQuestion
            value={value}
            onChange={onChange}
            disabled={disabled}
            lang={lang}
            onImageUpload={onEssayImageUpload}
            onRemoveImage={onRemoveEssayImage}
            essayImages={essayImages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white dark:bg-gray-800/50 rounded-2xl border transition-all duration-300 ${
        answered ? 'border-green-500/50 shadow-lg shadow-green-500/10' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="p-5 cursor-pointer" onClick={() => !disabled && setExpanded(!expanded)}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
            answered ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-primary to-primary/70'
          }`}>
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-lg leading-relaxed">{questionText}</p>
              {!disabled && (
                <button className="text-foreground/40 hover:text-primary transition-colors">
                  {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Question Image */}
            {question.image?.fullUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-3">
                <img src={question.image.fullUrl} alt="Question" className="max-h-48 rounded-xl shadow-md border" />
              </motion.div>
            )}

            {/* Badges */}
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs">
                <Award className="w-3 h-3" />
                {question.mark} درجة
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs capitalize">
                <HelpCircle className="w-3 h-3" />
                {question.question_type === 'true_false' && 'صح/خطأ'}
                {question.question_type === 'multiple_choice' && 'اختيار من متعدد'}
                {question.question_type === 'essay' && 'مقالي'}
              </span>
            </div>
          </div>

          {answered && (
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          )}
        </div>
      </div>

      {/* Answer Area */}
      <AnimatePresence>
        {expanded && !disabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700 mt-2">
              {renderQuestionType()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};