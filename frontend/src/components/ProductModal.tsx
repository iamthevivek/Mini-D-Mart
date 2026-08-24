import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart, RotateCcw, ShieldCheck, AlertCircle, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useAuth } from '../context/AuthContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addRecentlyViewed } = useRecentlyViewed();
  const [qty, setQty] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      setQty(1);
      setIsZoomed(false);
    }
  }, [product]);

  if (!product) return null;

  const cartItem = cart?.items.find((i) => i.product.id === product.id);
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + qty);
    } else {
      addToCart(product.id, qty);
    }
    onClose();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const savings =
    product.mrpPrice > product.sellingPrice
      ? (product.mrpPrice - product.sellingPrice).toFixed(2)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row my-auto animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow-md backdrop-blur-md transition"
          aria-label="Close product quick view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image & Zoom Area */}
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          className="md:w-1/2 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center p-6 relative overflow-hidden min-h-[260px] md:min-h-[380px] cursor-crosshair select-none"
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: 'scale(1.85)',
                    }
                  : undefined
              }
              className="max-h-64 sm:max-h-72 object-contain transition-transform duration-100 ease-out"
            />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}

          {product.discountPercentage > 0 && (
            <div className="absolute bottom-3 left-3 bg-rose-500 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-sm">
              {product.discountPercentage}% OFF
            </div>
          )}

          {user && user.role === 'CUSTOMER' && (
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-transform duration-200 active:scale-90 ${
                isFavorited
                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-500'
                  : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-500'
              }`}
              title="Toggle Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Product Details Section */}
        <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                {product.category?.name || 'Daily Fresh'}
              </span>
              <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                SKU: {product.sku}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight mt-1">
              {product.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Net Content / Unit: <span className="font-bold text-slate-800 dark:text-slate-200">{product.unit}</span>
            </p>

            {/* Price Box */}
            <div className="mt-3 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300">
                  ₹{product.sellingPrice.toFixed(2)}
                </span>
                {product.mrpPrice > product.sellingPrice && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 line-through ml-2">
                    MRP ₹{product.mrpPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {savings && (
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  Save ₹{savings}
                </span>
              )}
            </div>

            {product.description && (
              <div className="mt-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-1">Product Description</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-h-20 overflow-y-auto pr-1">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-3.5 space-y-1.5 text-xs">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>100% Genuine product quality verified</span>
              </div>
              {product.isReturnable ? (
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
                  <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Eligible for {product.returnWindowDays}-day return / exchange policy</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Perishable fresh item — Non-returnable</span>
                </div>
              )}
            </div>
          </div>

          {/* Stepper and Add to Cart CTA */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {product.inStock ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))}
                    className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart • ₹{(product.sellingPrice * qty).toFixed(2)}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-center rounded-xl font-bold text-xs">
                Currently Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
