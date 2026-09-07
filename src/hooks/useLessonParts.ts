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
    
    const titles = Array.isArray(lesson.titles) ? lesson.titles : [];
    const titlesAr = Array.isArray(lesson.titles_ar) ? lesson.titles_ar : [];
    const videoLinks = Array.isArray(lesson.link_video) ? lesson.link_video : [];
    const partCount = Math.max(titles.length, videoLinks.length);

    return Array.from({ length: partCount }, (_, idx) => {
      const fallbackTitle = `Part ${idx + 1}`;
      const title = titles[idx] || fallbackTitle;

      return {
        id: idx,
        title,
        title_ar: titlesAr[idx] || title,
        videoUrl: videoLinks[idx] || videoLinks[0] || lesson.content_link || '',
        imageUrl: lesson.imageUrl,
        description: lesson.description,
        description_ar: lesson.description_ar,
      };
    });
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