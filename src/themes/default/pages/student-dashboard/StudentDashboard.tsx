// src/pages/student-dashboard/StudentDashboard.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useStudentProfile, useStudentLearning, useCurrentStudent } from "@/hooks/useStudent";
import { useCreateRechargeCode, useRechargeWallet } from "@/hooks/useWallet";
import { useTheme } from "@/context/ThemeContext";
import { User, BookOpen, Clock, Award, Wallet, FileQuestion, ClipboardList, BookMarked, Menu } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "@/hooks/use-toast";
import { useRedeemCode } from "@/hooks/useEnroll";

// ✅ Components
import { Sidebar } from './components/Sidebar';
import { ProfileTab } from './components/ProfileTab';
import { WalletTab } from './components/WalletTab';
import { CoursesTab } from './components/CoursesTab';
import { LessonsTab } from './components/LessonsTab';
import { SemestersTab } from './components/SemestersTab';
import { BooksTab } from './components/BooksTab';
import { ExamsTab } from './components/ExamsTab';
import { AssignmentsTab } from './components/AssignmentsTab';
import { RechargeModal } from './components/RechargeModal';
import { RedeemModal } from './components/RedeemModal';
import { DashboardSkeleton } from './components/DashboardSkeleton';

// ✅ Types
import { TabType, TabItem } from './StudentDashboard.types';

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
  const [redeemCodeInput, setRedeemCodeInput] = useState("");
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [rechargeCode, setRechargeCode] = useState("");
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const isRtl = lang === 'ar';

  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";
  const bgColor = 'bg-white dark:bg-gray-950';
  const cardBg = 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800';

  // Tabs
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

  // Data
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
        refetchProfile();
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
        refetchProfile();
      }
    });
  };

  useEffect(() => {
    const token = Cookies.get('student_token');
    if (token) {
      refetchProfile();
      refetchLearning();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (profileLoading || learningLoading) {
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
          <Link to={`/login`} className={`text-${isNature ? 'amber' : 'primary'} hover:underline`}>
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
          
          {/* Sidebar */}
          <Sidebar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            studentInfo={studentInfo}
            logout={logout}
            lang={lang}
            isNature={isNature}
            isDark={isDark}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="lg:hidden flex items-center justify-between mb-4 px-4">
    <button
      onClick={() => setSidebarOpen(true)}
      className={`p-2 rounded-lg ${
        isNature 
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
          : 'bg-primary/10 text-primary'
      }`}
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6" />
    </button>
    
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
      {tabs.find(t => t.id === activeTab)?.label}
    </h2>
    
    <div className="w-10" /> {/* spacer */}
  </div>
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

// ✅ إضافة Link
import { Link } from "react-router-dom";

export default StudentDashboard;