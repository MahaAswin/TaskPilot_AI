import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { Calendar } from 'lucide-react';

export const Planner = () => {
  return (
    <PageContainer>
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span>SCHEDULE PLANNER</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold">Generate calendars and phase roadmaps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Active Schedule Roadmap</h4>
          <div className="border border-slate-200 bg-slate-50/50 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center text-[10px] text-slate-600 leading-none font-bold">
              <span>Phase 1: Project Initiation</span>
              <span className="text-purple-600 font-extrabold font-mono">Pending</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-purple-600 w-1/4 h-full" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Planner Configurations</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            The planner module can be extended to support timetable calculations.
          </p>
        </GlassCard>
      </div>
    </PageContainer>
  );
};

export default Planner;
