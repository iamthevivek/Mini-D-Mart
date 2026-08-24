import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ConfirmationModal from './ConfirmationModal';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, setIsCheckoutOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

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
    <>
      <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-up sm:animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-800 dark:bg-emerald-950 text-white">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm sm:text-base font-bold">Shopping Cart ({cart?.totalItems || 0} items)</h2>
              </div>
              <div className="flex items-center space-x-1">
                {items.length > 0 && (
                  <button
                    onClick={() => setIsClearConfirmOpen(true)}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-emerald-700 dark:hover:bg-emerald-900 transition text-xs font-semibold"
                    title="Clear entire cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-emerald-700 dark:hover:bg-emerald-900 transition"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Free Delivery Tracker */}
            {cart && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/60">
                {cart.eligibleForFreeDelivery ? (
                  <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Unlocked FREE Delivery on this order!</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        <span>
                          Add <span className="font-bold text-emerald-700 dark:text-emerald-300">₹{cart.amountNeededForFreeDelivery.toFixed(2)}</span> more for FREE delivery
                        </span>
                      </span>
                      <span className="text-[11px] font-bold">{freeProgress}%</span>
                    </div>
                    <div className="w-full bg-emerald-200 dark:bg-emerald-900/60 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${freeProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                    Explore our fresh daily catalog, farm produce, and pantry staples to start shopping!
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center space-x-3">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate leading-snug">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.product.unit}</p>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                          ₹{item.subtotal.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          (₹{item.itemPrice.toFixed(2)} / unit)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeFromCart(item.id);
                          } else {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                        aria-label="Decrease item quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockQuantity}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition"
                        aria-label="Increase item quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bill Summary & Proceed to Checkout */}
            {items.length > 0 && cart && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3.5">
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">₹{cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated GST (5%)</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">₹{cart.estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    {cart.deliveryFee === 0 ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">FREE</span>
                    ) : (
                      <span className="font-semibold text-slate-900 dark:text-slate-100">₹{cart.deliveryFee.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-slate-100">
                    <span>Final Amount to Pay</span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-base">₹{cart.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isClearConfirmOpen}
        title="Clear Shopping Cart"
        message="Are you sure you want to remove all items from your shopping cart?"
        confirmLabel="Clear All"
        isDestructive={true}
        onConfirm={() => {
          clearCart();
          setIsClearConfirmOpen(false);
        }}
        onClose={() => setIsClearConfirmOpen(false)}
      />
    </>
  );
};

export default CartDrawer;
