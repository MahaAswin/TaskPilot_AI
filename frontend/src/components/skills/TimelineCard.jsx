import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { TIMELINE_GROWTH } from '../../constants/skillMockData';

export const TimelineCard = ({ timelineData = TIMELINE_GROWTH }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Performance & Skill Growth Timeline</span>
        </h4>
        <span className="text-[10px] font-mono text-slate-400">Weekly Progress Velocity</span>
      </div>

      <div className="relative pt-2 pb-2">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 rounded-full -translate-y-1/2 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {timelineData.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="p-4 bg-white border border-slate-200 rounded-2xl shadow-soft space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-mono font-bold rounded-full">
                  {item.week}
                </span>
                <span className="text-xs font-mono font-black text-emerald-600">{item.score}% Score</span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-500 font-semibold block">{item.topicMastered} Topics Mastered</span>
                <span className="text-[10px] text-slate-400 font-mono block">Quiz Accuracy: {item.quizAvg}</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.score}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;
