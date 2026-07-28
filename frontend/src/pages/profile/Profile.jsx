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
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <span>OPERATOR SETTINGS</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">Configure profile details and credentials</p>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-[10px] font-bold text-rose-600 rounded-xl transition-colors shadow-soft cursor-pointer"
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
            <div className="w-20 h-20 rounded-2xl border border-indigo-200 bg-indigo-50/50 flex items-center justify-center font-black text-2xl text-indigo-600 shadow-glow mb-4">
              {user?.name?.[0]?.toUpperCase() || 'OP'}
            </div>

            <h3 className="text-sm font-bold text-slate-800 leading-none">{user?.name}</h3>
            <span className="text-[10px] text-slate-500 font-mono mt-1.5 font-semibold">{user?.email}</span>

            <div className="inline-flex items-center gap-1.5 mt-2 bg-indigo-50 border border-indigo-150 text-indigo-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Operator Level {user?.level || 1}</span>
            </div>

            <hr className="w-full border-slate-100 my-4" />

            {/* Performance Stats */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-left">
                <div className="flex items-center gap-2 text-slate-500">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Productivity Score</span>
                </div>
                <span className="text-xs font-black text-emerald-600 font-mono">{user?.productivityScore || 72}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-left">
                <div className="flex items-center gap-2 text-slate-500">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Daily Streak</span>
                </div>
                <span className="text-xs font-black text-amber-600 font-mono">{user?.streak || 0} Days</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-left">
                <div className="flex items-center gap-2 text-slate-500">
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Accumulated XP</span>
                </div>
                <span className="text-xs font-black text-purple-600 font-mono">{user?.xp || 0} XP</span>
              </div>
            </div>

          </GlassCard>
        </div>

        {/* Configurations Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Form 1: Profile Info */}
          <GlassCard>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-5">Profile Attributes</h3>
            
            <form onSubmit={handleSubmitInfo(onUpdateInfoSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                        infoErrors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200'
                      }`}
                      {...registerInfo('name')}
                    />
                  </div>
                  {infoErrors.name && (
                    <p className="mt-1 text-[9px] text-rose-500 font-semibold">{infoErrors.name.message}</p>
                  )}
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                        infoErrors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200'
                      }`}
                      {...registerInfo('email')}
                    />
                  </div>
                  {infoErrors.email && (
                    <p className="mt-1 text-[9px] text-rose-500 font-semibold">{infoErrors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isUpdatingInfo}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-[10px] font-bold text-white rounded-xl shadow-soft transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isUpdatingInfo ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Save Attributes</span>
                  )}
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Form 2: Password Change */}
          <GlassCard>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-5">Change Password</h3>
            
            <form onSubmit={handleSubmitPassword(onUpdatePasswordSubmit)} className="space-y-4">
              
              {/* Current Password */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Current Password</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                      passwordErrors.oldPassword ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200'
                    }`}
                    {...registerPassword('oldPassword')}
                  />
                </div>
                {passwordErrors.oldPassword && (
                  <p className="mt-1 text-[9px] text-rose-500 font-semibold">{passwordErrors.oldPassword.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">New Password</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                        passwordErrors.newPassword ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200'
                      }`}
                      {...registerPassword('newPassword')}
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-[9px] text-rose-500 font-semibold">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Confirm New Password</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                        passwordErrors.confirmNewPassword ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200'
                      }`}
                      {...registerPassword('confirmNewPassword')}
                    />
                  </div>
                  {passwordErrors.confirmNewPassword && (
                    <p className="mt-1 text-[9px] text-rose-500 font-semibold">{passwordErrors.confirmNewPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-[10px] font-bold text-white rounded-xl shadow-soft transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isUpdatingPassword ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
