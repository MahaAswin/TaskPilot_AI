import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { loginSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastProvider';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      showSuccess('Session authenticated successfully!');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl shadow-2xl border border-white/10 bg-[#1B1E25]/90 backdrop-blur-lg">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-extrabold text-white font-sans uppercase">Log In Operator</h3>
        <p className="text-[10px] text-[#868C99] mt-1 font-semibold">Unlock Multi-Agent Productivity OS</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#868C99] mb-1.5">
            Email Address
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#868C99]">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              className={`block w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent border text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:ring-1 transition-all ${
                errors.email ? 'border-[#E2836A] focus:border-[#E2836A] focus:ring-[#E2836A]' : 'border-white/10 focus:border-[#E8B45D] focus:ring-[#E8B45D]'
              }`}
              placeholder="operator@taskpilot.ai"
              onFocus={(e) => e.target.select()}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-[10px] text-[#E2836A] font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#868C99] mb-1.5">
            Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#868C99]">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`block w-full pl-10 pr-10 py-2.5 rounded-xl bg-transparent border text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:ring-1 transition-all ${
                errors.password ? 'border-[#E2836A] focus:border-[#E2836A] focus:ring-[#E2836A]' : 'border-white/10 focus:border-[#E8B45D] focus:ring-[#E8B45D]'
              }`}
              placeholder="••••••••"
              onFocus={(e) => e.target.select()}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#868C99] hover:text-[#ECEAE3]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-[10px] text-[#E2836A] font-semibold">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-2xl hover:shadow-glow text-xs font-bold text-[#14161B] bg-[#E8B45D] hover:bg-[#D4A253] transition-all disabled:opacity-50 mt-6 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin text-[#14161B]" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Access Environment</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2.5 text-center border-t border-white/10 pt-4">
        <Link to="/register" className="text-[10px] text-[#E8B45D] hover:text-[#D4A253] font-bold transition-all">
          Don't have an account? Sign up
        </Link>
        <Link to="/forgot-password" className="text-[10px] text-[#868C99] hover:text-[#ECEAE3] font-semibold">
          Forgot password? Reset access keys
        </Link>
      </div>
    </div>
  );
};

export default Login;
