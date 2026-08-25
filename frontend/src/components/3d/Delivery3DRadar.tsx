import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Store, CheckCircle2, Clock, Navigation, ShieldCheck } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface Delivery3DRadarProps {
  order: Order;
}

const Delivery3DRadar: React.FC<Delivery3DRadarProps> = ({ order }) => {
  // Determine percentage progress along route based on real order status
  const getProgressByStatus = (status: OrderStatus): number => {
    switch (status) {
      case 'PLACED':
        return 12;
      case 'CONFIRMED':
        return 32;
      case 'PREPARING':
        return 52;
      case 'OUT_FOR_DELIVERY':
        return 80;
      case 'DELIVERED':
      case 'PICKED_UP':
        return 100;
      case 'CANCELLED':
        return 0;
      default:
        return 15;
    }
  };

  const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return {
          title: 'Order Received at Central Depot',
          subtitle: 'Items queued for automated picking and quality inspection',
          eta: '25-30 mins',
          distance: '4.8 km away',
        };
      case 'CONFIRMED':
        return {
          title: 'Order Confirmed & Route Assigned',
          subtitle: 'Assigned to nearest express delivery partner',
          eta: '20-25 mins',
          distance: '4.2 km away',
        };
      case 'PREPARING':
        return {
          title: 'Packed & Loaded in Express Van',
          subtitle: 'Disinfection completed & sealed with tamper-proof band',
          eta: '15-20 mins',
          distance: '3.5 km away',
        };
      case 'OUT_FOR_DELIVERY':
        return {
          title: 'In Transit — Driver on Route',
          subtitle: 'Navigating city corridor towards your delivery address',
          eta: '8-12 mins',
          distance: '1.4 km away',
        };
      case 'DELIVERED':
      case 'PICKED_UP':
        return {
          title: 'Order Delivered Successfully',
          subtitle: 'Handed over at customer doorstep / pickup desk',
          eta: 'Delivered',
          distance: '0.0 km',
        };
      case 'CANCELLED':
        return {
          title: 'Order Cancelled',
          subtitle: 'Delivery route aborted',
          eta: 'Cancelled',
          distance: '0.0 km',
        };
      default:
        return {
          title: 'Processing Order',
          subtitle: 'Preparing route telemetry',
          eta: '20 mins',
          distance: '3.0 km',
        };
    }
  };

  const targetProgress = getProgressByStatus(order.status);
  const [currentProgress, setCurrentProgress] = useState(0);
  const info = getStatusDescription(order.status);

  // Smooth realistic vehicle glide towards target progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(targetProgress);
    }, 150);
    return () => clearTimeout(timer);
  }, [targetProgress]);

  const isDriving = order.status === 'OUT_FOR_DELIVERY';

  return (
    <div className="relative rounded-2xl overflow-hidden border border-emerald-600/30 bg-emerald-950 text-white shadow-2xl p-4 sm:p-6 transition-all">
      {/* Background Image: Authentic Supermarket & Grocery Store Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/grocery_hero_bg.jpg"
          alt="OneMart Store Dispatch Route"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-110 scale-105"
        />
        {/* Brand Emerald-to-Teal Gradient Overlay to match Website Hero & Header */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-teal-950/95 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md shadow-xs">
              <Navigation className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-emerald-300">
                  {order.fulfillmentType === 'HOME_DELIVERY' ? 'Doorstep Van Tracking' : 'Express Counter Queue'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                  LIVE GPS RADAR
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Vehicle ID: <strong className="text-white">DL-04-OM-2026</strong> • Driver: <strong className="text-white">Ramesh K. (Partner #408)</strong>
              </p>
            </div>
          </div>

          {/* Metric Pods */}
          <div className="flex items-center space-x-2.5 text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 dark:bg-slate-900/60 border border-white/15 backdrop-blur-md text-right shadow-sm">
              <p className="text-[9px] text-emerald-200 uppercase font-bold tracking-wider">Est. Arrival</p>
              <p className="font-mono font-black text-amber-400 text-xs sm:text-sm">{info.eta}</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 dark:bg-slate-900/60 border border-white/15 backdrop-blur-md text-right shadow-sm">
              <p className="text-[9px] text-emerald-200 uppercase font-bold tracking-wider">Remaining</p>
              <p className="font-mono font-black text-emerald-300 text-xs sm:text-sm">{info.distance}</p>
            </div>
          </div>
        </div>

        {/* Interactive Illuminated Road Track */}
        <div className="my-8 px-2 sm:px-6">
          {/* Road Base Track */}
          <div className="relative h-7 sm:h-8 bg-emerald-950/80 rounded-full border border-emerald-700/60 shadow-inner flex items-center px-1 overflow-hidden backdrop-blur-md">
            {/* Animated Road Lane Striping */}
            <div
              className={`absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_14px,rgba(255,255,255,0.12)_14px,rgba(255,255,255,0.12)_26px)] ${
                isDriving ? 'animate-road-scroll' : ''
              }`}
            />

            {/* Glowing Brand Emerald-to-Amber Progress Trail */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.7)]"
              style={{ width: `${currentProgress}%` }}
            />

            {/* Waypoint Milestone Nodes along the Track */}
            <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-8 pointer-events-none">
              {[
                { pos: 12, label: 'Depot' },
                { pos: 32, label: 'Confirmed' },
                { pos: 52, label: 'Packed' },
                { pos: 80, label: 'In Transit' },
                { pos: 100, label: 'Doorstep' },
              ].map((node) => {
                const isPassed = currentProgress >= node.pos;
                return (
                  <div key={node.label} className="relative flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                        isPassed
                          ? 'bg-white border-amber-400 shadow-[0_0_10px_#fbbf24]'
                          : 'bg-emerald-950 border-emerald-700'
                      }`}
                    />
                    <span
                      className={`absolute top-4 text-[9px] font-mono whitespace-nowrap transition-colors ${
                        isPassed ? 'text-amber-300 font-bold drop-shadow-xs' : 'text-emerald-300/60'
                      }`}
                    >
                      {node.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Moving Delivery Van Vehicle Entity */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-20"
              style={{ left: `calc(${currentProgress}% - 22px)` }}
            >
              <div className="relative group">
                {/* Headlight Beam Effect on Road */}
                {isDriving && (
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-6 bg-gradient-to-r from-amber-300/60 to-transparent blur-xs pointer-events-none" />
                )}

                {/* Delivery Van Vehicle Pod */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xl border-2 border-amber-400 ring-4 ring-emerald-400/30 transform transition-transform hover:scale-110">
                  <Truck className={`w-5 h-5 ${isDriving ? 'animate-bounce-subtle' : ''}`} />
                </div>

                {/* Percentage Status Tooltip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-950 text-amber-300 font-black text-[9px] font-mono px-2 py-0.5 rounded-md border border-emerald-600 shadow-md whitespace-nowrap">
                  {currentProgress}%
                </div>
              </div>
            </div>
          </div>

          {/* Start Hub & End Customer Pins */}
          <div className="flex items-center justify-between mt-8 text-xs font-semibold">
            {/* Start: OneMart Hub */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 text-emerald-300 flex items-center justify-center backdrop-blur-md shadow-xs">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">OneMart Hub #104</p>
                <p className="text-[10px] text-emerald-200/80 font-mono">Central Fulfillment Bay</p>
              </div>
            </div>

            {/* End: Customer Delivery Destination */}
            <div className="flex items-center space-x-2.5 text-right">
              <div>
                <p className="text-xs font-bold text-white">Customer Delivery Point</p>
                <p className="text-[10px] text-amber-200/90 font-mono truncate max-w-[150px] sm:max-w-[240px]">
                  {order.deliveryAddress || 'Registered Address'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center backdrop-blur-md shadow-xs">
                <MapPin className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Prompt Footer */}
        <div className="mt-6 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-bold text-white">{info.title}</span>
            <span className="text-emerald-400/60">•</span>
            <span className="text-emerald-100/80 text-[11px] font-medium">{info.subtitle}</span>
          </div>

          <div className="flex items-center space-x-2 text-[10px] text-emerald-200/90 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Contactless Verified Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery3DRadar;
