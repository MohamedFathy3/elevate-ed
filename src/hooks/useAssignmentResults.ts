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
  notSolved?: boolean; // ✅ إضافة حالة "لم يحل"
}

export const useAssignmentResults = (assignments: any[], studentId: number) => {
  const [assignmentStatuses, setAssignmentStatuses] = useState<Record<number, AssignmentStatus>>({});
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  useEffect(() => {
    if (!assignments.length || !studentId) {
      console.log('📢 [useAssignmentResults] No assignments or studentId:', { 
        assignmentsLength: assignments.length, 
        studentId 
      });
      setLoadingAssignments(false);
      return;
    }

    const fetchAllAssignmentResults = async () => {
      console.log('🔄 [useAssignmentResults] Starting to fetch assignment results...');
      console.log('📋 [useAssignmentResults] Assignments from lesson:', assignments);
      
      setLoadingAssignments(true);
      const statuses: Record<number, any> = {};

      for (const assignment of assignments) {
        console.log(`📝 [useAssignmentResults] Processing assignment ID: ${assignment.id} - "${assignment.title}"`);
        console.log(`   - student_solved: ${assignment.student_solved}`);
        console.log(`   - student_passed: ${assignment.student_passed}`);
        console.log(`   - student_passed_message: "${assignment.student_passed_message}"`);
        console.log(`   - student_mark: ${assignment.student_mark}`);
        console.log(`   - total_must_pass_marks: ${assignment.total_must_pass_marks}`);
        
        // ✅ التحقق: لو الطالب محلش الواجب
        if (assignment.student_solved === false) {
          console.log(`   ⏳ Assignment ${assignment.id} - NOT SOLVED YET`);
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
            showMessageOnly: false,
            notSolved: true // ✅ علم بأن الطالب لم يحل
          };
          continue; // ✅ تخطي باقي المعالجة
        }
        
        try {
          // ✅ جلب نتيجة الواجب من API (لو الطالب حل)
          const response = await fetch(`/api/exam/result/${assignment.id}/${studentId}`);
          const data = await response.json();
          
          console.log(`✅ [useAssignmentResults] Response for assignment ${assignment.id}:`, data);
          
          // ✅ التحقق من أن النتيجة مخفية
          const isHidden = data?.message?.includes("hidden") || data?.status === false;
          console.log(`🔍 [useAssignmentResults] Assignment ${assignment.id} - isHidden:`, isHidden);
          
          if (isHidden) {
            console.log(`🔒 [useAssignmentResults] Assignment ${assignment.id} - Result is HIDDEN`);
            statuses[assignment.id] = {
              passed: false,
              failed: false,
              checked: true,
              locked: true,
              hidden: true,
              waitingResult: true,
              waitingCorrection: false,
              total: 0,
              passMarks: assignment.total_must_pass_marks || 0,
              message: data?.message || "النتيجة مخفية من قبل المعلم",
              studentPassedMessage: null,
              showMessageOnly: false,
              notSolved: false
            };
          } else {
            // ✅ استخدام بيانات الـ assignment من درس API
            const studentPassed = assignment.student_passed;
            const studentPassedMessage = assignment.student_passed_message;
            const studentMark = assignment.student_mark || 0;
            const passMarks = assignment.total_must_pass_marks || 0;
            
            // ✅ التحقق من وجود بيانات في نتيجة الواجب
            const hasResultData = data.data && data.data.length > 0;
            
            console.log(`📊 [useAssignmentResults] Assignment ${assignment.id}:`);
            console.log(`   - studentPassed from lesson: ${studentPassed} (${typeof studentPassed})`);
            console.log(`   - studentPassedMessage from lesson: "${studentPassedMessage}"`);
            console.log(`   - studentMark from lesson: ${studentMark}`);
            console.log(`   - passMarks: ${passMarks}`);
            console.log(`   - hasResultData: ${hasResultData}`);
            
            let passed = false;
            let failed = false;
            let waitingResult = false;
            let waitingCorrection = false;
            let showMessageOnly = false;
            
            // ✅ إذا كان student_passed = null و student_passed_message موجود
            const hasStudentPassedMessage = studentPassed === null && studentPassedMessage;
            
            if (hasStudentPassedMessage) {
              // ✅ في انتظار تصحيح أو أي رسالة أخرى - نعرض الرسالة فقط
              console.log(`   ℹ️ Assignment ${assignment.id} - hasStudentPassedMessage = TRUE`);
              waitingCorrection = studentPassedMessage?.includes("Waiting for essay correction") || false;
              showMessageOnly = true;
              passed = false;
              failed = false;
              waitingResult = true;
              console.log(`   📌 waitingCorrection: ${waitingCorrection}`);
              console.log(`   📌 showMessageOnly: ${showMessageOnly}`);
            } else if (studentPassed === true) {
              // ✅ نجح
              console.log(`   ✅ Assignment ${assignment.id} - PASSED (from lesson data)`);
              passed = true;
              failed = false;
            } else if (studentPassed === false) {
              // ✅ فشل
              console.log(`   ❌ Assignment ${assignment.id} - FAILED (from lesson data)`);
              passed = false;
              failed = true;
            } else if (hasResultData) {
              // ✅ لو في بيانات نتيجة ولم يحدد student_passed
              const total = data.total || 0;
              passed = total >= passMarks;
              failed = !passed;
              console.log(`   📊 Assignment ${assignment.id} - Calculated from result: passed=${passed}, failed=${failed}`);
            } else {
              // ✅ لم يحل الواجب بعد
              console.log(`   ⏳ Assignment ${assignment.id} - Not solved yet`);
              passed = false;
              failed = false;
              waitingResult = false;
            }
            
            statuses[assignment.id] = {
              passed: passed,
              failed: failed,
              checked: hasResultData || false,
              locked: false,
              hidden: false,
              waitingResult: waitingResult,
              waitingCorrection: waitingCorrection,
              total: studentMark || 0,
              passMarks: passMarks,
              message: studentPassedMessage || null,
              studentPassedMessage: studentPassedMessage || null,
              showMessageOnly: showMessageOnly,
              notSolved: false
            };
          }
          
        } catch (error: any) {
          console.error(`❌ [useAssignmentResults] Error fetching assignment ${assignment.id}:`, error);
          
          // ✅ حتى لو فشل الجلب، نستخدم بيانات الـ assignment من درس API
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
            showMessageOnly: showMessageOnly,
            notSolved: false
          };
        }
      }

      console.log('📊 [useAssignmentResults] Final statuses:', statuses);
      setAssignmentStatuses(statuses);
      setLoadingAssignments(false);
      console.log('✅ [useAssignmentResults] Finished fetching all assignment results');
    };

    fetchAllAssignmentResults();
  }, [assignments, studentId]);

  return { assignmentStatuses, loadingAssignments };
};