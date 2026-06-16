/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Register.tsx

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
  X, CheckCircle, AlertTriangle, Info, Shield, WifiOff, Users as UsersIcon, 
  BookMarked, CreditCard, RefreshCw, Smartphone, Laptop, Globe
} from "lucide-react";
import { toast  } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { teacher, stages, pick, isLoading } = useTeacher();
  const { mutate: register, isPending } = useStudentRegister();
  const { data: centerHours, isLoading: hoursLoading } = useCenterHours(teacher?.id);
  
  // ✅ State لإظهار/إخفاء popup التعليمات - يظهر كل مرة
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
    region:"",
  });

  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const chevronPos = dir === "rtl" ? "left-4" : "right-4";

  const teacherName = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");
  const home = teacher?.website?.home;
  const heroImage = home?.imageUrl || home?.image?.fullUrl;

  const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2";
  const inputInnerCls = "flex-1 bg-transparent py-3 outline-none text-sm text-slate-900 dark:text-white";
  const fieldCls =
    "relative flex items-center bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:border-[#3b5bdb] focus-within:ring-2 focus-within:ring-[#3b5bdb]/15 transition-all";
  const toggleActive =
    "bg-white dark:bg-slate-700 text-[#3b5bdb] dark:text-sky-400 shadow-sm border-transparent";
  const toggleInactive =
    "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 border-transparent";
  const btnPrimary =
    "flex-1 py-3.5 rounded-xl bg-[#3b5bdb] hover:bg-[#364fc7] text-white font-semibold shadow-[0_4px_14px_rgba(59,91,219,0.35)] hover:shadow-[0_6px_20px_rgba(59,91,219,0.45)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none";
  const btnOutline =
    "px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all";

  const stepDot = (n: number) =>
    step === n
      ? "bg-[#3b5bdb] text-white"
      : step > n
        ? "bg-[#edf2ff] dark:bg-[#3b5bdb]/20 text-[#3b5bdb] dark:text-sky-400"
        : "bg-slate-100 dark:bg-slate-800 text-slate-400";
  const stepLabel = (n: number) =>
    step === n ? "text-[#3b5bdb] dark:text-sky-400" : step > n ? "text-slate-500" : "text-slate-400";
  const stagesList = stages || [];
  const hasStages = stagesList.length > 0;
  const isCenter = formData.type_of_attendance === "center";
  const hoursList = centerHours || [];
  const hasHours = hoursList.length > 0;

  // ✅ إغلاق popup (بدون حفظ في localStorage)
  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  // قائمة المحافظات (نفس الكود الموجود)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    
    if (!formData.stage_id) {
      toast.error(lang === "ar" ? "الرجاء اختيار المرحلة الدراسية" : "Please select educational stage");
      return;
    }
    
    if (isCenter && !formData.center_hour_id) {
      toast.error(lang === "ar" ? "الرجاء اختيار الميعاد المناسب للسنتر" : "Please select a suitable center time");
      return;
    }
    
    const submitData = {
      name: formData.name,
      phone: formData.phone,
      password: formData.password,
      phone_parent: formData.phone_parent || undefined,
      type_of_attendance: formData.type_of_attendance as 'online' | 'center',
      gender: formData.gender as 'male' | 'female',
      teacher_id: teacher.id,
      stage_id: parseInt(formData.stage_id),
      center_hour_id: isCenter ? parseInt(formData.center_hour_id) : undefined,
      governorate: formData.governorate,
      school_name: formData.school_name,
      type_of_study: formData.type_of_study as 'general' | 'azhar',
      image: formData.image ? parseInt(formData.image) : undefined,
      region:formData.region,
    };
    
    register(submitData);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name) {
        toast.error(lang === "ar" ? "الرجاء إدخال الاسم" : "Please enter your name");
        return;
      }
      if (!formData.phone) {
        toast.error(lang === "ar" ? "الرجاء إدخال رقم الهاتف" : "Please enter phone number");
        return;
      }
      if (!formData.password) {
        toast.error(lang === "ar" ? "الرجاء إدخال كلمة المرور" : "Please enter password");
        return;
      }
      setStep(2);
    } 
    else if (step === 2) {
      if (!formData.governorate) {
        toast.error(lang === "ar" ? "الرجاء اختيار المحافظة" : "Please select governorate");
        return;
      }
      if (!formData.school_name) {
        toast.error(lang === "ar" ? "الرجاء إدخال اسم المدرسة" : "Please enter school name");
        return;
      }
      if (!formData.stage_id) {
        toast.error(lang === "ar" ? "الرجاء اختيار المرحلة الدراسية" : "Please select educational stage");
        return;
      }
      
      setStep(3);
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
      <div className="min-h-screen bg-[#eef1f6] dark:bg-[#0f1419] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#3b5bdb]" />
      </div>
    );
  }

  return (
    <>
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
              className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#161b22] shadow-2xl ring-1 ring-slate-200/80 dark:ring-slate-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-[#3b5bdb] text-white p-5 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {lang === "ar" ? "تعليمات هامة" : "Important Instructions"}
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

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-300">
                      {lang === "ar" ? "متوافق مع جميع الأجهزة" : "Compatible with all devices"}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      {lang === "ar"
                        ? "المنصة تعمل على جميع الأجهزة (موبايل ولابتوب)"
                        : "The platform works on all devices (Mobile & Laptop)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <UsersIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300">
                      {lang === "ar" ? "نوع الحساب" : "Account Type"}
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
                      {lang === "ar" ? "لا يمكن تعديل البيانات" : "No data modification"}
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
                      {lang === "ar" ? "عدم استرجاع الكورسات" : "No course refund"}
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {lang === "ar"
                        ? "لا يمكن استرجاع أو تبديل الكورس بعد الاشتراك"
                        : "No refund or exchange of course after subscription"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-800 dark:text-purple-300">
                      {lang === "ar" ? "اسأل قبل الاشتراك" : "Ask before subscribing"}
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      {lang === "ar"
                        ? "لو فيه حاجه مش متأكد منها اسأل الدعم قبل الأشتراك"
                        : "If you are unsure about anything, ask support before subscribing"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <WifiOff className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-cyan-800 dark:text-cyan-300">
                      {lang === "ar" ? "اتصال إنترنت قوي" : "Strong internet connection"}
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
                      {lang === "ar" ? "استخدام شخصي فقط" : "Personal use only"}
                    </h3>
                    <p className="text-sm text-rose-700 dark:text-rose-400">
                      {lang === "ar"
                        ? "الحساب مخصص للاستخدام الشخصي فقط ومشاركته تعرضه للإغلاق"
                        : "Account is for personal use only; sharing it will lead to closure"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-b-3xl border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span>{lang === "ar" ? "برجاء الالتزام بهذه التعليمات" : "Please follow these instructions"}</span>
                  </div>
                  <button
                    onClick={handleCloseInstructions}
                    className="px-6 py-2.5 rounded-xl bg-[#3b5bdb] hover:bg-[#364fc7] text-white font-semibold text-sm transition-all"
                  >
                    {lang === "ar" ? "فهمت ✓" : "I Understand ✓"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="min-h-screen bg-[#eef1f6] dark:bg-[#0f1419] flex items-start lg:items-center px-4 py-28 sm:px-6 sm:py-32 lg:px-10 lg:py-24">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 dark:ring-slate-700/50">
            <div
              className={`relative min-h-[200px] sm:min-h-[240px] lg:min-h-[640px] flex flex-col justify-end overflow-hidden bg-[#1a2744] ${
                dir === "rtl" ? "lg:order-2" : "lg:order-1"
              }`}
            >
              {heroImage && (
                <img src={heroImage} alt={teacherName} className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2744]/95 via-[#243b6b]/90 to-[#1e3a5f]/85" />
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(99,140,255,0.35) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(56,189,248,0.2) 0%, transparent 45%)",
                }}
              />
              <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-white">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mb-5">
                  <UserPlus className="w-6 h-6 text-sky-200" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2 tracking-tight">
                  {lang === "ar" ? "ابدأ رحلتك التعليمية" : "Start Your Journey"}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base max-w-sm leading-relaxed">
                  {lang === "ar"
                    ? `انضم إلى منصة ${teacherName} وسجّل حسابك في دقائق للوصول إلى كل المحتوى التعليمي.`
                    : `Join ${teacherName}'s platform and register in minutes to access all educational content.`}
                </p>
              </div>
            </div>

            <div
              className={`bg-white dark:bg-[#161b22] p-6 sm:p-8 lg:p-10 xl:p-12 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto ${
                dir === "rtl" ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <Link
                to={`/${slug}`}
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#3b5bdb] dark:text-slate-400 dark:hover:text-sky-400 mb-6 transition-colors w-fit"
              >
                <Arrow className="w-4 h-4" />
                {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Link>

              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#edf2ff] dark:bg-[#3b5bdb]/15 mb-4">
                  <UserPlus className="w-5 h-5 text-[#3b5bdb] dark:text-sky-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {lang === "ar" ? "إنشاء حساب جديد" : "Create Account"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm sm:text-base">
                  {lang === "ar" ? "انضم إلى منصة " : "Join "}
                  {teacherName}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-7">
                {[
                  { n: 1, ar: "أساسي", en: "Basic" },
                  { n: 2, ar: "دراسي", en: "Study" },
                  { n: 3, ar: "الصورة", en: "Photo" },
                ].map(({ n, ar, en }, idx) => (
                  <div key={n} className="flex items-center gap-2">
                    {idx > 0 && <div className="w-6 sm:w-8 h-px bg-slate-200 dark:bg-slate-700" />}
                    <div className={`flex items-center gap-1.5 ${stepLabel(n)}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${stepDot(n)}`}>
                        {n}
                      </div>
                      <span className="text-xs sm:text-sm hidden sm:inline font-medium">
                        {lang === "ar" ? ar : en}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (step === 3) handleSubmit(e);
                }}
              >
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-red-500">*</span>
                      </label>
                      <div className={fieldCls}>
                        <span className="px-3.5 text-slate-400"><User className="size-4" /></span>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputInnerCls} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "رقم الهاتف" : "Phone Number"} <span className="text-red-500">*</span>
                      </label>
                      <div className={fieldCls}>
                        <span className="px-3.5 text-slate-400"><Phone className="size-4" /></span>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputInnerCls} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "المنطقة" : "Region"} <span className="text-red-500">*</span>
                      </label>
                      <div className={fieldCls}>
                        <span className="px-3.5 text-slate-400"><MapPin className="size-4" /></span>
                        <input type="text" name="region" value={formData.region} onChange={handleChange} className={inputInnerCls} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "كلمة المرور" : "Password"} <span className="text-red-500">*</span>
                      </label>
                      <div className={fieldCls}>
                        <span className="px-3.5 text-slate-400"><Lock className="size-4" /></span>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={inputInnerCls}
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3.5 text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>{lang === "ar" ? "رقم هاتف ولي الأمر" : "Parent Phone"}</label>
                      <div className={fieldCls}>
                        <span className="px-3.5 text-slate-400"><Users className="size-4" /></span>
                        <input type="tel" name="phone_parent" value={formData.phone_parent} onChange={handleChange} className={inputInnerCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "المحافظة" : "Governorate"} <span className="text-red-500">*</span>
                      </label>
                      <div className={fieldCls}>
                        <span className="px-3.5 text-slate-400"><MapPin className="size-4" /></span>
                        <select name="governorate" value={formData.governorate} onChange={handleChange} className={`${inputInnerCls} appearance-none pr-8`} required>
                          <option value="">{lang === "ar" ? "اختر المحافظة" : "Select governorate"}</option>
                          {governorates.map((gov) => (
                            <option key={gov.value} value={gov.value}>
                              {lang === "ar" ? gov.label : gov.label_en}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className={`absolute ${chevronPos} text-slate-400 pointer-events-none size-4`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "اسم المدرسة" : "School Name"} <span className="text-red-500">*</span>
                      </label>
                      <div className={fieldCls}>
                        <span className="px-3.5 text-slate-400"><School className="size-4" /></span>
                        <input type="text" name="school_name" value={formData.school_name} onChange={handleChange} className={inputInnerCls} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "المرحلة الدراسية" : "Grade"} <span className="text-red-500">*</span>
                      </label>
                      {!hasStages ? (
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            {lang === "ar" ? "لا توجد مراحل متاحة حالياً" : "No stages available"}
                          </p>
                        </div>
                      ) : (
                        <div className={fieldCls}>
                          <span className="px-3.5 text-slate-400"><GraduationCap className="size-4" /></span>
                          <select name="stage_id" value={formData.stage_id} onChange={handleChange} className={`${inputInnerCls} appearance-none pr-8`} required>
                            <option value="">{lang === "ar" ? "اختر المرحلة" : "Select grade"}</option>
                            {stagesList.map((stage: any) => (
                              <option key={stage.id} value={stage.id}>{getStageName(stage)}</option>
                            ))}
                          </select>
                          <ChevronDown className={`absolute ${chevronPos} text-slate-400 pointer-events-none size-4`} />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "نوع الدراسة" : "Type of Study"} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                        {(["general", "azhar"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, type_of_study: type })}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              formData.type_of_study === type ? toggleActive : toggleInactive
                            }`}
                          >
                            {type === "general" ? (lang === "ar" ? "عام" : "General") : lang === "ar" ? "أزهري" : "Azhar"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "نوع الحضور" : "Attendance Type"} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                        {(["online", "center"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                type_of_attendance: type,
                                center_hour_id: type === "online" ? "" : formData.center_hour_id,
                              })
                            }
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              formData.type_of_attendance === type ? toggleActive : toggleInactive
                            }`}
                          >
                            {type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : lang === "ar" ? "سنتر" : "Center"}
                          </button>
                        ))}
                      </div>
                    </div>
                    {isCenter && (
                      <div className="rounded-xl p-4 space-y-3 border border-[#3b5bdb]/20 bg-[#edf2ff]/50 dark:bg-[#3b5bdb]/10">
                        <div className="flex items-center gap-2 text-[#3b5bdb] dark:text-sky-400 font-semibold text-sm">
                          <Calendar className="size-4" />
                          {lang === "ar" ? "اختر الميعاد المناسب" : "Select suitable time"}
                        </div>
                        {!hasHours ? (
                          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                              {lang === "ar" ? "لا توجد مواعيد متاحة حالياً" : "No available times"}
                            </p>
                          </div>
                        ) : (
                          <select
                            name="center_hour_id"
                            value={formData.center_hour_id}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/15"
                            required
                          >
                            <option value="">{lang === "ar" ? "اختر الميعاد" : "Select time"}</option>
                            {hoursList.map((hour: any) => (
                              <option key={hour.id} value={hour.id}>{getHourLabel(hour)}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                    <div>
                      <label className={labelCls}>
                        {lang === "ar" ? "النوع" : "Gender"} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                        {(["male", "female"] as const).map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender })}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              formData.gender === gender ? toggleActive : toggleInactive
                            }`}
                          >
                            {gender === "male" ? (lang === "ar" ? "ذكر" : "Male") : lang === "ar" ? "أنثى" : "Female"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="text-center py-2">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#edf2ff] dark:bg-[#3b5bdb]/15 mb-4">
                        <Image className="size-8 text-[#3b5bdb] dark:text-sky-400" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        {lang === "ar" ? "ارفع صورتك الشخصية لإكمال التسجيل" : "Upload your profile picture to complete registration"}
                      </p>
                      <FileUploader
                        label={lang === "ar" ? "تحميل الصورة الشخصية" : "Upload Profile Picture"}
                        onUploadSuccess={handleProfileUpload}
                        multiple={false}
                        accept="image/*"
                        preview={true}
                        uniqueId="profile-upload"
                        maxFiles={1}
                        defaultImageId={formData.image ? parseInt(formData.image) : null}
                        onRemoveImage={handleRemoveProfile}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-8 pt-5 border-t border-slate-200 dark:border-slate-700">
                  {step > 1 && (
                    <button type="button" onClick={prevStep} className={btnOutline}>
                      {lang === "ar" ? "السابق" : "Previous"}
                    </button>
                  )}
                  {step < 3 ? (
                    <button type="button" onClick={nextStep} className={btnPrimary}>
                      {lang === "ar" ? "التالي" : "Next"}
                    </button>
                  ) : (
                    <button type="submit" disabled={isPending || !hasStages || (isCenter && !hasHours)} className={btnPrimary}>
                      {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : lang === "ar" ? (
                        "إنشاء حساب"
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  )}
                </div>
              </form>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                {lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
                <Link to={`/${slug}/login`} className="text-[#3b5bdb] dark:text-sky-400 font-semibold hover:underline">
                  {lang === "ar" ? "تسجيل الدخول" : "Login"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;