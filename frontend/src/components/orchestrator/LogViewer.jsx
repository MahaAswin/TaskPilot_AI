import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Filter, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { SYSTEM_LOGS } from '../../constants/orchestratorMockData';

export const LogViewer = ({ logs = SYSTEM_LOGS }) => {
  const [filterLevel, setFilterLevel] = useState('ALL');

  const filteredLogs = logs.filter(l => filterLevel === 'ALL' || l.level === filterLevel);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4 font-mono select-none border border-slate-800">
      
      {/* Log Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Real-Time Execution Logs</span>
        </div>

        <div className="flex items-center gap-1 text-[10px]">
          {['ALL', 'INFO', 'SUCCESS', 'WARNING'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterLevel === lvl
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Log Content Feed */}
      <div className="space-y-2 text-[11px] max-h-72 overflow-y-auto pr-2">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-2.5 leading-relaxed border-b border-slate-800/50 pb-1.5">
            <span className="text-slate-500 font-bold shrink-0">[{log.timestamp}]</span>
            <span className={`font-bold px-1.5 rounded text-[9px] shrink-0 ${
              log.level === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
            }`}>
              {log.level}
            </span>
            <span className="text-purple-300 font-bold shrink-0">[{log.agent}]:</span>
            <span className="text-slate-300 truncate">{log.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LogViewer;
