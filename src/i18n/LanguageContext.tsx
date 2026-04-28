import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const translations: Record<Lang, Dict> = {
  en: {
    "nav.about": "About",
    "nav.features": "Features",
    "nav.courses": "Courses",
    "nav.contact": "Contact",
    "nav.cta": "Start Learning",
    "hero.eyebrow": "Premium Learning Platform",
    "hero.title": "Learn without limits.",
    "hero.title2": "Master what matters.",
    "hero.subtitle": "A modern, focused space to grow your skills with world-class instructors and beautifully designed courses.",
    "hero.cta": "Start Learning",
    "hero.cta2": "Explore Courses",
    "about.eyebrow": "About",
    "about.title": "Education, refined.",
    "about.body": "We believe learning should be elegant, intentional, and accessible. Our platform brings together leading educators, modern tools, and a calm interface — so you can focus on what truly matters: progress.",
    "about.stat1": "Active learners",
    "about.stat2": "Expert instructors",
    "about.stat3": "Course completion",
    "features.eyebrow": "Why us",
    "features.title": "Built for serious learners.",
    "features.subtitle": "Every detail designed to help you stay focused and move forward.",
    "f1.title": "Curated curriculum",
    "f1.body": "Hand-picked courses designed by industry experts.",
    "f2.title": "Live mentorship",
    "f2.body": "Direct access to mentors who guide your journey.",
    "f3.title": "Flexible pace",
    "f3.body": "Learn on your schedule, from any device, anywhere.",
    "f4.title": "Verified certificates",
    "f4.body": "Earn credentials recognized by leading companies.",
    "f5.title": "Active community",
    "f5.body": "Connect with thousands of learners worldwide.",
    "f6.title": "Lifetime access",
    "f6.body": "Once enrolled, the knowledge stays with you forever.",
    "courses.eyebrow": "Courses",
    "courses.title": "Learn from the best.",
    "courses.subtitle": "Hand-picked programs to help you grow faster.",
    "courses.cta": "View course",
    "c1.title": "Modern Web Development",
    "c1.body": "Build production-ready apps with React, TypeScript and modern tooling.",
    "c2.title": "Product Design Foundations",
    "c2.body": "From research to interface — design products people love to use.",
    "c3.title": "Data Science & AI",
    "c3.body": "Master Python, machine learning, and applied AI from the ground up.",
    "c4.title": "Digital Marketing Mastery",
    "c4.body": "Strategy, content, and analytics that move real business metrics.",
    "footer.tag": "Learn beautifully.",
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.rights": "All rights reserved.",
  },
  ar: {
    "nav.about": "من نحن",
    "nav.features": "المميزات",
    "nav.courses": "الدورات",
    "nav.contact": "تواصل",
    "nav.cta": "ابدأ التعلم",
    "hero.eyebrow": "منصة تعليمية متميزة",
    "hero.title": "تعلّم بلا حدود.",
    "hero.title2": "أتقن ما يهم.",
    "hero.subtitle": "مساحة عصرية وأنيقة لتطوير مهاراتك مع نخبة من المدرّبين ودورات مصممة باحترافية عالية.",
    "hero.cta": "ابدأ التعلم",
    "hero.cta2": "استكشف الدورات",
    "about.eyebrow": "من نحن",
    "about.title": "التعليم، بأناقة.",
    "about.body": "نؤمن بأن التعلم يجب أن يكون أنيقًا وهادفًا ومتاحًا للجميع. منصتنا تجمع بين أفضل المعلمين وأدوات حديثة وواجهة هادئة — لتركز على ما يهم حقًا: التقدّم.",
    "about.stat1": "متعلم نشط",
    "about.stat2": "مدرب متخصص",
    "about.stat3": "نسبة إتمام الدورات",
    "features.eyebrow": "لماذا نحن",
    "features.title": "مصمّمة للمتعلمين الجادين.",
    "features.subtitle": "كل تفصيلة صُممت لتساعدك على التركيز والتقدّم.",
    "f1.title": "محتوى منتقى",
    "f1.body": "دورات مختارة بعناية من خبراء الصناعة.",
    "f2.title": "إرشاد مباشر",
    "f2.body": "وصول مباشر لمدربين يرشدونك في رحلتك.",
    "f3.title": "تعلّم بمرونة",
    "f3.body": "تعلّم في أي وقت، ومن أي جهاز، وفي أي مكان.",
    "f4.title": "شهادات موثوقة",
    "f4.body": "احصل على شهادات معتمدة من شركات رائدة.",
    "f5.title": "مجتمع نشط",
    "f5.body": "تواصل مع آلاف المتعلمين حول العالم.",
    "f6.title": "وصول مدى الحياة",
    "f6.body": "بمجرد الاشتراك، تبقى المعرفة معك للأبد.",
    "courses.eyebrow": "الدورات",
    "courses.title": "تعلّم من الأفضل.",
    "courses.subtitle": "برامج مختارة بعناية لمساعدتك على النمو بشكل أسرع.",
    "courses.cta": "عرض الدورة",
    "c1.title": "تطوير الويب الحديث",
    "c1.body": "ابنِ تطبيقات احترافية باستخدام React وTypeScript وأحدث الأدوات.",
    "c2.title": "أساسيات تصميم المنتجات",
    "c2.body": "من البحث إلى الواجهة — صمّم منتجات يعشقها المستخدمون.",
    "c3.title": "علم البيانات والذكاء الاصطناعي",
    "c3.body": "أتقن بايثون وتعلّم الآلة والذكاء الاصطناعي التطبيقي.",
    "c4.title": "التسويق الرقمي الاحترافي",
    "c4.body": "استراتيجية ومحتوى وتحليلات تحرّك مؤشرات الأعمال الحقيقية.",
    "footer.tag": "تعلّم بأناقة.",
    "footer.product": "المنتج",
    "footer.company": "الشركة",
    "footer.legal": "القانونية",
    "footer.rights": "جميع الحقوق محفوظة.",
  },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<Ctx | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("lang") as Lang) || "en";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("lang", lang);
  }, [lang, dir]);

  const t = (key: string) => translations[lang][key] ?? key;

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
