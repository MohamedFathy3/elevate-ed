// context/TeacherWebsiteContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useTeacherWebsite, TeacherWebsiteData } from "@/hooks/useTeacherWebsite";

interface TeacherWebsiteContextValue {
  data: TeacherWebsiteData | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const TeacherWebsiteContext = createContext<TeacherWebsiteContextValue | undefined>(undefined);

export const TeacherWebsiteProvider = ({ children }: { children: ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error, refetch } = useTeacherWebsite(slug);
  
  return (
    <TeacherWebsiteContext.Provider value={{ data, isLoading, error, refetch }}>
      {children}
    </TeacherWebsiteContext.Provider>
  );
};

// Hook مخصص للاستخدام في المكونات
export const useTeacherWebsiteContext = () => {
  const context = useContext(TeacherWebsiteContext);
  if (!context) {
    throw new Error("useTeacherWebsiteContext must be used within TeacherWebsiteProvider");
  }
  return context;
};

// Hooks مخصصة للـ UI (Dependency Inversion)
export const useTeacherName = () => {
  const { data } = useTeacherWebsiteContext();
  return data?.name || "";
};

export const useTeacherLogo = () => {
  const { data } = useTeacherWebsiteContext();
  return data?.website.home.imageUrl;
};

export const useTeacherSocialLinks = () => {
  const { data } = useTeacherWebsiteContext();
  return {
    facebook: data?.website.footer.facebook_link,
    youtube: data?.website.footer.youtube_link,
    instagram: data?.website.footer.instagram_link,
    tiktok: data?.website.footer.tiktok_link,
    whatsapp: data?.website.footer.whatsapp_link,
  };
};