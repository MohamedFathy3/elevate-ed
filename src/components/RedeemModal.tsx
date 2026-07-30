/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Info, CheckCircle, MessageCircle, Shield } from 'lucide-react';
import { useWalletBalance } from '@/hooks/useWallet';
import { usePurchaseItem, EnrollRequest } from '@/hooks/usePurchase';
import { useTheme } from '@/context/ThemeContext';
import { useTeacher } from '@/context/TeacherContext';
import { toast } from '@/hooks/use-toast';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string | number;
  itemType: 'course' | 'semester' | 'exam' | 'lesson' | 'book';
  price?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onPending?: (data: any) => void;
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
  const [showContactModal, setShowContactModal] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  
  const { theme, colorMode } = useTheme();
  const { teacher } = useTeacher();
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
  
  const teacherNameFromContext = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");
  const teacherPhoneFromContext = teacher?.phone || "";

  const handleOpenContactModal = (message?: string) => {
    setTeacherName(teacherNameFromContext);
    setTeacherPhone(teacherPhoneFromContext);
    setPendingMessage(message || "رصيد المحفظة غير كافٍ. يرجى التواصل مع المدرس");
    setShowContactModal(true);
  };

  // ✅ دالة بناء بيانات الطلب للـ wallet
  const buildRequestData = (): EnrollRequest => {
    const data: EnrollRequest = {
      type: itemType,
      price: price,
      course_id: null,
      semester_id: null,
      book_id: null,
      course_detail_id: null,
    };

    switch (itemType) {
      case 'course':
        data.course_id = Number(itemId);
        break;
      case 'semester':
        data.semester_id = Number(itemId);
        break;
      case 'book':
        data.book_id = Number(itemId);
        break;
      case 'lesson':
        data.course_detail_id = Number(itemId);
        break;
      case 'exam':
        data.course_detail_id = Number(itemId);
        break;
      default:
        break;
    }

    return data;
  };

  // ✅ دالة معالجة الدفع
  const handlePayment = async () => {
    try {
      if (paymentMethod === 'wallet') {
        const requestData = buildRequestData();
        console.log('📤 [RedeemModal] Sending wallet request:', JSON.stringify(requestData, null, 2));

        enroll(requestData, {
          onSuccess: (data) => {
            console.log('✅ [RedeemModal] Wallet success:', data);
            
            const isInsufficientBalance = data.message?.includes('رصيد المحفظة غير كاف') || 
                                           data.message?.includes('Insufficient balance') ||
                                           data.message?.includes('غير كاف');
            
            if (isInsufficientBalance) {
              setIsPendingRequest(true);
              setPendingMessage(data.message || "رصيد المحفظة غير كافٍ. تم إرسال طلب للمدرس");
              toast.info("📩 " + data.message);
              refetchWallet();
              onPending?.(data);
              handleOpenContactModal(data.message);
            } else {
              toast.success(data.message || "تم الدفع بنجاح!");
              refetchWallet();
              onSuccess?.(data);
              onClose();
            }
          },
          onError: (error) => {
            console.error('❌ [RedeemModal] Wallet error:', error);
            const errorMessage = error?.response?.data?.message || "فشل الدفع";
            
            if (errorMessage.includes('رصيد') || 
                errorMessage.includes('balance') ||
                errorMessage.includes('غير كاف')) {
              handleOpenContactModal(errorMessage);
            } else {
              toast.error(errorMessage);
              onError?.(error);
            }
          }
        });
        
      } else {
        // ✅ ✅ ✅ استخدام كود خصم - مع إرسال البيانات كاملة
        if (!redeemCodeInput.trim()) {
          toast.error(lang === "ar" ? "الرجاء إدخال الكود" : "Please enter the code");
          return;
        }
        
        // ✅ بناء البيانات كاملة
        const redeemData: any = {
          code: redeemCodeInput.trim().toUpperCase(),
        };

        // ✅ إضافة type لو موجود
        if (itemType) {
          redeemData.type = itemType;
        }

        // ✅ إضافة الحقل المناسب حسب النوع
        switch (itemType) {
          case 'course':
            redeemData.course_id = Number(itemId);
            break;
          case 'semester':
            redeemData.semester_id = Number(itemId);
            break;
          case 'book':
            redeemData.book_id = Number(itemId);
            break;
          case 'lesson':
            redeemData.course_detail_id = Number(itemId);
            break;
          case 'exam':
            redeemData.course_detail_id = Number(itemId);
            break;
          default:
            break;
        }

        // ✅ إضافة السعر
        if (price > 0) {
          redeemData.price = price;
        }

        console.log('📤 [RedeemModal] Redeem code with data:', JSON.stringify(redeemData, null, 2));
        
        redeemCode(redeemData, {
          onSuccess: (data) => {
            console.log('✅ [RedeemModal] Code success:', data);
            toast.success(lang === "ar" ? "تم تفعيل الكود بنجاح!" : "Code activated successfully!");
            refetchWallet();
            onSuccess?.(data);
            onClose();
          },
          onError: (error) => {
            console.error('❌ [RedeemModal] Code error:', error);
            toast.error(error?.response?.data?.message || (lang === "ar" ? "الكود غير صالح" : "Invalid code"));
            onError?.(error);
          }
        });
      }
    } catch (error: any) {
      console.error('❌ [RedeemModal] Payment error:', error);
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء الدفع");
      onError?.(error);
    }
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* المودال الرئيسي */}
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
                onClick={() => handleOpenContactModal(pendingMessage)}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2
                  ${isNature 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30'}`}
              >
                <MessageCircle className="w-5 h-5" />
                {lang === "ar" ? "📱 التواصل مع المدرس" : "Contact Teacher"}
              </button>
              
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
                
                {!hasSufficientBalance && price > 0 && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {lang === "ar" 
                        ? `⚠️ رصيدك غير كافٍ (${balance} جنيه). سيتم التواصل مع المدرس`
                        : `⚠️ Insufficient balance (${balance} EGP). Will contact the teacher`}
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

      {/* ✅ مودال التواصل مع المعلم */}
      {showContactModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Shield className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {lang === "ar" ? "💬 رصيد غير كافٍ" : "💬 Insufficient Balance"}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {lang === "ar" 
                  ? `رصيدك الحالي (${balance} جنيه) غير كافٍ لشراء هذا العنصر`
                  : `Your current balance (${balance} EGP) is insufficient to purchase this item`}
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 mb-4 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-700 dark:text-amber-300 text-left leading-relaxed">
                  {pendingMessage || (lang === "ar"
                    ? "تم إرسال طلب إلى المدرس لتوفير الرصيد. يرجى التواصل معه للحصول على الموافقة."
                    : "A request has been sent to the teacher to provide balance. Please contact them for approval.")}
                </p>
              </div>
              
              <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl mb-6">
                {lang === "ar"
                  ? `📞 تواصل مع المعلم "${teacherNameFromContext}" عبر واتساب لمتابعة الطلب`
                  : `📞 Contact teacher "${teacherNameFromContext}" via WhatsApp to follow up on the request`}
              </p>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/${teacherPhoneFromContext.replace(/\s/g, "").replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(
                  lang === "ar"
                    ? `السلام عليكم، لقد قمت بطلب شراء في منصة الأستاذ ${teacherNameFromContext} ولكن رصيدي غير كافٍ (${balance} جنيه). أرجو المساعدة في إضافة رصيد.`
                    : `Hello, I have requested to purchase on ${teacherNameFromContext}'s platform but my balance is insufficient (${balance} EGP). Please help me add balance.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300"
              >
                <MessageCircle className="w-6 h-6" />
                <span>{lang === "ar" ? "📱 تواصل عبر واتساب" : "📱 Contact via WhatsApp"}</span>
              </motion.a>

              <button
                onClick={handleCloseContactModal}
                className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {lang === "ar" ? 'حسناً، سأتواصل لاحقاً' : 'OK, I\'ll contact later'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default RedeemModal;