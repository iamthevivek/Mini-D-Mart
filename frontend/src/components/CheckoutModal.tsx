import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Store, Truck, CreditCard, QrCode, Banknote, ShieldCheck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { PickupSlot, FulfillmentType, PaymentMethod, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('STORE_PICKUP');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [address, setAddress] = useState('Flat 302, Palm Heights, Main Street');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400001');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 00004');
  const [instructions, setInstructions] = useState('Please ring bell twice upon arrival');

  useEffect(() => {
    if (isOpen) {
      fetchSlots();
    }
  }, [isOpen]);

  const fetchSlots = async () => {
    try {
      setIsLoadingSlots(true);
      const res = await api.get<PickupSlot[]>('/slots');
      setSlots(res.data);
      if (res.data.length > 0) {
        setSelectedSlotId(res.data[0].id);
      }
    } catch {

    } finally {
      setIsLoadingSlots(false);
    }
  };

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);
      const payload: any = {
        fulfillmentType,
        paymentMethod,
      };

      if (fulfillmentType === 'STORE_PICKUP') {
        if (!selectedSlotId) {
          alert('Please select a pickup time slot');
          setIsSubmitting(false);
          return;
        }
        payload.pickupSlotId = selectedSlotId;
      } else {
        if (!address.trim() || !city.trim() || !pincode.trim() || !phone.trim()) {
          alert('Please fill out all required home delivery address fields');
          setIsSubmitting(false);
          return;
        }
        payload.deliveryAddress = address;
        payload.deliveryCity = city;
        payload.deliveryPincode = pincode;
        payload.deliveryPhone = phone;
        payload.deliveryInstructions = instructions;
      }

      const res = await api.post<Order>('/orders/customer', payload);
      setCompletedOrder(res.data);
      clearCart();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onClose();
    setCompletedOrder(null);
    navigate('/customer/orders');
  };

  const slotsByDate = slots.reduce<Record<string, PickupSlot[]>>((acc, slot) => {
    acc[slot.slotDate] = acc[slot.slotDate] || [];
    acc[slot.slotDate].push(slot);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-gray-100 my-8">
        {!completedOrder && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {completedOrder ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Order Confirmed!</h2>
            <p className="text-sm text-gray-600">
              Thank you, <span className="font-bold text-gray-900">{user?.name}</span>! Your order has been placed successfully.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Order Reference:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Total Paid:</span>
                <span className="font-black text-gray-900 text-base">₹{completedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Fulfillment:</span>
                <span className="font-bold text-gray-800">
                  {completedOrder.fulfillmentType === 'STORE_PICKUP' ? 'Store Pickup' : 'Home Delivery'}
                </span>
              </div>

              {completedOrder.fulfillmentType === 'STORE_PICKUP' && completedOrder.pickupVerificationCode && (
                <div className="pt-3 border-t border-emerald-200 text-center">
                  <p className="text-xs text-emerald-800 font-semibold mb-1">Store Pickup Verification OTP / PIN:</p>
                  <span className="inline-block bg-white text-emerald-900 text-2xl font-mono font-black tracking-widest px-4 py-2 rounded-xl border border-emerald-300 shadow-xs">
                    {completedOrder.pickupVerificationCode}
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-1">Show this OTP at the Mini D-Mart counter to collect your order.</p>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-center space-x-3">
              <button
                onClick={handleFinish}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition"
              >
                Track Live Order Status
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Fast Checkout</h2>
            <p className="text-xs text-gray-500 mb-6">Choose fulfillment method and payment options</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setFulfillmentType('STORE_PICKUP')}
                className={`flex items-center justify-center space-x-2 p-3.5 rounded-2xl border-2 font-bold text-xs transition ${
                  fulfillmentType === 'STORE_PICKUP'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Express Store Pickup (FREE)</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('HOME_DELIVERY')}
                className={`flex items-center justify-center space-x-2 p-3.5 rounded-2xl border-2 font-bold text-xs transition ${
                  fulfillmentType === 'HOME_DELIVERY'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Home Delivery</span>
              </button>
            </div>

            {fulfillmentType === 'STORE_PICKUP' ? (
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600 mr-1" />
                    Select Store Pickup Slot:
                  </label>
                  <span className="text-[11px] text-gray-500">Ready in 15 mins</span>
                </div>

                {isLoadingSlots ? (
                  <p className="text-xs text-gray-500 py-4 text-center">Loading available slots...</p>
                ) : slots.length === 0 ? (
                  <p className="text-xs text-amber-700 py-4 text-center">No available slots for today. Try home delivery.</p>
                ) : (
                  <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                    {Object.entries(slotsByDate).map(([date, dateSlots]) => (
                      <div key={date}>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Date: {date}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {dateSlots.map((slot) => {
                            const isSelected = selectedSlotId === slot.id;
                            const isAvailable = slot.available;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => setSelectedSlotId(slot.id)}
                                className={`p-2.5 rounded-xl border text-left transition ${
                                  isSelected
                                    ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs'
                                    : isAvailable
                                    ? 'border-gray-200 hover:border-emerald-300 bg-white text-gray-800'
                                    : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                }`}
                              >
                                <p className="text-xs font-bold">
                                  {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                </p>
                                <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                                  {isAvailable ? `${slot.remainingCapacity} slots left` : 'Fully booked'}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Delivery Address & Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                      placeholder="House/Flat No, Apartment, Street"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-gray-800">Select Payment Method</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { method: 'UPI', label: 'UPI / QR Code', icon: QrCode },
                  { method: 'CARD', label: 'Card Payment', icon: CreditCard },
                  { method: 'NET_BANKING', label: 'Net Banking', icon: Banknote },
                  { method: 'CASH_ON_DELIVERY', label: 'Pay on Handover', icon: ShieldCheck },
                ].map(({ method, label, icon: Icon }) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method as PaymentMethod)}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1.5 transition ${
                      paymentMethod === method
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-700" />
                    <span className="text-[11px]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">Total Amount to Pay:</span>
                <span className="text-xl font-black text-emerald-800">₹{cart?.totalAmount.toFixed(2) || '0.00'}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
