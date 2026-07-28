import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, ArrowRight, KeyRound } from 'lucide-react';
import { forgotPasswordSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastProvider';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retrievedToken, setRetrievedToken] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(data.email);
      showSuccess('Verification recovery request processed.');
      
      if (res.data?.resetToken) {
        setRetrievedToken(res.data.resetToken);
      }
    } catch (err) {
      showError(err.message || 'Request failed. Verify email configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glassmorphism p-8 rounded-2xl shadow-soft border border-slate-200 bg-white/90 backdrop-blur-lg space-y-5">
      <div className="text-center">
        <h3 className="text-lg font-extrabold text-slate-900 font-sans uppercase">Recover Credentials</h3>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold">Acquire reset token key associated with your email</p>
      </div>

      {retrievedToken ? (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-emerald-700 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold">
            <KeyRound className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>Token Dispatched Successfully!</span>
          </div>
          <p className="text-[10px] leading-relaxed font-semibold">
            Your verification token code is: <strong className="font-mono text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{retrievedToken}</strong>
          </p>
          <button
            onClick={() => navigate('/reset-password')}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors shadow-soft cursor-pointer"
          >
            Go to Reset Screen
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                  errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200'
                }`}
                placeholder="operator@taskpilot.ai"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-[10px] text-rose-500 font-semibold">{errors.email.message}</p>
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
                <span>Request Recovery Key</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="text-center border-t border-slate-100 pt-4">
        <Link to="/login" className="text-[10px] text-indigo-600 hover:text-indigo-500 font-bold transition-all">
          Return to login screen
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
