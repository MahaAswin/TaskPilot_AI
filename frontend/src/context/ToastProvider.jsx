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
          className: 'glassmorphism border border-white/10 text-white',
          style: {
            background: 'rgba(24, 24, 27, 0.8)',
            color: '#f4f4f5',
            backdropFilter: 'blur(8px)',
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
