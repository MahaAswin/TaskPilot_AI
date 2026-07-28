import React from 'react';
import { motion } from 'framer-motion';
import { History, Sparkles, Clock, TrendingUp, Flame } from 'lucide-react';
import { INSIGHTS_TIMELINE } from '../../constants/productivityMockData';

export const TimelineCard = ({ timeline = INSIGHTS_TIMELINE }) => {
  const iconMap = {
    Sparkles,
    Clock,
    TrendingUp,
    Flame
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <History className="w-4 h-4 text-amber-500" />
          <span>Chronological Productivity Timeline</span>
        </h4>
        <span className="text-[10px] font-mono text-slate-400">Milestone Events</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.map((item) => {
          const Icon = iconMap[item.icon] || Sparkles;
          return (
            <motion.div
              key={item.id}
              whileHover={{ x: 2 }}
              className="relative bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-1"
            >
              <div className="absolute -left-6 top-3.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white" />

              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-amber-600" />
                  <span>{item.title}</span>
                </h5>
                <span className="text-[9px] font-mono text-slate-400 font-bold">{item.date}</span>
              </div>
              <p className="text-[11px] text-slate-600">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineCard;
