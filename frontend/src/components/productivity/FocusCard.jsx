import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, CheckCircle2, Award } from 'lucide-react';
import { FOCUS_SESSIONS } from '../../constants/productivityMockData';

export const FocusCard = ({ sessions = FOCUS_SESSIONS }) => {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Focus Session Logs & History</span>
          </h3>
          <p className="text-[10px] text-slate-400">Chronological history of completed deep work sessions.</p>
        </div>
      </div>

      <div className="space-y-3">
        {sessions.map((fs) => (
          <motion.div
            key={fs.id}
            whileHover={{ y: -1 }}
            className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black uppercase rounded-full">
                  Quality: {fs.quality}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{fs.date}</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 truncate">{fs.title}</h4>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono shrink-0">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">Focus / Break</span>
                <span className="font-bold text-slate-800">{fs.duration} / {fs.breakDuration}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">Distractions</span>
                <span className={`font-bold ${fs.distractionCount === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {fs.distractionCount} Count
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FocusCard;
