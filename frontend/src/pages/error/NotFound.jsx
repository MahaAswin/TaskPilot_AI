import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-6">
        <Compass className="w-12 h-12 animate-spin-slow" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 — Page Not Found</h1>
      <p className="text-slate-400 text-xs max-w-md mb-8">
        The requested agent navigation target or canvas module does not exist in the TaskPilot AI Operating System memory map.
      </p>

      <Link
        to="/dashboard"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl shadow-glow transition-all flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
