import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { Award, CheckSquare, RefreshCw, TrendingUp, Sparkles } from 'lucide-react';

export const Dashboard = () => {
  return (
    <PageContainer>
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span>Productivity Dashboard</span>
            <Sparkles className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">Multi-Agent metrics and statistics overview</p>
        </div>
        <button 
          onClick={() => alert('Syncing Matrix (Mock Operation)')}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-700 rounded-xl shadow-soft transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 text-slate-500" />
          <span>Sync Scaffolding</span>
        </button>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Rating */}
        <GlassCard className="border-l-[4px] border-l-emerald-500 bg-white shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Overall Rating</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-950 mt-3 font-mono">78%</h2>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3.5">
            <div className="bg-emerald-500 w-[78%] h-full rounded-full" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-semibold">Baseline developer status score</p>
        </GlassCard>

        {/* Card 2: Queue */}
        <GlassCard className="border-l-[4px] border-l-indigo-500 bg-white shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Pending Queue</span>
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-950 mt-3 font-mono">5 active</h2>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3.5">
            <div className="bg-indigo-500 w-2/5 h-full rounded-full" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-semibold">Tasks loaded in operation database</p>
        </GlassCard>

        {/* Card 3: Speed */}
        <GlassCard className="border-l-[4px] border-l-purple-500 bg-white shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Execution Cycle</span>
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-950 mt-3 font-mono">1.2s avg</h2>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3.5">
            <div className="bg-purple-500 w-3/4 h-full rounded-full" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-semibold">Coordinator routing response speeds</p>
        </GlassCard>

      </div>

      <GlassCard className="mt-6 border-l-[4px] border-l-indigo-500/30">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>Workspace Recommendations</span>
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
          Productivity coach agent: No alerts are currently flagged. Build the agent services to initiate recommendations.
        </p>
      </GlassCard>
    </PageContainer>
  );
};

export default Dashboard;
