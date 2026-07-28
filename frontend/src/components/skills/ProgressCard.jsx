import React from 'react';
import { motion } from 'framer-motion';
import { Clock, HelpCircle, CheckCircle2, Award, Flame, BarChart } from 'lucide-react';
import { TOPIC_ANALYSIS } from '../../constants/skillMockData';

export const ProgressCard = ({ topics = TOPIC_ANALYSIS }) => {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <BarChart className="w-4 h-4 text-indigo-600" />
            <span>Granular Topic Analysis & Mastery</span>
          </h3>
          <p className="text-[10px] text-slate-400">Detailed metric breakdown per individual study module.</p>
        </div>
      </div>

      <div className="space-y-3">
        {topics.map((tp) => (
          <motion.div
            key={tp.id}
            whileHover={{ y: -1 }}
            className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Topic info */}
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[9px] font-black uppercase">
                  {tp.category}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400">Confidence: {tp.confidence}</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">{tp.topic}</h4>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-2 md:pt-0 md:pl-4">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">Quiz Accuracy</span>
                <span className="font-bold text-emerald-600">{tp.quizAccuracy}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">Practice Count</span>
                <span className="font-bold text-slate-800">{tp.practiceCount} items</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">Study Time</span>
                <span className="font-bold text-slate-800">{tp.studyTime}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">Mastery Level</span>
                <span className="font-bold text-indigo-600">{tp.masteryLevel}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressCard;
