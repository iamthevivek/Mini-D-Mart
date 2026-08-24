import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ChevronRight, ArrowLeft, Mail, Phone, Clock, Store } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">Privacy Policy</span>
        </div>

        {/* Hero Banner Header */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-700/50 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4" />
              <span>Customer Data Protection</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              OneMart Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              We are committed to safeguarding your personal information, delivery addresses, and transactional privacy across all OneMart digital and store services.
            </p>
            <p className="text-[11px] text-emerald-300 font-mono pt-1">
              Last Updated: August 2026 • Effective Immediately
            </p>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center justify-center">1</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              When you use OneMart, we collect essential information required to process your grocery orders, provide express 15-minute counter pickup, and manage doorstep delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Contact & Account Data:</strong> Name, verified email address, phone number, and password hashes.</li>
              <li><strong>Delivery Information:</strong> Street address, city, pin code, state, and optional delivery location instructions.</li>
              <li><strong>Order & Transaction History:</strong> Items ordered, payment method chosen (e.g. UPI, Net Banking, COD), invoices, and return requests.</li>
              <li><strong>Device & Usage Data:</strong> IP address, browser type, recently viewed items, and cookies to keep your active shopping cart intact.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center justify-center">2</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>Your data is processed strictly for legitimate retail operations:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">Order Fulfillment & Dispatch</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Packaging items at the local hub and coordinating driver route navigation.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">Pickup & Order Alerts</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Sending SMS, email receipts, and 6-digit pickup verification OTPs.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">Returns & Refunds</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Validating 7-day returns, restocking items, and crediting refund balances.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">Promotions & Vouchers</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Dispatching VIP ₹50 discount codes and weekend harvest deals (with 1-click unsubscribe).</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center justify-center">3</span>
              <span>Payment Security & 256-Bit SSL</span>
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-start space-x-3">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-emerald-950 dark:text-emerald-200 text-xs">Zero Credit/Debit Card Storage</p>
                <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
                  OneMart does not store full credit card, debit card, or CVV numbers on our servers. All digital payments are processed through PCI-DSS Level 1 certified gateways with mandatory 3D Secure 2-Factor Authentication.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center justify-center">4</span>
              <span>Third-Party Data Disclosures</span>
            </h2>
            <p>
              We do <strong>not sell, rent, or trade</strong> your personal browsing or shopping records to third-party advertising brokers. Data is shared solely with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Assigned logistics and fleet delivery partners for the purpose of locating your shipping address.</li>
              <li>Payment gateways and automated banking networks for payment verification.</li>
              <li>Government or regulatory authorities only when strictly required by applicable law.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center justify-center">5</span>
              <span>Customer Rights & Data Control</span>
            </h2>
            <p>
              You have the right to access, edit, or remove your profile information, manage multiple saved addresses in your account dashboard, and clear wishlist items at any time.
            </p>
          </section>

          {/* Contact & Grievance */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Privacy Grievance & Support Officer
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              If you have any questions regarding your data privacy, please contact our support desk:
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs font-semibold">
              <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
                <Mail className="w-4 h-4" />
                <span>privacy@onemart.com</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
                <Phone className="w-4 h-4" />
                <span>+91 8000-ONEMART</span>
              </div>
            </div>
          </div>
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

export default PrivacyPolicyPage;
