/* eslint-disable @typescript-eslint/no-explicit-any */
// features/lesson/types/lesson.types.ts

export interface LessonPart {
  id: number;
  title: string;
  title_ar: string;
  videoUrl: string;
  imageUrl?: string;
  description?: string;
  description_ar?: string;
}

export interface LessonData {
  id: number;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  course_id: number;
  imageUrl?: string;
  image?: { fullUrl: string };
  lession_date: string;
  lession_time: string;
  attended: boolean;
  must_pass_to_unlock: boolean;
  must_solve_assignment_to_unlock: boolean;
  exams: any[];
  assignments: any[];
  titles: string[];
  titles_ar: string[];
  link_video: string[];
  content_link?: string;
  pdfUrl?: string;
  pdf?: { fullUrl: string };
}

export interface LessonState {
  lesson: LessonData | null;
  attended: boolean;
  selectedPartIndex: number;
  videoError: boolean;
  isLocked: boolean;
  examPassed: boolean;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  type: 'assignment';
  total_marks: number;
  duration_minutes: number;
  time_end?: string;
  imageUrl?: string;
}