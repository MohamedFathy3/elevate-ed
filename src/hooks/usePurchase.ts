/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/usePurchase.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export const usePurchaseItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      itemId, 
      itemType, 
      paymentMethod,
      code 
    }: { 
      itemId: string | number;
      itemType: 'course' | 'semester' | 'exam' | 'lesson';
      paymentMethod: 'wallet' | 'code';
      code?: string;
    }) => {
      let endpoint = '';
      
      if (paymentMethod === 'wallet') {
        endpoint = `/student/${itemType}/${itemId}/purchase`;
        const response = await api.post(endpoint, { payment_method: 'wallet' });
        return response.data;
      } else {
        endpoint = `/wallet/redeem`;
        const response = await api.post(endpoint, { 
          code,
          item_id: itemId,
          item_type: itemType,
        });
        return response.data;
      }
    },
    onSuccess: (data) => {
      if (data.status === 200 || data.status === true) {
        toast.success(data.message || "تمت العملية بنجاح!");
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        queryClient.invalidateQueries({ queryKey: ['purchased-items'] });
      } else {
        toast.error(data.message || "فشلت العملية");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ ما");
    },
  });
};