import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, RotateCcw, Clock, ShieldAlert, ArrowLeft, ChevronRight, Scale, Store, Truck } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">Terms of Service</span>
        </div>

        {/* Hero Banner Header */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-700/50 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              <Scale className="w-4 h-4" />
              <span>Customer Agreement & Rules</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              OneMart Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              These terms govern your use of the OneMart retail website, express 15-minute store pickups, home grocery deliveries, promotions, and 7-day return policies.
            </p>
            <p className="text-[11px] text-amber-300 font-mono pt-1">
              Last Updated: August 2026 • Valid for All Orders
            </p>
          </div>
        </div>

        {/* Terms Content Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center justify-center">1</span>
              <span>Account Registration & Eligibility</span>
            </h2>
            <p>
              By creating an account on OneMart, you represent that you are at least 18 years old and capable of entering into legally binding contracts. You are responsible for keeping your login credentials confidential and for all orders placed through your account.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center justify-center">2</span>
              <span>Everyday Wholesale Pricing & Product Weights</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">Dynamic Daily Produce Pricing</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Prices for fresh vegetables, fruits, and dairy are updated daily based on farm harvest indices. The price charged is the price displayed at the moment of order checkout.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">Standardized Packaging & Units</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  All staples, oils, and packaged goods are weighed and labeled accurately according to Legal Metrology guidelines before dispatch.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center justify-center">3</span>
              <span>Express Fulfillment: Store Pickup & Home Delivery</span>
            </h2>
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-start space-x-3">
                <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-950 dark:text-emerald-200 text-xs">15-Minute Store Counter Pickup</p>
                  <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80">
                    Orders marked for store pickup will be packed and staged at your selected OneMart hub. You must present the 6-digit pickup verification OTP generated in your account order receipt.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-start space-x-3">
                <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-950 dark:text-emerald-200 text-xs">Home Grocery Delivery</p>
                  <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80">
                    Orders over ₹500 qualify for free home delivery. Please ensure an authorized recipient is available at the provided delivery address.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center justify-center">4</span>
              <span>7-Day Easy Return & Instant Refund Rules</span>
            </h2>
            <p>
              We stand behind product freshness. If you receive an item that is damaged, defective, or not as described:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li><strong>Return Window:</strong> Non-perishable pantry staples, cleaners, and packaged groceries carry a 7-day return window.</li>
              <li><strong>Fresh Produce & Dairy:</strong> Fresh vegetables and dairy must be reported within 24 hours of delivery for immediate replacement or full refund credit.</li>
              <li><strong>Refund Processing:</strong> Approved refunds are credited back to the original payment source or instant store balance within 24–48 hours.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center justify-center">5</span>
              <span>Vouchers, Promotions & Spin-and-Win</span>
            </h2>
            <p>
              Promotional codes (such as VIP <code>SAVE50</code>) and daily spin-and-win discounts are non-transferable, single-use per customer account, and subject to minimum order requirements stated on the coupon.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center justify-center">6</span>
              <span>Fair Usage & Fraud Prevention</span>
            </h2>
            <p>
              OneMart reserves the right to suspend accounts or cancel orders that violate fair usage, including automated bot scraping, coupon abuse, unauthorized commercial reselling, or submitting fraudulent return requests.
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Supermarket</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
