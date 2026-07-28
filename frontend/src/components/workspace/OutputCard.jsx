import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, HelpCircle, GraduationCap, Image, 
  Map, Check, X, RotateCw, AlertCircle, ArrowRight 
} from 'lucide-react';
import GlassCard from '../cards/GlassCard';

export const OutputCard = ({ type }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flashcardFlipped, setFlashcardFlipped] = useState({});

  // 1. Interactive Quiz Preview Mock
  const renderQuiz = () => {
    const questions = [
      {
        id: 1,
        question: 'Which organelle is responsible for cellular respiration?',
        options: ['Ribosome', 'Mitochondria', 'Golgi Apparatus', 'Lysosome'],
        correct: 1
      },
      {
        id: 2,
        question: 'What is the primary currency of cellular energy?',
        options: ['AMP', 'ADP', 'ATP', 'Glucose'],
        correct: 2
      }
    ];

    const handleAnswer = (qId, optionIdx) => {
      setSelectedAnswers(p => ({ ...p, [qId]: optionIdx }));
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] uppercase tracking-wide">
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Quiz Preview</span>
        </div>
        
        {questions.map((q) => {
          const selected = selectedAnswers[q.id];
          return (
            <div key={q.id} className="p-4 border border-slate-200 bg-slate-50/50 rounded-xl space-y-3 shadow-sm">
              <h5 className="text-xs font-bold text-slate-800 leading-snug">{q.question}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = idx === q.correct;
                  const showFeedback = selected !== undefined;

                  let btnClass = "border-slate-200 bg-white hover:bg-slate-50 text-slate-600";
                  if (showFeedback) {
                    if (isCorrect) btnClass = "border-emerald-200 bg-emerald-50 text-emerald-700 font-bold";
                    else if (isSelected) btnClass = "border-rose-200 bg-rose-50 text-rose-700 font-bold";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(q.id, idx)}
                      className={`px-3 py-2 text-left text-[10px] border rounded-lg transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                    >
                      <span>{opt}</span>
                      {showFeedback && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      {showFeedback && isSelected && !isCorrect && <X className="w-3.5 h-3.5 text-rose-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 2. Flip Flashcard Preview Mock
  const renderFlashcards = () => {
    const cards = [
      { id: 1, front: 'Aerobic Respiration', back: 'Respiration process requiring free oxygen, yielding high energy (ATP).' },
      { id: 2, front: 'Cristae', back: 'Foldings of the inner membrane of mitochondria that house electron transport chains.' }
    ];

    const toggleFlip = (id) => {
      setFlashcardFlipped(p => ({ ...p, [id]: !p[id] }));
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-purple-600 font-bold text-[10px] uppercase tracking-wide">
          <RotateCw className="w-4 h-4 animate-spin-slow" />
          <span>Interactive Flashcards</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => {
            const isFlipped = flashcardFlipped[card.id];
            return (
              <div 
                key={card.id}
                onClick={() => toggleFlip(card.id)}
                className="perspective-500 h-28 cursor-pointer select-none relative group"
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full transform-style-3d relative rounded-xl border border-slate-200 bg-white p-4 shadow-soft flex items-center justify-center text-center hover:border-indigo-400"
                >
                  {/* Front side */}
                  <div className={`backface-hidden absolute inset-0 p-4 flex flex-col items-center justify-center ${isFlipped ? 'hidden' : ''}`}>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2">Term</span>
                    <h5 className="text-xs font-black text-slate-800">{card.front}</h5>
                  </div>

                  {/* Back side */}
                  <div className={`backface-hidden absolute inset-0 p-4 flex flex-col items-center justify-center [transform:rotateY(180deg)] ${!isFlipped ? 'hidden' : ''}`}>
                    <span className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-wider mb-2">Definition</span>
                    <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">{card.back}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 3. Notes Summary Preview Mock
  const renderNotes = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] uppercase tracking-wide">
        <BookOpen className="w-4 h-4" />
        <span>Generated Concept Study Notes</span>
      </div>
      <div className="p-4 border border-slate-200 bg-white rounded-xl shadow-soft space-y-3">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Mitochondria Anatomy</h4>
        <ul className="list-disc pl-4 space-y-2 text-[10px] text-slate-500 font-semibold leading-relaxed">
          <li><strong>Mitochondrial DNA (mtDNA)</strong>: Inherited exclusively from maternal lines.</li>
          <li><strong>Intermembrane Space</strong>: Plays critical roles in proton concentration gradients during electron transports.</li>
          <li><strong>Cristae Expansion</strong>: Folding increases respiration reactions rates by 500%.</li>
        </ul>
      </div>
    </div>
  );

  // 4. Mindmap Schematic Graph Mock
  const renderMindmap = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-purple-600 font-bold text-[10px] uppercase tracking-wide">
        <Map className="w-4 h-4" />
        <span>Graphical Mind Map Schema</span>
      </div>
      <div className="border border-slate-200 bg-slate-50/50 p-6 rounded-xl flex items-center justify-center min-h-[160px] text-center shadow-soft">
        <div className="relative">
          <div className="px-4 py-2 border border-slate-200 bg-white rounded-xl shadow-sm text-xs font-extrabold text-slate-800">
            Cellular Organelles
            <div className="absolute -bottom-6 left-1/3 w-0.5 h-6 bg-slate-300" />
            <div className="absolute -bottom-6 right-1/3 w-0.5 h-6 bg-slate-300" />
          </div>
          <div className="flex items-center gap-6 mt-6">
            <div className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg shadow-sm text-[10px] font-semibold text-slate-500">Mitochondria</div>
            <div className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg shadow-sm text-[10px] font-semibold text-slate-500">Chloroplast</div>
          </div>
        </div>
      </div>
    </div>
  );

  // 5. Illustration / Images Grid mock
  const renderImages = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-fuchsia-600 font-bold text-[10px] uppercase tracking-wide">
        <Image className="w-4 h-4" />
        <span>Generated Creative Images</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="aspect-[4/3] rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center font-mono text-[9px] text-slate-400 font-bold">
          mitochondria_render_3d.png
        </div>
        <div className="aspect-[4/3] rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center font-mono text-[9px] text-slate-400 font-bold">
          cristae_detailed_schematic.png
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {type === 'quiz' && renderQuiz()}
      {type === 'flashcards' && renderFlashcards()}
      {type === 'notes' && renderNotes()}
      {type === 'mindmap' && renderMindmap()}
      {type === 'images' && renderImages()}
    </div>
  );
};

export default OutputCard;
