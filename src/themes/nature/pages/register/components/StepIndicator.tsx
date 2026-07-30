// src/pages/register/components/StepIndicator.tsx

import { Step } from '../Register.types';

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  lang: string;
}

export const StepIndicator = ({ steps, currentStep, onStepClick, lang }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, idx) => (
        <div key={step.number} className="flex items-center gap-2">
          {idx > 0 && <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />}
          <div
            onClick={() => onStepClick(step.number)}
            className={`
              flex items-center gap-2 
              cursor-pointer transition-all duration-300 
              hover:scale-105
              ${currentStep === step.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300'}
            `}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold 
              transition-all duration-300
              ${currentStep === step.number 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                : currentStep > step.number 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/50' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}>
              {step.number}
            </div>
            <span className="text-sm hidden sm:inline font-medium">
              {lang === 'ar' ? step.label : step.labelEn}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};