import React, { createContext, useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const showSuccess = (message) => toast.success(message);
  const showError = (message) => toast.error(message);
  const showLoading = (message) => toast.loading(message);
  const dismiss = (id) => toast.dismiss(id);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showLoading, dismiss }}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'border border-slate-200 text-slate-900 shadow-soft',
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#0f172a',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            fontSize: '11px',
            fontWeight: '600',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
