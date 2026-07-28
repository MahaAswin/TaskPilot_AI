import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Compass, Map, Clock, CheckCircle2, CalendarDays, 
  Sun, BookOpen, AlertTriangle, Lightbulb, BarChart3, Download, Layers
} from 'lucide-react';
import { PLANNING_TEMPLATES } from '../../constants/planningTemplates';

export const CanvasSidebar = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  scrollToSection, 
  selectedTemplateId, 
  onSelectTemplate 
}) => {
  const sections = [
    { id: 'sec-goal-input', label: 'Goal Input', icon: Compass },
    { id: 'sec-goal-summary', label: 'Goal Summary', icon: CheckCircle2 },
    { id: 'sec-roadmap-canvas', label: 'Roadmap Canvas', icon: Map },
    { id: 'sec-timeline', label: 'Timeline View', icon: Clock },
    { id: 'sec-milestones', label: 'Milestones', icon: CalendarDays },
    { id: 'sec-weekly', label: 'Weekly Breakdown', icon: CalendarDays },
    { id: 'sec-daily', label: 'Daily Breakdown', icon: Sun },
    { id: 'sec-resources', label: 'Resources', icon: BookOpen },
    { id: 'sec-risks', label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'sec-suggestions', label: 'AI Suggestions', icon: Lightbulb },
    { id: 'sec-progress', label: 'Progress Tracker', icon: BarChart3 },
    { id: 'sec-templates', label: 'Templates', icon: Layers }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs lg:hidden"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/90 shadow-2xl p-5 flex flex-col justify-between overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Canvas Navigator</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section Navigation Jump Links */}
          <div className="space-y-1 mb-6">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 px-2">Jump to Section</span>
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    scrollToSection(sec.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all cursor-pointer text-left"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Template Switcher */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block px-2">Quick Switch Template</span>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {PLANNING_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-indigo-100 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate pr-2">{tmpl.title}</span>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${tmpl.bgColor}`}>
                    {tmpl.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono text-center">
          TaskPilot AI Planning Canvas v2.0
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default CanvasSidebar;
