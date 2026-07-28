import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { Calendar } from 'lucide-react';

export const Planner = () => {
  return (
    <PageContainer>
      <div className="border-b border-white/5 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span>SCHEDULE PLANNER</span>
        </h1>
        <p className="text-[10px] text-zinc-500 mt-1">Generate calendars and phase roadmaps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Active Schedule Roadmap</h4>
          <div className="border border-white/5 bg-zinc-950/20 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center text-[10px] text-zinc-400 leading-none">
              <span>Phase 1: Project Initiation</span>
              <span className="text-purple-400 font-bold font-mono">Pending</span>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div className="bg-purple-500 w-1/4 h-full" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Planner Configurations</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The planner module can be extended to support timetable calculations.
          </p>
        </GlassCard>
      </div>
    </PageContainer>
  );
};

export default Planner;
