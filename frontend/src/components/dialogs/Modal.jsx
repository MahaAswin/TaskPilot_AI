import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg glassmorphism rounded-2xl shadow-glass border border-white/10 p-6 z-10 bg-[#18181b]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{title}</h3>
              <button 
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Close modal"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="text-zinc-300 text-xs">
              {children}
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
