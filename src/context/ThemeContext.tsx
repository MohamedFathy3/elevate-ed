/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useParams } from 'react-router-dom';

export type ThemeName = 'default' | 'nature';
export type ColorMode = 'light' | 'dark';

interface ThemePages {
  TeacherHome: React.ComponentType<any>;
  Landing: React.ComponentType<any>;
  CoursesPage: React.ComponentType<any>;
  CourseDetail: React.ComponentType<any>;
  SubjectsPage: React.ComponentType<any>;
  SemestersPage: React.ComponentType<any>;
  StagesPage: React.ComponentType<any>;
  StudentDashboard: React.ComponentType<any>;
  ExamPage: React.ComponentType<any>;
  LessonPage: React.ComponentType<any>;
  SemesterDetails: React.ComponentType<any>;
  Login: React.ComponentType<any>;
  Register: React.ComponentType<any>;
  NotFound: React.ComponentType<any>;
}

interface ThemeContextType {
  theme: ThemeName;
  colorMode: ColorMode;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  toggleColorMode: () => void;
  pages: ThemePages | null;    
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

import * as defaultPages from '@/themes/default/pages/index';

const themeImports = {
  default: () => import('@/themes/default/pages/index.tsx'),
  nature: () => import('@/themes/nature/pages/index.tsx'),
};

let currentStyleLink: HTMLLinkElement | null = null;

const loadThemeCSS = (theme: ThemeName) => {
  if (currentStyleLink) {
    currentStyleLink.remove();
  }
  
  const cssPath = theme === 'default' 
    ? '/src/themes/default/index.css'
    : '/src/themes/nature/index.css';
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssPath;
  document.head.appendChild(link);
  currentStyleLink = link;
  
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('app-theme', theme);
};

// ✅ دالة جلب إعدادات الثيم من API
const fetchThemeSettings = async (teacherId: number): Promise<ThemeName> => {
  try {
    console.log("🎨 Fetching theme settings for teacher:", teacherId);
    const response = await api.post('/teachers/theme', { teacher_id: teacherId });
    console.log("✅ Theme settings response:", response.data);
    
    // التحقق من الاستجابة
    if (response.data?.status === true && response.data?.active_theme) {
      const activeTheme = response.data.active_theme;
      console.log("🎨 Active theme from API:", activeTheme);
      
      // active_theme === "theme1" -> default
      // active_theme === "theme2" -> nature
      if (activeTheme === "theme2") {
        return 'nature';
      }
    }
    
    // default (theme1) هو الافتراضي
    return 'default';
  } catch (error) {
    console.error("❌ Error fetching theme settings:", error);
    // في حالة الخطأ، نرجع default
    return 'default';
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('default');
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [pages, setPages] = useState<ThemePages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  // الحصول على teacherId من الـ API باستخدام الـ slug
  useEffect(() => {
    const getTeacherId = async () => {
      // استخراج الـ slug من الـ URL
      const pathname = window.location.pathname;
      const currentSlug = pathname.split('/')[1];
      setSlug(currentSlug);
      
      if (currentSlug && currentSlug !== 'login' && currentSlug !== 'register') {
        try {
          // جلب بيانات المعلم باستخدام الـ slug
          const response = await api.get(`/${currentSlug}`);
          if (response.data?.status === 200 && response.data?.data?.id) {
            setTeacherId(response.data.data.id);
            console.log("✅ Found teacher ID:", response.data.data.id);
          }
        } catch (error) {
          console.error("❌ Error fetching teacher data:", error);
        }
      }
    };
    
    getTeacherId();
  }, []);

  // تحميل الـ color mode من localStorage
  useEffect(() => {
    const savedColorMode = localStorage.getItem('color-mode') as ColorMode;
    if (savedColorMode === 'dark' || savedColorMode === 'light') {
      setColorMode(savedColorMode);
    }
  }, []);

  // تطبيق الـ color mode على html
  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('color-mode', colorMode);
  }, [colorMode]);

  // ✅ تحديد الثيم بناءً على API
  const determineInitialTheme = async (): Promise<ThemeName> => {
    // أولاً: نشوف لو فيه ثيم محفوظ في localStorage (للتجربة اليدوية)
    const savedTheme = localStorage.getItem('app-theme') as ThemeName;
    
    // ثانياً: نجيب إعدادات الثيم من API
    if (teacherId) {
      const apiTheme = await fetchThemeSettings(teacherId);
      console.log("🎨 API determined theme:", apiTheme);
      
      // إذا كان الـ API عنده preference، نستخدمه
      return apiTheme;
    }
    
    // لو مفيش API ولا teacherId، نستخدم الـ localStorage أو default
    if (savedTheme && (savedTheme === 'default' || savedTheme === 'nature')) {
      console.log("🎨 Using saved theme from localStorage:", savedTheme);
      return savedTheme;
    }
    
    console.log("🎨 Using default theme");
    return 'default';
  };

  const loadTheme = async (newTheme: ThemeName) => {
    setIsLoading(true);
    
    loadThemeCSS(newTheme);
    
    try {
      let themePages;
      
      if (newTheme === 'default') {
        const module = await themeImports.default();
        themePages = module;
      } else {
        const natureModule = await themeImports.nature();
        themePages = {
          TeacherHome: natureModule.TeacherHome || defaultPages.TeacherHome,
          Landing: natureModule.Landing || defaultPages.Landing,
          CoursesPage: natureModule.CoursesPage || defaultPages.CoursesPage,
          CourseDetail: natureModule.CourseDetail || defaultPages.CourseDetail,
          SubjectsPage: natureModule.SubjectsPage || defaultPages.SubjectsPage,
          SemestersPage: natureModule.SemestersPage || defaultPages.SemestersPage,
          StagesPage: natureModule.StagesPage || defaultPages.StagesPage,
          StudentDashboard: natureModule.StudentDashboard || defaultPages.StudentDashboard,
          ExamPage: natureModule.ExamPage || defaultPages.ExamPage,
          LessonPage: natureModule.LessonPage || defaultPages.LessonPage,
          SemesterDetails: natureModule.SemesterDetails || defaultPages.SemesterDetails,
          Login: natureModule.Login || defaultPages.Login,
          Register: natureModule.Register || defaultPages.Register,
          NotFound: natureModule.NotFound || defaultPages.NotFound,
        };
      }
      
      setPages(themePages);
      console.log(`✅ Loaded ${newTheme} theme`);
    } catch (error) {
      console.error(`Error loading theme ${newTheme}:`, error);
      setPages(defaultPages);
    }
    
    setIsLoading(false);
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    loadTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'nature' : 'default';
    setTheme(newTheme);
  };

  const toggleColorMode = () => {
    setColorMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // ✅ التحميل الأولي - نجيب الثيم من API
  useEffect(() => {
    const initTheme = async () => {
      setIsLoading(true);
      const initialTheme = await determineInitialTheme();
      console.log("🎨 Final initial theme:", initialTheme);
      setThemeState(initialTheme);
      await loadTheme(initialTheme);
    };
    
    // ننتظر حتى نجيب الـ teacherId
    if (teacherId !== null) {
      initTheme();
    }
  }, [teacherId]);

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, toggleTheme, toggleColorMode, pages, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};