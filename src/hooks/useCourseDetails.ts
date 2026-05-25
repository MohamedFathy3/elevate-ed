// hooks/useCourseDetails.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Cookies from "js-cookie";

export interface CourseDetail {
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

export const useCourseDetails = (courseId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['course-details', courseId],
    queryFn: async () => {
      const response = await api.post('/course-detail/index', {
        filters: {
          course_id: courseId
        },
        orderBy: "id",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      console.log("📚 Course details response:", response.data);
      return response.data;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};