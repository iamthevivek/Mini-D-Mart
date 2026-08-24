import React from 'react';
import { Star, ShieldCheck, ThumbsUp, Heart, CheckCircle2 } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    city: 'Mumbai, MH',
    rating: 5,
    date: '2 days ago',
    comment: 'The express 15-minute store pickup is unbelievable! Ordered farm tomatoes, milk and atta at 9 AM, everything was neatly packed with zero counter wait.',
    product: 'Farm Fresh Organic Tomatoes & Dairy',
    verified: true,
  },
  {
    id: 2,
    name: 'Rajesh Kulkarni',
    city: 'Pune, MH',
    rating: 5,
    date: '3 days ago',
    comment: 'Savings are real! Compared prices with local supermarkets and saved nearly ₹850 on my weekly pantry basket. Delivery was under 45 minutes.',
    product: 'Royal Sharbati Wheat Atta 10kg',
    verified: true,
  },
  {
    id: 3,
    name: 'Ananya Verma',
    city: 'Thane, MH',
    rating: 5,
    date: '5 days ago',
    comment: 'Had to exchange an item because I accidentally selected the wrong unit. The 7-day return process with live eligibility check was seamless!',
    product: 'Pure Cold Pressed Groundnut Oil 5L',
    verified: true,
  },
];

const CustomerReviewsShowcase: React.FC = () => {
  return (
    <section className="my-14">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <ThumbsUp className="w-4 h-4" />
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Trusted by 50,000+ Happy Households
          </h2>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span>4.9 / 5.0 Average Rating</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">{r.date}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{r.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.name}</p>
                <p className="text-[10px] text-slate-400">{r.city}</p>
              </div>
              {r.verified && (
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Verified Buyer</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviewsShowcase;
