import React from 'react';

export const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 w-full ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-5 border border-white/5 bg-[#18181b]/30 rounded-2xl flex flex-col gap-3 animate-pulse">
          <div className="w-1/3 h-4 bg-zinc-800 rounded-md" />
          <div className="w-full h-8 bg-zinc-800/60 rounded-md" />
          <div className="flex gap-4 border-t border-white/5 pt-3">
            <div className="w-16 h-3 bg-zinc-800 rounded" />
            <div className="w-20 h-3 bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
