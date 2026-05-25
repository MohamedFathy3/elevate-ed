// hooks/useSafeTeacher.ts
import { useTeacher } from "@/context/TeacherContext";

export const useSafeTeacher = () => {
  try {
    return useTeacher();
  } catch (error) {
    // لو الـ Provider مش موجود، نرجع بيانات افتراضية
    return {
      teacher: null,
      slug: "",
      isLoading: false,
      error: null,
      refetch: () => {},
      pick: (en?: string, ar?: string) => (en || ar || ""),
    };
  }
};