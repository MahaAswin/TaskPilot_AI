import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.medium} text-indigo-500 animate-spin`} />
      <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase animate-pulse">
        Processing Data...
      </span>
    </div>
  );
};

export default LoadingSpinner;
