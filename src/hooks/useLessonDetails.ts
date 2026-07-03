/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useLessonDetails.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useAttendance } from "./useAttendance";

export interface LessonDetail {
  id: number;
  course_id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  content_link: string;
  lession_date: string;
  lession_time: string;
  price: string;
  must_pass_to_unlock: boolean;
  discount: string;
  attended: boolean;
  createdAt: string;
  course?: {
    id: number;
    title: string;
    title_ar: string;
    description: string;
    imageUrl: string;
    price: string;
    discount: string;
    type: string;
  };
}

export const useLessonDetails = (lessonId: number, studentId?: number) => {
  const token = Cookies.get('student_token');
  const { mutate: recordAttendance } = useAttendance();
  
  const query = useQuery({
    queryKey: ['lesson-details', lessonId],
    queryFn: async () => {
      console.log(`🔄 Fetching lesson details for ID: ${lessonId}`);
      const response = await api.get(`/course-detail/${lessonId}`);
      console.log("📚 Lesson details response:", response.data);
      return response.data;
    },
    enabled: !!lessonId && !!token,
    staleTime: 0, // ✅ مهم: ميحفظش البيانات القديمة
    refetchOnMount: true, // ✅ يعيد الجلب عند تحميل الصفحة
    refetchOnWindowFocus: true, // ✅ يعيد الجلب عند التركيز على الصفحة
  });

  // ✅ تسجيل الحضور تلقائياً
  useEffect(() => {
    const lessonData = query.data?.data;
    
    if (lessonId && studentId && lessonData?.attended === false && token) {
      console.log("✅ Recording attendance for lesson:", lessonId);
      recordAttendance({
        lesson_id: lessonId,
        student_id: studentId,
      });
    }
  }, [lessonId, studentId, query.data, token]);

  return query;
};