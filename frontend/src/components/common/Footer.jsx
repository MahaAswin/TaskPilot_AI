import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#09090b]/80 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-zinc-500 font-mono">
        <span>© 2026 TaskPilot AI. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-300">Terms of Service</a>
          <a href="#" className="hover:text-zinc-300">Documentation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
