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
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.discountPercentage > 0 && (
          <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm">
            {product.discountPercentage}% OFF
          </span>
        )}
        {product.isReturnable ? (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <RotateCcw className="w-2.5 h-2.5" />
            {product.returnWindowDays}d Return
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-1.5 py-0.5 rounded">
            Non-returnable
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal(product);
        }}
        className="absolute top-2.5 right-2.5 z-10 p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-200"
        title="Quick View"
      >
        <Eye className="w-4 h-4" />
      </button>

      <div className="w-full h-44 bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[10px]">
              {product.category?.name || 'Grocery'}
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium text-gray-700">
              {product.unit}
            </span>
          </div>

          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition">
            {product.name}
          </h3>

          <div className="mt-1.5">
            {!product.inStock ? (
              <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Out of Stock
              </span>
            ) : product.isLowStock ? (
              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Only {product.stockQuantity} left!
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-700">
                In Stock ({product.stockQuantity} units)
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-gray-900">₹{product.sellingPrice.toFixed(2)}</span>
              {product.mrpPrice > product.sellingPrice && (
                <span className="text-xs text-gray-400 line-through">₹{product.mrpPrice.toFixed(2)}</span>
              )}
            </div>
            {savings && (
              <p className="text-[10px] font-bold text-emerald-700">
                Save ₹{savings}
              </p>
            )}
          </div>

          {product.inStock ? (
            quantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-emerald-600 text-white rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={handleDecrement}
                  className="px-2.5 py-1.5 hover:bg-emerald-700 transition active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-bold">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stockQuantity}
                  className="px-2.5 py-1.5 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="flex items-center space-x-1 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs rounded-xl border border-emerald-200 hover:border-emerald-600 transition-all duration-200 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            )
          ) : (
            <button
              disabled
              className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed"
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
