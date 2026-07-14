/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/site/FeaturesGrid.tsx

import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import parse from 'html-react-parser';
import {
  Sparkles,
  GraduationCap,
  Rocket,
  BrainCircuit,
  ShieldCheck,
  Leaf,
  Flower2,
  Trees,
  BookOpen,
  PenTool,
  Lightbulb,
  Compass,
  Star,
  Zap,
  Target,
  Award,
  Gift,
  BookMarked,
  BarChart3,
  MessageCircle,
} from "lucide-react";

// ============================================
// ✅ أيقونات ثابتة
// ============================================

const DEFAULT_ICONS = [
  Gift, BookMarked, BarChart3, MessageCircle,
  GraduationCap, Rocket, BrainCircuit, ShieldCheck,
  Sparkles, Star, Zap, Target, Award,
  BookOpen, PenTool, Lightbulb, Compass,
];

const NATURE_ICONS = [
  Leaf, Flower2, Trees, Sparkles,
  Leaf, Flower2, Trees, Sparkles,
  Leaf, Flower2, Trees, Sparkles,
];

// ============================================
// ✅ Types
// ============================================

interface Feature {
  id: number | string;
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
  image?: {
    fullUrl: string;
    previewUrl?: string;
  };
  imageUrl?: string;
  active?: number | boolean;
  [key: string]: any;
}

interface FeaturesGridProps {
  features: Feature[];
  title?: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'nature' | 'minimal' | 'compact';
  showNumbers?: boolean;
  showImages?: boolean;
  imagePosition?: 'background' | 'icon' | 'both';
  className?: string;
  onFeatureClick?: (feature: Feature) => void;
}

// ============================================
// ✅ دالة مساعدة لاستخراج الصورة
// ============================================

