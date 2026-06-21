// types/exam.types.ts
export interface Answer {
  question_id: number;
  answer: string | number | boolean;
  image?: number; // ✅ صورة واحدة للـ API
}

export interface EssayAnswer {
  text: string;
  images: number[]; // ✅ للتخزين المحلي
}

export interface Question {
  id: number;
  question: string;
  question_ar?: string;
  question_type: 'true_false' | 'multiple_choice' | 'essay';
  mark: number;
  options?: { id: number; option_text: string }[];
  image?: { fullUrl: string };
}

export interface ExamState {
  answers: Record<number, string | number | boolean | EssayAnswer>;
  essayImages: Record<number, number[]>;
  submitted: boolean;
  timeLeft: number | null;
}