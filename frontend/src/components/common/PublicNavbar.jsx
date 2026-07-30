import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="w-full border-b border-white/10 bg-[#1B1E25]/90 sticky top-0 z-50 backdrop-blur-xl flex flex-col shadow-2xl">
      {/* Top ambient gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#E8B45D] via-[#57B5A8] to-[#E2836A]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo-icon.png" alt="TaskPilot AI Logo" className="w-7 h-7 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-black text-base tracking-tight text-white">
              TaskPilot <span className="text-[#E8B45D]">AI</span>
            </span>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-[#E8B45D] hover:bg-[#D4A253] text-[#14161B] text-xs font-bold rounded-xl shadow-lg shadow-amber-500/10 hover:scale-105 transition-all cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#ECEAE3] bg-[#242832] border border-white/10 hover:border-[#E8B45D]/40 hover:text-[#E8B45D] transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-[#E8B45D]" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-[#E8B45D] hover:bg-[#D4A253] text-[#14161B] text-xs font-bold rounded-xl shadow-lg shadow-amber-500/10 hover:scale-105 transition-all cursor-pointer"
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
