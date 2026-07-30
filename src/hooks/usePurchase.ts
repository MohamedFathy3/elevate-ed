/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/usePurchase.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

// ✅ Types
export type PurchaseItemType = 'course' | 'semester' | 'exam' | 'lesson' | 'book';

export interface EnrollRequest {
  type: PurchaseItemType;
  course_id?: number | null;
  semester_id?: number | null;
  book_id?: number | null;
  course_detail_id?: number | null;
  price: number;
}

export interface RedeemCodeRequest {
  code: string;
  type?: PurchaseItemType;
  course_id?: number | null;
  semester_id?: number | null;
  book_id?: number | null;
  course_detail_id?: number | null;
  price?: number;
}

export const usePurchaseItem = () => {
  const queryClient = useQueryClient();
  
  // ✅ 1. شراء عادي عبر `/enroll/request`
  const enroll = useMutation({
    mutationFn: async (data: EnrollRequest) => {
      const response = await api.post('/enroll/request', data);
      return response.data;
    },
    onSuccess: (data) => {
      const isSuccess = data.status === 200 || data.status === true;
      const isInsufficientBalance = data.message?.includes('رصيد المحفظة غير كاف') || 
                                     data.message?.includes('Insufficient balance');
      
      if (isSuccess && !isInsufficientBalance) {
        toast.success(data.message || "تم الشراء بنجاح!");
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        queryClient.invalidateQueries({ queryKey: ['purchased-items'] });
        queryClient.invalidateQueries({ queryKey: ['student-courses'] });
        queryClient.invalidateQueries({ queryKey: ['student-books'] });
        return { success: true, data };
      } 
      else if (isInsufficientBalance) {
        toast.info("📩 " + (data.message || "رصيد المحفظة غير كافٍ، تم إرسال طلب للمدرس"));
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        return { success: false, data, isPending: true };
      }
      else {
        toast.error(data.message || "فشل الشراء");
        return { success: false, data };
      }
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "حدث خطأ ما";
      toast.error(errorMsg);
      return { success: false, error };
    },
  });

  // ✅ 2. استخدام كود خصم - بيبعت الكود مع id العنصر
  const redeemCode = useMutation({
    mutationFn: async (data: RedeemCodeRequest) => {
      // ✅ بناء الـ payload بالكامل
      const payload: any = {
        code: data.code, // الكود
      };

      // ✅ إضافة type
      if (data.type) {
        payload.type = data.type;
      }

      // ✅ إضافة id العنصر حسب النوع
      if (data.course_id !== undefined && data.course_id !== null) {
        payload.course_id = data.course_id;
      }
      if (data.semester_id !== undefined && data.semester_id !== null) {
        payload.semester_id = data.semester_id;
      }
      if (data.book_id !== undefined && data.book_id !== null) {
        payload.book_id = data.book_id;
      }
      if (data.course_detail_id !== undefined && data.course_detail_id !== null) {
        payload.course_detail_id = data.course_detail_id;
      }
      
      // ✅ إضافة السعر
      if (data.price !== undefined) {
        payload.price = data.price;
      }

      console.log('📤 [usePurchase] Redeem code payload:', payload);

      const response = await api.post('/enroll/redeem-code', payload);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === 200 || data.status === true) {
        toast.success(data.message || "تم استخدام الكود بنجاح!");
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        queryClient.invalidateQueries({ queryKey: ['purchased-items'] });
        queryClient.invalidateQueries({ queryKey: ['student-courses'] });
        queryClient.invalidateQueries({ queryKey: ['student-books'] });
      } else {
        toast.error(data.message || "كود غير صالح");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ ما");
    },
  });

  return {
    enroll: enroll.mutate,
    isEnrolling: enroll.isPending,
    enrollError: enroll.error,
    enrollData: enroll.data,

    redeemCode: redeemCode.mutate,
    isRedeeming: redeemCode.isPending,
    redeemError: redeemCode.error,

    canPurchaseWithWallet: (walletBalance: number, price: number) => {
      return walletBalance >= price;
    },
  };
};