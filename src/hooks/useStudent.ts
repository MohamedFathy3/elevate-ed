/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useStudent.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast  } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTeacher } from "@/context/TeacherContext";
import { useMemo } from "react";

// 🟢 Types
export interface StudentRegisterData {
  name: string;
  phone: string;
  password: string;
  phone_parent?: string;
  type_of_attendance: 'online' | 'center';
  gender: 'male' | 'female';
  teacher_id: number;
  stage_id: number;
  center_hour_id?: number;
  // الحقول الجديدة
  governorate?: string;
  school_name?: string;
  type_of_study?: 'general' | 'azhar';
  profile?: number | null;
}
export interface StudentLoginData {
  phone: string;
  password: string;
  type: 'student' | 'parent';
}

export interface StudentLoginResponse {
  result: string;
  message: string;
  status: number;
  data?: {
    token: string;
    student: {
      id: number;
      name: string;
      phone: string;
      type_of_attendance: string;
      gender: string;
    };
  };
}

export interface StudentProfileData {
  status: boolean;
  data: {
    student: {
      id: number;
      name: string;
      phone: string;
      phone_parent: string;
      code_parent: string;
      type_of_attendance: string | null;
      gender: string | null;
      active: boolean;
      teacher_id: number;
      stage_id: number;
      created_at: string;
    };
    semesters: any[];
    courses: any[];
    lessons: any[];
  };
}

export interface AnswerSubmit {
  question_id: number;
  answer: string | string[];
}

export interface ExamSubmitData {
  exam_id: number;
  student_id: number;
  answers: AnswerSubmit[];
}

export interface ExamResult {
  status: boolean;
  exam_id: number;
  exam_title: string;
  total: number;
  data: any[];
}

// 🟢 Hook للتسجيل
export const useStudentRegister = () => {
  const navigate = useNavigate();
  const { teacher } = useTeacher();
  
  return useMutation({
    mutationFn: async (data: Omit<StudentRegisterData, 'teacher_id'>) => {
      if (!teacher?.id) {
        throw new Error("Teacher not found");
      }
      
      const fullData: StudentRegisterData = {
        ...data,
        teacher_id: teacher.id,
      };
      
      console.log("📝 Student register request:", fullData);
      const response = await api.post('/student/application-form', fullData);
      console.log("✅ Student register response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === true || data.status === 200 || data.status === 201) {
        // ✅ حفظ التوكن في cookies
        if (data.token) {
          Cookies.set('student_token', data.token, { expires: 7, secure: true, sameSite: 'Lax' });
          Cookies.set('student_data', JSON.stringify(data.data), { expires: 7 });
        }
        
        toast.success(data.message || "تم تسجيل الطالب بنجاح!");
        
        const slug = window.location.pathname.split('/')[1];
        // ✅ التوجيه للـ Dashboard مباشرة بعد التسجيل
        setTimeout(() => {
          navigate(`/dashboard`);
        }, 1500);
      } else {
        toast.error(data.message || "فشل تسجيل الطالب");
      }
    },
    onError: (error: any) => {
      console.error("❌ Student register error:", error);
      const errors = error.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0] as string[];
        toast.error(firstError?.[0] || "حدث خطأ في البيانات");
      } else {
        toast.error(error.response?.data?.message || "حدث خطأ ما");
      }
    },
  });
};

// 🟢 Hook لتسجيل الدخول
export const useStudentLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: StudentLoginData) => {
      console.log("🔐 Student login request:", data);
      const response = await api.post<StudentLoginResponse>('/student/login', data);
      console.log("✅ Student login response:", response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data.status === true && data.token) {
        // ✅ حفظ التوكن في cookies
        Cookies.set('student_token', data.token, { expires: 7, secure: true, sameSite: 'Lax' });
        Cookies.set('student_data', JSON.stringify(data.data), { expires: 7 });
        
        toast.success(data.message || "تم تسجيل الدخول بنجاح!", {
          duration: 3000,
          position: "top-center",
        });
        
        // تحديث الكاش
        queryClient.invalidateQueries({ queryKey: ['student-auth'] });
        queryClient.invalidateQueries({ queryKey: ['student-learning'] });
        
        // ✅ التوجيه للـ Dashboard
        const slug = window.location.pathname.split('/')[1];
        
        // التحقق من وجود redirect في URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');
        
        if (redirectUrl) {
          // لو فيه redirect, روح للرابط اللي كان المستخدم فيه
          setTimeout(() => {
            navigate(redirectUrl);
          }, 1500);
        } else {
          // روح للـ Dashboard
          setTimeout(() => {
            navigate(`/dashboard`);
          }, 1500);
        }
      } else {
        toast.error(data.message || "فشل تسجيل الدخول", {
          duration: 4000,
          position: "top-center",
        });
      }
    },
    onError: (error: any) => {
      console.error("❌ Student login error:", error);
      const message = error.response?.data?.message || "رقم الهاتف أو كلمة المرور غير صحيحة";
      toast.error(message, {
        duration: 4000,
        position: "top-center",
      });
    },
  });
};


