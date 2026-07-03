/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Info, CheckCircle } from 'lucide-react';
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
  onPending?: (data: any) => void; // ✅ جديد - عند إرسال طلب للمدرس
}

export const RedeemModal: React.FC<RedeemModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemType,
  price = 0,
  onSuccess,
  onError,
  onPending,
}) => {
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'code'>('wallet');
  const [isPendingRequest, setIsPendingRequest] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  
  const { theme, colorMode } = useTheme();
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  
  const { data: walletData, refetch: refetchWallet } = useWalletBalance();
  
  const { 
    enroll, 
    isEnrolling,
    redeemCode, 
    isRedeeming,
    canPurchaseWithWallet
  } = usePurchaseItem();
  
  const isProcessing = isEnrolling || isRedeeming;
  
  const lang = 'ar';
  
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-400' : 'text-gray-500';
  
  const balance = walletData?.data?.balance || 0;
  const hasSufficientBalance = canPurchaseWithWallet(balance, price);

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
            // ✅ التحقق من رسالة "رصيد غير كافٍ"
            const isInsufficientBalance = data.message?.includes('رصيد المحفظة غير كاف') || 
                                           data.message?.includes('Insufficient balance');
            
            if (isInsufficientBalance) {
              // ✅ رصيد غير كاف - تم إرسال طلب للمدرس
              setIsPendingRequest(true);
              setPendingMessage(data.message || "تم إرسال طلب للمدرس");
              toast.info("📩 " + data.message);
              refetchWallet();
              onPending?.(data);
              // ✅ لا نغلق المودال عشان الطالب يشوف الرسالة
            } else {
              // ✅ نجاح حقيقي
              toast.success(data.message || "تم الدفع بنجاح!");
              refetchWallet();
              onSuccess?.(data);
              onClose();
            }
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || "فشل الدفع");
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
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء الدفع");
      onError?.(error);
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
            {isPendingRequest 
              ? (lang === "ar" ? "✅ تم إرسال الطلب" : "✅ Request Sent")
              : (lang === "ar" ? "اختر طريقة الدفع" : "Choose Payment Method")
            }
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* ✅ حالة الطلب المرسل */}
        {isPendingRequest ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-800 dark:text-blue-300">
                    {lang === "ar" ? "تم إرسال طلبك للمدرس" : "Your request has been sent to the teacher"}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    {pendingMessage || (lang === "ar" 
                      ? "رصيد المحفظة غير كافٍ. سيتم مراجعة طلبك من قبل المدرس"
                      : "Insufficient balance. Your request will be reviewed by the teacher")}
                  </p>
                  <div className="mt-3 p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      {lang === "ar" 
                        ? "ستتلقى إشعاراً عند الموافقة على الطلب"
                        : "You will receive a notification when the request is approved"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              {lang === "ar" ? "إغلاق" : "Close"}
            </button>
          </div>
        ) : (
          <>
            {/* السعر والرصيد */}
            <div className={`mb-4 p-3 rounded-xl ${hasSufficientBalance ? 'bg-gray-50 dark:bg-gray-900' : 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800'}`}>
              <div className="flex justify-between items-center">
                <span className={getTextColor()}>{lang === "ar" ? "السعر" : "Price"}</span>
                <span className={`font-bold text-lg ${getTextColor()}`}>{price} جنيه</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className={getMutedColor()}>{lang === "ar" ? "رصيد المحفظة" : "Wallet Balance"}</span>
                <span className={`font-semibold ${hasSufficientBalance ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {balance} جنيه
                </span>
              </div>
              
              {/* ✅ تحذير الرصيد غير كافي */}
              {!hasSufficientBalance && price > 0 && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {lang === "ar" 
                      ? `⚠️ رصيدك غير كافٍ (${balance} جنيه). سيتم إرسال طلب للمدرس`
                      : `⚠️ Insufficient balance (${balance} EGP). A request will be sent to the teacher`}
                  </p>
                </div>
              )}
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
          </>
        )}
      </motion.div>
    </div>
  );
};

export default RedeemModal;