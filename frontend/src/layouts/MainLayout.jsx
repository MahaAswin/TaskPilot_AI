import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/common/PublicNavbar';
import Footer from '../components/common/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary">
      <PublicNavbar />
      <main className="flex-1 w-full bg-glow-radial">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