const getFeatureImage = (feature: any): string | null => {
  if (!feature) return null;
  
  let imageUrl = feature.image?.fullUrl || 
                 feature.imageUrl || 
                 feature.image?.previewUrl || 
                 null;

  if (imageUrl) {
    const defaultPatterns = [
      'default-logo.png', 'default-avatar', 'default-image',
      'placeholder', 'no-image', 'default.png',
      'default.jpg', 'default.svg',
    ];
    
    const isDefaultImage = defaultPatterns.some(pattern => 
      imageUrl?.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (isDefaultImage) return null;
  }

  return imageUrl;
};

// ============================================
// ✅ Component لعرض HTML
// ============================================

const RenderHTML = ({ html, className = '' }: { html: string; className?: string }) => {
  if (!html) return null;
  return <div className={className}>{parse(html)}</div>;
};

// ============================================
// ✅ Feature Card - بدون Framer Motion
// ============================================

const FeatureCard = ({
  feature,
  index,
  lang,
  pick,
  variant,
  showNumbers,
  showImages,
  onClick,
  isNature,
}: {
  feature: Feature;
  index: number;
  lang: string;
  pick: (en: string, ar: string) => string;
  variant: FeaturesGridProps['variant'];
  showNumbers: boolean;
  showImages: boolean;
  onClick?: (feature: Feature) => void;
  isNature: boolean;
}) => {
  const imageUrl = getFeatureImage(feature);
  const icons = isNature ? NATURE_ICONS : DEFAULT_ICONS;
  const Icon = icons[index % icons.length];

  const nameHTML = pick(feature.name, feature.name_ar) || "Feature";
  const descriptionHTML = pick(feature.description, feature.description_ar) || "";

  // ✅ أنماط حسب الـ variant
  const variants = {
    default: {
      card: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/30 dark:border-gray-800/30 hover:border-emerald-300/50",
      icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
      title: "text-gray-900 dark:text-white",
      description: "text-gray-600 dark:text-gray-400",
      number: "text-gray-200/30 dark:text-gray-800/30",
      gradient: "from-emerald-500/20 to-blue-500/20",
      fallbackBg: "bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30",
    },
    nature: {
      card: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-amber-200/30 dark:border-amber-800/30 hover:border-amber-300/50",
      icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
      title: "text-gray-900 dark:text-white",
      description: "text-gray-600 dark:text-gray-400",
      number: "text-amber-200/30 dark:text-amber-800/30",
      gradient: "from-amber-500/20 to-orange-500/20",
      fallbackBg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    },
    minimal: {
      card: "bg-transparent border-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50",
      icon: "bg-transparent text-gray-700 dark:text-gray-300",
      title: "text-gray-900 dark:text-white",
      description: "text-gray-500 dark:text-gray-400",
      number: "text-gray-200/20 dark:text-gray-800/20",
      gradient: "from-gray-500/20 to-gray-500/20",
      fallbackBg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30",
    },
    compact: {
      card: "bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200/20 dark:border-gray-800/20 hover:border-emerald-300/30",
      icon: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
      title: "text-gray-900 dark:text-white text-lg",
      description: "text-gray-500 dark:text-gray-400 text-sm",
      number: "text-gray-200/20 dark:text-gray-800/20",
      gradient: "from-emerald-500/20 to-emerald-500/20",
      fallbackBg: "bg-gradient-to-br from-emerald-50/50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20",
    },
  };

  const style = variants[variant || 'default'];
  const skewDirection = index % 2 === 0 ? 'skew-y-2' : '-skew-y-2';
  const rotateDirection = index % 2 === 0 ? 'rotate-1' : '-rotate-1';

  const hasImage = showImages && imageUrl !== null;
  const backgroundClass = hasImage ? '' : style.fallbackBg;

  return (
    <div
      onClick={() => onClick?.(feature)}
      className={`group relative overflow-hidden rounded-[32px] transition-all duration-300 cursor-pointer 
        ${style.card} ${skewDirection} ${rotateDirection} ${backgroundClass}
        hover:-translate-y-3 hover:scale-[1.02]`}
    >
      {/* خلفية متدرجة */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* الصورة كخلفية */}
      {hasImage && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <img
            src={imageUrl!}
            alt={pick(feature.name, feature.name_ar) || "Feature"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            width={400}
            height={300}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-gray-950/90 to-transparent" />
        </div>
      )}

      <div className="relative z-10 p-8 min-h-[320px] flex flex-col justify-end">
        {/* الأيقونة */}
        <div className="mb-6">
          <div className={`flex items-center justify-center w-20 h-20 rounded-2xl ${style.icon} shadow-xl 
            group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
            <Icon className="w-10 h-10" />
          </div>
        </div>

        {/* العنوان */}
        <div className="feature-title-content font-black text-2xl md:text-3xl mb-3 
          group-hover:translate-x-2 transition-transform duration-300">
          <RenderHTML html={nameHTML} className={style.title} />
        </div>

        {/* الوصف */}
        <div className="feature-description-content leading-relaxed max-w-md 
          group-hover:translate-x-2 transition-transform duration-300 delay-75">
          <RenderHTML html={descriptionHTML} className={style.description} />
        </div>

        {/* الرقم */}
        {showNumbers && (
          <div className={`absolute bottom-5 right-5 text-8xl font-black ${style.number} 
            rotate-12 opacity-50 group-hover:opacity-100 transition-opacity duration-500`}>
            {String(index + 1).padStart(2, '0')}
          </div>
        )}

        {/* خط زخرفي */}
        <div className={`absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r ${style.gradient} 
          rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      </div>
    </div>
  );
};

// ============================================
// ✅ FeaturesGrid - بدون Framer Motion
// ============================================

export const FeaturesGrid = ({
  features,
  title,
  titleAr,
  subtitle,
  subtitleAr,
  columns = 4,
  variant = 'default',
  showNumbers = true,
  showImages = true,
  className = '',
  onFeatureClick,
}: FeaturesGridProps) => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isNature = theme === 'nature';

  const pick = (en: string, ar: string) => {
    return lang === 'ar' ? ar || en : en || ar;
  };

  if (!features || features.length === 0) {
    return null;
  }

  const columnsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`w-full relative ${className}`}>
      {/* خلفية مائلة */}
      <div className="absolute inset-0 -skew-y-3 bg-gradient-to-b from-transparent via-gray-50/50 dark:via-gray-900/50 to-transparent" />

      <div className="relative z-10">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16 -skew-y-1">
            {title && (
              <>
                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-4">
                  {lang === "ar" ? "🌟 مميزاتنا" : "🌟 Our Features"}
                </span>
                <h2 className="text-4xl md:text-6xl font-black mb-4">
                  <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {pick(title, titleAr || '')}
                  </span>
                </h2>
              </>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {pick(subtitle, subtitleAr || '')}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className={`grid grid-cols-1 ${columnsClass[columns]} gap-8 -skew-y-1`}>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id || index}
              feature={feature}
              index={index}
              lang={lang}
              pick={pick}
              variant={variant}
              showNumbers={showNumbers}
              showImages={showImages}
              onClick={onFeatureClick}
              isNature={isNature}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;