import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Clock, CheckCircle2, Play, Users } from 'lucide-react';
import { SAMPLE_WORKFLOWS } from '../../constants/orchestratorMockData';

export const WorkflowCard = ({ workflows = SAMPLE_WORKFLOWS, onSelectWorkflow }) => {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-600" />
            <span>Workflow Templates & Active Pipelines</span>
          </h3>
          <p className="text-[10px] text-slate-400">Pre-configured multi-agent orchestration sequences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((wf) => (
          <motion.div
            key={wf.id}
            whileHover={{ y: -2 }}
            onClick={() => onSelectWorkflow && onSelectWorkflow(wf)}
            className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-black uppercase rounded-full">
                  {wf.intent}
                </span>

                <span className="text-[10px] font-mono text-slate-400 font-bold">{wf.duration}</span>
              </div>

              <h4 className="text-xs font-black text-slate-900">{wf.title}</h4>
              <span className="text-[10px] font-mono text-slate-500 block">{wf.workflowType}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                {wf.agentsUsed.length} Agents
              </span>
              <span className="text-indigo-600 font-bold flex items-center gap-1">
                <Play className="w-3 h-3 fill-current" /> Run Flow
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowCard;
