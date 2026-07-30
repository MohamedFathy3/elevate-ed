/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/student-dashboard/StudentDashboard.types.ts

export type TabType = 'profile' | 'wallet' | 'courses' | 'lessons' | 'semesters' | 'books' | 'exams' | 'assignments';

export interface TabItem {
  id: TabType;
  label: string;
  labelAr: string;
  icon: React.ReactNode;
}

export interface StudentInfo {
  id: number;
  name: string;
  phone?: string;
  phone_parent?: string;
  email?: string;
  region?: string;
  governorate?: string;
  school_name?: string;
  type_of_attendance?: 'online' | 'center';
  type_of_study?: 'general' | 'azhar';
  gender?: 'male' | 'female';
  code_parent?: string;
  barcode?: string;
  image?: {
    fullUrl?: string;
    previewUrl?: string;
  };
  imageUrl?: string;
  created_at?: string;
}

export interface DashboardProps {
  lang: string;
  isNature: boolean;
  isDark: boolean;
  studentInfo: StudentInfo;
  profileData: any;
  learningData: any;
  walletBalance: number;
  semesters: any[];
  courses: any[];
  lessons: any[];
  booksList: any[];
  examsList: any[];
  assignmentsList: any[];
  // Handlers
  logout: () => void;
  refetchProfile: () => void;
  refetchLearning: () => void;
}

export interface SidebarProps {
  tabs: TabItem[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  studentInfo: StudentInfo;
  logout: () => void;
  lang: string;
  isNature: boolean;
  isDark: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export interface ProfileTabProps {
  studentInfo: StudentInfo;
  lang: string;
  isNature: boolean;
  isDark: boolean;
  cardBg: string;
}