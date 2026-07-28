import React from 'react';
import { motion } from 'framer-motion';

export const ProgressRing = ({ 
  radius = 40, 
  stroke = 8, 
  progress = 0, 
  color = 'stroke-indigo-600', 
  trailColor = 'stroke-slate-100' 
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Trail circle */}
        <circle
          className={trailColor}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Animated progress circle */}
        <motion.circle
          className={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute text-xs font-black font-mono text-slate-800">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default ProgressRing;
