import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Calendar, GraduationCap, Palette, 
  BookOpen, CheckSquare, BrainCircuit, LineChart, Loader2
} from 'lucide-react';

export const AgentTimeline = ({ activeTraces = [], isThinking = false }) => {
  const agents = [
    { name: 'CoordinatorAgent', label: 'Coordinator', icon: ShieldCheck, color: 'text-[#E8B45D]', bg: 'bg-[#242832]' },
    { name: 'PlannerAgent', label: 'Schedule Planner', icon: Calendar, color: 'text-[#E8B45D]', bg: 'bg-[#242832]' },
    { name: 'KnowledgeAgent', label: 'Knowledge Base', icon: GraduationCap, color: 'text-[#E8B45D]', bg: 'bg-[#242832]' },
    { name: 'CreativeAgent', label: 'Creative Hub', icon: Palette, color: 'text-[#E8B45D]', bg: 'bg-[#242832]' },
    { name: 'LearningAgent', label: 'Academy Coach', icon: BookOpen, color: 'text-[#E8B45D]', bg: 'bg-[#242832]' },
    { name: 'TaskAgent', label: 'Tasks Matrix', icon: CheckSquare, color: 'text-[#E8B45D]', bg: 'bg-[#242832]' },
    { name: 'SkillAnalyzer', label: 'Skill Analyzer', icon: BrainCircuit, color: 'text-[#E8B45D]', bg: 'bg-[#242832]' },
    { name: 'ProductivityCoach', label: 'Coach Matrix', icon: LineChart, color: 'text-[#E8B45D]', bg: 'bg-[#242832]' },
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
        <span className="text-[10px] font-black text-white uppercase tracking-wider">Multi-Agent Timeline</span>
        <span className="text-[8px] font-bold text-[#868C99] font-mono">FLOW ACTIVE</span>
      </div>

      <div className="space-y-2 border-l border-white/10 pl-4 ml-2">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const status = getAgentStatus(agent.name);

          return (
            <div key={agent.name} className="relative flex items-center justify-between py-1.5 group">
              {/* Vertical connector timeline marker */}
              <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border bg-[#14161B] z-10 transition-colors"
                style={{
                  borderColor: 
                    status === 'completed' ? '#57B5A8' : 
                    status === 'working' ? '#E8B45D' :
                    status === 'thinking' ? '#E8B45D' : 'rgba(255,255,255,0.09)'
                }}
              />

              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className={`p-1.5 rounded-lg shrink-0 ${agent.bg} ${agent.color} border border-white/10 shadow-sm`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-extrabold text-[#C6C9D1] truncate">{agent.label}</span>
              </div>

              {/* Dynamic Status indicators */}
              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                {status === 'completed' && (
                  <span className="text-[9px] font-bold text-[#57B5A8] bg-[rgba(87,181,168,0.14)] px-2 py-0.5 rounded border border-[#57B5A8]/30 uppercase tracking-wide">
                    Done
                  </span>
                )}
                {status === 'working' && (
                  <span className="text-[9px] font-bold text-[#E8B45D] bg-[rgba(232,180,93,0.14)] px-2 py-0.5 rounded border border-[#E8B45D]/30 flex items-center gap-1 uppercase tracking-wide">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>Run</span>
                  </span>
                )}
                {status === 'thinking' && (
                  <span className="text-[9px] font-bold text-[#E8B45D] bg-[rgba(232,180,93,0.14)] px-2 py-0.5 rounded border border-[#E8B45D]/30 animate-pulse uppercase tracking-wide">
                    Wait
                  </span>
                )}
                {status === 'idle' && (
                  <span className="text-[9px] font-bold text-[#868C99] bg-[#242832] px-2 py-0.5 rounded border border-white/10 uppercase tracking-wide">
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
