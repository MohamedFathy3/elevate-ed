// src/pages/semester-details/SemesterDetails.types.ts

export interface Course {
  id: number;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  price?: string | number;
  discount?: string | number;
  type?: 'online' | 'center';
  count_student?: number;
  image?: {
    fullUrl?: string;
    previewUrl?: string;
  };
  imageUrl?: string;
  subject?: {
    id: number;
    name?: string;
    name_ar?: string;
  };
  details?: Lesson[];
}

export interface Lesson {
  id: number;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  price?: string | number;
  lession_date?: string;
  lession_time?: string;
  attended?: boolean;
  must_pass_to_unlock?: boolean;
}

export interface Semester {
  id: number;
  name?: string;
  name_ar?: string;
}

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  isNature: boolean;
}

export interface CourseSectionProps {
  course: Course;
  index: number;
  slug: string;
  lang: string;
  pick: (a?: string, b?: string) => string;
  isAuthenticated: boolean;
  studentId?: number;
  navigate: (path: string) => void;
  isNature: boolean;
  isDark: boolean;
  primaryGradient: string;
}

export interface LessonItemProps {
  lesson: Lesson;
  index: number;
  slug: string;
  lang: string;
  isAuthenticated: boolean;
  isNature: boolean;
  isDark: boolean;
}

export interface SemesterHeaderProps {
  semesterName: string;
  lang: string;
  isNature: boolean;
  totalCourses: number;
}

export interface SemesterSkeletonProps {
  isNature: boolean;
}