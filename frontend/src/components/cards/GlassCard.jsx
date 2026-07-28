import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', delay = 0, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`glassmorphism-card p-6 rounded-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
