// src/components/lesson/LessonPage/components/LessonFiles.tsx

import { motion } from "framer-motion";
import { FolderOpen, FileText, ExternalLink, Download } from "lucide-react";

interface LessonFilesProps {
  driveLink?: string | null;
  pdfUrl?: string | null;
  lessonTitle?: string;
  lang: string;
}

const LessonFiles = ({ driveLink, pdfUrl, lessonTitle, lang }: LessonFilesProps) => {
  // ✅ تحقق أقل صرامة - اعرض الرابط لو موجود أيًا كان
  const hasDriveLink = !!driveLink && driveLink.trim() !== '';
  const hasPdfUrl = !!pdfUrl && pdfUrl.trim() !== '';

  console.log('📁 LessonFiles Debug:', { driveLink, pdfUrl, hasDriveLink, hasPdfUrl });

  // إذا لم يكن هناك أي رابط، لا نعرض شيئاً
  if (!hasDriveLink && !hasPdfUrl) return null;

  // ✅ دالة لفتح الـ PDF في تبويب جديد
  const openPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  // ✅ دالة لتحميل الـ PDF
  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${lessonTitle || 'file'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // ✅ دالة لفتح الـ Drive
  const openDrive = () => {
    if (driveLink) {
      window.open(driveLink, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <FolderOpen className="w-4 h-4 text-blue-500" />
        {lang === "ar" ? "ملفات إضافية" : "Additional Files"}
      </h4>
      <div className="flex flex-wrap gap-3">
        {/* ✅ زر Drive */}
        {hasDriveLink && (
          <button
            onClick={openDrive}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all text-sm font-medium"
          >
            <FolderOpen className="w-4 h-4" />
            {lang === "ar" ? "📁 فتح Drive" : "📁 Open Drive"}
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
        
        {/* ✅ زر PDF - فتح */}
        {hasPdfUrl && (
          <button
            onClick={openPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            {lang === "ar" ? "📄 فتح PDF" : "📄 Open PDF"}
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
        
        {/* ✅ زر PDF - تحميل */}
        {hasPdfUrl && (
          <button
            onClick={downloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-950/50 transition-all text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            {lang === "ar" ? "📥 تحميل PDF" : "📥 Download PDF"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default LessonFiles;