/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

interface ExamStatus {
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

export const useExamResults = (exams: any[], studentId: number) => {
  const [examResults, setExamResults] = useState<Record<number, any>>({});
  const [examStatuses, setExamStatuses] = useState<Record<number, ExamStatus>>({});
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    if (!exams.length || !studentId) {
      console.log('📢 [useExamResults] No exams or studentId:', { examsLength: exams.length, studentId });
      setLoadingExams(false);
      return;
    }

    const fetchAllExamResults = async () => {
      console.log('🔄 [useExamResults] Starting to fetch exam results...');
      console.log('📋 [useExamResults] Exams from lesson:', exams);
      console.log('👤 [useExamResults] Student ID:', studentId);
      
      setLoadingExams(true);
      const results: Record<number, any> = {};
      const statuses: Record<number, any> = {};

      for (const exam of exams) {
        console.log(`📝 [useExamResults] Processing exam ID: ${exam.id} - "${exam.title}"`);
        console.log(`   - student_passed: ${exam.student_passed}`);
        console.log(`   - student_passed_message: "${exam.student_passed_message}"`);
        console.log(`   - student_mark: ${exam.student_mark}`);
        console.log(`   - total_must_pass_marks: ${exam.total_must_pass_marks}`);
        
        try {
          // ✅ جلب نتيجة الامتحان من API
          const response = await fetch(`/api/exam/result/${exam.id}/${studentId}`);
          const data = await response.json();
          
          console.log(`✅ [useExamResults] Response for exam ${exam.id}:`, data);
          
          results[exam.id] = data;
          
          // ✅ التحقق من أن النتيجة مخفية
          const isHidden = data?.message?.includes("hidden") || data?.status === false;
          console.log(`🔍 [useExamResults] Exam ${exam.id} - isHidden:`, isHidden);
          
          if (isHidden) {
            console.log(`🔒 [useExamResults] Exam ${exam.id} - Result is HIDDEN`);
            statuses[exam.id] = {
              passed: false,
              failed: false,
              checked: true,
              locked: true,
              hidden: true,
              waitingResult: true,
              waitingCorrection: false,
              total: 0,
              passMarks: exam.total_must_pass_marks || 0,
              message: data?.message || "النتيجة مخفية من قبل المعلم",
              studentPassedMessage: null,
              showMessageOnly: false
            };
          } else {
            // ✅ استخدام بيانات الـ exam من درس API
            const studentPassed = exam.student_passed;
            const studentPassedMessage = exam.student_passed_message;
            const studentMark = exam.student_mark || 0;
            const passMarks = exam.total_must_pass_marks || 0;
            
            // ✅ التحقق من وجود بيانات في نتيجة الامتحان
            const hasResultData = data.data && data.data.length > 0;
            
            console.log(`📊 [useExamResults] Exam ${exam.id}:`);
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
              console.log(`   ℹ️ Exam ${exam.id} - hasStudentPassedMessage = TRUE`);
              waitingCorrection = studentPassedMessage?.includes("Waiting for essay correction") || false;
              showMessageOnly = true;
              passed = false;
              failed = false;
              waitingResult = true;
              console.log(`   📌 waitingCorrection: ${waitingCorrection}`);
              console.log(`   📌 showMessageOnly: ${showMessageOnly}`);
            } else if (studentPassed === true) {
              // ✅ نجح
              console.log(`   ✅ Exam ${exam.id} - PASSED (from lesson data)`);
              passed = true;
              failed = false;
            } else if (studentPassed === false) {
              // ✅ فشل
              console.log(`   ❌ Exam ${exam.id} - FAILED (from lesson data)`);
              passed = false;
              failed = true;
            } else if (hasResultData) {
              // ✅ لو في بيانات نتيجة ولم يحدد student_passed
              const total = data.total || 0;
              passed = total >= passMarks;
              failed = !passed;
              console.log(`   📊 Exam ${exam.id} - Calculated from result: passed=${passed}, failed=${failed}`);
            } else {
              // ✅ لم يحل الامتحان بعد
              console.log(`   ⏳ Exam ${exam.id} - Not solved yet`);
              passed = false;
              failed = false;
              waitingResult = false;
            }
            
            statuses[exam.id] = {
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
              showMessageOnly: showMessageOnly
            };
          }
          
        } catch (error: any) {
          console.error(`❌ [useExamResults] Error fetching exam ${exam.id}:`, error);
          
          // ✅ حتى لو فشل الجلب، نستخدم بيانات الـ exam من درس API
          const studentPassed = exam.student_passed;
          const studentPassedMessage = exam.student_passed_message;
          const studentMark = exam.student_mark || 0;
          const passMarks = exam.total_must_pass_marks || 0;
          
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
          
          statuses[exam.id] = {
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
        }
      }

      console.log('📊 [useExamResults] Final statuses:', statuses);
      setExamResults(results);
      setExamStatuses(statuses);
      setLoadingExams(false);
      console.log('✅ [useExamResults] Finished fetching all exam results');
    };

    fetchAllExamResults();
  }, [exams, studentId]);

  return { examResults, examStatuses, loadingExams, setExamStatuses };
};