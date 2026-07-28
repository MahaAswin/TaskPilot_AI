import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Download, RefreshCw, Layers, ShieldCheck, 
  Search, SlidersHorizontal, Save, Calendar
} from 'lucide-react';

export const CanvasHeader = ({ 
  currentGoalTitle, 
  onExportClick, 
  onResetCanvas, 
  onToggleSidebar, 
  isSaving,
  searchQuery,
  setSearchQuery,
  activeTemplateTitle
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 lg:px-8 py-3.5 shadow-sm transition-all select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Title & Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-0.5 shadow-glow shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>AI Planning Canvas</span>
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200/60 rounded-full">
                v2.0 SaaS Light
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mt-0.5">
              <span className="truncate max-w-[240px] text-slate-700 font-semibold">
                {currentGoalTitle || 'Custom AI Planning Canvas'}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Auto-Saved Draft'}
              </span>
              {activeTemplateTitle && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-purple-600 font-medium">Template: {activeTemplateTitle}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center Search / Prompt Filter */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestones, tasks, topics, or resources..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100/70 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Right Controls & Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200/60"
            title="Toggle Navigation Sidebar"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          <button
            onClick={onResetCanvas}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-transparent hover:border-indigo-100 cursor-pointer"
            title="Reset Canvas to Default Template"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExportClick}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Plan</span>
          </motion.button>
        </div>

      </div>
    </header>
  );
};

export default CanvasHeader;
