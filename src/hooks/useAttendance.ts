/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAttendance.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface AttendanceRequest {
  lesson_id: number;
  student_id: number;
  slug?: string;
}

interface AttendanceResponse {
  status: boolean;
  message: string;
  data?: {
    attended: boolean;
    lesson_id?: number;
    student_id?: number;
  };
}

export const useAttendance = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async (attendanceData: AttendanceRequest): Promise<AttendanceResponse> => {
      const token = Cookies.get('student_token');
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }
      
      const { lesson_id, student_id } = attendanceData;
      
      console.log("📝 Attendance request:", { lesson_id, student_id });
      
      const { data } = await api.post(`/lessons/${lesson_id}/attendance`, {
        student_id: student_id
      });
      
      console.log("✅ Attendance response:", data);
      return data;
    },
    onSuccess: (data, variables) => {
      if (data.status === true) {
        toast.success(data.message || "تم تسجيل حضورك بنجاح! ✅", {
          duration: 3000,
          position: "top-center",
        });
        
        // تحديث الكاشات الخاصة بالدرس
        queryClient.invalidateQueries({ queryKey: ['lesson-details', variables.lesson_id] });
        queryClient.invalidateQueries({ queryKey: ['lesson-details'] });
        queryClient.invalidateQueries({ queryKey: ['student-lessons'] });
        queryClient.invalidateQueries({ queryKey: ['course-details'] });
      } else if (data.status === 401) {
        toast.error("انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مرة أخرى", {
          duration: 5000,
          position: "top-center",
        });
        Cookies.remove('student_token');
        Cookies.remove('student_data');
        const slug = window.location.pathname.split('/')[1];
        setTimeout(() => navigate(`/${slug}/login`), 2000);
      } else {
        toast.error(data.message || "فشل تسجيل الحضور", {
          duration: 4000,
          position: "top-center",
        });
      }
    },
    onError: (error: any, variables) => {
      console.error("❌ Attendance error:", error);
      
      if (error.response?.status === 401) {
        toast.error("الرجاء تسجيل الدخول أولاً", {
          duration: 4000,
          position: "top-center",
        });
        Cookies.remove('student_token');
        Cookies.remove('student_data');
        const slug = window.location.pathname.split('/')[1];
        setTimeout(() => navigate(`/${slug}/login`), 2000);
      } else if (error.response?.status === 409) {
        // ✅ 409 يعني الحضور مسجل مسبقاً - نعرض رسالة info مش error
        toast.info("✅ تم تسجيل حضورك مسبقاً", {
          duration: 3000,
          position: "top-center",
        });
      } else {
        const message = error.response?.data?.message || "حدث خطأ ما، يرجى المحاولة مرة أخرى";
        toast.error(message, {
          duration: 4000,
          position: "top-center",
        });
      }
    },
  });
};