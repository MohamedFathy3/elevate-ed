/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useWallet.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export interface WalletData {
  balance: number;
  rechargeCode?: string;
}

// ✅ useWalletBalance - تجيب الرصيد من check-auth
export const useWalletBalance = () => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const response = await api.get('/student/check-auth');
      console.log("💰 Wallet balance from check-auth:", response.data);
      
      // ✅ الرصيد موجود في data.balance
      const balance = response.data?.data?.balance || 0;
      
      return {
        status: true,
        data: {
          balance: balance
        }
      };
    },
    enabled: !!token,
    staleTime: 30 * 1000,
    retry: 1,
  });
};

export const useCreateRechargeCode = () => {
  const queryClient = useQueryClient();
  const token = Cookies.get('student_token');
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/student/wallet/recharge-code');
      console.log("🔑 Recharge code created:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === 200 || data.status === true) {
        toast.success(data.message || "تم إنشاء كود الشحن بنجاح!");
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      } else {
        toast.error(data.message || "فشل إنشاء كود الشحن");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ ما");
    },
  });
};

export const useRechargeWallet = () => {
  const queryClient = useQueryClient();
  const token = Cookies.get('student_token');
  
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await api.post('/wallet/redeem', { code });
      console.log("💰 Wallet recharge response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Recharge success data:", data);
      
      if (data.status === true || data.status === 200) {
        toast.success(data.message || "تم شحن المحفظة بنجاح!");
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        queryClient.invalidateQueries({ queryKey: ['student-profile'] });
        queryClient.invalidateQueries({ queryKey: ['student-learning'] });
      } else {
        toast.error(data.message || "فشل شحن المحفظة");
      }
    },
    onError: (error: any) => {
      console.error("❌ Recharge error:", error);
      toast.error(error.response?.data?.message || "كود الشحن غير صالح أو حدث خطأ");
    },
  });
};

export const useRechargeCode = () => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['recharge-code'],
    queryFn: async () => {
      const response = await api.get('/student/wallet/recharge-code');
      console.log("🔑 Recharge code:", response.data);
      return response.data;
    },
    enabled: !!token,
    staleTime: 60 * 1000,
    retry: 1,
  });
};

export const isSuccessResponse = (data: any): boolean => {
  return data?.status === true || data?.status === 200 || data?.success === true;
};

export const getErrorMessage = (error: any): string => {
  return error?.response?.data?.message || error?.message || "حدث خطأ ما";
};