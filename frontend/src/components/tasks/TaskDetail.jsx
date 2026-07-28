import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Clock, Tag, Flag, AlertCircle, FileText, 
  CheckCircle, PlusCircle, Paperclip, ChevronRight, Edit2, Play
} from 'lucide-react';

export const TaskDetail = ({ task, onClose, onUpdateTask }) => {
  const [notes, setNotes] = useState(task.description || '');
  const [actualTime, setActualTime] = useState(task.completedTime || 0);

  if (!task) return null;

  const isCompleted = task.status === 'completed';

  const priorityColors = {
    high: 'bg-rose-50 border-rose-200 text-rose-700',
    medium: 'bg-amber-50 border-amber-200 text-amber-700',
    low: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    onUpdateTask({ ...task, description: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-5 flex flex-col justify-between h-full"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-indigo-600 block tracking-wider">Task Specification</span>
            <h4 className="text-sm font-extrabold text-slate-900">{task.title}</h4>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Priority & Category tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors.medium}`}>
            Priority: {task.priority}
          </span>
          <span className="text-[9px] font-bold text-slate-700 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
            Category: {task.category || 'General'}
          </span>
          <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
            isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            Status: {task.status}
          </span>
        </div>

        {/* Time allocation stats */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200/60 rounded-2xl">
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mb-0.5">Estimated Duration</span>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{task.estimatedTime || 30} minutes</span>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mb-0.5">Actual Time (AI Tracker)</span>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Play className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>{actualTime || 0} minutes</span>
            </div>
          </div>
        </div>

        {/* Attachments Placeholder */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Attachments & Documents</span>
          <div className="p-3 border border-dashed border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-slate-300" /> Drag files to attach...
            </span>
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 border border-indigo-200/60 rounded-xl cursor-pointer">
              Upload
            </span>
          </div>
        </div>

        {/* Editable Notes Section */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Description Notes</span>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            rows={4}
            placeholder="Write additional specifications, checklist items, or research links for this task..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-400">XP Reward: +{task.xpReward || 20} XP</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200/50"
        >
          Done
        </button>
      </div>

    </motion.div>
  );
};

export default TaskDetail;
