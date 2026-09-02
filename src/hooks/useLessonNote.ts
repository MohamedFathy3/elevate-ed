/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useLessonNote.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "@/hooks/use-toast";

interface LessonNote {
  id: number;
  student_id: number;
  course_detail_id: number;
  note: string;
  created_at: string;
  updated_at: string;
}

interface SaveNoteResponse {
  result: string;
  data: LessonNote;
  message: string;
  status: number;
}

// ✅ جلب الملاحظة
export const useLessonNote = (lessonId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['lesson-note', lessonId],
    queryFn: async () => {
      if (!lessonId || lessonId === 0) return null;
      try {
        const { data } = await api.get(`/lessons/${lessonId}/note`);
        return data?.data as LessonNote | null;
      } catch (error: any) {
        // ✅ إذا كان 404 معناها مفيش ملاحظة
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!token && !!lessonId && lessonId !== 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// ✅ حفظ/تحديث الملاحظة
export const useSaveLessonNote = () => {
  const queryClient = useQueryClient();
  const token = Cookies.get('student_token');

  return useMutation({
    mutationFn: async ({ lessonId, note }: { lessonId: number; note: string }) => {
      if (!token) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      
      const { data } = await api.post<SaveNoteResponse>(
        `/lessons/${lessonId}/note`,
        { note }
      );
      return data.data;
    },
    onSuccess: (data, variables) => {
      // ✅ تحديث الكاش
      queryClient.invalidateQueries({ 
        queryKey: ['lesson-note', variables.lessonId] 
      });
      
      toast({
        title: "✅ تم حفظ الملاحظة",
        description: "تم حفظ ملاحظتك بنجاح",
      });
    },
    onError: (error: any) => {
      console.error('❌ Error saving note:', error);
      toast({
        title: "❌ حدث خطأ",
        description: error?.message || "لم نتمكن من حفظ الملاحظة",
        variant: "destructive",
      });
    },
  });
};

// ✅ حذف الملاحظة (اختياري)
export const useDeleteLessonNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: number) => {
      const { data } = await api.delete(`/lessons/${lessonId}/note`);
      return data;
    },
    onSuccess: (data, lessonId) => {
      queryClient.invalidateQueries({ 
        queryKey: ['lesson-note', lessonId] 
      });
      
      toast({
        title: "✅ تم حذف الملاحظة",
        description: "تم حذف ملاحظتك بنجاح",
      });
    },
    onError: (error: any) => {
      console.error('❌ Error deleting note:', error);
      toast({
        title: "❌ حدث خطأ",
        description: "لم نتمكن من حذف الملاحظة",
        variant: "destructive",
      });
    },
  });
};