import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/loaders/LoadingSpinner';

export const AuthenticationLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to dashboard if session already active
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-glow-radial">
      
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Shared Auth Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mb-8">
        <Link to="/" className="flex flex-col items-center gap-3">
          <div className="p-3 bg-indigo-600/10 border border-indigo-500/25 rounded-2xl shadow-glow">
            <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white uppercase">
            TaskPilot <span className="text-indigo-400 font-black">AI</span>
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
