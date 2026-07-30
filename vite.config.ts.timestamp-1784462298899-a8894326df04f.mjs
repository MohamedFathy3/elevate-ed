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
  const allowedHostsEnv = getEnvVar("VITE_ALLOWED_HOSTS", "web-lec.com,localhost,127.0.0.1,::1,.dentin.cloud");
  const allowedHosts = [...getAllowedHosts(allowedHostsEnv), "mrteacherplanet.web-lec.com"];
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxMTVNcXFxcbmV3bG1zXFxcXGVsZXZhdGUtZWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXExNU1xcXFxuZXdsbXNcXFxcZWxldmF0ZS1lZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovTE1TL25ld2xtcy9lbGV2YXRlLWVkL3ZpdGUuY29uZmlnLnRzXCI7LyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIEhlbHBlciBmdW5jdGlvbiBmb3IgY29uZGl0aW9uYWwgbG9nZ2luZ1xyXG5jb25zdCBpc0RldiA9IChtb2RlOiBzdHJpbmcpID0+IG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIjtcclxuXHJcbmNvbnN0IGxvZ09ubHlEZXYgPSAobW9kZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gIGlmIChpc0Rldihtb2RlKSkge1xyXG4gICAgY29uc29sZS5sb2coLi4uYXJncyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IGVudmlyb25tZW50IHZhcmlhYmxlcyB3aXRoIGRlZmF1bHRzXHJcbmNvbnN0IGdldEVudlZhciA9IChrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBzdHJpbmcpID0+IHtcclxuICByZXR1cm4gcHJvY2Vzcy5lbnZba2V5XSB8fCBkZWZhdWx0VmFsdWU7XHJcbn07XHJcblxyXG4vLyBQYXJzZSBhbGxvd2VkIGhvc3RzIGZyb20gZW52XHJcbmNvbnN0IGdldEFsbG93ZWRIb3N0cyA9IChlbnZIb3N0czogc3RyaW5nKSA9PiB7XHJcbiAgcmV0dXJuIGVudkhvc3RzLnNwbGl0KCcsJykubWFwKGhvc3QgPT4gaG9zdC50cmltKCkpO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBpc0RldmVsb3BtZW50ID0gaXNEZXYobW9kZSk7XHJcbiAgXHJcbiAgLy8gTG9hZCBlbnZpcm9ubWVudCB2YXJpYWJsZXNcclxuICBjb25zdCBkZXZTZXJ2ZXJIb3N0ID0gZ2V0RW52VmFyKCdWSVRFX0RFVl9TRVJWRVJfSE9TVCcsICc6OicpO1xyXG4gIGNvbnN0IGRldlNlcnZlclBvcnQgPSBwYXJzZUludChnZXRFbnZWYXIoJ1ZJVEVfREVWX1NFUlZFUl9QT1JUJywgJzcwMDAnKSk7XHJcbiAgY29uc3QgcHJldmlld1NlcnZlckhvc3QgPSBnZXRFbnZWYXIoJ1ZJVEVfUFJFVklFV19TRVJWRVJfSE9TVCcsICc6OicpO1xyXG4gIGNvbnN0IHByZXZpZXdTZXJ2ZXJQb3J0ID0gcGFyc2VJbnQoZ2V0RW52VmFyKCdWSVRFX1BSRVZJRVdfU0VSVkVSX1BPUlQnLCAnOTAwMCcpKTtcclxuICBcclxuICBjb25zdCBhcGlUYXJnZXQgPSBnZXRFbnZWYXIoJ1ZJVEVfQVBJX1RBUkdFVCcsICdodHRwczovL3dlYi1sZWMuY29tLycpO1xyXG4gIGNvbnN0IGFwaVJld3JpdGVQYXRoID0gZ2V0RW52VmFyKCdWSVRFX0FQSV9SRVdSSVRFX1BBVEgnLCAnL2FwaScpO1xyXG4gIGNvbnN0IGFwaUhlYWRlck5hbWUgPSBnZXRFbnZWYXIoJ1ZJVEVfQVBJX0hFQURFUl9OQU1FJywgJ1gtUmVxdWVzdGVkLVdpdGgnKTtcclxuICBjb25zdCBhcGlIZWFkZXJWYWx1ZSA9IGdldEVudlZhcignVklURV9BUElfSEVBREVSX1ZBTFVFJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XHJcbiAgXHJcbiAgY29uc3Qgc2FuY3R1bVRhcmdldCA9IGdldEVudlZhcignVklURV9TQU5DVFVNX1RBUkdFVCcsICdodHRwczovL3dlYi1sZWMuY29tLycpO1xyXG4gIFxyXG5jb25zdCBhbGxvd2VkSG9zdHNFbnYgPSBnZXRFbnZWYXIoJ1ZJVEVfQUxMT1dFRF9IT1NUUycsICd3ZWItbGVjLmNvbSxsb2NhbGhvc3QsMTI3LjAuMC4xLDo6MSwuZGVudGluLmNsb3VkJyk7XHJcbmNvbnN0IGFsbG93ZWRIb3N0cyA9IFsuLi5nZXRBbGxvd2VkSG9zdHMoYWxsb3dlZEhvc3RzRW52KSwgJ21ydGVhY2hlcnBsYW5ldC53ZWItbGVjLmNvbSddO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIGhvc3Q6IGRldlNlcnZlckhvc3QsXHJcbiAgICAgIHBvcnQ6IGRldlNlcnZlclBvcnQsXHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICAgIHRhcmdldDogYXBpVGFyZ2V0LFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXi8ke2FwaVJld3JpdGVQYXRofWApLCBhcGlSZXdyaXRlUGF0aCksXHJcbiAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgcHJveHkub24oXCJlcnJvclwiLCAoZXJyLCBfcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgbG9nT25seURldihtb2RlLCBcInByb3h5IGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwcm94eS5vbihcInByb3h5UmVxXCIsIChwcm94eVJlcSwgcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgbG9nT25seURldihtb2RlLCBcIlNlbmRpbmcgUmVxdWVzdCB0byB0aGUgVGFyZ2V0OlwiLCByZXEubWV0aG9kLCByZXEudXJsKTtcclxuICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoYXBpSGVhZGVyTmFtZSwgYXBpSGVhZGVyVmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcHJveHkub24oXCJwcm94eVJlc1wiLCAocHJveHlSZXMsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgIGxvZ09ubHlEZXYobW9kZSwgXCJSZWNlaXZlZCBSZXNwb25zZSBmcm9tIHRoZSBUYXJnZXQ6XCIsIHByb3h5UmVzLnN0YXR1c0NvZGUsIHJlcS51cmwpO1xyXG4gICAgICAgICAgICAgIGlmIChpc0RldmVsb3BtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIEhlYWRlcnM6XCIsIHByb3h5UmVzLmhlYWRlcnMpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCIvc2FuY3R1bVwiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IHNhbmN0dW1UYXJnZXQsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIHByb3h5Lm9uKFwiZXJyb3JcIiwgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgIGxvZ09ubHlEZXYobW9kZSwgXCJzYW5jdHVtIHByb3h5IGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwcm94eS5vbihcInByb3h5UmVxXCIsIChwcm94eVJlcSwgcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgbG9nT25seURldihtb2RlLCBcIlNlbmRpbmcgU2FuY3R1bSBSZXF1ZXN0OlwiLCByZXEubWV0aG9kLCByZXEudXJsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHByb3h5Lm9uKFwicHJveHlSZXNcIiwgKHByb3h5UmVzLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICBsb2dPbmx5RGV2KG1vZGUsIFwiU2FuY3R1bSBSZXNwb25zZSBIZWFkZXJzOlwiLCBwcm94eVJlcy5oZWFkZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcHJldmlldzoge1xyXG4gICAgICBob3N0OiBwcmV2aWV3U2VydmVySG9zdCxcclxuICAgICAgcG9ydDogcHJldmlld1NlcnZlclBvcnQsXHJcbiAgICAgIGFsbG93ZWRIb3N0czogYWxsb3dlZEhvc3RzLFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgcmVhY3QoKSwgXHJcbiAgICAgIGlzRGV2ZWxvcG1lbnQgJiYgY29tcG9uZW50VGFnZ2VyKCksXHJcbiBcclxuICAgIF0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICBtb2R1bGVzOiB7XHJcbiAgICAgICAgbG9jYWxzQ29udmVudGlvbjogJ2NhbWVsQ2FzZSdcclxuICAgICAgfSxcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIGNzczoge1xyXG4gICAgICAgICAgLy8gXHUwNjI1XHUwNjM5XHUwNjJGXHUwNjI3XHUwNjJGXHUwNjI3XHUwNjJBIFx1MDYyNVx1MDYzNlx1MDYyN1x1MDY0MVx1MDY0QVx1MDYyOSBcdTA2NDRcdTA2NDRcdTA2NDAgQ1NTXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9BUFBfVkVSU0lPTic6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24pLFxyXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQlVJTERfVElNRSc6IEpTT04uc3RyaW5naWZ5KG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSksXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLFxyXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXHJcbiAgICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUuaW5mbycsICdjb25zb2xlLmRlYnVnJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgICd2ZW5kb3ItcmVhY3QnOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICAgICd2ZW5kb3ItdWknOiBbJ2x1Y2lkZS1yZWFjdCddLFxyXG4gICAgICAgICAgICAndmVuZG9yLXN3aXBlcic6IFsnc3dpcGVyJ10sXHJcbiAgICAgICAgICAgICd2ZW5kb3ItcXVlcnknOiBbJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSddLFxyXG4gICAgICAgICAgICAndmVuZG9yLXBhcnNlcic6IFsnaHRtbC1yZWFjdC1wYXJzZXInXSxcclxuICAgICAgICAgICAgJ3ZlbmRvci1mcmFtZXInOiBbJ2ZyYW1lci1tb3Rpb24nXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcclxuICAgICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lPy5tYXRjaCgvXFwuKHBuZ3xqcGd8anBlZ3x3ZWJwfHN2Z3xhdmlmKSQvKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXHJcbiAgICAgIHRhcmdldDogJ2VzMjAxNScsXHJcbiAgICAgIG1vZHVsZVByZWxvYWQ6IHtcclxuICAgICAgICBwb2x5ZmlsbDogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSmhDLElBQU0sbUNBQW1DO0FBT3pDLElBQU0sUUFBUSxDQUFDLFNBQWlCLFNBQVM7QUFFekMsSUFBTSxhQUFhLENBQUMsU0FBaUIsU0FBZ0I7QUFDbkQsTUFBSSxNQUFNLElBQUksR0FBRztBQUNmLFlBQVEsSUFBSSxHQUFHLElBQUk7QUFBQSxFQUNyQjtBQUNGO0FBR0EsSUFBTSxZQUFZLENBQUMsS0FBYSxpQkFBeUI7QUFDdkQsU0FBTyxRQUFRLElBQUksR0FBRyxLQUFLO0FBQzdCO0FBR0EsSUFBTSxrQkFBa0IsQ0FBQyxhQUFxQjtBQUM1QyxTQUFPLFNBQVMsTUFBTSxHQUFHLEVBQUUsSUFBSSxVQUFRLEtBQUssS0FBSyxDQUFDO0FBQ3BEO0FBR0EsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxnQkFBZ0IsTUFBTSxJQUFJO0FBR2hDLFFBQU0sZ0JBQWdCLFVBQVUsd0JBQXdCLElBQUk7QUFDNUQsUUFBTSxnQkFBZ0IsU0FBUyxVQUFVLHdCQUF3QixNQUFNLENBQUM7QUFDeEUsUUFBTSxvQkFBb0IsVUFBVSw0QkFBNEIsSUFBSTtBQUNwRSxRQUFNLG9CQUFvQixTQUFTLFVBQVUsNEJBQTRCLE1BQU0sQ0FBQztBQUVoRixRQUFNLFlBQVksVUFBVSxtQkFBbUIsc0JBQXNCO0FBQ3JFLFFBQU0saUJBQWlCLFVBQVUseUJBQXlCLE1BQU07QUFDaEUsUUFBTSxnQkFBZ0IsVUFBVSx3QkFBd0Isa0JBQWtCO0FBQzFFLFFBQU0saUJBQWlCLFVBQVUseUJBQXlCLGdCQUFnQjtBQUUxRSxRQUFNLGdCQUFnQixVQUFVLHVCQUF1QixzQkFBc0I7QUFFL0UsUUFBTSxrQkFBa0IsVUFBVSxzQkFBc0IsbURBQW1EO0FBQzNHLFFBQU0sZUFBZSxDQUFDLEdBQUcsZ0JBQWdCLGVBQWUsR0FBRyw2QkFBNkI7QUFFdEYsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFVBQ1IsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssY0FBYyxFQUFFLEdBQUcsY0FBYztBQUFBLFVBQ2pGLFdBQVcsQ0FBQyxPQUFPLGFBQWE7QUFDOUIsa0JBQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxNQUFNLFNBQVM7QUFDckMseUJBQVcsTUFBTSxlQUFlLEdBQUc7QUFBQSxZQUNyQyxDQUFDO0FBQ0Qsa0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFNBQVM7QUFDNUMseUJBQVcsTUFBTSxrQ0FBa0MsSUFBSSxRQUFRLElBQUksR0FBRztBQUN0RSx1QkFBUyxVQUFVLGVBQWUsY0FBYztBQUFBLFlBQ2xELENBQUM7QUFDRCxrQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssU0FBUztBQUM1Qyx5QkFBVyxNQUFNLHNDQUFzQyxTQUFTLFlBQVksSUFBSSxHQUFHO0FBQ25GLGtCQUFJLGVBQWU7QUFDakIsd0JBQVEsSUFBSSxxQkFBcUIsU0FBUyxPQUFPO0FBQUEsY0FDbkQ7QUFBQSxZQUNGLENBQUM7QUFBQSxVQUNIO0FBQUEsUUFDRjtBQUFBLFFBQ0EsWUFBWTtBQUFBLFVBQ1YsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFVBQ1IsV0FBVyxDQUFDLE9BQU8sYUFBYTtBQUM5QixrQkFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLE1BQU0sU0FBUztBQUNyQyx5QkFBVyxNQUFNLHVCQUF1QixHQUFHO0FBQUEsWUFDN0MsQ0FBQztBQUNELGtCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTO0FBQzVDLHlCQUFXLE1BQU0sNEJBQTRCLElBQUksUUFBUSxJQUFJLEdBQUc7QUFBQSxZQUNsRSxDQUFDO0FBQ0Qsa0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFNBQVM7QUFDNUMseUJBQVcsTUFBTSw2QkFBNkIsU0FBUyxPQUFPO0FBQUEsWUFDaEUsQ0FBQztBQUFBLFVBQ0g7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04saUJBQWlCLGdCQUFnQjtBQUFBLElBRW5DLEVBQUUsT0FBTyxPQUFPO0FBQUEsSUFDaEIsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1Asa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxNQUNBLHFCQUFxQjtBQUFBLFFBQ25CLEtBQUs7QUFBQTtBQUFBLFFBRUw7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sb0NBQW9DLEtBQUssVUFBVSxRQUFRLElBQUksbUJBQW1CO0FBQUEsTUFDbEYsbUNBQW1DLEtBQUssV0FBVSxvQkFBSSxLQUFLLEdBQUUsWUFBWSxDQUFDO0FBQUEsSUFDNUU7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLGNBQWM7QUFBQSxNQUNkLFdBQVc7QUFBQSxNQUNYLFFBQVE7QUFBQSxNQUNSLGVBQWU7QUFBQSxRQUNiLFVBQVU7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLGVBQWU7QUFBQSxVQUNmLFlBQVksQ0FBQyxlQUFlLGdCQUFnQixlQUFlO0FBQUEsUUFDN0Q7QUFBQSxNQUNGO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixjQUFjO0FBQUEsWUFDWixnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsWUFDekQsYUFBYSxDQUFDLGNBQWM7QUFBQSxZQUM1QixpQkFBaUIsQ0FBQyxRQUFRO0FBQUEsWUFDMUIsZ0JBQWdCLENBQUMsdUJBQXVCO0FBQUEsWUFDeEMsaUJBQWlCLENBQUMsbUJBQW1CO0FBQUEsWUFDckMsaUJBQWlCLENBQUMsZUFBZTtBQUFBLFVBQ25DO0FBQUEsVUFDQSxnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGdCQUFJLFVBQVUsTUFBTSxNQUFNLGlDQUFpQyxHQUFHO0FBQzVELHFCQUFPO0FBQUEsWUFDVDtBQUNBLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSx1QkFBdUI7QUFBQSxNQUN2QixRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsTUFDWjtBQUFBLE1BQ0EsbUJBQW1CO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
