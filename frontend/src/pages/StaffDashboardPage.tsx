import React, { useState, useEffect } from 'react';
import { Package, Store, Truck, CheckCircle2, RotateCcw, Clock, AlertCircle, RefreshCw, Check, XCircle } from 'lucide-react';
import api from '../api/client';
import { Order, OrderStatus, ReturnRequest, ReturnStatus } from '../types';
import { useToast } from '../context/ToastContext';

const StaffDashboardPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [queue, setQueue] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'queue' | 'otp' | 'returns'>('queue');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const [staffNotes, setStaffNotes] = useState('');
  const [restockItem, setRestockItem] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const [queueRes, returnsRes] = await Promise.all([
        api.get<Order[]>('/orders/staff/queue'),
        api.get<ReturnRequest[]>('/returns/staff'),
      ]);
      setQueue(queueRes.data);
      setReturns(returnsRes.data);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, nextStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await api.patch(`/orders/staff/${orderId}/status`, {
        status: nextStatus,
        staffNotes: `Status advanced to ${nextStatus} by staff`,
      });
      success('Order Updated', `Order status changed to ${nextStatus.replace(/_/g, ' ')}`);
      await fetchData();
    } catch (err: any) {
      error('Update Failed', err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleStaffCancel = async (orderId: number) => {
    try {
      setIsCancelling(true);
      await api.post(`/orders/staff/${orderId}/cancel`, {
        cancellationReason: cancelReason.trim() || 'Cancelled by staff operations team',
      });
      success('Order Cancelled', 'Order has been cancelled and stock replenished.');
      setCancellingOrderId(null);
      setCancelReason('');
      fetchData();
    } catch (err: any) {
      error('Cancel Failed', err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setVerifiedOrder(null);
    setIsVerifying(true);
    try {
      const res = await api.post<Order>('/orders/staff/verify-pickup', { verificationCode: verificationCode.trim() });
      setVerifiedOrder(res.data);
      setVerificationCode('');
      success('Pickup Verified!', `Handover completed for order #${res.data.orderNumber}`);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid OTP code or order already completed';
      setOtpError(msg);
      error('Verification Error', msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReviewReturn = async (requestId: number, status: ReturnStatus) => {
    try {
      setIsSubmittingReview(true);
      await api.patch(`/returns/staff/${requestId}/review`, {
        status,
        staffReviewNotes: staffNotes || `Processed as ${status} by staff`,
        restockItem,
      });
      success('Return Processed', `Request marked as ${status}`);
      setStaffNotes('');
      fetchData();
    } catch (err: any) {
      error('Review Error', err.response?.data?.message || 'Failed to review return request');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-3 py-1 rounded-full">
            Staff Operations Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            Store Dispatch & Pickup Counter Hub
          </h1>
        </div>

        <button
          onClick={fetchData}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Operations'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition whitespace-nowrap ${
            activeTab === 'queue'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Packing & Dispatch Queue ({queue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('otp')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition whitespace-nowrap ${
            activeTab === 'otp'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Pickup Counter 6-Digit OTP Verify</span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition whitespace-nowrap ${
            activeTab === 'returns'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Returns Inspection ({returns.filter((r) => r.status === 'PENDING').length})</span>
        </button>
      </div>

      {/* Tab 1: Dispatch Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {queue.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-2xs max-w-lg mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">All orders dispatched!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">There are no pending orders in the store queue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {queue.map((order) => {
                const isPickup = order.fulfillmentType === 'STORE_PICKUP';

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">{order.orderNumber}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Customer: <span className="font-bold text-slate-800 dark:text-slate-200">{order.userName}</span> ({order.items.length} items)
                          </p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 ${
                              isPickup
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            }`}
                          >
                            {isPickup ? <Store className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                            <span>{isPickup ? 'Store Pickup' : 'Home Delivery'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
                            <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[220px]">{item.productName}</span>
                            <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                              Qty: {item.quantity} ({item.unit})
                            </span>
                          </div>
                        ))}
                      </div>

                      {isPickup && order.pickupSlot && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Reserved Slot: <span className="font-bold text-slate-900 dark:text-slate-100">{order.pickupSlot.formattedSlot}</span></span>
                        </p>
                      )}
                      {!isPickup && order.deliveryAddress && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5">
                          Delivery: <span className="font-medium text-slate-800 dark:text-slate-200">{order.deliveryAddress}, {order.deliveryCity}</span>
                        </p>
                      )}
                    </div>

                    {cancellingOrderId === order.id ? (
                      <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-2">
                        <p className="text-xs font-bold text-rose-900 dark:text-rose-200">Staff Cancellation Reason</p>
                        <input
                          type="text"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="e.g. Out of stock / Customer requested cancel"
                          className="w-full p-2 text-xs border border-rose-300 dark:border-rose-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setCancellingOrderId(null)}
                            className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-400"
                          >
                            Back
                          </button>
                          <button
                            disabled={isCancelling}
                            onClick={() => handleStaffCancel(order.id)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                          >
                            {isCancelling ? 'Cancelling...' : 'Confirm Cancel & Restock'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                        {order.status === 'PLACED' && (
                          <button
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
                          >
                            {updatingOrderId === order.id ? 'Updating...' : 'Confirm Order'}
                          </button>
                        )}

                        {(order.status === 'PLACED' || order.status === 'CONFIRMED') && (
                          <button
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
                          >
                            {updatingOrderId === order.id ? 'Updating...' : 'Start Packing'}
                          </button>
                        )}

                        {order.status === 'PREPARING' && isPickup && (
                          <button
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
                          >
                            {updatingOrderId === order.id ? 'Updating...' : 'Ready for Counter Pickup'}
                          </button>
                        )}

                        {order.status === 'PREPARING' && !isPickup && (
                          <button
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
                          >
                            {updatingOrderId === order.id ? 'Updating...' : 'Dispatch for Delivery'}
                          </button>
                        )}

                        {order.status === 'OUT_FOR_DELIVERY' && (
                          <button
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
                          >
                            {updatingOrderId === order.id ? 'Updating...' : 'Mark Delivered'}
                          </button>
                        )}

                        <button
                          disabled={updatingOrderId === order.id}
                          onClick={() => setCancellingOrderId(order.id)}
                          className="px-3.5 py-2.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800 transition"
                          title="Cancel Order"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: OTP Verification */}
      {activeTab === 'otp' && (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Store className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pickup Counter Verification</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter customer 6-digit verification PIN / OTP to complete order handover
            </p>
          </div>

          {otpError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{otpError}</span>
            </div>
          )}

          {verifiedOrder && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Pickup Verified & Completed Successfully!</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">Order: <span className="font-bold">{verifiedOrder.orderNumber}</span></p>
              <p className="text-xs text-slate-700 dark:text-slate-300">Customer: <span className="font-bold">{verifiedOrder.userName}</span></p>
              <p className="text-xs text-slate-700 dark:text-slate-300">Total Paid: <span className="font-bold">₹{verifiedOrder.totalAmount.toFixed(2)}</span></p>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                6-Digit Verification PIN / OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="e.g. 748291"
                className="w-full text-center tracking-widest text-3xl font-mono font-black p-3.5 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || verificationCode.length < 4}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isVerifying ? 'Verifying PIN...' : 'Verify OTP & Complete Handover'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Returns Inspection */}
      {activeTab === 'returns' && (
        <div className="space-y-4">
          {returns.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-2xs max-w-lg mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No return requests</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">There are no pending customer returns or exchanges to inspect.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {returns.map((req) => (
                <div key={req.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{req.requestNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                      {req.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      {req.orderItem?.productImageUrl ? (
                        <img src={req.orderItem.productImageUrl} alt={req.orderItem.productName} className="w-full h-full object-contain" />
                      ) : (
                        <RotateCcw className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{req.orderItem?.productName}</p>
                      <p className="text-slate-500 dark:text-slate-400">Customer: <span className="font-medium text-slate-800 dark:text-slate-200">{req.userName}</span></p>
                      <p className="text-slate-500 dark:text-slate-400">Reason: <span className="font-bold text-amber-700 dark:text-amber-400">{req.reason}</span></p>
                    </div>
                  </div>

                  {req.details && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl italic">
                      "{req.details}"
                    </p>
                  )}

                  {req.status === 'PENDING' && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex space-x-2">
                      <button
                        onClick={() => handleReviewReturn(req.id, 'COMPLETED')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        Approve & Restock
                      </button>
                      <button
                        onClick={() => handleReviewReturn(req.id, 'REJECTED')}
                        className="px-4 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffDashboardPage;
