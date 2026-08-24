import React from 'react';
import { Plus, Minus, ShoppingBag, Eye, Heart, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const { user } = useAuth();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const cartItem = cart?.items.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isFavorited = isInWishlist(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      if (quantity === 1) {
        removeFromCart(cartItem.id);
      } else {
        updateQuantity(cartItem.id, quantity - 1);
      }
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const savings =
    product.mrpPrice > product.sellingPrice
      ? (product.mrpPrice - product.sellingPrice).toFixed(2)
      : null;

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 shadow-xs hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Floating Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {product.discountPercentage > 0 && (
          <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
            {product.discountPercentage}% OFF
          </span>
        )}
        {product.isReturnable && (
          <span className="bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-md">
            <RotateCcw className="w-2.5 h-2.5" />
            <span>{product.returnWindowDays}d Return</span>
          </span>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
        {user && user.role === 'CUSTOMER' && (
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full shadow-xs backdrop-blur-md transition-all duration-150 active:scale-90 ${
              isFavorited
                ? 'bg-rose-50 dark:bg-rose-950 text-rose-500 border border-rose-200 dark:border-rose-800'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 border border-slate-100 dark:border-slate-700'
            }`}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(product);
          }}
          className="p-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full shadow-xs border border-slate-100 dark:border-slate-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          title="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image Stage */}
      <div className="w-full h-36 sm:h-44 bg-slate-50/70 dark:bg-slate-800/30 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center justify-between text-xs mb-1 gap-1">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px] truncate max-w-[65%]">
              {product.category?.name || 'Fresh Mart'}
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
              {product.unit}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition min-h-[2.4rem]">
            {product.name}
          </h3>

          <div className="mt-1">
            {!product.inStock ? (
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Out of Stock
              </span>
            ) : product.isLowStock ? (
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Only {product.stockQuantity} left!
              </span>
            ) : (
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 mt-auto">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                ₹{product.sellingPrice.toFixed(2)}
              </span>
              {product.mrpPrice > product.sellingPrice && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through">
                  ₹{product.mrpPrice.toFixed(2)}
                </span>
              )}
            </div>
            {savings && (
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Save ₹{savings}
              </span>
            )}
          </div>

          {product.inStock ? (
            quantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between bg-emerald-600 text-white rounded-xl overflow-hidden shadow-xs w-full"
              >
                <button
                  onClick={handleDecrement}
                  className="px-3 py-1.5 hover:bg-emerald-700 transition active:scale-95 flex items-center justify-center flex-1"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs sm:text-sm font-black min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stockQuantity}
                  className="px-3 py-1.5 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95 flex items-center justify-center flex-1"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center space-x-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-98"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD TO CART</span>
              </button>
            )
          ) : (
            <button
              disabled
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold rounded-xl cursor-not-allowed text-center"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
