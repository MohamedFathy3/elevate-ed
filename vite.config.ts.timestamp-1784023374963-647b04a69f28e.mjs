// vite.config.ts
import { defineConfig } from "file:///D:/LMS/newlms/elevate-ed/node_modules/vite/dist/node/index.js";
import react from "file:///D:/LMS/newlms/elevate-ed/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/LMS/newlms/elevate-ed/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\LMS\\newlms\\elevate-ed";
var isDev = (mode) => mode === "development";
var logOnlyDev = (mode, ...args) => {
  if (isDev(mode)) {
    console.log(...args);
  }
};
var getEnvVar = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};
var getAllowedHosts = (envHosts) => {
  return envHosts.split(",").map((host) => host.trim());
};
var vite_config_default = defineConfig(({ mode }) => {
  const isDevelopment = isDev(mode);
  const devServerHost = getEnvVar("VITE_DEV_SERVER_HOST", "::");
  const devServerPort = parseInt(getEnvVar("VITE_DEV_SERVER_PORT", "7000"));
  const previewServerHost = getEnvVar("VITE_PREVIEW_SERVER_HOST", "::");
  const previewServerPort = parseInt(getEnvVar("VITE_PREVIEW_SERVER_PORT", "9000"));
  const apiTarget = getEnvVar("VITE_API_TARGET", "https://web-lec.com/");
  const apiRewritePath = getEnvVar("VITE_API_REWRITE_PATH", "/api");
  const apiHeaderName = getEnvVar("VITE_API_HEADER_NAME", "X-Requested-With");
  const apiHeaderValue = getEnvVar("VITE_API_HEADER_VALUE", "XMLHttpRequest");
  const sanctumTarget = getEnvVar("VITE_SANCTUM_TARGET", "https://web-lec.com/");
  const allowedHostsEnv = getEnvVar("VITE_ALLOWED_HOSTS", "dentin.cloud,localhost,127.0.0.1,::1,.dentin.cloud");
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
          rewrite: (path2) => path2.replace(new RegExp(`^/${apiRewritePath}`), apiRewritePath),
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
          }
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
          }
        }
      }
    },
    preview: {
      host: previewServerHost,
      port: previewServerPort,
      allowedHosts
    },
    plugins: [
      react(),
      isDevelopment && componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    css: {
      modules: {
        localsConvention: "camelCase"
      },
      preprocessorOptions: {
        css: {
          // إعدادات إضافية للـ CSS
        }
      }
    },
    define: {
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(process.env.npm_package_version),
      "import.meta.env.VITE_BUILD_TIME": JSON.stringify((/* @__PURE__ */ new Date()).toISOString())
    },
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log", "console.info", "console.debug"]
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-ui": ["lucide-react"],
            "vendor-swiper": ["swiper"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-parser": ["html-react-parser"],
            "vendor-framer": ["framer-motion"]
          },
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.match(/\.(png|jpg|jpeg|webp|svg|avif)$/)) {
              return "assets/[name]-[hash].[ext]";
            }
            return "assets/[name]-[hash].[ext]";
          }
        }
      },
      chunkSizeWarningLimit: 1e3,
      target: "es2015",
      modulePreload: {
        polyfill: true
      },
      assetsInlineLimit: 4096
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxMTVNcXFxcbmV3bG1zXFxcXGVsZXZhdGUtZWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXExNU1xcXFxuZXdsbXNcXFxcZWxldmF0ZS1lZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovTE1TL25ld2xtcy9lbGV2YXRlLWVkL3ZpdGUuY29uZmlnLnRzXCI7LyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIEhlbHBlciBmdW5jdGlvbiBmb3IgY29uZGl0aW9uYWwgbG9nZ2luZ1xyXG5jb25zdCBpc0RldiA9IChtb2RlOiBzdHJpbmcpID0+IG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIjtcclxuXHJcbmNvbnN0IGxvZ09ubHlEZXYgPSAobW9kZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gIGlmIChpc0Rldihtb2RlKSkge1xyXG4gICAgY29uc29sZS5sb2coLi4uYXJncyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IGVudmlyb25tZW50IHZhcmlhYmxlcyB3aXRoIGRlZmF1bHRzXHJcbmNvbnN0IGdldEVudlZhciA9IChrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBzdHJpbmcpID0+IHtcclxuICByZXR1cm4gcHJvY2Vzcy5lbnZba2V5XSB8fCBkZWZhdWx0VmFsdWU7XHJcbn07XHJcblxyXG4vLyBQYXJzZSBhbGxvd2VkIGhvc3RzIGZyb20gZW52XHJcbmNvbnN0IGdldEFsbG93ZWRIb3N0cyA9IChlbnZIb3N0czogc3RyaW5nKSA9PiB7XHJcbiAgcmV0dXJuIGVudkhvc3RzLnNwbGl0KCcsJykubWFwKGhvc3QgPT4gaG9zdC50cmltKCkpO1xyXG59O1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBpc0Rldihtb2RlKTtcclxuICBcclxuICAvLyBMb2FkIGVudmlyb25tZW50IHZhcmlhYmxlc1xyXG4gIGNvbnN0IGRldlNlcnZlckhvc3QgPSBnZXRFbnZWYXIoJ1ZJVEVfREVWX1NFUlZFUl9IT1NUJywgJzo6Jyk7XHJcbiAgY29uc3QgZGV2U2VydmVyUG9ydCA9IHBhcnNlSW50KGdldEVudlZhcignVklURV9ERVZfU0VSVkVSX1BPUlQnLCAnNzAwMCcpKTtcclxuICBjb25zdCBwcmV2aWV3U2VydmVySG9zdCA9IGdldEVudlZhcignVklURV9QUkVWSUVXX1NFUlZFUl9IT1NUJywgJzo6Jyk7XHJcbiAgY29uc3QgcHJldmlld1NlcnZlclBvcnQgPSBwYXJzZUludChnZXRFbnZWYXIoJ1ZJVEVfUFJFVklFV19TRVJWRVJfUE9SVCcsICc5MDAwJykpO1xyXG4gIFxyXG4gIGNvbnN0IGFwaVRhcmdldCA9IGdldEVudlZhcignVklURV9BUElfVEFSR0VUJywgJ2h0dHBzOi8vd2ViLWxlYy5jb20vJyk7XHJcbiAgY29uc3QgYXBpUmV3cml0ZVBhdGggPSBnZXRFbnZWYXIoJ1ZJVEVfQVBJX1JFV1JJVEVfUEFUSCcsICcvYXBpJyk7XHJcbiAgY29uc3QgYXBpSGVhZGVyTmFtZSA9IGdldEVudlZhcignVklURV9BUElfSEVBREVSX05BTUUnLCAnWC1SZXF1ZXN0ZWQtV2l0aCcpO1xyXG4gIGNvbnN0IGFwaUhlYWRlclZhbHVlID0gZ2V0RW52VmFyKCdWSVRFX0FQSV9IRUFERVJfVkFMVUUnLCAnWE1MSHR0cFJlcXVlc3QnKTtcclxuICBcclxuICBjb25zdCBzYW5jdHVtVGFyZ2V0ID0gZ2V0RW52VmFyKCdWSVRFX1NBTkNUVU1fVEFSR0VUJywgJ2h0dHBzOi8vd2ViLWxlYy5jb20vJyk7XHJcbiAgXHJcbiAgY29uc3QgYWxsb3dlZEhvc3RzRW52ID0gZ2V0RW52VmFyKCdWSVRFX0FMTE9XRURfSE9TVFMnLCAnZGVudGluLmNsb3VkLGxvY2FsaG9zdCwxMjcuMC4wLjEsOjoxLC5kZW50aW4uY2xvdWQnKTtcclxuICBjb25zdCBhbGxvd2VkSG9zdHMgPSBnZXRBbGxvd2VkSG9zdHMoYWxsb3dlZEhvc3RzRW52KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiBkZXZTZXJ2ZXJIb3N0LFxyXG4gICAgICBwb3J0OiBkZXZTZXJ2ZXJQb3J0LFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGFwaVRhcmdldCxcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4vJHthcGlSZXdyaXRlUGF0aH1gKSwgYXBpUmV3cml0ZVBhdGgpLFxyXG4gICAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIHByb3h5Lm9uKFwiZXJyb3JcIiwgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgIGxvZ09ubHlEZXYobW9kZSwgXCJwcm94eSBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcHJveHkub24oXCJwcm94eVJlcVwiLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgIGxvZ09ubHlEZXYobW9kZSwgXCJTZW5kaW5nIFJlcXVlc3QgdG8gdGhlIFRhcmdldDpcIiwgcmVxLm1ldGhvZCwgcmVxLnVybCk7XHJcbiAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKGFwaUhlYWRlck5hbWUsIGFwaUhlYWRlclZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHByb3h5Lm9uKFwicHJveHlSZXNcIiwgKHByb3h5UmVzLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICBsb2dPbmx5RGV2KG1vZGUsIFwiUmVjZWl2ZWQgUmVzcG9uc2UgZnJvbSB0aGUgVGFyZ2V0OlwiLCBwcm94eVJlcy5zdGF0dXNDb2RlLCByZXEudXJsKTtcclxuICAgICAgICAgICAgICBpZiAoaXNEZXZlbG9wbWVudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBIZWFkZXJzOlwiLCBwcm94eVJlcy5oZWFkZXJzKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiL3NhbmN0dW1cIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBzYW5jdHVtVGFyZ2V0LFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBwcm94eS5vbihcImVycm9yXCIsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICBsb2dPbmx5RGV2KG1vZGUsIFwic2FuY3R1bSBwcm94eSBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcHJveHkub24oXCJwcm94eVJlcVwiLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgIGxvZ09ubHlEZXYobW9kZSwgXCJTZW5kaW5nIFNhbmN0dW0gUmVxdWVzdDpcIiwgcmVxLm1ldGhvZCwgcmVxLnVybCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwcm94eS5vbihcInByb3h5UmVzXCIsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgbG9nT25seURldihtb2RlLCBcIlNhbmN0dW0gUmVzcG9uc2UgSGVhZGVyczpcIiwgcHJveHlSZXMuaGVhZGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHByZXZpZXc6IHtcclxuICAgICAgaG9zdDogcHJldmlld1NlcnZlckhvc3QsXHJcbiAgICAgIHBvcnQ6IHByZXZpZXdTZXJ2ZXJQb3J0LFxyXG4gICAgICBhbGxvd2VkSG9zdHM6IGFsbG93ZWRIb3N0cyxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHJlYWN0KCksIFxyXG4gICAgICBpc0RldmVsb3BtZW50ICYmIGNvbXBvbmVudFRhZ2dlcigpLFxyXG4gXHJcbiAgICBdLmZpbHRlcihCb29sZWFuKSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgbW9kdWxlczoge1xyXG4gICAgICAgIGxvY2Fsc0NvbnZlbnRpb246ICdjYW1lbENhc2UnXHJcbiAgICAgIH0sXHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBjc3M6IHtcclxuICAgICAgICAgIC8vIFx1MDYyNVx1MDYzOVx1MDYyRlx1MDYyN1x1MDYyRlx1MDYyN1x1MDYyQSBcdTA2MjVcdTA2MzZcdTA2MjdcdTA2NDFcdTA2NEFcdTA2MjkgXHUwNjQ0XHUwNjQ0XHUwNjQwIENTU1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBQX1ZFUlNJT04nOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKSxcclxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0JVSUxEX1RJTUUnOiBKU09OLnN0cmluZ2lmeShuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpLFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcclxuICAgICAgc291cmNlbWFwOiBmYWxzZSxcclxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcclxuICAgICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXHJcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxyXG4gICAgICAgICAgcHVyZV9mdW5jczogWydjb25zb2xlLmxvZycsICdjb25zb2xlLmluZm8nLCAnY29uc29sZS5kZWJ1ZyddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxyXG4gICAgICAgICAgICAndmVuZG9yLXVpJzogWydsdWNpZGUtcmVhY3QnXSxcclxuICAgICAgICAgICAgJ3ZlbmRvci1zd2lwZXInOiBbJ3N3aXBlciddLFxyXG4gICAgICAgICAgICAndmVuZG9yLXF1ZXJ5JzogWydAdGFuc3RhY2svcmVhY3QtcXVlcnknXSxcclxuICAgICAgICAgICAgJ3ZlbmRvci1wYXJzZXInOiBbJ2h0bWwtcmVhY3QtcGFyc2VyJ10sXHJcbiAgICAgICAgICAgICd2ZW5kb3ItZnJhbWVyJzogWydmcmFtZXItbW90aW9uJ10sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZT8ubWF0Y2goL1xcLihwbmd8anBnfGpwZWd8d2VicHxzdmd8YXZpZikkLykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLltleHRdJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLltleHRdJztcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxyXG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxyXG4gICAgICBtb2R1bGVQcmVsb2FkOiB7XHJcbiAgICAgICAgcG9seWZpbGw6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2LFxyXG4gICAgfSxcclxuICB9O1xyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUpoQyxJQUFNLG1DQUFt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LElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04saUJBQWlCLGdCQUFnQjtBQUFBLElBRW5DLEVBQUUsT0FBTyxPQUFPO0FBQUEsSUFDaEIsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1Asa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxNQUNBLHFCQUFxQjtBQUFBLFFBQ25CLEtBQUs7QUFBQTtBQUFBLFFBRUw7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sb0NBQW9DLEtBQUssVUFBVSxRQUFRLElBQUksbUJBQW1CO0FBQUEsTUFDbEYsbUNBQW1DLEtBQUssV0FBVSxvQkFBSSxLQUFLLEdBQUUsWUFBWSxDQUFDO0FBQUEsSUFDNUU7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLGNBQWM7QUFBQSxNQUNkLFdBQVc7QUFBQSxNQUNYLFFBQVE7QUFBQSxNQUNSLGVBQWU7QUFBQSxRQUNiLFVBQVU7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLGVBQWU7QUFBQSxVQUNmLFlBQVksQ0FBQyxlQUFlLGdCQUFnQixlQUFlO0FBQUEsUUFDN0Q7QUFBQSxNQUNGO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixjQUFjO0FBQUEsWUFDWixnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsWUFDekQsYUFBYSxDQUFDLGNBQWM7QUFBQSxZQUM1QixpQkFBaUIsQ0FBQyxRQUFRO0FBQUEsWUFDMUIsZ0JBQWdCLENBQUMsdUJBQXVCO0FBQUEsWUFDeEMsaUJBQWlCLENBQUMsbUJBQW1CO0FBQUEsWUFDckMsaUJBQWlCLENBQUMsZUFBZTtBQUFBLFVBQ25DO0FBQUEsVUFDQSxnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGdCQUFJLFVBQVUsTUFBTSxNQUFNLGlDQUFpQyxHQUFHO0FBQzVELHFCQUFPO0FBQUEsWUFDVDtBQUNBLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSx1QkFBdUI7QUFBQSxNQUN2QixRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsTUFDWjtBQUFBLE1BQ0EsbUJBQW1CO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
