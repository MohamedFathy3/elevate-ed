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
};

const themeImports = {
  default: () => import('@/themes/default/pages/index.tsx'),
  nature: () => import('@/themes/nature/pages/index.tsx'),
};

const fetchThemeSettings = async (teacherId: number): Promise<{ theme: ThemeName; bgColor: string; textColor: string }> => {
  console.log("🔵 FETCHING THEME FROM API FOR TEACHER ID:", teacherId);
  
  try {
    const response = await api.post('/teachers/theme', { teacher_id: teacherId });
    console.log("✅ API RESPONSE:", response.data);
    
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
    console.error("❌ Error fetching theme settings:", error);
    return { theme: 'default', bgColor: '#FFFFFF', textColor: '#111827' };
  }
};

// ✅ Helper function to get teacherId from localStorage
const getTeacherIdFromStorage = (): number | null => {
  try {
    // Try localStorage first
    const saved = localStorage.getItem('teacher-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.id) {
        console.log("✅ Found teacherId in localStorage:", parsed.id);
        return parsed.id;
      }
    }
    
    // Try sessionStorage
    const sessionSaved = sessionStorage.getItem('teacher-data');
    if (sessionSaved) {
      const parsed = JSON.parse(sessionSaved);
      if (parsed?.id) {
        console.log("✅ Found teacherId in sessionStorage:", parsed.id);
        return parsed.id;
      }
    }
    
    console.log("⚠️ No teacherId found in storage");
    return null;
  } catch (e) {
    console.error("Error getting teacherId from storage:", e);
    return null;
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('default');
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [pages, setPages] = useState<ThemePages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiColors, setApiColors] = useState<{ background: string; text: string } | null>(null);

  const loadTheme = async (newTheme: ThemeName, bgColor?: string, textColor?: string) => {
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
      console.log(`✅ Loaded theme: ${newTheme}`);
    } catch (error) {
      console.error(`❌ Error loading theme ${newTheme}:`, error);
      setPages(defaultPages);
    }
    
    setIsLoading(false);
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    const teacherId = getTeacherIdFromStorage();
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

  // Load color mode
  useEffect(() => {
    const savedColorMode = localStorage.getItem('color-mode') as ColorMode;
    if (savedColorMode === 'dark' || savedColorMode === 'light') {
      setColorMode(savedColorMode);
    }
  }, []);

  // Apply color mode
  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('color-mode', colorMode);
  }, [colorMode]);

  // ✅ MAIN INITIALIZATION - Runs once when component mounts
  useEffect(() => {
    console.log("🚀 ThemeProvider initializing...");
    
    const initializeTheme = async () => {
      console.log("🔍 Looking for teacherId...");
      
      // ✅ Get teacherId from storage
      const teacherId = getTeacherIdFromStorage();
      
      if (teacherId) {
        console.log("🎯 Teacher found! Fetching theme from API with ID:", teacherId);
        
        try {
          // ✅ Call API to get theme settings
          const result = await fetchThemeSettings(teacherId);
          console.log("📦 Theme settings from API:", result);
          
          // ✅ Apply the theme
          setThemeState(result.theme);
          await loadTheme(result.theme, result.bgColor, result.textColor);
          
          console.log("✅ Theme loaded successfully!");
        } catch (error) {
          console.error("❌ Error fetching theme from API:", error);
          // Fallback to saved theme
          const savedTheme = localStorage.getItem('app-theme') as ThemeName;
          if (savedTheme && (savedTheme === 'default' || savedTheme === 'nature')) {
            setThemeState(savedTheme);
            await loadTheme(savedTheme);
          } else {
            await loadTheme('default');
          }
        }
      } else {
        console.log("ℹ️ No teacherId found, using saved/default theme");
        
        // Use saved theme or default
        const savedTheme = localStorage.getItem('app-theme') as ThemeName;
        if (savedTheme && (savedTheme === 'default' || savedTheme === 'nature')) {
          setThemeState(savedTheme);
          await loadTheme(savedTheme);
        } else {
          await loadTheme('default');
        }
      }
      
      setIsLoading(false);
      console.log("✅ ThemeProvider initialization complete!");
    };
    
    initializeTheme();
    
    // ✅ Listen for changes in localStorage (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'teacher-data' && e.newValue) {
        console.log("🔄 Storage changed, re-initializing theme...");
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.id) {
            const reloadTheme = async () => {
              const result = await fetchThemeSettings(parsed.id);
              setThemeState(result.theme);
              await loadTheme(result.theme, result.bgColor, result.textColor);
            };
            reloadTheme();
          }
        } catch (e) {
          console.error("Error parsing storage change:", e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // ✅ Empty dependency array - runs only once on mount

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