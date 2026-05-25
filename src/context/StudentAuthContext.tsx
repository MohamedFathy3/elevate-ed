// context/StudentAuthContext.tsx
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";

interface Student {
  id: number;
  name: string;
  phone: string;
  phone_parent: string;
  code_parent: string;
  type_of_attendance: string | null;
  gender: string | null;
  active: boolean;
  teacher_id: number;
  stage_id: number;
  center_hour_id: number | null;
  joined_at: string | null;
  created_at: string;
}

interface StudentAuthContextValue {
  student: Student | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, studentData: Student) => void;
  logout: () => void;
  refetch: () => void;
}

const StudentAuthContext = createContext<StudentAuthContextValue | undefined>(undefined);

// دالة جلب بيانات الطالب من الـ API
const fetchStudentProfile = async (): Promise<Student> => {
  const response = await api.get('/student/check-auth');
  console.log("👤 Student profile response:", response.data);
  
  if (response.data.status === true && response.data.data) {
    return response.data.data;
  }
  throw new Error("Failed to fetch student profile");
};

export const StudentAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // التحقق من وجود توكن
  const token = Cookies.get('student_token');
  
  const { data: student, isLoading, error, refetch } = useQuery({
    queryKey: ['student-auth'],
    queryFn: fetchStudentProfile,
    enabled: !!token, // فقط لو فيه توكن
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setIsAuthenticated(!!student && !error);
  }, [student, error]);

  const login = (token: string, studentData: Student) => {
    Cookies.set('student_token', token, { expires: 7, secure: true, sameSite: 'Lax' });
    Cookies.set('student_data', JSON.stringify(studentData), { expires: 7 });
    setIsAuthenticated(true);
    queryClient.invalidateQueries({ queryKey: ['student-auth'] });
    queryClient.invalidateQueries({ queryKey: ['student-learning'] });
  };

  const logout = () => {
    Cookies.remove('student_token');
    Cookies.remove('student_data');
    setIsAuthenticated(false);
    queryClient.clear();
    
    // التوجيه لصفحة الرئيسية
    if (slug) {
      navigate(`/${slug}`);
    } else {
      navigate('/');
    }
  };

  return (
    <StudentAuthContext.Provider
      value={{
        student: student || null,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refetch,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error("useStudentAuth must be used within StudentAuthProvider");
  }
  return context;
};