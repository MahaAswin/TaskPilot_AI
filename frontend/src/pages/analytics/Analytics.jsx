import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { BarChart3 } from 'lucide-react';

export const Analytics = () => {
  return (
    <PageContainer>
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-600" />
          <span>PRODUCTIVITY ANALYTICS</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold">Weekly score charts and execution metrics</p>
      </div>

      <GlassCard>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Performance logs</h4>
        <div className="h-48 border border-slate-200 bg-slate-50 rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono font-bold">
          Weekly history chart wrapper
        </div>
      </GlassCard>
    </PageContainer>
  );
};

export default Analytics;
