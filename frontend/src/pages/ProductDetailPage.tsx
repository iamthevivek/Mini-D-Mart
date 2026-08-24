import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Heart,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  Truck,
  Store,
  Plus,
  Minus,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import api from '../api/client';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  const fetchProductDetails = async (productId: string) => {
    try {
      setIsLoading(true);
      const res = await api.get<Product>(`/products/${productId}`);
      setProduct(res.data);
      addRecentlyViewed(res.data);

      if (res.data.category?.id) {
        const relatedRes = await api.get<Product[]>(`/products?categoryId=${res.data.category.id}`);
        setRelatedProducts(relatedRes.data.filter((p) => p.id !== res.data.id).slice(0, 4));
      }
    } catch {
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Link Copied', 'Product link copied to clipboard.');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 rounded-2xl skeleton-shimmer" />
          <div className="space-y-4">
            <div className="h-6 w-1/3 rounded skeleton-shimmer" />
            <div className="h-10 w-3/4 rounded skeleton-shimmer" />
            <div className="h-8 w-1/4 rounded skeleton-shimmer" />
            <div className="h-32 w-full rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grocery Catalog</span>
        </Link>
      </div>
    );
  }

  const cartItem = cart?.items.find((i) => i.product.id === product.id);
  const isFavorited = isInWishlist(product.id);
  const savings =
    product.mrpPrice > product.sellingPrice
      ? (product.mrpPrice - product.sellingPrice).toFixed(2)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span>{product.category?.name || 'Groceries'}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Product Main Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        {/* Left Column: Image Stage */}
        <div className="md:col-span-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl p-8 flex items-center justify-center relative min-h-[340px] border border-slate-100 dark:border-slate-800">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-80 object-contain hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}

          {product.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider">
              {product.discountPercentage}% OFF
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-emerald-600 shadow-xs border border-slate-100 dark:border-slate-700 transition"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {user && user.role === 'CUSTOMER' && (
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2.5 rounded-full shadow-xs transition ${
                  isFavorited
                    ? 'bg-rose-50 dark:bg-rose-950 text-rose-500 border border-rose-200 dark:border-rose-800'
                    : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-500 border border-slate-100 dark:border-slate-700'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-xs bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded-md inline-block mb-2 border border-emerald-200/60 dark:border-emerald-800/60">
                {product.category?.name || 'Daily Fresh'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                SKU: {product.sku} {product.barcode && `| Barcode: ${product.barcode}`}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-emerald-800 dark:text-emerald-300">
                  ₹{product.sellingPrice.toFixed(2)}
                </span>
                {product.mrpPrice > product.sellingPrice && (
                  <span className="text-sm text-slate-400 dark:text-slate-500 line-through ml-3">
                    MRP ₹{product.mrpPrice.toFixed(2)}
                  </span>
                )}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Pack Unit: <span className="font-bold text-slate-800 dark:text-slate-200">{product.unit}</span> (Inclusive of all taxes)
                </p>
              </div>
              {savings && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                  Save ₹{savings}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  About This Product
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Guarantees and return policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3 text-xs">
                <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">Free Home Delivery</p>
                  <p className="text-[10px] text-slate-500">On all orders above ₹500</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3 text-xs">
                <Store className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">Express Store Pickup</p>
                  <p className="text-[10px] text-slate-500">Collect in 15 mins zero wait</p>
                </div>
              </div>

              {product.isReturnable ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center space-x-3 text-xs sm:col-span-2">
                  <RotateCcw className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-200">
                      {product.returnWindowDays}-Day Hassle-Free Returns & Exchanges
                    </p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      Eligible for instant replacement or refund after delivery
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3 text-xs sm:col-span-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Perishable Daily Item</p>
                    <p className="text-[10px] text-slate-500">Non-returnable due to hygiene & freshness standards</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stepper and Add to Cart action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-4">
            {product.inStock ? (
              <>
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-base font-bold text-slate-900 dark:text-slate-100">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))}
                    className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (cartItem) {
                      updateQuantity(cartItem.id, cartItem.quantity + qty);
                    } else {
                      addToCart(product.id, qty);
                    }
                  }}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center justify-center space-x-2 active:scale-98"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart • ₹{(product.sellingPrice * qty).toFixed(2)}</span>
                </button>
              </>
            ) : (
              <div className="w-full p-3.5 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-center rounded-xl font-bold text-xs">
                Currently Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <section className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Similar Products in {product.category?.name || 'this Category'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenModal={(prod) => setSelectedQuickViewProduct(prod)}
              />
            ))}
          </div>
        </section>
      )}

      <ProductModal product={selectedQuickViewProduct} onClose={() => setSelectedQuickViewProduct(null)} />
    </div>
  );
};

export default ProductDetailPage;
