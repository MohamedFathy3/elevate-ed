import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export const SplitText = ({ text, className = "", delay = 0 }: Props) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em] rtl:mr-0 rtl:ml-[0.25em]">
          {word.split("").map((ch, ci) => (
            <motion.span
              key={ci}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.7,
                delay: delay + (wi * 0.05) + ci * 0.025,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="inline-block"
              style={{ willChange: "transform" }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};
