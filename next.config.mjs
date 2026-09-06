/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  // Keep dynamic metadata in the initial <head> for Google/Search Console and social crawlers.
  htmlLimitedBots: /Googlebot|Google-InspectionTool|AdsBot-Google|Mediapartners-Google|bingbot|facebookexternalhit|Twitterbot/i,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.web-lec.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
