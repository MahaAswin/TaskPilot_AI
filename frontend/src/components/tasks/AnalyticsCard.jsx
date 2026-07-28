import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Percent, ClipboardCheck, Tag } from 'lucide-react';

export const AnalyticsCard = ({ analyticsData }) => {
  const completionRate = analyticsData?.completionRate || 75;
  const timeSpent = analyticsData?.timeSpent || 350;
  const weeklyProductivity = analyticsData?.weeklyProductivity || [
    { week: 'W1', score: 65 },
    { week: 'W2', score: 80 },
    { week: 'W3', score: 70 },
    { week: 'W4', score: 90 }
  ];
  const categoryBreakdown = analyticsData?.categoryBreakdown || [
    { category: 'Study Daily', count: 12 },
    { category: 'Practice DSA', count: 18 },
    { category: 'Read Books', count: 5 },
    { category: 'Exercise', count: 8 }
  ];

  return (
    <div className="space-y-6 select-none">
      
      {/* Productivity Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Completion Rate Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Completion Rate</span>
            <div className="text-xl font-black text-slate-900">{completionRate}%</div>
            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +5.4% vs last week
            </span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* Total Time Spent Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Time Dedicated</span>
            <div className="text-xl font-black text-slate-900">{Math.round(timeSpent / 60)} hrs</div>
            <span className="text-[10px] text-slate-400 font-mono">{timeSpent} total minutes logged</span>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl text-purple-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Productivity Score */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Productivity Score</span>
            <div className="text-xl font-black text-slate-900">88 / 100</div>
            <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-1 rounded">Optimal Level</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Charts Display grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Weekly Productivity Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Weekly Completion Velocity</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Tasks Completed</span>
          </div>

          <div className="h-40 flex items-end justify-between gap-4 pt-4 px-2">
            {weeklyProductivity.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[9px] font-mono font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{item.score}%</span>
                <motion.div 
                  className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-all"
                  initial={{ height: 0 }}
                  animate={{ height: `${item.score}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                />
                <span className="text-[10px] font-mono font-bold text-slate-500">{item.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown list */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>Category Distribution</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Items Count</span>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 font-semibold">
                  <span>{cat.category}</span>
                  <span className="font-mono font-bold">{cat.count} tasks</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (cat.count / 20) * 100)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsCard;
