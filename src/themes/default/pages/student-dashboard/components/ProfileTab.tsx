// src/pages/student-dashboard/components/ProfileTab.tsx

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  User, Hash, Phone, PhoneCall, BarcodeIcon, MapPin, Users, Wifi, 
  VenetianMask, Landmark, School, GraduationCap, Calendar, Wallet
} from "lucide-react";
import Barcode from "react-barcode";
import { ProfileTabProps } from "../StudentDashboard.types";

export const ProfileTab = ({ studentInfo, lang, isNature, isDark, cardBg }: ProfileTabProps) => {
  const isRtl = lang === 'ar';
  const [imageError, setImageError] = useState(false);

  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';

  const infoCards = [
    { icon: <User className="w-5 h-5" />, label: isRtl ? "الاسم" : "Name", value: studentInfo?.name },
    { icon: <Hash className="w-5 h-5" />, label: "ID", value: studentInfo?.id, highlight: true },
    { icon: <Phone className="w-5 h-5" />, label: isRtl ? "رقم الهاتف" : "Phone", value: studentInfo?.phone },
    { icon: <PhoneCall className="w-5 h-5" />, label: isRtl ? "هاتف ولي الأمر" : "Parent Phone", value: studentInfo?.phone_parent },
    { icon: <BarcodeIcon className="w-5 h-5" />, label: isRtl ? "الباركود" : "Barcode", value: studentInfo?.barcode, isBarcode: true },
    { icon: <MapPin className="w-5 h-5" />, label: isRtl ? "المنطقة" : "Region", value: studentInfo?.region },
    { icon: <Users className="w-5 h-5" />, label: isRtl ? "كود ولي الأمر" : "Parent Code", value: studentInfo?.code_parent },
    { icon: <Wifi className="w-5 h-5" />, label: isRtl ? "نوع الحضور" : "Attendance Type", value: studentInfo?.type_of_attendance === 'online' ? (isRtl ? "أونلاين" : "Online") : (isRtl ? "حضوري" : "In-person") },
    { icon: <VenetianMask className="w-5 h-5" />, label: isRtl ? "الجنس" : "Gender", value: studentInfo?.gender === 'male' ? (isRtl ? "ذكر" : "Male") : (isRtl ? "أنثى" : "Female") },
    { icon: <Landmark className="w-5 h-5" />, label: isRtl ? "المحافظة" : "Governorate", value: studentInfo?.governorate },
    { icon: <School className="w-5 h-5" />, label: isRtl ? "اسم المدرسة" : "School Name", value: studentInfo?.school_name },
    { icon: <GraduationCap className="w-5 h-5" />, label: isRtl ? "نوع الدراسة" : "Study Type", value: studentInfo?.type_of_study === 'general' ? (isRtl ? "عام" : "General") : (isRtl ? "أزهري" : "Azhar") },
    { icon: <Calendar className="w-5 h-5" />, label: isRtl ? "تاريخ التسجيل" : "Registered Since", value: studentInfo?.created_at ? new Date(studentInfo.created_at).toLocaleDateString() : '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <User className={isDark ? 'text-white' : 'text-gray-700'} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "الملف الشخصي" : "My Profile"}
        </h2>
      </div>

      {/* Profile Image */}
      {(studentInfo?.image?.fullUrl || studentInfo?.imageUrl) && (
        <div className={`p-6 rounded-xl ${cardBg} text-center`}>
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20">
            {studentInfo?.image?.fullUrl || studentInfo?.imageUrl ? (
              !imageError ? (
                <img
                  src={studentInfo.image?.fullUrl || studentInfo.imageUrl}
                  alt={studentInfo.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${getTextColor()}`}>
                  {studentInfo?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${getTextColor()}`}>
                {studentInfo?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
            )}
          </div>
          <h3 className={`mt-3 font-semibold text-lg ${getTextColor()}`}>
            {studentInfo.name}
          </h3>
          <p className={`text-sm ${getMutedColor()}`}>
            ID: {studentInfo.id}
          </p>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {infoCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.4, ease: "easeOut" }}
            className={`
              group relative p-5 rounded-2xl 
              transition-all duration-300 
              hover:scale-[1.02] hover:shadow-xl
              ${cardBg}
              ${card.highlight ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/5' : 'hover:shadow-md'}
              ${isDark ? 'hover:bg-gray-800/90' : 'hover:bg-gray-50/80'}
            `}
          >
            {card.highlight && (
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            )}

            <div className="relative flex items-start gap-4">
              <div className={`
                p-2.5 rounded-xl flex-shrink-0 transition-all duration-300
                ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
                ${card.highlight ? `ring-1 ring-${isNature ? 'amber' : 'primary'}/30` : ''}
                group-hover:scale-105
              `}>
                <div className={`
                  w-5 h-5 
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                  ${card.highlight ? `text-${isNature ? 'amber' : 'primary'}` : ''}
                `}>
                  {card.icon}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className={`
                  text-xs font-medium uppercase tracking-wider
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  {card.label}
                </p>

                {card.isBarcode && card.value ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-800/80">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 text-primary">
                          <BarcodeIcon />
                        </div>
                        <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                          {isRtl ? "باركود الطالب" : "Student Barcode"}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        ID
                      </span>
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="bg-white rounded-xl p-8 sm:p-4 shadow-inner mt-3 overflow-hidden">
                        <Barcode
                          value={card.value.toString()}
                          width={1.2}
                          height={50}
                          fontSize={12}
                          margin={0}
                          displayValue={false}
                          format="CODE128"
                          background="#ffffff"
                          lineColor="#000000"
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <p className="font-mono font-bold text-base sm:text-lg tracking-[0.3em] text-gray-900 dark:text-white">
                          {card.value}
                        </p>
                        <p className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          {isRtl 
                            ? "استخدم هذا الباركود لتسجيل الحضور"
                            : "Use this barcode for attendance"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className={`
                      font-semibold text-base break-all transition-colors duration-200
                      ${card.highlight 
                        ? isNature 
                          ? 'text-amber-600 dark:text-amber-400' 
                          : 'text-primary'
                        : isDark 
                          ? 'text-white' 
                          : 'text-gray-900'
                      }
                      ${!card.value ? 'opacity-50' : ''}
                    `}>
                      {card.value || "—"}
                    </p>
                    {card.highlight && card.value && (
                      <div className={`mt-1 w-8 h-0.5 rounded-full bg-${isNature ? 'amber' : 'primary'}/50`} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};