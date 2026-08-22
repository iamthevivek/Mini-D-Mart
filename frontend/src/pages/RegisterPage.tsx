import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
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
      await register(name, email, password, phone.trim() || undefined);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Store className="w-7 h-7" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create Customer Account</h2>
          <p className="text-xs text-gray-500">Join Mini D-Mart for daily grocery deals and fast delivery</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Mobile Phone (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {password.length > 0 && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-[11px]">
                <p className="font-bold text-gray-700 mb-1">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-1 text-gray-600">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-bold' : ''}`}>
                    {hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} At least 8 characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasUpperCase ? 'text-emerald-600 font-bold' : ''}`}>
                    {hasUpperCase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} 1 uppercase letter
                  </span>
                  <span className={`flex items-center gap-1 ${hasLowerCase ? 'text-emerald-600 font-bold' : ''}`}>
                    {hasLowerCase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} 1 lowercase letter
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-bold' : ''}`}>
                    {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} 1 number (0-9)
                  </span>
                  <span className={`flex items-center gap-1 col-span-2 ${hasSpecialChar ? 'text-emerald-600 font-bold' : ''}`}>
                    {hasSpecialChar ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} 1 special character (@$!%*?&#)
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-[10px] text-red-500 mt-1 font-semibold">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isPasswordValid || !passwordsMatch}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Register & Start Shopping'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
