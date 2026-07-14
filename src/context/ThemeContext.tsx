/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/ThemeProvider.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
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

import defaultCss from '@/themes/default/index.css?inline';
import natureCss from '@/themes/nature/index.css?inline';

let currentStyleElement: HTMLStyleElement | null = null;

const applyApiColors = (bgColor: string, textColor: string) => {
  const root = document.documentElement;
  
  root.style.setProperty('--api-bg', bgColor);
  root.style.setProperty('--api-text', textColor);
  
  document.body.style.backgroundColor = bgColor;
  document.body.style.color = textColor;
  
  document.body.setAttribute('data-api-colors', 'true');
  
  let apiStyle = document.getElementById('api-color-styles');
  if (!apiStyle) {
    apiStyle = document.createElement('style');
    apiStyle.id = 'api-color-styles';
    document.head.appendChild(apiStyle);
  }
  
  apiStyle.textContent = `
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
  
  console.log('Applied API colors:', { bgColor, textColor });
};

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
  
  console.log(`✅ Loaded theme CSS: ${theme}`);
};

const themeImports = {
  default: () => import('@/themes/default/pages/index.tsx'),
  nature: () => import('@/themes/nature/pages/index.tsx'),
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('default');
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [pages, setPages] = useState<ThemePages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiColors, setApiColors] = useState<{ background: string; text: string } | null>(null);
  
  const isInitialized = useRef(false);
  const themeLoadedRef = useRef(false);

  // ✅ دالة تحميل الثيم
  const loadTheme = useCallback(async (newTheme: ThemeName, bgColor?: string, textColor?: string) => {
    console.log("📦 Loading theme:", newTheme);
    setIsLoading(true);
    
    loadThemeCSS(newTheme);
    
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
      console.log(`✅ Loaded theme pages: ${newTheme}`);
    } catch (error) {
      console.error(`❌ Error loading theme ${newTheme}:`, error);
      setPages(defaultPages);
    }
    
    setIsLoading(false);
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    console.log("🔄 Setting theme to:", newTheme);
    setThemeState(newTheme);
    const savedBg = localStorage.getItem('api-bg-color');
    const savedText = localStorage.getItem('api-text-color');
    loadTheme(newTheme, savedBg || '#FFFFFF', savedText || '#111827');
  }, [loadTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'default' ? 'nature' : 'default';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const toggleColorMode = useCallback(() => {
    setColorMode(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // ✅ Load color mode
  useEffect(() => {
    const savedColorMode = localStorage.getItem('color-mode') as ColorMode;
    if (savedColorMode === 'dark' || savedColorMode === 'light') {
      setColorMode(savedColorMode);
    }
  }, []);

  // ✅ Apply color mode
  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('color-mode', colorMode);
  }, [colorMode]);

  // ✅ ✅ ✅ MAIN INITIALIZATION
  useEffect(() => {
    if (isInitialized.current) {
      return;
    }
    
    console.log("🚀 ThemeProvider: Starting initialization...");
    isInitialized.current = true;
    
    const initialize = async () => {
      setIsLoading(true);
      
      // ✅ استنى حدث theme-loaded من TeacherContext
      const handleThemeLoaded = (e: Event) => {
        const customEvent = e as CustomEvent;
        console.log("🔄 Theme loaded event received:", customEvent.detail);
        const { theme, bgColor, textColor } = customEvent.detail;
        
        if (theme && (theme === 'default' || theme === 'nature')) {
          console.log("✅ Loading theme from TeacherContext API response!");
          
          // ✅ حفظ في localStorage
          localStorage.setItem('app-theme', theme);
          localStorage.setItem('api-bg-color', bgColor);
          localStorage.setItem('api-text-color', textColor);
          
          setThemeState(theme);
          themeLoadedRef.current = true;
          loadTheme(theme, bgColor, textColor);
        }
      };
      
      window.addEventListener('theme-loaded', handleThemeLoaded);
      
      // ✅ أولاً: التحقق من localStorage (سريع)
      const savedTheme = localStorage.getItem('app-theme') as ThemeName;
      const savedBg = localStorage.getItem('api-bg-color');
      const savedText = localStorage.getItem('api-text-color');
      
      if (savedTheme && (savedTheme === 'default' || savedTheme === 'nature')) {
        console.log("📦 Found saved theme in localStorage:", savedTheme);
        setThemeState(savedTheme);
        themeLoadedRef.current = true;
        await loadTheme(savedTheme, savedBg || '#FFFFFF', savedText || '#111827');
        console.log("✅ Theme loaded from localStorage!");
        setIsLoading(false);
        return;
      }
      
      // ✅ مفيش ثيم في localStorage → استنى TeacherContext
      console.log("⏳ No theme in localStorage, waiting for TeacherContext to fetch from API...");
      
      let attempts = 0;
      const maxAttempts = 2;
      let themeFound = false;
      
      while (!themeFound && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const checkTheme = localStorage.getItem('app-theme');
        if (checkTheme && (checkTheme === 'default' || checkTheme === 'nature')) {
          themeFound = true;
          console.log("✅ Theme found in localStorage after wait:", checkTheme);
          const bg = localStorage.getItem('api-bg-color') || '#FFFFFF';
          const text = localStorage.getItem('api-text-color') || '#111827';
          setThemeState(checkTheme as ThemeName);
          themeLoadedRef.current = true;
          await loadTheme(checkTheme as ThemeName, bg, text);
          setIsLoading(false);
        }
        attempts++;
      }
      
      // ✅ لو مفيش ثيم بعد الانتظار → استخدم default (حالة نادرة)
      if (!themeFound && !themeLoadedRef.current) {
        console.log("⚠️ No theme found after timeout, using default");
        await loadTheme('default', '#FFFFFF', '#111827');
        setIsLoading(false);
      }
      
      // ✅ إزالة المستمع بعد 30 ثانية
      setTimeout(() => {
        window.removeEventListener('theme-loaded', handleThemeLoaded);
      }, 3000);
    };
    
    initialize();
  }, [loadTheme]);

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