import React from 'react';
import { Zap, Sparkles, Play, Download, Award, Shield } from 'lucide-react';

export const CoachHeader = ({ 
  productivityScore = 88, 
  currentStreak = 14,
  onLaunchFocusMode,
  onExportReports
}) => {
  return (
    <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
          <span>PRODUCTIVITY COACH AGENT</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold flex items-center gap-1.5">
          <span>AI productivity mentor, focus analytics, habit consistency & work-life balance</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="text-purple-600 font-bold flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" /> Planner & Task Agent Synced
          </span>
        </p>
      </div>

      {/* Stats Badges & Focus Launcher */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/60 rounded-2xl px-3.5 py-1.5 flex items-center gap-3">
          
          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-amber-600 tracking-wider block">Productivity Index</span>
            <span className="text-xs font-black text-slate-900">{productivityScore} / 100</span>
          </div>

          <div className="w-px h-6 bg-amber-200/60" />

          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-amber-600 tracking-wider block">Streak Streak</span>
            <span className="text-xs font-black text-amber-600">🔥 {currentStreak} Days</span>
          </div>

        </div>

        <button
          onClick={onLaunchFocusMode}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-glow cursor-pointer transition-all shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Focus Timer</span>
        </button>

        <button
          onClick={onExportReports}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200/60 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Reports</span>
        </button>
      </div>

    </div>
  );
};

export default CoachHeader;
