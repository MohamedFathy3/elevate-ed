/* eslint-disable @typescript-eslint/no-explicit-any */
// /types.ts/ThemeContext

export type ThemeName = 'default' | 'nature';
export type ColorMode = 'light' | 'dark';

export interface ThemePages {
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

export interface ThemeContextType {
  theme: ThemeName;
  colorMode: ColorMode;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  toggleColorMode: () => void;
  pages: ThemePages | null;
  isLoading: boolean;
  apiColors: { background: string; text: string } | null;
}

export interface ThemeSettings {
  theme: ThemeName;
  bgColor: string;
  textColor: string;
}