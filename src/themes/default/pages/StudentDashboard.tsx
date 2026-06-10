/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/StudentDashboard.tsx
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useStudentProfile, useStudentLearning, useCurrentStudent } from "@/hooks/useStudent";
import { useWalletBalance, useCreateRechargeCode, useRechargeWallet } from "@/hooks/useWallet";
import { useTheme } from "@/context/ThemeContext";
import { BookOpen, Clock, Award, Calendar, ChevronRight, User, Phone, Mail, GraduationCap, FileQuestion, ClipboardList, CheckCircle, XCircle, TrendingUp, Eye, Wallet, CreditCard, Copy, RefreshCw, Loader2, Zap, Leaf, Sun, Moon, Wifi, Building, Landmark, School, MapPin, Users, Ticket, Gift } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRedeemCode } from "@/hooks/useEnroll"; // ✅ تصحيح الـ import

const StudentDashboard = () => {
  const { lang } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const { student, logout, isAuthenticated } = useCurrentStudent();
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useStudentProfile();
  const { data: learning, isLoading: learningLoading, refetch: refetchLearning } = useStudentLearning();
  const { data: walletData, isLoading: walletLoading, refetch: refetchWallet } = useWalletBalance();
  const { mutate: createRechargeCode, isPending: creatingCode } = useCreateRechargeCode();
  const { mutate: rechargeWallet, isPending: recharging } = useRechargeWallet();
  const { mutate: redeemCode, isPending: redeeming } = useRedeemCode();

  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const [redeemCodeInput, setRedeemCodeInput] = useState("");
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [rechargeCode, setRechargeCode] = useState("");
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // دوال مساعدة لترجمة اسم المحافظة
  const getGovernorateNameAr = (govValue: string) => {
    const governorates: Record<string, string> = {
      cairo: "القاهرة",
      alexandria: "الإسكندرية",
      giza: "الجيزة",
      sharqia: "الشرقية",
      dakahlia: "الدقهلية",
      beheira: "البحيرة",
      qalyubia: "القليوبية",
      menofia: "المنوفية",
      gharbia: "الغربية",
      kafr_el_sheikh: "كفر الشيخ",
      ismailia: "الإسماعيلية",
      port_said: "بورسعيد",
      suez: "السويس",
      damietta: "دمياط",
      luxor: "الأقصر",
      aswan: "أسوان",
      sohag: "سوهاج",
      asyut: "أسيوط",
      minya: "المنيا",
      beni_suef: "بني سويف",
      qena: "قنا",
      red_sea: "البحر الأحمر",
      new_valley: "الوادي الجديد",
      matrouh: "مطروح",
      north_sinai: "شمال سيناء",
      south_sinai: "جنوب سيناء",
    };
    return governorates[govValue] || govValue;
  };

  const getGovernorateNameEn = (govValue: string) => {
    const governorates: Record<string, string> = {
      cairo: "Cairo",
      alexandria: "Alexandria",
      giza: "Giza",
      sharqia: "Sharqia",
      dakahlia: "Dakahlia",
      beheira: "Beheira",
      qalyubia: "Qalyubia",
      menofia: "Menofia",
      gharbia: "Gharbia",
      kafr_el_sheikh: "Kafr El Sheikh",
      ismailia: "Ismailia",
      port_said: "Port Said",
      suez: "Suez",
      damietta: "Damietta",
      luxor: "Luxor",
      aswan: "Aswan",
      sohag: "Sohag",
      asyut: "Asyut",
      minya: "Minya",
      beni_suef: "Beni Suef",
      qena: "Qena",
      red_sea: "Red Sea",
      new_valley: "New Valley",
      matrouh: "Matrouh",
      north_sinai: "North Sinai",
      south_sinai: "South Sinai",
    };
    return governorates[govValue] || govValue;
  };

  const handleRedeemCode = () => {
    if (!redeemCodeInput.trim()) {
      toast.error(lang === "ar" ? "الرجاء إدخال الكود" : "Please enter the code");
      return;
    }
    redeemCode(redeemCodeInput.toUpperCase(), {
      onSuccess: () => {
        setRedeemCodeInput("");
        setShowRedeemModal(false);
      }
    });
  };

  // الألوان حسب الثيم
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";
  const walletGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-amber-500 to-orange-600";
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20 border-amber-800' : 'bg-white border-amber-200') 
    : 'bg-card border-border';
  const statColors = isNature 
    ? [
        "from-amber-500 to-orange-600",
        "from-amber-600 to-orange-700",
        "from-amber-500 to-orange-600",
        "from-amber-600 to-orange-700"
      ]
    : [
        "from-blue-500 to-indigo-600",
        "from-orange-500 to-red-600",
        "from-emerald-500 to-teal-600",
        "from-purple-500 to-pink-600"
      ];

  useEffect(() => {
    setMounted(true);
    const token = Cookies.get('student_token');
    if (token) {
      refetchProfile();
      refetchLearning();
      refetchWallet();
    }
  }, []);

  const learningData = learning?.data || {};
  const profileData = profile?.data || {};
  
  const studentInfo = learningData?.student || profileData?.student || student;
  const semesters = learningData?.semesters || profileData?.semesters || [];
  const courses = learningData?.courses || profileData?.courses || [];
  const lessons = learningData?.lessons || profileData?.lessons || [];
  const examsList = learningData?.student?.exams || profileData?.student?.exams || [];
  const assignmentsList = learningData?.student?.assignments || profileData?.student?.assignments || [];
  
  const walletBalance = profileData?.balance || 0;

  const handleCreateCode = () => {
    createRechargeCode(undefined, {
      onSuccess: (data) => {
        if (data.code) {
          setGeneratedCode(data.code);
          toast.success(lang === "ar" ? "تم إنشاء كود الشحن بنجاح" : "Recharge code created successfully");
        }
      }
    });
  };

  const handleRecharge = () => {
    if (!rechargeCode.trim()) {
      toast.error(lang === "ar" ? "الرجاء إدخال كود الشحن" : "Please enter recharge code");
      return;
    }
    rechargeWallet(rechargeCode, {
      onSuccess: () => {
        setRechargeCode("");
        setShowRechargeModal(false);
        setGeneratedCode(null);
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(lang === "ar" ? "تم نسخ الكود" : "Code copied!");
  };

  if (profileLoading || learningLoading || walletLoading) {
    return <DashboardSkeleton isNature={isNature} />;
  }

  if (!isAuthenticated && !studentInfo) {
    return (
      <div className={`min-h-screen pt-32 pb-20 flex items-center justify-center ${isNature ? 'bg-cream' : 'bg-background'}`}>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 grid place-items-center">
            <User className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">
            {lang === "ar" ? "الرجاء تسجيل الدخول" : "Please login"}
          </h2>
          <Link to={`/${slug}/login`} className={`${isNature ? 'text-amber-600' : 'text-primary'} hover:underline`}>
            {lang === "ar" ? "تسجيل الدخول" : "Login"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-32 pb-20 ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black">
            {lang === "ar" ? `مرحباً، ${studentInfo?.name || "Student"}` : `Welcome, ${studentInfo?.name || "Student"}`}
          </h1>
          <p className="text-foreground/60 mt-2">
            {lang === "ar" ? "استمر في رحلتك التعليمية" : "Continue your learning journey"}
          </p>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            label={lang === "ar" ? "الكورسات" : "Courses"}
            value={courses.length}
            color={statColors[0]}
            isNature={isNature}
          />
          <StatCard
            icon={<FileQuestion className="w-5 h-5" />}
            label={lang === "ar" ? "الامتحانات" : "Exams"}
            value={examsList.length}
            color={statColors[1]}
            isNature={isNature}
          />
          <StatCard
            icon={<ClipboardList className="w-5 h-5" />}
            label={lang === "ar" ? "الواجبات" : "Assignments"}
            value={assignmentsList.length}
            color={statColors[2]}
            isNature={isNature}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label={lang === "ar" ? "إجمالي الدرجات" : "Total Marks"}
            value={[...examsList, ...assignmentsList].reduce((sum, item) => sum + (item.student_mark || 0), 0)}
            color={statColors[3]}
            isNature={isNature}
          />
        </div>

        {/* Wallet Section */}
        <div className={`bg-gradient-to-r ${walletGradient} rounded-2xl p-6 mb-8 text-white shadow-xl`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">{lang === "ar" ? "رصيد المحفظة" : "Wallet Balance"}</p>
                <p className="text-3xl font-black">{walletBalance} EGP</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRechargeModal(true)}
                className="px-5 py-2.5 rounded-xl bg-white text-orange-600 font-semibold flex items-center gap-2 hover:scale-105 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                {lang === "ar" ? "شحن المحفظة" : "Recharge"}
              </button>
            </div>
          </div>
          
          {/* Generated Code Display */}
          {generatedCode && (
            <div className="mt-4 p-3 bg-white/20 rounded-xl flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {isNature ? <Leaf className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                <span className="font-mono text-lg tracking-wider">{generatedCode}</span>
              </div>
              <button
                onClick={() => copyToClipboard(generatedCode)}
                className="px-3 py-1.5 rounded-lg bg-white/30 hover:bg-white/40 transition-all text-sm flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {lang === "ar" ? "نسخ" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {/* Recharge Modal */}
        {showRechargeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${cardBg} rounded-2xl p-6 max-w-md w-full mx-4 border`}
            >
              <h3 className="text-xl font-bold mb-4">{lang === "ar" ? "شحن المحفظة" : "Recharge Wallet"}</h3>
              <p className="text-foreground/60 text-sm mb-4">
                {lang === "ar" 
                  ? "أدخل كود الشحن لشحن رصيد محفظتك"
                  : "Enter the recharge code to add balance to your wallet"}
              </p>
              <input
                type="text"
                value={rechargeCode}
                onChange={(e) => setRechargeCode(e.target.value.toUpperCase())}
                placeholder={lang === "ar" ? "أدخل كود الشحن" : "Enter recharge code"}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 mb-4 font-mono tracking-wider"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRechargeModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-secondary text-foreground font-semibold"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleRecharge}
                  disabled={recharging}
                  className={`flex-1 px-4 py-2 rounded-xl bg-gradient-to-r ${primaryGradient} text-white font-semibold disabled:opacity-50`}
                >
                  {recharging ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (lang === "ar" ? "شحن" : "Recharge")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Redeem Code Section - كود الخصم */}
        <div className={`${cardBg} rounded-2xl border p-6 mb-8`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isNature ? 'bg-amber-100' : 'bg-primary/10'}`}>
                <Gift className={`w-6 h-6 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
              </div>
              <div>
                <p className="text-foreground/60 text-sm">{lang === "ar" ? "كود الخصم" : "Redeem Code"}</p>
                <p className="font-semibold text-sm">
                  {lang === "ar" 
                    ? "أدخل كود المدرس لتفعيل المحتوي " 
                    : "Enter teacher's code to activate   get  content"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRedeemModal(true)}
              className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105
                ${isNature 
                  ? 'bg-amber-600 text-white hover:bg-amber-700' 
                  : 'gradient-primary text-white shadow-soft hover:shadow-glow'}`}
            >
              <Ticket className="w-4 h-4" />
              {lang === "ar" ? "استخدم كود" : "Use Code"}
            </button>
          </div>
        </div>

        {/* Redeem Code Modal */}
        {showRedeemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${cardBg} rounded-2xl p-6 max-w-md w-full mx-4 border`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{lang === "ar" ? "استخدام كود الخصم" : "Redeem Code"}</h3>
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-foreground/60 text-sm mb-4">
                {lang === "ar" 
                  ? "أدخل الكود الذي حصلت عليه من المدرس لتفعيل الخصم أو الحصول على محتوى مجاني"
                  : "Enter the code you received from the teacher to activate discount or get free content"}
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  {lang === "ar" ? "الكود" : "Code"}
                </label>
                <input
                  type="text"
                  value={redeemCodeInput}
                  onChange={(e) => setRedeemCodeInput(e.target.value.toUpperCase())}
                  placeholder="مثال: LOT4LBNW"
                  className={`w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all font-mono tracking-wider uppercase
                    ${isNature ? 'focus:ring-2 focus:ring-amber-500/20' : ''}`}
                  autoFocus
                />
                <p className="text-xs text-foreground/40 mt-2">
                  {lang === "ar" 
                    ? "الكود مكون من 8 أحرف أو أرقام" 
                    : "Code consists of 8 letters or numbers"}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-all"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleRedeemCode}
                  disabled={redeeming || !redeemCodeInput.trim()}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${isNature 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'gradient-primary'}`}
                >
                  {redeeming ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    lang === "ar" ? "تفعيل" : "Redeem"
                  )}
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border text-center">
                <p className="text-xs text-foreground/40">
                  {lang === "ar"
                    ? "الكود مقدم من المدرس ويمكن استخدامه مرة واحدة فقط"
                    : "The code is provided by the teacher and can be used only once"}
                </p>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* باقي الأقسام... */}
        {/* Exams Section */}
        {examsList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileQuestion className={`w-5 h-5 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
              {lang === "ar" ? "الامتحانات التي قمت بها" : "Completed Exams"}
            </h2>
            <div className="space-y-3">
              {examsList.map((examItem: any, idx: number) => (
                <ExamResultCard
                  key={examItem.exam?.id || idx}
                  examItem={examItem}
                  lang={lang}
                  slug={slug!}
                  isNature={isNature}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Assignments Section */}
        {assignmentsList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ClipboardList className={`w-5 h-5 ${isNature ? 'text-amber-600' : 'text-accent'}`} />
              {lang === "ar" ? "الواجبات التي قمت بها" : "Completed Assignments"}
            </h2>
            <div className="space-y-3">
              {assignmentsList.map((assignmentItem: any, idx: number) => (
                <AssignmentResultCard
                  key={assignmentItem.exam?.id || idx}
                  assignmentItem={assignmentItem}
                  lang={lang}
                  slug={slug!}
                  isNature={isNature}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* My Semesters Section */}
        {semesters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className={`w-5 h-5 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
              {lang === "ar" ? "الترمات المشترك فيها" : "Enrolled Semesters"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {semesters.map((semester: any) => (
                <SemesterCard key={semester.id} semester={semester} slug={slug} lang={lang} isNature={isNature} />
              ))}
            </div>
          </div>
        )}
        
        {/* My Courses Section */}
        {courses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className={`w-5 h-5 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
              {lang === "ar" ? "كورساتي" : "My Courses"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course: any) => (
                <CourseCard key={course.id} course={course} slug={slug} lang={lang} isNature={isNature} />
              ))}
            </div>
          </div>
        )}
        
        {/* My Lessons Section */}
        {lessons.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className={`w-5 h-5 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
              {lang === "ar" ? "الدروس المتاحة" : "Available Lessons"}
            </h2>
            <div className="space-y-3">
              {lessons.slice(0, 10).map((lesson: any) => (
                <LessonCard key={lesson.id} lesson={lesson} slug={slug} lang={lang} isNature={isNature} />
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {courses.length === 0 && lessons.length === 0 && semesters.length === 0 && examsList.length === 0 && assignmentsList.length === 0 && (
          <div className="text-center py-12">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${isNature ? 'bg-amber-100' : 'bg-gray-100 dark:bg-gray-800'} grid place-items-center`}>
              <BookOpen className={`w-12 h-12 ${isNature ? 'text-amber-400' : 'text-foreground/30'}`} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {lang === "ar" ? "لم تشترك في أي كورسات بعد" : "No courses enrolled yet"}
            </h3>
            <p className="text-foreground/60 mb-4">
              {lang === "ar" ? "قم بشراء كورسات للبدء في رحلة التعلم" : "Purchase courses to start your learning journey"}
            </p>
            <Link
              to={`/${slug}/courses`}
              className={`inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-xl bg-gradient-to-r ${primaryGradient} text-white font-semibold`}
            >
              {lang === "ar" ? "استعرض الكورسات" : "Browse Courses"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
        
        {/* Logout Button */}
        <div className="text-center pt-8 border-t border-border">
          <button
            onClick={logout}
            className="px-6 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            {lang === "ar" ? "تسجيل الخروج" : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 🟢 Stat Card Component (معدل للثيمات)
const StatCard = ({ icon, label, value, color, isNature }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-4 text-white shadow-lg`}
  >
    <div className="flex items-center justify-between">
      {icon}
      <span className="text-2xl font-black">{value}</span>
    </div>
    <p className="text-sm opacity-90 mt-2">{label}</p>
  </motion.div>
);

// 🟢 Semester Card Component (معدل للثيمات)
const SemesterCard = ({ semester, slug, lang, isNature }: any) => (
  <Link to={`/${slug}/semester/${semester.id}`}>
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-xl border p-4 transition-all cursor-pointer
        ${isNature 
          ? 'bg-white border-amber-200 hover:border-amber-400' 
          : 'bg-card border-border hover:border-primary/40'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-bold ${isNature ? 'text-amber-800' : ''}`}>
            {lang === "ar" && semester.name_ar ? semester.name_ar : semester.name}
          </h3>
          <p className="text-xs text-foreground/50 mt-1">
            {semester.courses?.length || 0} {lang === "ar" ? "كورسات" : "courses"}
          </p>
        </div>
        <ChevronRight className={`w-5 h-5 ${isNature ? 'text-amber-400' : 'text-foreground/30'}`} />
      </div>
    </motion.div>
  </Link>
);

// 🟢 Course Card Component (معدل للثيمات)
const CourseCard = ({ course, slug, lang, isNature }: any) => (
  <Link to={`/${slug}/courses/${course.id}`}>
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-xl border p-4 transition-all cursor-pointer
        ${isNature 
          ? 'bg-white border-amber-200 hover:border-amber-400' 
          : 'bg-card border-border hover:border-primary/40'}`}
    >
      <img
        src={course.image?.fullUrl || course.imageUrl || "/default-course.jpg"}
        alt={course.title}
        className="w-full h-32 object-cover rounded-lg mb-3"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/default-course.jpg";
        }}
      />
      <h3 className={`font-bold line-clamp-1 ${isNature ? 'text-amber-800' : ''}`}>
        {lang === "ar" && course.title_ar ? course.title_ar : course.title}
      </h3>
      <p className="text-xs text-foreground/50 mt-1">
        {course.details?.length || 0} {lang === "ar" ? "دروس" : "lessons"}
      </p>
    </motion.div>
  </Link>
);

// 🟢 Lesson Card Component (معدل للثيمات)
const LessonCard = ({ lesson, slug, lang, isNature }: any) => (
  <motion.div
    whileHover={{ x: 5 }}
    className={`rounded-xl border p-4 transition-all
      ${isNature 
        ? 'bg-white border-amber-200 hover:border-amber-400' 
        : 'bg-card border-border hover:border-primary/40'}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className={`font-semibold ${isNature ? 'text-amber-800' : ''}`}>
          {lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title}
        </h3>
        <p className="text-xs text-foreground/50">
          {lesson.course?.title}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-foreground/40">
          <span>{new Date(lesson.lession_date).toLocaleDateString()}</span>
          <span>{lesson.lession_time}</span>
        </div>
      </div>
      <Link
        to={`/${slug}/lesson/${lesson.id}`}
        className={`px-4 py-2 rounded-lg text-white text-sm ml-3
          ${isNature 
            ? 'bg-amber-600 hover:bg-amber-700' 
            : 'gradient-primary'}`}
      >
        {lang === "ar" ? "مشاهدة" : "Watch"}
      </Link>
    </div>
  </motion.div>
);

// 🟢 Exam Result Card Component (معدل للثيمات)
const ExamResultCard = ({ examItem, lang, slug, isNature }: any) => {
  const [expanded, setExpanded] = useState(false);
  const exam = examItem.exam;
  const studentMark = examItem.student_mark || 0;
  const totalMarks = exam?.total_marks || 0;
  const percentage = totalMarks > 0 ? (studentMark / totalMarks) * 100 : 0;
  const passed = percentage >= 50;
  const questions = examItem.questions || [];
  const correctCount = questions.filter((q: any) => q.is_correct === true).length;
  
  const gradientClass = isNature 
    ? "from-amber-500 to-orange-600" 
    : "gradient-primary";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`rounded-xl border p-4 transition-all
        ${isNature 
          ? 'bg-white border-amber-200 hover:border-amber-400' 
          : 'bg-card border-border hover:border-primary/40'}`}
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <FileQuestion className={`w-4 h-4 ${passed ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <h3 className={`font-bold ${isNature ? 'text-amber-800' : ''}`}>{exam?.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${passed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {passed ? (lang === "ar" ? "ناجح" : "Passed") : (lang === "ar" ? "راسب" : "Failed")}
            </span>
            <span className="text-xs text-foreground/50">{exam?.type === 'exam' ? (lang === "ar" ? "امتحان" : "Exam") : (lang === "ar" ? "واجب" : "Assignment")}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "درجتك" : "Your Score"}</p>
              <p className="text-lg font-bold">{studentMark}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "الدرجة الكلية" : "Total Marks"}</p>
              <p className="text-lg font-bold">{totalMarks}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "النسبة" : "Percentage"}</p>
              <p className="text-lg font-bold">{percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "الإجابات الصحيحة" : "Correct Answers"}</p>
              <p className="text-lg font-bold">{correctCount}/{questions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-semibold"
          >
            {expanded ? (lang === "ar" ? "إخفاء" : "Hide") : (lang === "ar" ? "تفاصيل" : "Details")}
          </button>
          <Link
            to={`/${slug}/exam/${exam?.id}`}
            className={`px-4 py-2 rounded-lg bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold flex items-center gap-1`}
          >
            <Eye className="w-4 h-4" />
            {lang === "ar" ? "عرض النتيجة" : "View Result"}
          </Link>
        </div>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-border"
        >
          <h4 className="font-semibold mb-3 text-sm">
            {lang === "ar" ? "تفاصيل الأسئلة" : "Question Details"}
          </h4>
          <div className="space-y-3">
            {questions.map((q: any, idx: number) => (
              <QuestionDetailCard key={q.id} question={q} index={idx} lang={lang} isNature={isNature} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// 🟢 Assignment Result Card Component (معدل للثيمات)
const AssignmentResultCard = ({ assignmentItem, lang, slug, isNature }: any) => {
  const [expanded, setExpanded] = useState(false);
  const assignment = assignmentItem.exam;
  const studentMark = assignmentItem.student_mark || 0;
  const totalMarks = assignment?.total_marks || 0;
  const percentage = totalMarks > 0 ? (studentMark / totalMarks) * 100 : 0;
  const questions = assignmentItem.questions || [];
  
  const gradientClass = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-accent to-pink-500";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`rounded-xl border p-4 transition-all
        ${isNature 
          ? 'bg-white border-amber-200 hover:border-amber-400' 
          : 'bg-card border-accent/30 hover:border-accent'}`}
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isNature ? 'bg-amber-100' : 'bg-accent/20'}`}>
              <ClipboardList className={`w-4 h-4 ${isNature ? 'text-amber-600' : 'text-accent'}`} />
            </div>
            <h3 className={`font-bold ${isNature ? 'text-amber-800' : ''}`}>{assignment?.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isNature ? 'bg-amber-100 text-amber-700' : 'bg-accent/20 text-accent'}`}>
              {lang === "ar" ? "واجب" : "Assignment"}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm mt-3">
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "درجتك" : "Your Score"}</p>
              <p className="text-lg font-bold">{studentMark}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "الدرجة الكلية" : "Total Marks"}</p>
              <p className="text-lg font-bold">{totalMarks}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "النسبة" : "Percentage"}</p>
              <p className="text-lg font-bold">{percentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-semibold"
          >
            {expanded ? (lang === "ar" ? "إخفاء" : "Hide") : (lang === "ar" ? "تفاصيل" : "Details")}
          </button>
          <Link
            to={`/${slug}/exam/${assignment?.id}`}
            className={`px-4 py-2 rounded-lg bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold flex items-center gap-1`}
          >
            <Eye className="w-4 h-4" />
            {lang === "ar" ? "عرض التفاصيل" : "View Details"}
          </Link>
        </div>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-border"
        >
          <h4 className="font-semibold mb-3 text-sm">
            {lang === "ar" ? "تفاصيل الأسئلة" : "Question Details"}
          </h4>
          <div className="space-y-3">
            {questions.map((q: any, idx: number) => (
              <QuestionDetailCard key={q.id} question={q} index={idx} lang={lang} isNature={isNature} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// 🟢 Question Detail Component (معدل للثيمات)
const QuestionDetailCard = ({ question, index, lang, isNature }: any) => {
  const isCorrect = question.is_correct === true;
  const isEssay = question.correct_answer === null;
  
  return (
    <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : isEssay ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : isEssay ? <Clock className="w-4 h-4 text-yellow-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{index + 1}. {question.question}</p>
          <div className="mt-1 text-xs space-y-1">
            <p><span className="text-foreground/50">{lang === "ar" ? "إجابتك:" : "Your answer:"}</span> {question.student_answer || "-"}</p>
            {question.correct_answer && (
              <p><span className="text-foreground/50">{lang === "ar" ? "الإجابة الصحيحة:" : "Correct answer:"}</span> <span className="text-green-600">{question.correct_answer}</span></p>
            )}
            <p><span className="text-foreground/50">{lang === "ar" ? "الدرجة:" : "Mark:"}</span> {question.mark_obtained || 0}/{question.mark}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🟢 Dashboard Skeleton (معدل للثيمات)
const DashboardSkeleton = ({ isNature }: { isNature: boolean }) => (
  <div className={`min-h-screen pt-32 pb-20 ${isNature ? 'bg-cream' : 'bg-background'}`}>
    <div className="container-tight">
      <div className={`h-10 w-48 rounded-lg mb-8 animate-pulse ${isNature ? 'bg-amber-200' : 'bg-gray-200 dark:bg-gray-700'}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-24 rounded-xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
        ))}
      </div>
      <div className={`h-32 rounded-2xl mb-8 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
      <div className={`h-40 rounded-2xl mb-8 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1,2].map(i => (
          <div key={i} className={`h-32 rounded-xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
        ))}
      </div>
    </div>
  </div>
);

export default StudentDashboard;