// src/components/ThemeSwitcher.tsx
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      onClick={toggleTheme}
      variant="outline"
      className="fixed bottom-4 right-4 z-50 shadow-lg"
    >
      {theme === 'default' ? '🌿 الثيم الطبيعي' : '🎨 الثيم الأساسي'}
    </Button>
  );
};