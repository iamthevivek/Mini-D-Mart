import React, { useState } from 'react';
import { PiggyBank, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import Card3DTilt from './3d/Card3DTilt';

const InteractiveSavingsCalculator: React.FC = () => {
  const [monthlySpend, setMonthlySpend] = useState<number>(8000);

  // Typical supermarket markup is ~22%, Mini D-Mart wholesale discount is ~24%
  const monthlySavings = Math.round(monthlySpend * 0.22);
  const yearlySavings = monthlySavings * 12;
  const freeDeliveryPerYear = Math.round((monthlySpend / 800) * 40 * 12);

  return (
    <Card3DTilt maxTilt={6} scale={1.01} className="w-full">
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold backdrop-blur-md">
              <PiggyBank className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Wholesale Grocery Savings</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              See How Much You Save at <span className="text-amber-400">OneMart</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              We cut out distributor middlemen and source directly from certified farms and wholesale manufacturers to pass 15%–30% everyday savings directly to you.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Your Estimated Monthly Grocery Spend:</span>
                <span className="text-lg font-black text-amber-400 font-mono">₹{monthlySpend.toLocaleString()}</span>
              </div>

              <input
                type="range"
                min={2000}
                max={30000}
                step={500}
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹2,000</span>
                <span>₹15,000</span>
                <span>₹30,000+</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md space-y-4 text-center">
            <div>
              <p className="text-xs text-slate-400 font-medium">Estimated Yearly Savings</p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight mt-1 font-mono">
                ₹{yearlySavings.toLocaleString()}
              </p>
              <p className="text-[11px] text-amber-300/90 mt-1 font-semibold">
                (Save ~₹{monthlySavings.toLocaleString()} every single month)
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2 text-left text-xs">
              <div className="flex items-center space-x-2 text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Delivery Charges on ₹500+</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Farm-direct produce freshness guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Earn instant cashback & loyalty coupon points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card3DTilt>
  );
};

export default InteractiveSavingsCalculator;
