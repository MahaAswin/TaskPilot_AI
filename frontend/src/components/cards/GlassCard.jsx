import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ 
  children, 
  className = '', 
  hover = true, 
  onClick = null 
}) => {
  const baseClasses = `rounded-2xl p-6 border transition-all duration-300 ${
    onClick ? 'cursor-pointer' : ''
  } border-white/5 bg-[#18181b]/50 backdrop-blur-lg shadow-glass ${className}`;

  if (!hover) {
    return (
      <div className={baseClasses} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01, borderColor: 'rgba(99, 102, 241, 0.2)' }}
      className={baseClasses}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
