// components/lesson/LessonNote.tsx
import React, { useState, useEffect } from 'react';
import { useLessonNote, useSaveLessonNote, useDeleteLessonNote } from '@/hooks/useLessonNote';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, 
  Save, 
  X, 
  Loader2, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/i18n/LanguageContext';

interface LessonNoteProps {
  lessonId: number;
  className?: string;
}

export const LessonNote: React.FC<LessonNoteProps> = ({ lessonId, className }) => {
  const { lang } = useLang();
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [initialNote, setInitialNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ✅ جلب الملاحظة
  const { data: noteData, isLoading, refetch } = useLessonNote(lessonId);
  
  // ✅ حفظ الملاحظة
  const { mutate: saveNote, isPending: isSavingNote } = useSaveLessonNote();
  
  // ✅ حذف الملاحظة
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteLessonNote();

  // ✅ تحميل البيانات
  useEffect(() => {
    if (noteData?.note) {
      setNoteText(noteData.note);
      setInitialNote(noteData.note);
    } else {
      setNoteText('');
      setInitialNote('');
    }
  }, [noteData]);

  // ✅ حفظ الملاحظة
  const handleSave = () => {
    if (!noteText.trim()) {
      // لو الملاحظة فاضية، نحذفها
      if (noteData?.id) {
        deleteNote(lessonId);
      }
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    saveNote(
      { lessonId, note: noteText.trim() },
      {
        onSuccess: () => {
          setIsSaving(false);
          setIsEditing(false);
          setInitialNote(noteText);
          refetch();
        },
        onError: () => {
          setIsSaving(false);
        },
      }
    );
  };

  // ✅ إلغاء التعديل
  const handleCancel = () => {
    setNoteText(initialNote);
    setIsEditing(false);
  };

  // ✅ حذف الملاحظة
  const handleDelete = () => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف الملاحظة؟' : 'Are you sure you want to delete this note?')) {
      deleteNote(lessonId, {
        onSuccess: () => {
          setNoteText('');
          setInitialNote('');
          setIsEditing(false);
          refetch();
        },
      });
    }
  };

  // ✅ بدء التعديل
  const handleEdit = () => {
    setIsEditing(true);
    // تركيز على الـ textarea
    setTimeout(() => {
      const textarea = document.getElementById('lesson-note-textarea');
      if (textarea) textarea.focus();
    }, 100);
  };

  // ✅ اختصار لوحة المفاتيح (Ctrl+S للحفظ)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (isEditing) {
          e.preventDefault();
          handleSave();
        }
      }
      if (e.key === 'Escape' && isEditing) {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, handleSave, handleCancel]);

  // ✅ حالة التحميل
  if (isLoading) {
    return (
      <div className={cn("p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700", className)}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {lang === 'ar' ? 'جاري تحميل الملاحظة...' : 'Loading note...'}
          </span>
        </div>
      </div>
    );
  }

  // ✅ لدينا ملاحظة ولسنا في وضع التعديل
  if (!isEditing && noteData?.note) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/50",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                {lang === 'ar' ? '📝 ملاحظتي' : '📝 My Note'}
              </span>
              <span className="text-[10px] text-amber-400 dark:text-amber-500">
                {new Date(noteData.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-300 whitespace-pre-wrap break-words">
              {noteData.note}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-200 dark:text-amber-400 dark:hover:bg-amber-800/30 transition-colors"
              title={lang === 'ar' ? 'تعديل' : 'Edit'}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
              title={lang === 'ar' ? 'حذف' : 'Delete'}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ✅ في وضع التعديل أو مفيش ملاحظة
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700",
        isEditing && "ring-2 ring-amber-500 dark:ring-amber-400",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {lang === 'ar' ? '📝 ملاحظة الدرس' : '📝 Lesson Note'}
          </span>
          {noteData?.note && (
            <span className="text-[10px] text-green-500 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">
              {lang === 'ar' ? 'محفوظة' : 'Saved'}
            </span>
          )}
        </div>
        {!isEditing && !noteData?.note && (
          <button
            onClick={handleEdit}
            className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {lang === 'ar' ? '+ إضافة ملاحظة' : '+ Add note'}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <textarea
              id="lesson-note-textarea"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب ملاحظتك هنا...' : 'Write your note here...'}
              className="w-full min-h-[80px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              disabled={isSaving || isSavingNote}
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || isSavingNote || !noteText.trim()}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all",
                    "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
                    "shadow-lg shadow-amber-500/25",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {(isSaving || isSavingNote) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {lang === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {lang === 'ar' ? 'حفظ' : 'Save'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving || isSavingNote}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500">
                {lang === 'ar' ? '⌘S للحفظ | ESC للإلغاء' : '⌘S to save | ESC to cancel'}
              </div>
            </div>
          </motion.div>
        ) : (
          // ✅ عرض الملاحظة المحفوظة
          noteData?.note && (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                {noteData.note}
              </p>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LessonNote;