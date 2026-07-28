import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, Clock, Cpu } from 'lucide-react';
import { AGENTS_LIST } from '../../constants/orchestratorMockData';

export const ExecutionCard = ({ agents = AGENTS_LIST }) => {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Agent Pool Status & Sub-System Registry</span>
          </h3>
          <p className="text-[10px] text-slate-400">All 8 autonomous agent instances connected via Coordinator Router.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {agents.map((ag) => (
          <motion.div
            key={ag.id}
            whileHover={{ y: -1 }}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${ag.color}`}
          >
            <div className="space-y-1">
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 border border-current">
                {ag.status.toUpperCase()}
              </span>
              <h4 className="text-xs font-black truncate">{ag.name}</h4>
              <p className="text-[10px] opacity-80 leading-snug">{ag.role}</p>
            </div>

            <div className="pt-2 border-t border-current/20 flex items-center justify-between text-[9px] font-mono">
              <span>Ready for Dispatch</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionCard;
