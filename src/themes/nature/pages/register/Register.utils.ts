// src/pages/register/Register.utils.ts

import { Governorate } from './Register.types';

// ✅ دوال التحقق
export const validateFullName = (name: string): { isValid: boolean; message: string } => {
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/).filter(word => word.length > 0);

  if (words.length < 4) {
    return {
      isValid: false,
      message: "الاسم يجب أن يتكون من 4 كلمات على الأقل (الاسم الرباعي)"
    };
  }

  const hasInvalidChars = /[^a-zA-Z\u0600-\u06FF\s]/.test(trimmed);
  if (hasInvalidChars) {
    return {
      isValid: false,
      message: "الاسم يحتوي على أحرف غير مسموحة"
    };
  }

  return { isValid: true, message: "" };
};

export const validateEgyptianPhone = (phone: string): { isValid: boolean; message: string } => {
  const clean = phone.replace(/[\s\-\\(\\)]/g, '');

  const egyptPatterns = [
    /^01[0125]\d{8}$/,
    /^\+201[0125]\d{8}$/,
    /^201[0125]\d{8}$/,
    /^00201[0125]\d{8}$/,
  ];

  const isValid = egyptPatterns.some(pattern => pattern.test(clean));

  if (!isValid) {
    return {
      isValid: false,
      message: "رقم الهاتف يجب أن يكون رقم مصري صحيح (11 رقم يبدأ بـ 010, 011, 012, 015)"
    };
  }

  return { isValid: true, message: "" };
};

export const validateBirthDate = (date: string): { isValid: boolean; message: string } => {
  if (!date) {
    return { isValid: false, message: "تاريخ الميلاد مطلوب" };
  }

  const birthDate = new Date(date);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 3) {
    return { isValid: false, message: "العمر يجب أن يكون 3 سنوات على الأقل" };
  }
  if (age > 25) {
    return { isValid: false, message: "العمر يجب أن يكون 25 سنة كحد أقصى" };
  }

  if (birthDate > today) {
    return { isValid: false, message: "تاريخ الميلاد لا يمكن أن يكون في المستقبل" };
  }

  return { isValid: true, message: "" };
};

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0') && cleaned.length <= 11) {
    return cleaned;
  }
  if (cleaned.startsWith('+20')) {
    return cleaned;
  }
  return cleaned;
};

export const validateField = (
  name: string, 
  value: string, 
  lang: string, 
  isCenter: boolean
): string => {
  switch (name) {
    case "name": {
      const result = validateFullName(value);
      return result.isValid ? "" : result.message;
    }
    case "phone": {
      const result = validateEgyptianPhone(value);
      return result.isValid ? "" : result.message;
    }
    case "password": {
      if (value.length < 6) {
        return lang === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters";
      }
      return "";
    }
    case "region": {
      if (!value.trim()) {
        return lang === "ar" ? "الرجاء إدخال المنطقة" : "Please enter region";
      }
      return "";
    }
    case "birth_date": {
      const result = validateBirthDate(value);
      return result.isValid ? "" : result.message;
    }
    case "governorate": {
      if (!value) {
        return lang === "ar" ? "الرجاء اختيار المحافظة" : "Please select governorate";
      }
      return "";
    }
    case "school_name": {
      if (!value.trim()) {
        return lang === "ar" ? "الرجاء إدخال اسم المدرسة" : "Please enter school name";
      }
      return "";
    }
    case "stage_id": {
      if (!value) {
        return lang === "ar" ? "الرجاء اختيار المرحلة الدراسية" : "Please select educational stage";
      }
      return "";
    }
    case "center_hour_id": {
      if (isCenter && !value) {
        return lang === "ar" ? "الرجاء اختيار الميعاد المناسب" : "Please select suitable time";
      }
      return "";
    }
    default:
      return "";
  }
};

// ✅ المحافظات
export const GOVERNORATES: Governorate[] = [
  { value: "cairo", label: "القاهرة", label_en: "Cairo" },
  { value: "alexandria", label: "الإسكندرية", label_en: "Alexandria" },
  { value: "giza", label: "الجيزة", label_en: "Giza" },
  { value: "sharqia", label: "الشرقية", label_en: "Sharqia" },
  { value: "dakahlia", label: "الدقهلية", label_en: "Dakahlia" },
  { value: "beheira", label: "البحيرة", label_en: "Beheira" },
  { value: "qalyubia", label: "القليوبية", label_en: "Qalyubia" },
  { value: "menofia", label: "المنوفية", label_en: "Menofia" },
  { value: "gharbia", label: "الغربية", label_en: "Gharbia" },
  { value: "kafr_el_sheikh", label: "كفر الشيخ", label_en: "Kafr El Sheikh" },
  { value: "ismailia", label: "الإسماعيلية", label_en: "Ismailia" },
  { value: "port_said", label: "بورسعيد", label_en: "Port Said" },
  { value: "suez", label: "السويس", label_en: "Suez" },
  { value: "damietta", label: "دمياط", label_en: "Damietta" },
  { value: "luxor", label: "الأقصر", label_en: "Luxor" },
  { value: "aswan", label: "أسوان", label_en: "Aswan" },
  { value: "sohag", label: "سوهاج", label_en: "Sohag" },
  { value: "asyut", label: "أسيوط", label_en: "Asyut" },
  { value: "minya", label: "المنيا", label_en: "Minya" },
  { value: "beni_suef", label: "بني سويف", label_en: "Beni Suef" },
  { value: "qena", label: "قنا", label_en: "Qena" },
  { value: "red_sea", label: "البحر الأحمر", label_en: "Red Sea" },
  { value: "new_valley", label: "الوادي الجديد", label_en: "New Valley" },
  { value: "matrouh", label: "مطروح", label_en: "Matrouh" },
  { value: "north_sinai", label: "شمال سيناء", label_en: "North Sinai" },
  { value: "south_sinai", label: "جنوب سيناء", label_en: "South Sinai" },
];