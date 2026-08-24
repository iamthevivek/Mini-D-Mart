import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles } from 'lucide-react';

const DealsCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const format2Digits = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 border border-amber-300 dark:border-amber-500/40 px-3 py-1.5 rounded-2xl shadow-md backdrop-blur-md">
      {/* Indicator Label */}
      <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 font-extrabold text-xs pr-1 border-r border-amber-200 dark:border-slate-800">
        <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
        <span className="hidden sm:inline tracking-tight">Ends in</span>
      </div>

      {/* Clock Flip Card Pods */}
      <div className="flex items-center space-x-1 font-mono">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-900 text-amber-400 dark:bg-slate-950 dark:text-amber-300 px-2 py-0.5 rounded-lg font-black text-xs sm:text-sm shadow-inner border border-slate-700 dark:border-slate-800">
            {format2Digits(timeLeft.hours)}
          </div>
          <span className="text-[8px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">hrs</span>
        </div>

        <span className="text-amber-500 font-black text-xs -mt-2.5 animate-pulse">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-900 text-amber-400 dark:bg-slate-950 dark:text-amber-300 px-2 py-0.5 rounded-lg font-black text-xs sm:text-sm shadow-inner border border-slate-700 dark:border-slate-800">
            {format2Digits(timeLeft.minutes)}
          </div>
          <span className="text-[8px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">min</span>
        </div>

        <span className="text-amber-500 font-black text-xs -mt-2.5 animate-pulse">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-rose-600 to-amber-600 text-white px-2 py-0.5 rounded-lg font-black text-xs sm:text-sm shadow-md">
            {format2Digits(timeLeft.seconds)}
          </div>
          <span className="text-[8px] font-sans font-bold text-rose-500 dark:text-rose-400 uppercase tracking-tighter">sec</span>
        </div>
      </div>
    </div>
  );
};

export default DealsCountdown;
