import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Award, Loader2, LogOut, Flame, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastProvider';
import { profileSchema, passwordChangeSchema } from '../../utils/validation';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';

export const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Profile info form
  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: infoErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      profileImage: user?.profileImage || ''
    }
  });

  // Password change form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordChangeSchema)
  });

  const onUpdateInfoSubmit = async (data) => {
    setIsUpdatingInfo(true);
    try {
      await updateProfile({
        name: data.name,
        email: data.email,
        profileImage: data.profileImage
      });
      showSuccess('Profile details saved successfully!');
    } catch (err) {
      showError(err.message || 'Failed to save profile configurations.');
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const onUpdatePasswordSubmit = async (data) => {
    setIsUpdatingPassword(true);
    try {
      await changePassword(data.oldPassword, data.newPassword);
      showSuccess('Account credentials changed successfully!');
      resetPasswordForm();
    } catch (err) {
      showError(err.message || 'Failed to alter password configuration.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="border-b border-white/10 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
            <User className="w-5 h-5 text-[#E8B45D]" />
            <span>OPERATOR SETTINGS</span>
          </h1>
          <p className="text-[10px] text-[#868C99] mt-1 font-semibold">Configure profile details and credentials</p>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E2836A]/30 bg-[#E2836A]/10 hover:bg-[#E2836A]/20 text-[10px] font-bold text-[#E2836A] rounded-xl transition-colors shadow-2xl cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card Summary & Stats */}
        <div className="space-y-6">
          <GlassCard className="flex flex-col items-center text-center">
            {/* Avatar block */}
            <div className="w-20 h-20 rounded-2xl border border-white/10 bg-[#242832] flex items-center justify-center font-black text-2xl text-[#E8B45D] shadow-2xl mb-4">
              {user?.name?.[0]?.toUpperCase() || 'OP'}
            </div>

            <h3 className="text-sm font-bold text-[#ECEAE3] leading-none">{user?.name}</h3>
            <span className="text-[10px] text-[#868C99] font-mono mt-1.5 font-semibold">{user?.email}</span>

            <div className="inline-flex items-center gap-1.5 mt-2 bg-[rgba(87,181,168,0.14)] border border-[#57B5A8]/30 text-[#57B5A8] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Operator Level {user?.level || 1}</span>
            </div>

            <hr className="w-full border-white/10 my-4" />

            {/* Performance Stats */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#242832] border border-white/10 rounded-xl text-left">
                <div className="flex items-center gap-2 text-[#868C99]">
                  <Award className="w-4 h-4 text-[#57B5A8]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Productivity Score</span>
                </div>
                <span className="text-xs font-black text-[#57B5A8] font-mono">{user?.productivityScore || 72}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#242832] border border-white/10 rounded-xl text-left">
                <div className="flex items-center gap-2 text-[#868C99]">
                  <Flame className="w-4 h-4 text-[#E8B45D] animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Daily Streak</span>
                </div>
                <span className="text-xs font-black text-[#E8B45D] font-mono">{user?.streak || 0} Days</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#242832] border border-white/10 rounded-xl text-left">
                <div className="flex items-center gap-2 text-[#868C99]">
                  <User className="w-4 h-4 text-[#E2836A]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Accumulated XP</span>
                </div>
                <span className="text-xs font-black text-[#E2836A] font-mono">{user?.xp || 0} XP</span>
              </div>
            </div>

          </GlassCard>
        </div>

        {/* Configurations Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Form 1: Profile Info */}
          <GlassCard>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Profile Attributes</h3>
            
            <form onSubmit={handleSubmitInfo(onUpdateInfoSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#868C99] mb-1.5">Full Name</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#868C99]">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent border text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:ring-1 transition-all ${
                        infoErrors.name ? 'border-[#E2836A] focus:border-[#E2836A] focus:ring-[#E2836A]' : 'border-white/10 focus:border-[#E8B45D] focus:ring-[#E8B45D]'
                      }`}
                      {...registerInfo('name')}
                    />
                  </div>
                  {infoErrors.name && (
                    <p className="mt-1 text-[9px] text-[#E2836A] font-semibold">{infoErrors.name.message}</p>
                  )}
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#868C99] mb-1.5">Email Address</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#868C99]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      className={`block w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent border text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:ring-1 transition-all ${
                        infoErrors.email ? 'border-[#E2836A] focus:border-[#E2836A] focus:ring-[#E2836A]' : 'border-white/10 focus:border-[#E8B45D] focus:ring-[#E8B45D]'
                      }`}
                      {...registerInfo('email')}
                    />
                  </div>
                  {infoErrors.email && (
                    <p className="mt-1 text-[9px] text-[#E2836A] font-semibold">{infoErrors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isUpdatingInfo}
                  className="px-4 py-2 bg-[#E8B45D] hover:bg-[#D4A253] disabled:opacity-50 text-[10px] font-bold text-[#14161B] rounded-xl shadow-2xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isUpdatingInfo ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#14161B]" />
                  ) : (
                    <span>Save Attributes</span>
                  )}
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Form 2: Password Change */}
          <GlassCard>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Change Password</h3>
            
            <form onSubmit={handleSubmitPassword(onUpdatePasswordSubmit)} className="space-y-4">
              
              {/* Current Password */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#868C99] mb-1.5">Current Password</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#868C99]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent border text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:ring-1 transition-all ${
                      passwordErrors.oldPassword ? 'border-[#E2836A] focus:border-[#E2836A] focus:ring-[#E2836A]' : 'border-white/10 focus:border-[#E8B45D] focus:ring-[#E8B45D]'
                    }`}
                    {...registerPassword('oldPassword')}
                  />
                </div>
                {passwordErrors.oldPassword && (
                  <p className="mt-1 text-[9px] text-[#E2836A] font-semibold">{passwordErrors.oldPassword.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#868C99] mb-1.5">New Password</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#868C99]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`block w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent border text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:ring-1 transition-all ${
                        passwordErrors.newPassword ? 'border-[#E2836A] focus:border-[#E2836A] focus:ring-[#E2836A]' : 'border-white/10 focus:border-[#E8B45D] focus:ring-[#E8B45D]'
                      }`}
                      {...registerPassword('newPassword')}
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-[9px] text-[#E2836A] font-semibold">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#868C99] mb-1.5">Confirm New Password</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#868C99]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`block w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent border text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:ring-1 transition-all ${
                        passwordErrors.confirmNewPassword ? 'border-[#E2836A] focus:border-[#E2836A] focus:ring-[#E2836A]' : 'border-white/10 focus:border-[#E8B45D] focus:ring-[#E8B45D]'
                      }`}
                      {...registerPassword('confirmNewPassword')}
                    />
                  </div>
                  {passwordErrors.confirmNewPassword && (
                    <p className="mt-1 text-[9px] text-[#E2836A] font-semibold">{passwordErrors.confirmNewPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-[#E8B45D] hover:bg-[#D4A253] disabled:opacity-50 text-[10px] font-bold text-[#14161B] rounded-xl shadow-2xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isUpdatingPassword ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#14161B]" />
                  ) : (
                    <span>Update Security Keys</span>
                  )}
                </button>
              </div>
            </form>
          </GlassCard>

        </div>

      </div>

    </PageContainer>
  );
};

export default Profile;
