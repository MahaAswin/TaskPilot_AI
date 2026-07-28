import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/50 flex flex-col items-center gap-3 text-center max-w-sm mx-auto shadow-sm">
      <AlertCircle className="w-6 h-6 text-rose-500" />
      <p className="text-[11px] font-semibold text-rose-700 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default ErrorState;
