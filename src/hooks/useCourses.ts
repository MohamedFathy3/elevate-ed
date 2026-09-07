/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCourses.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useStudentAuth } from '@/context/StudentAuthContext';

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
}

export interface Course {
  id: number;
  teacher_id: number;
  stage_id: number;
  subject_id: number;
  semester_id: number;
  price: string;
  discount: string;
  price_before_discount: number;
  details: CourseDetail[];
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  about: string;
  about_ar: string;
  hour_time_course: string;
  type: string;
  count_student: number;
  start_date: string;
  end_date: string;
  active: number;
  imageUrl: string;
  image: any;
  time_duration: string | null;
  createdAt: string;
  isPurchased?: boolean;
  semester?: {
    id: number;
    name: string;
    name_ar: string;
  };
  subject?: {
    id: number;
    name: string;
    name_ar: string | null;
  };
}

interface CoursesResponse {
  data: Course[];
  links: any;
  meta: any;
  result: string;
  message: string;
  status: number;
}

export const useCourses = (semesterId?: number, teacherId?: number) => {
  const { student, isAuthenticated } = useStudentAuth();
  const stageId = student?.stage_id;

  return useQuery({
    queryKey: ['courses', semesterId, teacherId, stageId],
    queryFn: async () => {
      const filters: any = {};
      if (semesterId) filters.semester_id = semesterId;
      if (teacherId) filters.teacher_id = teacherId;
      filters.active = true;
      
      if (stageId) {
        filters.stage_id = stageId;
      }
      
      const { data } = await api.post<CoursesResponse>('/course/index', {
        filters,
        orderBy: "id",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      
      const courses = Array.isArray(data?.data) ? data.data : [];
      
      return courses.map((course: any) => ({
        ...course,
        isPurchased: course?.isPurchased === true,
      }));
    },
    enabled: (!!semesterId || !!teacherId) && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseDetails = (courseId?: number) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/course/${courseId}`);
      return data?.data ?? null;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubjectCourses = (subjectId?: number, teacherId?: number) => {
  const { student, isAuthenticated } = useStudentAuth();
  const stageId = student?.stage_id;

  return useQuery({
    queryKey: ['subject-courses', subjectId, teacherId, stageId],
    queryFn: async () => {
      const filters: any = {};
      if (subjectId) filters.subject_id = subjectId;
      if (teacherId) filters.teacher_id = teacherId;
      filters.active = true;
      
      if (stageId) {
        filters.stage_id = stageId;
      }
      
      const { data } = await api.post<CoursesResponse>('/course/index', {
        filters,
        orderBy: "id",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      
      const courses = Array.isArray(data?.data) ? data.data : [];
      
      return courses.map((course: any) => ({
        ...course,
        isPurchased: course?.isPurchased === true,
      }));
    },
    enabled: !!subjectId && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSemesterCourses = (semesterId: number) => {
  const { student, isAuthenticated } = useStudentAuth();
  const stageId = student?.stage_id;

  return useQuery({
    queryKey: ['semester-courses', semesterId, stageId],
    queryFn: async () => {
      const filters: any = {
        semester_id: semesterId,
        active: true,
      };
      
      if (stageId) {
        filters.stage_id = stageId;
      }
      
      const response = await api.post('/course/index', {
        filters,
        orderBy: "id",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      
      const courses = Array.isArray(response.data?.data) ? response.data.data : [];
      
      return {
        ...response.data,
        data: courses.map((course: any) => ({
          ...course,
          isPurchased: course?.isPurchased === true,
        })),
      };
    },
    enabled: !!semesterId && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseDetailsById = (courseId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['course-details', courseId],
    queryFn: async () => {
      const response = await api.get(`/course/${courseId}`);
      return response.data;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStudentCourses = () => {
  const { student, isAuthenticated } = useStudentAuth();
  const stageId = student?.stage_id;

  return useQuery({
    queryKey: ['student-courses', stageId],
    queryFn: async () => {
      const filters: any = {
        active: true,
      };
      
      if (stageId) {
        filters.stage_id = stageId;
      }
      
      const { data } = await api.post<CoursesResponse>('/course/index', {
        filters,
        orderBy: "id",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      
      const courses = Array.isArray(data?.data) ? data.data : [];
      
      return courses.map((course: any) => ({
        ...course,
        isPurchased: course?.isPurchased === true,
      }));
    },
    enabled: isAuthenticated && !!stageId,
    staleTime: 5 * 60 * 1000,
  });
};