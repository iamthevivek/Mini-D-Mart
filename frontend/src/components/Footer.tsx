import React from 'react';
import { Store, ShieldCheck, Truck, RefreshCw, PhoneCall } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-gray-300 mt-16 pt-12 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-emerald-800/60">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-800 text-yellow-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free & Fast Delivery</h4>
              <p className="text-xs text-gray-400">Orders above ₹500 delivered free</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-800 text-yellow-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Express Store Pickup</h4>
              <p className="text-xs text-gray-400">Choose time slot & collect in 15 mins</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-800 text-yellow-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Easy Returns & Exchanges</h4>
              <p className="text-xs text-gray-400">Hassle-free 7-day return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-800 text-yellow-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Quality Assured</h4>
              <p className="text-xs text-gray-400">Fresh vegetables, grains & FMCG</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                Mini<span className="text-yellow-400">D-Mart</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your neighborhood full-stack grocery mart delivering daily freshness, staples, personal care and household items at everyday low prices.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">Shop Categories</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>Fruits & Fresh Vegetables</li>
              <li>Dairy, Bread & Eggs</li>
              <li>Atta, Rice, Pulses & Oil</li>
              <li>Snacks, Biscuits & Beverages</li>
              <li>Household Cleaning & Hygiene</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">Customer Service</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>Order Tracking & Live Status</li>
              <li>Return & Exchange Request</li>
              <li>Pickup Counter Guidelines</li>
              <li>Store Locations & Slots</li>
              <li>Terms of Service & Privacy</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">Store Support</h5>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-yellow-400" />
                <span>+91 (022) 8000-DMART</span>
              </p>
              <p className="text-gray-400">Open 7 Days a week: 8:00 AM – 10:00 PM</p>
              <p className="text-[11px] text-gray-400 pt-2 font-mono">Mini D-Mart Store Hub #104, Metro Plaza</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-900 text-center text-xs text-gray-400 flex justify-center items-center">
          <p>© {new Date().getFullYear()} Mini D-Mart Supermarket App.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
