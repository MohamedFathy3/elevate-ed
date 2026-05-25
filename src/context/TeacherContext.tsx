/* eslint-disable @typescript-eslint/no-explicit-any */
// context/TeacherContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/i18n/LanguageContext";
import api from "@/lib/api";
import axios from "axios";

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
    centerHours?: any[]; // ✅ إضافة centerHours
  };
  createdAt: string;
}

interface TeacherContextValue {
  teacher: TeacherWebsiteData | null;
  slug: string;
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
  centerHours: any[]; // ✅ إضافة centerHours
}

const TeacherContext = createContext<TeacherContextValue | undefined>(undefined);

// ✅ إزالة register و login من القائمة عشان نجيب البيانات
const STATIC_PAGES = ['forgot-password', 'reset-password'];

// دالة جلب البيانات
const fetchTeacherBySlug = async (slug: string): Promise<TeacherWebsiteData> => {
  console.log("🔵 fetchTeacherBySlug START for slug:", slug);
  
  if (!slug) {
    throw new Error('Slug is required');
  }
  
  const url = `/${slug}`;
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
  
  const currentPath = pathname.split('/').pop() || '';
  const isStaticPage = STATIC_PAGES.includes(currentPath);
  const shouldFetch = !!slug && !isStaticPage;
  
  console.log("=========================================");
  console.log("🏪 TeacherProvider");
  console.log("📌 slug:", slug);
  console.log("📌 pathname:", pathname);
  console.log("📌 shouldFetch:", shouldFetch);
  console.log("=========================================");
  
  const { 
    data: teacher, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['teacher', slug],
    queryFn: () => fetchTeacherBySlug(slug!),
    enabled: shouldFetch,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const pick = (en?: string, ar?: string) => {
    if (!en && !ar) return "";
    if (lang === "ar") return ar || en || "";
    return en || ar || "";
  };

  // ✅ بيانات آمنة مع centerHours
  const safeData = {
    stages: teacher?.website?.stages || [],
    courses: teacher?.website?.courses || [],
    books: teacher?.website?.books || [],
    features: teacher?.website?.features || [],
    about: teacher?.website?.about || null,
    footer: teacher?.website?.footer || null,
    future: teacher?.website?.future || [],
    home: teacher?.website?.home || null,
    centerHours: teacher?.website?.centerHours || [], // ✅ إضافة centerHours
  };

  // Show loading state
  if (isLoading && shouldFetch) {
    return (
      <div className="min-h-screen grid place-items-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && shouldFetch) {
    console.error("❌ TeacherProvider Error:", error);
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-black mb-3 text-red-500">Error</h1>
          <p className="text-foreground/60 mb-4">
            {error?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 rounded-xl gradient-primary text-white font-semibold"
          >
            Try Again
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
        isLoading, 
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
      isLoading: false,
      error: null,
      refetch: () => {},
      pick: (en?: string, ar?: string) => en || ar || "",
      stages: [],
      courses: [],
      books: [],
      features: [],
      about: null,
      footer: null,
      future: [],
      home: null,
      centerHours: [], // ✅ إضافة fallback
    };
  }
};