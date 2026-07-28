import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Zap, Target, Flame, Calendar, Award } from 'lucide-react';

export const ProgressCard = ({ metrics = {} }) => {
  const overall = metrics.overall || 42;
  const weekly = metrics.weekly || 75;
  const daily = metrics.daily || 50;
  const milestone = metrics.milestone || 50;
  const streak = metrics.streakDays || 14;

  return (
    <section id="sec-progress" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Progress & Velocity Analytics</span>
          </h3>
          <p className="text-xs text-slate-500">Real-time performance analytics, milestone velocity, and daily habit streaks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Overall Progress */}
        <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Overall Progress</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{overall}%</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12% this week
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${overall}%` }} />
          </div>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Weekly Progress</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{weekly}%</span>
            <span className="text-[10px] font-mono text-slate-400">Week 3 Active</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${weekly}%` }} />
          </div>
        </motion.div>

        {/* Daily Progress */}
        <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Daily Goal Target</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{daily}%</span>
            <span className="text-[10px] font-mono text-slate-400">4 / 8 Tasks Done</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${daily}%` }} />
          </div>
        </motion.div>

        {/* Habit Streak */}
        <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-5 shadow-glow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-amber-100 tracking-wider">Habit Streak</span>
            <Flame className="w-5 h-5 text-amber-100 animate-bounce" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black">{streak} Days</span>
            <span className="text-[10px] font-bold text-amber-100">🔥 On Fire</span>
          </div>
          <p className="text-[10px] text-amber-100/90 font-mono">14 consecutive days of plan execution!</p>
        </motion.div>

      </div>

      {/* Visual Chart Placeholder Component */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">Weekly Task Velocity Chart</span>
          <span className="text-[10px] font-mono text-indigo-600 font-bold">SVG Chart Placeholder</span>
        </div>

        {/* Animated Bar Chart Graphic */}
        <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
          {[
            { day: 'Mon', height: '60%', count: 6 },
            { day: 'Tue', height: '85%', count: 8 },
            { day: 'Wed', height: '40%', count: 4 },
            { day: 'Thu', height: '90%', count: 9 },
            { day: 'Fri', height: '70%', count: 7 },
            { day: 'Sat', height: '95%', count: 10 },
            { day: 'Sun', height: '50%', count: 5 }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <span className="text-[9px] font-mono font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{bar.count} tasks</span>
              <motion.div 
                className="w-full bg-indigo-500/80 group-hover:bg-indigo-600 rounded-xl transition-all shadow-xs"
                initial={{ height: 0 }}
                animate={{ height: bar.height }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              />
              <span className="text-[10px] font-mono font-bold text-slate-500">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgressCard;
