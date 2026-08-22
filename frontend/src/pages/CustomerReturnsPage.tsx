import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, RefreshCw, ChevronRight, Package, ArrowLeft } from 'lucide-react';
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
        return <span className="bg-yellow-100 text-yellow-900 border border-yellow-300 text-xs px-2.5 py-0.5 rounded-full font-bold">Under Review</span>;
      case 'APPROVED':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs px-2.5 py-0.5 rounded-full font-bold">Approved</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold">Completed & Refunded</span>;
      case 'REJECTED':
        return <span className="bg-red-100 text-red-800 border border-red-300 text-xs px-2.5 py-0.5 rounded-full font-bold">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full font-bold">{status}</span>;
    }
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
            <RotateCcw className="w-6 h-6 text-emerald-600" />
            <span>Returns & Exchanges History</span>
          </h1>
        </div>

        <button
          onClick={fetchReturns}
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
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse space-y-3">
              <div className="bg-gray-200 h-4 w-1/3 rounded" />
              <div className="bg-gray-200 h-16 w-full rounded" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No return or exchange requests</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You can request a return or product exchange on any eligible delivered grocery item within 7 days from your Orders page.
          </p>
          <Link
            to="/customer/orders"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
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
              className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-gray-900">{req.requestNumber}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 font-mono">Order #{req.orderNumber}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {req.type}
                  </span>
                </div>
                <div>{getStatusBadge(req.status)}</div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gray-50 rounded-xl p-1 border border-gray-200 flex items-center justify-center flex-shrink-0">
                  {req.orderItem?.productImageUrl ? (
                    <img src={req.orderItem.productImageUrl} alt={req.orderItem.productName} className="w-full h-full object-contain" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900">{req.orderItem?.productName}</h4>
                  <p className="text-xs text-gray-500">
                    Reason: <span className="font-bold text-gray-800">{req.reason.replace(/_/g, ' ')}</span>
                  </p>
                  {req.details && <p className="text-xs text-gray-600 mt-1 italic">"{req.details}"</p>}
                </div>
                <div className="text-right">
                  {req.type === 'RETURN' ? (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Refund Amount</p>
                      <p className="text-base font-black text-emerald-700">₹{req.refundAmount.toFixed(2)}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Exchange With</p>
                      <p className="text-xs font-bold text-gray-900">{req.exchangeProduct?.name || 'Replacement Item'}</p>
                    </div>
                  )}
                </div>
              </div>

              {req.staffReviewNotes && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700">
                  <span className="font-bold text-gray-900">Staff Inspection Remarks:</span> {req.staffReviewNotes}
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
