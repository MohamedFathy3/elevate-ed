// hooks/useLessonParts.ts
import { useState, useMemo, useCallback } from 'react';

export interface LessonPart {
  id: number;
  title: string;
  title_ar: string;
  videoUrl: string;
  imageUrl?: string;
  description?: string;
  description_ar?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLessonParts = (lesson: any | null) => {
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);

  // استخراج الأجزاء من بيانات الدرس
  const parts = useMemo((): LessonPart[] => {
    if (!lesson) return [];
    
    return (lesson.titles || []).map((title: string, idx: number) => ({
      id: idx,
      title: title,
      title_ar: lesson.titles_ar?.[idx] || title,
      videoUrl: lesson.link_video?.[idx] || lesson.content_link || '',
      imageUrl: lesson.imageUrl,
      description: lesson.description,
      description_ar: lesson.description_ar,
    }));
  }, [lesson]);

  // الجزء الحالي
  const currentPart = useMemo(() => {
    return parts[selectedPartIndex] || parts[0] || null;
  }, [parts, selectedPartIndex]);

  // تغيير الجزء
  const selectPart = useCallback((index: number) => {
    if (index >= 0 && index < parts.length) {
      setSelectedPartIndex(index);
      return true;
    }
    return false;
  }, [parts.length]);

  return {
    parts,
    currentPart,
    selectedPartIndex,
    selectPart,
    totalParts: parts.length,
    setSelectedPartIndex,
  };
};