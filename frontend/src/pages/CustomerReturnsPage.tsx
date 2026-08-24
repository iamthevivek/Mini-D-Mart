import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, RefreshCw, ChevronRight, Package, ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import api from '../api/client';
import { ReturnRequest } from '../types';

const CustomerReturnsPage: React.FC = () => {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setIsRefreshing(true);
      const res = await api.get<ReturnRequest[]>('/returns/customer');
      setRequests(res.data);
    } catch {
      setRequests([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed & Refunded
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs px-3 py-1 rounded-full font-bold">
            {status}
          </span>
        );
    }
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
            <RotateCcw className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Returns & Exchanges History</span>
          </h1>
        </div>

        <button
          onClick={fetchReturns}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <div className="h-4 w-1/3 rounded skeleton-shimmer" />
              <div className="h-16 w-full rounded-2xl skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 max-w-lg mx-auto mt-8">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No return or exchange requests</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            You can request a replacement or full refund on any eligible delivered item within 7 days from your Orders page.
          </p>
          <Link
            to="/customer/orders"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to My Orders</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{req.requestNumber}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Order #{req.orderNumber}</span>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {req.type}
                  </span>
                </div>
                <div>{getStatusBadge(req.status)}</div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  {req.orderItem?.productImageUrl ? (
                    <img src={req.orderItem.productImageUrl} alt={req.orderItem.productName} className="w-full h-full object-contain" />
                  ) : (
                    <Package className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{req.orderItem?.productName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Reason: <span className="font-bold text-slate-800 dark:text-slate-200">{req.reason.replace(/_/g, ' ')}</span>
                  </p>
                  {req.details && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">"{req.details}"</p>}
                </div>
                <div className="text-right shrink-0">
                  {req.type === 'RETURN' ? (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Refund Amount</p>
                      <p className="text-base font-black text-emerald-700 dark:text-emerald-400">₹{req.refundAmount.toFixed(2)}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Replacement Item</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{req.exchangeProduct?.name || 'Selected Item'}</p>
                    </div>
                  )}
                </div>
              </div>

              {req.staffReviewNotes && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Staff Inspection Remarks:</span> {req.staffReviewNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerReturnsPage;
