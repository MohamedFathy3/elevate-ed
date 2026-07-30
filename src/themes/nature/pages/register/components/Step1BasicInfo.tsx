// src/pages/register/components/Step1BasicInfo.tsx

import { User, Phone, Lock, Eye, EyeOff, MapPin, Cake, Flag, AlertCircle } from 'lucide-react';
import { RegisterFormData, RegisterFormErrors } from '../Register.types';

interface Step1BasicInfoProps {
  formData: RegisterFormData;
  errors: RegisterFormErrors;
  touched: Record<string, boolean>;
  showPassword: boolean;
  onTogglePassword: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  lang: string;
}

export const Step1BasicInfo = ({
  formData,
  errors,
  touched,
  showPassword,
  onTogglePassword,
  onChange,
  onBlur,
  lang
}: Step1BasicInfoProps) => {
  return (
    <div className="space-y-4">
      {/* الاسم الكامل */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-red-500">*</span>
        </label>
        <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition ${errors.name && touched.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
          <span className="px-4 text-gray-400 dark:text-gray-500"><User className="size-4" /></span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            onBlur={onBlur}
            className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            required
          />
        </div>
        {errors.name && touched.name && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.name}
          </p>
        )}
      </div>

      {/* تاريخ الميلاد */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "تاريخ الميلاد" : "Birth Date"} <span className="text-red-500">*</span>
        </label>
        <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition ${errors.birth_date && touched.birth_date ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
          <span className="px-4 text-gray-400 dark:text-gray-500"><Cake className="size-4" /></span>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={onChange}
            onBlur={onBlur}
            className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        {errors.birth_date && touched.birth_date && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.birth_date}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {lang === "ar" ? "العمر يجب أن يكون بين 3 و 25 سنة" : "Age must be between 3 and 25 years"}
        </p>
      </div>

      {/* رقم الهاتف */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "رقم الهاتف" : "Phone Number"} <span className="text-red-500">*</span>
        </label>
        <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
          <span className="px-4 text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Flag className="size-4 text-green-600" />
            <span className="text-xs font-bold text-green-700 dark:text-green-400">+20</span>
          </span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            onBlur={onBlur}
            className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="01123456789"
            required
          />
          <span className="px-4 text-gray-400 dark:text-gray-500"><Phone className="size-4" /></span>
        </div>
        {errors.phone && touched.phone && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* المنطقة */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "المنطقة" : "Region"} <span className="text-red-500">*</span>
        </label>
        <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition ${errors.region && touched.region ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
          <span className="px-4 text-gray-400 dark:text-gray-500"><MapPin className="size-4" /></span>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={onChange}
            onBlur={onBlur}
            className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder={lang === "ar" ? "مثال: مدينة نصر" : "e.g. Nasr City"}
            required
          />
        </div>
        {errors.region && touched.region && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.region}
          </p>
        )}
      </div>

      {/* كلمة المرور */}
      <div>
        <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "كلمة المرور" : "Password"} <span className="text-red-500">*</span>
        </label>
        <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition ${errors.password && touched.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
          <span className="px-4 text-gray-400 dark:text-gray-500"><Lock className="size-4" /></span>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChange}
            onBlur={onBlur}
            className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            required
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="px-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && touched.password && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </p>
        )}
      </div>
    </div>
  );
};