import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Gift,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[@$!%*?&#^]/.test(password);
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (!isPasswordValid) {
      setError('Password must meet all security requirements');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const user = await register(name, email, password, phone.trim() || undefined);
      success('Account Created!', `Welcome to Mini D-Mart, ${user.name}!`);
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setError(msg);
      toastError('Registration Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Hero Column: Member Benefits (Desktop) */}
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
                JOIN VIP MEMBERSHIP
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                Unlock ₹50 OFF & Exclusive Flash Deals.
              </h2>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Create your verified customer account today for express 15-min counter pickup, live delivery updates, and member discounts.
              </p>
            </div>

            {/* Perks */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">₹50 Welcome Voucher</p>
                  <p className="text-[11px] text-emerald-200/80">Instant coupon applied to first order</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">Priority Express Delivery</p>
                  <p className="text-[11px] text-emerald-200/80">Direct from neighborhood store hub</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-6 border-t border-emerald-800/80 flex items-center space-x-2 text-[11px] text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Encrypted Data & Privacy Protected</span>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-5">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Create Account
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your details to join OneMart
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center space-x-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition shadow-2xs font-medium placeholder-slate-400"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition shadow-2xs font-medium placeholder-slate-400"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone (Optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition shadow-2xs font-medium placeholder-slate-400"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-11 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition shadow-2xs font-medium placeholder-slate-400"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              {password.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1 text-[11px]">
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Security Checklist:</p>
                  <div className="grid grid-cols-2 gap-1 text-slate-600 dark:text-slate-400">
                    <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                      {hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 8+ chars
                    </span>
                    <span className={`flex items-center gap-1 ${hasUpperCase ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                      {hasUpperCase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 1 uppercase
                    </span>
                    <span className={`flex items-center gap-1 ${hasLowerCase ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                      {hasLowerCase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 1 lowercase
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                      {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 1 number
                    </span>
                    <span className={`flex items-center gap-1 col-span-2 ${hasSpecialChar ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                      {hasSpecialChar ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 1 special char (@$!%*?&#)
                    </span>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition shadow-2xs font-medium placeholder-slate-400"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-[10px] text-rose-500 mt-1 font-bold">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isPasswordValid || !passwordsMatch}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/20 transition transform active:scale-98 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register & Start Shopping</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Login Redirect */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-black text-emerald-600 dark:text-emerald-400 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
