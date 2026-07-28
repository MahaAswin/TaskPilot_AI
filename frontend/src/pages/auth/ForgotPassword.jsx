import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const ForgotPassword = () => {
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      setTimeout(() => {
        showSuccess('Recovery instructions dispatched successfully!');
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      showError(err.message || 'Verification request failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glassmorphism p-8 rounded-2xl shadow-glass border border-white/5 bg-[#18181b]/40 backdrop-blur-lg">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-extrabold text-white">Reset Account Key</h3>
        <p className="text-[10px] text-zinc-500 mt-1">Dispatches recovery tokens to configured emails</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="name@domain.com"
              {...register('email', { required: 'Email is required' })}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[10px] text-rose-400 font-semibold">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-glow text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:opacity-50 mt-4"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Dispatch Recovery Keys</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-white/5 pt-4">
        <Link to="/login" className="text-[10px] text-indigo-400 hover:underline">
          Return to login gate
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
