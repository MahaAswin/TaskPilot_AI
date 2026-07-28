import React from 'react';
import { motion } from 'framer-motion';

export const GradientButton = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ y: 0, scale: 0.99 }}
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all shadow-soft hover:shadow-glow flex items-center justify-center gap-2 cursor-pointer border border-indigo-500/10 ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;
