import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, HelpCircle, Palette, Calendar, CheckSquare, GraduationCap, Trophy, Cpu } from 'lucide-react';

const AGENT_META = {
  CoordinatorAgent: { name: 'Coordinator Agent', icon: Cpu, color: 'text-indigo-400 border-indigo-500/25 bg-indigo-500/5' },
  PlannerAgent: { name: 'Planner Agent', icon: Calendar, color: 'text-purple-400 border-purple-500/25 bg-purple-500/5' },
  TaskAgent: { name: 'Task Agent', icon: CheckSquare, color: 'text-sky-400 border-sky-500/25 bg-sky-500/5' },
  KnowledgeAgent: { name: 'Knowledge Agent', icon: GraduationCap, color: 'text-amber-400 border-amber-500/25 bg-amber-500/5' },
  CreativeAgent: { name: 'Creative Agent', icon: Palette, color: 'text-fuchsia-400 border-fuchsia-500/25 bg-fuchsia-500/5' },
  ProductivityCoachAgent: { name: 'Productivity Agent', icon: Trophy, color: 'text-teal-400 border-teal-500/25 bg-teal-500/5' }
};

const AgentStatusList = ({ traces = {} }) => {
  // If no traces are active, do not render
  const activeAgentKeys = Object.keys(traces);
  if (activeAgentKeys.length === 0) return null;

  return (
    <div className="w-full glassmorphism border border-white/5 rounded-2xl p-5 mb-5 shadow-glass flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-1">
        <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
          Active Agent Grid Orchestrator
        </span>
        <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full font-mono">
          {activeAgentKeys.filter(k => traces[k] === 'completed').length}/{activeAgentKeys.length} Completed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {activeAgentKeys.map((agentKey) => {
            const meta = AGENT_META[agentKey] || { name: agentKey, icon: HelpCircle, color: 'text-zinc-400 border-zinc-500/20' };
            const status = traces[agentKey]; // 'thinking' | 'working' | 'completed' | 'generating' | 'failed'
            const Icon = meta.icon;

            let statusIcon = null;
            let statusText = '';
            let statusClass = '';

            if (status === 'thinking') {
              statusIcon = <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
              statusText = 'Thinking...';
              statusClass = 'border-amber-500/20 bg-amber-500/5 shadow-amber-500/5';
            } else if (status === 'working') {
              statusIcon = <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />;
              statusText = 'Working...';
              statusClass = 'border-indigo-500/20 bg-indigo-500/5 shadow-indigo-500/5 animate-pulse';
            } else if (status === 'generating') {
              statusIcon = <Loader2 className="w-4 h-4 text-fuchsia-400 animate-spin" />;
              statusText = 'Generating image...';
              statusClass = 'border-fuchsia-500/20 bg-fuchsia-500/5 shadow-fuchsia-500/5 animate-pulse';
            } else if (status === 'completed') {
              statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
              statusText = 'Completed';
              statusClass = 'border-emerald-500/20 bg-emerald-500/5';
            } else if (status === 'failed') {
              statusIcon = <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
              statusText = 'Failed';
              statusClass = 'border-rose-500/20 bg-rose-500/5';
            }

            return (
              <motion.div
                key={agentKey}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${statusClass} transition-all duration-300`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg border ${meta.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-200 truncate pr-1">
                    {meta.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span className={`text-[10px] font-semibold tracking-wide ${status === 'completed' ? 'text-emerald-400' : status === 'failed' ? 'text-rose-400' : 'text-zinc-400'}`}>
                    {statusText}
                  </span>
                  {statusIcon}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AgentStatusList;
