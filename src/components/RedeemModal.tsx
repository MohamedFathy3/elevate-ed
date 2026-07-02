/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useRechargeWallet, useWalletBalance } from '@/hooks/useWallet';
import { useTheme } from '@/context/ThemeContext';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string | number; // ID الكورس أو السيمستر
  itemType: 'course' | 'semester' | 'exam' | 'lesson'; // نوع العنصر
  price?: number; // السعر (اختياري)
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemType,
  price = 0,
  onSuccess,
  onError,
}) => {
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'code'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { theme, colorMode } = useTheme();
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  
  const { data: walletData, refetch: refetchWallet } = useWalletBalance();
  const rechargeMutation = useRechargeWallet();
  
  // اللغة (افتراضي عربي)
  const lang = 'ar';
  
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  
  // التحقق من الرصيد
  
  // دالة معالجة الدفع
  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'wallet') {
      
        
        const response = await api.post(`/student/${itemType}/${itemId}/purchase`, {
          payment_method: 'wallet',
        });
        
        if (response.data?.status === 200 || response.data?.status === true) {
          toast.success('تم الدفع بنجاح!');
          refetchWallet();
          onSuccess?.(response.data);
          onClose();
        } else {
          toast.error(response.data?.message || 'فشل الدفع');
          onError?.(response.data);
        }
      } else {
        // دفع باستخدام الكود
        if (!redeemCodeInput.trim()) {
          toast.error('الرجاء إدخال الكود');
          setIsProcessing(false);
          return;
        }
        
        const response = await rechargeMutation.mutateAsync(redeemCodeInput);
        
        if (response.status === 200 || response.status === true) {
          toast.success('تم تفعيل الكود بنجاح!');
          refetchWallet();
          onSuccess?.(response);
          onClose();
        } else {
          toast.error(response.message || 'الكود غير صالح');
          onError?.(response);
        }
      }
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء الدفع');
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${getTextColor()}`}>
            {lang === "ar" ? "اختر طريقة الدفع" : "Choose Payment Method"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
        
        {/* السعر */}
        {price > 0 && (
          <div className={`mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 ${getTextColor()}`}>
            <div className="flex justify-between items-center">
              <span>{lang === "ar" ? "السعر" : "Price"}</span>
              <span className="font-bold text-lg">{price} جنيه</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{lang === "ar" ? "رصيد المحفظة" : "Wallet Balance"}</span>
              <span>{walletData?.data?.balance || 0} جنيه</span>
            </div>
          </div>
        )}
        
        {/* خيارات الدفع */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setPaymentMethod('wallet')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              paymentMethod === 'wallet'
                ? isNature
                  ? 'bg-amber-600 text-white'
                  : 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {lang === "ar" ? "المحفظة" : "Wallet"}
          </button>
          <button
            onClick={() => setPaymentMethod('code')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              paymentMethod === 'code'
                ? isNature
                  ? 'bg-amber-600 text-white'
                  : 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {lang === "ar" ? "كود" : "Code"}
          </button>
        </div>
        
        {/* حقل الكود (يظهر عند اختيار كود) */}
        {paymentMethod === 'code' && (
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${getTextColor()}`}>
              {lang === "ar" ? "أدخل الكود" : "Enter Code"}
            </label>
            <input
              type="text"
              value={redeemCodeInput}
              onChange={(e) => setRedeemCodeInput(e.target.value.toUpperCase())}
              placeholder="مثال: LOT4LBNW"
              className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-wider uppercase ${getTextColor()}`}
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {lang === "ar" 
                ? "أدخل الكود الذي حصلت عليه من المدرس" 
                : "Enter the code you received from the teacher"}
            </p>
          </div>
        )}
        
        {/* تحذير الرصيد غير كافي */}
        {paymentMethod === 'wallet' && price > 0 && !hasSufficientBalance && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            ⚠️ {lang === "ar" 
              ? `رصيد المحفظة غير كافي. المطلوب: ${price} جنيه، المتاح: ${walletData?.data?.balance || 0} جنيه` 
              : `Insufficient balance. Required: ${price}, Available: ${walletData?.data?.balance || 0}`}
          </div>
        )}
        
        {/* أزرار التحكم */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === 'wallet' && !hasSufficientBalance)}
            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${isNature 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-gradient-to-r from-primary to-accent'}`}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              lang === "ar" ? "اشتراك" : "Purchase"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};


export default RedeemModal;