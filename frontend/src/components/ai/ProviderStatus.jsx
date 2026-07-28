import React from 'react';

export const ProviderStatus = ({ status = 'online' }) => {
  const statusStyles = {
    online: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    degraded: 'bg-amber-50 text-amber-700 border-amber-200',
    offline: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold capitalize flex items-center gap-1 ${
      statusStyles[status] || statusStyles.online
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'online' ? 'bg-emerald-500' : status === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'
      }`} />
      <span>{status}</span>
    </span>
  );
};

export default ProviderStatus;
