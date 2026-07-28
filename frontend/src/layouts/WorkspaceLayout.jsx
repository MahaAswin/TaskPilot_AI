import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/loaders/LoadingSpinner';

export const WorkspaceLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary overflow-hidden">
      <Navbar />
      <div className="flex-1 w-full bg-slate-100/30 relative flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default WorkspaceLayout;
