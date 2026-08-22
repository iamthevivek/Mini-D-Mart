import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, setIsCheckoutOpen, updateQuantity, removeFromCart } = useCart();

  if (!isCartOpen) return null;

  const items = cart?.items || [];
  const freeProgress = cart
    ? Math.min(100, Math.round((cart.subtotal / cart.freeDeliveryThreshold) * 100))
    : 0;

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
              <h2 className="text-base font-bold">Your Cart ({cart?.totalItems || 0} items)</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-emerald-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {cart && (
            <div className="p-3.5 bg-emerald-50 border-b border-emerald-100">
              {cart.eligibleForFreeDelivery ? (
                <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>You unlocked FREE Delivery on this order!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      Add <span className="font-bold text-emerald-700">₹{cart.amountNeededForFreeDelivery.toFixed(2)}</span> more for FREE delivery
                    </span>
                    <span className="text-[11px] font-bold">{freeProgress}%</span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${freeProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-base">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Looks like you haven't added any groceries to your cart yet.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl p-1 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">{item.product.unit}</p>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-xs font-black text-emerald-800">
                        ₹{item.subtotal.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        (₹{item.itemPrice.toFixed(2)} / unit)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.id);
                        } else {
                          updateQuantity(item.id, item.quantity - 1);
                        }
                      }}
                      className="p-1.5 hover:bg-gray-200 text-gray-600 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stockQuantity}
                      className="p-1.5 hover:bg-gray-200 text-gray-600 disabled:opacity-30 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 p-1.5 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && cart && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-gray-900">₹{cart.estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  {cart.deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600 uppercase">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{cart.deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                  <span>To Pay</span>
                  <span className="text-emerald-700">₹{cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
