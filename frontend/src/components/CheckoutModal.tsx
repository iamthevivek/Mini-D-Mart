import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Store,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { PickupSlot, FulfillmentType, PaymentMethod, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('STORE_PICKUP');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400001');
  const [phone, setPhone] = useState(user?.phone || '');
  const [instructions, setInstructions] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  const getLocalDateString = (d: Date = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = new Date();
  const todayStr = getLocalDateString(todayDate);

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrowDate);

  const currentHour = todayDate.getHours();
  const currentMinute = todayDate.getMinutes();
  const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCompletedOrder(null);
      fetchSlots();

      if (user?.phone) {
        setPhone(user.phone);
      }

      try {
        const key = user?.id ? `onemart_saved_addresses_${user.id}` : 'onemart_saved_addresses';
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const valid = parsed.filter(
              (a: any) =>
                !(
                  a.address === 'Flat 402, Sunshine Heights, MG Road' &&
                  a.city === 'Mumbai' &&
                  a.pincode === '400001'
                )
            );
            setSavedAddresses(valid);
            const defaultAddr = valid.find((a: any) => a.isDefault) || valid[0];
            if (defaultAddr) {
              setAddress(defaultAddr.address || '');
              setCity(defaultAddr.city || 'Mumbai');
              setPincode(defaultAddr.pincode || '400001');
            }
          }
        }
      } catch {}
    }
  }, [isOpen, user]);

  const fetchSlots = async () => {
    try {
      setIsLoadingSlots(true);
      const res = await api.get<PickupSlot[]>('/slots');
      setSlots(res.data);

      const nowD = new Date();
      const tStr = getLocalDateString(nowD);
      const tomD = new Date();
      tomD.setDate(tomD.getDate() + 1);
      const tomStr = getLocalDateString(tomD);
      const cTime = `${String(nowD.getHours()).padStart(2, '0')}:${String(nowD.getMinutes()).padStart(2, '0')}`;

      const validSlots = res.data.filter((s) => {
        if (s.slotDate === tStr) return s.startTime.substring(0, 5) > cTime;
        if (s.slotDate === tomStr) return true;
        return false;
      });

      const firstAvailable = validSlots.find((s) => s.available);
      if (firstAvailable) {
        setSelectedSlotId(firstAvailable.id);
      } else if (validSlots.length > 0) {
        setSelectedSlotId(validSlots[0].id);
      }
    } catch {
      // Ignored
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
          error('Slot Required', 'Please select a pickup time slot');
          setIsSubmitting(false);
          return;
        }
        payload.pickupSlotId = selectedSlotId;
      } else {
        if (!address.trim() || !city.trim() || !pincode.trim() || !phone.trim()) {
          error('Address Required', 'Please fill in all delivery address details');
          setIsSubmitting(false);
          return;
        }
        payload.deliveryAddress = address.trim();
        payload.deliveryCity = city.trim();
        payload.deliveryPincode = pincode.trim();
        payload.deliveryPhone = phone.trim();
        payload.deliveryInstructions = instructions.trim();
      }

      const res = await api.post<Order>('/orders/customer', payload);
      setCompletedOrder(res.data);
      setStep(4);
      clearCart();
      success('Order Placed Successfully!', `Order reference #${res.data.orderNumber}`);
    } catch (err: any) {
      error('Order Failed', err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onClose();
    setCompletedOrder(null);
    navigate('/customer/orders');
  };

  // Filter slots to only include TODAY (after current time) and TOMORROW (all)
  const filteredSlots = slots.filter((slot) => {
    if (slot.slotDate === todayStr) {
      return slot.startTime.substring(0, 5) > currentTimeStr;
    }
    if (slot.slotDate === tomorrowStr) {
      return true;
    }
    return false;
  });

  const slotsByDate = filteredSlots.reduce<Record<string, PickupSlot[]>>((acc, slot) => {
    acc[slot.slotDate] = acc[slot.slotDate] || [];
    acc[slot.slotDate].push(slot);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative border border-slate-200 dark:border-slate-800 my-8 animate-scale-in">
        {step !== 4 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Step Indicator Header */}
        {step !== 4 && (
          <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  {step === 1 && 'Fulfillment Method'}
                  {step === 2 && 'Payment Option'}
                  {step === 3 && 'Order Review & Place'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Step {step} of 3</p>
              </div>
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step === s
                        ? 'w-8 bg-emerald-600 dark:bg-emerald-500'
                        : step > s
                        ? 'w-4 bg-emerald-300 dark:bg-emerald-800'
                        : 'w-4 bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Fulfillment */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('STORE_PICKUP')}
                className={`flex items-start space-x-3 p-4 rounded-2xl border-2 text-left transition ${
                  fulfillmentType === 'STORE_PICKUP'
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Express Store Pickup</span>
                    <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">FREE</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Collect at counter in 15 mins with 6-digit OTP PIN</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('HOME_DELIVERY')}
                className={`flex items-start space-x-3 p-4 rounded-2xl border-2 text-left transition ${
                  fulfillmentType === 'HOME_DELIVERY'
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Doorstep Home Delivery</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Direct express delivery to your home address</p>
                </div>
              </button>
            </div>

            {fulfillmentType === 'STORE_PICKUP' ? (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Select Store Pickup Time Slot:</span>
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Ready in 15 mins</span>
                </div>

                {isLoadingSlots ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">Loading available slots...</p>
                ) : Object.keys(slotsByDate).length === 0 ? (
                  <p className="text-xs text-amber-600 dark:text-amber-400 py-4 text-center">No available pickup slots for today or tomorrow.</p>
                ) : (
                  <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
                    {Object.entries(slotsByDate).map(([date, dateSlots]) => {
                      const dateLabel =
                        date === todayStr ? `Today (${date})` : date === tomorrowStr ? `Tomorrow (${date})` : `Date: ${date}`;

                      return (
                        <div key={date}>
                          <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{dateLabel}</span>
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
                                      ? 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                                      : 'border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed'
                                  }`}
                                >
                                  <p className="text-xs font-bold">
                                    {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                  </p>
                                  <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                                    {isAvailable ? `${slot.remainingCapacity} slots left` : 'Fully booked'}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-700/80">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Delivery Address & Contact Details</span>
                  </h4>
                  {savedAddresses.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400">Quick fill:</span>
                      {savedAddresses.map((sa) => (
                        <button
                          key={sa.id}
                          type="button"
                          onClick={() => {
                            setAddress(sa.address);
                            setCity(sa.city);
                            setPincode(sa.pincode);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                            address === sa.address && city === sa.city && pincode === sa.pincode
                              ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400'
                          }`}
                        >
                          {sa.tag} {sa.isDefault && '★'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                      placeholder="House/Flat No, Apartment, Street"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                      placeholder="City (e.g. Mumbai)"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                      placeholder="Pincode (e.g. 400001)"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Choose Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    method: 'CASH_ON_DELIVERY',
                    label: 'Pay on Handover / Delivery',
                    desc: 'Cash or Card swipe at the store counter or doorstep',
                    icon: ShieldCheck,
                    available: true,
                  },
                  {
                    method: 'UPI',
                    label: 'UPI QR Code / Instant Pay',
                    desc: 'Scan QR with Google Pay, PhonePe, Paytm',
                    icon: QrCode,
                    available: true,
                  },
                  {
                    method: 'CARD',
                    label: 'Credit / Debit Card',
                    desc: 'Visa, MasterCard, RuPay (Test mode)',
                    icon: CreditCard,
                    available: true,
                  },
                  {
                    method: 'NET_BANKING',
                    label: 'Net Banking',
                    desc: 'HDFC, ICICI, SBI, Axis (Test mode)',
                    icon: Banknote,
                    available: true,
                  },
                ].map(({ method, label, desc, icon: Icon, available }) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method as PaymentMethod)}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start space-x-3 transition ${
                      paymentMethod === method
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center space-x-4">
                <div className="w-20 h-20 bg-white p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <QrCode className="w-16 h-16 text-slate-800" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Scan & Pay via UPI</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">UPI ID: <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">onemart@upi</span></p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Instant order confirmation on payment scan</p>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
              >
                <span>Review Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Review & Confirmation */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Fulfillment Mode:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {fulfillmentType === 'STORE_PICKUP' ? 'Express Store Pickup (15-min)' : 'Home Delivery'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Payment Selected:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{paymentMethod.replace(/_/g, ' ')}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Cart Items ({cart?.totalItems || 0})</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">₹{cart?.subtotal.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">₹{cart?.estimatedTax.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  {cart?.deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-900 dark:text-slate-100">₹{cart?.deliveryFee.toFixed(2) || '0.00'}</span>
                  )}
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-slate-100">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-base">₹{cart?.totalAmount.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
              >
                <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success & Verification Screen */}
        {step === 4 && completedOrder && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Order Confirmed!</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Thank you, <span className="font-bold text-slate-900 dark:text-slate-100">{user?.name}</span>! Your grocery order has been received.
            </p>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-5 max-w-md mx-auto text-left space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Order Number:</span>
                <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 text-sm">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Total Paid / Due:</span>
                <span className="font-black text-slate-900 dark:text-slate-100 text-base">₹{completedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Fulfillment:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {completedOrder.fulfillmentType === 'STORE_PICKUP' ? 'Store Pickup' : 'Home Delivery'}
                </span>
              </div>

              {completedOrder.fulfillmentType === 'STORE_PICKUP' && completedOrder.pickupVerificationCode && (
                <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800 text-center">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">Store Pickup 6-Digit OTP / PIN:</p>
                  <span className="inline-block bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 text-2xl font-mono font-black tracking-widest px-5 py-2 rounded-2xl border border-emerald-300 dark:border-emerald-700 shadow-sm">
                    {completedOrder.pickupVerificationCode}
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1.5">
                    Show this OTP at the OneMart counter to collect your packed order.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-center space-x-3">
              <button
                onClick={handleFinish}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center space-x-1.5"
              >
                <span>Track Live Order Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
