import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Code, Shield, Cpu, Award, FolderGit2, 
  Rocket, Zap, UserCheck, Sliders, Layers, ArrowRight, Check
} from 'lucide-react';
import { PLANNING_TEMPLATES } from '../../constants/planningTemplates';

export const TemplateCard = ({ selectedTemplateId, onSelectTemplate }) => {
  const iconMap = {
    Briefcase,
    Code,
    Shield,
    Cpu,
    Award,
    FolderGit2,
    Rocket,
    Zap,
    UserCheck,
    Sliders
  };

  return (
    <section id="sec-templates" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Pre-Built Planning Templates</span>
          </h3>
          <p className="text-xs text-slate-500">Choose from 10 industry-standard roadmap templates or customize your own.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {PLANNING_TEMPLATES.map((tmpl) => {
          const Icon = iconMap[tmpl.icon] || Layers;
          const isSelected = selectedTemplateId === tmpl.id;

          return (
            <motion.div
              key={tmpl.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTemplate(tmpl)}
              className={`bg-white border rounded-3xl p-4 shadow-soft transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/30'
                  : 'border-slate-200/90 hover:border-indigo-200 hover:shadow-md'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-2xl border ${tmpl.bgColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {tmpl.badge}
                  </span>
                </div>

                <h4 className="text-xs font-black text-slate-900 line-clamp-1">{tmpl.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{tmpl.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{tmpl.durationDays} Days ({tmpl.estimatedHours}h)</span>
                <span className={`font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {isSelected ? 'Active Plan' : 'Select →'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TemplateCard;
