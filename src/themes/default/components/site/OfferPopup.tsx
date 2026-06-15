// src/themes/default/components/site/OfferPopup.tsx

import React, { useState, useEffect } from 'react';
import { X, Gift, Percent, Clock, Calendar, Tag, ArrowRight, ShoppingBag, Zap, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useTeacher } from '@/context/TeacherContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Offer {
  id: number;
  title: string;
  description: string;
  offer_discount: string | null;
  start_date: string | null;
  end_date: string | null;
  active: boolean;
  type: 'offer' | 'banner';
  imageUrl: string;
  image: { id: number; fullUrl: string } | null;
  teacher_id: number;
  createdAt: string;
}

interface OfferPopupProps {
  lang: 'ar' | 'en';
  onClose?: () => void;
}

export const OfferPopup: React.FC<OfferPopupProps> = ({ lang, onClose }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { teacher } = useTeacher();

  // مفتاح localStorage عشان ما يظهرش أكتر من مرة
  const STORAGE_KEY = `offer_popup_shown_${teacher?.id || 'default'}`;
  const POPUP_DURATION = 1000 * 60 * 60 * 24; // 24 ساعة

  // جلب العروض من API
  useEffect(() => {
    const fetchOffers = async () => {
      if (!teacher?.id) return;
      
      try {
        const response = await api.post('/offer/index', {
          filters: {
            teacher_id: teacher.id,
            active: true,
          },
          orderByDirection: 'desc',
          perPage: 10,
          paginate: false,
        });
        
        console.log('🎁 Offers for popup:', response.data?.data);
        setOffers(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching offers for popup:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOffers();
  }, [teacher?.id]);

  // التحقق إذا كان البوب اب ظهر قبل كده
  useEffect(() => {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    
    if (lastShown && now - parseInt(lastShown) < POPUP_DURATION) {
      setIsOpen(false);
      onClose?.();
    }
  }, [STORAGE_KEY, onClose]);

  // حفظ وقت ظهور البوب اب
  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setIsOpen(false);
    onClose?.();
  };

  // إذا مفيش عروض أو لسه بيحمل، متظهرش حاجة
  if (isLoading || offers.length === 0) {
    return null;
  }

  const currentOffer = offers[currentOfferIndex];
  if (!currentOffer) return null;

  const isOffer = currentOffer.type === 'offer';
  const hasDiscount = isOffer && currentOffer.offer_discount;

  // حساب الوقت المتبقي
  const getTimeRemaining = () => {
    if (!currentOffer.end_date) return null;
    const end = new Date(currentOffer.end_date);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return lang === 'ar' ? `ينتهي بعد ${days} يوم` : `Ends in ${days} days`;
    }
    if (hours > 0) {
      return lang === 'ar' ? `ينتهي بعد ${hours} ساعة` : `Ends in ${hours} hours`;
    }
    return lang === 'ar' ? 'ينتهي قريباً' : 'Ends soon';
  };

  const timeRemaining = getTimeRemaining();

  // رابط التحويل - لو فيه ربط للعرض
  const getOfferLink = () => {
    if (isOffer) {
      return `/${teacher?.sub_domain}/courses?discount=${currentOffer.offer_discount}`;
    }
    return `/${teacher?.sub_domain}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
            className="relative max-w-4xl w-full overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* زر الإغلاق */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300 text-white backdrop-blur-sm"
            >
              <X size={22} />
            </button>

            {/* الحاوية الرئيسية - تصميم أفقي */}
            <div className="flex flex-col md:flex-row">
              
              {/* الجانب الأيمن - الصورة (50% من العرض) */}
              <div className="relative md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-gray-900 to-gray-800">
                {currentOffer.image?.fullUrl ? (
                  <img
                    src={currentOffer.image.fullUrl}
                    alt={currentOffer.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    {isOffer ? (
                      <>
                        <Percent size={80} className="text-orange-400/50" />
                        <p className="text-white/50 text-lg font-bold">{lang === 'ar' ? 'عرض خاص' : 'Special Offer'}</p>
                      </>
                    ) : (
                      <>
                        <Gift size={80} className="text-blue-400/50" />
                        <p className="text-white/50 text-lg font-bold">{lang === 'ar' ? 'عرض ترويجي' : 'Promotion'}</p>
                      </>
                    )}
                  </div>
                )}
                
                {/* شارة الخصم الكبيرة */}
                {hasDiscount && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                    className="absolute -top-4 -left-4 z-10"
                  >
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl px-4 py-2 shadow-xl transform -rotate-12">
                      <div className="flex items-center gap-2">
                        <Zap size={20} className="text-yellow-200" />
                        <span className="text-2xl font-black">{currentOffer.offer_discount}%</span>
                        <span className="text-xs font-semibold uppercase">OFF</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-black/30" />
              </div>

              {/* الجانب الأيسر - المحتوى (50% من العرض) */}
              <div className={`relative md:w-1/2 p-6 md:p-8 ${
                isOffer 
                  ? 'bg-gradient-to-br from-orange-500 to-red-600'
                  : 'bg-gradient-to-br from-blue-600 to-purple-700'
              }`}>
                
                {/* أيقونة النوع الصغيرة */}
                <div className="flex justify-start mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  >
                    {isOffer ? (
                      <Percent size={24} className="text-white" />
                    ) : (
                      <Gift size={24} className="text-white" />
                    )}
                  </motion.div>
                </div>

                {/* العنوان */}
                <motion.h2
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3"
                >
                  {currentOffer.title}
                </motion.h2>

                {/* الوصف */}
                {currentOffer.description && (
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/90 text-sm md:text-base mb-4 line-clamp-3"
                  >
                    {currentOffer.description}
                  </motion.p>
                )}

                {/* تفاصيل العرض */}
                {isOffer && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="space-y-2 mb-6"
                  >
                    {/* الخصم */}
                    {hasDiscount && (
                      <div className="flex items-center gap-2 text-white/90 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                        <Tag size={16} className="text-yellow-300" />
                        <span className="text-sm font-medium">
                          {lang === 'ar' 
                            ? `خصم ${currentOffer.offer_discount}% على جميع الكورسات`
                            : `${currentOffer.offer_discount}% discount on all courses`}
                        </span>
                      </div>
                    )}

                    {/* الوقت المتبقي */}
                    {timeRemaining && (
                      <div className="flex items-center gap-2 text-white/90 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                        <Clock size={16} className="text-yellow-300 animate-pulse" />
                        <span className="text-sm font-medium">{timeRemaining}</span>
                      </div>
                    )}

                    {/* الفترة */}
                    {currentOffer.start_date && currentOffer.end_date && (
                      <div className="flex items-center gap-2 text-white/70 text-xs bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                        <Calendar size={14} />
                        <span>
                          {format(new Date(currentOffer.start_date), 'dd MMM yyyy')}
                          {' - '}
                          {format(new Date(currentOffer.end_date), 'dd MMM yyyy')}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* أزرار التحكم بين العروض */}
                {offers.length > 1 && (
                  <div className="flex justify-start gap-2 mb-4">
                    {offers.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentOfferIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${
                          idx === currentOfferIndex
                            ? 'bg-white w-8 h-2'
                            : 'bg-white/40 hover:bg-white/60 w-2 h-2'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* زر الإجراء الرئيسي - يفتح الرابط */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  onClick={() => {
                    // حفظ أن البوب اب ظهر
                    localStorage.setItem(STORAGE_KEY, Date.now().toString());
                    setIsOpen(false);
                    onClose?.();
                    // فتح الرابط
                    window.location.href = getOfferLink();
                  }}
                  className="group w-full py-3 px-4 rounded-xl bg-white text-gray-900 hover:shadow-xl transition-all duration-300 font-bold flex items-center justify-center gap-2"
                >
                  <span>{lang === 'ar' ? 'استفد من العرض الآن' : 'Get This Offer Now'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* نص تخطي */}
                <button
                  onClick={handleClose}
                  className="w-full text-center text-white/50 hover:text-white/80 text-xs mt-3 transition-colors"
                >
                  {lang === 'ar' ? 'تذكرني لاحقاً' : 'Remind me later'}
                </button>
              </div>
            </div>

            {/* إشارة إلى عدد العروض */}
            {offers.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 z-10">
                <p className="text-white text-xs">
                  {currentOfferIndex + 1} / {offers.length}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};