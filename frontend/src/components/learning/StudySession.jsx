import React, { useState } from 'react';
import { BookOpen, Star, ArrowRight, Check, Bookmark, Calendar, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const StudySession = ({ topic = 'Mitochondria Cellular Metabolism', onToggleBookmark, isBookmarked }) => {
  const { showSuccess } = useToast();
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState({ 0: true });

  const sections = [
    { title: '1. Introduction to Metabolism', time: '5m', text: 'Respiration begins in the cytoplasm and completes in the mitochondria matrices. Mitochondria are double-membraned organelles.' },
    { title: '2. The Outer & Inner Membrane', time: '10m', text: 'The outer membrane is permeable to small molecules. The inner membrane is folded into cristae to maximize reaction surface area.' },
    { title: '3. Electron Transport Chains', time: '12m', text: 'ETC carriers utilize redox potentials to establish electrochemical gradients of hydrogen ions across the intermembrane space.' },
    { title: '4. ATP Synthase Mechanics', time: '8m', text: 'H+ ions pass back to the matrix through ATP synthase complexes. This rotation drives the phosphorylation of ADP to ATP.' }
  ];

  const handleMarkRead = (idx) => {
    setCompletedSections(p => {
      const updated = { ...p, [idx]: true };
      // Simulate progress calculation
      const progressPercent = Math.round((Object.keys(updated).length / sections.length) * 100);
      if (progressPercent === 100) {
        showSuccess('Congratulations! You completed this reading study module!');
      } else {
        showSuccess(`Section ${idx + 1} completed! Module progress is now ${progressPercent}%.`);
      }
      return updated;
    });
  };

  const progressPercent = Math.round((Object.keys(completedSections).length / sections.length) * 100);

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-soft space-y-6 max-w-2xl mx-auto">
      
      {/* Title Meta block */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 select-none">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Immersive Reading session</span>
          </span>
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wide">{topic}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onToggleBookmark(topic)}
            className={`p-2 border rounded-xl transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-amber-50 border-amber-200 text-amber-500 fill-amber-500 shadow-sm' 
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress display */}
      <div className="space-y-2 select-none">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 font-mono">
          <span>READING PROGRESS</span>
          <span>{progressPercent}% COMPLETE</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Main split viewport layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sections list triggers */}
        <div className="space-y-2 border-r border-slate-100 pr-4 select-none">
          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Sections Checklist</span>
          {sections.map((sec, idx) => {
            const isCompleted = completedSections[idx];
            const isActive = activeSection === idx;

            return (
              <button
                key={idx}
                onClick={() => setActiveSection(idx)}
                className={`w-full text-left p-2.5 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-50 border-indigo-150 text-indigo-700 shadow-sm' 
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col gap-0.5 truncate">
                  <span className="truncate">{sec.title}</span>
                  <span className="text-[8px] font-medium text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {sec.time} reading
                  </span>
                </div>
                {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Content text page */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
              {sections[activeSection].title}
            </h4>
            <p className="text-xs text-slate-650 leading-relaxed font-semibold">
              {sections[activeSection].text}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Estimated Time: {sections[activeSection].time}</span>
            
            {!completedSections[activeSection] ? (
              <button
                onClick={() => handleMarkRead(activeSection)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100/50 border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <span>Mark as read</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 flex items-center gap-1 uppercase tracking-wide select-none">
                <Check className="w-3.5 h-3.5 animate-pulse" />
                <span>Completed</span>
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudySession;
