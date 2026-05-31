/* eslint-disable @typescript-eslint/no-explicit-any */
// src/themes/nature/pages/Register.tsx
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link } from "react-router-dom";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentRegister } from "@/hooks/useStudent";
import { useCenterHours } from "@/hooks/useCenterHours";
import { 
  UserPlus, Mail, Lock, User, Phone, GraduationCap, Eye, EyeOff,
  Loader2, ArrowLeft, ArrowRight, Building, Wifi, Calendar, Clock, MapPin, AlertCircle, ChevronDown,
  Users
} from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { teacher, stages, pick, isLoading } = useTeacher();
  const { mutate: register, isPending } = useStudentRegister();
  const { data: centerHours, isLoading: hoursLoading } = useCenterHours(teacher?.id);
  
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
  });

  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  
  const teacherName = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");
  const stagesList = stages || [];
  const hasStages = stagesList.length > 0;
  const isCenter = formData.type_of_attendance === "center";
  const hoursList = centerHours || [];
  const hasHours = hoursList.length > 0;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    register({
      name: formData.name,
      phone: formData.phone,
      password: formData.password,
      phone_parent: formData.phone_parent || undefined,
      type_of_attendance: formData.type_of_attendance as 'online' | 'center',
      gender: formData.gender as 'male' | 'female',
      teacher_id: teacher.id,
      stage_id: parseInt(formData.stage_id),
      center_hour_id: isCenter ? parseInt(formData.center_hour_id) : undefined,
    });
  };

  const nextStep = () => {
    if (step === 1 && !formData.name) {
      toast.error(lang === "ar" ? "الرجاء إدخال الاسم" : "Please enter your name");
      return;
    }
    if (step === 1 && !formData.phone) {
      toast.error(lang === "ar" ? "الرجاء إدخال رقم الهاتف" : "Please enter phone number");
      return;
    }
    if (step === 1 && !formData.password) {
      toast.error(lang === "ar" ? "الرجاء إدخال كلمة المرور" : "Please enter password");
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  if (isLoading || hoursLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ✅ هنا الشكل الجديد (Nature Theme)
  return (
    <div className="min-h-screen py-16 md:py-24 bg-gradient-hero">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back button */}
        <Link to={`/${slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <Arrow className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        {/* Main Card */}
        <div className="bg-card rounded-3xl shadow-soft border p-8 md:p-10 animate-fade-up">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-2xl bg-brand text-brand-foreground grid place-items-center shadow-soft animate-float">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                {lang === "ar" ? "إنشاء حساب جديد" : "Create Account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {lang === "ar" ? "انضم إلى منصة " : "Join "}{teacherName}
              </p>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary' : 'text-foreground/30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-primary text-white' : 'bg-muted'}`}>1</div>
              <span className="text-sm">{lang === "ar" ? "المعلومات الأساسية" : "Basic Info"}</span>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-foreground/30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-primary text-white' : 'bg-muted'}`}>2</div>
              <span className="text-sm">{lang === "ar" ? "معلومات إضافية" : "Additional Info"}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    {lang === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center bg-background border rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition">
                    <span className="px-4 text-muted-foreground"><User className="size-4" /></span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:text-muted-foreground"
                      placeholder={lang === "ar" ? "أدخل اسمك بالكامل" : "Enter your full name"}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    {lang === "ar" ? "رقم الهاتف" : "Phone Number"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center bg-background border rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition">
                    <span className="px-4 text-muted-foreground"><Phone className="size-4" /></span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:text-muted-foreground"
                      placeholder="01x xxxx xxxx"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    {lang === "ar" ? "كلمة المرور" : "Password"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center bg-background border rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition">
                    <span className="px-4 text-muted-foreground"><Lock className="size-4" /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:text-muted-foreground"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-4 text-muted-foreground">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    {lang === "ar" ? "رقم هاتف ولي الأمر" : "Parent Phone"}
                  </label>
                  <div className="relative flex items-center bg-background border rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition">
                    <span className="px-4 text-muted-foreground"><Users className="size-4" /></span>
                    <input
                      type="tel"
                      name="phone_parent"
                      value={formData.phone_parent}
                      onChange={handleChange}
                      className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:text-muted-foreground"
                      placeholder="01x xxxx xxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    {lang === "ar" ? "المرحلة الدراسية" : "Grade"} <span className="text-red-500">*</span>
                  </label>
                  {!hasStages ? (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        {lang === "ar" ? "لا توجد مراحل متاحة حالياً" : "No stages available"}
                      </p>
                    </div>
                  ) : (
                    <div className="relative flex items-center bg-background border rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition">
                      <span className="px-4 text-muted-foreground"><GraduationCap className="size-4" /></span>
                      <select
                        name="stage_id"
                        value={formData.stage_id}
                        onChange={handleChange}
                        className="flex-1 bg-transparent py-3 outline-none text-sm appearance-none pr-4"
                        required
                      >
                        <option value="">{lang === "ar" ? "اختر المرحلة" : "Select grade"}</option>
                        {stagesList.map((stage: any) => (
                          <option key={stage.id} value={stage.id}>{getStageName(stage)}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 text-muted-foreground pointer-events-none" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    {lang === "ar" ? "نوع الحضور" : "Attendance Type"} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type_of_attendance: "online", center_hour_id: "" })}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all ${formData.type_of_attendance === "online" ? "bg-primary text-white border-primary" : "bg-background border-border"}`}
                    >
                      <Wifi className="size-4" />
                      {lang === "ar" ? "أونلاين" : "Online"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type_of_attendance: "center" })}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all ${formData.type_of_attendance === "center" ? "bg-primary text-white border-primary" : "bg-background border-border"}`}
                    >
                      <Building className="size-4" />
                      {lang === "ar" ? "سنتر" : "Center"}
                    </button>
                  </div>
                </div>

                {isCenter && (
                  <div className="bg-primary/5 rounded-2xl p-4 space-y-3 border border-primary/20">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
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
                      <div className="relative flex items-center bg-background border rounded-xl focus-within:ring-2 focus-within:ring-primary/40">
                        <span className="px-3 text-muted-foreground"><Clock className="size-4" /></span>
                        <select
                          name="center_hour_id"
                          value={formData.center_hour_id}
                          onChange={handleChange}
                          className="flex-1 bg-transparent py-2.5 outline-none text-sm appearance-none pr-4"
                          required
                        >
                          <option value="">{lang === "ar" ? "اختر الميعاد" : "Select time"}</option>
                          {hoursList.map((hour: any) => (
                            <option key={hour.id} value={hour.id}>{getHourLabel(hour)}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 text-muted-foreground pointer-events-none" />
                      </div>
                    )}
                    
                    <div className="text-xs text-foreground/50 flex items-center gap-1">
                      <MapPin className="size-3" />
                      {lang === "ar" ? "سيتم التواصل معك لتأكيد الموعد" : "You will be contacted to confirm"}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    {lang === "ar" ? "النوع" : "Gender"} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "male" })}
                      className={`px-4 py-3 rounded-2xl border transition-all ${formData.gender === "male" ? "bg-primary text-white border-primary" : "bg-background border-border"}`}
                    >
                      {lang === "ar" ? "ذكر" : "Male"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "female" })}
                      className={`px-4 py-3 rounded-2xl border transition-all ${formData.gender === "female" ? "bg-primary text-white border-primary" : "bg-background border-border"}`}
                    >
                      {lang === "ar" ? "أنثى" : "Female"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-border">
              {step === 2 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-2xl bg-card border border-border font-semibold text-sm hover:bg-secondary transition"
                >
                  {lang === "ar" ? "السابق" : "Previous"}
                </button>
              )}
              
              {step === 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-extrabold shadow-soft hover:shadow-glow transition"
                >
                  {lang === "ar" ? "التالي" : "Next"}
                  <Arrow className="w-4 h-4 inline mr-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending || !hasStages || (isCenter && !hasHours)}
                  className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-extrabold shadow-soft hover:shadow-glow transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (lang === "ar" ? "إنشاء حساب" : "Create Account")}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <Link to={`/${slug}/login`} className="text-primary font-bold hover:underline">
              {lang === "ar" ? "تسجيل الدخول" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;