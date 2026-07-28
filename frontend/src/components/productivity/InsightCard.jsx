import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, TrendingUp, Flame, Award } from 'lucide-react';
import { INSIGHTS_TIMELINE } from '../../constants/productivityMockData';

export const InsightCard = ({ insights = INSIGHTS_TIMELINE }) => {
  const iconMap = {
    Sparkles,
    Clock,
    TrendingUp,
    Flame
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Productivity Insights Highlights</span>
          </h3>
          <p className="text-[10px] text-slate-400">Synthesized milestones detected by the Productivity Coach Agent.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((ins) => {
          const Icon = iconMap[ins.icon] || Sparkles;
          return (
            <motion.div
              key={ins.id}
              whileHover={{ y: -2 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 w-fit">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-black text-slate-900">{ins.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{ins.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[9px] font-mono text-slate-400">
                {ins.date}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightCard;
