// features/exam/components/QuestionCard/MultipleChoiceQuestion.tsx
interface MultipleChoiceQuestionProps {
  options: { id: number; option_text: string }[];
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  lang: string;
}

export const MultipleChoiceQuestion = ({ options, value, onChange, disabled }: MultipleChoiceQuestionProps) => {
  return (
    <div className="grid gap-3">
      {options.map((opt, idx) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          disabled={disabled}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left ${
            value === opt.id 
              ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary/10'
          } disabled:opacity-50`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            value === opt.id ? 'bg-white text-primary' : 'bg-gray-300 dark:bg-gray-600 text-foreground/70'
          }`}>
            {String.fromCharCode(65 + idx)}
          </div>
          <span>{opt.option_text}</span>
        </button>
      ))}
    </div>
  );
};