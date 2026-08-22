import React, { useState, useEffect } from 'react';
import { X, RotateCcw, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../api/client';
import { Order, OrderItem, ReturnEligibility, ReturnReason, ReturnType, Product } from '../types';

interface ReturnModalProps {
  isOpen: boolean;
  order: Order | null;
  item: OrderItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ReturnModal: React.FC<ReturnModalProps> = ({ isOpen, order, item, onClose, onSuccess }) => {
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

      alert('Return / Exchange request submitted successfully.');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Request Return or Exchange</h3>
            <p className="text-xs text-gray-500 font-mono">Order #{order.orderNumber}</p>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-lg p-1 border border-gray-100 flex items-center justify-center">
            {item.productImageUrl ? (
              <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-contain" />
            ) : (
              <RotateCcw className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900 truncate">{item.productName}</h4>
            <p className="text-[11px] text-gray-500">{item.unit} • Qty: {item.quantity} • ₹{item.subtotal.toFixed(2)}</p>
          </div>
        </div>

        {isLoadingEligibility ? (
          <div className="p-3 bg-gray-50 text-gray-500 text-xs rounded-xl text-center mb-4">
            Validating return eligibility & policy...
          </div>
        ) : eligibility ? (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start space-x-2 mb-4 ${
              eligibility.isEligible
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {eligibility.isEligible ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{eligibility.isEligible ? 'Eligible for Return' : 'Ineligible'}</p>
              <p className="text-[11px] mt-0.5">{eligibility.reasonMessage}</p>
            </div>
          </div>
        ) : null}

        {eligibility?.isEligible ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1.5">Action Requested</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('RETURN')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center space-x-2 transition ${
                    type === 'RETURN'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refund (₹{item.subtotal.toFixed(2)})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('EXCHANGE')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center space-x-2 transition ${
                    type === 'EXCHANGE'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Item Exchange</span>
                </button>
              </div>
            </div>

            {type === 'EXCHANGE' && (
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Select Replacement Product</label>
                <select
                  value={selectedExchangeProductId || ''}
                  onChange={(e) => setSelectedExchangeProductId(Number(e.target.value))}
                  className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-1 focus:ring-emerald-500"
                >
                  {exchangeProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit}) - ₹{p.sellingPrice.toFixed(2)} [Stock: {p.stockQuantity}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Reason for Return / Exchange</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReturnReason)}
                className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-1 focus:ring-emerald-500"
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
              <label className="text-xs font-bold text-gray-800 block mb-1">Issue Description</label>
              <textarea
                rows={2}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe the issue in detail..."
                className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Image Evidence URL (Optional)</label>
              <input
                type="url"
                value={imageEvidenceUrl}
                onChange={(e) => setImageEvidenceUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 rounded-xl"
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
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs"
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
