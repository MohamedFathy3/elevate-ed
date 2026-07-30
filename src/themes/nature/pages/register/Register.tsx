// src/pages/register/Register.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, lazy, Suspense } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link } from "react-router-dom";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useStudentRegister } from "@/hooks/useStudent";
import { useCenterHours } from "@/hooks/useCenterHours";
import { Loader2, ArrowLeft, ArrowRight, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ✅ Components
import { StepIndicator } from './components/StepIndicator';
import { Step1BasicInfo } from './components/Step1BasicInfo';
import { Step2StudyInfo } from './components/Step2StudyInfo';
import { Step3Photo } from './components/Step3Photo';
import { InstructionsModal } from './components/InstructionsModal';

// ✅ Hooks
import { useRegisterForm } from '@/themes/nature/pages/register/components/hooks/useRegisterForm';
// ✅ Types & Utils
import { Step } from './Register.types';

// ✅ Skeleton للـ Header (خفيف جداً)
const HeaderSkeleton = () => (
  <div className="flex items-center gap-3 mb-6">
    <div className="size-12 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="min-w-0 flex-1">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-1 animate-pulse" />
    </div>
  </div>
);

const Register = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  
  const { 
    teacher, 
    stages, 
    pick, 
    isLoading: teacherLoading,
    centerHours: teacherCenterHours,
  } = useSafeTeacherData();
  
  const { 
    data: apiCenterHours, 
    isLoading: hoursLoading 
  } = useCenterHours(teacher?.id);
  
  const { mutate: register, isPending } = useStudentRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const teacherName = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");
  const stagesList = stages || [];
  const hasStages = stagesList.length > 0;

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateStep,
    setFieldValue,
  } = useRegisterForm(lang);

  const isCenter = formData.type_of_attendance === "center";
  const hoursList = apiCenterHours || teacherCenterHours || [];
  const hasHours = hoursList.length > 0;

  // ✅ 1. تأخير المودال لـ 4 ثواني
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  // ✅ 2. إشارة أن البيانات جاهزة
  useEffect(() => {
    if (!teacherLoading && !hoursLoading) {
      setIsDataReady(true);
    }
  }, [teacherLoading, hoursLoading]);

  const steps: Step[] = [
    { number: 1, label: "المعلومات الأساسية", labelEn: "Basic Info" },
    { number: 2, label: "البيانات الدراسية", labelEn: "Study Info" },
    { number: 3, label: "الصورة", labelEn: "Photo" },
  ];

  const getStageName = (stage: any) => {
    if (lang === "ar" && stage.name_ar) return stage.name_ar;
    return stage.name;
  };

  const getHourLabel = (hour: any) => {
    const start = hour.hours_start || '';
    const end = hour.hours_end || '';
    const date = hour.date || '';
    const title = hour.title || '';
    return `${title} - ${date} من ${start} إلى ${end}`;
  };

  const handleProfileUpload = (imageId: number) => {
    setFieldValue("image", imageId.toString());
    toast.success(lang === "ar" ? "تم رفع الصورة بنجاح" : "Image uploaded successfully");
  };

  const handleRemoveProfile = () => {
    setFieldValue("image", "");
  };

  const nextStep = () => {
    if (step === 1) {
      if (validateStep(1)) setStep(2);
      else toast.error(lang === "ar" ? "الرجاء تصحيح الأخطاء" : "Please fix errors");
    } else if (step === 2) {
      if (validateStep(2)) setStep(3);
      else toast.error(lang === "ar" ? "الرجاء تصحيح الأخطاء" : "Please fix errors");
    }
  };

  const prevStep = () => setStep(step - 1);

  const goToStep = (targetStep: number) => {
    if (targetStep < step) { setStep(targetStep); return; }
    
    if (targetStep > step) {
      if (step === 1 && validateStep(1)) {
        if (targetStep === 3) {
          setStep(2);
          setTimeout(() => { if (validateStep(2)) setStep(3); }, 100);
        } else setStep(targetStep);
      } else if (step === 2 && targetStep === 3 && validateStep(2)) {
        setStep(3);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error(lang === "ar" ? "الرجاء رفع صورة شخصية" : "Please upload profile picture");
      return;
    }

    if (!teacher?.id) {
      toast.error(lang === "ar" ? "لم يتم العثور على المعلم" : "Teacher not found");
      return;
    }

    if (!validateStep(1) || !validateStep(2)) {
      toast.error(lang === "ar" ? "الرجاء تصحيح الأخطاء" : "Please fix errors");
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

  // ✅ عرض Skeleton أثناء تحميل البيانات
  if (teacherLoading || hoursLoading) {
    return (
      <div className="min-h-screen py-12 md:py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <HeaderSkeleton />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-white dark:bg-gray-950 relative">
      {/* ✅ خلفية بسيطة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-emerald-400/5 dark:bg-emerald-400/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-400/5 dark:bg-blue-400/5 blur-3xl" />
      </div>

      {/* ✅ المودال يظهر متأخر جداً */}
      <Suspense fallback={null}>
        {showInstructions && (
          <InstructionsModal
            isOpen={showInstructions}
            onClose={() => setShowInstructions(false)}
            lang={lang}
          />
        )}
      </Suspense>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        {/* Back to Home */}
        <Link
          to={``}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
        >
          <Arrow className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          {/* ✅ Header - LCP element */}
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white grid place-items-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
              <UserPlus className="size-5" />
            </div>
            <div className="min-w-0">
              {/* ✅ h1 - LCP element */}
              <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white truncate">
                {lang === "ar" ? "إنشاء حساب جديد" : "Create Account"}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                {lang === "ar" ? "انضم إلى منصة " : "Join "}{teacherName}
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <StepIndicator
            steps={steps}
            currentStep={step}
            onStepClick={goToStep}
            lang={lang}
          />

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <Step1BasicInfo
                formData={formData}
                errors={errors}
                touched={touched}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onChange={handleChange}
                onBlur={handleBlur}
                lang={lang}
              />
            )}

            {/* Step 2 */}
            {step === 2 && (
              <Step2StudyInfo
                formData={formData}
                errors={errors}
                touched={touched}
                stages={stagesList}
                hoursList={hoursList}
                isCenter={isCenter}
                hasStages={hasStages}
                hasHours={hasHours}
                hoursLoading={hoursLoading}
                lang={lang}
                onChange={handleChange}
                onBlur={handleBlur}
                onSetField={setFieldValue}
                getStageName={getStageName}
                getHourLabel={getHourLabel}
              />
            )}

            {/* Step 3 */}
            {step === 3 && (
              <Step3Photo
                image={formData.image}
                lang={lang}
                onUpload={handleProfileUpload}
                onRemove={handleRemoveProfile}
              />
            )}

            {/* Buttons */}
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
    </div>
  );
};

export default Register;