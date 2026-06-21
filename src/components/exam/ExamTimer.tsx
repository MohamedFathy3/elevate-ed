// features/exam/components/ExamTimer.tsx
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

export const ExamTimer = ({ timeLeft, formatTime }: ExamTimerProps) => {
  const isUrgent = timeLeft < 60;
  
  return (
    <motion.div 
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold ${
        isUrgent ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' : 'bg-primary/10 text-primary'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span>{formatTime(timeLeft)}</span>
    </motion.div>
  );
};