// features/exam/components/QuestionCard/TrueFalseQuestion.tsx
interface TrueFalseQuestionProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  lang: string;
}

export const TrueFalseQuestion = ({ value, onChange, disabled, lang }: TrueFalseQuestionProps) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onChange('true')}
        disabled={disabled}
        className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
          value === 'true' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
            : 'bg-gray-100 dark:bg-gray-800 text-foreground/70 hover:bg-primary/10'
        } disabled:opacity-50`}
      >
        ✅ {lang === "ar" ? "صحيح" : "True"}
      </button>
      <button
        onClick={() => onChange('false')}
        disabled={disabled}
        className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
          value === 'false' 
            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg' 
            : 'bg-gray-100 dark:bg-gray-800 text-foreground/70 hover:bg-primary/10'
        } disabled:opacity-50`}
      >
        ❌ {lang === "ar" ? "خطأ" : "False"}
      </button>
    </div>
  );
};