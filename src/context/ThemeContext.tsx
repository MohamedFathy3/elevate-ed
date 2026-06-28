/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/ThemeProvider.tsx

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
  CenterHours: React.ComponentType<any>;
}

interface ThemeContextType {
  theme: ThemeName;
  colorMode: ColorMode;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  toggleColorMode: () => void;
  pages: ThemePages | null;
  isLoading: boolean;
  apiColors: { background: string; text: string } | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

import * as defaultPages from '@/themes/default/pages/index';

// ✅ استيراد الـ CSS
import defaultCss from '@/themes/default/index.css?inline';
import natureCss from '@/themes/nature/index.css?inline';

let currentStyleElement: HTMLStyleElement | null = null;

// ✅ دالة ذكية لتطبيق ألوان API (بدون تدمير تصميم الثيم)
const applyApiColors = (bgColor: string, textColor: string) => {
  const root = document.documentElement;
  
  // 1. تعيين CSS Variables الخاصة بـ API فقط
  root.style.setProperty('--api-bg', bgColor);
  root.style.setProperty('--api-text', textColor);
  
  // 2. تطبيق فقط على العناصر الرئيسية مع احترام تصميم الثيم
  document.body.style.backgroundColor = bgColor;
  document.body.style.color = textColor;
  
  // 3. إضافة class للـ body للتحكم الإضافي في CSS
  document.body.setAttribute('data-api-colors', 'true');
  
  // 4. إنشاء style element خفيف يطبق الألوان بشكل لطيف
  let apiStyle = document.getElementById('api-color-styles');
  if (!apiStyle) {
    apiStyle = document.createElement('style');
    apiStyle.id = 'api-color-styles';
    document.head.appendChild(apiStyle);
  }
  
  apiStyle.textContent = `
    /* 🎨 ألوان من API - تطبق فقط على العناصر الرئيسية */
    [data-api-colors="true"] {
      background-color: ${bgColor};
      color: ${textColor};
    }
    
    .bg-background, 
    [class*="bg-background"] {
      background-color: ${bgColor} !important;
    }
    
    .text-foreground,
    [class*="text-foreground"] {
      color: ${textColor} !important;
    }
    
    .bg-card,
    [class*="bg-card"] {
      background-color: ${mixColors(bgColor, '#ffffff', 0.9)};
    }
    
    .text-muted-foreground,
    [class*="text-muted"] {
      color: ${lightenColor(textColor, 0.7)};
    }
    
    .border-border,
    [class*="border-border"] {
      border-color: ${darkenColor(bgColor, 0.85)};
    }
  `;
  
  console.log('🎨 تم تطبيق ألوان API بلطف:', { bgColor, textColor });
};

// 🎨 دوال مساعدة لمعالجة الألوان
function mixColors(color1: string, color2: string, ratio: number): string {
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const r = Math.round(rgb1.r * ratio + rgb2.r * (1 - ratio));
  const g = Math.round(rgb1.g * ratio + rgb2.g * (1 - ratio));
  const b = Math.round(rgb1.b * ratio + rgb2.b * (1 - ratio));
  
  return `rgb(${r}, ${g}, ${b})`;
}

function lightenColor(hex: string, percent: number): string {
  if (!hex || !hex.startsWith('#')) return hex;
  
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  
  r = Math.min(255, Math.floor(r + (255 - r) * (1 - percent)));
  g = Math.min(255, Math.floor(g + (255 - g) * (1 - percent)));
  b = Math.min(255, Math.floor(b + (255 - b) * (1 - percent)));
  
  return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex: string, percent: number): string {
  if (!hex || !hex.startsWith('#')) return hex;
  
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  
  r = Math.floor(r * percent);
  g = Math.floor(g * percent);
  b = Math.floor(b * percent);
  
  return `rgb(${r}, ${g}, ${b})`;
}

const loadThemeCSS = (theme: ThemeName) => {
  if (currentStyleElement) {
    currentStyleElement.remove();
    currentStyleElement = null;
  }
  
  const styleElement = document.createElement('style');
  const cssContent = theme === 'default' ? defaultCss : natureCss;
  styleElement.textContent = cssContent;
  
  document.head.appendChild(styleElement);
  currentStyleElement = styleElement;
  
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('app-theme', theme);
};

// ✅ استيراد الصفحات
const themeImports = {
  default: () => import('@/themes/default/pages/index.tsx'),
  nature: () => import('@/themes/nature/pages/index.tsx'),
};

// ✅ دالة جلب إعدادات الثيم والألوان من API
const fetchThemeSettings = async (teacherId: number): Promise<{ theme: ThemeName; bgColor: string; textColor: string }> => {
  try {
    console.log("🎨 جلب إعدادات الثيم للمعلم:", teacherId);
    const response = await api.post('/teachers/theme', { teacher_id: teacherId });
    console.log("✅ الرد من API:", response.data);
    
    if (response.data?.status === true) {
      const activeTheme = response.data.active_theme;
      let theme: ThemeName = 'default';
      if (activeTheme === "theme2") {
        theme = 'nature';
      }
      
      return {
        theme,
        bgColor: response.data.active_backgroud_color || '#FFFFFF',
        textColor: response.data.active_font_color || '#111827',
      };
    }
    
    return { theme: 'default', bgColor: '#FFFFFF', textColor: '#111827' };
  } catch (error) {
    console.error("❌ خطأ في جلب إعدادات الثيم:", error);
    return { theme: 'default', bgColor: '#FFFFFF', textColor: '#111827' };
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('default');
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [pages, setPages] = useState<ThemePages | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ true في البداية
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [apiColors, setApiColors] = useState<{ background: string; text: string } | null>(null);

  // ✅ جلب teacherId من localStorage (الـ TeacherProvider بيحفظها)
  useEffect(() => {
    const getTeacherId = () => {
      console.log("🔍 ThemeProvider: بدء جلب teacherId");
      
      // 1️⃣ حاول من localStorage (الـ TeacherProvider بيحفظها)
      const saved = localStorage.getItem('teacher-data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.id) {
            console.log("✅ ThemeProvider: تم العثور على teacherId من localStorage:", parsed.id);
            setTeacherId(parsed.id);
            return;
          }
        } catch(e) {
          console.error("❌ ThemeProvider: خطأ في قراءة localStorage", e);
        }
      }

      // 2️⃣ جرب من sessionStorage
      const sessionSaved = sessionStorage.getItem('teacher-data');
      if (sessionSaved) {
        try {
          const parsed = JSON.parse(sessionSaved);
          if (parsed?.id) {
            console.log("✅ ThemeProvider: تم العثور على teacherId من sessionStorage:", parsed.id);
            setTeacherId(parsed.id);
            return;
          }
        } catch(e) {
          console.error("❌ ThemeProvider: خطأ في قراءة sessionStorage", e);
        }
      }

      // 3️⃣ حاول تجيب من الـ URL
      const pathname = window.location.pathname;
      const currentSlug = pathname.split('/')[1];
      
      if (currentSlug && currentSlug !== 'login' && currentSlug !== 'register' && currentSlug !== '') {
        console.log("🔍 ThemeProvider: سنحاول جلب teacherId من API باستخدام slug:", currentSlug);
        // هنحاول بعد شوية لأن TeacherProvider ممكن يكون لسه محمل
        const timer = setTimeout(async () => {
          try {
            const response = await api.get(`/${currentSlug}`);
            if (response.data?.status === 200 && response.data?.data?.id) {
              const id = response.data.data.id;
              console.log("✅ ThemeProvider: تم العثور على teacherId من API:", id);
              setTeacherId(id);
              localStorage.setItem('teacher-data', JSON.stringify({ id: id }));
            }
          } catch (error) {
            console.error("❌ ThemeProvider: خطأ في جلب بيانات المعلم:", error);
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      }
      
      console.log("⚠️ ThemeProvider: لم يتم العثور على teacherId");
    };
    
    getTeacherId();
    
    // ✅ الاستماع للتغيرات في localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'teacher-data' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.id) {
            console.log("🔄 ThemeProvider: تم تحديث teacherId من localStorage:", parsed.id);
            setTeacherId(parsed.id);
          }
        } catch(e) {}
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // تحميل الـ color mode
  useEffect(() => {
    const savedColorMode = localStorage.getItem('color-mode') as ColorMode;
    if (savedColorMode === 'dark' || savedColorMode === 'light') {
      setColorMode(savedColorMode);
    }
  }, []);

  // تطبيق الـ color mode
  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('color-mode', colorMode);
  }, [colorMode]);

  const loadTheme = async (newTheme: ThemeName, bgColor?: string, textColor?: string) => {
    setIsLoading(true);
    
    // تحميل CSS الخاص بالثيم
    loadThemeCSS(newTheme);
    
    // ✅ تطبيق ألوان API
    if (bgColor && textColor) {
      applyApiColors(bgColor, textColor);
      setApiColors({ background: bgColor, text: textColor });
      localStorage.setItem('api-bg-color', bgColor);
      localStorage.setItem('api-text-color', textColor);
    } else {
      const savedBg = localStorage.getItem('api-bg-color');
      const savedText = localStorage.getItem('api-text-color');
      if (savedBg && savedText) {
        applyApiColors(savedBg, savedText);
        setApiColors({ background: savedBg, text: savedText });
      }
    }
    
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
          CenterHours: natureModule.CenterHours || defaultPages.CenterHours,
        };
      }
      
