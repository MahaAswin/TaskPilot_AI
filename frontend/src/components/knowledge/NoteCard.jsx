import React from 'react';
import { Pin, Star, Trash2, Edit3, Eye, Calendar, Copy, Archive } from 'lucide-react';
import { motion } from 'framer-motion';

export const NoteCard = ({ 
  note, 
  onSelect, 
  onTogglePin, 
  onToggleFavorite, 
  onDelete, 
  onDuplicate, 
  onEdit 
}) => {
  const difficultyColors = {
    beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
    intermediate: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
    advanced: 'bg-rose-50 text-rose-700 border-rose-200/50'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glassmorphism-card p-5 bg-white border border-slate-200 rounded-2xl shadow-soft flex flex-col justify-between h-full select-none"
    >
      <div className="space-y-3">
        {/* Top meta tags */}
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200/50">
            {note.category || 'General'}
          </span>
          <span className={`px-2 py-0.5 rounded-lg border ${difficultyColors[note.difficulty || 'intermediate']}`}>
            {note.difficulty}
          </span>
        </div>

        {/* Title & description */}
        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-snug hover:text-indigo-600 cursor-pointer" onClick={() => onSelect(note)}>
            {note.title}
          </h4>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
            {note.topic} &middot; {note.description || 'No summary notes logged.'}
          </p>
        </div>

        {/* Tag chips */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {note.tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-50 border border-slate-200/40 text-slate-400 px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wide">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
        {/* Date block */}
        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        </div>

        {/* Actions panel */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onTogglePin(note._id, !note.isPinned)}
            className="p-1 hover:bg-slate-50 border border-slate-200/50 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'text-indigo-600 fill-indigo-600 rotate-45' : 'rotate-45'}`} />
          </button>
          
          <button 
            onClick={() => onToggleFavorite(note._id, !note.isFavorite)}
            className="p-1 hover:bg-slate-50 border border-slate-200/50 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
          </button>

          <button 
            onClick={() => onDuplicate(note)}
            title="Duplicate"
            className="p-1 hover:bg-slate-50 border border-slate-200/50 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={() => onEdit(note)}
            title="Edit"
            className="p-1 hover:bg-slate-50 border border-slate-200/50 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={() => onDelete(note._id)}
            title="Delete"
            className="p-1 hover:bg-rose-50 border border-rose-100 rounded-lg text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
