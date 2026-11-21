import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import { RASOGOLLA_ICON } from "@/data/landmarks";

interface AnswerOptionsProps {
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  onChoose: (option: string) => void;
  correctText: string;
}

/** Three-choice answer list + feedback banner shared by Calcutta-Guesser and Calcutta-Quiz. */
export function AnswerOptions({ options, correctAnswer, selectedAnswer, onChoose, correctText }: AnswerOptionsProps) {
  const answeredCorrectly = selectedAnswer === correctAnswer;
  return (
    <>
      <div className="options-list" data-testid="answer-options">
        {options.map((option, optionIndex) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === correctAnswer;
          const stateClass = selectedAnswer === null ? "" : isCorrect ? " option-correct" : isSelected ? " option-wrong" : " option-muted";
          return (
            <motion.button
              key={option}
              type="button"
              className={`answer-option${stateClass}`}
              onClick={() => onChoose(option)}
              disabled={selectedAnswer !== null}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={selectedAnswer === null ? { scale: 0.98 } : undefined}
              transition={{ delay: optionIndex * 0.06, duration: 0.25 }}
              data-testid={`answer-option-${optionIndex}`}
            >
              <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
              <span className="option-text">{option}</span>
              {selectedAnswer !== null && isCorrect && <Check className="option-status" size={19} />}
              {selectedAnswer !== null && isSelected && !isCorrect && <X className="option-status" size={19} />}
              {selectedAnswer === null && <ArrowRight className="option-arrow" size={17} />}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {selectedAnswer !== null && (
          <motion.div
            className={`answer-feedback ${answeredCorrectly ? "feedback-correct" : "feedback-wrong"}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            data-testid="answer-feedback"
          >
            {answeredCorrectly ? <img src={RASOGOLLA_ICON} alt="" className="rasogolla-icon feedback-rasogolla" /> : <span className="feedback-icon"><X size={15} /></span>}
            <span>{answeredCorrectly ? correctText : `The answer was ${correctAnswer}.`}</span>
            <span className="feedback-next">Next <ArrowRight size={14} /></span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
