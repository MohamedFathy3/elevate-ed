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

api.interceptors.request.use(
  (config) => {
    const studentToken = Cookies.get("student_token");
    const teacherToken = Cookies.get("token");
    
    if (studentToken) {
      config.headers.Authorization = `Bearer ${studentToken}`;
    } else if (teacherToken) {
      config.headers.Authorization = `Bearer ${teacherToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// معالجة 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("student_token");
      Cookies.remove("student_data");
      Cookies.remove("token");
      
      const slug = window.location.pathname.split('/')[1];
      if (slug && !window.location.pathname.includes('/login')) {
        window.location.href = `/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;