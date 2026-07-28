import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Calendar, GraduationCap, Palette, 
  BookOpen, CheckSquare, BrainCircuit, LineChart, Loader2
} from 'lucide-react';

export const AgentTimeline = ({ activeTraces = [], isThinking = false }) => {
  const agents = [
    { name: 'CoordinatorAgent', label: 'Coordinator', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'PlannerAgent', label: 'Schedule Planner', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'KnowledgeAgent', label: 'Knowledge Base', icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'CreativeAgent', label: 'Creative Hub', icon: Palette, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
    { name: 'LearningAgent', label: 'Academy Coach', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'TaskAgent', label: 'Tasks Matrix', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'SkillAnalyzer', label: 'Skill Analyzer', icon: BrainCircuit, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { name: 'ProductivityCoach', label: 'Coach Matrix', icon: LineChart, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  // Helper to resolve status indicator colors
  const getAgentStatus = (agentName) => {
    if (isThinking) {
      if (agentName === 'CoordinatorAgent') return 'working';
      // Rest are thinking or waiting
      return 'thinking';
    }

    const trace = activeTraces.find(t => t.agentName === agentName);
    if (trace) {
      return trace.status || 'completed';
    }

    return 'idle';
  };

  return (
    <div className="space-y-4">
      <div className="px-1 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Multi-Agent Timeline</span>
        <span className="text-[8px] font-bold text-slate-400 font-mono">FLOW ACTIVE</span>
      </div>

      <div className="space-y-2 border-l border-slate-100 pl-4 ml-2">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const status = getAgentStatus(agent.name);

          return (
            <div key={agent.name} className="relative flex items-center justify-between py-1.5 group">
              {/* Vertical connector timeline marker */}
              <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border bg-white z-10 transition-colors"
                style={{
                  borderColor: 
                    status === 'completed' ? '#22c55e' : 
                    status === 'working' ? '#4f46e5' :
                    status === 'thinking' ? '#f59e0b' : '#cbd5e1'
                }}
              />

              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className={`p-1.5 rounded-lg shrink-0 ${agent.bg} ${agent.color} border border-slate-100 shadow-sm`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-extrabold text-slate-700 truncate">{agent.label}</span>
              </div>

              {/* Dynamic Status indicators */}
              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                {status === 'completed' && (
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                    Done
                  </span>
                )}
                {status === 'working' && (
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1 uppercase tracking-wide">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>Run</span>
                  </span>
                )}
                {status === 'thinking' && (
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 animate-pulse uppercase tracking-wide">
                    Wait
                  </span>
                )}
                {status === 'idle' && (
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-wide">
                    Idle
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentTimeline;
