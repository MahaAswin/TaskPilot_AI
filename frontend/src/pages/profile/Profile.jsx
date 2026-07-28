import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { User } from 'lucide-react';

export const Profile = () => {
  return (
    <PageContainer>
      <div className="border-b border-white/5 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          <span>USER PROFILE</span>
        </h1>
        <p className="text-[10px] text-zinc-500 mt-1">Credentials settings and baseline ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-center font-bold text-lg text-indigo-400">
            OP
          </div>
          <h4 className="text-xs font-bold text-white mt-4">John Doe</h4>
          <p className="text-[10px] text-zinc-500 mt-1 font-mono">operator@taskpilot.ai</p>
        </GlassCard>

        <div className="md:col-span-2">
          <GlassCard>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Baseline Stats</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Profile routes mapped to `/api/profile`. Implement authentication in future modules to load active MongoDB profiles.
            </p>
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
