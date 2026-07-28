import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Calendar, GraduationCap, BookOpen, Palette, CheckSquare, Brain, Zap, CheckCircle2, Clock, Loader2 
} from 'lucide-react';

export const AgentNode = ({ node, isSelected, onClick }) => {
  const iconMap = {
    'Coordinator Agent': Cpu,
    'Planner Agent': Calendar,
    'Knowledge Agent': GraduationCap,
    'Learning Agent': BookOpen,
    'Creative Agent': Palette,
    'Task Agent': CheckSquare,
    'Skill Analyzer Agent': Brain,
    'Productivity Coach Agent': Zap
  };

  const Icon = iconMap[node.agentId] || Cpu;

  const statusStyles = {
    completed: 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-soft',
    running: 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-glow ring-2 ring-indigo-200',
    pending: 'bg-slate-50 border-slate-200/80 text-slate-400 opacity-70',
    error: 'bg-rose-50 border-rose-300 text-rose-700 shadow-soft'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      onClick={() => onClick && onClick(node)}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 w-56 ${
        statusStyles[node.status] || statusStyles.pending
      } ${isSelected ? 'ring-2 ring-indigo-500 shadow-md' : ''}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 rounded-xl bg-white border border-slate-200/60 text-slate-700 shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <span className="text-[8px] font-mono font-bold uppercase tracking-wider block opacity-75">
            Step {node.step}
          </span>
          <h4 className="text-xs font-black truncate">{node.agentId}</h4>
        </div>
      </div>

      <div className="shrink-0">
        {node.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        {node.status === 'running' && <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />}
        {node.status === 'pending' && <Clock className="w-3.5 h-3.5 text-slate-300" />}
      </div>
    </motion.div>
  );
};

export default AgentNode;
