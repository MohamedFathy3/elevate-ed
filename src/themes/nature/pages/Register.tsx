/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Register.tsx

import { useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link } from "react-router-dom";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentRegister } from "@/hooks/useStudent";
import { useCenterHours } from "@/hooks/useCenterHours";
import FileUploader from "@/components/FileUploader";
import {
  UserPlus, Lock, User, Phone, GraduationCap, Eye, EyeOff,
  Loader2, ArrowLeft, ArrowRight, Building, Wifi, Calendar, Clock,
  MapPin, AlertCircle, ChevronDown, Users, School, Landmark, BookOpen, Image,
  X, CheckCircle, Info, Shield, WifiOff, CreditCard, RefreshCw, Smartphone,
  Flag, Cake
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// ✅ دوال التحقق (Validation)
const validateFullName = (name: string): { isValid: boolean; message: string } => {
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

const validateEgyptianPhone = (phone: string): { isValid: boolean; message: string } => {
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

// ✅ دالة التحقق من تاريخ الميلاد
const validateBirthDate = (date: string): { isValid: boolean; message: string } => {
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

// ✅ دالة لتنسيق رقم الهاتف
const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0') && cleaned.length <= 11) {
    return cleaned;
  }
  if (cleaned.startsWith('+20')) {
    return cleaned;
  }
  return cleaned;
};

const Register = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { teacher, stages, pick, isLoading } = useTeacher();
  const { mutate: register, isPending } = useStudentRegister();
  const { data: centerHours, isLoading: hoursLoading } = useCenterHours(teacher?.id);

  // ✅ State للتحقق من الأخطاء
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ✅ State لإظهار/إخفاء popup التعليمات
  const [showInstructions, setShowInstructions] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    phone_parent: "",
    type_of_attendance: "online",
    gender: "male",
    stage_id: "",
    center_hour_id: "",
    governorate: "",
    school_name: "",
    type_of_study: "general",
    image: "",
    region: "",
    birth_date: "", // ✅ إضافة تاريخ الميلاد
  });

  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const teacherName = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");
  const stagesList = stages || [];
  const hasStages = stagesList.length > 0;
  const isCenter = formData.type_of_attendance === "center";
  const hoursList = centerHours || [];
  const hasHours = hoursList.length > 0;

  // ✅ إغلاق popup
  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  // قائمة المحافظات
  const governorates = [
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

  const getStageName = (stage: any) => {
    if (lang === "ar" && stage.name_ar) return stage.name_ar;
    return stage.name;
  };

  const getHourLabel = (hour: any) => {
    const date = new Date(hour.date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US");
    return `${hour.title} - ${date} الساعة ${hour.hours}`;
  };

  // ✅ دالة التحقق من الحقل
  const validateField = (name: string, value: string): string => {
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

  // ✅ دالة التحقق من جميع الحقول في الخطوة
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (stepNumber === 1) {
      const nameError = validateField("name", formData.name);
      if (nameError) {
        newErrors.name = nameError;
        isValid = false;
      }

      const phoneError = validateField("phone", formData.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
        isValid = false;
      }

      const birthDateError = validateField("birth_date", formData.birth_date);
      if (birthDateError) {
        newErrors.birth_date = birthDateError;
        isValid = false;
      }

      const regionError = validateField("region", formData.region);
      if (regionError) {
        newErrors.region = regionError;
        isValid = false;
      }

      const passwordError = validateField("password", formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
        isValid = false;
      }
    } else if (stepNumber === 2) {
      const governorateError = validateField("governorate", formData.governorate);
      if (governorateError) {
        newErrors.governorate = governorateError;
        isValid = false;
      }

      const schoolError = validateField("school_name", formData.school_name);
      if (schoolError) {
        newErrors.school_name = schoolError;
        isValid = false;
      }

      const stageError = validateField("stage_id", formData.stage_id);
      if (stageError) {
        newErrors.stage_id = stageError;
        isValid = false;
      }

      if (isCenter) {
        const hourError = validateField("center_hour_id", formData.center_hour_id);
        if (hourError) {
          newErrors.center_hour_id = hourError;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
      newValue = formatPhoneNumber(value);
    }

    setFormData({ ...formData, [name]: newValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleProfileUpload = (imageId: number) => {
    setFormData({ ...formData, image: imageId.toString() });
    toast.success(lang === "ar" ? "تم رفع الصورة بنجاح" : "Image uploaded successfully");
  };

  const handleRemoveProfile = () => {
    setFormData({ ...formData, image: "" });
  };

  const hasImage = formData.image && formData.image !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasImage) {
      toast.error(lang === "ar" ? "الرجاء رفع صورة شخصية لإكمال التسجيل" : "Please upload a profile picture to complete registration");
      setStep(3);
      return;
    }

    if (!teacher?.id) {
      toast.error(lang === "ar" ? "لم يتم العثور على المعلم" : "Teacher not found");
      return;
    }

    const isStep1Valid = validateStep(1);
    const isStep2Valid = validateStep(2);

    if (!isStep1Valid) {
      setStep(1);
      toast.error(lang === "ar" ? "الرجاء تصحيح الأخطاء في البيانات الأساسية" : "Please fix errors in basic data");
      return;
    }

    if (!isStep2Valid) {
      setStep(2);
      toast.error(lang === "ar" ? "الرجاء تصحيح الأخطاء في البيانات الدراسية" : "Please fix errors in study data");
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      phone: formData.phone.replace(/[\s\-\\()]/g, ''),
      password: formData.password,
      phone_parent: formData.phone_parent || undefined,
      type_of_attendance: formData.type_of_attendance as 'online' | 'center',
      gender: formData.gender as 'male' | 'female',
      teacher_id: teacher.id,
      stage_id: parseInt(formData.stage_id),
      center_hour_id: isCenter ? parseInt(formData.center_hour_id) : undefined,
      governorate: formData.governorate,
      school_name: formData.school_name.trim(),
      type_of_study: formData.type_of_study as 'general' | 'azhar',
      image: formData.image ? parseInt(formData.image) : undefined,
      region: formData.region.trim(),
      birth_date: formData.birth_date,
    };

    register(submitData);
  };

  const nextStep = () => {
    if (step === 1) {
      if (validateStep(1)) {
        setStep(2);
      } else {
        toast.error(lang === "ar" ? "الرجاء تصحيح الأخطاء في البيانات الأساسية" : "Please fix errors in basic data");
      }
    } else if (step === 2) {
      if (validateStep(2)) {
        setStep(3);
      } else {
        toast.error(lang === "ar" ? "الرجاء تصحيح الأخطاء في البيانات الدراسية" : "Please fix errors in study data");
      }
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && step !== 3) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  if (isLoading || hoursLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24 bg-white dark:bg-gray-950">
      {/* ✅ خلفية متحركة خفيفة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-emerald-400/10 dark:bg-emerald-400/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-300/5 dark:bg-emerald-300/5 blur-3xl" />

        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-400/30 dark:bg-emerald-400/20"
            style={{
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* ✅ Modal التعليمات */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseInstructions}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-5 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {lang === "ar" ? "📋 تعليمات هامة" : "📋 Important Instructions"}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {lang === "ar" ? "برجاء قراءة التعليمات بعناية" : "Please read carefully"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseInstructions}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-300">
                      {lang === "ar" ? "📱 متوافق مع جميع الأجهزة" : "📱 Compatible with all devices"}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      {lang === "ar"
                        ? "المنصة تعمل على جميع الأجهزة (موبايل ولابتوب)"
                        : "The platform works on all devices (Mobile & Laptop)"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Cake className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-800 dark:text-purple-300">
                      {lang === "ar" ? "🎂 تاريخ الميلاد" : "🎂 Birth Date"}
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      {lang === "ar"
                        ? "يجب أن يكون العمر بين 3 و 25 سنة"
                        : "Age must be between 3 and 25 years"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300">
                      {lang === "ar" ? "👥 نوع الحساب" : "👥 Account Type"}
                    </h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                      {lang === "ar"
                        ? "طالب سنتر يعمل أكونت سنتر وطالب الأونلاين يعمل أكونت أونلاين"
                        : "Center student creates center account, online student creates online account"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-800 dark:text-amber-300">
                      {lang === "ar" ? "🔒 لا يمكن تعديل البيانات" : "🔒 No data modification"}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      {lang === "ar"
                        ? "لا يمكن تعديل البيانات إلا بالعودة للدعم"
                        : "Data cannot be modified except by contacting support"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-800 dark:text-red-300">
                      {lang === "ar" ? "💰 عدم استرجاع الكورسات" : "💰 No course refund"}
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {lang === "ar"
                        ? "لا يمكن استرجاع أو تبديل الكورس بعد الاشتراك"
                        : "No refund or exchange of course after subscription"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <WifiOff className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-cyan-800 dark:text-cyan-300">
                      {lang === "ar" ? "🌐 اتصال إنترنت قوي" : "🌐 Strong internet connection"}
                    </h3>
                    <p className="text-sm text-cyan-700 dark:text-cyan-400">
                      {lang === "ar"
                        ? "استخدم واي فاي قوي والنت يكون مستقر جدا حتي لا تواجه مشكلة مع الفيديوهات"
                        : "Use strong Wi-Fi and stable internet to avoid video issues"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-800 dark:text-rose-300">
                      {lang === "ar" ? "👤 استخدام شخصي فقط" : "👤 Personal use only"}
                    </h3>
                    <p className="text-sm text-rose-700 dark:text-rose-400">
                      {lang === "ar"
                        ? "الحساب مخصص للاستخدام الشخصي فقط ومشاركته تعرضه للإغلاق"
                        : "Account is for personal use only; sharing it will lead to closure"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 p-4 rounded-b-3xl border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>{lang === "ar" ? "برجاء الالتزام بهذه التعليمات" : "Please follow these instructions"}</span>
                  </div>
                  <button
                    onClick={handleCloseInstructions}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm hover:shadow-lg transition-all"
                  >
                    {lang === "ar" ? "فهمت ✓" : "I Understand ✓"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        {/* Back to Home Link */}
        <Link
          to={``}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
        >
          <Arrow className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white grid place-items-center shadow-lg shadow-emerald-500/25">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                {lang === "ar" ? "إنشاء حساب جديد" : "Create Account"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lang === "ar" ? "انضم إلى منصة " : "Join "}{teacherName}
              </p>
            </div>
          </div>

          {/* Steps Indicator - UI القديم */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'}`}>1</div>
              <span className="text-sm hidden sm:inline">{lang === "ar" ? "المعلومات الأساسية" : "Basic Info"}</span>
            </div>
            <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'}`}>2</div>
              <span className="text-sm hidden sm:inline">{lang === "ar" ? "البيانات الدراسية" : "Study Info"}</span>
            </div>
            <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />
            <div className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 3 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'}`}>3</div>
              <span className="text-sm hidden sm:inline">{lang === "ar" ? "الصورة" : "Photo"}</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 3) {
                handleSubmit(e);
              }
            }}
          >
            {/* Step 1: المعلومات الأساسية - UI القديم مع إضافة تاريخ الميلاد */}
            {step === 1 && (
              <div className="space-y-4">
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
                      onChange={handleChange}
                      onBlur={handleBlur}
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

                {/* ✅ تاريخ الميلاد - مضاف للUI القديم */}
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
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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
            )}

            {/* Step 2: البيانات الدراسية - UI القديم */}
            {step === 2 && (
              <div className="space-y-4">
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
                      onChange={handleChange}
                      className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                    {lang === "ar" ? "المحافظة" : "Governorate"} <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition ${errors.governorate && touched.governorate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
                    <span className="px-4 text-gray-400 dark:text-gray-500"><MapPin className="size-4" /></span>
                    <select
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="flex-1 py-3 outline-none text-sm appearance-none pr-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
                      required
                    >
                      <option value="">{lang === "ar" ? "اختر المحافظة" : "Select governorate"}</option>
                      {governorates.map((gov) => (
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
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="flex-1 py-3 outline-none text-sm appearance-none pr-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
                        required
                      >
                        <option value="">{lang === "ar" ? "اختر المرحلة" : "Select grade"}</option>
                        {stagesList.map((stage: any) => (
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

                <div>
                  <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                    {lang === "ar" ? "نوع الدراسة" : "Type of Study"} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type_of_study: "general" })}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.type_of_study === "general"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
                        }`}
                    >
                      {lang === "ar" ? "عام" : "General"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type_of_study: "azhar" })}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.type_of_study === "azhar"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
                        }`}
                    >
                      {lang === "ar" ? "أزهري" : "Azhar"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                    {lang === "ar" ? "نوع الحضور" : "Attendance Type"} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type_of_attendance: "online", center_hour_id: "" })}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.type_of_attendance === "online"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
                        }`}
                    >
                      {lang === "ar" ? "أونلاين" : "Online"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type_of_attendance: "center" })}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.type_of_attendance === "center"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
                        }`}
                    >
                      {lang === "ar" ? "سنتر" : "Center"}
                    </button>
                  </div>
                </div>

                {isCenter && (
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-4 space-y-3 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                      <Calendar className="size-4" />
                      {lang === "ar" ? "اختر الميعاد المناسب" : "Select suitable time"}
                    </div>

                    {!hasHours ? (
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          {lang === "ar" ? "لا توجد مواعيد متاحة حالياً" : "No available times"}
                        </p>
                      </div>
                    ) : (
                      <select
                        name="center_hour_id"
                        value={formData.center_hour_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
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

                <div>
                  <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                    {lang === "ar" ? "النوع" : "Gender"} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "male" })}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${formData.gender === "male"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
                        }`}
                    >
                      {lang === "ar" ? "ذكر" : "Male"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "female" })}
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
            )}

            {/* Step 3: الصورة الشخصية - UI القديم */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200 dark:border-emerald-800">
                    <Image className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {lang === "ar" ? "📸 الصورة الشخصية" : "📸 Profile Picture"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {lang === "ar" ? "برجاء رفع صورتك الشخصية" : "Please upload your profile picture"}
                  </p>
                </div>

                <FileUploader
                  label={lang === "ar" ? "📸 تحميل الصورة الشخصية (مطلوبة)" : "📸 Upload Profile Picture (Required)"}
                  onUploadSuccess={handleProfileUpload}
                  multiple={false}
                  accept="image/*"
                  preview={true}
                  uniqueId="profile-upload"
                  maxFiles={1}
                  defaultImageId={formData.image ? parseInt(formData.image) : null}
                  onRemoveImage={handleRemoveProfile}
                  required={true}
                />

                {!formData.image && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {lang === "ar" ? "⚠️ الصورة الشخصية مطلوبة" : "⚠️ Profile picture is required"}
                    </p>
                  </div>
                )}

                {formData.image && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      {lang === "ar" ? "✅ تم رفع الصورة بنجاح" : "✅ Image uploaded successfully"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Buttons - UI القديم */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  {lang === "ar" ? "السابق" : "Previous"}
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {lang === "ar" ? "التالي" : "Next"}
                  <Arrow className="w-4 h-4 inline ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending || !hasStages || (isCenter && !hasHours) || !formData.image}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    lang === "ar" ? "إنشاء حساب" : "Create Account"
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <Link to={`/login`} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              {lang === "ar" ? "تسجيل الدخول" : "Login"}
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Register;