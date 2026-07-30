/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/subjects/hooks/useSubjectsFilter.ts

import { useMemo } from 'react';

export const useSubjectsFilter = (
  subjects: any[],
  searchQuery: string,
  sortBy: string,
  pick: (a?: string, b?: string) => string
) => {
  return useMemo(() => {
    if (!subjects.length) return [];

    let filtered = [...subjects];

    // ✅ فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter((subject: any) => {
        const subjectName = pick(subject.name, subject.name_ar)?.toLowerCase() || "";
        return subjectName.includes(searchQuery.toLowerCase());
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
      default:
        filtered.sort((a, b) => (a.position || 0) - (b.position || 0));
        break;
    }

    return filtered;
  }, [subjects, searchQuery, sortBy, pick]);
};