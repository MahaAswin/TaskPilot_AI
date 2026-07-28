import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary">
      <Navbar />
      <main className="flex-1 w-full bg-glow-radial">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
