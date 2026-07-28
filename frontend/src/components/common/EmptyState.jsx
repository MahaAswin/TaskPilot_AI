import React from 'react';

export const EmptyState = ({ title, message, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center max-w-md mx-auto">
      {Icon && <Icon className="w-8 h-8 text-slate-400 mb-3" />}
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{message}</p>
    </div>
  );
};

export default EmptyState;
