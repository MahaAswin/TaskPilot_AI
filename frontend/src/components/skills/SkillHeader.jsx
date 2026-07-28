import React from 'react';
import { Brain, Award, Download, Sparkles, RefreshCw, BarChart3 } from 'lucide-react';

export const SkillHeader = ({ 
  overallScore = 78, 
  currentRank = 'Master',
  onExportClick,
  onAnalyzeClick,
  isAnalyzing
}) => {
  return (
    <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span>SKILL ANALYZER AGENT</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold flex items-center gap-1.5">
          <span>Personalized skill profile, multi-domain evaluation, and mastery analytics</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="text-purple-600 font-bold flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" /> Learning & Task Agent Synced
          </span>
        </p>
      </div>

      {/* Ranks & Actions Header Badge */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl px-3.5 py-1.5 flex items-center gap-3">
          
          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-indigo-500 tracking-wider block">Skill Score</span>
            <span className="text-xs font-black text-slate-900">{overallScore} / 100</span>
          </div>

          <div className="w-px h-6 bg-indigo-200/60" />

          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-indigo-500 tracking-wider block">Global Rank</span>
            <span className="text-xs font-black text-indigo-600">{currentRank}</span>
          </div>

        </div>

        <button
          onClick={onAnalyzeClick}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200/60 disabled:opacity-50"
          title="Trigger Skill Evaluation Cycle"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
        </button>

        <button
          onClick={onExportClick}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow cursor-pointer transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Profile</span>
        </button>
      </div>

    </div>
  );
};

export default SkillHeader;
