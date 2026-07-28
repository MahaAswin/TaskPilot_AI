import React from 'react';

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div className={`rounded-full border-t-indigo-600 border-slate-200 animate-spin ${sizeClasses[size]}`} />
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Syncing Environment...</span>
    </div>
  );
};

export default LoadingSpinner;
