/* eslint-disable @typescript-eslint/no-explicit-any */
// features/exam/hooks/useExamAnswers.ts
import { useState, useCallback } from 'react';
import { EssayAnswer } from '../types/exam.types';

export const useExamAnswers = () => {
  const [answers, setAnswers] = useState<Record<number, string | number | boolean | EssayAnswer>>({});
  const [essayImages, setEssayImages] = useState<Record<number, number[]>>({});

  const setAnswer = useCallback((questionId: number, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const addEssayImage = useCallback((questionId: number, imageId: number) => {
    setEssayImages(prev => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), imageId]
    }));
    
    // تحديث الإجابة
    const current = answers[questionId] as EssayAnswer || { text: '', images: [] };
    setAnswers(prev => ({
      ...prev,
      [questionId]: { 
        text: current.text || '', 
        images: [...(current.images || []), imageId] 
      }
    }));
  }, [answers]);

  const removeEssayImage = useCallback((questionId: number, imageId: number) => {
    setEssayImages(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || []).filter(id => id !== imageId)
    }));
    
    const current = answers[questionId] as EssayAnswer;
    if (current) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: {
          ...current,
          images: current.images.filter(id => id !== imageId)
        }
      }));
    }
  }, [answers]);

  const getAnsweredCount = useCallback(() => {
    return Object.keys(answers).filter(id => {
      const ans = answers[Number(id)];
      if (typeof ans === 'object' && ans !== null) {
        return (ans as EssayAnswer).text?.trim().length > 0 || (ans as EssayAnswer).images?.length > 0;
      }
      return ans !== undefined && ans !== null && ans !== '';
    }).length;
  }, [answers]);

  return {
    answers,
    essayImages,
    setAnswer,
    addEssayImage,
    removeEssayImage,
    getAnsweredCount,
  };
};