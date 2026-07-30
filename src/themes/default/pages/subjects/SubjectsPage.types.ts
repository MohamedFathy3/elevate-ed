// src/pages/subjects/SubjectsPage.types.ts

export interface Subject {
  id: number;
  name?: string;
  name_ar?: string;
  active?: boolean;
  position?: number;
  stage?: {
    id: number;
    name?: string;
    name_ar?: string;
  };
}

export interface SubjectsPageProps {
  // No props needed
}

export interface SubjectCardProps {
  subject: Subject;
  index: number;
  slug: string;
  lang: string;
  pick: (a?: string, b?: string) => string;
  primaryGradient: string;
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;
}

export interface SubjectsFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  selectedStageId: string;
  setSelectedStageId: (s: string) => void;
  showFilters: boolean;
  setShowFilters: (s: boolean) => void;
  stages: any[];
  totalResults: number;
  lang: string;
  pick: (a?: string, b?: string) => string;
  resetFilters: () => void;
  clearStageFilter: () => void;
  primaryGradient: string;
  inputBg: string;
  cardBorder: string;
  badgeBg: string;
}