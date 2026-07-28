import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, Star, Bookmark, BadgeAlert } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const FlashcardDeck = ({ cards = [] }) => {
  const { showSuccess } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [difficultyMap, setDifficultyMap] = useState({});
  const [bookmarkedMap, setBookmarkedMap] = useState({});

  if (cards.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-[10px] uppercase font-bold select-none bg-slate-50 border border-slate-200 rounded-2xl">
        No flashcards loaded.
      </div>
    );
  }

  const activeCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const toggleDifficulty = (cardId) => {
    setDifficultyMap(prev => {
      const isHard = prev[cardId] === 'hard';
      const updated = { ...prev, [cardId]: isHard ? 'medium' : 'hard' };
      showSuccess(isHard ? 'Card marked as medium difficulty' : 'Card marked as hard difficulty');
      return updated;
    });
  };

  const toggleBookmark = (cardId) => {
    setBookmarkedMap(prev => {
      const active = !prev[cardId];
      const updated = { ...prev, [cardId]: active };
      showSuccess(active ? 'Saved to learning bookmarks' : 'Removed from bookmarks');
      return updated;
    });
  };

  const isCardHard = difficultyMap[activeCard._id] === 'hard' || activeCard.difficulty === 'hard';
  const isCardBookmarked = bookmarkedMap[activeCard._id] || false;

  return (
    <div className="max-w-md mx-auto space-y-6 select-none">
      
      {/* 3D Perspective Card Box wrapper */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="perspective-500 h-64 w-full cursor-pointer relative group"
      >
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full h-full transform-style-3d relative rounded-2xl border border-slate-200 bg-white shadow-soft flex items-center justify-center p-6 text-center hover:border-indigo-400"
        >
          {/* Front Side UI */}
          <div className={`backface-hidden absolute inset-0 p-6 flex flex-col justify-between ${isFlipped ? 'hidden' : ''}`}>
            <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-400 tracking-wider">
              <span>Term Deck Card {currentIndex + 1} of {cards.length}</span>
              <span className={`px-2 py-0.5 border rounded-lg ${isCardHard ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                {isCardHard ? 'HARD' : 'MEDIUM'}
              </span>
            </div>

            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide px-4">
              {activeCard.front}
            </h4>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow text-indigo-500" />
              <span>Tap to Flip</span>
            </div>
          </div>

          {/* Back Side UI */}
          <div className={`backface-hidden absolute inset-0 p-6 flex flex-col justify-between [transform:rotateY(180deg)] ${!isFlipped ? 'hidden' : ''}`}>
            <div className="flex items-center justify-between text-[8px] font-black uppercase text-indigo-500 tracking-wider">
              <span>Definition Definition</span>
              <span>Tap to flip back</span>
            </div>

            <p className="text-[11px] text-slate-600 font-semibold leading-relaxed px-4">
              {activeCard.back}
            </p>

            <div className="flex justify-center gap-4 border-t border-slate-100 pt-3">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleBookmark(activeCard._id); }}
                className={`p-1.5 border rounded-lg transition-all cursor-pointer ${
                  isCardBookmarked 
                    ? 'bg-amber-50 border-amber-200 text-amber-500 fill-amber-500' 
                    : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                }`}
                title="Bookmark card"
              >
                <Star className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); toggleDifficulty(activeCard._id); }}
                className={`p-1.5 border rounded-lg transition-all cursor-pointer ${
                  isCardHard 
                    ? 'bg-rose-50 border-rose-200 text-rose-500 fill-rose-50' 
                    : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                }`}
                title="Mark Difficult"
              >
                <BadgeAlert className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Viewport Toolbar controls */}
      <div className="flex items-center justify-between border border-slate-200 bg-white px-4 py-2.5 rounded-2xl shadow-soft">
        <button 
          onClick={handlePrev}
          className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4.5 h-4.5" />
        </button>

        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">
          {currentIndex + 1} / {cards.length}
        </span>

        <button 
          onClick={handleNext}
          className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl transition-all cursor-pointer"
        >
          <ChevronRight className="w-4.5 h-4.5" />
        </button>
      </div>

    </div>
  );
};

export default FlashcardDeck;
