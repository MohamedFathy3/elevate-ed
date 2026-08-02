/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/site/courses/types.ts

export interface Course {
  id: number;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  price?: string | number;
  discount?: string | number;
  original_price?: string | number;
  price_before_discount?: string | number;
  image?: {
    fullUrl?: string;
    previewUrl?: string;
  };
  imageUrl?: string;
  type?: 'online' | 'center';
  stage?: {
    id: number;
    name?: string;
    name_ar?: string;
  };
  subject?: {
    id: number;
    name?: string;
    name_ar?: string;
  };
  semester?: {
    id: number;
    name?: string;
    name_ar?: string;
  };
  offer_start_date?: string;
  offer_end_date?: string;
  attended?: boolean;
  must_pass_to_unlock?: boolean;
}

export interface CourseCardProps {
  course: Course;
  index: number;
  slug?: string;
  pick: (a?: string, b?: string) => string;
  lang: string;
  Arrow: React.ComponentType<any>;
  isDark: boolean;
}

export interface NatureCarouselProps {
  courses: Course[];
  pick: (a?: string, b?: string) => string;
  slug?: string;
  lang: string;
  Arrow: React.ComponentType<any>;
  dir: string;
  isDark: boolean;
}