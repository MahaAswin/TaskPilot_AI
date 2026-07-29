import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="glassmorphism w-full border-b border-slate-200/80 bg-white/85 sticky top-0 z-50 backdrop-blur-xl flex flex-col shadow-sm">
      {/* Top ambient gradient line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-black text-base tracking-tight text-slate-900">
              TaskPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI</span>
            </span>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 hover:scale-105 transition-transform"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-all border border-transparent hover:border-slate-200"
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 hover:scale-105 transition-transform"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
