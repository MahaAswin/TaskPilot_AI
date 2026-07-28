import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { registerSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastProvider';

export const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerUser(data.name, data.email, data.password);
      showSuccess('Operator workspace initialized successfully!');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Registration failed. Email might already be claimed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glassmorphism p-8 rounded-2xl shadow-glass border border-white/5 bg-[#18181b]/45 backdrop-blur-lg">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-extrabold text-white font-sans uppercase">Create Operator Account</h3>
        <p className="text-[10px] text-zinc-500 mt-1">Configure fresh workspace profile credentials</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Full Name
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                errors.name ? 'border-rose-500 focus:border-rose-500' : ''
              }`}
              placeholder="John Doe"
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-[10px] text-rose-400 font-semibold">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Email Address
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                errors.email ? 'border-rose-500 focus:border-rose-500' : ''
              }`}
              placeholder="operator@taskpilot.ai"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-[10px] text-rose-400 font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`block w-full pl-10 pr-10 py-2.5 rounded-xl glassmorphism-input text-xs ${
                errors.password ? 'border-rose-500 focus:border-rose-500' : ''
              }`}
              placeholder="••••••••"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-[10px] text-rose-400 font-semibold">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Confirm Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type="password"
              className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-xs ${
                errors.confirmPassword ? 'border-rose-500 focus:border-rose-500' : ''
              }`}
              placeholder="••••••••"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-[10px] text-rose-400 font-semibold">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-glow text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:opacity-50 mt-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>Initializing Workspace...</span>
            </>
          ) : (
            <>
              <span>Register Credentials</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-white/5 pt-4">
        <Link to="/login" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-all">
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
};

export default Register;
