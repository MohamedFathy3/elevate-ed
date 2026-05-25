// hooks/useLessonDetails.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Cookies from "js-cookie";

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

export const useLessonDetails = (lessonId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['lesson-details', lessonId],
    queryFn: async () => {
      const response = await api.get(`/course-detail/${lessonId}`);
      console.log("📚 Lesson details response:", response.data);
      return response.data;
    },
    enabled: !!lessonId && !!token,
    staleTime: 5 * 60 * 1000,
  });
};