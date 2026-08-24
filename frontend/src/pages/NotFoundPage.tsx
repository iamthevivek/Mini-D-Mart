import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ArrowLeft, ShoppingBag, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Store className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100">404</h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The grocery aisle or page you're looking for doesn't exist or has been moved to another section.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Supermarket</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
