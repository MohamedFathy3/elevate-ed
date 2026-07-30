/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/register/components/Step2StudyInfo.tsx

import { useState } from 'react';
import { 
  Users, MapPin, School, GraduationCap, ChevronDown, 
  Calendar, AlertCircle, Loader2 
} from 'lucide-react';
import { RegisterFormData, RegisterFormErrors } from '../Register.types';
import { GOVERNORATES } from '../Register.utils';

interface Step2StudyInfoProps {
  formData: RegisterFormData;
  errors: RegisterFormErrors;
  touched: Record<string, boolean>;
  stages: any[];
  hoursList: any[];
  isCenter: boolean;
  hasStages: boolean;
  hasHours: boolean;
  hoursLoading: boolean;
  lang: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSetField: (name: keyof RegisterFormData, value: any) => void;
  getStageName: (stage: any) => string;
  getHourLabel: (hour: any) => string;
}

export const Step2StudyInfo = ({
  formData,
  errors,
  touched,
  stages,
  hoursList,
  isCenter,
  hasStages,
  hasHours,
  hoursLoading,
  lang,
  onChange,
  onBlur,
  onSetField,
  getStageName,
  getHourLabel
}: Step2StudyInfoProps) => {
  return (
    <div className="space-y-4">
      {/* رقم هاتف ولي الأمر */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "رقم هاتف ولي الأمر" : "Parent Phone"}
        </label>
        <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition">
          <span className="px-4 text-gray-400 dark:text-gray-500"><Users className="size-4" /></span>
          <input
            type="tel"
            name="phone_parent"
            value={formData.phone_parent}
            onChange={onChange}
            className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* المحافظة */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "المحافظة" : "Governorate"} <span className="text-red-500">*</span>
        </label>
        <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition ${errors.governorate && touched.governorate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
          <span className="px-4 text-gray-400 dark:text-gray-500"><MapPin className="size-4" /></span>
          <select
            name="governorate"
            value={formData.governorate}
            onChange={onChange}
            onBlur={onBlur}
            className="flex-1 py-3 outline-none text-sm appearance-none pr-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
            required
          >
            <option value="">{lang === "ar" ? "اختر المحافظة" : "Select governorate"}</option>
            {GOVERNORATES.map((gov) => (
              <option key={gov.value} value={gov.value}>
                {lang === "ar" ? gov.label : gov.label_en}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
        {errors.governorate && touched.governorate && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.governorate}
          </p>
        )}
      </div>

      {/* اسم المدرسة */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "اسم المدرسة" : "School Name"} <span className="text-red-500">*</span>
        </label>
        <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition ${errors.school_name && touched.school_name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
          <span className="px-4 text-gray-400 dark:text-gray-500"><School className="size-4" /></span>
          <input
            type="text"
            name="school_name"
            value={formData.school_name}
            onChange={onChange}
            onBlur={onBlur}
            className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            required
          />
        </div>
        {errors.school_name && touched.school_name && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.school_name}
          </p>
        )}
      </div>

      {/* المرحلة الدراسية */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "المرحلة الدراسية" : "Grade"} <span className="text-red-500">*</span>
        </label>
        {!hasStages ? (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              {lang === "ar" ? "لا توجد مراحل متاحة حالياً" : "No stages available"}
            </p>
          </div>
        ) : (
          <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition ${errors.stage_id && touched.stage_id ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
            <span className="px-4 text-gray-400 dark:text-gray-500"><GraduationCap className="size-4" /></span>
            <select
              name="stage_id"
              value={formData.stage_id}
              onChange={onChange}
              onBlur={onBlur}
              className="flex-1 py-3 outline-none text-sm appearance-none pr-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
              required
            >
              <option value="">{lang === "ar" ? "اختر المرحلة" : "Select grade"}</option>
              {stages.map((stage: any) => (
                <option key={stage.id} value={stage.id}>{getStageName(stage)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        )}
        {errors.stage_id && touched.stage_id && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.stage_id}
          </p>
        )}
      </div>

      {/* نوع الدراسة */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "نوع الدراسة" : "Type of Study"} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSetField("type_of_study", "general")}
            className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.type_of_study === "general"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
            }`}
          >
            {lang === "ar" ? "عام" : "General"}
          </button>
          <button
            type="button"
            onClick={() => onSetField("type_of_study", "azhar")}
            className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.type_of_study === "azhar"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
            }`}
          >
            {lang === "ar" ? "أزهري" : "Azhar"}
          </button>
        </div>
      </div>

      {/* نوع الحضور */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "نوع الحضور" : "Attendance Type"} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSetField("type_of_attendance", "online")}
            className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.type_of_attendance === "online"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
            }`}
          >
            {lang === "ar" ? "أونلاين" : "Online"}
          </button>
          <button
            type="button"
            onClick={() => onSetField("type_of_attendance", "center")}
            className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.type_of_attendance === "center"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
            }`}
          >
            {lang === "ar" ? "سنتر" : "Center"}
          </button>
        </div>
      </div>

      {/* مواعيد السنتر */}
      {isCenter && (
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-4 space-y-3 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <Calendar className="size-4" />
            {lang === "ar" ? "اختر الميعاد المناسب" : "Select suitable time"}
          </div>

          {hoursLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              <span className="mr-2 text-sm text-gray-500">
                {lang === "ar" ? "جاري تحميل المواعيد..." : "Loading times..."}
              </span>
            </div>
          ) : !hasHours ? (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                  {lang === "ar" ? "⚠️ لا توجد مواعيد متاحة حالياً" : "⚠️ No available times"}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  {lang === "ar" 
                    ? "يرجى التواصل مع المعلم لإضافة مواعيد السنتر" 
                    : "Please contact the teacher to add center hours"}
                </p>
              </div>
            </div>
          ) : (
            <select
              name="center_hour_id"
              value={formData.center_hour_id}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-2.5 outline-none text-sm text-gray-900 dark:text-white ${errors.center_hour_id && touched.center_hour_id ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
              required
            >
              <option value="">{lang === "ar" ? "اختر الميعاد" : "Select time"}</option>
              {hoursList.map((hour: any) => (
                <option key={hour.id} value={hour.id}>{getHourLabel(hour)}</option>
              ))}
            </select>
          )}
          {errors.center_hour_id && touched.center_hour_id && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.center_hour_id}
            </p>
          )}
        </div>
      )}

      {/* النوع (ذكر/أنثى) */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "النوع" : "Gender"} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSetField("gender", "male")}
            className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.gender === "male"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
            }`}
          >
            {lang === "ar" ? "ذكر" : "Male"}
          </button>
          <button
            type="button"
            onClick={() => onSetField("gender", "female")}
            className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.gender === "female"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
            }`}
          >
            {lang === "ar" ? "أنثى" : "Female"}
          </button>
        </div>
      </div>
    </div>
  );
};