import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Gift, Check, ArrowRight, Zap } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const prizes = [
  { label: 'FREE DELIVERY', code: 'FREEDEL', color: '#059669', desc: 'Free Delivery on any order' },
  { label: '₹50 OFF', code: 'SAVE50', color: '#f59e0b', desc: 'Flat ₹50 OFF on cart' },
  { label: '10% DISCOUNT', code: 'EXTRA10', color: '#3b82f6', desc: '10% off your entire cart' },
  { label: 'FREE ORGANIC GIFT', code: 'FARMFRUIT', color: '#8b5cf6', desc: 'Free seasonal fruit box' },
  { label: '15% MEGA SAVER', code: 'DMART15', color: '#ec4899', desc: '15% off fresh staples' },
  { label: '₹100 CASHBACK', code: 'CASH100', color: '#10b981', desc: '₹100 back on ₹1000+' },
];

const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ isOpen, onClose }) => {
  const { success } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<typeof prizes[0] | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    const extraSpins = 5;
    const randomPrizeIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;
    const targetAngle = 360 * extraSpins + (360 - randomPrizeIndex * segmentAngle - segmentAngle / 2);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = prizes[randomPrizeIndex];
      setWonPrize(prize);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });

      success('🎉 Congratulations!', `You unlocked code "${prize.code}" — ${prize.label}`);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lucky Supermarket Spin & Win</span>
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
          Spin the Wheel for Daily Discounts!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
          Win free delivery, instant coupon codes, and fresh pantry cashback rewards.
        </p>

        {/* 3D Wheel Canvas */}
        <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
          {/* Wheel Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-500 drop-shadow-md" />

          {/* Rotating Wheel Container */}
          <div
            className="w-full h-full rounded-full border-8 border-amber-400 shadow-2xl overflow-hidden relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
              background: `conic-gradient(
                #059669 0deg 60deg,
                #f59e0b 60deg 120deg,
                #3b82f6 120deg 180deg,
                #8b5cf6 180deg 240deg,
                #ec4899 240deg 300deg,
                #10b981 300deg 360deg
              )`,
            }}
          >
            {prizes.map((p, idx) => {
              const angle = idx * 60 + 30;
              return (
                <div
                  key={p.code}
                  className="absolute w-full h-full flex justify-center items-start pt-3"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter drop-shadow-md rotate-90 inline-block mt-4">
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Wheel Center Hub */}
          <div className="absolute z-10 w-14 h-14 rounded-full bg-slate-900 border-4 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl">
            <Gift className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Won Prize Display */}
        {wonPrize && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-300 dark:border-emerald-700 mb-4 animate-scale-in">
            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">You Won: {wonPrize.label}</p>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <span className="font-mono text-base font-black bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-emerald-400 text-emerald-900 dark:text-emerald-200">
                {wonPrize.code}
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">{wonPrize.desc}</p>
          </div>
        )}

        <button
          disabled={isSpinning}
          onClick={handleSpin}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg transition active:scale-98 disabled:opacity-60 flex items-center justify-center space-x-2"
        >
          <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span>{isSpinning ? 'Spinning the Wheel...' : 'Spin the Wheel!'}</span>
        </button>
      </div>
    </div>
  );
};

export default SpinWheelModal;
