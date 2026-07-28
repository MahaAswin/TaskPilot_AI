import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { HABIT_ANALYTICS } from '../../constants/productivityMockData';

export const HabitAnalyticsCard = ({ data = HABIT_ANALYTICS }) => {
  return (
    <div className="space-y-6 select-none">
      
      {/* Metrics Top Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-soft">
          <span className="text-[9px] font-black uppercase text-slate-400 block">Daily Consistency</span>
          <div className="text-xl font-black text-slate-900 mt-1">{data.dailyConsistency}</div>
          <span className="text-[9px] text-emerald-600 font-bold">Optimal Level</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-soft">
          <span className="text-[9px] font-black uppercase text-slate-400 block">Habit Streak</span>
          <div className="text-xl font-black text-amber-600 mt-1">🔥 {data.habitStreak} Days</div>
          <span className="text-[9px] text-amber-600 font-bold">Active Streak</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-soft">
          <span className="text-[9px] font-black uppercase text-slate-400 block">Missed Days</span>
          <div className="text-xl font-black text-slate-800 mt-1">{data.missedDays} Days</div>
          <span className="text-[9px] text-slate-400 font-mono">Last 30 Days</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-soft">
          <span className="text-[9px] font-black uppercase text-slate-400 block">Completion %</span>
          <div className="text-xl font-black text-indigo-600 mt-1">{data.completionPercentage}%</div>
          <span className="text-[9px] text-indigo-600 font-bold">Overall Average</span>
        </div>
      </div>

      {/* Habit List Breakdown */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Habit Consistency Breakdown</span>
          </h4>
          <span className="text-[10px] font-mono text-slate-400">Routine Matrix</span>
        </div>

        <div className="space-y-3">
          {data.habitsList.map((h, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-800 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {h.title}
                </span>
                <span className="font-mono font-bold text-slate-600">{h.streak} day streak ({h.completion}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${h.completion}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HabitAnalyticsCard;
