import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

export const dict: Dict = {
  // nav
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_courses: { ar: "الكورسات", en: "Courses" },
  nav_stages: { ar: "المراحل", en: "Stages" },
  nav_subjects: { ar: "المواد", en: "Subjects" },
  nav_profile: { ar: "حسابي", en: "Profile" },
  nav_login: { ar: "يلا سجل دخولك", en: "Login" },
  nav_register: { ar: "خش اعمل اكونت", en: "Register" },
  // common
  brand: { ar: "د/ إيمان عمران", en: "Dr. Eman Omaran" },
  search: { ar: "ابحث", en: "Search" },
  email: { ar: "البريد الإلكتروني", en: "Email" },
  password: { ar: "كلمة المرور", en: "Password" },
  confirm_password: { ar: "تأكيد كلمة المرور", en: "Confirm password" },
  full_name: { ar: "الاسم بالكامل", en: "Full name" },
  phone: { ar: "رقم الموبايل", en: "Phone number" },
  parent_phone: { ar: "موبايل ولي الأمر", en: "Parent phone" },
  grade: { ar: "السنة الدراسية", en: "Grade" },
  remember: { ar: "افتكرني", en: "Remember me" },
  forgot: { ar: "نسيت الباسورد؟", en: "Forgot password?" },
  no_account: { ar: "معندكش اكونت؟", en: "No account yet?" },
  have_account: { ar: "عندك اكونت بالفعل؟", en: "Already have an account?" },
  signup_now: { ar: "اعمل اكونت دلوقتي", en: "Create one now" },
  login_now: { ar: "سجل دخولك", en: "Login" },
  submit_login: { ar: "تسجيل الدخول", en: "Sign in" },
  submit_register: { ar: "افتح حسابي", en: "Create account" },
  or_continue: { ar: "أو كمل بـ", en: "Or continue with" },
  // courses page
  courses_title: { ar: "كل الكورسات", en: "All Courses" },
  courses_sub: { ar: "اختار الكورس اللي يناسبك وابدأ من دلوقتي", en: "Pick the course that fits you and start now" },
  filter_all: { ar: "الكل", en: "All" },
  enroll: { ar: "اشترك الآن", en: "Enroll now" },
  details: { ar: "تفاصيل الكورس", en: "View details" },
  starts: { ar: "يبدأ", en: "Starts" },
  ends: { ar: "ينتهي", en: "Ends" },
  lessons: { ar: "حصة", en: "Lessons" },
  students: { ar: "طالب", en: "Students" },
  rating: { ar: "تقييم", en: "Rating" },
  // course details
  about_course: { ar: "عن الكورس", en: "About the course" },
  what_youll_learn: { ar: "هتتعلم إيه؟", en: "What you'll learn" },
  curriculum: { ar: "محتوى الكورس", en: "Curriculum" },
  instructor: { ar: "المُحاضر", en: "Instructor" },
  // stages
  stages_title: { ar: "المراحل الدراسية", en: "Academic Stages" },
  stages_sub: { ar: "اختار مرحلتك الدراسية وشوف الكورسات المتاحة", en: "Choose your stage and explore available courses" },
  view_courses: { ar: "تصفّح الكورسات", en: "Browse courses" },
  // subjects
  subjects_title: { ar: "المواد الدراسية", en: "Subjects" },
  subjects_sub: { ar: "كل المواد اللي بنشرحها معاك", en: "All the subjects we cover" },
  // profile
  profile_title: { ar: "حسابي", en: "My Profile" },
  my_courses: { ar: "كورساتي", en: "My courses" },
  my_points: { ar: "نقاطي", en: "My points" },
  certificates: { ar: "شهاداتي", en: "Certificates" },
  settings: { ar: "الإعدادات", en: "Settings" },
  logout: { ar: "تسجيل الخروج", en: "Sign out" },
  edit_profile: { ar: "تعديل الحساب", en: "Edit profile" },
  // misc
  back: { ar: "رجوع", en: "Back" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string; dir: "rtl" | "ltr" };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof localStorage !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: keyof typeof dict) => dict[k]?.[lang] ?? String(k);
  return <I18nCtx.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
