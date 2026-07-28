import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/loaders/LoadingSpinner';

export const AuthenticationLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-glow-radial text-textPrimary">
      
      {/* Light Theme Soft Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/3 rounded-full blur-[80px] pointer-events-none" />

      {/* Auth Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mb-6">
        <Link to="/" className="flex flex-col items-center gap-2">
          <div className="p-2.5 bg-indigo-50 border border-slate-200 rounded-2xl shadow-soft">
            <Cpu className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
          <span className="font-extrabold text-sm tracking-wider text-textPrimary uppercase mt-1">
            TaskPilot <span className="text-indigo-600 font-black">AI</span>
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticationLayout;
