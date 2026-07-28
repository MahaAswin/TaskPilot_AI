import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RECOMMENDATIONS } from '../../constants/productivityMockData';
import { useToast } from '../../context/ToastProvider';

export const RecommendationCard = ({ recommendations = RECOMMENDATIONS }) => {
  const { showSuccess } = useToast();

  const handleAction = (item) => {
    showSuccess(`Action applied: "${item.title}". Productivity plan updated!`);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Productivity Coach Recommendations</span>
          </h3>
          <p className="text-[10px] text-slate-400">Actionable advice to optimize daily focus, sleep routines, and task completion.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            whileHover={{ y: -3 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black uppercase rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {rec.impact}
                </span>

                <span className="text-[9px] font-mono text-slate-400">{rec.category}</span>
              </div>

              <h4 className="text-xs font-black text-slate-900">{rec.title}</h4>
              <p className="text-[11px] text-slate-600 leading-snug">{rec.reason}</p>
            </div>

            <button
              onClick={() => handleAction(rec)}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{rec.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}

        {/* Future AI Placeholder */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-slate-900 via-amber-950 to-purple-950 text-white rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 bg-white/10 text-amber-300 border border-amber-400/30 text-[9px] font-black uppercase rounded-full flex items-center gap-1 w-fit">
              <Sparkles className="w-3 h-3" />
              Future AI Coach Engine
            </span>

            <h4 className="text-xs font-black text-white">Adaptive Burnout Prevention</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Future AI will cross-examine study fatigue with calendar deadlines to auto-schedule rest intervals and work-life balance prompts.
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 text-[9px] font-mono text-amber-300 flex items-center justify-between">
            <span>Ready for Future Integration</span>
            <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/30 rounded text-amber-200 font-bold">Placeholder</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecommendationCard;
