import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Operation',
  message = 'Are you sure you want to proceed? This change cannot be undone.',
  confirmLabel = 'Confirm Action',
  confirmType = 'danger' // 'danger' | 'primary'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-white/2 p-4 rounded-xl border border-white/5">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-zinc-300 text-xs leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${
              confirmType === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500 shadow-glow shadow-rose-600/10'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-glow'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
