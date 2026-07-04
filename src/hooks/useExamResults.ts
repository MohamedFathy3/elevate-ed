/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

interface ExamStatus {
  passed: boolean;
  checked: boolean;
  locked: boolean;
  failed: boolean;
  hidden: boolean;
  waitingResult: boolean;
  total: number;
  passMarks: number;
  message?: string | null;
}

export const useExamResults = (exams: any[], studentId: number) => {
  const [examResults, setExamResults] = useState<Record<number, any>>({});
  const [examStatuses, setExamStatuses] = useState<Record<number, ExamStatus>>({});
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    if (!exams.length || !studentId) {
      setLoadingExams(false);
      return;
    }

    const fetchAllExamResults = async () => {
      setLoadingExams(true);
      const results: Record<number, any> = {};
      const statuses: Record<number, any> = {};

      for (const exam of exams) {
        try {
          const response = await fetch(`/api/exam/result/${exam.id}/${studentId}`);
          const data = await response.json();
          
          results[exam.id] = data;
          
          const isHidden = data?.message?.includes("hidden") || data?.status === false;
          
          if (isHidden) {
            statuses[exam.id] = {
              passed: false,
              failed: false,
              checked: true,
              locked: true,
              hidden: true,
              waitingResult: true,
              total: 0,
              passMarks: exam.total_must_pass_marks || 0,
              message: data?.message || "النتيجة مخفية من قبل المعلم"
            };
          } else {
            const total = data.total || 0;
            const passMarks = exam.total_must_pass_marks || 0;
            const hasData = data.data && data.data.length > 0;
            const passed = hasData && total >= passMarks;
            
            statuses[exam.id] = {
              passed: passed,
              failed: hasData && !passed,
              checked: hasData || false,
              locked: false,
              hidden: false,
              waitingResult: false,
              total: total,
              passMarks: passMarks,
              message: null
            };
          }
          
        } catch (error: any) {
          if (error.response?.status === 403) {
            statuses[exam.id] = {
              passed: false,
              failed: false,
              checked: true,
              locked: true,
              hidden: true,
              waitingResult: true,
              total: 0,
              passMarks: exam.total_must_pass_marks || 0,
              message: "النتيجة مخفية من قبل المعلم"
            };
          } else {
            statuses[exam.id] = {
              passed: false,
              failed: false,
              checked: false,
              locked: false,
              hidden: false,
              waitingResult: false,
              total: 0,
              passMarks: exam.total_must_pass_marks || 0,
              message: null
            };
          }
        }
      }

      setExamResults(results);
      setExamStatuses(statuses);
      setLoadingExams(false);
    };

    fetchAllExamResults();
  }, [exams, studentId]);

  return { examResults, examStatuses, loadingExams, setExamStatuses };
};