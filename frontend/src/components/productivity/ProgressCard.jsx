import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { GOALS_PROGRESS } from '../../constants/productivityMockData';

export const ProgressCard = ({ goals = GOALS_PROGRESS }) => {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Active Goal Progress & Milestones</span>
          </h3>
          <p className="text-[10px] text-slate-400">Milestone velocity aligned with Planner & Task Agents.</p>
        </div>
      </div>

      <div className="space-y-4">
        {goals.map((g) => (
          <motion.div
            key={g.id}
            whileHover={{ y: -2 }}
            className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-soft space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-black uppercase rounded-full">
                  Status: {g.status}
                </span>
                <h4 className="text-xs font-black text-slate-900 mt-1">{g.title}</h4>
              </div>

              <span className="text-[10px] font-mono text-slate-400 font-bold">
                Est. Completion: {g.estimatedCompletion}
              </span>
            </div>

            {/* Milestones bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">{g.completedMilestones} of {g.totalMilestones} Milestones Achieved</span>
                <span className="font-bold text-slate-900">{g.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${g.progress}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressCard;
