import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, RotateCcw, ShieldCheck, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const cartItem = cart?.items.find((i) => i.product.id === product.id);

  const handleAddToCart = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + qty);
    } else {
      addToCart(product.id, qty);
    }
    onClose();
  };

  const savings = product.mrpPrice > product.sellingPrice ? (product.mrpPrice - product.sellingPrice).toFixed(2) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-gray-100 flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-700 bg-white/80 p-2 rounded-full shadow-sm hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8 relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-72 object-contain rounded-xl hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShoppingCart className="w-16 h-16" />
            </div>
          )}

          {product.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
              {product.discountPercentage}% OFF
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px]">
                {product.category?.name || 'Grocery'}
              </span>
              <span className="font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded">SKU: {product.sku}</span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 leading-tight mt-1">{product.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Pack size: <span className="font-bold text-gray-800">{product.unit}</span></p>

            <div className="mt-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-emerald-800">₹{product.sellingPrice.toFixed(2)}</span>
                {product.mrpPrice > product.sellingPrice && (
                  <span className="text-xs text-gray-400 line-through ml-2">MRP ₹{product.mrpPrice.toFixed(2)}</span>
                )}
              </div>
              {savings && (
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Save ₹{savings}
                </span>
              )}
            </div>

            {product.description && (
              <div className="mt-3">
                <h4 className="text-xs font-bold text-gray-900 mb-1">Product Details</h4>
                <p className="text-xs text-gray-600 leading-relaxed max-h-24 overflow-y-auto pr-1">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-gray-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% genuine guaranteed quality</span>
              </div>
              {product.isReturnable ? (
                <div className="flex items-center space-x-2 text-emerald-700">
                  <RotateCcw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Eligible for {product.returnWindowDays}-day return / exchange after delivery</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-amber-700">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Perishable fresh item — Non-returnable</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            {product.inStock ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 hover:bg-gray-200 transition text-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-bold text-gray-800">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))}
                    className="p-2 hover:bg-gray-200 transition text-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition active:scale-98"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart • ₹{(product.sellingPrice * qty).toFixed(2)}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-red-50 text-red-700 text-center rounded-xl font-bold text-xs">
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
