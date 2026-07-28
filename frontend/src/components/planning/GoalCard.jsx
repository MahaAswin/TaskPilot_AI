import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Mic, Paperclip, Calendar, Clock, Flag, 
  BarChart, Tag, ArrowRight, CheckCircle, AlertCircle, FileText,
  Volume2, Trash2, Shield, UploadCloud
} from 'lucide-react';
import { SAMPLE_PROMPTS } from '../../constants/planningTemplates';

export const GoalCard = ({ 
  goal, 
  onUpdateGoal, 
  onGeneratePlan, 
  isGenerating,
  onApplyPrompt
}) => {
  const [naturalPrompt, setNaturalPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([
    { name: 'Syllabus_Or_Requirement.pdf', size: '1.2 MB' }
  ]);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);

  const CATEGORIES = [
    'Career', 'Software', 'Cyber Security', 'Academics', 
    'Health & Fitness', 'Project', 'Competitive Exam', 'Business', 'Personal'
  ];

  const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const PRIORITIES = ['low', 'medium', 'high'];

  const handlePromptClick = (promptText) => {
    setNaturalPrompt(promptText);
    if (onApplyPrompt) onApplyPrompt(promptText);
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setNaturalPrompt("I have placements in 2 months and need a complete DSA + System Design roadmap.");
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFiles([...attachedFiles, { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` }]);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── 1. GOAL INPUT SECTION ────────────────────────────────────────── */}
      <section id="sec-goal-input" className="glassmorphism-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle Ambient Light Gradient Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Describe Your Goal</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Describe any objective in natural language. Future AI will build a complete execution roadmap for you.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/60 rounded-full text-[10px] font-black uppercase tracking-wider">
                Natural Language AI Enabled
              </span>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Sample Natural Language Prompts:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-3 py-1.5 bg-slate-100/80 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-200 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Natural Language Prompt Input Bar */}
          <div className="relative">
            <textarea
              rows={3}
              value={naturalPrompt || goal?.description || ''}
              onChange={(e) => {
                setNaturalPrompt(e.target.value);
                onUpdateGoal({ ...goal, description: e.target.value });
              }}
              placeholder="e.g. 'I have placements in 2 months. I need to master DSA, CS Core, System Design and practice mock interviews...'"
              className="w-full p-4 pr-24 bg-white/90 border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 shadow-soft transition-all"
            />
            
            {/* Voice & Attachment Action Buttons Overlay */}
            <div className="absolute right-3 bottom-4 flex items-center gap-2">
              {/* Voice Placeholder */}
              <button
                onClick={toggleVoiceRecording}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                  isRecording 
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                }`}
                title="Voice Input (AI Voice Note Placeholder)"
              >
                <Mic className="w-4 h-4" />
                {isRecording && <span className="text-[10px] font-mono font-bold">Listening...</span>}
              </button>

              {/* Attachment Placeholder */}
              <label 
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer"
                title="Attach Document/Syllabus Placeholder"
              >
                <Paperclip className="w-4 h-4" />
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Voice recording animation status */}
          <AnimatePresence>
            {isRecording && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-rose-50/80 border border-rose-200 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-rose-700">Voice Input Active — Speak your goal clearly...</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 20, 8] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      className="w-1 bg-rose-400 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attached Files Pills */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400">Attachments:</span>
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200/80 rounded-xl text-slate-700 text-[11px] font-semibold">
                  <FileText className="w-3 h-3 text-indigo-600" />
                  <span>{file.name}</span>
                  <span className="text-[9px] text-slate-400">({file.size})</span>
                  <button onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))} className="ml-1 text-slate-400 hover:text-rose-500 cursor-pointer">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Goal Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            {/* Goal Title */}
            <div className="sm:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1.5">
                Goal Title
              </label>
              <input
                type="text"
                value={goal?.title || ''}
                onChange={(e) => onUpdateGoal({ ...goal, title: e.target.value })}
                placeholder="e.g. Master Full Stack Java Placement Preparation"
                className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-500" /> Category
              </label>
              <select
                value={goal?.category || 'Career'}
                onChange={(e) => onUpdateGoal({ ...goal, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1.5 flex items-center gap-1">
                <BarChart className="w-3 h-3 text-purple-500" /> Difficulty
              </label>
              <select
                value={goal?.difficulty || 'Intermediate'}
                onChange={(e) => onUpdateGoal({ ...goal, difficulty: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
              >
                {DIFFICULTIES.map(diff => <option key={diff} value={diff}>{diff}</option>)}
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-500" /> Deadline
              </label>
              <input
                type="date"
                value={goal?.deadline || '2026-09-30'}
                onChange={(e) => onUpdateGoal({ ...goal, deadline: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
              />
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" /> Estimated Hours
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                value={goal?.estimatedHours || 180}
                onChange={(e) => onUpdateGoal({ ...goal, estimatedHours: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1.5 flex items-center gap-1">
                <Flag className="w-3 h-3 text-rose-500" /> Priority
              </label>
              <select
                value={goal?.priority || 'high'}
                onChange={(e) => onUpdateGoal({ ...goal, priority: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer uppercase"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p} Priority</option>)}
              </select>
            </div>

            {/* Generate Plan Button */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGeneratePlan}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 text-white text-xs font-extrabold rounded-xl shadow-glow flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>{isGenerating ? 'Synthesizing Plan...' : 'Generate Plan'}</span>
              </motion.button>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. GOAL SUMMARY SECTION ────────────────────────────────────────── */}
      <section id="sec-goal-summary" className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Goal Summary Overview</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Target AI Canvas Roadmap</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Goal Name */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mb-1">Target Goal</span>
            <h4 className="text-xs font-bold text-slate-900 truncate" title={goal?.title}>
              {goal?.title || 'Placement Preparation'}
            </h4>
          </div>

          {/* Duration */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mb-1">Duration & Hours</span>
            <div className="text-xs font-extrabold text-indigo-600">
              {goal?.durationDays || 60} Days <span className="text-[10px] font-normal text-slate-500">({goal?.estimatedHours || 180}h)</span>
            </div>
          </div>

          {/* Priority */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mb-1">Priority</span>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
              goal?.priority === 'high' ? 'bg-rose-50 border-rose-200 text-rose-700' :
              goal?.priority === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              {goal?.priority || 'High'}
            </span>
          </div>

          {/* Difficulty */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mb-1">Difficulty</span>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-50 border border-purple-200 text-purple-700">
              {goal?.difficulty || 'Advanced'}
            </span>
          </div>

          {/* Status & Completion */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mb-1">Completion</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${goal?.completion || 35}%` }}
                />
              </div>
              <span className="text-xs font-mono font-black text-slate-800">{goal?.completion || 35}%</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default GoalCard;
