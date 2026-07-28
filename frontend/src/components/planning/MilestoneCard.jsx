import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, CalendarDays, AlertTriangle, 
  ChevronDown, ChevronUp, Check, ShieldAlert, Tag
} from 'lucide-react';

export const MilestoneCard = ({ milestone, onToggleDeliverable }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!milestone) return null;

  const isCompleted = milestone.status === 'completed';
  const isInProgress = milestone.status === 'in_progress';

  const riskColors = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Critical: 'bg-red-100 text-red-800 border-red-300 animate-pulse'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border rounded-3xl p-5 shadow-soft transition-all ${
        isCompleted ? 'border-emerald-200 bg-emerald-50/20' :
        isInProgress ? 'border-indigo-200 shadow-md' : 'border-slate-200/90'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
            isCompleted ? 'bg-emerald-500 text-white' :
            isInProgress ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            {isCompleted ? <Check className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${riskColors[milestone.riskLevel] || riskColors.Low}`}>
                Risk: {milestone.riskLevel || 'Low'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">Target: {milestone.targetDate}</span>
            </div>

            <h4 className="text-sm font-extrabold text-slate-900">{milestone.title}</h4>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Deliverables & Dependencies */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-100 space-y-3"
          >
            {/* Deliverables Checklist */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Deliverables Checklist</span>
              <div className="space-y-1.5">
                {milestone.deliverables?.map((item, idx) => (
                  <label 
                    key={idx}
                    className="flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/50 cursor-pointer text-xs text-slate-700 font-semibold transition-colors"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={isCompleted}
                      onChange={() => onToggleDeliverable && onToggleDeliverable(milestone.id, idx)}
                      className="w-3.5 h-3.5 text-indigo-600 rounded focus:ring-indigo-400 border-slate-300 cursor-pointer"
                    />
                    <span className={isCompleted ? 'line-through text-slate-400' : ''}>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dependencies */}
            {milestone.dependencies?.length > 0 && (
              <div className="flex items-center gap-2 text-[11px] pt-1">
                <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Dependencies:
                </span>
                {milestone.dependencies.map((dep, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono text-[10px]">
                    {dep}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MilestoneCard;