// 🟢 Hook لجلب بيانات الطالب (Profile)
export const useStudentProfile = () => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['student-profile'],
    queryFn: async () => {
      const response = await api.get<StudentProfileData>('/student/check-auth');
      console.log("👤 Student profile response:", response.data);
      return response.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// 🟢 Hook لجلب مواد الطالب (My Learning)
// hooks/useStudent.ts - تحديث useStudentLearning
export const useStudentLearning = () => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['student-learning'],
    queryFn: async () => {
      const response = await api.get('/my-student/learn');
      console.log("📚 Student learning response:", response.data);
      // ✅ إرجاع البيانات كاملة
      return response.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

// 🟢 Hook لجلب أسئلة الامتحان
export const useExamQuestions = (examId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['exam-questions', examId],
    queryFn: async () => {
      const response = await api.get(`/exams/${examId}/questions`);
      console.log("📝 Exam questions response:", response.data);
      return response.data;
    },
    enabled: !!token && !!examId,
    staleTime: 0,
  });
};

// 🟢 Hook لتقديم الامتحان
export const useSubmitExam = () => {
  const queryClient = useQueryClient();
  const student = useCurrentStudent();
  
  return useMutation({
    mutationFn: async (data: Omit<ExamSubmitData, 'student_id'>) => {
      const fullData: ExamSubmitData = {
        ...data,
        student_id: student.student?.id || parseInt(Cookies.get('student_id') || '0'),
      };
      console.log("📝 Submit exam request:", fullData);
      const response = await api.post('/exam/submit', fullData);
      console.log("✅ Submit exam response:", response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data.status === 200 || data.status === 201) {
        toast.success("تم تقديم الامتحان بنجاح!");
        queryClient.invalidateQueries({ queryKey: ['exam-result', variables.exam_id] });
      } else {
        toast.error(data.message || "فشل تقديم الامتحان");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ ما");
    },
  });
};

// 🟢 Hook لجلب نتيجة الامتحان
export const useExamResult = (examId: number, studentId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['exam-result', examId, studentId],
    queryFn: async () => {
      const response = await api.get<ExamResult>(`/exam/result/${studentId}/${examId}`);
      console.log("📊 Exam result response:", response.data);
      return response.data;
    },
    enabled: !!token && !!examId && !!studentId,
    staleTime: 60 * 1000,
  });
};

// 🟢 Hook لتسجيل حضور الدرس
export const useLessonAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lessonId: number) => {
      console.log("📝 Lesson attendance request:", lessonId);
      const response = await api.post(`/lessons/${lessonId}/attendance`);
      console.log("✅ Lesson attendance response:", response.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("تم تسجيل الحضور بنجاح!");
      queryClient.invalidateQueries({ queryKey: ['student-learning'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "فشل تسجيل الحضور");
    },
  });
};

export const useCurrentStudent = () => {
  const token = Cookies.get('student_token');
  const studentData = Cookies.get('student_data');
  
  return {
    token,
    isAuthenticated: !!token,
    student: studentData ? JSON.parse(studentData) : null,
    logout: () => {
      Cookies.remove('student_token');
      Cookies.remove('student_data');
      window.location.reload();
    }
  };
};



export const useStudentCourses = () => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['student-courses'],
    queryFn: async () => {
      const response = await api.get('/my-student/learn');
      return response.data?.data?.courses || [];
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

// 🟢 Hook للتحقق إذا كان الطالب مشترك في كورس معين
export const useIsEnrolledInCourse = (courseId: number) => {
  const { data: courses, isLoading } = useStudentCourses();
  
  const isEnrolled = useMemo(() => {
    if (!courses || !courseId) return false;
    return courses.some((course: any) => course.id === courseId);
  }, [courses, courseId]);
  
  return { isEnrolled, isLoading };
};