import React from 'react';
import { motion } from 'framer-motion';

export const GradientButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  className = '' 
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative px-5 py-2.5 rounded-xl text-xs font-bold text-white tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90 transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;
