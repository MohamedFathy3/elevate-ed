/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Register.tsx
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link } from "react-router-dom";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentRegister } from "@/hooks/useStudent";
import { useCenterHours } from "@/hooks/useCenterHours";
import { 
  Zap, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight, 
  Phone, Users, Loader2, GraduationCap, Calendar, Clock,
  AlertCircle, Building, Wifi, MapPin, ChevronDown
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

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-2xl">
        <Link to={`/${slug}`} className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary mb-6">
          <Arrow className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary' : 'text-foreground/30'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'gradient-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>1</div>
            <span className="text-sm">{lang === "ar" ? "المعلومات الأساسية" : "Basic Info"}</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-foreground/30'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'gradient-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>2</div>
            <span className="text-sm">{lang === "ar" ? "معلومات إضافية" : "Additional Info"}</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-lg mb-4">
            <Zap className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold">{lang === "ar" ? "إنشاء حساب طالب" : "Create Student Account"}</h1>
          <p className="text-foreground/60 mt-2">
            {lang === "ar" ? `انضم إلى منصة ${teacherName}` : `Join ${teacherName}'s platform`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-card border border-border">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ar" ? "رقم الهاتف" : "Phone Number"} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ar" ? "كلمة المرور" : "Password"} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full bg-background border border-border rounded-xl pl-10 pr-12 py-3 text-sm" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ar" ? "رقم هاتف ولي الأمر" : "Parent Phone Number"}</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                  <input type="tel" name="phone_parent" value={formData.phone_parent} onChange={handleChange} className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ar" ? "المرحلة الدراسية" : "Educational Stage"} <span className="text-red-500">*</span></label>
                {!hasStages ? (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <div className="text-sm text-amber-700 dark:text-amber-400">
                      {lang === "ar" ? "لا توجد مراحل متاحة" : "No stages available"}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 z-10" />
                    <select name="stage_id" value={formData.stage_id} onChange={handleChange} className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm appearance-none" required>
                      <option value="">{lang === "ar" ? "اختر المرحلة" : "Select Stage"}</option>
                      {stagesList.map((stage: any) => (
                        <option key={stage.id} value={stage.id}>{getStageName(stage)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ar" ? "نوع الحضور" : "Attendance Type"} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, type_of_attendance: "online", center_hour_id: "" })} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${formData.type_of_attendance === "online" ? "gradient-primary text-white border-transparent" : "bg-card border-border"}`}>
                    <Wifi className="w-4 h-4" /> {lang === "ar" ? "أونلاين" : "Online"}
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, type_of_attendance: "center" })} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${formData.type_of_attendance === "center" ? "gradient-primary text-white border-transparent" : "bg-card border-border"}`}>
                    <Building className="w-4 h-4" /> {lang === "ar" ? "سنتر" : "Center"}
                  </button>
                </div>
              </div>

              {isCenter && (
                <div className="bg-primary/5 rounded-xl p-4 space-y-4 border border-primary/20">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Calendar className="w-4 h-4" /> 
                    {lang === "ar" ? "اختر الميعاد المناسب للسنتر" : "Select Suitable Center Time"}
                  </div>
                  
                  {!hasHours ? (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        {lang === "ar" 
                          ? "لا توجد مواعيد متاحة للسنتر حالياً، يرجى التواصل مع المشرف"
                          : "No center hours available, please contact administrator"}
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 z-10" />
                      <select name="center_hour_id" value={formData.center_hour_id} onChange={handleChange} className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm appearance-none" required>
                        <option value="">{lang === "ar" ? "اختر الميعاد" : "Select Time"}</option>
                        {hoursList.map((hour: any) => (
                          <option key={hour.id} value={hour.id}>
                            {getHourLabel(hour)}
                            {hour.note && ` (${hour.note})`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
                    </div>
                  )}
                  
                  <div className="text-xs text-foreground/50 flex items-center gap-1 mt-2">
                    <MapPin className="w-3 h-3" />
                    {lang === "ar" 
                      ? "سيتم التواصل معك لتأكيد الموعد النهائي"
                      : "You will be contacted to confirm the final schedule"}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ar" ? "النوع" : "Gender"} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, gender: "male" })} className={`px-4 py-3 rounded-xl border ${formData.gender === "male" ? "gradient-primary text-white" : "bg-card"}`}>{lang === "ar" ? "ذكر" : "Male"}</button>
                  <button type="button" onClick={() => setFormData({ ...formData, gender: "female" })} className={`px-4 py-3 rounded-xl border ${formData.gender === "female" ? "gradient-primary text-white" : "bg-card"}`}>{lang === "ar" ? "أنثى" : "Female"}</button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-border">
            {step === 2 && <button type="button" onClick={prevStep} className="px-6 py-3 rounded-xl bg-card border border-border">{lang === "ar" ? "السابق" : "Previous"}</button>}
            {step === 1 ? (
              <button type="button" onClick={nextStep} className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold">{lang === "ar" ? "التالي" : "Next"} <Arrow className="w-4 h-4 inline ml-2" /></button>
            ) : (
              <button type="submit" disabled={isPending || !hasStages || (isCenter && !hasHours)} className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold disabled:opacity-50">
                {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (lang === "ar" ? "إنشاء حساب" : "Create Account")}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-foreground/60 mt-6">
          {lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
          <Link to={`/${slug}/login`} className="text-primary font-semibold hover:underline">{lang === "ar" ? "تسجيل الدخول" : "Login"}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;