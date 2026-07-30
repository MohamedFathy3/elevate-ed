// src/pages/stages/hooks/useStagesFilter.ts

import { useMemo } from 'react';
import { Stage } from '../StagesPage.types';

export const useStagesFilter = (
  stages: Stage[],
  searchQuery: string,
  sortBy: string,
  pick: (a?: string, b?: string) => string
) => {
  return useMemo(() => {
    if (!stages) return [];

    let filtered = [...stages];

    // ✅ فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter((stage: Stage) => {
        const stageName = pick(stage.name, stage.name_ar)?.toLowerCase() || "";
        const stageDesc = pick(stage.description, stage.description_ar)?.toLowerCase() || "";
        return stageName.includes(searchQuery.toLowerCase()) || 
               stageDesc.includes(searchQuery.toLowerCase());
      });
    }

    // ✅ ترتيب
    switch (sortBy) {
      case "name_asc":
        filtered.sort((a, b) => {
          const nameA = pick(a.name, a.name_ar) || "";
          const nameB = pick(b.name, b.name_ar) || "";
          return nameA.localeCompare(nameB);
        });
        break;
      case "name_desc":
        filtered.sort((a, b) => {
          const nameA = pick(a.name, a.name_ar) || "";
          const nameB = pick(b.name, b.name_ar) || "";
          return nameB.localeCompare(nameA);
        });
        break;
      case "courses_asc":
        filtered.sort((a, b) => (a.courses_count || 0) - (b.courses_count || 0));
        break;
      case "courses_desc":
        filtered.sort((a, b) => (b.courses_count || 0) - (a.courses_count || 0));
        break;
      default:
        filtered.sort((a, b) => (a.position || 0) - (b.position || 0));
        break;
    }

    return filtered;
  }, [stages, searchQuery, sortBy, pick]);
};