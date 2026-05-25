/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useExams.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "sonner";

export interface Exam {
  id: number;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  type: 'exam' | 'assignment';
  course_detail_id: number;
  questions: any[];
  total_marks: number;
  duration_minutes: number;
  random_questions: boolean;
  random_answers: boolean;
  show_result: boolean;
  imageUrl?: string;
}

// جلب الامتحانات والواجبات الخاصة بالدرس
export const useLessonExams = (courseDetailId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['lesson-exams', courseDetailId],
    queryFn: async () => {
      const examsResponse = await api.post('/exam/index', {
        filters: {
          course_detail_id: courseDetailId,
          type: 'exam'
        },
        orderBy: "id",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      
      const assignmentsResponse = await api.post('/exam/index', {
        filters: {
          course_detail_id: courseDetailId,
          type: 'assignment'
        },
        orderBy: "id",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      
      const exams = examsResponse.data.data || [];
      const assignments = assignmentsResponse.data.data || [];
      
      return {
        data: [...exams, ...assignments],
        exams,
        assignments
      };
    },
    enabled: !!token && !!courseDetailId,
    staleTime: 5 * 60 * 1000,
  });
};

// جلب تفاصيل امتحان معين
export const useExamDetails = (examId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['exam-details', examId],
    queryFn: async () => {
      const response = await api.get(`/exam/${examId}`);
      console.log("📝 Exam details:", response.data);
      return response.data;
    },
    enabled: !!token && !!examId,
    staleTime: 0,
  });
};

// جلب أسئلة الامتحان
export const useExamQuestions = (examId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['exam-questions', examId],
    queryFn: async () => {
      const response = await api.get(`/exams/${examId}/questions`);
      console.log("📝 Exam questions:", response.data);
      return response.data;
    },
    enabled: !!token && !!examId,
    staleTime: 0,
  });
};

// تقديم الامتحان
export const useSubmitExam = () => {
  const queryClient = useQueryClient();
  const token = Cookies.get('student_token');
  const studentData = Cookies.get('student_data');
  const student = studentData ? JSON.parse(studentData) : null;
  
  return useMutation({
    mutationFn: async ({ examId, answers }: { examId: number; answers: any[] }) => {
      const payload = {
        exam_id: examId,
        student_id: student?.id,
        answers: answers.map(a => ({
          question_id: a.question_id,
          answer: a.answer
        }))
      };
      console.log("📝 Submit exam payload:", payload);
      const response = await api.post('/exam/submit', payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data.status === 200 || data.status === 201) {
        toast.success("تم تقديم الامتحان بنجاح!");
        queryClient.invalidateQueries({ queryKey: ['exam-result', variables.examId] });
        queryClient.invalidateQueries({ queryKey: ['exam-questions', variables.examId] });
      } else {
        toast.error(data.message || "فشل تقديم الامتحان");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ ما");
    },
  });
};

// ✅ جلب نتيجة الامتحان (exam_id أولاً ثم student_id)
export const useExamResult = (examId: number, studentId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['exam-result', examId, studentId],
    queryFn: async () => {
      // الترتيب الجديد: exam_id أولاً ثم student_id
      const response = await api.get(`/exam/result/${examId}/${studentId}`);
      console.log("📊 Exam result response:", response.data);
      return response.data;
    },
    enabled: !!token && !!examId && !!studentId,
    staleTime: 60 * 1000,
    retry: 1,
  });
};