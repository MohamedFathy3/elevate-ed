/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/Books.tsx

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacher } from "@/context/TeacherContext";
import { useTheme } from "@/context/ThemeContext";
import { BookOpen, FileText, Leaf, BookMarked, AlertCircle } from "lucide-react";
import { useState } from "react";
import { RedeemModal } from "@/components/RedeemModal";

export const Books = () => {
  const { lang } = useLang();
  const { colorMode } = useTheme();
  const { teacher, pick, isLoading } = useSafeTeacher();
  
  const isDark = colorMode === 'dark';
  const isNature = colorMode === 'nature';
  const isLight = colorMode === 'light';
  
  const books = teacher?.website?.books || [];

  // ✅ State للـ Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    price: number;
    title: string;
  } | null>(null);

  // ✅ تحديد الألوان حسب colorMode
  const getColors = () => {
    if (isDark) {
      return {
        bg: 'bg-gray-950',
        bgCard: 'bg-gray-900/80',
        bgCardHover: 'hover:border-indigo-500/40',
        border: 'border-gray-800',
        borderHover: 'hover:border-indigo-500/40',
        text: 'text-gray-300',
        textMuted: 'text-gray-400',
        textStrong: 'text-gray-100',
        primary: 'text-indigo-400',
        primaryBg: 'bg-indigo-500/20',
        primaryBgStrong: 'bg-indigo-500/30',
        primaryBorder: 'border-indigo-500/30',
        accent: 'bg-indigo-500/10',
        accentBg: 'bg-indigo-500/20',
        badge: 'bg-indigo-500/20 text-indigo-400',
        button: 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600',
        skeleton: 'bg-gray-700',
        skeletonLight: 'bg-gray-800',
        imageBg: 'bg-gray-800',
      };
    }
    
    if (isNature) {
      return {
        bg: 'bg-gradient-to-b from-emerald-50/50 via-white to-white',
        bgCard: 'bg-white/80',
        bgCardHover: 'hover:border-emerald-400',
        border: 'border-emerald-200',
        borderHover: 'hover:border-emerald-400',
        text: 'text-gray-600',
        textMuted: 'text-gray-500',
        textStrong: 'text-gray-800',
        primary: 'text-emerald-600',
        primaryBg: 'bg-emerald-100',
        primaryBgStrong: 'bg-emerald-200',
        primaryBorder: 'border-emerald-200',
        accent: 'bg-emerald-100 text-emerald-700',
        accentBg: 'bg-emerald-100',
        badge: 'bg-emerald-600 text-white',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        skeleton: 'bg-emerald-100',
        skeletonLight: 'bg-emerald-50',
        imageBg: 'bg-emerald-50',
      };
    }
    
    // Light mode (default)
    return {
      bg: 'bg-gradient-to-b from-indigo-50/50 via-white to-white',
      bgCard: 'bg-white/80',
      bgCardHover: 'hover:border-indigo-400',
      border: 'border-gray-200/80',
      borderHover: 'hover:border-indigo-400',
      text: 'text-gray-600',
      textMuted: 'text-gray-500',
      textStrong: 'text-gray-800',
      primary: 'text-indigo-600',
      primaryBg: 'bg-indigo-100',
      primaryBgStrong: 'bg-indigo-200',
      primaryBorder: 'border-indigo-200',
      accent: 'bg-indigo-50 text-indigo-600',
      accentBg: 'bg-indigo-100',
      badge: 'bg-white/95 text-gray-800',
      button: 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600',
      skeleton: 'bg-gray-200',
      skeletonLight: 'bg-gray-100',
      imageBg: 'bg-gray-100',
    };
  };

  const colors = getColors();

  if (isLoading) {
    return <BooksSkeleton colors={colors} isNature={isNature} />;
  }

  if (!books.length) {
    return null;
  }

  // ✅ فتح Modal الشراء
  const handleBuyBook = (bookId: number, price: number, bookTitle: string) => {
    setSelectedBook({
      id: bookId,
      price: price,
      title: bookTitle,
    });
    setIsModalOpen(true);
  };

  // ✅ إغلاق Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  // ✅ نجاح الشراء
  const handleSuccess = (data: any) => {
    console.log('✅ Book purchased successfully:', data);
  };

  // ✅ فشل الشراء
  const handleError = (error: any) => {
    console.error('❌ Book purchase failed:', error);
  };

  return (
    <>
      <section id="books" className={`py-24 md:py-32 relative overflow-hidden transition-colors duration-300 ${colors.bg}`}>
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
            className={`absolute left-0 top-0 h-[400px] w-[400px] rounded-full blur-[120px]
              ${isNature ? 'bg-emerald-300/20' : isDark ? 'bg-indigo-500/10' : 'bg-indigo-300/20'}`}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container-tight relative z-10">
          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 transition-colors duration-300
                ${isNature 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : isDark
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'bg-indigo-50 text-indigo-600'}`}
            >
              {isNature ? <Leaf className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              {lang === "ar" ? "الكتب" : "Books"}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight transition-colors duration-300 ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}
            >
              <span className={`bg-gradient-to-r ${
                isNature 
                  ? 'from-emerald-600 to-emerald-400' 
                  : isDark
                  ? 'from-indigo-400 to-indigo-300'
                  : 'from-indigo-600 to-indigo-400'
              } bg-clip-text text-transparent`}>
                {lang === "ar" ? "كتبنا المطبوعة" : "Our printed books"}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`mt-4 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {lang === "ar" 
                ? "استمتع بقراءة كتبنا المصممة خصيصاً لمسيرتك التعليمية" 
                : "Enjoy reading our books designed for your educational journey"}
            </motion.p>
          </div>

          {/* BOOKS GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {books.map((b, i) => (
              <motion.article
                key={b.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`group relative rounded-3xl p-6 transition-all duration-300 
                  ${colors.bgCard} ${colors.border} ${colors.bgCardHover} 
                  shadow-md hover:shadow-xl`}
              >
                {/* Image */}
                <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden mb-5 transition-colors duration-300 ${colors.imageBg}`}>
                  <img
                    src={b.imageUrl || b.image?.fullUrl || "/default-book.jpg"}
                    alt={pick(b.title, b.title_ar) || "Book"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/default-book.jpg";
                    }}
                  />
                  
                  {/* Pages Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 transition-colors duration-300
                    ${isNature 
                      ? 'bg-emerald-600 text-white' 
                      : isDark
                      ? 'bg-gray-800/90 text-gray-200'
                      : 'bg-white/95 text-gray-800'}`}>
                    <FileText className="w-3 h-3" />
                    {b.pages_count || 0} {lang === "ar" ? "صفحة" : "pages"}
                  </div>

                  {/* Book Badge - Nature only */}
                  {isNature && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-white/90 text-emerald-600 text-xs font-bold">
                      <BookMarked className="w-3 h-3 inline ml-1" />
                      {lang === "ar" ? "كتاب" : "Book"}
                    </div>
                  )}
                </div>

                {/* Title & Author */}
                <h3 className={`font-bold text-lg leading-snug transition-colors duration-300 ${
                  isDark ? 'text-gray-100' : isNature ? 'text-emerald-800' : 'text-gray-800'
                }`}>
                  {pick(b.title, b.title_ar) || "Book Title"}
                </h3>
                <p className={`mt-1 text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {lang === "ar" ? "تأليف" : "by"} {pick(b.writer, b.writer_ar) || "Author"}
                </p>

                {/* Price & Button */}
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className={`text-2xl font-black transition-colors duration-300 ${
                      isNature ? 'text-emerald-600' : isDark ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>
                      {b.price || "0"}
                    </div>
                    <div className={`text-[10px] font-medium transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>EGP</div>
                  </div>
                  <button
                    onClick={() => handleBuyBook(b.id, b.price, pick(b.title, b.title_ar))}
                    className={`px-4 py-2.5 rounded-2xl text-white font-semibold text-sm transition-all 
                      hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
                      ${isNature 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : isDark
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600'}`}
                  >
                    {lang === "ar" ? "اشتري الآن" : "Buy now"}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Modal الشراء */}
      {selectedBook && (
        <RedeemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          itemId={selectedBook.id}
          itemType="book"
          price={selectedBook.price}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};

// Skeleton Component - متوافق مع كل modes
const BooksSkeleton = ({ colors, isNature }: { colors: any; isNature: boolean }) => {
  return (
    <section className={`py-24 md:py-32 transition-colors duration-300 ${colors.bg}`}>
      <div className="container-tight">
        <div className="text-center mb-14">
          <div className={`h-8 w-32 rounded-full mx-auto mb-5 animate-pulse ${colors.skeleton}`} />
          <div className={`h-12 w-64 rounded-lg mx-auto animate-pulse ${colors.skeleton}`} />
          <div className={`h-6 w-96 rounded-lg mx-auto mt-4 animate-pulse ${colors.skeletonLight}`} />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-3xl p-6 animate-pulse ${colors.bgCard} ${colors.border}`}>
              <div className={`aspect-[3/4] rounded-2xl mb-5 animate-pulse ${colors.skeleton}`} />
              <div className={`h-6 rounded-lg mb-2 w-3/4 animate-pulse ${colors.skeleton}`} />
              <div className={`h-4 rounded-lg w-1/2 animate-pulse ${colors.skeletonLight}`} />
              <div className="mt-5 flex items-center justify-between">
                <div className={`h-8 w-16 rounded-lg animate-pulse ${colors.skeleton}`} />
                <div className={`h-10 w-28 rounded-2xl animate-pulse ${colors.skeleton}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;