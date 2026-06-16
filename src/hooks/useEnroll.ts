/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useEnroll.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export type EnrollType = 'course' | 'semester' | 'lesson' | 'book';

interface EnrollRequest {
  type: EnrollType;
  course_id?: number | null;
  semester_id?: number | null;
  course_detail_id?: number | null;
  book_id?: number | null;
  price: number;
}

interface EnrollResponse {
  status: boolean;  // ✅ true/false من API
  message: string;
  data?: {
    enrolled: boolean;
    balance?: number;
    order_id?: number;
    request_id?: number;
  };
}

export const useEnroll = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async (enrollData: EnrollRequest): Promise<EnrollResponse> => {
      const token = Cookies.get('student_token');
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }
      
      console.log("📦 Enroll request:", enrollData);
      
      const { data } = await api.post('/enroll/request', enrollData);
      console.log("✅ Enroll response:", data);
      return data;
    },
    onSuccess: (data) => {
      // ✅ التحقق من وجود رسالة تحذيرية (رصيد غير كافٍ)
      const isWarning = data.message && (
        data.message.includes("رصيد المحفظة غير كاف") ||
        data.message.includes("insufficient balance") ||
        data.message.includes("تم إرسال طلب للمدرس") ||
        data.message.includes("طلب مرسل")
      );
      
      // ✅ التحقق من النجاح (status: true من API)
      const isSuccess = data.status === true;
      
      if (isWarning) {
        // ⚠️ حالة خاصة: تم إرسال طلب للمدرس لأن الرصيد غير كافٍ
        toast.warning(
          data.message || "رصيد المحفظة غير كافٍ، تم إرسال طلب للمدرس للموافقة",
          {
            duration: 6000,
            position: "top-center",
            icon: "⏳",
          }
        );
        
        // ✅ تحديث الكاشات لإظهار الطلب في قائمة الطلبات
        queryClient.invalidateQueries({ queryKey: ['student-requests'] });
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        queryClient.invalidateQueries({ queryKey: ['student-learning'] });
        queryClient.invalidateQueries({ queryKey: ['student-courses'] });
        
    
        
      } else if (isSuccess) {
        // ✅ شراء ناجح تماماً
        toast.success(data.message || "تم التسجيل بنجاح!", {
          duration: 4000,
          position: "top-center",
        });
        
        queryClient.invalidateQueries({ queryKey: ['courses'] });
        queryClient.invalidateQueries({ queryKey: ['semesters'] });
        queryClient.invalidateQueries({ queryKey: ['course-details'] });
        queryClient.invalidateQueries({ queryKey: ['student-learning'] });
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        queryClient.invalidateQueries({ queryKey: ['student-courses'] });
        
      } else {
        toast.error(data.message || "فشل عملية التسجيل", {
          duration: 4000,
          position: "top-center",
        });
      }
    },
    onError: (error: any) => {
      console.error("❌ Enroll error:", error);
      
      if (error.response?.status === 401) {
        toast.error("الرجاء تسجيل الدخول أولاً", {
          duration: 4000,
          position: "top-center",
        });
        Cookies.remove('student_token');
        Cookies.remove('student_data');
        const slug = window.location.pathname.split('/')[1];
        setTimeout(() => navigate(`/${slug}/login`), 2000);
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

// 🟢 Hook للشراء مع حالة التحميل والتحقق من المصادقة
export const useBuyCourse = () => {
  const enroll = useEnroll();
  const token = Cookies.get('student_token');
  const navigate = useNavigate();
  const slug = window.location.pathname.split('/')[1];
  
  const buyCourse = (courseId: number, price: number) => {
    if (!token) {
      toast.error("الرجاء تسجيل الدخول أولاً", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => navigate(`/${slug}/login`), 1500);
      return Promise.reject(new Error("Not authenticated"));
    }
    
    return enroll.mutateAsync({
      type: 'course',
      course_id: courseId,
      price: price,
    });
  };
  
  const buySemester = (semesterId: number, price: number) => {
    if (!token) {
      toast.error("الرجاء تسجيل الدخول أولاً", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => navigate(`/${slug}/login`), 1500);
      return Promise.reject(new Error("Not authenticated"));
    }
    
    return enroll.mutateAsync({
      type: 'semester',
      semester_id: semesterId,
      price: price,
    });
  };
  
  const buyLesson = (lessonId: number, price: number) => {
    if (!token) {
      toast.error("الرجاء تسجيل الدخول أولاً", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => navigate(`/${slug}/login`), 1500);
      return Promise.reject(new Error("Not authenticated"));
    }
    
    return enroll.mutateAsync({
      type: 'lesson',
      course_detail_id: lessonId,
      price: price,
    });
  };
  
  const buyBook = (bookId: number, price: number) => {
    if (!token) {
      toast.error("الرجاء تسجيل الدخول أولاً", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => navigate(`/${slug}/login`), 1500);
      return Promise.reject(new Error("Not authenticated"));
    }
    
    return enroll.mutateAsync({
      type: 'book',
      book_id: bookId,
      price: price,
    });
  };
  
  return {
    buyCourse,
    buySemester,
    buyLesson,
    buyBook,
    isLoading: enroll.isPending,
    isSuccess: enroll.isSuccess,
    isError: enroll.isError,
    error: enroll.error,
  };
};

// 🟢 Hook لاستخدام كود الخصم (Redeem Code) - مستقلة تماماً
export const useRedeemCode = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async (code: string) => {
      const token = Cookies.get('student_token');
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }
      
      console.log("🎫 Redeem code request:", code);
      
      const { data } = await api.post('/enroll/redeem-code', { code });
      console.log("✅ Redeem response:", data);
      return data;
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.success(data.message || "تم تفعيل الكود بنجاح!", {
          duration: 4000,
          position: "top-center",
        });
        // تحديث الكاشات
        queryClient.invalidateQueries({ queryKey: ['student-profile'] });
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        queryClient.invalidateQueries({ queryKey: ['student-learning'] });
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
        toast.error(data.message || "فشل تفعيل الكود", {
          duration: 4000,
          position: "top-center",
        });
      }
    },
    onError: (error: any) => {
      console.error("❌ Redeem error:", error);
      
      if (error.response?.status === 401) {
        toast.error("الرجاء تسجيل الدخول أولاً", {
          duration: 4000,
          position: "top-center",
        });
        Cookies.remove('student_token');
        Cookies.remove('student_data');
        const slug = window.location.pathname.split('/')[1];
        setTimeout(() => navigate(`/${slug}/login`), 2000);
      } else if (error.response?.status === 404) {
        toast.error("الكود غير صالح أو منتهي الصلاحية", {
          duration: 4000,
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