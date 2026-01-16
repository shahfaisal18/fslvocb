
import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, RefreshCcw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onReset: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 leading-snug mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, i) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedOption;
            
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
            if (!isAnswered) {
              btnClass += "border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 active:scale-[0.98]";
            } else {
              if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-700";
              else if (isSelected) btnClass += "border-rose-500 bg-rose-50 text-rose-700";
              else btnClass += "border-slate-50 text-slate-400 opacity-50";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-green-600" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-rose-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Explanation: </span>
              {currentQuestion.explanation}
            </p>
            <button
              onClick={nextQuestion}
              className="mt-4 w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
