import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../constants/skillMockData';

export const CategoryCard = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Skill Category Matrix</span>
          </h3>
          <p className="text-[10px] text-slate-400">Evaluated performance across 10 core engineering and technology categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {SKILL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory?.id === cat.id;

          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory && onSelectCategory(cat)}
              className={`p-4 bg-white border rounded-2xl shadow-soft transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/20'
                  : 'border-slate-200/90 hover:border-indigo-200'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {cat.category}
                </span>
                <h4 className="text-xs font-black text-slate-900 truncate mt-1">{cat.title}</h4>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-600">{cat.score}% Score</span>
                <span className="text-[9px] font-mono text-slate-400 font-bold">{cat.level}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCard;
