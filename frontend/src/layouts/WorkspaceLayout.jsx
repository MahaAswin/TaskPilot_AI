import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/loaders/LoadingSpinner';

export const WorkspaceLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] overflow-hidden">
      <Navbar />
      <div className="flex-1 w-full bg-zinc-950/20 relative flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default WorkspaceLayout;
