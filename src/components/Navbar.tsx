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
    // لو الـ link يبدأ بـ # (hash link)
    if (href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1); // نشيل الـ #
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // لو احنا في الصفحة الرئيسية
        if (pathname === '/') {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          // لو احنا في صفحة تانية، نروح للصفحة الرئيسية وبعدين نلف للـ section
          navigate('/');
          // نضيف timeout عشان الصفحة تتحمل وبعدين نلف
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

  // ✅ الـ links معالجة
  const links = [
    { href: "#stages", label: lang === "ar" ? "المراحل" : "Stages" },
    { href: "/courses", label: lang === "ar" ? "الكورسات" : "Courses" },
    { href: "#books", label: lang === "ar" ? "الكتب" : "Books" },
    { href: "#about", label: lang === "ar" ? "عن المنصة" : "About" },
  ];

  const teacherName = pick(teacher?.name, teacher?.name_ar) || (lang === "ar" ? "المعلم" : "Teacher");
  const logoImage = teacher?.website?.home?.imageUrl || teacher?.website?.home?.image?.fullUrl;
  const studentName = student?.name || (lang === "ar" ? "الطالب" : "Student");

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
      <nav className={`max-w-7xl mx-auto rounded-full pl-3 pr-2 md:pl-5 md:pr-2 py-2 flex items-center justify-between gap-3 transition-all duration-300 glass shadow-card`}>
        {/* Logo */}
        <Link to={`/`} className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center shadow-soft">
            {logoImage ? (
              <img src={logoImage} alt={teacherName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Zap className="w-5 h-5 text-white" fill="white" />
            )}
          </div>
          <span className="font-bold text-sm md:text-base hidden sm:block text-black dark:text-white">{teacherName}</span>
        </Link>

        {/* Links - تخفي للطلاب المسجلين */}
        {!isAuthenticated && (
          <ul className="hidden lg:flex items-center gap-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                {l.href.startsWith('#') ? (
                  // ✅ للـ hash links
                  <a
                    href={l.href}
                    onClick={(e) => handleHashLink(l.href, e)}
                    className="px-4 py-2 rounded-full text-[#000] dark:text-[#fff] hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    {l.label}
                  </a>
                ) : (
                  // ✅ للـ normal links (زي /courses)
                  <Link
                    to={l.href}
                    className="px-4 py-2 rounded-full text-[#000] dark:text-[#fff] hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
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
            className="hidden sm:flex w-10 h-10 rounded-full border items-center justify-center text-xs font-bold hover:border-primary/40 transition-colors"
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleColorMode}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
              ${isNature 
                ? 'bg-white hover:border-amber-400' 
                : 'border hover:border-primary/40'}`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

          {/* إذا كان المستخدم مسجل دخول */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex-shrink-0">
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
                  <div className="avatar-fallback w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-primary to-accent" 
                       style={{ display: student?.imageUrl ? 'none' : 'flex' }}>
                    {student?.name ? student.name.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                <span className="text-sm font-medium hidden md:block text-black dark:text-white">{studentName}</span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-2 w-48 bg-black border border-border rounded-xl shadow-lg overflow-hidden z-50">
                  <Link
                    to={`/dashboard`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors"
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
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-500 transition-colors"
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
                className="inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full gradient-primary text-white text-sm font-semibold shadow-soft hover:shadow-glow transition-all hover:scale-[1.03] active:scale-95"
              >
                <Zap className="w-4 h-4" fill="white" />
                <span className="hidden sm:inline">{lang === "ar" ? "اعمل اكونت" : "Sign up"}</span>
              </Link>
              <Link
                to={`/login`}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#000] dark:text-[#fff]"
              >
                {lang === "ar" ? "خش ذاكر" : "Login"}
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 grid place-items-center rounded-full bg-card border border-border"
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
          className="lg:hidden max-w-7xl mx-auto mt-2 glass rounded-3xl p-4 shadow-card"
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
                    className="block px-4 py-3 rounded-2xl hover:bg-primary/5 text-sm font-medium"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={l.href}
                    className="block px-4 py-3 rounded-2xl hover:bg-primary/5 text-sm font-medium"
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
                  <Link to={`/dashboard`} className="block px-4 py-3 rounded-2xl hover:bg-primary/5 text-sm font-medium">
                    {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-500 text-sm font-medium">
                    {lang === "ar" ? "تسجيل الخروج" : "Logout"}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={`/login`} className="block px-4 py-3 rounded-2xl hover:bg-primary/5 text-sm font-medium">
                    {lang === "ar" ? "تسجيل دخول" : "Login"}
                  </Link>
                </li>
                <li>
                  <Link to={`/register`} className="block px-4 py-3 rounded-2xl gradient-primary text-white">
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
    <div className="max-w-7xl mx-auto rounded-full px-4 py-2 flex items-center justify-between glass">
      <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="w-24 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="w-32 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </div>
  </div>
);