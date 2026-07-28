import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ServerError = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-6">
        <AlertTriangle className="w-12 h-12" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight mb-2">500 — System Error</h1>
      <p className="text-slate-400 text-xs max-w-md mb-8">
        An unhandled execution exception occurred in the agent dispatch pipeline. The Coordinator Agent has triggered automatic fallback recovery.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Reload Workspace Session</span>
      </button>
    </div>
  );
};

export default ServerError;
