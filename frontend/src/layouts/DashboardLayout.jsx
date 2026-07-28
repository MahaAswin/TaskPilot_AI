import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Loader2, Cpu } from 'lucide-react';

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If verifying token, show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-125 animate-pulse-glow" />
          <div className="relative p-4 bg-zinc-900 border border-white/10 rounded-2xl animate-bounce">
            <Cpu className="w-10 h-10 text-indigo-500" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase font-mono">
            Booting TaskPilot AI Core...
          </span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full bg-glow-radial">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
