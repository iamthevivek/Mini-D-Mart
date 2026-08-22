import React from 'react';
import { Plus, Minus, ShoppingBag, Eye, RotateCcw, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  const cartItem = cart?.items.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

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

  const savings = product.mrpPrice > product.sellingPrice ? (product.mrpPrice - product.sellingPrice).toFixed(2) : null;

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.discountPercentage > 0 && (
          <span className="bg-red-500 text-white text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs">
            {product.discountPercentage}% OFF
          </span>
        )}
        {product.isReturnable ? (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <RotateCcw className="w-2.5 h-2.5" />
            {product.returnWindowDays}d Return
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-600 text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded">
            Non-returnable
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal(product);
        }}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition duration-200"
        title="Quick View"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>

      <div className="w-full h-36 sm:h-44 bg-gray-50 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        )}
      </div>

      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1 gap-1">
            <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[9px] sm:text-[10px] truncate max-w-[65%]">
              {product.category?.name || 'Grocery'}
            </span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium text-gray-700 shrink-0">
              {product.unit}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition min-h-[2rem]">
            {product.name}
          </h3>

          <div className="mt-1">
            {!product.inStock ? (
              <span className="text-[10px] sm:text-[11px] font-bold text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" /> Out of Stock
              </span>
            ) : product.isLowStock ? (
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" /> Only {product.stockQuantity} left!
              </span>
            ) : (
              <span className="text-[10px] sm:text-[11px] font-medium text-emerald-700 truncate block">
                In Stock ({product.stockQuantity} units)
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2 mt-auto">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-gray-900">₹{product.sellingPrice.toFixed(2)}</span>
              {product.mrpPrice > product.sellingPrice && (
                <span className="text-[11px] sm:text-xs text-gray-400 line-through">₹{product.mrpPrice.toFixed(2)}</span>
              )}
            </div>
            {savings && (
              <span className="text-[10px] font-bold text-emerald-700 shrink-0">
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
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 hover:bg-emerald-700 transition active:scale-95 flex items-center justify-center flex-1"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs sm:text-sm font-bold min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stockQuantity}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95 flex items-center justify-center flex-1"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center space-x-1.5 py-1.5 sm:py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs rounded-xl border border-emerald-200 hover:border-emerald-600 transition-all duration-200 shadow-2xs active:scale-98"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            )
          ) : (
            <button
              disabled
              className="w-full py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed text-center"
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
