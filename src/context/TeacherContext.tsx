import { createContext, useContext, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Teacher, getTeacherBySlug } from "@/data/teachers";
import { useLang } from "@/i18n/LanguageContext";

interface Ctx {
  teacher: Teacher;
  slug: string;
  // language-aware text picker
  pick: (en?: string, ar?: string) => string;
}

const TeacherContext = createContext<Ctx | undefined>(undefined);

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const teacher = getTeacherBySlug(slug);
  const { lang } = useLang();

  if (!teacher) {
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-black mb-3">Teacher not found</h1>
          <p className="text-foreground/60">
            No teacher matched the slug <code className="font-mono">/{slug}</code>.
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-5 py-3 rounded-2xl gradient-primary text-white font-semibold"
          >
            Back home
          </a>
        </div>
      </div>
    );
  }

  const pick = (en?: string, ar?: string) =>
    (lang === "ar" ? ar || en : en || ar) ?? "";

  return (
    <TeacherContext.Provider value={{ teacher, slug: teacher.sub_domain, pick }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const c = useContext(TeacherContext);
  if (!c) throw new Error("useTeacher must be used inside TeacherProvider");
  return c;
};
