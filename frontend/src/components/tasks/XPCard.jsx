import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Sparkles, AlertCircle, History } from 'lucide-react';

export const XPCard = ({ xpData }) => {
  const currentXP = xpData?.currentXP || 450;
  const nextLevel = xpData?.nextLevel || 500;
  const xpProgress = xpData?.xpProgress || 90;
  const currentLevel = xpData?.currentLevel || 4;
  const levelTitle = xpData?.levelTitle || 'Explorer';

  const defaultHistory = xpData?.history || [
    { action: 'Task Completed: Monotonic Queues', amount: 30, date: new Date() },
    { action: 'Quiz Completed: SQL Joins', amount: 40, date: new Date() },
    { action: 'Daily Habit: Exercise', amount: 20, date: new Date() },
    { action: 'Missed Deadline: Documentation', amount: -10, date: new Date() }
  ];

  return (
    <div className="space-y-5 select-none">
      
      {/* Level Tier Status Glass Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white rounded-3xl p-6 shadow-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-indigo-100 tracking-wider">Active Level Rank</span>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <Award className="w-5.5 h-5.5 text-amber-300 animate-pulse" />
                <span>Level {currentLevel}: {levelTitle}</span>
              </h2>
            </div>
            <span className="px-2.5 py-1 bg-white/10 text-white border border-white/20 rounded-xl text-[10px] font-mono">
              Next level in {nextLevel - currentXP} XP
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-indigo-100">
              <span>Progress XP</span>
              <span className="font-bold">{currentXP} / {nextLevel} XP ({xpProgress}%)</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/5 p-0.5">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* History Log List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <span>XP Transaction History Log</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Streak multipliers applied</span>
        </div>

        <div className="space-y-2">
          {defaultHistory.map((item, idx) => {
            const isNegative = item.amount < 0;
            return (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/50 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isNegative ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  <span className="font-semibold text-slate-700">{item.action}</span>
                </div>

                <span className={`font-mono font-black ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {isNegative ? '' : '+'}{item.amount} XP
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default XPCard;
