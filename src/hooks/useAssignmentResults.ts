/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

interface AssignmentStatus {
  passed: boolean;
  checked: boolean;
  locked: boolean;
  failed: boolean;
  hidden: boolean;
  waitingResult: boolean;
  waitingCorrection: boolean;
  total: number;
  passMarks: number;
  message?: string | null;
  studentPassedMessage?: string | null;
  showMessageOnly?: boolean;
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
          // ✅ استخدام بيانات الـ assignment من درس API مباشرة
          const studentPassed = assignment.student_passed;
          const studentPassedMessage = assignment.student_passed_message;
          const studentMark = assignment.student_mark || 0;
          const passMarks = assignment.total_must_pass_marks || 0;
          
          const hasStudentPassedMessage = studentPassed === null && studentPassedMessage;
          
          let passed = false;
          let failed = false;
          let waitingResult = false;
          let waitingCorrection = false;
          let showMessageOnly = false;
          
          if (hasStudentPassedMessage) {
            waitingCorrection = studentPassedMessage?.includes("Waiting for essay correction") || false;
            showMessageOnly = true;
            waitingResult = true;
          } else if (studentPassed === true) {
            passed = true;
          } else if (studentPassed === false) {
            failed = true;
          }
          
          statuses[assignment.id] = {
            passed: passed,
            failed: failed,
            checked: true,
            locked: false,
            hidden: false,
            waitingResult: waitingResult,
            waitingCorrection: waitingCorrection,
            total: studentMark || 0,
            passMarks: passMarks,
            message: studentPassedMessage || null,
            studentPassedMessage: studentPassedMessage || null,
            showMessageOnly: showMessageOnly
          };
          
        } catch (error: any) {
          console.error(`❌ [useAssignmentResults] Error processing assignment ${assignment.id}:`, error);
          statuses[assignment.id] = {
            passed: false,
            failed: false,
            checked: false,
            locked: false,
            hidden: false,
            waitingResult: false,
            waitingCorrection: false,
            total: 0,
            passMarks: assignment.total_must_pass_marks || 0,
            message: null,
            studentPassedMessage: null,
            showMessageOnly: false
          };
        }
      }

      setAssignmentStatuses(statuses);
      setLoadingAssignments(false);
    };

    fetchAllAssignmentResults();
  }, [assignments, studentId]);

  return { assignmentStatuses, loadingAssignments };
};