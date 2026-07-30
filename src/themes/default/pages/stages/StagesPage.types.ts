// src/pages/stages/StagesPage.types.ts

export interface Stage {
  id: number;
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  courses_count?: number;
  students_count?: number;
  position?: number;
  image?: {
    fullUrl?: string;
    previewUrl?: string;
  };
  imageUrl?: string;
  active?: boolean;
}

export interface StageCardProps {
  stage: Stage;
  index: number;
  lang: string;
  pick: (a?: string, b?: string) => string;
  isAuthenticated: boolean;
  studentStageId: number | null;
  onNavigate: (path: string) => void;
  stageColors: string[];
}

export interface StagesFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  showFilters: boolean;
  setShowFilters: (s: boolean) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (f: string[]) => void;
  totalResults: number;
  lang: string;
  resetFilters: () => void;
}

export interface StagesHeaderProps {
  lang: string;
  totalStages: number;
}

export interface StagesStatsProps {
  stages: Stage[];
  lang: string;
}

export interface StagesSkeletonProps {
  // No props
}

export interface EmptyStagesProps {
  slug: string;
  lang: string;
}