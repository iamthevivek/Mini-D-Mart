import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Store,
  Truck,
  RefreshCw,
  ShoppingCart,
  Apple,
  Milk,
  Wheat,
  ShieldCheck,
  SlidersHorizontal,
  Flame,
  Clock,
  ArrowRight,
  Gift,
  Zap,
  Tag,
  ChevronRight,
  Search,
} from 'lucide-react';
import api from '../api/client';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import FilterSidebar from '../components/FilterSidebar';
import DealsCountdown from '../components/DealsCountdown';
import InteractiveSavingsCalculator from '../components/InteractiveSavingsCalculator';
import CustomerReviewsShowcase from '../components/CustomerReviewsShowcase';
import SpinWheelModal from '../components/SpinWheelModal';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

interface HomePageProps {
  searchQuery: string;
  selectedCategoryId?: number | null;
  onSelectCategory?: (id: number | null) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  selectedCategoryId: externalCategoryId,
  onSelectCategory: setExternalCategoryId,
}) => {
  const { recentlyViewed } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [internalCategoryId, setInternalCategoryId] = useState<number | null>(null);

  const selectedCategoryId = externalCategoryId !== undefined ? externalCategoryId : internalCategoryId;
  const setSelectedCategoryId = (id: number | null) => {
    if (setExternalCategoryId) setExternalCategoryId(id);
    else setInternalCategoryId(id);
  };

  const [inStockOnly, setInStockOnly] = useState(false);
  const [returnableOnly, setReturnableOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);

  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId, searchQuery, inStockOnly]);

  const handleHeroCategoryClick = (keyword: string) => {
    const matched = categories.find((c) => c.name.toLowerCase().includes(keyword.toLowerCase()));
    if (matched) {
      setSelectedCategoryId(matched.id);
    } else {
      setSelectedCategoryId(null);
    }
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get<Category[]>('/categories');
      setCategories(res.data);
    } catch {}
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCategoryId) params.append('categoryId', selectedCategoryId.toString());
      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      if (inStockOnly) params.append('inStockOnly', 'true');

      const res = await api.get<Product[]>(`/products?${params.toString()}`);
      setProducts(res.data);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side filtering for price and returnable
  const filteredProducts = products.filter((p) => {
    if (returnableOnly && !p.isReturnable) return false;
    if (minPrice && p.sellingPrice < parseFloat(minPrice)) return false;
    if (maxPrice && p.sellingPrice > parseFloat(maxPrice)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
    if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
    if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
    return 0;
  });

  // Top Deals: products with discount >= 15%
  const flashDeals = products.filter((p) => p.discountPercentage >= 15).slice(0, 4);

  const handleResetFilters = () => {
    setSelectedCategoryId(null);
    setInStockOnly(false);
    setReturnableOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-50/50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Clean Premium Hero Showcase with Realistic Supermarket Background */}
      <section className="relative bg-emerald-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-xl overflow-hidden border-b border-emerald-800/40">
        {/* Realistic Supermarket Store Background Photo with Subtle Blur & Rich Emerald Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/grocery_hero_bg.jpg"
            alt="Mini D-Mart Fresh Supermarket"
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05] scale-[1.02] transform transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/85 to-teal-950/80 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Pitch */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 bg-amber-400 text-emerald-950 text-xs font-black px-3 py-0.5 rounded-full shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>SUPERMARKET SAVINGS</span>
              </span>

              <button
                onClick={() => setIsSpinWheelOpen(true)}
                className="inline-flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold px-3 py-0.5 rounded-full backdrop-blur-md transition cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 text-amber-300" />
                <span>Spin & Win Daily Coupons</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
              Fresh Daily Groceries at <br />
              <span className="text-amber-400">Everyday Wholesale Prices</span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/95 max-w-xl leading-relaxed font-medium">
              Order fresh farm vegetables, dairy, staples and pantry essentials. Delivered fast to your home or ready for 15-min express store counter pickup.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <div className="flex items-center space-x-2 bg-white/15 hover:bg-white/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-50 border border-white/15 backdrop-blur-md shadow-xs">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Free Delivery on ₹500+</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/15 hover:bg-white/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-50 border border-white/15 backdrop-blur-md shadow-xs">
                <Store className="w-4 h-4 text-amber-400 shrink-0" />
                <span>15-min Counter Pickup</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/15 hover:bg-white/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-50 border border-white/15 backdrop-blur-md shadow-xs">
                <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
                <span>7-Day Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right Highlights Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div
              onClick={() => handleHeroCategoryClick('fruit')}
              className="bg-white/10 hover:bg-white/20 active:scale-98 cursor-pointer rounded-2xl p-4 border border-white/15 backdrop-blur-md transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 mb-2 group-hover:scale-110 transition-transform">
                <Apple className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Farm Fresh Produce</h4>
              <p className="text-[10px] text-emerald-200 mt-0.5">Vegetables & seasonal fruits</p>
            </div>

            <div
              onClick={() => handleHeroCategoryClick('dairy')}
              className="bg-white/10 hover:bg-white/20 active:scale-98 cursor-pointer rounded-2xl p-4 border border-white/15 backdrop-blur-md transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/30 flex items-center justify-center text-blue-300 mb-2 group-hover:scale-110 transition-transform">
                <Milk className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Dairy & Fresh Bakes</h4>
              <p className="text-[10px] text-emerald-200 mt-0.5">Milk, butter, bread & paneer</p>
            </div>

            <div
              onClick={() => handleHeroCategoryClick('staple')}
              className="bg-white/10 hover:bg-white/20 active:scale-98 cursor-pointer rounded-2xl p-4 border border-white/15 backdrop-blur-md transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300 mb-2 group-hover:scale-110 transition-transform">
                <Wheat className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Pantry Staples</h4>
              <p className="text-[10px] text-emerald-200 mt-0.5">Atta, Rice, Dal & Cooking Oils</p>
            </div>

            <div
              onClick={() => handleHeroCategoryClick('household')}
              className="bg-white/10 hover:bg-white/20 active:scale-98 cursor-pointer rounded-2xl p-4 border border-white/15 backdrop-blur-md transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-300 mb-2 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Household Care</h4>
              <p className="text-[10px] text-emerald-200 mt-0.5">Cleaners & personal hygiene</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Body */}
      <main id="catalog-section" ref={catalogRef} className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 sm:mt-8 scroll-mt-24">
        {/* Active Search Notification Banner */}
        {searchQuery && searchQuery.trim().length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  Search Results for: <span className="text-emerald-700 dark:text-emerald-400">"{searchQuery}"</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Found {sortedProducts.length} matching {sortedProducts.length === 1 ? 'item' : 'items'} in store catalog
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (setExternalCategoryId) setExternalCategoryId(null);
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) searchInput.value = '';
                window.location.href = '/';
              }}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition shadow-2xs"
            >
              ✕ Clear Search
            </button>
          </div>
        )}

        {/* Category Pills Slider */}
        <div className="mb-6 overflow-x-auto pb-2 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex items-center space-x-2 w-max">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategoryId === null
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
                  selectedCategoryId === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Flash Deals / Super Savings Section with Live DealsCountdown */}
        {!selectedCategoryId && !searchQuery && flashDeals.length > 0 && (
          <section className="mb-12 p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-emerald-500/5 dark:from-amber-950/40 dark:via-rose-950/30 dark:to-emerald-950/20 border border-amber-400/40 dark:border-amber-500/30 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Flame className="w-6 h-6 fill-current animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                      Flash Deals & Mega Savings
                    </h2>
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                      UP TO 30% OFF
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Limited daily inventory discounted below wholesale MRP
                  </p>
                </div>
              </div>

              <DealsCountdown />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
              {flashDeals.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenModal={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Controls Toolbar: Active Filters, Sorting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white dark:bg-slate-900 p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between sm:justify-start space-x-3 text-xs text-slate-700 dark:text-slate-300">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Filters</span>
            </button>

            {searchQuery && (
              <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-xl font-semibold text-xs truncate max-w-[200px] border border-emerald-200 dark:border-emerald-800">
                Search: "{searchQuery}"
              </span>
            )}

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-900 dark:text-slate-100">{sortedProducts.length}</span> items
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-2 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="featured">Featured / Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Savings</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Sidebar Filter on Desktop + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs h-fit sticky top-24">
            <FilterSidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
              returnableOnly={returnableOnly}
              onToggleReturnable={setReturnableOnly}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onReset={handleResetFilters}
              totalProductsCount={products.length}
            />
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 sm:p-14 text-center border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingCart className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  No matching grocery products found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  We couldn't find items matching your price range or filter keywords. Try resetting the filters or clearing the search query.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenModal={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Smart Grocery Savings Calculator Widget */}
        <div className="mt-14">
          <InteractiveSavingsCalculator />
        </div>

        {/* Customer Reviews & Verified Buyer Showcase */}
        <CustomerReviewsShowcase />

        {/* Recently Viewed Products Section */}
        {recentlyViewed.length > 0 && (
          <section className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recently Viewed Items
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {recentlyViewed.slice(0, 5).map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenModal={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white dark:bg-slate-900 p-5 shadow-2xl overflow-y-auto">
              <FilterSidebar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={(id) => {
                  setSelectedCategoryId(id);
                  setIsMobileFilterOpen(false);
                }}
                inStockOnly={inStockOnly}
                onToggleInStock={setInStockOnly}
                returnableOnly={returnableOnly}
                onToggleReturnable={setReturnableOnly}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onReset={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                totalProductsCount={products.length}
                isMobileDrawer={true}
                onCloseDrawer={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Spin & Win Discount Modal */}
      <SpinWheelModal isOpen={isSpinWheelOpen} onClose={() => setIsSpinWheelOpen(false)} />
    </div>
  );
};

export default HomePage;
