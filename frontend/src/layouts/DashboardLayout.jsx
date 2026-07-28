import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Navbar />
      <div className="flex-1 flex overflow-hidden w-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-glow-radial">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
