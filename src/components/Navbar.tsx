// components/site/Navbar.tsx

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSafeTeacher } from "@/context/TeacherContext";
import { useCurrentStudent } from "@/hooks/useStudent";
import { Zap, ArrowRight, ArrowLeft, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
  const { lang, setLang, dir } = useLang();
  const { theme, colorMode, toggleTheme, toggleColorMode } = useTheme();
  const { teacher, slug, pick, isLoading } = useSafeTeacher();
  const { isAuthenticated, student, logout } = useCurrentStudent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isNature = theme === 'nature';
  const isDefault = theme === 'default';
  const isDark = colorMode === 'dark';
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // ✅ دالة للتعامل مع الـ hash links
  const handleHashLink = (href: string, e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        if (pathname === '/') {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    }
  };

  const links = [
    { href: "#stages", label: lang === "ar" ? "المراحل" : "Stages" },
    { href: "/courses", label: lang === "ar" ? "الكورسات" : "Courses" },
    { href: "#books", label: lang === "ar" ? "الكتب" : "Books" },
    { href: "#about", label: lang === "ar" ? "عن المنصة" : "About" },
  ];

  const teacherName = pick(teacher?.name, teacher?.name_ar) || (lang === "ar" ? "المعلم" : "Teacher");
  
  // ✅ تحسين جلب الصورة - جرب أكثر من مصدر
  const logoImage = teacher?.image?.fullUrl || teacher?.imageUrl || teacher?.logoUrl || teacher?.website?.home?.image?.fullUrl || teacher?.website?.home?.imageUrl || null;
  
  const studentName = student?.name || (lang === "ar" ? "الطالب" : "Student");

  // ✅ ألوان حسب الثيم
  const getPrimaryGradient = () => {
    if (isNature) {
      return 'from-amber-500 to-orange-500';
    }
    return 'from-blue-500 to-blue-600';
  };

  const getPrimaryColor = () => {
    if (isNature) {
      return 'bg-amber-500 hover:bg-amber-600';
    }
    return 'bg-blue-500 hover:bg-blue-600';
  };

  if (isLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-3 md:top-5 inset-x-0 z-50 px-3 md:px-6"
    >
      <nav className={`max-w-7xl mx-auto rounded-full pl-3 pr-2 md:pl-5 md:pr-2 py-2 flex items-center justify-between gap-3 transition-all duration-300 
        ${isDark 
          ? 'bg-gray-900/90 backdrop-blur-xl border border-gray-800' 
          : 'bg-white/90 backdrop-blur-xl border border-gray-200'} 
        shadow-lg`}>
        
        {/* Logo */}
        <Link to={`/`} className="flex items-center gap-2 shrink-0">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getPrimaryGradient()} grid place-items-center shadow-md overflow-hidden flex-shrink-0`}>
            {logoImage ? (
              <img 
                src={logoImage} 
                alt={teacherName} 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  // لو الصورة مش موجودة، نعرض الـ fallback
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.logo-fallback');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }
                }}
              />
            ) : null}
            {/* ✅ Fallback أيقونة لو مفيش صورة */}
            <div className="logo-fallback w-full h-full rounded-xl flex items-center justify-center" 
                 style={{ display: logoImage ? 'none' : 'flex' }}>
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
          </div>
          <span className="font-bold text-sm md:text-base hidden sm:block text-black dark:text-white">{teacherName}</span>
        </Link>

        {/* Links - تخفي للطلاب المسجلين */}
        {!isAuthenticated && (
          <ul className="hidden lg:flex items-center gap-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                {l.href.startsWith('#') ? (
                  <a
                    href={l.href}
                    onClick={(e) => handleHashLink(l.href, e)}
                    className="px-4 py-2 rounded-full text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={l.href}
                    className="px-4 py-2 rounded-full text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="hidden sm:flex w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 items-center justify-center text-xs font-bold hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-black dark:text-white"
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleColorMode}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-blue-500" />
            )}
          </button>

          {/* إذا كان المستخدم مسجل دخول */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0">
                  {student?.imageUrl ? (
                    <img 
                      src={student.imageUrl} 
                      alt={student?.name || 'Student'} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const avatar = parent.querySelector('.avatar-fallback');
                          if (avatar) {
                            (avatar as HTMLElement).style.display = 'flex';
                          }
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* Avatar بديل */}
                  <div className="avatar-fallback w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-blue-500 to-blue-600" 
                       style={{ display: student?.imageUrl ? 'none' : 'flex' }}>
                    {student?.name ? student.name.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                <span className="text-sm font-medium hidden md:block text-black dark:text-white">{studentName}</span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
                  <Link
                    to={`/dashboard`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-black dark:text-white"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm">{lang === "ar" ? "لوحة التحكم" : "Dashboard"}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">{lang === "ar" ? "تسجيل الخروج" : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to={`/register`}
                className={`inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full bg-gradient-to-r ${getPrimaryGradient()} text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.03] active:scale-95`}
              >
                <Zap className="w-4 h-4" fill="white" />
                <span className="hidden sm:inline">{lang === "ar" ? "اعمل اكونت" : "Sign up"}</span>
              </Link>
              <Link
                to={`/login`}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                {lang === "ar" ? "خش ذاكر" : "Login"}
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 grid place-items-center rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-black dark:text-white"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:hidden max-w-7xl mx-auto mt-2 rounded-3xl p-4 shadow-lg 
            ${isDark 
              ? 'bg-gray-900/95 backdrop-blur-xl border border-gray-800' 
              : 'bg-white/95 backdrop-blur-xl border border-gray-200'}`}
        >
          <ul className="flex flex-col gap-1">
            {!isAuthenticated && links.map((l) => (
              <li key={l.href}>
                {l.href.startsWith('#') ? (
                  <a
                    href={l.href}
                    onClick={(e) => {
                      handleHashLink(l.href, e);
                      setOpen(false);
                    }}
                    className="block px-4 py-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/30 text-sm font-medium text-black dark:text-white"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={l.href}
                    className="block px-4 py-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/30 text-sm font-medium text-black dark:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li>
                  <Link to={`/dashboard`} className="block px-4 py-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/30 text-sm font-medium text-black dark:text-white">
                    {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 text-sm font-medium">
                    {lang === "ar" ? "تسجيل الخروج" : "Logout"}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={`/login`} className="block px-4 py-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/30 text-sm font-medium text-black dark:text-white">
                    {lang === "ar" ? "تسجيل دخول" : "Login"}
                  </Link>
                </li>
                <li>
                  <Link to={`/register`} className={`block px-4 py-3 rounded-2xl bg-gradient-to-r ${getPrimaryGradient()} text-white text-center`}>
                    {lang === "ar" ? "إنشاء حساب" : "Sign up"}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
};

const NavbarSkeleton = () => (
  <div className="fixed top-3 md:top-5 inset-x-0 z-50 px-3 md:px-6">
    <div className="max-w-7xl mx-auto rounded-full px-4 py-2 flex items-center justify-between bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="w-24 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  </div>
);