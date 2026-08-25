import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email.trim(), password);
      success('Welcome back!', `Signed in as ${user.name} (${user.role})`);

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'MANAGER') {
        navigate('/manager');
      } else if (user.role === 'STAFF') {
        navigate('/staff');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please check credentials.';
      setError(msg);
      toastError('Login Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Hero Column: Brand Experience & Trust (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-baseline leading-none">
                  <span className="text-xl font-black text-white">One</span>
                  <span className="text-xl font-black text-emerald-400">Mart</span>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-300">
                  SUPERMARKET & GROCERY
                </span>
              </div>
            </Link>

            <div className="space-y-3">
              <span className="inline-block bg-amber-400 text-emerald-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                FRESH SAVINGS EVERY DAY
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                Farm Fresh Produce at Everyday Wholesale Prices.
              </h2>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Sign in to manage your grocery cart, track live orders, and enjoy member-exclusive flash discounts.
              </p>
            </div>

            {/* Value Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">15-Min Express Pickup</p>
                  <p className="text-[11px] text-emerald-200/80">Pack ready zero-wait store collection</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">Free Delivery on ₹500+</p>
                  <p className="text-[11px] text-emerald-200/80">Direct from farm & wholesale hub</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">100% Quality Guaranteed</p>
                  <p className="text-[11px] text-emerald-200/80">7-Day instant refunds & replacements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-6 border-t border-emerald-800/80 flex items-center space-x-2 text-[11px] text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>256-Bit SSL Encrypted & Bank-Grade Auth</span>
          </div>
        </div>

        {/* Right Column: Modern Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Form Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials to access your OneMart account
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center space-x-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition shadow-2xs font-medium placeholder-slate-400"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-10 pr-11 py-3 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition shadow-2xs font-medium placeholder-slate-400"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/20 transition transform active:scale-98 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Your Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Register Redirect */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                New to OneMart?{' '}
                <Link
                  to="/register"
                  className="font-black text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </p>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Protected by 256-Bit SSL Encryption</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
