/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Helper function for conditional logging
const isDev = (mode: string) => mode === "development";

const logOnlyDev = (mode: string, ...args: any[]) => {
  if (isDev(mode)) {
    console.log(...args);
  }
};

// Get environment variables with defaults
const getEnvVar = (key: string, defaultValue: string) => {
  return process.env[key] || defaultValue;
};

// Parse allowed hosts from env
const getAllowedHosts = (envHosts: string) => {
  return envHosts.split(',').map(host => host.trim());
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = isDev(mode);
  
  // Load environment variables
  const devServerHost = getEnvVar('VITE_DEV_SERVER_HOST', '::');
  const devServerPort = parseInt(getEnvVar('VITE_DEV_SERVER_PORT', '7000'));
  const previewServerHost = getEnvVar('VITE_PREVIEW_SERVER_HOST', '::');
  const previewServerPort = parseInt(getEnvVar('VITE_PREVIEW_SERVER_PORT', '9000'));
  
  const apiTarget = getEnvVar('VITE_API_TARGET', 'https://web-lec.com/');
  const apiRewritePath = getEnvVar('VITE_API_REWRITE_PATH', '/api');
  const apiHeaderName = getEnvVar('VITE_API_HEADER_NAME', 'X-Requested-With');
  const apiHeaderValue = getEnvVar('VITE_API_HEADER_VALUE', 'XMLHttpRequest');
  
  const sanctumTarget = getEnvVar('VITE_SANCTUM_TARGET', 'https://web-lec.com/');
  
  const allowedHostsEnv = getEnvVar('VITE_ALLOWED_HOSTS', 'dentin.cloud,localhost,127.0.0.1,::1,.dentin.cloud');
  const allowedHosts = getAllowedHosts(allowedHostsEnv);

  return {
    server: {
      host: devServerHost,
      port: devServerPort,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(new RegExp(`^/${apiRewritePath}`), apiRewritePath),
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              logOnlyDev(mode, "proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              logOnlyDev(mode, "Sending Request to the Target:", req.method, req.url);
              proxyReq.setHeader(apiHeaderName, apiHeaderValue);
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              logOnlyDev(mode, "Received Response from the Target:", proxyRes.statusCode, req.url);
              if (isDevelopment) {
                console.log("Response Headers:", proxyRes.headers);
              }
            });
          },
        },
        "/sanctum": {
          target: sanctumTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              logOnlyDev(mode, "sanctum proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              logOnlyDev(mode, "Sending Sanctum Request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              logOnlyDev(mode, "Sanctum Response Headers:", proxyRes.headers);
            });
          },
        },
      },
    },
    preview: {
      host: previewServerHost,
      port: previewServerPort,
      allowedHosts: allowedHosts,
    },
    plugins: [
      react(), 
      isDevelopment && componentTagger(),
 
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase'
      },
      preprocessorOptions: {
        css: {
          // إعدادات إضافية للـ CSS
        }
      }
    },
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
      'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
    },
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui': ['lucide-react'],
            'vendor-swiper': ['swiper'],
            'vendor-query': ['@tanstack/react-query'],
            'vendor-parser': ['html-react-parser'],
            'vendor-framer': ['framer-motion'],
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.match(/\.(png|jpg|jpeg|webp|svg|avif)$/)) {
              return 'assets/[name]-[hash].[ext]';
            }
            return 'assets/[name]-[hash].[ext]';
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      target: 'es2015',
      modulePreload: {
        polyfill: true,
      },
      assetsInlineLimit: 4096,
    },
  };
});