import React from 'react';
import { motion } from 'framer-motion';
import { History, Cpu, CheckCircle2, Clock } from 'lucide-react';
import { SYSTEM_LOGS } from '../../constants/orchestratorMockData';

export const TimelineCard = ({ logs = SYSTEM_LOGS }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <span>Agent Dispatch Execution Timeline</span>
        </h4>
        <span className="text-[10px] font-mono text-slate-400">Timestamp Events</span>
      </div>

      <div className="space-y-2.5">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            whileHover={{ x: 2 }}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-slate-400">{log.timestamp}</span>
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-mono font-bold rounded">
                {log.agent}
              </span>
              <span className="text-slate-700 font-medium truncate">{log.message}</span>
            </div>

            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-mono font-bold shrink-0">
              {log.level}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineCard;
