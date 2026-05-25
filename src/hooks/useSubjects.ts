/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useSubjects.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Subject {
  id: number;
  name: string;
  name_ar: string | null;
  position: number;
  active: boolean;
  stage_id: number;
  stage: {
    id: number;
    name: string;
    name_ar: string | null;
    position: number;
    active: boolean;
    image: string | null;
    createdAt: string;
  };
  createdAt: string;
}

interface SubjectsResponse {
  data: Subject[];
  links: any;
  meta: any;
  result: string;
  message: string;
  status: number;
}

export const useSubjects = (stageId?: number, teacherId?: number) => {
  return useQuery({
    queryKey: ['subjects', stageId,],
    queryFn: async () => {
      const filters: any = {};
      if (stageId) filters.stage_id = stageId;
      
      const { data } = await api.post<SubjectsResponse>('/subject/index', {
        filters,
        orderBy: "position",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      
      return data.data;
    },
    enabled: !!stageId || !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};