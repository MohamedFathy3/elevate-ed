/* eslint-disable @typescript-eslint/no-explicit-any */
// context/TeacherContext.tsx

import { createContext, useContext, ReactNode, useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/i18n/LanguageContext";
import api from "@/lib/api";
import Loading from '@/themes/default/pages/Landing';
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
  if (!host) {
    throw new Error('Host is required');
  }

  const url = `${encodeURIComponent(host)}`;
  const response = await api.get(url);
  const { data } = response;

  if (data.status !== 200) {
    throw new Error(data.message || "Failed to fetch teacher");
  }

  return data.data;
};

// ✅ دالة جلب الثيم من الـ API
const fetchThemeFromAPI = async (teacherId: number): Promise<{ theme: 'default' | 'nature'; bgColor: string; textColor: string }> => {
  console.log("🔵 FETCHING THEME FROM API FOR TEACHER ID:", teacherId);
  
  try {
    const response = await api.post('/teachers/theme', { teacher_id: teacherId });
    console.log("✅ API THEME RESPONSE:", response.data);
    
    if (response.data?.status === true) {
      const activeTheme = response.data.active_theme;
      let theme: 'default' | 'nature' = 'default';
      if (activeTheme === "theme2") {
        theme = 'nature';
      }
      
      // ✅ معالجة null
      const bgColor = response.data.active_backgroud_color && response.data.active_backgroud_color !== 'null' 
        ? response.data.active_backgroud_color 
        : '#FFFFFF';
      const textColor = response.data.active_font_color && response.data.active_font_color !== 'null'
        ? response.data.active_font_color 
        : '#111827';
      
      return {
        theme,
        bgColor,
        textColor,
      };
    }
    
    return { theme: 'default', bgColor: '#FFFFFF', textColor: '#111827' };
  } catch (error) {
    console.error("❌ Error fetching theme settings:", error);
    return { theme: 'default', bgColor: '#FFFFFF', textColor: '#111827' };
  }
};

// ✅ متغير خارجي لمنع التكرار (خارج المكون)
let _isTeacherSaved = false;
let _savedTeacherId: number | null = null;

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const { lang } = useLang();
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [host, setHost] = useState<string>('');
  
  // ✅ useRef داخل المكون
  const teacherSavedRef = useRef(false);

  // ✅ جيب الـ host من المتصفح
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullHost = window.location.hostname;
      setHost(fullHost);
    }
  }, []);

  const currentPath = pathname.split('/').pop() || '';
  const isStaticPage = STATIC_PAGES.includes(currentPath);
  
  const shouldFetch = !!host && !isStaticPage;

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

  useEffect(() => {
    const loadTeacherAndTheme = async () => {
      // ✅ إذا لم يوجد معلم
      if (!teacher?.id) {
        return;
      }
      
      // ✅ منع التكرار
      if (_isTeacherSaved && _savedTeacherId === teacher.id) {
        console.log("⏳ Teacher already saved globally, skipping...");
        return;
      }
      
      if (teacherSavedRef.current) {
        console.log("⏳ Teacher already saved locally, skipping...");
        return;
      }
      
      console.log("🎯 Teacher loaded! ID:", teacher.id);
      
      // ✅ منع التكرار
      teacherSavedRef.current = true;
      _isTeacherSaved = true;
      _savedTeacherId = teacher.id;
      
      try {
        // ✅ 1. حفظ teacherId في localStorage
        localStorage.setItem('teacher-data', JSON.stringify({ id: teacher.id }));
        console.log("✅ Teacher data saved!");
        
        // ✅ 2. جلب الثيم من API مباشرة
        console.log("📡 Fetching theme from API for teacher:", teacher.id);
        const themeData = await fetchThemeFromAPI(teacher.id);
        console.log("📦 Theme data from API:", themeData);
        
        // ✅ 3. حفظ الثيم في localStorage
        localStorage.setItem('app-theme', themeData.theme);
        localStorage.setItem('api-bg-color', themeData.bgColor);
        localStorage.setItem('api-text-color', themeData.textColor);
        console.log("✅ Theme saved to localStorage!");
        
        // ✅ 4. إرسال حدث لتحديث ThemeProvider
        window.dispatchEvent(new CustomEvent('theme-loaded', {
          detail: {
            theme: themeData.theme,
            bgColor: themeData.bgColor,
            textColor: themeData.textColor
          }
        }));
        
        console.log("✅ Theme loaded and saved for teacher!");
      } catch (error) {
        console.error("❌ Error loading teacher theme:", error);
      }
    };
    
    loadTeacherAndTheme();
  }, [teacher?.id]); // ✅ يعتمد فقط على teacher.id

  // ✅ تحسين عملية التحميل
  useEffect(() => {
    if (!isQueryLoading && shouldFetch) {
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isQueryLoading, shouldFetch]);

  useEffect(() => {
    if (isStaticPage) {
      setIsPageLoading(false);
    }
  }, [isStaticPage]);

  const isLoading = isPageLoading && shouldFetch && isQueryLoading;

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