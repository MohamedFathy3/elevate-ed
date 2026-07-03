// hooks/useSafeTeacherData.ts
import { useTeacher } from "@/context/TeacherContext";

export const useSafeTeacherData = () => {
  const { 
    teacher, 
    slug, 
    pick, 
    isLoading, 
    error, 
    centerHours,  // ✅ خدها من context
    stages,
    courses,
    books,
    features,
    about,
    footer,
    future,
    home,
    featured_courses
  } = useTeacher();
  
  // Safe access with fallbacks
  const safeData = {
    // ✅ من teacher
    teacher: teacher,
    slug: slug,
    isLoading: isLoading,
    error: error,
    
    // ✅ من teacher?.website
    books: teacher?.website?.books || books || [],
    stages: teacher?.website?.stages || stages || [],
    features: teacher?.website?.features || features || [],
    courses: teacher?.website?.courses || courses || [],
    about: teacher?.website?.about || about || null,
    footer: teacher?.website?.footer || footer || null,
    future: teacher?.website?.future || future || [],
    home: teacher?.website?.home || home || null,
    featured_courses: teacher?.website?.featured_courses || featured_courses || [],
    
    // ✅ centerHours من context مباشرة (مش من teacher?.website)
    centerHours: centerHours || [],
    
    // ✅ stats من about
    stats: teacher?.website?.about?.stats || [],
  };
  
  return {
    ...safeData,
    pick,
    hasData: !!teacher && !isLoading && !error,
    centerHoursCount: safeData.centerHours.length,
    hasCenterHours: safeData.centerHours.length > 0,
  };
};