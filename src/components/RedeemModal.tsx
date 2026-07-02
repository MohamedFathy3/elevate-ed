/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useWalletBalance } from '@/hooks/useWallet';
import { usePurchaseItem } from '@/hooks/usePurchase';
import { useTheme } from '@/context/ThemeContext';
import { toast } from '@/hooks/use-toast';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string | number;
  itemType: 'course' | 'semester' | 'exam' | 'lesson' | 'book';
  price?: number;
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
  
  const { theme, colorMode } = useTheme();
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  
  const { data: walletData, refetch: refetchWallet } = useWalletBalance();
  
  // ✅ استخدام Hook الشراء
  const { 
    enroll, 
    isEnrolling,
    redeemCode, 
    isRedeeming,
  } = usePurchaseItem();
  
  const isProcessing = isEnrolling || isRedeeming;
  
  const lang = 'ar';
  
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  
  // ✅ دالة معالجة الدفع
  const handlePayment = async () => {
    try {
      if (paymentMethod === 'wallet') {
        // ✅ شراء بالرصيد - `/enroll/request`
        enroll({
          type: itemType,
          course_id: itemType === 'course' ? Number(itemId) : null,
          semester_id: itemType === 'semester' ? Number(itemId) : null,
          book_id: itemType === 'book' ? Number(itemId) : null,
          course_detail_id: itemType === 'lesson' ? Number(itemId) : null,
          price: price,
        }, {
          onSuccess: (data) => {
            toast.success(lang === "ar" ? "تم الدفع بنجاح!" : "Payment successful!");
            refetchWallet();
            onSuccess?.(data);
            onClose();
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || lang === "ar" ? "فشل الدفع" : "Payment failed");
            onError?.(error);
          }
        });
        
      } else {
        // ✅ استخدام كود خصم - `/enroll/redeem-code`
        if (!redeemCodeInput.trim()) {
          toast.error(lang === "ar" ? "الرجاء إدخال الكود" : "Please enter the code");
          return;
        }
        
        redeemCode({
          code: redeemCodeInput.trim().toUpperCase()
        }, {
          onSuccess: (data) => {
            toast.success(lang === "ar" ? "تم تفعيل الكود بنجاح!" : "Code activated successfully!");
            refetchWallet();
            onSuccess?.(data);
            onClose();
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || lang === "ar" ? "الكود غير صالح" : "Invalid code");
            onError?.(error);
          }
        });
      }
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      toast.error(error?.response?.data?.message || lang === "ar" ? "حدث خطأ أثناء الدفع" : "An error occurred during payment");
      onError?.(error);
    }
  };
  
  if (!isOpen) return null;
  
  const balance = walletData?.data?.balance || 0;
  
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
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* السعر والرصيد */}
        <div className={`mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 ${getTextColor()}`}>
          <div className="flex justify-between items-center">
            <span>{lang === "ar" ? "السعر" : "Price"}</span>
            <span className="font-bold text-lg">{price} جنيه</span>
          </div>
         
        </div>
        
        {/* خيارات الدفع */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setPaymentMethod('wallet')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              paymentMethod === 'wallet'
                ? isNature
                  ? 'bg-amber-600 text-white'
                  : 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
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
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {lang === "ar" ? "كود" : "Code"}
          </button>
        </div>
        
        {/* حقل الكود */}
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
            disabled={isProcessing}
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