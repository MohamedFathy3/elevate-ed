import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "ar";

const translations = {
  en: {
    "nav.about": "About Platform",
    "nav.courses": "Latest Courses",
    "nav.teacher": "About Teacher",
    "nav.contact": "Contact Us",
    "nav.login": "Login",
    "nav.signup": "Create Account",
    "hero.welcome": "Welcome to",
    "hero.title": "Mr. Abdelmaseeh Isaac Platform",
    "hero.subtitle": "Your integrated platform to learn physics in a simple and enjoyable way — Volt Physics",
    "hero.body": "Welcome! I am Mr. Abdelmaseeh Isaac, and this is my special platform where you will learn physics in a completely different way. Easy, comprehensive, and contains everything you need.",
    "hero.cta": "Click here and register, what are you waiting for!",
    "courses.eyebrow": "Latest Courses",
    "courses.title": "Discover physics content that will help you understand and excel",
    "courses.cta": "Buy Lecture",
    "courses.access": "Access for 30 Days",
    "courses.subject": "Physics",
    "courses.individual": "Individual",
    "c1.grade": "1st Sec",
    "c1.title": "Applications of nanotechnology and the biosphere",
    "c1.body": "We will understand the impact of nanotechnology, its importance and concept",
    "c2.grade": "2nd Sec",
    "c2.title": "Prism at minimum angle of deviation",
    "c2.body": "In this lesson we will take one of the prism cases — get ready!",
    "c3.grade": "3rd Sec",
    "c3.title": "Revision homework on Optics",
    "c3.body": "Comprehensive revision to lock in everything you've learned",
    "c4.grade": "2nd Sec",
    "c4.title": "Electric current and Ohm's law",
    "c4.body": "Master one of the most important chapters with practical examples",
    "about.eyebrow": "About the Platform",
    "about.title": "Why Volt Physics?",
    "about.subtitle": "Everything you need to ace physics — in one beautifully crafted place.",
    "f1.title": "Simplified Explanations",
    "f1.body": "Complex concepts broken down into simple, memorable lessons.",
    "f2.title": "Practice & Quizzes",
    "f2.body": "Hundreds of questions to test and strengthen your understanding.",
    "f3.title": "Lifetime Updates",
    "f3.body": "Continuously updated content following the latest curriculum.",
    "f4.title": "Direct Support",
    "f4.body": "Ask anytime — get answers from Mr. Abdelmaseeh and the team.",
    "teacher.eyebrow": "About the Teacher",
    "teacher.title": "Mr. Abdelmaseeh Isaac",
    "teacher.body": "Physics teacher with years of experience helping thousands of students fall in love with physics. Specialized in making complex topics feel simple, structured, and exciting.",
    "stats.students": "Students",
    "stats.lectures": "Lectures",
    "stats.years": "Years Teaching",
    "stats.success": "Success Rate",
    "footer.tag": "Volt Physics — Learn physics, the right way.",
    "footer.quick": "Quick Links",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
  },
  ar: {
    "nav.about": "عن المنصة",
    "nav.courses": "أحدث الدورات",
    "nav.teacher": "عن المدرّس",
    "nav.contact": "تواصل معنا",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "hero.welcome": "أهلاً بك في",
    "hero.title": "منصة مستر عبدالمسيح إسحاق",
    "hero.subtitle": "منصتك المتكاملة لتعلم الفيزياء بطريقة بسيطة وممتعة — Volt Physics",
    "hero.body": "أهلاً! أنا مستر عبدالمسيح إسحاق، ودي منصتي الخاصة اللي هتتعلم فيها الفيزياء بشكل مختلف تمامًا. سهلة وشاملة وفيها كل اللي محتاجه عشان تفهم المادة صح وتطبّقها بسهولة.",
    "hero.cta": "اضغط هنا وسجّل، إنت مستني إيه!",
    "courses.eyebrow": "أحدث الدورات",
    "courses.title": "اكتشف محتوى فيزياء يساعدك تفهم المادة وتتفوق فيها",
    "courses.cta": "شراء المحاضرة",
    "courses.access": "وصول لمدة 30 يوم",
    "courses.subject": "فيزياء",
    "courses.individual": "فردي",
    "c1.grade": "أولى ثانوي",
    "c1.title": "تطبيقات النانوتكنولوجي واستدامة الغلاف الحيوي",
    "c1.body": "هنفهم تأثير النانوتكنولوجي وأهميتها ومفهومها وهندلعك يا باشا",
    "c2.grade": "ثانية ثانوي",
    "c2.title": "المنشور عند الزاوية الصغرى للانحراف",
    "c2.body": "في الحصة دي هناخد حالة من حالات الـ prism، اصحى يا أبو الصحاب كده معايا",
    "c3.grade": "ثالثة ثانوي",
    "c3.title": "واجب مراجعة على البصريات",
    "c3.body": "مراجعة شاملة عشان تثبّت كل اللي اتعلمته في الفصل",
    "c4.grade": "ثانية ثانوي",
    "c4.title": "التيار الكهربي وقانون أوم",
    "c4.body": "أتقن واحد من أهم الفصول بأمثلة عملية وتطبيقات",
    "about.eyebrow": "عن المنصة",
    "about.title": "ليه Volt Physics؟",
    "about.subtitle": "كل اللي تحتاجه عشان تتفوق في الفيزياء — في مكان واحد مصمم بعناية.",
    "f1.title": "شرح مبسّط",
    "f1.body": "مفاهيم معقدة مقسّمة لدروس بسيطة وسهلة الحفظ.",
    "f2.title": "تمارين واختبارات",
    "f2.body": "مئات الأسئلة لاختبار وتقوية فهمك للمادة.",
    "f3.title": "تحديثات مستمرة",
    "f3.body": "محتوى متجدد دائمًا بناءً على أحدث المناهج.",
    "f4.title": "دعم مباشر",
    "f4.body": "اسأل في أي وقت واحصل على إجابات من المستر والفريق.",
    "teacher.eyebrow": "عن المدرّس",
    "teacher.title": "مستر عبدالمسيح إسحاق",
    "teacher.body": "مدرّس فيزياء بخبرة سنين ساعد آلاف الطلاب يحبوا الفيزياء. متخصص في تبسيط المواضيع المعقدة وتقديمها بشكل ممتع ومنظم.",
    "stats.students": "طالب",
    "stats.lectures": "محاضرة",
    "stats.years": "سنة خبرة",
    "stats.success": "نسبة نجاح",
    "footer.tag": "Volt Physics — تعلّم الفيزياء بالطريقة الصحيحة.",
    "footer.quick": "روابط سريعة",
    "footer.contact": "تواصل",
    "footer.rights": "جميع الحقوق محفوظة.",
  },
} as const;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<Ctx | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    return (localStorage.getItem("lang") as Lang) || "ar";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("lang", lang);
  }, [lang, dir]);

  const t = (key: string) => (translations[lang] as Record<string, string>)[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};
