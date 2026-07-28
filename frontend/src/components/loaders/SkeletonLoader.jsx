import React from 'react';

export const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className="p-5 bg-white border border-slate-200 rounded-2xl shadow-soft space-y-3 animate-pulse"
        >
          <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
          <div className="h-3 bg-slate-50 rounded-lg w-2/3" />
          <div className="h-3 bg-slate-50 rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
