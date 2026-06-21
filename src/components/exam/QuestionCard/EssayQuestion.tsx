// features/exam/components/QuestionCard/EssayQuestion.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, XCircle, Loader2 } from 'lucide-react';
import FileUploader from '@/components/FileUploader';
import { toast } from '@/hooks/use-toast';
import { EssayAnswer } from '@/types/exam.types';
import api from '@/lib/api';

interface EssayQuestionProps {
  value: EssayAnswer | string;
  onChange: (value: EssayAnswer) => void;
  disabled?: boolean;
  lang: string;
  onImageUpload?: (imageId: number) => void;
  onRemoveImage?: (imageId: number) => void;
  essayImages?: number[];
}

// ✅ Hook لجلب بيانات الصورة من الـ API
const useMediaUrl = (mediaId: number) => {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!mediaId) return;
    
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/media/${mediaId}`);
        const data = response.data;
        if (data?.data?.fullUrl) {
          setUrl(data.data.fullUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [mediaId]);

  return { url, loading, error };
};

// ✅ مكون عرض الصورة مع Caching
const MediaDisplay = ({ mediaId, onRemove, disabled, lang }: { 
  mediaId: number; 
  onRemove: () => void; 
  disabled: boolean;
  lang: string;
}) => {
  const { url, loading, error } = useMediaUrl(mediaId);

  if (loading) {
    return (
      <div className="relative w-full h-20 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="relative w-full h-20 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center">
        <span className="text-xs text-red-500">❌ {lang === 'ar' ? 'خطأ في تحميل الصورة' : 'Error loading image'}</span>
        {!disabled && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <img 
        src={url} 
        alt={`Media ${mediaId}`}
        className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/default-image.jpg';
        }}
      />
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const EssayQuestion = ({
  value,
  onChange,
  disabled,
  lang,
  onImageUpload,
  onRemoveImage,
  essayImages = []
}: EssayQuestionProps) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedIds, setUploadedIds] = useState<number[]>([]);
  
  // استخراج النص والصور
  const answer = typeof value === 'object' && value !== null 
    ? value as EssayAnswer 
    : { text: value as string || '', images: [] };
  
  const { text, images } = answer;

  // ✅ مزامنة الـ images مع الـ essayImages
  useEffect(() => {
    if (essayImages.length > 0 && JSON.stringify(essayImages) !== JSON.stringify(images)) {
      onChange({ text: text || '', images: essayImages });
    }
  }, [essayImages]);

  const handleTextChange = (newText: string) => {
    onChange({ text: newText, images: images || [] });
  };

  const handleImageUpload = (imageId: number) => {
    if (onImageUpload) {
      onImageUpload(imageId);
    }
    setUploadedIds(prev => [...prev, imageId]);
    const newImages = [...(images || []), imageId];
    onChange({ text: text || '', images: newImages });
    toast.success(lang === "ar" ? "✅ تم رفع الصورة بنجاح" : "✅ Image uploaded successfully");
    setShowImageUpload(false);
  };

  const handleRemoveImage = (imageId: number) => {
    if (onRemoveImage) {
      onRemoveImage(imageId);
    }
    setUploadedIds(prev => prev.filter(id => id !== imageId));
    const newImages = (images || []).filter(id => id !== imageId);
    onChange({ text: text || '', images: newImages });
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text || ''}
        onChange={(e) => handleTextChange(e.target.value)}
        disabled={disabled}
        className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-y transition-all disabled:opacity-50"
        rows={6}
        placeholder={lang === "ar" ? "✍️ اكتب إجابتك بالتفصيل هنا..." : "✍️ Write your detailed answer here..."}
      />

      {/* Upload Button */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowImageUpload(!showImageUpload)}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon className="w-4 h-4" />
          {lang === "ar" ? "إضافة صورة" : "Add Image"}
        </button>

        {(images || []).length > 0 && (
          <span className="text-xs text-green-600 dark:text-green-400">
            ✅ {(images || []).length} {lang === "ar" ? "صورة مرفوعة" : "images uploaded"}
          </span>
        )}
      </div>

      {/* Image Uploader */}
      <AnimatePresence>
        {showImageUpload && !disabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <FileUploader
              label={lang === "ar" ? "📷 رفع صورة للإجابة" : "📷 Upload image for answer"}
              onUploadSuccess={(imageId: number) => {
                handleImageUpload(imageId);
              }}
              multiple={false}
              accept="image/*"
              preview={true}
              uniqueId={`essay-upload-${Date.now()}`}
              maxFiles={1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Display Images - باستخدام المكون الجديد */}
      {(images || []).length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {(images || []).map((imgId: number) => (
            <MediaDisplay
              key={imgId}
              mediaId={imgId}
              onRemove={() => handleRemoveImage(imgId)}
              disabled={disabled || false}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
};