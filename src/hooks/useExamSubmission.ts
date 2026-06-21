/* eslint-disable @typescript-eslint/no-explicit-any */
// features/exam/hooks/useExamSubmission.ts
import { useCallback } from 'react';
import { useSubmitExam, useExamResult } from '@/hooks/useExams';
import { EssayAnswer } from '../types/exam.types';

export const useExamSubmission = (examId: number, studentId: number, answers: Record<number, any>) => {
  const { mutate: submitExam, isPending } = useSubmitExam();
  const { refetch: refetchResult } = useExamResult(examId, studentId);

  const formatAnswers = useCallback(() => {
    return Object.entries(answers).map(([questionId, answer]) => {
      if (typeof answer === 'object' && answer !== null && 'text' in answer) {
        const essayAns = answer as EssayAnswer;
        const formatted: any = {
          question_id: parseInt(questionId),
          answer: essayAns.text || '',
        };
        
        // ✅ إضافة الصورة لو موجودة
        if (essayAns.images && essayAns.images.length > 0) {
          formatted.image = essayAns.images[0]; // API باخد صورة واحدة
        }
        
        return formatted;
      }

      // الأسئلة العادية
      return {
        question_id: parseInt(questionId),
        answer: Array.isArray(answer) ? answer.join(',') : answer.toString(),
      };
    });
  }, [answers]);

  const submit = useCallback((onSuccess?: () => void, onError?: (error: any) => void) => {
    const formatted = formatAnswers();
    submitExam({ examId, answers: formatted }, {
      onSuccess: () => {
        onSuccess?.();
        setTimeout(() => refetchResult(), 500);
      },
      onError: (error) => {
        onError?.(error);
      }
    });
  }, [examId, formatAnswers, submitExam, refetchResult]);

  return { submit, isPending };
};