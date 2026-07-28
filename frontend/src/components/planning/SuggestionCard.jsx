import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, ArrowRight, Zap, RefreshCcw, Target, Award, Check } from 'lucide-react';

export const SuggestionCard = ({ suggestions = [], onApplySuggestion }) => {
  const defaultSuggestions = suggestions.length > 0 ? suggestions : [
    { id: 'sg-1', title: 'Increase Study Hours by 1.5h Daily', tag: 'Intensity', description: 'Based on target deadline, boosting daily hours ensures 100% curriculum coverage.', actionText: 'Apply Schedule Change' },
    { id: 'sg-2', title: 'Revise Core Java Concurrency Concepts', tag: 'Revision', description: 'Multithreading and ExecutorService are frequently tested in technical rounds.', actionText: 'Add to Revision Queue' },
    { id: 'sg-3', title: 'Practice 5 Hard DSA Problems Under Timer', tag: 'Speed', description: 'Simulate speed conditions to overcome online assessment anxiety.', actionText: 'Start Timed Quiz' },
    { id: 'sg-4', title: 'Schedule 2 Mock System Design Sessions', tag: 'Interview', description: 'Peer feedback on whiteboard diagrams will double system design confidence.', actionText: 'Book Mock Partner' },
    { id: 'sg-5', title: 'Improve Consistency: 7-Day Habit Streak', tag: 'Habits', description: 'Completing 1 task every morning increases plan completion rate by 40%.', actionText: 'Set Morning Alarm' }
  ];

  return (
    <section id="sec-suggestions" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>AI Smart Recommendations</span>
          </h3>
          <p className="text-xs text-slate-500">Actionable recommendations to accelerate goal completion. Future AI integration ready.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultSuggestions.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black uppercase rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {item.tag}
                </span>

                <span className="text-[9px] font-mono text-slate-400">Future AI Agent</span>
              </div>

              <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
              <p className="text-[11px] text-slate-600 leading-snug">{item.description}</p>
            </div>

            <button
              onClick={() => onApplySuggestion && onApplySuggestion(item)}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{item.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SuggestionCard;
