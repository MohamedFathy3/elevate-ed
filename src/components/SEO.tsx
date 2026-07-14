// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: string;
  keywords?: string;
  twitterCard?: string;
  favicon?: string;
  googleSiteVerification?: string; // ✅ إضافة الخاصية الجديدة
}

export const SEO = ({ 
  title = 'منصة التعليم أونلاين - تعلم مع أفضل المعلمين',
  description = 'منصة تعليمية توفر كورسات ودروس أونلاين في جميع المواد الدراسية مع نخبة من أفضل المعلمين. اشترك الآن وابدأ رحلة التعلم',
  image = '',
  url = '',
  siteName = 'منصة التعليم أونلاين',
  type = 'website',
  keywords = 'تعليم أونلاين, كورسات, دروس, مدرسين, منصة تعليمية, learning, online courses, education',
  twitterCard = 'summary_large_image',
  favicon = '',
  googleSiteVerification = '', // ✅ إضافة القيمة الافتراضية
}: SEOProps) => {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  return (
    <Helmet>
      {/* ✅ Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />
      
      {/* ✅ Google Site Verification - مهم جداً لجوجل */}
      {googleSiteVerification && (
        <meta name="google-site-verification" content={googleSiteVerification} />
      )}
      
      {/* ✅ Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* ✅ Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* ✅ Favicon */}
      {favicon && <link rel="icon" href={favicon} />}
      
      {/* ✅ SEO عام */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#10b981" />
    </Helmet>
  );
};