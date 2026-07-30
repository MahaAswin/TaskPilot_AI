import React from 'react';

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-20 h-20',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-4 ${className}`}>
      <div className={`relative ${sizeClasses[size]} animate-pulse`}>
        <img src="/logo-icon.png" alt="TaskPilot AI Loading" className="w-full h-full object-contain" />
      </div>
      <span className="text-[10px] text-[#868C99] font-bold uppercase tracking-wider animate-pulse">Syncing Environment...</span>
    </div>
  );
};

export default LoadingSpinner;
