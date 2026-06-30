// src/services/themeService.ts

import api from '@/lib/api';
import { ThemeName, ThemeSettings } from '@/types/ThemeContext';

export const fetchThemeSettings = async (teacherId: number): Promise<ThemeSettings> => {
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

export const getTeacherId = (): number | null => {
  try {
    const saved = localStorage.getItem('teacher-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.id) {
        return parsed.id;
      }
    }
    return null;
  } catch (e) {
    console.error("Error getting teacherId:", e);
    return null;
  }
};