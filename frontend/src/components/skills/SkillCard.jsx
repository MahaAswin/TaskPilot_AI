import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Cpu, Database, HardDrive, Network, Shield, 
  Sparkles, LayoutGrid, Layers, Server, ChevronRight, Award
} from 'lucide-react';

export const SkillCard = ({ skill, onSelectSkill }) => {
  const iconMap = {
    Code,
    Cpu,
    Database,
    HardDrive,
    Network,
    Shield,
    Sparkles,
    LayoutGrid,
    Layers,
    Server
  };

  const Icon = iconMap[skill.icon] || Code;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => onSelectSkill && onSelectSkill(skill)}
      className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className={`p-2.5 rounded-2xl bg-gradient-to-r ${skill.color} text-white shadow-sm`}>
            <Icon className="w-4 h-4" />
          </div>

          <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-full">
            {skill.level}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-900 truncate" title={skill.title}>{skill.title}</h4>
          <span className="text-[10px] font-mono text-slate-400">{skill.category}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-slate-400">{skill.masteredCount} of {skill.topicsCount} Topics</span>
          <span className="font-bold text-slate-800">{skill.score}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <motion.div 
            className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${skill.score}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SkillCard;
