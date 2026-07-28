import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

export const Timeline = ({ phases = [] }) => {
  const [selectedPhase, setSelectedPhase] = useState(0);

  const defaultPhases = phases.length > 0 ? phases : [
    { label: 'Week 1', title: 'Arrays, Strings & Recursion', status: 'completed', completion: 100, details: 'Master Two Pointers, Sliding Window, and Hash Map lookup optimization.' },
    { label: 'Week 2', title: 'Linked Lists, Stacks & Queues', status: 'completed', completion: 100, details: 'Monotonic Stacks, LRU Cache implementation, and BFS/DFS foundations.' },
    { label: 'Week 3', title: 'Trees, Graphs & Dynamic Prog.', status: 'in_progress', completion: 60, details: 'Binary Trees, BST operations, 1D & 2D Dynamic Programming patterns.' },
    { label: 'Week 4', title: 'DBMS, OS & Computer Networks', status: 'in_progress', completion: 30, details: 'SQL Joins, Indexing, Process Sync, Mutex/Semaphore, TCP/IP Model.' },
    { label: 'Month 2', title: 'System Design & Portfolio Projects', status: 'pending', completion: 0, details: 'Low Level & High Level System Design, Caching, Rate Limiters.' }
  ];

  return (
    <section id="sec-timeline" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Timeline Progression View</span>
          </h3>
          <p className="text-xs text-slate-500">Structured chronological timeline from Week 1 to Future Months.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-6">
        {/* Horizontal Timeline Track */}
        <div className="relative pt-4 pb-2">
          {/* Connecting Line */}
          <div className="absolute top-9 left-6 right-6 h-1 bg-slate-100 rounded-full z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative z-10">
            {defaultPhases.map((phase, idx) => {
              const isCompleted = phase.status === 'completed';
              const isInProgress = phase.status === 'in_progress';
              const isSelected = selectedPhase === idx;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedPhase(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isCompleted ? 'bg-emerald-100 text-emerald-700' :
                      isInProgress ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {phase.label}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Clock className={`w-3.5 h-3.5 ${isInProgress ? 'text-indigo-600 animate-spin-slow' : 'text-slate-300'}`} />
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">{phase.title}</h4>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${phase.completion}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-500">{phase.completion}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Active Phase Details Display */}
        {defaultPhases[selectedPhase] && (
          <div className="p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-slate-900">
                {defaultPhases[selectedPhase].label}: {defaultPhases[selectedPhase].title}
              </h5>
              <p className="text-xs text-slate-600 mt-0.5">
                {defaultPhases[selectedPhase].details}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Timeline;
