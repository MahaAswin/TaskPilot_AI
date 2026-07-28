import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Loader2, ArrowRight, Key } from 'lucide-react';
import { resetPasswordSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastProvider';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.token, data.password);
      showSuccess('Password reset complete. Please log in with your new keys.');
      navigate('/login');
    } catch (err) {
      showError(err.message || 'Verification token is invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glassmorphism p-8 rounded-2xl shadow-soft border border-slate-200 bg-white/90 backdrop-blur-lg">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-extrabold text-slate-900 font-sans uppercase">Reset Account Keys</h3>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold">Configure fresh security keys for your workspace</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Token Code */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Verification Token
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Key className="h-4 w-4" />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                errors.token ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200'
              }`}
              placeholder="UUID TOKEN CODE"
              {...register('token')}
            />
          </div>
          {errors.token && (
            <p className="mt-1.5 text-[10px] text-rose-500 font-semibold">{errors.token.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            New Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type="password"
              className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                errors.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200'
              }`}
              placeholder="••••••••"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-[10px] text-rose-500 font-semibold">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type="password"
              className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                errors.confirmPassword ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200'
              }`}
              placeholder="••••••••"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-[10px] text-rose-500 font-semibold">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-soft hover:shadow-glow text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:opacity-50 mt-6 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Rewrite Account Keys</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-slate-100 pt-4">
        <Link to="/login" className="text-[10px] text-indigo-600 hover:text-indigo-500 font-bold transition-all">
          Return to login gate
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
