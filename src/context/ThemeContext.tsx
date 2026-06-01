/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

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

// ✅ استيراد الـ CSS مباشرة (بدون مسار ديناميكي)
import defaultCss from '@/themes/default/index.css?inline';
import natureCss from '@/themes/nature/index.css?inline';

let currentStyleElement: HTMLStyleElement | null = null;

const loadThemeCSS = (theme: ThemeName) => {
  // إزالة الـ style القديم
  if (currentStyleElement) {
    currentStyleElement.remove();
    currentStyleElement = null;
  }
  
  // إنشاء style element جديد
  const styleElement = document.createElement('style');
  
  // تحديد الـ CSS المناسب
  const cssContent = theme === 'default' ? defaultCss : natureCss;
  styleElement.textContent = cssContent;
  
  // إضافته للـ head
  document.head.appendChild(styleElement);
  currentStyleElement = styleElement;
  
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('app-theme', theme);
};

// ✅ استيراد الصفحات ديناميكياً مع import
const themeImports = {
  default: () => import('@/themes/default/pages/index.tsx'),
  nature: () => import('@/themes/nature/pages/index.tsx'),
};

// ✅ دالة جلب إعدادات الثيم من API
const fetchThemeSettings = async (teacherId: number): Promise<ThemeName> => {
  try {
    console.log("🎨 Fetching theme settings for teacher:", teacherId);
    const response = await api.post('/teachers/theme', { teacher_id: teacherId });
    console.log("✅ Theme settings response:", response.data);
    
    if (response.data?.status === true && response.data?.active_theme) {
      const activeTheme = response.data.active_theme;
      if (activeTheme === "theme2") {
        return 'nature';
      }
    }
    return 'default';
  } catch (error) {
    console.error("❌ Error fetching theme settings:", error);
    return 'default';
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('default');
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [pages, setPages] = useState<ThemePages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<number | null>(null);

  // الحصول على teacherId من الـ API باستخدام الـ slug
  useEffect(() => {
    const getTeacherId = async () => {
      const pathname = window.location.pathname;
      const currentSlug = pathname.split('/')[1];
      
      if (currentSlug && currentSlug !== 'login' && currentSlug !== 'register') {
        try {
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

  const loadTheme = async (newTheme: ThemeName) => {
    setIsLoading(true);
    
    // تحميل CSS أولاً
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

  // التحميل الأولي - نجيب الثيم من API
  useEffect(() => {
    const initTheme = async () => {
      setIsLoading(true);
      
      // أولاً: نجيب إعدادات الثيم من API
      let initialTheme: ThemeName = 'default';
      
      if (teacherId) {
        initialTheme = await fetchThemeSettings(teacherId);
        console.log("🎨 API determined theme:", initialTheme);
      } else {
        // إذا مفيش teacherId، نشوف localStorage
        const savedTheme = localStorage.getItem('app-theme') as ThemeName;
        if (savedTheme && (savedTheme === 'default' || savedTheme === 'nature')) {
          initialTheme = savedTheme;
        }
      }
      
      setThemeState(initialTheme);
      await loadTheme(initialTheme);
    };
    
    // ننتظر حتى نجيب الـ teacherId أو نستخدم الـ default
    if (teacherId !== null) {
      initTheme();
    } else {
      // لو مفيش teacherId (مثلاً في صفحة الـ Landing الرئيسية)
      const savedTheme = localStorage.getItem('app-theme') as ThemeName;
      const initialTheme = (savedTheme === 'default' || savedTheme === 'nature') ? savedTheme : 'default';
      setThemeState(initialTheme);
      loadTheme(initialTheme);
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