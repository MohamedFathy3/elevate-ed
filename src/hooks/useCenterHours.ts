/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCenterHours.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface CenterHour {
  id: number;
  title: string;
  date: string;
  hours: string;
  note: string;
  teacher_id: number;
  createdAt: string;
}

export const useCenterHours = (teacherId?: number) => {
  return useQuery({
    queryKey: ['center-hours', teacherId],
    queryFn: async () => {
      const filters: any = {};
      if (teacherId) filters.teacher_id = teacherId;
      const { data } = await api.post('/center-hour/index', {
        filters,
        orderBy: "date",
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