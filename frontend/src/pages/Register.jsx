import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Cpu, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register: registerAction, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordVal = watch('password', '');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerAction(data.name, data.email, data.password);
      addToast('Registration complete! Welcome to TaskPilot.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-glow-radial">
      
      {/* Ambient blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-fuchsia-600/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="p-3 bg-indigo-600/10 border border-indigo-500/25 rounded-2xl shadow-glow">
            <Cpu className="w-8 h-8 text-indigo-500 animate-pulse" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white font-sans">
          Create <span className="text-gradient-primary">TaskPilot</span> Account
        </h2>
        <p className="mt-2 text-center text-xs text-zinc-400 font-medium">
          Initialize your multi-agent productivity core
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glassmorphism p-8 rounded-2xl shadow-glass border border-white/5">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Full Name
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-sm ${
                    errors.name ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400 font-semibold">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-sm ${
                    errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                  placeholder="name@domain.com"
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

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full pl-10 pr-10 py-2.5 rounded-xl glassmorphism-input text-sm ${
                    errors.password ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-400 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Confirm Password
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  className={`block w-full pl-10 pr-4 py-2.5 rounded-xl glassmorphism-input text-sm ${
                    errors.confirmPassword ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === passwordVal || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-400 font-semibold">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-glow text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:bg-indigo-800 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Booting Environment...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Workspace</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </div>

          </form>

          <div className="mt-6 flex flex-col gap-3 text-center border-t border-white/5 pt-4">
            <Link
              to="/login"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Already have an account? Log in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
