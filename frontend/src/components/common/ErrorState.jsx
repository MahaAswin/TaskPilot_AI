import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState = ({ 
  title = 'System Offline', 
  message = 'Gateway validation timed out or Mongo database is currently unreachable.', 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-rose-500/10 rounded-2xl bg-rose-550/5 max-w-md mx-auto gap-3">
      <div className="p-2.5 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">{title}</h4>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default ErrorState;
