// lib/api.ts - أضف interceptor لإضافة التوكن
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true, 
});

// ✅ إضافة التوكن تلقائياً لكل request
api.interceptors.request.use(
  (config) => {
    // جلب التوكن من cookies
    const studentToken = Cookies.get("student_token");
    const teacherToken = Cookies.get("token");
    
    // إضافة التوكن في header Authorization
    if (studentToken) {
      config.headers.Authorization = `Bearer ${studentToken}`;
      console.log("🔐 Student token added to request");
    } else if (teacherToken) {
      config.headers.Authorization = `Bearer ${teacherToken}`;
      console.log("🔐 Teacher token added to request");
    }
    
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// معالجة 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("🔐 Unauthorized - redirecting to login");
      Cookies.remove("student_token");
      Cookies.remove("student_data");
      Cookies.remove("token");
      
      const slug = window.location.pathname.split('/')[1];
      if (slug && !window.location.pathname.includes('/login')) {
        window.location.href = `/${slug}/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;