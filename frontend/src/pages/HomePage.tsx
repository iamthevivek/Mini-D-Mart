import React, { useState, useEffect } from 'react';
import { Sparkles, Store, Truck, RefreshCw, ShoppingCart, Apple, Milk, Wheat, ShieldCheck } from 'lucide-react';
import api from '../api/client';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

interface HomePageProps {
  searchQuery: string;
}

const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId, searchQuery, inStockOnly]);

  const fetchCategories = async () => {
    try {
      const res = await api.get<Category[]>('/categories');
      setCategories(res.data);
    } catch {

    }
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

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
    if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
    if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
    return 0;
  });

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUPER SAVINGS FESTIVAL • UP TO 30% OFF</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Everyday Low Prices on <br />
              <span className="text-yellow-400">Fresh Daily Groceries</span>
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl leading-relaxed">
              Order fresh farm vegetables, pantry staples, dairy and household essentials. Choose fast Home Delivery or Express Store Pickup with zero wait time.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center space-x-2 bg-emerald-800/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-100 border border-emerald-700">
                <Truck className="w-4 h-4 text-yellow-400" />
                <span>Free delivery on ₹500+</span>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-800/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-100 border border-emerald-700">
                <Store className="w-4 h-4 text-yellow-400" />
                <span>Store Pickup in 15 mins</span>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-800/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-100 border border-emerald-700">
                <RefreshCw className="w-4 h-4 text-yellow-400" />
                <span>7-Day Return / Exchange</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Apple className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mt-2.5">Farm Fresh Produce</h3>
              <p className="text-[11px] text-emerald-200 mt-0.5">Handpicked daily harvest</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300">
                <Milk className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mt-2.5">Dairy & Fresh Bakes</h3>
              <p className="text-[11px] text-emerald-200 mt-0.5">Milk, butter, paneer & bakes</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Wheat className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mt-2.5">Staples & Grains</h3>
              <p className="text-[11px] text-emerald-200 mt-0.5">Atta, Rice, Dal & Cooking Oils</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mt-2.5">Household & Hygiene</h3>
              <p className="text-[11px] text-emerald-200 mt-0.5">Cleaning & Personal Care</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-8">
        <div className="mb-4 sm:mb-6 overflow-x-auto pb-1.5 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2 w-max">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCategoryId === null
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
                  selectedCategoryId === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6 bg-white p-2.5 sm:p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between sm:justify-start space-x-3 text-xs text-gray-700">
            <label className="flex items-center space-x-1.5 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
            {searchQuery && (
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-semibold text-[11px] truncate max-w-[180px]">
                Search: "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-2 text-xs">
            <span className="text-gray-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white text-gray-800 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="featured">Featured / Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Savings</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 h-64 sm:h-72 animate-pulse flex flex-col justify-between">
                <div className="bg-gray-200 rounded-xl h-28 sm:h-36 w-full" />
                <div className="space-y-2 mt-3">
                  <div className="bg-gray-200 h-3 w-3/4 rounded" />
                  <div className="bg-gray-200 h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200 shadow-2xs space-y-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">No products found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We couldn't find any products matching your filters or search keywords. Try clearing the search or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategoryId(null);
                setInStockOnly(false);
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-emerald-700 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default HomePage;
