import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { Award, CheckSquare, RefreshCw, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  return (
    <PageContainer>
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-white uppercase tracking-wider">Productivity Dashboard</h1>
          <p className="text-[10px] text-zinc-500 mt-1">Multi-Agent metrics and statistics overview</p>
        </div>
        <button 
          onClick={() => alert('Syncing Matrix (Mock Operation)')}
          className="flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-zinc-900 text-[10px] font-bold text-zinc-300 rounded-xl"
        >
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Sync Scaffolding</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Overall Rating</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white mt-4 font-mono">78%</h2>
          <p className="text-[10px] text-zinc-500 mt-2">Baseline developer status score</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Pending Queue</span>
            <CheckSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-white mt-4 font-mono">5 active</h2>
          <p className="text-[10px] text-zinc-500 mt-2">Tasks loaded in operation database</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Execution Cycle</span>
            <TrendingUp className="w-4 h-4 text-fuchsia-400" />
          </div>
          <h2 className="text-3xl font-black text-white mt-4 font-mono">1.2s avg</h2>
          <p className="text-[10px] text-zinc-500 mt-2">Coordinator routing response speeds</p>
        </GlassCard>
      </div>

      <GlassCard className="mt-6">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Workspace Recommendations</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Productivity coach agent: No alerts are currently flagged. Build the agent services to initiate recommendations.
        </p>
      </GlassCard>
    </PageContainer>
  );
};

export default Dashboard;
