import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Award, Loader2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
      };
      if (data.password) {
        payload.password = data.password;
      }

      await updateProfile(payload);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile settings.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans flex items-center gap-3">
          <User className="w-8 h-8 text-indigo-500" />
          <span>Workspace Settings</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-1 font-medium">
          Modify developer credentials and profile metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card View */}
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="flex flex-col items-center text-center">
            
            {/* Avatar Circle */}
            <div className="w-20 h-20 rounded-2xl border border-indigo-500/35 bg-indigo-600/10 flex items-center justify-center font-black text-2xl text-indigo-400 shadow-glow mb-4">
              {user?.name[0].toUpperCase()}
            </div>

            <h3 className="text-sm font-bold text-white">{user?.name}</h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">{user?.email}</p>

            <hr className="w-full border-white/5 my-4" />

            {/* Score Showcase */}
            <div className="w-full flex items-center justify-between p-3.5 bg-white/2 border border-white/5 rounded-xl text-left">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Productivity Score</span>
              </div>
              <span className="text-xs font-black text-emerald-400 font-mono">{user?.productivityScore}%</span>
            </div>

          </GlassCard>
        </div>

        {/* Update Form View */}
        <div className="md:col-span-2">
          <GlassCard>
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-6">Modify Credentials</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Full Name</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-sm ${
                      errors.name ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-400 font-semibold">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Email Address</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-sm ${
                      errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-400 font-semibold">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">New Password (leave empty to keep current)</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-sm ${
                      errors.password ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    placeholder="••••••••"
                    {...register('password', {
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-400 font-semibold">{errors.password.message}</p>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-xs font-bold text-white rounded-xl shadow-glow transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving settings...</span>
                    </>
                  ) : (
                    <span>Save Profiles</span>
                  )}
                </button>
              </div>

            </form>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default Profile;
