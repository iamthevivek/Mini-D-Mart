import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Sparkles, X } from 'lucide-react';
import { Category } from '../types';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  inStockOnly: boolean;
  onToggleInStock: (checked: boolean) => void;
  returnableOnly: boolean;
  onToggleReturnable: (checked: boolean) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onReset: () => void;
  totalProductsCount: number;
  isMobileDrawer?: boolean;
  onCloseDrawer?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  inStockOnly,
  onToggleInStock,
  returnableOnly,
  onToggleReturnable,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
  totalProductsCount,
  isMobileDrawer = false,
  onCloseDrawer,
}) => {
  return (
    <div className="space-y-6">
      {isMobileDrawer && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Filters & Options</h3>
          </div>
          {onCloseDrawer && (
            <button
              onClick={onCloseDrawer}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Categories
          </h4>
          <span className="text-[11px] font-medium text-slate-400">
            {categories.length} total
          </span>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
              selectedCategoryId === null
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {totalProductsCount}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCategoryId === cat.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="truncate pr-2">{cat.name}</span>
              {selectedCategoryId === cat.id && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">Min Price</label>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">Max Price</label>
            <input
              type="number"
              min={0}
              placeholder="1000"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Availability & Policies */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Preferences
        </h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStock(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
            />
            <span>In Stock Products Only</span>
          </label>

          <label className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium select-none">
            <input
              type="checkbox"
              checked={returnableOnly}
              onChange={(e) => onToggleReturnable(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
            />
            <span>7-Day Return / Exchange Items</span>
          </label>
        </div>
      </div>

      {/* Reset CTA */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
