import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Shield, MapPin, Package, RotateCcw, Heart, CheckCircle2, ChevronRight, Save, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';

interface SavedAddress {
  id: string;
  tag: string;
  address: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem('onemart_saved_addresses') || localStorage.getItem('minidmart_saved_addresses');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: '1',
              tag: 'Home',
              address: 'Flat 402, Sunshine Heights, MG Road',
              city: 'Mumbai',
              pincode: '400001',
              isDefault: true,
            },
          ];
    } catch {
      return [];
    }
  });

  const [newTag, setNewTag] = useState('Office');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newPincode, setNewPincode] = useState('400001');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Validation Error', 'Name cannot be empty');
      return;
    }
    try {
      setIsSaving(true);
      await api.put('/users/profile', {
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      await refreshUser();
      success('Profile Updated', 'Your profile details have been saved.');
    } catch (err: any) {
      error('Update Failed', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim() || !newCity.trim() || !newPincode.trim()) {
      error('Incomplete Fields', 'Please complete all address fields');
      return;
    }
    const newAddr: SavedAddress = {
      id: Date.now().toString(),
      tag: newTag,
      address: newAddress.trim(),
      city: newCity.trim(),
      pincode: newPincode.trim(),
      isDefault: savedAddresses.length === 0,
    };
    const updated = [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    try {
      localStorage.setItem('onemart_saved_addresses', JSON.stringify(updated));
    } catch {}
    setIsAddingAddress(false);
    setNewAddress('');
    success('Address Added', `Saved "${newTag}" to your address book.`);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    try {
      localStorage.setItem('onemart_saved_addresses', JSON.stringify(updated));
    } catch {}
    success('Address Removed', 'Address removed from your saved list.');
  };

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
        <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span>My Account</span>
      </div>

      <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5 mb-8">
        <User className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        <span>Customer Account & Profile</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Quick Navigation & Stats Card */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{user.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user.email}</p>
            </div>
            <div className="inline-block bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-0.5 rounded-full text-[11px] font-bold">
              Verified {user.role} Account
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800">
            <Link
              to="/customer/orders"
              className="flex items-center justify-between py-3 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>My Orders & Live Tracking</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/customer/returns"
              className="flex items-center justify-between py-3 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              <span className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Returns & Exchanges</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center justify-between py-3 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Saved Wishlist</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Right Side: Edit Profile & Saved Addresses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Active Member
              </span>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Email is linked to your account security and cannot be edited.</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile Details'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Saved Addresses Book */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Saved Delivery Addresses</span>
              </h3>
              {!isAddingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Tag</label>
                    <select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="House/Flat No, Apartment, Street"
                    className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    placeholder="6-digit pincode"
                    className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{addr.tag}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">{addr.address}, {addr.city} - {addr.pincode}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
