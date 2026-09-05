// src/pages/register/components/Step3Photo.tsx

import { Image, AlertCircle, CheckCircle } from 'lucide-react';
import FileUploader from '@/components/FileUploader';

interface Step3PhotoProps {
  image: string;
  lang: string;
  onUpload: (imageId: number) => void;
  onRemove: () => void;
}

export const Step3Photo = ({ image, lang, onUpload, onRemove }: Step3PhotoProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200 dark:border-emerald-800">
          <Image className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {lang === "ar" ? "📸 الصورة الشخصية" : "📸 Profile Picture"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {lang === "ar" ? "برجاء رفع صورتك الشخصية" : "Please upload your profile picture"}
        </p>
      </div>

      <FileUploader
        label={lang === "ar" ? "📸 تحميل الصورة الشخصية (مطلوبة)" : "📸 Upload Profile Picture (Required)"}
        onUploadSuccess={onUpload}
        multiple={false}
        accept="image/*"
        preview={true}
        uniqueId="profile-upload"
        maxFiles={1}
        defaultImageId={image ? parseInt(image) : null}
        onRemoveImage={onRemove}
        // required={true}
      />

      {!image && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {lang === "ar" ? "⚠️ الصورة الشخصية مطلوبة" : "⚠️ Profile picture is required"}
          </p>
        </div>
      )}

      {image && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {lang === "ar" ? "✅ تم رفع الصورة بنجاح" : "✅ Image uploaded successfully"}
          </p>
        </div>
      )}
    </div>
  );
};