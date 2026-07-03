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
}

export const usePurchaseItem = () => {
  const queryClient = useQueryClient();
  
  // ✅ 1. شراء عادي عبر `/enroll/request`
  const enroll = useMutation({
    mutationFn: async (data: EnrollRequest) => {
      const response = await api.post('/enroll/request', data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // ✅ التحقق من الحالة
      const isSuccess = data.status === 200 || data.status === true;
      
      // ✅ التحقق من رسالة "رصيد غير كافٍ"
      const isInsufficientBalance = data.message?.includes('رصيد المحفظة غير كاف') || 
                                     data.message?.includes('Insufficient balance');
      
      if (isSuccess && !isInsufficientBalance) {
        // ✅ نجاح حقيقي - تم الدفع وخصم الرصيد
        toast.success(data.message || "تم الشراء بنجاح!");
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        queryClient.invalidateQueries({ queryKey: ['purchased-items'] });
        queryClient.invalidateQueries({ queryKey: ['student-courses'] });
        queryClient.invalidateQueries({ queryKey: ['student-books'] });
        return { success: true, data };
      } 
      else if (isInsufficientBalance) {
        // ✅ رصيد غير كافٍ - تم إرسال طلب للمدرس
        toast.info(
          "📩 " + (data.message || "رصيد المحفظة غير كافٍ، تم إرسال طلب للمدرس")
        );
        // ✅ نعمل invalidate عشان نحدث الرصيد
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        return { success: false, data, isPending: true };
      }
      else {
        // ✅ فشل آخر
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

  // ✅ 2. استخدام كود خصم
  const redeemCode = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const response = await api.post('/enroll/redeem-code', { code });
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