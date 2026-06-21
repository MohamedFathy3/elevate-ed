// features/lesson/components/LessonBreadcrumb.tsx
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';

interface LessonBreadcrumbProps {
  slug: string;
  title: string;
}

export const LessonBreadcrumb = ({ slug, title }: LessonBreadcrumbProps) => {
  const { lang } = useLang();

  return (
    <div className="flex items-center gap-2 text-sm text-[#000] flex-wrap">
      <Link to={`/${slug}/dashboard`} className="hover:text-primary transition-colors">
        {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link to={`/${slug}/courses`} className="hover:text-primary transition-colors">
        {lang === "ar" ? "كورساتي" : "My Courses"}
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-foreground line-clamp-1">{title}</span>
    </div>
  );
};