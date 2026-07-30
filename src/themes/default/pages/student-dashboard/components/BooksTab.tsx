// src/pages/student-dashboard/components/BooksTab.tsx

import { motion } from "framer-motion";
import { BookMarked, Users } from "lucide-react";
import { useTeacher } from "@/context/TeacherContext";
import { EmptyState } from "./EmptyState";

export const BooksTab = ({ books, slug, lang, isNature, isDark, cardBg }: any) => {
  const { teacher } = useTeacher();
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  const getWhatsAppLink = (book: any) => {
    const phone = teacher?.phone || teacher?.whatsapp || '';
    const message = encodeURIComponent(
      lang === 'ar' 
        ? `السلام عليكم، أريد شراء كتاب "${book.title}"` 
        : `Hello, I want to buy the book "${book.title}"`
    );
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`;
  };
  
  if (books.length === 0) {
    return (
      <EmptyState
        icon={<BookMarked className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد كتب" : "No Books"}
        message={lang === "ar" ? "لم تقم بشراء أي كتب بعد" : "You haven't purchased any books yet"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <BookMarked className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "كتبي" : "My Books"}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book: any, idx: number) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-xl p-4 transition-all hover:-translate-y-1 ${cardBg}`}
          >
            <img
              src={book.image?.fullUrl || book.imageUrl || "/default-book.jpg"}
              alt={book.title}
              className="w-full h-44 object-cover rounded-lg mb-3"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = "/default-book.jpg"; }}
            />
            <h3 className={`font-bold line-clamp-1 ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>
              {lang === "ar" && book.title_ar ? book.title_ar : book.title}
            </h3>
            <p className={`text-xs ${getMutedColor()} mt-1 flex items-center gap-2`}>
              <Users className="w-3 h-3" />
              {book.writer || (lang === "ar" ? "مؤلف" : "Author")}
            </p>
            <div className="mt-3">
              <a
                href={getWhatsAppLink(book)}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded-lg text-white text-xs whitespace-nowrap inline-flex items-center gap-1
                  ${isNature 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-[#25D366] hover:bg-[#1da851]'}`}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {lang === "ar" ? "احصل عليه من المدرس" : "Get from teacher"}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};