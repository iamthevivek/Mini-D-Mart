import React, { useState, useEffect } from 'react';
import { Package, Store, Truck, RotateCcw, ChevronRight, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Order, OrderItem, OrderStatus } from '../types';
import ReturnModal from '../components/ReturnModal';

const CustomerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<Order | null>(null);
  const [selectedReturnItem, setSelectedReturnItem] = useState<OrderItem | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

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
      alert('Please specify a reason for cancellation');
      return;
    }
    try {
      setIsSubmittingCancel(true);
      await api.post(`/orders/customer/${orderId}/cancel`, { cancellationReason: cancelReason });
      alert('Order cancelled successfully. Refund initiated.');
      setCancellingOrderId(null);
      setCancelReason('');
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsSubmittingCancel(false);
    }
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
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <Link to="/" className="hover:text-emerald-700">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span>My Account</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>My Orders & Live Tracking</span>
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse space-y-4">
              <div className="bg-gray-200 h-4 w-1/3 rounded" />
              <div className="bg-gray-200 h-20 w-full rounded" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No orders placed yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explore our daily grocery catalog and schedule an express store pickup or doorstep delivery!
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
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
            const stepLabels = isPickup
              ? ['Order Placed', 'Confirmed', 'Preparing Order', 'Ready at Counter', 'Picked Up']
              : ['Order Placed', 'Confirmed', 'Preparing Order', 'Out for Delivery', 'Delivered'];

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:border-gray-300 transition"
              >
                <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-gray-900">{order.orderNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'DELIVERED' || order.status === 'PICKED_UP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-900'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Placed on: {new Date(order.placedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">Total Amount</p>
                      <p className="text-base font-black text-emerald-800">₹{order.totalAmount.toFixed(2)}</p>
                    </div>

                    {order.canCancel && (
                      <button
                        onClick={() => setCancellingOrderId(order.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold border border-red-200 transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {cancellingOrderId === order.id && (
                  <div className="p-4 bg-red-50 border-b border-red-200 space-y-2">
                    <p className="text-xs font-bold text-red-900">Confirm Order Cancellation</p>
                    <input
                      type="text"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Reason for cancellation (e.g. duplicate order, change of plan)"
                      className="w-full p-2 text-xs border border-red-300 rounded-lg bg-white"
                    />
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => setCancellingOrderId(null)}
                        className="px-3 py-1 text-xs font-bold text-gray-600"
                      >
                        Never mind
                      </button>
                      <button
                        disabled={isSubmittingCancel}
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-1 bg-red-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-red-700 disabled:opacity-50"
                      >
                        {isSubmittingCancel ? 'Cancelling...' : 'Confirm Cancel & Restock'}
                      </button>
                    </div>
                  </div>
                )}

                {order.status !== 'CANCELLED' ? (
                  <div className="p-5 border-b border-gray-100 bg-white">
                    <div className="grid grid-cols-5 gap-2 text-center relative">
                      {stepLabels.map((label, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <div key={label} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-sm'
                                  : 'bg-gray-100 text-gray-400'
                              } ${isCurrent ? 'animate-pulse' : ''}`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] sm:text-xs mt-1.5 leading-tight font-medium ${
                                isDone ? 'text-gray-900 font-bold' : 'text-gray-400'
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
                  <div className="p-4 bg-red-50/50 border-b border-red-100 flex items-center space-x-2 text-red-700 text-xs font-medium">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Cancelled: {order.cancellationReason || 'Cancelled upon customer request'}</span>
                  </div>
                )}

                <div className="p-4 bg-emerald-50/40 border-b border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {isPickup ? (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                        <Store className="w-4 h-4 text-emerald-700" />
                        <span>Store Pickup Instructions</span>
                      </div>
                      <p className="text-gray-600">
                        Slot: <span className="font-bold text-gray-800">{order.pickupSlot?.formattedSlot || 'Reserved Slot'}</span>
                      </p>
                      <p className="text-gray-600">Location: Mini D-Mart Super Store, Metro Plaza Counter #2</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        <span>Delivery Address</span>
                      </div>
                      <p className="text-gray-700">{order.deliveryAddress}, {order.deliveryCity} - {order.deliveryPincode}</p>
                      <p className="text-gray-500">Contact Phone: {order.deliveryPhone}</p>
                    </div>
                  )}

                  {isPickup && order.pickupVerificationCode && order.status !== 'PICKED_UP' && order.status !== 'CANCELLED' && (
                    <div className="bg-white p-3 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-2xs">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Counter Pickup OTP / PIN</p>
                        <p className="text-xl font-mono font-black text-emerald-800 tracking-wider">
                          {order.pickupVerificationCode}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold bg-yellow-100 text-yellow-900 px-2 py-1 rounded-lg">
                        Show at counter
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 divide-y divide-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                    Purchased Items ({order.items.length})
                  </h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 p-1 border border-gray-100 flex items-center justify-center flex-shrink-0">
                          {item.productImageUrl ? (
                            <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{item.productName}</p>
                          <p className="text-[11px] text-gray-500">
                            {item.unit} • Qty: <span className="font-bold text-gray-800">{item.quantity}</span> • ₹{item.unitPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-black text-gray-900">₹{item.subtotal.toFixed(2)}</span>

                        {(order.status === 'DELIVERED' || order.status === 'PICKED_UP') && !item.isReturnedOrExchanged && (
                          <button
                            onClick={() => handleOpenReturnModal(order, item)}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[11px] border border-emerald-200 transition"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Return / Exchange</span>
                          </button>
                        )}
                        {item.isReturnedOrExchanged && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
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
