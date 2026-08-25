import React, { useState, useEffect } from 'react';
import { Package, Store, Truck, RotateCcw, ChevronRight, XCircle, ArrowLeft, RefreshCw, Clock, Copy, Check, AlertCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Order, OrderItem, OrderStatus } from '../types';
import ReturnModal from '../components/ReturnModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Delivery3DRadar from '../components/3d/Delivery3DRadar';
import { useToast } from '../context/ToastContext';

const CustomerOrdersPage: React.FC = () => {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<Order | null>(null);
  const [selectedReturnItem, setSelectedReturnItem] = useState<OrderItem | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsRefreshing(true);
      const res = await api.get<Order[]>('/orders/customer');
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleOpenReturnModal = (order: Order, item: OrderItem) => {
    setSelectedReturnOrder(order);
    setSelectedReturnItem(item);
    setIsReturnModalOpen(true);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!cancelReason.trim()) {
      error('Reason Required', 'Please provide a reason for order cancellation');
      return;
    }
    try {
      setIsSubmittingCancel(true);
      await api.post(`/orders/customer/${orderId}/cancel`, { cancellationReason: cancelReason });
      success('Order Cancelled', 'Your order was cancelled and refund has been initiated.');
      setCancellingOrderId(null);
      setCancelReason('');
      fetchOrders();
    } catch (err: any) {
      error('Cancel Failed', err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const handleCopyOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(code);
    success('OTP Copied', `PIN ${code} copied to clipboard`);
    setTimeout(() => setCopiedOtp(null), 2500);
  };

  const getStatusStep = (status: OrderStatus, fulfillment: string) => {
    const isPickup = fulfillment === 'STORE_PICKUP';
    const steps = isPickup
      ? ['PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP']
      : ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

    if (status === 'CANCELLED') return -1;
    return steps.indexOf(status);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span>My Account</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Package className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>My Orders & Live GPS Tracking</span>
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Status'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="h-4 w-1/3 rounded skeleton-shimmer" />
              <div className="h-24 w-full rounded-2xl skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No orders placed yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Order farm fresh produce and daily supermarket groceries with express pickup or home delivery!
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Start Shopping Now</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStatusStep(order.status, order.fulfillmentType);
            const isPickup = order.fulfillmentType === 'STORE_PICKUP';
            const isActiveOrder = order.status !== 'DELIVERED' && order.status !== 'PICKED_UP' && order.status !== 'CANCELLED';
            const stepLabels = isPickup
              ? ['Order Placed', 'Confirmed', 'Packing Order', 'Ready at Counter', 'Collected']
              : ['Order Placed', 'Confirmed', 'Packing Order', 'Out for Delivery', 'Delivered'];

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden transition"
              >
                {/* Header Summary */}
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{order.orderNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          order.status === 'DELIVERED' || order.status === 'PICKED_UP'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : order.status === 'CANCELLED'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Placed: {new Date(order.placedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Amount</p>
                      <p className="text-base font-black text-emerald-700 dark:text-emerald-400">₹{order.totalAmount.toFixed(2)}</p>
                    </div>

                    {order.canCancel && (
                      <button
                        onClick={() => setCancellingOrderId(order.id)}
                        className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800 transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Live 3D Route Simulator on Active In-Transit Orders */}
                {isActiveOrder && !isPickup && (
                  <div className="p-3 sm:p-5 bg-slate-100/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                    <Delivery3DRadar order={order} />
                  </div>
                )}

                {/* Cancellation Prompt */}
                {cancellingOrderId === order.id && (
                  <div className="p-4 bg-rose-50/70 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-800 space-y-2.5">
                    <p className="text-xs font-bold text-rose-900 dark:text-rose-200">Confirm Order Cancellation</p>
                    <input
                      type="text"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Reason for cancellation (e.g. duplicate order, incorrect items)"
                      className="w-full p-2 text-xs border border-rose-300 dark:border-rose-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => setCancellingOrderId(null)}
                        className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-400"
                      >
                        Back
                      </button>
                      <button
                        disabled={isSubmittingCancel}
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                      >
                        {isSubmittingCancel ? 'Cancelling...' : 'Confirm & Restock'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Progress Step Timeline */}
                {order.status !== 'CANCELLED' ? (
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="grid grid-cols-5 gap-2 text-center relative">
                      {stepLabels.map((label, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <div key={label} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                              } ${isCurrent ? 'animate-pulse scale-110' : ''}`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] sm:text-xs mt-2 leading-tight font-medium ${
                                isDone
                                  ? 'text-slate-900 dark:text-slate-100 font-bold'
                                  : 'text-slate-400 dark:text-slate-600'
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-rose-50/50 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-medium">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Cancelled: {order.cancellationReason || 'Cancelled upon customer request'}</span>
                  </div>
                )}

                {/* Fulfillment Details & Counter OTP Box */}
                <div className="p-5 bg-emerald-50/40 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {isPickup ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 font-bold text-emerald-900 dark:text-emerald-200">
                        <Store className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        <span>Store Pickup Instructions</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        Reserved Slot: <span className="font-bold text-slate-900 dark:text-slate-100">{order.pickupSlot?.formattedSlot || 'Reserved Slot'}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">Hub: OneMart Super Store, Metro Plaza Counter #2</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 font-bold text-emerald-900 dark:text-emerald-200">
                        <Truck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        <span>Home Delivery Address</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{order.deliveryAddress}, {order.deliveryCity} - {order.deliveryPincode}</p>
                      <p className="text-slate-500 dark:text-slate-400">Contact: {order.deliveryPhone}</p>
                    </div>
                  )}

                  {isPickup && order.pickupVerificationCode && order.status !== 'PICKED_UP' && order.status !== 'CANCELLED' && (
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between shadow-md">
                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Counter Pickup OTP / PIN</p>
                        <p className="text-xl font-mono font-black text-emerald-800 dark:text-emerald-300 tracking-wider">
                          {order.pickupVerificationCode}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyOtp(order.pickupVerificationCode!)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition"
                      >
                        {copiedOtp === order.pickupVerificationCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy PIN</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Items Purchased List */}
                <div className="p-5 divide-y divide-slate-100 dark:divide-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                    Purchased Items ({order.items.length})
                  </h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                          {item.productImageUrl ? (
                            <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{item.productName}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.unit} • Qty: <span className="font-bold text-slate-800 dark:text-slate-200">{item.quantity}</span> • ₹{item.unitPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-black text-slate-900 dark:text-slate-100">₹{item.subtotal.toFixed(2)}</span>

                        {(order.status === 'DELIVERED' || order.status === 'PICKED_UP') && !item.isReturnedOrExchanged && (
                          <button
                            onClick={() => handleOpenReturnModal(order, item)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Return / Exchange</span>
                          </button>
                        )}
                        {item.isReturnedOrExchanged && (
                          <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                            Return Processed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ReturnModal
        isOpen={isReturnModalOpen}
        order={selectedReturnOrder}
        item={selectedReturnItem}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedReturnOrder(null);
          setSelectedReturnItem(null);
        }}
        onSuccess={() => fetchOrders()}
      />
    </div>
  );
};

export default CustomerOrdersPage;
