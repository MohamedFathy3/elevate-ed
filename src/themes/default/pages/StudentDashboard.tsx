/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/StudentDashboard.tsx - Version with Sidebar & Tabs (White Background)
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useStudentProfile, useStudentLearning, useCurrentStudent } from "@/hooks/useStudent";
import {  useCreateRechargeCode, useRechargeWallet } from "@/hooks/useWallet";
import { useTheme } from "@/context/ThemeContext";
import { 
  BookOpen, Clock, Award, Calendar, ChevronRight, User, Phone, Mail, 
  GraduationCap, FileQuestion, ClipboardList, CheckCircle, XCircle, 
  TrendingUp, Eye, Wallet, CreditCard, Copy, RefreshCw, Loader2, Zap, 
  Leaf, Sun, Moon, Wifi, Building, Landmark, School, MapPin, Users, 
  Ticket, Gift, LayoutDashboard, LogOut, Menu, X, Home, 
  Layers, Library, CalendarDays, BarChart3, Settings, HelpCircle,
  Percent, DollarSign, CreditCard as CardIcon, History, Star, Target,
  ArrowRight, ArrowLeft, Check, AlertCircle, Info, ChevronDown, BookMarked,
  Hash,
  PhoneCall,
  BarcodeIcon,
  VenetianMask
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { toast  } from "@/hooks/use-toast";
import { useRedeemCode } from "@/hooks/useEnroll";
import Barcode from "react-barcode";
import { useTeacher } from "@/context/TeacherContext";

// ==================== Types ====================
type TabType = 'profile' | 'wallet' | 'courses' | 'lessons' | 'semesters' | 'books' | 'exams' | 'assignments';

interface TabItem {
  id: TabType;
  label: string;
  labelAr: string;
  icon: React.ReactNode;
}

// ==================== Main Component ====================
const StudentDashboard = () => {
  const { lang } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const { student, logout, isAuthenticated } = useCurrentStudent();
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useStudentProfile();
  const { data: learning, isLoading: learningLoading, refetch: refetchLearning } = useStudentLearning();
  const { mutate: createRechargeCode, isPending: creatingCode } = useCreateRechargeCode();
  const { mutate: rechargeWallet, isPending: recharging } = useRechargeWallet();
  const { mutate: redeemCode, isPending: redeeming } = useRedeemCode();

  // State
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [redeemCodeInput, setRedeemCodeInput] = useState("");
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [rechargeCode, setRechargeCode] = useState("");
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const isRtl = lang === 'ar';

  // Colors based on theme
  const primaryColor = isNature ? 'amber' : 'primary';
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";
  
  const bgColor = 'bg-white dark:bg-gray-950';
  
  // ✅ Sidebar bg زي ما هي من غير تغيير
  const sidebarBg = 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl';
  
  const cardBg = 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800';
  
  // ✅ ألوان الـ Sidebar - تتحسن للـ White Mode
  const getSidebarTextColor = () => {
    if (isDark) {
      return 'text-white';
    }
    return 'text-gray-800'; // ✅ أغمق شوية عشان يبان في الوايت مود
  };
  
  const getSidebarMutedColor = () => {
    if (isDark) {
      return 'text-gray-300';
    }
    return 'text-gray-500'; // ✅ رمادي واضح
  };
  
  const getSidebarHoverBg = () => {
    if (isDark) {
      return 'hover:bg-white/10';
    }
    return 'hover:bg-gray-100';
  };
  
  const getActiveTabBg = () => {
    if (isDark) {
      return 'bg-white/20 text-white font-semibold backdrop-blur-sm';
    }
    // ✅ وايت مود - خلفية رمادية فاتحة ونص غامق
    return isNature 
      ? 'bg-amber-100 text-amber-700' 
      : 'bg-primary/10 text-primary';
  };
  
  const activeTabBg = getActiveTabBg();

  // Tabs configuration
  const tabs: TabItem[] = [
    { id: 'profile', label: 'Profile', labelAr: 'الملف الشخصي', icon: <User className="w-5 h-5" /> },
    { id: 'wallet', label: 'Wallet', labelAr: 'المحفظة', icon: <Wallet className="w-5 h-5" /> },
    { id: 'courses', label: 'Courses', labelAr: 'الكورسات', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'lessons', label: 'Lessons', labelAr: 'الدروس', icon: <Clock className="w-5 h-5" /> },
    { id: 'semesters', label: 'Semesters', labelAr: 'الترم', icon: <Award className="w-5 h-5" /> },
    { id: 'books', label: 'Books', labelAr: 'الكتب', icon: <BookMarked className="w-5 h-5" /> },
    { id: 'exams', label: 'Exams', labelAr: 'الامتحانات', icon: <FileQuestion className="w-5 h-5" /> },
    { id: 'assignments', label: 'Assignments', labelAr: 'الواجبات', icon: <ClipboardList className="w-5 h-5" /> },
  ];

  // Data from APIs
  const learningData = learning?.data || {};
  const profileData = profile?.data || {};
  const studentInfo = learningData?.student || profileData?.student || student;
  const semesters = learningData?.semesters || profileData?.semesters || [];
  const courses = learningData?.courses || profileData?.courses || [];
  const lessons = learningData?.lessons || profileData?.lessons || [];
  const booksList = learningData?.books || profileData?.books || [];
  const examsList = learningData?.student?.exams || profileData?.student?.exams || [];
  const assignmentsList = learningData?.student?.assignments || profileData?.student?.assignments || [];
  const walletBalance = profileData?.balance || 0;

  // Handlers
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

  useEffect(() => {
    setMounted(true);
    const token = Cookies.get('student_token');
    if (token) {
      refetchProfile();
      refetchLearning();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (profileLoading || learningLoading ) {
    return <DashboardSkeleton isNature={isNature} isRtl={isRtl} />;
  }

  if (!isAuthenticated && !studentInfo) {
    return (
      <div className={`min-h-screen pt-32 pb-20 flex items-center justify-center ${bgColor}`}>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 grid place-items-center">
            <User className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {lang === "ar" ? "الرجاء تسجيل الدخول" : "Please login"}
          </h2>
          <Link to={`/login`} className={`text-${primaryColor} hover:underline`}>
            {lang === "ar" ? "تسجيل الدخول" : "Login"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-8 ${isRtl ? 'rtl' : 'ltr'} ${bgColor}`}>
      <div className="container-tight">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* ==================== Sidebar ==================== */}
          <>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <aside className={`
              fixed lg:sticky top-24 lg:top-28 left-0 h-[calc(100vh-6rem)] w-72 lg:w-80
              ${sidebarBg} border-r border-gray-200 dark:border-gray-800
              transform transition-transform duration-300 ease-in-out z-40
              overflow-y-auto custom-scrollbar
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              ${isRtl ? 'lg:right-0 lg:left-auto lg:border-l lg:border-r-0' : ''}
            ` }>
              <div className="p-5">
                {/* Profile Section */}
                <div className="text-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${primaryGradient} p-0.5 mb-3`}>
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-950 flex items-center justify-center overflow-hidden">
                      {studentInfo?.image?.fullUrl || studentInfo?.imageUrl ? (
                        !imageError ? (
                          <img
                            src={studentInfo.image?.fullUrl || studentInfo.imageUrl}
                            alt={studentInfo.name}
                            className="w-full h-full rounded-full object-cover"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <span className={`text-2xl font-bold ${getSidebarTextColor()}`}>
                            {studentInfo?.name?.charAt(0)?.toUpperCase() || "S"}
                          </span>
                        )
                      ) : (
                        <span className={`text-2xl font-bold ${getSidebarTextColor()}`}>
                          {studentInfo?.name?.charAt(0)?.toUpperCase() || "S"}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className={`font-bold text-lg truncate ${getSidebarTextColor()}`}>
                    {studentInfo?.name}
                  </h3>
                  <p className={`text-xs ${getSidebarMutedColor()} mt-1`}>
                    {studentInfo?.email || studentInfo?.phone}
                  </p>
                </div>

                {/* Navigation */}
                <nav className="space-y-1.5">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${activeTab === tab.id 
                          ? activeTabBg
                          : `${getSidebarHoverBg()} ${getSidebarTextColor()}`
                        }
                        ${isRtl ? 'flex-row-reverse' : ''}
                      `}
                    >
                      <span className={activeTab === tab.id && isDark ? 'text-white' : ''}>
                        {tab.icon}
                      </span>
                      <span className={activeTab === tab.id && isDark ? 'font-semibold' : ''}>
                        {lang === 'ar' ? tab.labelAr : tab.label}
                      </span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className={`w-1.5 h-1.5 rounded-full bg-${isNature ? 'amber' : 'primary'}-500 ml-auto ${isRtl ? 'mr-auto ml-0' : ''}`}
                        />
                      )}
                    </button>
                  ))}
                </nav>

                {/* Logout Button */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={logout}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isDark 
                        ? 'text-red-400 hover:bg-white/10' 
                        : 'text-red-600 hover:bg-red-50'
                      }
                    `}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{lang === "ar" ? "تسجيل الخروج" : "Logout"}</span>
                  </button>
                </div>
              </div>
            </aside>
          </>

          {/* ==================== Main Content ==================== */}
          <main className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {activeTab === 'profile' && (
                  <ProfileTab 
                    studentInfo={studentInfo} 
                    lang={lang} 
                    isNature={isNature}
                    isDark={isDark}
                    profileData={profileData}
                    cardBg={cardBg}
                  />
                )}

                {activeTab === 'wallet' && (
                  <WalletTab
                    walletBalance={walletBalance}
                    generatedCode={generatedCode}
                    showRechargeModal={showRechargeModal}
                    setShowRechargeModal={setShowRechargeModal}
                    showRedeemModal={showRedeemModal}
                    setShowRedeemModal={setShowRedeemModal}
                    rechargeCode={rechargeCode}
                    setRechargeCode={setRechargeCode}
                    redeemCodeInput={redeemCodeInput}
                    setRedeemCodeInput={setRedeemCodeInput}
                    handleRecharge={handleRecharge}
                    handleRedeemCode={handleRedeemCode}
                    handleCreateCode={handleCreateCode}
                    copyToClipboard={copyToClipboard}
                    recharging={recharging}
                    redeeming={redeeming}
                    creatingCode={creatingCode}
                    lang={lang}
                    isNature={isNature}
                    isDark={isDark}
                    primaryGradient={primaryGradient}
                    cardBg={cardBg}
                  />
                )}

                {activeTab === 'courses' && (
                  <CoursesTab
                    courses={courses}
                    slug={slug!}
                    lang={lang}
                    isNature={isNature}
                    isDark={isDark}
                    cardBg={cardBg}
                  />
                )}

                {activeTab === 'lessons' && (
                  <LessonsTab
                    lessons={lessons}
                    slug={slug!}
                    lang={lang}
                    isNature={isNature}
                    isDark={isDark}
                    cardBg={cardBg}
                  />
                )}

                {activeTab === 'semesters' && (
                  <SemestersTab
                    semesters={semesters}
                    slug={slug!}
                    lang={lang}
                    isNature={isNature}
                    isDark={isDark}
                    cardBg={cardBg}
                  />
                )}

                {activeTab === 'books' && (
                  <BooksTab
                    books={booksList}
                    slug={slug!}
                    lang={lang}
                    isNature={isNature}
                    isDark={isDark}
                    cardBg={cardBg}
                  />
                )}

                {activeTab === 'exams' && (
                  <ExamsTab
                    examsList={examsList}
                    slug={slug!}
                    lang={lang}
                    isNature={isNature}
                    isDark={isDark}
                    cardBg={cardBg}
                  />
                )}

                {activeTab === 'assignments' && (
                  <AssignmentsTab
                    assignmentsList={assignmentsList}
                    slug={slug!}
                    lang={lang}
                    isNature={isNature}
                    isDark={isDark}
                    cardBg={cardBg}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Modals */}
      {showRechargeModal && (
        <RechargeModal
          rechargeCode={rechargeCode}
          setRechargeCode={setRechargeCode}
          handleRecharge={handleRecharge}
          onClose={() => setShowRechargeModal(false)}
          recharging={recharging}
          lang={lang}
          isNature={isNature}
          isDark={isDark}
        />
      )}

      {showRedeemModal && (
        <RedeemModal
          redeemCodeInput={redeemCodeInput}
          setRedeemCodeInput={setRedeemCodeInput}
          handleRedeemCode={handleRedeemCode}
          onClose={() => setShowRedeemModal(false)}
          redeeming={redeeming}
          lang={lang}
          isNature={isNature}
          isDark={isDark}
        />
      )}
    </div>
  );
};


const ProfileTab = ({ studentInfo, lang, isNature, isDark, profileData, cardBg }: any) => {
  const isRtl = lang === 'ar';
  const [imageError, setImageError] = useState(false);
  
  // ✅ ألوان النصوص - من الـ props عشان الدارك مود
  const getTextColor = () => {
    return isDark ? 'text-white' : 'text-gray-900';
  };
  
  const getMutedColor = () => {
    return isDark ? 'text-gray-300' : 'text-gray-500';
  };
  
  // ✅ خلفية ولون الأيقونة
  const getIconBg = () => {
    if (isDark) {
      return `bg-${isNature ? 'amber' : 'primary'}/20`;
    }
    return `bg-${isNature ? 'amber' : 'primary'}/10`;
  };
  
  const getIconColor = () => {
    if (isDark) {
      return `text-${isNature ? 'white' : 'black'}-400`;
    }
    return `text-${isNature ? 'white' : 'black'}-600`;
  };

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
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${getIconBg()}`}>
          <User className="text-[#000] dark:text-[#fff]"/>
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "الملف الشخصي" : "My Profile"}
        </h2>
      </div>

      {/* Profile Image Section */}
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

      {/* Info Cards Grid */}
{/* Info Cards Grid - مُعاد تصميمه بالكامل ✅ */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
  {infoCards.map((card, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: idx * 0.04,
        duration: 0.4,
        ease: "easeOut"
      }}
      className={`
        group relative p-5 rounded-2xl 
        transition-all duration-300 
        hover:scale-[1.02] hover:shadow-xl
        ${cardBg}
        ${card.highlight ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/5' : 'hover:shadow-md'}
        ${isDark ? 'hover:bg-gray-800/90' : 'hover:bg-gray-50/80'}
      `}
    >
      {/* Glow Effect للبطاقات المميزة */}
      {card.highlight && (
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      )}

      <div className="relative flex items-start gap-4">
        {/* أيقونة البطاقة */}
        <div className={`
          p-2.5 rounded-xl 
          flex-shrink-0
          transition-all duration-300
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

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          {/* الـ Label */}
          <p className={`
            text-xs font-medium uppercase tracking-wider
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `}>
            {card.label}
          </p>

          {/* ✅ الباركود - تصميم محسّن */}
          {card.isBarcode && card.value ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 shadow-xl backdrop-blur-sm">
              {/* رأس الباركود */}
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

              {/* الباركود */}
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

                {/* الرقم والنص السفلي */}
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
            /* القيمة العادية - تصميم محسّن */
            <div className="mt-1">
              <p className={`
                font-semibold text-base break-all
                transition-colors duration-200
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
              
              {/* خط تزييني تحت القيمة المميزة */}
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

// ==================== Wallet Tab - المُعدل ✅ ====================
const WalletTab = ({
  walletBalance, generatedCode, showRechargeModal, setShowRechargeModal,
  showRedeemModal, setShowRedeemModal, rechargeCode, setRechargeCode,
  redeemCodeInput, setRedeemCodeInput, handleRecharge, handleRedeemCode,
  handleCreateCode, copyToClipboard, recharging, redeeming, creatingCode,
  lang, isNature, isDark, primaryGradient, cardBg
}: any) => {
  const isRtl = lang === 'ar';
  
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <Wallet className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "المحفظة" : "My Wallet"}
        </h2>
      </div>

      {/* Balance Card */}
      <div className={`bg-gradient-to-r ${primaryGradient} rounded-2xl p-6 text-white shadow-xl`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">{lang === "ar" ? "الرصيد الحالي" : "Current Balance"}</p>
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
        
        {generatedCode && (
          <div className="mt-4 p-3 bg-white/20 rounded-xl flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
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

      {/* Redeem Code Section */}
      <div className={`rounded-2xl p-6 ${cardBg}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isNature ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-primary/10'}`}>
              <Gift className={`w-6 h-6 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
            </div>
            <div>
              <p className={`text-sm ${getMutedColor()}`}>{lang === "ar" ? "كود الخصم" : "Redeem Code"}</p>
              <p className={`font-semibold text-sm ${getTextColor()}`}>
                {lang === "ar" ? "أدخل كود المدرس لتفعيل المحتوى" : "Enter teacher's code to activate content"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowRedeemModal(true)}
            className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105
              ${isNature 
                ? 'bg-amber-600 text-white hover:bg-amber-700' 
                : 'bg-gradient-to-r from-primary to-accent text-white shadow-soft hover:shadow-glow'}`}
          >
            <Ticket className="w-4 h-4" />
            {lang === "ar" ? "استخدم كود" : "Use Code"}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className={`rounded-xl p-6 ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <History className={`w-5 h-5 text-${isNature ? 'amber' : 'primary'}`} />
          <h3 className={`font-semibold ${getTextColor()}`}>
            {lang === "ar" ? "آخر المعاملات" : "Recent Transactions"}
          </h3>
        </div>
        <p className={`text-center ${getMutedColor()} py-8`}>
          {lang === "ar" ? "لا توجد معاملات حالياً" : "No transactions yet"}
        </p>
      </div>
    </div>
  );
};

// ==================== Courses Tab - المُعدل ✅ ====================
const CoursesTab = ({ courses, slug, lang, isNature, isDark, cardBg }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد كورسات" : "No Courses"}
        message={lang === "ar" ? "لم تشترك في أي كورسات بعد" : "You haven't enrolled in any courses yet"}
        actionLink={`/courses`}
        actionText={lang === "ar" ? "تصفح الكورسات" : "Browse Courses"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <BookOpen className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "كورساتي" : "My Courses"}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course: any, idx: number) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link to={`/courses/${course.id}`}>
              <div className={`rounded-xl p-4 transition-all hover:-translate-y-1 cursor-pointer ${cardBg}`}>
                <img
                  src={course.image?.fullUrl || course.imageUrl || "/default-course.jpg"}
                  alt={course.title}
                  className="w-full h-36 object-cover rounded-lg mb-3"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/default-course.jpg"; }}
                />
                <h3 className={`font-bold line-clamp-1 ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>
                  {lang === "ar" && course.title_ar ? course.title_ar : course.title}
                </h3>
                <p className={`text-xs ${getMutedColor()} mt-1 flex items-center gap-2`}>
                  <Clock className="w-3 h-3" />
                  {course.details?.length || 0} {lang === "ar" ? "دروس" : "lessons"}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==================== Lessons Tab - المُعدل ✅ ====================
const LessonsTab = ({ lessons, slug, lang, isNature, isDark, cardBg }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  if (lessons.length === 0) {
    return (
      <EmptyState
        icon={<Clock className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد دروس" : "No Lessons"}
        message={lang === "ar" ? "لم يتم إضافة أي دروس بعد" : "No lessons have been added yet"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <Clock className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "الدروس المتاحة" : "Available Lessons"}
        </h2>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson: any, idx: number) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ x: 5 }}
            className={`rounded-xl p-4 transition-all ${cardBg}`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex-1">
                <h3 className={`font-semibold ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>
                  {lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title}
                </h3>
                <p className={`text-xs ${getMutedColor()}`}>
                  {lesson.course?.title || (lang === "ar" ? "بدون كورس" : "No course")}
                </p>
                <div className={`flex items-center gap-3 mt-2 text-xs ${getMutedColor()}`}>
                  <span>{lesson.lession_date ? new Date(lesson.lession_date).toLocaleDateString() : '-'}</span>
                  <span>{lesson.lession_time || '-'}</span>
                </div>
              </div>
              <Link
                to={`/lesson/${lesson.id}`}
                className={`px-4 py-2 rounded-lg text-white text-sm whitespace-nowrap
                  ${isNature 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'bg-gradient-to-r from-primary to-accent'}`}
              >
                {lang === "ar" ? "مشاهدة" : "Watch"}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==================== Semesters Tab - المُعدل ✅ ====================
const SemestersTab = ({ semesters, slug, lang, isNature, isDark, cardBg }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  if (semesters.length === 0) {
    return (
      <EmptyState
        icon={<Award className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد ترمات" : "No Semesters"}
        message={lang === "ar" ? "لم تشترك في أي ترمات بعد" : "You haven't enrolled in any semesters yet"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <Award className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "الترمات المشترك فيها" : "Enrolled Semesters"}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {semesters.map((semester: any, idx: number) => (
          <motion.div
            key={semester.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link to={`/semester/${semester.id}`}>
              <div className={`rounded-xl p-4 transition-all hover:-translate-y-1 cursor-pointer ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>
                      {lang === "ar" && semester.name_ar ? semester.name_ar : semester.name}
                    </h3>
                    <p className={`text-xs ${getMutedColor()} mt-1`}>
                      {semester.courses?.length || 0} {lang === "ar" ? "كورسات" : "courses"}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${isNature ? 'text-amber-400' : 'text-gray-400'}`} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==================== Books Tab - المُعدل ✅ ====================
const BooksTab = ({ books, slug, lang, isNature, isDark, cardBg }: any) => {
  const { teacher } = useTeacher(); // ✅ جلب بيانات المدرس
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  // ✅ إنشاء رابط واتساب
  const getWhatsAppLink = (book: any) => {
    const phone = teacher?.phone || teacher?.whatsapp || ''; // رقم المدرس
    const message = encodeURIComponent(
      lang === 'ar' 
        ? `السلام عليكم، أريد شراء كتاب "${book.title}"` 
        : `Hello, I want to buy the book "${book.title}"`
    );
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`;
  };
  
  if (books.length === 0) {
    return (
      <EmptyState
        icon={<BookMarked className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد كتب" : "No Books"}
        message={lang === "ar" ? "لم تقم بشراء أي كتب بعد" : "You haven't purchased any books yet"}
        actionLink={`#books`}
        actionText={lang === "ar" ? "تصفح الكتب" : "Browse Books"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <BookMarked className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "كتبي" : "My Books"}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book: any, idx: number) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-xl p-4 transition-all hover:-translate-y-1 ${cardBg}`}
          >
            <img
              src={book.image?.fullUrl || book.imageUrl || "/default-book.jpg"}
              alt={book.title}
              className="w-full h-44 object-cover rounded-lg mb-3"
              onError={(e) => { (e.target as HTMLImageElement).src = "/default-book.jpg"; }}
            />
            <h3 className={`font-bold line-clamp-1 ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>
              {lang === "ar" && book.title_ar ? book.title_ar : book.title}
            </h3>
            <p className={`text-xs ${getMutedColor()} mt-1 flex items-center gap-2`}>
              <Users className="w-3 h-3" />
              {book.writer || (lang === "ar" ? "مؤلف" : "Author")}
            </p>
            <div className="mt-3 flex items-center justify-between">
              {/* <div>
                <p className={`text-lg font-bold ${isNature ? 'text-amber-600' : 'text-primary'}`}>
                  {book.price} EGP
                </p>
              </div> */}
              <a
                href={getWhatsAppLink(book)}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded-lg text-white text-xs whitespace-nowrap
                  ${isNature 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-[#25D366] hover:bg-[#1da851]'}`}
              >
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {lang === "ar" ? "  احصل عليه من المدرس" : "giv book from teacher"}
                </span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==================== Exams Tab - المُعدل ✅ ====================
const ExamsTab = ({ examsList, slug, lang, isNature, isDark, cardBg }: any) => {
  if (examsList.length === 0) {
    return (
      <EmptyState
        icon={<FileQuestion className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد امتحانات" : "No Exams"}
        message={lang === "ar" ? "لم تقم بأي امتحانات بعد" : "You haven't taken any exams yet"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <FileQuestion className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {lang === "ar" ? "الامتحانات التي قمت بها" : "Completed Exams"}
        </h2>
      </div>

      <div className="space-y-3">
        {examsList.map((examItem: any, idx: number) => (
          <ExamResultCard
            key={examItem.exam?.id || idx}
            examItem={examItem}
            lang={lang}
            slug={slug!}
            isNature={isNature}
            isDark={isDark}
            cardBg={cardBg}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== Assignments Tab - المُعدل ✅ ====================
const AssignmentsTab = ({ assignmentsList, slug, lang, isNature, isDark, cardBg }: any) => {
  if (assignmentsList.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد واجبات" : "No Assignments"}
        message={lang === "ar" ? "لم تقم بأي واجبات بعد" : "You haven't completed any assignments yet"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <ClipboardList className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {lang === "ar" ? "الواجبات التي قمت بها" : "Completed Assignments"}
        </h2>
      </div>

      <div className="space-y-3">
        {assignmentsList.map((assignmentItem: any, idx: number) => (
          <AssignmentResultCard
            key={assignmentItem.exam?.id || idx}
            assignmentItem={assignmentItem}
            lang={lang}
            slug={slug!}
            isNature={isNature}
            isDark={isDark}
            cardBg={cardBg}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== Shared Components المُعدلة ====================

// Exam Result Card - المُعدل ✅
const ExamResultCard = ({ examItem, lang, slug, isNature, isDark, cardBg }: any) => {
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
    : "from-primary to-accent";
  
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`rounded-xl p-4 transition-all cursor-pointer ${cardBg}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <FileQuestion className={`w-4 h-4 ${passed ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <h3 className={`font-bold ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>{exam?.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${passed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {passed ? (lang === "ar" ? "ناجح" : "Passed") : (lang === "ar" ? "راسب" : "Failed")}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "درجتك" : "Your Score"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{studentMark}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "الدرجة الكلية" : "Total Marks"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{totalMarks}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "النسبة" : "Percentage"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "الإجابات الصحيحة" : "Correct Answers"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{correctCount}/{questions.length}</p>
            </div>
          </div>
        </div>
        
        <Link
          to={`/exam/${exam?.id}`}
          className={`px-4 py-2 rounded-lg bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold flex items-center gap-1 whitespace-nowrap`}
          onClick={(e) => e.stopPropagation()}
        >
          <Eye className="w-4 h-4" />
          {lang === "ar" ? "عرض النتيجة" : "View Result"}
        </Link>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
        >
          <h4 className={`font-semibold mb-3 text-sm ${getTextColor()}`}>
            {lang === "ar" ? "تفاصيل الأسئلة" : "Question Details"}
          </h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((q: any, idx: number) => (
              <QuestionDetailCard key={q.id} question={q} index={idx} lang={lang} isNature={isNature} isDark={isDark} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Assignment Result Card - المُعدل ✅
const AssignmentResultCard = ({ assignmentItem, lang, slug, isNature, isDark, cardBg }: any) => {
  const [expanded, setExpanded] = useState(false);
  const assignment = assignmentItem.exam;
  const studentMark = assignmentItem.student_mark || 0;
  const totalMarks = assignment?.total_marks || 0;
  const percentage = totalMarks > 0 ? (studentMark / totalMarks) * 100 : 0;
  const questions = assignmentItem.questions || [];
  
  const gradientClass = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-accent to-pink-500";
  
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`rounded-xl p-4 transition-all cursor-pointer ${cardBg}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isNature ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-accent/20'}`}>
              <ClipboardList className={`w-4 h-4 ${isNature ? 'text-amber-600' : 'text-accent'}`} />
            </div>
            <h3 className={`font-bold ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>{assignment?.title}</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm mt-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "درجتك" : "Your Score"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{studentMark}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "الدرجة الكلية" : "Total Marks"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{totalMarks}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
              <p className={`text-xs ${getMutedColor()}`}>{lang === "ar" ? "النسبة" : "Percentage"}</p>
              <p className={`text-lg font-bold ${getTextColor()}`}>{percentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <Link
          to={`/exam/${assignment?.id}`}
          className={`px-4 py-2 rounded-lg bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold flex items-center gap-1`}
          onClick={(e) => e.stopPropagation()}
        >
          <Eye className="w-4 h-4" />
          {lang === "ar" ? "عرض التفاصيل" : "View Details"}
        </Link>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
        >
          <h4 className={`font-semibold mb-3 text-sm ${getTextColor()}`}>
            {lang === "ar" ? "تفاصيل الأسئلة" : "Question Details"}
          </h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((q: any, idx: number) => (
              <QuestionDetailCard key={q.id} question={q} index={idx} lang={lang} isNature={isNature} isDark={isDark} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Question Detail Card - المُعدل ✅
const QuestionDetailCard = ({ question, index, lang, isNature, isDark }: any) => {
  const isCorrect = question.is_correct === true;
  const isEssay = question.correct_answer === null;
  const isDarkMode = isDark;
  
  const getTextColor = () => isDarkMode ? 'text-gray-200' : 'text-gray-900';
  
  return (
    <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : isEssay ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : isEssay ? <Clock className="w-4 h-4 text-yellow-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        <div className="flex-1">
          <p className={`font-medium text-sm ${getTextColor()}`}>
            {index + 1}. {question.question}
          </p>
          <div className="mt-1 text-xs space-y-1">
            <p><span className="text-gray-500 dark:text-gray-400">{lang === "ar" ? "إجابتك:" : "Your answer:"}</span> {question.student_answer || "-"}</p>
            {question.correct_answer && (
              <p><span className="text-gray-500 dark:text-gray-400">{lang === "ar" ? "الإجابة الصحيحة:" : "Correct answer:"}</span> <span className="text-green-600">{question.correct_answer}</span></p>
            )}
            <p><span className="text-gray-500 dark:text-gray-400">{lang === "ar" ? "الدرجة:" : "Mark:"}</span> {question.mark_obtained || 0}/{question.mark}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component - المُعدل ✅
const EmptyState = ({ icon, title, message, actionLink, actionText, isNature, isDark }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  return (
    <div className="text-center py-12">
      <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${isNature ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-800'} grid place-items-center`}>
        <div className={`w-12 h-12 ${isNature ? 'text-amber-400' : 'text-gray-400'}`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${getTextColor()}`}>{title}</h3>
      <p className={`${getMutedColor()} mb-4`}>{message}</p>
      {actionLink && actionText && (
        <Link
          to={actionLink}
          className={`inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold`}
        >
          {actionText}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

// Recharge Modal - المُعدل ✅
const RechargeModal = ({ rechargeCode, setRechargeCode, handleRecharge, onClose, recharging, lang, isNature, isDark }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950`}
      >
        <h3 className={`text-xl font-bold mb-4 ${getTextColor()}`}>
          {lang === "ar" ? "شحن المحفظة" : "Recharge Wallet"}
        </h3>
        <p className={`text-gray-500 dark:text-gray-400 text-sm mb-4`}>
          {lang === "ar" ? "أدخل كود الشحن لشحن رصيد محفظتك" : "Enter the recharge code to add balance to your wallet"}
        </p>
        <input
          type="text"
          value={rechargeCode}
          onChange={(e) => setRechargeCode(e.target.value.toUpperCase())}
          placeholder={lang === "ar" ? "أدخل كود الشحن" : "Enter recharge code"}
          className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 mb-4 font-mono tracking-wider ${getTextColor()}`}
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleRecharge}
            disabled={recharging}
            className={`flex-1 px-4 py-2 rounded-xl bg-gradient-to-r ${isNature ? 'from-amber-500 to-orange-600' : 'from-primary to-accent'} text-white font-semibold disabled:opacity-50`}
          >
            {recharging ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (lang === "ar" ? "شحن" : "Recharge")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Redeem Modal - المُعدل ✅
const RedeemModal = ({ redeemCodeInput, setRedeemCodeInput, handleRedeemCode, onClose, redeeming, lang, isNature, isDark }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${getTextColor()}`}>
            {lang === "ar" ? "استخدام كود الخصم" : "Redeem Code"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
        
        <p className={`text-gray-500 dark:text-gray-400 text-sm mb-4`}>
          {lang === "ar" 
            ? "أدخل الكود الذي حصلت عليه من المدرس لتفعيل الخصم أو الحصول على محتوى مجاني"
            : "Enter the code you received from the teacher to activate discount or get free content"}
        </p>
        
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${getTextColor()}`}>
            {lang === "ar" ? "الكود" : "Code"}
          </label>
          <input
            type="text"
            value={redeemCodeInput}
            onChange={(e) => setRedeemCodeInput(e.target.value.toUpperCase())}
            placeholder="مثال: LOT4LBNW"
            className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none font-mono tracking-wider uppercase ${getTextColor()}`}
            autoFocus
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleRedeemCode}
            disabled={redeeming || !redeemCodeInput.trim()}
            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${isNature 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-gradient-to-r from-primary to-accent'}`}
          >
            {redeeming ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              lang === "ar" ? "تفعيل" : "Redeem"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Dashboard Skeleton - المُعدل ✅
const DashboardSkeleton = ({ isNature, isRtl }: { isNature: boolean; isRtl: boolean }) => (
  <div className={`min-h-screen pt-24 pb-20 bg-white dark:bg-gray-950 ${isRtl ? 'rtl' : 'ltr'}`}>
    <div className="container-tight">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-80">
          <div className={`h-[calc(100vh-6rem)] rounded-xl animate-pulse bg-gray-100 dark:bg-gray-900`} />
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-6">
          <div className={`h-12 w-48 rounded-lg animate-pulse bg-gray-100 dark:bg-gray-800`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-24 rounded-xl animate-pulse bg-gray-100 dark:bg-gray-800`} />
            ))}
          </div>
          <div className={`h-40 rounded-xl animate-pulse bg-gray-100 dark:bg-gray-800`} />
          <div className={`h-32 rounded-xl animate-pulse bg-gray-100 dark:bg-gray-800`} />
        </div>
      </div>
    </div>
  </div>
);

export default StudentDashboard;