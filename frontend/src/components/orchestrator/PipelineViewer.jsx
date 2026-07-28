import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, CircleDot } from 'lucide-react';

export const PipelineViewer = ({ currentStep = 3 }) => {
  const pipelineSteps = [
    { step: 1, title: 'Intent Analyzer', desc: 'Classify User Goal' },
    { step: 2, title: 'Workflow Planner', desc: 'Build Node Graph' },
    { step: 3, title: 'Agent Router', desc: 'Dispatch to Sub-Agents' },
    { step: 4, title: 'Execution Pipeline', desc: 'Run Sub-Task Queue' },
    { step: 5, title: 'Shared Context', desc: 'Sync Shared Memory' },
    { step: 6, title: 'Response Aggregator', desc: 'Synthesize Output' }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
          Agentic OS System Architecture Pipeline
        </h4>
        <span className="text-[10px] font-mono text-slate-400">Step {currentStep} of 6 Active</span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 overflow-x-auto pb-2">
        {pipelineSteps.map((s, idx) => {
          const isDone = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <React.Fragment key={s.step}>
              <motion.div
                whileHover={{ y: -1 }}
                className={`p-3 rounded-2xl border transition-all flex-1 min-w-[130px] space-y-1 ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : isCurrent
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-soft ring-2 ring-indigo-100'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                  <span>Step {s.step}</span>
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : isCurrent ? <CircleDot className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> : null}
                </div>

                <h5 className="text-xs font-extrabold truncate">{s.title}</h5>
                <p className="text-[9px] truncate opacity-80">{s.desc}</p>
              </motion.div>

              {idx < pipelineSteps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:block self-center" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineViewer;
