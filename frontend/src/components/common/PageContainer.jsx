import React from 'react';
import { motion } from 'framer-motion';

export const PageContainer = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 min-h-[80vh] ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageContainer;
