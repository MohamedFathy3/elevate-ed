// hooks/useSafeTeacherData.ts
import { useTeacher } from "@/context/TeacherContext";

export const useSafeTeacherData = () => {
  const { teacher, slug, pick, isLoading, error,centerHours  } = useTeacher();
  
  // Safe access with fallbacks
  const safeData = {
    books: teacher?.website?.books || [],
    stages: teacher?.website?.stages || [],
    features: teacher?.website?.features || [],
    courses: teacher?.website?.courses || [],
    about: teacher?.website?.about || null,
      future: teacher?.website?.future || [], 
    stats: teacher?.website?.about?.stats || [],
     centerHours: centerHours || [], 
  };
  
  return {
    ...safeData,
    teacher,
    slug,
    pick,
    isLoading,
    error,
    hasData: !!teacher && !isLoading && !error,
  };
};