      setPages(themePages);
      console.log(`✅ تم تحميل ثيم ${newTheme}`);
    } catch (error) {
      console.error(`❌ خطأ في تحميل ثيم ${newTheme}:`, error);
      setPages(defaultPages);
    }
    
    setIsLoading(false);
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    if (teacherId) {
      fetchThemeSettings(teacherId).then(({ theme, bgColor, textColor }) => {
        loadTheme(theme, bgColor, textColor);
      });
    } else {
      const savedBg = localStorage.getItem('api-bg-color');
      const savedText = localStorage.getItem('api-text-color');
      loadTheme(newTheme, savedBg || '#FFFFFF', savedText || '#111827');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'nature' : 'default';
    setTheme(newTheme);
  };

  const toggleColorMode = () => {
    setColorMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // ✅ التحميل الأولي
  useEffect(() => {
    const initTheme = async () => {
      console.log("🚀 ThemeProvider: بدء التحميل الأولي, teacherId:", teacherId);
      
      let initialTheme: ThemeName = 'default';
      let bgColor = '#FFFFFF';
      let textColor = '#111827';
      
      if (teacherId) {
        console.log("🎯 ThemeProvider: جلب الثيم للمعلم:", teacherId);
        try {
          const result = await fetchThemeSettings(teacherId);
          initialTheme = result.theme;
          bgColor = result.bgColor;
          textColor = result.textColor;
          console.log("🎨 ThemeProvider: الثيم من API:", initialTheme, "الألوان:", { bgColor, textColor });
        } catch (error) {
          console.error("❌ ThemeProvider: خطأ في جلب الثيم:", error);
          const savedTheme = localStorage.getItem('app-theme') as ThemeName;
          if (savedTheme && (savedTheme === 'default' || savedTheme === 'nature')) {
            initialTheme = savedTheme;
          }
          const savedBg = localStorage.getItem('api-bg-color');
          const savedText = localStorage.getItem('api-text-color');
          if (savedBg && savedText) {
            bgColor = savedBg;
            textColor = savedText;
          }
        }
      } else {
        console.log("ℹ️ ThemeProvider: مفيش teacherId، استخدم المحفوظ من localStorage");
        const savedTheme = localStorage.getItem('app-theme') as ThemeName;
        if (savedTheme && (savedTheme === 'default' || savedTheme === 'nature')) {
          initialTheme = savedTheme;
        }
        const savedBg = localStorage.getItem('api-bg-color');
        const savedText = localStorage.getItem('api-text-color');
        if (savedBg && savedText) {
          bgColor = savedBg;
          textColor = savedText;
        }
      }
      
      setThemeState(initialTheme);
      await loadTheme(initialTheme, bgColor, textColor);
      console.log("✅ ThemeProvider: تم التحميل بنجاح");
    };
    
    initTheme();
  }, [teacherId]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colorMode, 
      setTheme, 
      toggleTheme, 
      toggleColorMode, 
      pages, 
      isLoading,
      apiColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};