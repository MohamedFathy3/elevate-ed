/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/semesters/hooks/useSemestersFilter.ts

import { useMemo } from 'react';

export const useSemestersFilter = (
  semesters: any[],
  searchQuery: string,
  priceRange: [number, number],
  selectedType: string,
  sortBy: string,
  pick: (a?: string, b?: string) => string
) => {
  return useMemo(() => {
    if (!semesters) return [];
    
    let filtered = [...semesters];
    
    // ✅ فلترة حسب السعر
    filtered = filtered.filter((s: any) => {
      const price = parseFloat(s?.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // ✅ فلترة حسب النوع
    if (selectedType !== "all") {
      filtered = filtered.filter((s: any) => s.type === selectedType);
    }
    
    // ✅ فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter((s: any) => {
        const name = pick(s.name, s.name_ar)?.toLowerCase() || "";
        return name.includes(searchQuery.toLowerCase());
      });
    }
    
    // ✅ ترتيب
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => (parseFloat(a?.price) || 0) - (parseFloat(b?.price) || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (parseFloat(b?.price) || 0) - (parseFloat(a?.price) || 0));
        break;
      case "popularity":
        filtered.sort((a, b) => (b.courses?.length || 0) - (a.courses?.length || 0));
        break;
      default:
        break;
    }
    
    return filtered;
  }, [semesters, searchQuery, priceRange, selectedType, sortBy, pick]);
};

export const useDirectCoursesFilter = (
  courses: any[],
  searchQuery: string,
  priceRange: [number, number],
  selectedType: string,
  sortBy: string,
  pick: (a?: string, b?: string) => string
) => {
  return useMemo(() => {
    if (!courses) return [];
    
    // ✅ فلترة: بس اللي semester_id = null
    let filtered = courses.filter((c: any) => c.semester_id === null);
    
    // ✅ فلترة حسب السعر
    filtered = filtered.filter((c: any) => {
      const price = parseFloat(c?.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // ✅ فلترة حسب النوع
    if (selectedType !== "all") {
      filtered = filtered.filter((c: any) => c.type === selectedType);
    }
    
    // ✅ فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter((c: any) => {
        const title = pick(c.title, c.title_ar)?.toLowerCase() || "";
        return title.includes(searchQuery.toLowerCase());
      });
    }
    
    // ✅ ترتيب
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => (parseFloat(a?.price) || 0) - (parseFloat(b?.price) || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (parseFloat(b?.price) || 0) - (parseFloat(a?.price) || 0));
        break;
      case "popularity":
        filtered.sort((a, b) => (b.count_student || 0) - (a.count_student || 0));
        break;
      default:
        break;
    }
    
    return filtered;
  }, [courses, searchQuery, priceRange, selectedType, sortBy, pick]);
};