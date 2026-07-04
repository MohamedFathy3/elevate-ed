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
  notSolved?: boolean;
}

export const useExamResults = (exams: any[], studentId: number) => {
  const [examResults, setExamResults] = useState<Record<number, any>>({});
  const [examStatuses, setExamStatuses] = useState<Record<number, ExamStatus>>({});
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    if (!exams.length || !studentId) {
      console.log('📢 [useExamResults] No exams or studentId');
      setLoadingExams(false);
      return;
    }

    const fetchAllExamResults = async () => {
      console.log('🔄 [useExamResults] Starting...');
      console.log('📋 Exams from lesson:', exams);
      
      setLoadingExams(true);
      const results: Record<number, any> = {};
      const statuses: Record<number, any> = {};

      for (const exam of exams) {
        console.log(`📝 Processing exam ${exam.id}: "${exam.title}"`);
        console.log(`   - student_solved: ${exam.student_solved}`);
        console.log(`   - student_passed: ${exam.student_passed}`);
        console.log(`   - student_passed_message: "${exam.student_passed_message}"`);
        console.log(`   - student_mark: ${exam.student_mark}`);
        
        // ✅ 1️⃣ لو الطالب محلش الامتحان
        if (exam.student_solved === false) {
          console.log(`   ⏳ NOT SOLVED YET`);
          statuses[exam.id] = {
            passed: false,
            failed: false,
            checked: false,
            locked: false,
            hidden: false,
            waitingResult: false,
            waitingCorrection: false,
            total: 0,
            passMarks: exam.total_must_pass_marks || 0,
            message: null,
            studentPassedMessage: null,
            showMessageOnly: false,
            notSolved: true
          };
          continue;
        }
        
        // ✅ 2️⃣ الطالب حل الامتحان
        try {
          const response = await fetch(`/api/exam/result/${exam.id}/${studentId}`);
          const data = await response.json();
          
          console.log(`✅ Response for exam ${exam.id}:`, data);
          results[exam.id] = data;
          
          // ✅ التحقق من النتيجة مخفية
          const isHidden = data?.message?.includes("hidden") || data?.status === false;
          
          if (isHidden) {
            console.log(`🔒 Exam ${exam.id} - Result is HIDDEN`);
            
            // ✅ نستخدم بيانات الـ exam من lesson API
            const studentPassed = exam.student_passed;
            const studentPassedMessage = exam.student_passed_message;
            const studentMark = exam.student_mark || 0;
            const passMarks = exam.total_must_pass_marks || 0;
            
            // ✅ التحقق من وجود رسالة
            const hasMessage = studentPassedMessage && 
                               studentPassedMessage !== "" && 
                               studentPassedMessage !== "null";
            
            console.log(`   📌 studentPassed: ${studentPassed}`);
            console.log(`   📌 studentPassedMessage: "${studentPassedMessage}"`);
            console.log(`   📌 hasMessage: ${hasMessage}`);
            
            if (hasMessage) {
              // ✅ في انتظار تصحيح - نعرض الرسالة فقط
              statuses[exam.id] = {
                passed: false,
                failed: false,
                checked: true,
                locked: true,
                hidden: true,
                waitingResult: true,
                waitingCorrection: true,
                total: studentMark,
                passMarks: passMarks,
                message: studentPassedMessage,
                studentPassedMessage: studentPassedMessage,
                showMessageOnly: true,
                notSolved: false
              };
            } else {
              // ✅ نتيجة مخفية بدون رسالة
              statuses[exam.id] = {
                passed: false,
                failed: false,
                checked: true,
                locked: true,
                hidden: true,
                waitingResult: true,
                waitingCorrection: false,
                total: 0,
                passMarks: passMarks,
                message: data?.message || "النتيجة مخفية من قبل المعلم",
                studentPassedMessage: null,
                showMessageOnly: false,
                notSolved: false
              };
            }
          } else {
            // ✅ النتيجة ظاهرة - نستخدم data من API
            const total = data.total || 0;
            const passMarks = exam.total_must_pass_marks || 0;
            const hasData = data.data && data.data.length > 0;
            
            // ✅ استخدام student_passed من lesson API إذا كان موجود
            const studentPassed = exam.student_passed;
            const studentPassedMessage = exam.student_passed_message;
            
            console.log(`📊 Exam ${exam.id}:`);
            console.log(`   - studentPassed from lesson: ${studentPassed}`);
            console.log(`   - data.passed: ${data.passed}`);
            console.log(`   - total: ${total}`);
            console.log(`   - passMarks: ${passMarks}`);
            
            let passed = false;
            let failed = false;
            let waitingResult = false;
            let waitingCorrection = false;
            let showMessageOnly = false;
            
            // ✅ إذا كان student_passed = null و student_passed_message موجود
            const hasMessage = studentPassed === null && 
                               studentPassedMessage && 
                               studentPassedMessage !== "" && 
                               studentPassedMessage !== "null";
            
            if (hasMessage) {
              // ✅ في انتظار تصحيح
              console.log(`   ℹ️ hasMessage = TRUE`);
              waitingCorrection = true;
              showMessageOnly = true;
              waitingResult = true;
              passed = false;
              failed = false;
            } else if (studentPassed === true || data.passed === true) {
              // ✅ نجح
              console.log(`   ✅ PASSED`);
              passed = true;
              failed = false;
            } else if (studentPassed === false || data.passed === false) {
              // ✅ فشل
              console.log(`   ❌ FAILED`);
              passed = false;
              failed = true;
            } else if (hasData) {
              // ✅ حساب من total
              passed = total >= passMarks;
              failed = !passed;
              console.log(`   📊 Calculated: passed=${passed}, failed=${failed}`);
            }
            
            statuses[exam.id] = {
              passed: passed,
              failed: failed,
              checked: hasData || false,
              locked: false,
              hidden: false,
              waitingResult: waitingResult,
              waitingCorrection: waitingCorrection,
              total: total || 0,
              passMarks: passMarks,
              message: studentPassedMessage || null,
              studentPassedMessage: studentPassedMessage || null,
              showMessageOnly: showMessageOnly,
              notSolved: false
            };
          }
          
        } catch (error: any) {
          console.error(`❌ Error fetching exam ${exam.id}:`, error);
          
          // ✅ في حالة أي خطأ، نستخدم بيانات الـ lesson
          const studentPassed = exam.student_passed;
          const studentPassedMessage = exam.student_passed_message;
          const studentMark = exam.student_mark || 0;
          const passMarks = exam.total_must_pass_marks || 0;
          
          const hasMessage = studentPassed === null && 
                             studentPassedMessage && 
                             studentPassedMessage !== "" && 
                             studentPassedMessage !== "null";
          
          let passed = false;
          let failed = false;
          let waitingResult = false;
          let waitingCorrection = false;
          let showMessageOnly = false;
          
          if (hasMessage) {
            waitingCorrection = true;
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
            showMessageOnly: showMessageOnly,
            notSolved: false
          };
        }
      }

      console.log('📊 Final statuses:', statuses);
      setExamResults(results);
      setExamStatuses(statuses);
      setLoadingExams(false);
    };

    fetchAllExamResults();
  }, [exams, studentId]);

  return { examResults, examStatuses, loadingExams, setExamStatuses };
};