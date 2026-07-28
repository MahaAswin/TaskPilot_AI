import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  onClick = null,
  delay = 0 
}) => {
  const cardClasses = `glassmorphism-card rounded-2xl p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`;

  if (!hoverEffect) {
    return (
      <div className={cardClasses} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className={cardClasses}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
