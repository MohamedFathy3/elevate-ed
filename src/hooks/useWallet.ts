/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useWallet.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast  } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export interface WalletData {
  balance: number;
  rechargeCode?: string;
}


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
      if (data.status === 200) {
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
      console.log("💰 Wallet recharge:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.success(data.message || "تم شحن المحفظة بنجاح!");
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      } else {
        toast.error(data.message || "فشل شحن المحفظة");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "كود الشحن غير صالح أو حدث خطأ");
    },
  });
};