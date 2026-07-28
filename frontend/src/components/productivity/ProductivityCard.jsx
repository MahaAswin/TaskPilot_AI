import React from 'react';
import { motion } from 'framer-motion';
import { Zap, PieChart, Clock, Award, Shield, CheckCircle2 } from 'lucide-react';
import { TIME_ANALYSIS } from '../../constants/productivityMockData';

export const ProductivityCard = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-amber-500" />
          <span>Productivity Allocation & Work-Life Balance</span>
        </h4>
        <span className="text-[10px] font-mono text-slate-400">Time Split Breakdown</span>
      </div>

      <div className="space-y-3">
        {TIME_ANALYSIS.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-800 font-semibold">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                {item.category}
              </span>
              <span className="font-mono font-bold text-slate-600">{item.hours} hrs ({item.percentage}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Work-Life Balance Indicator */}
      <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-2xl flex items-center justify-between text-xs">
        <span className="font-bold text-amber-800 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-amber-600" /> Work-Life Balance Index
        </span>
        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-mono font-black">
          Optimal (7.5h Rest)
        </span>
      </div>
    </div>
  );
};

export default ProductivityCard;
