// components/site/Navbar.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext"; // ✅改了
import { useSafeTeacher } from "@/context/TeacherContext";
import { useCurrentStudent } from "@/hooks/useStudent";
import { Zap, ArrowRight, ArrowLeft, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, Leaf } from "lucide-react";

export const Navbar = () => {
  const { lang, setLang, dir } = useLang();
  const { theme, toggleTheme } = useTheme(); // ✅改了
  const { teacher, slug, pick, isLoading } = useSafeTeacher();
  const { isAuthenticated, student, logout } = useCurrentStudent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const { pathname } = useLocation();

  const isNature = theme === 'nature';
  const isDefault = theme === 'default';

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

  const onHome = pathname === `/${slug}` || pathname === `/${slug}/`;
  const sectionLink = (hash: string) => (onHome ? `#${hash}` : `/${slug}#${hash}`);

  const links = [
    { href: sectionLink("stages"), label: lang === "ar" ? "المراحل" : "Stages" },
    { href: `/${slug}/courses`, label: lang === "ar" ? "الكورسات" : "Courses" },
    { href: sectionLink("books"), label: lang === "ar" ? "الكتب" : "Books" },
    { href: sectionLink("about"), label: lang === "ar" ? "عن المنصة" : "About" },
  ];

  const teacherName = pick(teacher?.name, teacher?.name_ar) || (lang === "ar" ? "المعلم" : "Teacher");
  const logoImage = teacher?.website?.home?.imageUrl || teacher?.website?.home?.image?.fullUrl;
  const studentName = student?.name || (lang === "ar" ? "الطالب" : "Student");

  if (isLoading) {
    return <NavbarSkeleton isNature={isNature} />;
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-3 md:top-5 inset-x-0 z-50 px-3 md:px-6"
    >
      <nav className={`max-w-7xl mx-auto rounded-full pl-3 pr-2 md:pl-5 md:pr-2 py-2 flex items-center justify-between gap-3 transition-all duration-300 shadow-card
        ${isNature 
          ? 'bg-white/90 backdrop-blur-md border border-amber-200' 
          : 'glass'}`}
      >
        {/* Logo */}
        <Link to={`/${slug}`} className="flex items-center gap-2 shrink-0">
          <div className={`w-10 h-10 rounded-xl grid place-items-center shadow-soft
            ${isNature 
              ? 'bg-gradient-to-br from-amber-600 to-orange-600' 
              : 'gradient-primary'}`}>
            {logoImage ? (
              <img src={logoImage} alt={teacherName} className="w-full h-full object-cover rounded-xl" />
            ) : isNature ? (
              <Leaf className="w-5 h-5 text-white" />
            ) : (
              <Zap className="w-5 h-5 text-white" fill="white" />
            )}
          </div>
          <span className={`font-bold text-sm md:text-base hidden sm:block ${isNature ? 'text-amber-800' : ''}`}>
            {teacherName}
          </span>
        </Link>

        {/* Links - تخفي للطلاب المسجلين */}
        {!isAuthenticated && (
          <ul className="hidden lg:flex items-center gap-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2
                  ${isNature 
                    ? 'text-amber-700/70 hover:text-amber-700 hover:bg-amber-100' 
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isNature ? 'bg-amber-500' : 'bg-primary/60'}`} />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-xs font-bold transition-colors
              ${isNature 
                ? 'bg-white border border-amber-200 text-amber-700 hover:border-amber-400' 
                : 'bg-card border border-border hover:border-primary/40'}`}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          {/* Theme Toggle (بين default و nature) */}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
              ${isNature 
                ? 'bg-white border border-amber-200 hover:border-amber-400' 
                : 'bg-card border border-border hover:border-primary/40'}`}
          >
            {isNature ? (
              <span className="text-lg">🎨</span>
            ) : (
              <span className="text-lg">🌿</span>
            )}
          </button>

          {/* إذا كان المستخدم مسجل دخول */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all
                  ${isNature 
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' 
                    : 'bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20'}`}
              >
                <div className={`w-8 h-8 rounded-full grid place-items-center
                  ${isNature 
                    ? 'bg-amber-600 text-white' 
                    : 'gradient-primary'}`}>
                    <img src={student?.image_url} alt={studentName} className="w-4 h-4 object-cover rounded-full" />  
                </div>
                <span className="text-sm font-medium hidden md:block">{studentName}</span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className={`absolute top-full left-0 rtl:left-auto rtl:right-0 mt-2 w-48 rounded-xl shadow-lg overflow-hidden z-50
                  ${isNature 
                    ? 'bg-white border border-amber-200' 
                    : 'bg-card border border-border'}`}>
                  <Link
                    to={`/${slug}/dashboard`}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors
                      ${isNature 
                        ? 'hover:bg-amber-100 text-amber-800' 
                        : 'hover:bg-primary/10'}`}
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
                to={`/${slug}/register`}
                className={`inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-white text-sm font-semibold shadow-soft hover:shadow-glow transition-all hover:scale-[1.03] active:scale-95
                  ${isNature 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'gradient-primary'}`}
              >
                {isNature ? <Leaf className="w-4 h-4" /> : <Zap className="w-4 h-4" fill="white" />}
                <span className="hidden sm:inline">{lang === "ar" ? "إنشاء حساب" : "Sign up"}</span>
              </Link>
              <Link
                to={`/${slug}/login`}
                className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${isNature 
                    ? 'text-amber-700 hover:text-amber-900' 
                    : 'text-foreground/80 hover:text-foreground'}`}
              >
                {lang === "ar" ? "تسجيل دخول" : "Login"}
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden w-10 h-10 grid place-items-center rounded-full
              ${isNature 
                ? 'bg-white border border-amber-200' 
                : 'bg-card border border-border'}`}
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
          className={`lg:hidden max-w-7xl mx-auto mt-2 rounded-3xl p-4 shadow-card
            ${isNature 
              ? 'bg-white/95 backdrop-blur-md border border-amber-200' 
              : 'glass'}`}
        >
          <ul className="flex flex-col gap-1">
            {!isAuthenticated && links.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className={`block px-4 py-3 rounded-2xl text-sm font-medium
                  ${isNature 
                    ? 'hover:bg-amber-100 text-amber-800' 
                    : 'hover:bg-primary/5'}`}>
                  {l.label}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li>
                  <Link to={`/${slug}/dashboard`} className={`block px-4 py-3 rounded-2xl text-sm font-medium
                    ${isNature 
                      ? 'hover:bg-amber-100 text-amber-800' 
                      : 'hover:bg-primary/5'}`}>
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
                  <Link to={`/${slug}/login`} className={`block px-4 py-3 rounded-2xl text-sm font-medium
                    ${isNature 
                      ? 'hover:bg-amber-100 text-amber-800' 
                      : 'hover:bg-primary/5'}`}>
                    {lang === "ar" ? "خش ذاكر " : "Login"}
                  </Link>
                </li>
                <li>
                  <Link to={`/${slug}/register`} className={`block px-4 py-3 rounded-2xl text-white text-sm font-medium
                    ${isNature 
                      ? 'bg-amber-600' 
                      : 'gradient-primary'}`}>
                    {lang === "ar" ? " اعمل اكونت" : "Sign up"}
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

const NavbarSkeleton = ({ isNature }: { isNature: boolean }) => (
  <div className="fixed top-3 md:top-5 inset-x-0 z-50 px-3 md:px-6">
    <div className={`max-w-7xl mx-auto rounded-full px-4 py-2 flex items-center justify-between
      ${isNature 
        ? 'bg-white/90 border border-amber-200' 
        : 'glass'}`}>
      <div className={`w-10 h-10 rounded-xl animate-pulse ${isNature ? 'bg-amber-200' : 'bg-gray-200 dark:bg-gray-700'}`} />
      <div className={`w-24 h-8 rounded-full animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
      <div className={`w-32 h-10 rounded-full animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
    </div>
  </div>
);