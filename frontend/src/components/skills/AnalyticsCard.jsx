import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Percent, Activity, Calendar } from 'lucide-react';
import ProgressRing from '../common/ProgressRing';

export const AnalyticsCard = () => {
  return (
    <div className="space-y-6 select-none">
      
      {/* Learning Analytics Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Quiz Accuracy</span>
            <div className="text-xl font-black text-slate-900">86.4%</div>
            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +4.2% vs last month
            </span>
          </div>
          <ProgressRing radius={30} stroke={5} progress={86} color="stroke-emerald-500" />
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Coding Accuracy</span>
            <div className="text-xl font-black text-slate-900">82.0%</div>
            <span className="text-[9px] font-mono text-slate-400">120 Problems solved</span>
          </div>
          <ProgressRing radius={30} stroke={5} progress={82} color="stroke-indigo-600" />
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Total Learning Hours</span>
            <div className="text-xl font-black text-slate-900">142 hrs</div>
            <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-1 rounded">Optimal Velocity</span>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl text-purple-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Bar Chart & Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Bar Chart Placeholder */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Weekly Quiz & Coding Velocity</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Bar Chart Placeholder</span>
          </div>

          <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { day: 'Mon', count: 4, height: '50%' },
              { day: 'Tue', count: 7, height: '75%' },
              { day: 'Wed', count: 3, height: '40%' },
              { day: 'Thu', count: 9, height: '90%' },
              { day: 'Fri', count: 6, height: '65%' },
              { day: 'Sat', count: 10, height: '100%' },
              { day: 'Sun', count: 5, height: '55%' }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[9px] font-mono font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{bar.count} tests</span>
                <motion.div 
                  className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-all"
                  initial={{ height: 0 }}
                  animate={{ height: bar.height }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                />
                <span className="text-[10px] font-mono font-bold text-slate-500">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Placeholder */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Learning Consistency Heatmap</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">30-Day Activity</span>
          </div>

          <p className="text-[11px] text-slate-500">Visualization of daily practice density and study session occurrences.</p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {[...Array(35)].map((_, i) => {
              const intensity = (i * 7) % 5;
              const bgColors = [
                'bg-slate-100',
                'bg-emerald-100 text-emerald-700',
                'bg-emerald-300 text-emerald-800',
                'bg-emerald-500 text-white',
                'bg-emerald-600 text-white'
              ];
              return (
                <span
                  key={i}
                  className={`w-6 h-6 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center ${bgColors[intensity]}`}
                  title={`Day ${i + 1}: ${intensity * 2} hours`}
                >
                  {i + 1}
                </span>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsCard;
