// src/pages/semesters/SemestersPage.types.ts

export interface Course {
  id: number;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  price?: string | number;
  original_price?: string | number;
  discount?: string | number;
  type?: 'online' | 'center';
  count_student?: number;
  semester_id?: number | null;
  image?: {
    fullUrl?: string;
    previewUrl?: string;
  };
  imageUrl?: string;
  details?: any[];
}

export interface Semester {
  id: number;
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price?: string | number;
  original_price?: string | number;
  discount?: string | number;
  type?: string;
  courses?: any[];
  image?: {
    fullUrl?: string;
    previewUrl?: string;
  };
  imageUrl?: string;
  offer_start_date?: string;
  offer_end_date?: string;
}

export interface SemesterCardProps {
  semester: Semester;
  index: number;
  slug: string;
  lang: string;
  pick: (a?: string, b?: string) => string;
  refetchSemesters: () => void;
  isNature: boolean;
}

export interface DirectCourseCardProps {
  course: Course;
  index: number;
  slug: string;
  lang: string;
  pick: (a?: string, b?: string) => string;
  isNature: boolean;
}

export interface SemestersFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  showFilters: boolean;
  setShowFilters: (s: boolean) => void;
  totalResults: number;
  lang: string;
  isNature: boolean;
  resetFilters: () => void;
  primaryGradient: string;
}

export interface SemestersHeaderProps {
  pageTitle: string;
  totalResults: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  lang: string;
  isNature: boolean;
  textPrimary: string;
}