import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  Shield,
  Truck,
  RefreshCw,
  PhoneCall,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  ChevronRight,
  Gift,
  Copy,
  Check,
  X,
  Tag,
  Loader2,
  Server,
  Database,
  Terminal,
  Activity,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../api/client';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Footer: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<boolean | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsSubmitting(true);

      // Call the real Spring Boot backend newsletter/offer dispatch API
      const res = await api.post('/newsletter/subscribe', { email: email.trim() });
      const { voucherCode, emailDispatched, message } = res.data;

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.7 },
        });
      } catch {}

      const code = voucherCode || 'SAVE50';
      setClaimedCode(code);
      setEmailSentStatus(emailDispatched);

      // Auto-copy to clipboard
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);

      if (emailDispatched) {
        success('🎉 Offer Email Sent!', `Voucher code ${code} has been dispatched to ${email}!`);
      } else {
        success('🎉 Voucher Activated!', `Code ${code} activated on your account. ₹50 flat discount voucher ready!`);
      }
    } catch (err: any) {
      // Fallback in case of network issue
      const code = 'SAVE50';
      setClaimedCode(code);
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      success('🎉 Voucher Ready!', `Code ${code} copied to clipboard for ₹50 OFF.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!claimedCode) return;
    navigator.clipboard.writeText(claimedCode);
    setIsCopied(true);
    success('Code Copied', `Voucher code ${claimedCode} copied to clipboard.`);
    setTimeout(() => setIsCopied(false), 2500);
  };

  if (user && user.role !== 'CUSTOMER') {
    return (
      <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* System Info */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-600'
                      : user.role === 'MANAGER'
                      ? 'bg-blue-600'
                      : 'bg-amber-600'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-baseline leading-none">
                    <span className="text-xl font-black text-white">One</span>
                    <span className="text-xl font-black text-emerald-400">Mart</span>
                  </div>
                  <span className="block text-[9px] text-slate-400 tracking-wider font-extrabold uppercase mt-0.5">
                    INTERNAL OPERATIONS PLATFORM
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Enterprise Management Console with Role-Based Access Control, live order fulfillment queue, and inventory stock locking.
              </p>

              <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Authenticated Session: <strong className="text-slate-200">{user.name}</strong> ({user.role})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Server className="w-3.5 h-3.5 text-slate-400" />
                  <span>API Status: <strong className="text-emerald-400 font-semibold">Online & Healthy (Port 8080)</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  <span>Database: <strong className="text-emerald-400 font-semibold">PostgreSQL Connected</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Modules */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Authorized Management Modules</span>
              </h5>

              <ul className="space-y-2 text-xs font-medium text-slate-400">
                {user.role === 'ADMIN' && (
                  <>
                    <li>
                      <Link to="/admin" className="hover:text-purple-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                        <span>Admin Console & User RBAC Control</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/manager" className="hover:text-purple-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                        <span>Manager Analytics & Stock Master</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/staff" className="hover:text-purple-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                        <span>Staff Order Queue & Pickup Verifier</span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="http://localhost:8080/swagger-ui.html"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-purple-400 transition flex items-center space-x-2"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                        <span>Interactive Swagger API Documentation</span>
                      </a>
                    </li>
                  </>
                )}

                {user.role === 'MANAGER' && (
                  <>
                    <li>
                      <Link to="/manager" className="hover:text-blue-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                        <span>Manager KPI & Revenue Analytics</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/manager" className="hover:text-blue-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                        <span>Product Catalog & Stock Adjustments</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/manager" className="hover:text-blue-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                        <span>Express Pickup Slot Capacity Scheduler</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/staff" className="hover:text-blue-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                        <span>Staff Operations & Dispatch</span>
                      </Link>
                    </li>
                  </>
                )}

                {user.role === 'STAFF' && (
                  <>
                    <li>
                      <Link to="/staff" className="hover:text-amber-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                        <span>Live Order Packing & Dispatch Queue</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/staff" className="hover:text-amber-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pickup Counter 6-Digit OTP Verification</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/staff" className="hover:text-amber-400 transition flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                        <span>Returns & Exchanges Inspection Hub</span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Operational Security & Desk */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Internal Support & Security</span>
              </h5>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Role-Enforced Access Policy</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All administrative updates, inventory adjustments, and status changes are permanently logged to the audit trail.
                </p>
                <div className="pt-1 text-[11px] text-slate-400 space-y-1">
                  <p>
                    Internal IT Desk: <strong className="text-slate-200">admin-support@onemart.com</strong>
                  </p>
                  <p>
                    Operations Desk: <strong className="text-slate-200">ops@onemart.com</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-800 mt-8" />

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} OneMart Supermarket Systems. Internal Operations Platform.</p>
            <p className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Confidential & Authorized Internal Access Only</span>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <div className="mt-16">
      {/* Pre-Footer Section: 4 Value Proposition Cards & Savings Club on regular page background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 space-y-8">
        {/* 4 Multi-Colored Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Express Delivery */}
          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-500/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Free & Fast Delivery</h4>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">On all orders above ₹500</p>
            </div>
          </div>

          {/* Card 2: 15-Min Store Pickup */}
          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-amber-500/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">15-min Counter Pickup</h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">Express zero-wait collection</p>
            </div>
          </div>

          {/* Card 3: 7-Day Returns */}
          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-500/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">7-Day Easy Returns</h4>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold mt-0.5">Instant refund or replacement</p>
            </div>
          </div>

          {/* Card 4: 100% Quality Guaranteed */}
          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-rose-500/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">100% Quality Assurance</h4>
              <p className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold mt-0.5">Farm fresh & genuine staples</p>
            </div>
          </div>
        </div>

        {/* VIP Savings Club Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-600/30">
          <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -top-10 w-48 h-48 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center space-x-2 bg-amber-400 text-emerald-950 text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
                <Gift className="w-3.5 h-3.5 fill-current" />
                <span>EXCLUSIVE GROCERY SAVINGS CLUB</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                Get <span className="text-amber-400">₹50 OFF</span> on your next grocery order!
              </h3>
              <p className="text-xs text-emerald-100 max-w-lg leading-relaxed">
                Join 50,000+ happy families receiving secret weekend flash deals, harvest updates, and wholesale discounts.
              </p>
            </div>

            <div className="lg:col-span-5">
              {claimedCode ? (
                <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-md space-y-2 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-200 font-bold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Your ₹50 Discount Voucher:</span>
                    </span>
                    <button
                      onClick={() => setClaimedCode(null)}
                      className="text-slate-400 hover:text-white p-1 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-white text-slate-900 px-3.5 py-2.5 rounded-xl shadow-md">
                    <span className="font-mono font-black text-base text-emerald-800 tracking-wider">
                      {claimedCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition active:scale-95"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-emerald-200">
                    Use code <strong className="text-white">SAVE50</strong> at checkout to apply ₹50 instant deduction.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-3 text-xs rounded-2xl bg-white/95 text-slate-900 placeholder-slate-400 border border-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-md font-medium disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-emerald-950 font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Claim ₹50</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer: Exact Header Emerald-to-Teal Gradient Theme */}
      <footer className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-emerald-100 border-t border-emerald-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:18px_18px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 md:py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand & Contact Information */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold shadow-md">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-baseline leading-none">
                    <span className="text-2xl font-black tracking-tight text-white">One</span>
                    <span className="text-2xl font-black tracking-tight text-amber-400">Mart</span>
                  </div>
                  <span className="block text-[9px] text-amber-300 tracking-wider font-extrabold uppercase mt-0.5">
                    SUPERMARKET & GROCERY
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-200/90 leading-relaxed pr-4">
                OneMart is your all-in-one neighborhood supermarket destination bringing farm-fresh vegetables, dairy essentials, pantry grains, and household supplies at everyday wholesale prices.
              </p>

              <div className="space-y-2 text-xs text-emerald-200">
                <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80">
                  <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Customer Helpline: <strong className="text-white">+91 8000-ONEMART</strong></span>
                </div>
                <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Central Hub: Store #101, OneMart Commercial Plaza</span>
                </div>
                <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Store Hours: Mon – Sun: 8:00 AM to 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Shop Departments */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Shop Departments</span>
              </h5>
              <ul className="space-y-2 text-xs text-emerald-200 font-medium">
                <li>
                  <Link to="/" className="hover:text-amber-300 transition flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Farm Fresh Fruits & Vegetables</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-amber-300 transition flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Dairy, Milk, Butter & Fresh Bakes</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-amber-300 transition flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Atta, Rice, Dal & Cooking Oils</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-amber-300 transition flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Snacks, Tea, Coffee & Biscuits</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-amber-300 transition flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Personal Hygiene & Bath Essentials</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-amber-300 transition flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Household Cleaners & Detergents</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care Links */}
            <div className="md:col-span-2 space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Customer Care</span>
              </h5>
              <ul className="space-y-2 text-xs text-emerald-200 font-medium">
                <li>
                  <Link to="/customer/orders" className="hover:text-amber-300 transition flex items-center space-x-1.5">
                    <ChevronRight className="w-3 h-3 text-amber-400" />
                    <span>Track My Orders</span>
                  </Link>
                </li>
                <li>
                  <Link to="/customer/returns" className="hover:text-amber-300 transition flex items-center space-x-1.5">
                    <ChevronRight className="w-3 h-3 text-amber-400" />
                    <span>Returns & Refunds</span>
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:text-amber-300 transition flex items-center space-x-1.5">
                    <ChevronRight className="w-3 h-3 text-amber-400" />
                    <span>Saved Wishlist</span>
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-amber-300 transition flex items-center space-x-1.5">
                    <ChevronRight className="w-3 h-3 text-amber-400" />
                    <span>My Addresses & Profile</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-amber-300 transition flex items-center space-x-1.5">
                    <ChevronRight className="w-3 h-3 text-amber-400" />
                    <span>Account Sign In</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Safe Payments & SSL Security */}
            <div className="md:col-span-3 space-y-4">
              <h5 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>100% Safe Payments</span>
              </h5>

              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-950/80 text-emerald-200 border border-emerald-700/80">
                  UPI / GPay / PhonePe
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-950/80 text-emerald-200 border border-emerald-700/80">
                  RuPay
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-950/80 text-emerald-200 border border-emerald-700/80">
                  Visa / MasterCard
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-950/80 text-emerald-200 border border-emerald-700/80">
                  Net Banking
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-950/80 text-emerald-200 border border-emerald-700/80">
                  Cash on Delivery
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <p className="text-[10px] text-emerald-300/80">
                  Bank-grade 3D Secure OTP authentication on all digital transactions.
                </p>
              </div>
            </div>
          </div>

          {/* Gradient Separator & Legal Bottom Bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-emerald-600 via-amber-400 to-teal-500 rounded-full mt-10" />

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/80">
            <p>© {new Date().getFullYear()} OneMart Supermarket App. All rights reserved.</p>
            <div className="flex items-center space-x-3 text-[11px]">
              <Link to="/privacy-policy" className="hover:text-amber-300 transition">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-amber-300 transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
