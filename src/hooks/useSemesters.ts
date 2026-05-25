/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useSemesters.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Semester {
  id: number;
  name: string;
  name_ar: string;
  active: boolean;
  price: string;
  discount: string;
  teacher_id: number;
  subject_id: number;
  courses: any[];
  createdAt: string;
}

interface SemestersResponse {
  data: Semester[];
  links: any;
  meta: any;
  result: string;
  message: string;
  status: number;
}

export const useSemesters = (teacherId?: number, subjectId?: number) => {
  return useQuery({
    queryKey: ['semesters', teacherId, subjectId],
    queryFn: async () => {
      const filters: any = {};
      if (teacherId) filters.teacher_id = teacherId;
      if (subjectId) filters.subject_id = subjectId;
      
      const { data } = await api.post<SemestersResponse>('/semesters/index', {
        filters,
        orderBy: "id",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      
      return data.data;
    },
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};