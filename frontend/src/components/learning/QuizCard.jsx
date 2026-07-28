import React, { useState, useEffect } from 'react';
import { HelpCircle, Check, X, Clock, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const QuizCard = ({ quizzes = [], onComplete }) => {
  const { showSuccess, showError } = useToast();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timerCount, setTimerCount] = useState(60); // 60s quiz timer placeholder

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimerCount(c => {
        if (c <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  if (quizzes.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-[10px] uppercase font-bold select-none bg-slate-50 border border-slate-200 rounded-2xl">
        No quiz questions loaded.
      </div>
    );
  }

  const activeQuiz = quizzes[currentIdx];

  const handleSelect = (optionIdx) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [activeQuiz._id]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentIdx < quizzes.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSkip = () => {
    setSelectedAnswers(prev => ({ ...prev, [activeQuiz._id]: -1 })); // -1 means skipped
    handleNext();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Calculate score
    let correctCount = 0;
    quizzes.forEach(q => {
      if (selectedAnswers[q._id] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / quizzes.length) * 100);
    showSuccess(`Quiz submitted! You got ${correctCount} of ${quizzes.length} questions correct (${scorePercent}%).`);
    
    if (onComplete) {
      onComplete(scorePercent);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentIdx(0);
    setTimerCount(60);
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-soft space-y-6 max-w-xl mx-auto select-none">
      
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shadow-sm shrink-0">
            <HelpCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Self-Assessment MCQ Quiz</h4>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Question {currentIdx + 1} of {quizzes.length}</span>
          </div>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-[10px] font-bold text-slate-600 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{submitted ? 'COMPLETED' : `${timerCount}s`}</span>
        </div>
      </div>

      {/* Question prompt block */}
      <div className="space-y-4">
        <h5 className="text-xs font-black text-slate-800 leading-relaxed uppercase tracking-wide">
          {activeQuiz.question}
        </h5>

        {/* Options list */}
        <div className="flex flex-col gap-2">
          {activeQuiz.options.map((opt, idx) => {
            const isSelected = selectedAnswers[activeQuiz._id] === idx;
            const isCorrect = idx === activeQuiz.correctIndex;
            const showCorrection = submitted;

            let btnClass = "border-slate-200 bg-white hover:bg-slate-50 text-slate-650 font-semibold";
            if (isSelected) {
              btnClass = "border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold shadow-sm";
            }

            if (showCorrection) {
              if (isCorrect) {
                btnClass = "border-emerald-200 bg-emerald-50 text-emerald-700 font-extrabold shadow-sm";
              } else if (isSelected) {
                btnClass = "border-rose-200 bg-rose-50 text-rose-700 font-extrabold shadow-sm";
              } else {
                btnClass = "border-slate-100 bg-white text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => handleSelect(idx)}
                className={`w-full px-4 py-3 rounded-xl border text-left text-[11px] transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
              >
                <span>{opt}</span>
                {showCorrection && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                {showCorrection && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pagination & controls footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-40 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
          >
            Prev
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIdx === quizzes.length - 1}
            className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-40 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!submitted ? (
            <>
              <button
                onClick={handleSkip}
                className="px-3 py-1.5 border border-transparent text-slate-400 hover:text-slate-650 text-[10px] font-bold uppercase cursor-pointer"
              >
                Skip
              </button>
              
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase rounded-xl transition-all shadow-glow cursor-pointer"
              >
                <span>Submit</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default QuizCard;
