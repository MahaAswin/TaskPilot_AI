import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-transparent py-6 text-center text-[10px] text-[#868C99] font-mono">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <img src="/logo-icon.png" alt="TaskPilot AI Logo" className="w-5 h-5 object-contain" />
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <span className="font-bold text-[#ECEAE3]">TaskPilot AI</span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="text-[#868C99]">Enterprise Multi-Agent AI Productivity Platform</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
