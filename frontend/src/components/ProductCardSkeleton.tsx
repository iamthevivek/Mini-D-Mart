import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-3 sm:p-4 flex flex-col justify-between h-[340px] sm:h-[390px] overflow-hidden">
      <div className="w-full h-36 sm:h-44 rounded-2xl skeleton-shimmer mb-3" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-1/3 rounded-md skeleton-shimmer" />
        <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded-md skeleton-shimmer mt-1" />
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded-md skeleton-shimmer" />
          <div className="h-4 w-12 rounded-md skeleton-shimmer" />
        </div>
        <div className="h-9 w-full rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
