/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useExamSubmission.ts - ✅ النسخة المعدلة
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export const useExamSubmission = (examId: number, studentId: number, answers: Record<number, any>) => {
  const queryClient = useQueryClient();
  const token = Cookies.get('student_token');
  
  return {
    submit: (onSuccess?: () => void, onError?: (error: any) => void) => {
      // ✅ تحويل الـ answers من object لـ array
      const answersArray = Object.keys(answers)
        .filter(key => answers[key] !== undefined && answers[key] !== null && answers[key] !== '')
        .map(key => ({
          question_id: parseInt(key),
          answer: answers[key]
        }));
      
      // ✅ لو مفيش إجابات، نرسل array فاضي
      if (answersArray.length === 0) {
        toast.warning(
          "⚠️ لا توجد إجابات للحفظ"
        );
        return;
      }
      
      const payload = {
        exam_id: examId,
        student_id: studentId,
        answers: answersArray
      };
      
      console.log("📝 Submitting exam payload:", payload);
      
      api.post('/exam/submit', payload)
        .then(response => {
          console.log("✅ Submit response:", response.data);
          
          // ✅ التحقق من النجاح
          const isSuccess = 
            response.data?.status === true || 
            response.data?.status === "success" || 
            response.data?.status === 200 || 
            response.data?.status === 201;
          
          if (isSuccess) {
            toast.success(response.data?.message || "تم تقديم الامتحان بنجاح! 🎉");
            queryClient.invalidateQueries({ queryKey: ['exam-result', examId, studentId] });
            queryClient.invalidateQueries({ queryKey: ['exam-questions', examId] });
            if (onSuccess) onSuccess();
          } else {
            toast.error(response.data?.message || "فشل تقديم الامتحان");
            if (onError) onError(response.data);
          }
        })
        .catch(error => {
          console.error("❌ Submit error:", error);
          
          // ✅ حتى لو error، نحاول نرسل الإجابات الفارغة عادي
          if (answersArray.length === 0) {
            toast.info("📝 تم حفظ الإجابات الفارغة");
            if (onSuccess) onSuccess();
            return;
          }
          
          toast.error(error.response?.data?.message || "حدث خطأ ما");
          if (onError) onError(error);
        });
    },
    isPending: false // ✅ نحذف الـ isPending عشان نتحكم فيه بنفسنا
  };
};