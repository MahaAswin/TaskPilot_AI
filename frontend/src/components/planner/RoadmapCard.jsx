import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ChevronRight, Milestone } from 'lucide-react';

const TYPE_COLORS = {
  learning: { accent: 'bg-indigo-600', light: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-600' },
  career:   { accent: 'bg-purple-600', light: 'bg-purple-50 border-purple-200', text: 'text-purple-600' },
  skill:    { accent: 'bg-emerald-600', light: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600' },
  project:  { accent: 'bg-amber-600', light: 'bg-amber-50 border-amber-200', text: 'text-amber-600' },
};

export const RoadmapCard = ({ roadmap }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const colors = TYPE_COLORS[roadmap.type] || TYPE_COLORS.learning;
  const progress = roadmap.steps.length > 0
    ? Math.round((completedSteps.length / roadmap.steps.length) * 100)
    : 0;

  const toggleStep = (idx) => {
    setCompletedSteps(prev =>
      prev.includes(idx) ? prev.filter(s => s !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className={`px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3`}>
        <div>
          <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1.5 ${colors.light} ${colors.text}`}>
            {roadmap.type} Roadmap
          </span>
          <h4 className="text-xs font-black text-slate-800 leading-tight">{roadmap.title}</h4>
        </div>
        <div className="text-right shrink-0">
          <span className={`text-lg font-black font-mono ${colors.text}`}>{progress}%</span>
          <span className="block text-[8px] text-slate-400 font-bold">complete</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-2 bg-slate-50 border-b border-slate-100">
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${colors.accent}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="p-5 space-y-2">
        {roadmap.steps.map((step, idx) => {
          const done = completedSteps.includes(idx);
          return (
            <motion.button
              key={idx}
              onClick={() => toggleStep(idx)}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-[10px] font-semibold transition-all cursor-pointer ${
                done
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[11px] font-black w-5 text-center shrink-0 ${done ? 'text-emerald-500' : 'text-slate-300'}`}>
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="font-mono">{String(idx + 1).padStart(2, '0')}</span>}
              </span>
              <span className={done ? 'line-through opacity-60' : ''}>{step}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapCard;
