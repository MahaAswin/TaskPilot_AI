import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export const WorkspaceLayout = () => {
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
