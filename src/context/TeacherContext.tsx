/* eslint-disable @typescript-eslint/no-explicit-any */
// context/TeacherContext.tsx

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/i18n/LanguageContext";
import api from "@/lib/api";
import Loading from '@/themes/default/pages/Landing'; // ✅ تصحيح الاستيراد
import { SeoSettings } from "@/types/seo";

// Types من الـ API
export interface TeacherWebsiteData {
  id: number;
  name: string;
  name_ar?: string;
  email: string;
  sub_domain: string;
  phone: string;
  active: boolean;
  website: {
    home: {
      title?: string;
      title_ar?: string;
      sub_title?: string;
      sub_title_ar?: string;
      description?: string;
      description_ar?: string;
      imageUrl?: string;
      image?: { fullUrl?: string };
    };
    features: any[];
    about: any;
    stages: any[];
    subjects: any[];
    courses: any[];
    books: any[];
    footer: any;
    future?: any[];
    featured_courses: any[]
    centerHours?: any[];
    seo?: SeoSettings;
  };
  createdAt: string;
}

interface TeacherContextValue {
  teacher: TeacherWebsiteData | null;
  slug: string;
  host: string;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  pick: (en?: string, ar?: string) => string;
  stages: any[];
  courses: any[];
  books: any[];
  features: any[];
  about: any;
  footer: any;
  future: any[];
  home: any;
  centerHours: any[];
  featured_courses: any[]
}

const TeacherContext = createContext<TeacherContextValue | undefined>(undefined);

const STATIC_PAGES = ['forgot-password', 'reset-password'];

// ✅ دالة جلب البيانات بالـ host كامل
const fetchTeacherByHost = async (host: string): Promise<TeacherWebsiteData> => {
  console.log("🔵 Fetching teacher by host:", host);
  
  if (!host) {
    throw new Error('Host is required');
  }

  // ✅ نبعت الـ host كامل في الـ query parameter
  const url = `${encodeURIComponent(host)}`;
  console.log("📌 API URL:", url);

  const response = await api.get(url);
  const { data } = response;

  if (data.status !== 200) {
    throw new Error(data.message || "Failed to fetch teacher");
  }

  return data.data;
};

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const { lang } = useLang();
  
  // ✅ تصحيح استخدام useState
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // ✅ State للـ host
  const [host, setHost] = useState<string>('');

  // ✅ جيب الـ host من المتصفح
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullHost = window.location.hostname;
      setHost(fullHost);
      console.log("🌐 Full Host from browser:", fullHost);
    }
  }, []);

  const currentPath = pathname.split('/').pop() || '';
  const isStaticPage = STATIC_PAGES.includes(currentPath);
  
  // ✅ نبعت الـ host بدل الـ slug
  const shouldFetch = !!host && !isStaticPage;

  console.log("=========================================");
  console.log("🏪 TeacherProvider");
  console.log("📌 Host:", host);
  console.log("📌 Slug from URL:", slug);
  console.log("📌 pathname:", pathname);
  console.log("📌 shouldFetch:", shouldFetch);
  console.log("=========================================");

  const {
    data: teacher,
    isLoading: isQueryLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['teacher', host],
    queryFn: () => fetchTeacherByHost(host!),
    enabled: shouldFetch,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const pick = (en?: string, ar?: string) => {
    if (!en && !ar) return "";
    if (lang === "ar") return ar || en || "";
    return en || ar || "";
  };

  const safeData = {
    stages: teacher?.website?.stages || [],
    courses: teacher?.website?.courses || [],
    books: teacher?.website?.books || [],
    features: teacher?.website?.features || [],
    about: teacher?.website?.about || null,
    footer: teacher?.website?.footer || null,
    future: teacher?.website?.future || [],
    home: teacher?.website?.home || null,
    centerHours: teacher?.website?.centerHours || [],
    featured_courses: teacher?.website?.featured_courses || [],
  };

  // ✅ تحسين عملية التحميل
  useEffect(() => {
    // إذا كان التحميل انتهى، ننتظر قليلاً ثم نخفي الـ Loading
    if (!isQueryLoading && shouldFetch) {
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500); // نصف ثانية فقط للأنيميشن

      return () => clearTimeout(timer);
    }
  }, [isQueryLoading, shouldFetch]);

  // ✅ إذا كان في صفحة ثابتة، نضبط التحميل على false فوراً
  useEffect(() => {
    if (isStaticPage) {
      setIsPageLoading(false);
    }
  }, [isStaticPage]);

  // ✅ حالة التحميل
  const isLoading = isPageLoading && shouldFetch && isQueryLoading;

  // ✅ عرض الـ Loading بشكل أنيق
  if (isLoading) {
    return (
      <Loading 
        lang={lang}
        message={{
          ar: 'جاري تحميل المنصة...',
          en: 'Loading platform...'
        }}
        minDisplayTime={600}
      />
    );
  }

  // ✅ عرض الخطأ
  if (error && shouldFetch) {
    console.error("❌ TeacherProvider Error:", error);
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-black mb-3 text-red-500">
            {lang === 'ar' ? 'حدث خطأ' : 'Error'}
          </h1>
          <p className="text-foreground/60 mb-4">
            {error?.message || (lang === 'ar' ? 'حدث خطأ ما' : 'Something went wrong')}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:scale-105 transition-transform"
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <TeacherContext.Provider
      value={{
        teacher: teacher || null,
        slug: slug || "",
        host: host || "",
        isLoading: isLoading,
        error: error || null,
        refetch,
        pick,
        ...safeData
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used within TeacherProvider");
  }
  return context;
};

export const useSafeTeacher = () => {
  try {
    return useTeacher();
  } catch {
    console.warn("⚠️ useSafeTeacher: Context not available");
    return {
      teacher: null,
      slug: "",
      host: "",
      isLoading: false,
      error: null,
      refetch: () => { },
      pick: (en?: string, ar?: string) => en || ar || "",
      stages: [],
      courses: [],
      books: [],
      features: [],
      about: null,
      footer: null,
      future: [],
      home: null,
      centerHours: [],
      featured_courses: [],
    };
  }
};