import React, { useState, useEffect } from 'react';
import { X, RotateCcw, RefreshCw, CheckCircle, ShieldAlert, Package, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { Order, OrderItem, ReturnEligibility, ReturnReason, ReturnType, Product } from '../types';
import { useToast } from '../context/ToastContext';

interface ReturnModalProps {
  isOpen: boolean;
  order: Order | null;
  item: OrderItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ReturnModal: React.FC<ReturnModalProps> = ({ isOpen, order, item, onClose, onSuccess }) => {
  const { success, error } = useToast();
  const [eligibility, setEligibility] = useState<ReturnEligibility | null>(null);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(false);
  const [type, setType] = useState<ReturnType>('RETURN');
  const [reason, setReason] = useState<ReturnReason>('DAMAGED');
  const [details, setDetails] = useState('');
  const [imageEvidenceUrl, setImageEvidenceUrl] = useState('');
  const [exchangeProducts, setExchangeProducts] = useState<Product[]>([]);
  const [selectedExchangeProductId, setSelectedExchangeProductId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && order && item) {
      checkEligibility();
      fetchExchangeProducts();
    }
  }, [isOpen, order, item]);

  const checkEligibility = async () => {
    if (!order || !item) return;
    try {
      setIsLoadingEligibility(true);
      const res = await api.get<ReturnEligibility>(
        `/returns/customer/eligibility?orderId=${order.id}&orderItemId=${item.id}`
      );
      setEligibility(res.data);
    } catch {
      setEligibility(null);
    } finally {
      setIsLoadingEligibility(false);
    }
  };

  const fetchExchangeProducts = async () => {
    try {
      const res = await api.get<Product[]>('/products?inStockOnly=true');
      setExchangeProducts(res.data);
      if (res.data.length > 0) {
        setSelectedExchangeProductId(res.data[0].id);
      }
    } catch {
      // Ignored
    }
  };

  if (!isOpen || !order || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/returns/customer', {
        orderId: order.id,
        orderItemId: item.id,
        type,
        reason,
        details,
        imageEvidenceUrl: imageEvidenceUrl.trim() || undefined,
        exchangeProductId: type === 'EXCHANGE' ? selectedExchangeProductId : undefined,
      });

      success('Request Submitted', 'Your return / exchange request has been submitted for staff review.');
      onSuccess();
      onClose();
    } catch (err: any) {
      error('Submission Failed', err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative border border-slate-200 dark:border-slate-800 my-8 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Request Return or Exchange</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Order #{order.orderNumber}</p>
          </div>
        </div>

        {/* Selected Item Card */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
            {item.productImageUrl ? (
              <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-contain" />
            ) : (
              <Package className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{item.productName}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {item.unit} • Qty: {item.quantity} • ₹{item.subtotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Eligibility Banner */}
        {isLoadingEligibility ? (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs rounded-2xl text-center mb-4">
            Checking return eligibility policy...
          </div>
        ) : eligibility ? (
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-start space-x-2.5 mb-4 ${
              eligibility.isEligible
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            {eligibility.isEligible ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{eligibility.isEligible ? 'Eligible for Return / Exchange' : 'Not Eligible'}</p>
              <p className="text-[11px] mt-0.5">{eligibility.reasonMessage}</p>
            </div>
          </div>
        ) : null}

        {eligibility?.isEligible ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Action Requested</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('RETURN')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs flex items-center justify-center space-x-2 transition ${
                    type === 'RETURN'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refund (₹{item.subtotal.toFixed(2)})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('EXCHANGE')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs flex items-center justify-center space-x-2 transition ${
                    type === 'EXCHANGE'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Product Exchange</span>
                </button>
              </div>
            </div>

            {type === 'EXCHANGE' && (
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Select Replacement Product
                </label>
                <select
                  value={selectedExchangeProductId || ''}
                  onChange={(e) => setSelectedExchangeProductId(Number(e.target.value))}
                  className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                >
                  {exchangeProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit}) — ₹{p.sellingPrice.toFixed(2)} [In stock: {p.stockQuantity}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Reason for Request</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReturnReason)}
                className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="DAMAGED">Damaged packaging / Broken seal</option>
                <option value="WRONG_ITEM">Wrong item delivered</option>
                <option value="EXPIRED">Item near or past expiry date</option>
                <option value="QUALITY_ISSUE">Quality / Freshness issue</option>
                <option value="DEFECTIVE">Defective item</option>
                <option value="OTHER">Other reason</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Issue Description</label>
              <textarea
                rows={2}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the condition or issue in detail..."
                className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Image Evidence URL (Optional)
              </label>
              <input
                type="url"
                value={imageEvidenceUrl}
                onChange={(e) => setImageEvidenceUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-right pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnModal;
