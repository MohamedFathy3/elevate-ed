/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

interface AssignmentStatus {
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

export const useAssignmentResults = (assignments: any[], studentId: number) => {
  const [assignmentStatuses, setAssignmentStatuses] = useState<Record<number, AssignmentStatus>>({});
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  useEffect(() => {
    if (!assignments.length || !studentId) {
      setLoadingAssignments(false);
      return;
    }

    const fetchAllAssignmentResults = async () => {
      setLoadingAssignments(true);
      const statuses: Record<number, any> = {};

      for (const assignment of assignments) {
        try {
          const response = await fetch(`/api/exam/result/${assignment.id}/${studentId}`);
          const data = await response.json();
          
          const isHidden = data?.message?.includes("hidden") || data?.status === false;
          
          if (isHidden) {
            statuses[assignment.id] = {
              passed: false,
              failed: false,
              checked: true,
              locked: true,
              hidden: true,
              waitingResult: true,
              total: 0,
              passMarks: assignment.total_must_pass_marks || 0,
              message: data?.message || "النتيجة مخفية من قبل المعلم"
            };
          } else {
            const total = data.total || 0;
            const passMarks = assignment.total_must_pass_marks || 0;
            const hasData = data.data && data.data.length > 0;
            const passed = hasData && total >= passMarks;
            
            statuses[assignment.id] = {
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
            statuses[assignment.id] = {
              passed: false,
              failed: false,
              checked: true,
              locked: true,
              hidden: true,
              waitingResult: true,
              total: 0,
              passMarks: assignment.total_must_pass_marks || 0,
              message: "النتيجة مخفية من قبل المعلم"
            };
          } else {
            statuses[assignment.id] = {
              passed: false,
              failed: false,
              checked: false,
              locked: false,
              hidden: false,
              waitingResult: false,
              total: 0,
              passMarks: assignment.total_must_pass_marks || 0,
              message: null
            };
          }
        }
      }

      setAssignmentStatuses(statuses);
      setLoadingAssignments(false);
    };

    fetchAllAssignmentResults();
  }, [assignments, studentId]);

  return { assignmentStatuses, loadingAssignments };
};