/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useWallet.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Cookies from "js-cookie";

// ✅ useWalletBalance - تجيب الرصيد من check-auth بس
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