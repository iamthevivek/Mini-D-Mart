import React, { useState, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Layers,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import api from '../api/client';
import { Product, Category, PickupSlot, StoreDashboardSummary } from '../types';
import { useToast } from '../context/ToastContext';

const ManagerDashboardPage: React.FC = () => {
  const { success, error } = useToast();
  const [summary, setSummary] = useState<StoreDashboardSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'slots' | 'categories'>('inventory');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState<number>(0);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategory, setProdCategory] = useState<number>(1);
  const [prodSku, setProdSku] = useState('');
  const [prodUnit, setProdUnit] = useState('1 kg');
  const [prodMrp, setProdMrp] = useState('100.00');
  const [prodSelling, setProdSelling] = useState('85.00');
  const [prodStock, setProdStock] = useState('50');
  const [prodImg, setProdImg] = useState('');

  const [slotDate, setSlotDate] = useState(new Date().toISOString().split('T')[0]);
  const [slotStart, setSlotStart] = useState('09:00');
  const [slotEnd, setSlotEnd] = useState('11:00');
  const [slotCap, setSlotCap] = useState(25);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsRefreshing(true);
      const [summaryRes, prodRes, catRes, slotRes] = await Promise.all([
        api.get<StoreDashboardSummary>('/analytics/summary'),
        api.get<Product[]>('/products/all'),
        api.get<Category[]>('/categories/all'),
        api.get<PickupSlot[]>('/slots/all'),
      ]);
      setSummary(summaryRes.data);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setSlots(slotRes.data);
      if (catRes.data.length > 0 && !prodCategory) setProdCategory(catRes.data[0].id);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    try {
      await api.patch(`/products/${adjustingProduct.id}/stock`, {
        stockQuantity: newStock,
        reason: 'Manager stock adjustment',
      });
      success('Stock Adjusted', `Stock quantity for ${adjustingProduct.name} set to ${newStock}`);
      setAdjustingProduct(null);
      fetchAllData();
    } catch (err: any) {
      error('Stock Update Error', err.response?.data?.message || 'Failed to adjust stock');
    }
  };

  const handleToggleProduct = async (id: number) => {
    try {
      await api.patch(`/products/${id}/toggle`);
      success('Status Toggled', 'Product active status updated');
      fetchAllData();
    } catch (err: any) {
      error('Toggle Error', err.response?.data?.message || 'Failed to toggle product status');
    }
  };

  const handleToggleSlot = async (id: number) => {
    try {
      await api.patch(`/slots/${id}/toggle`);
      success('Slot Toggled', 'Pickup slot active status updated');
      fetchAllData();
    } catch (err: any) {
      error('Slot Toggle Error', err.response?.data?.message || 'Failed to toggle slot');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name: prodName,
        description: prodDesc,
        categoryId: prodCategory,
        sku: prodSku,
        unit: prodUnit,
        mrpPrice: parseFloat(prodMrp),
        sellingPrice: parseFloat(prodSelling),
        stockQuantity: parseInt(prodStock),
        lowStockThreshold: 10,
        imageUrl: prodImg.trim() || undefined,
        isReturnable: true,
        returnWindowDays: 7,
      });
      success('Product Created', `Added ${prodName} to the store catalog.`);
      setIsAddProductOpen(false);
      setProdName('');
      setProdDesc('');
      setProdSku('');
      setProdImg('');
      fetchAllData();
    } catch (err: any) {
      error('Creation Error', err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/slots', {
        slotDate,
        startTime: `${slotStart}:00`,
        endTime: `${slotEnd}:00`,
        maxCapacity: slotCap,
      });
      success('Pickup Slot Created', `Added slot for ${slotDate} (${slotStart} - ${slotEnd})`);
      fetchAllData();
    } catch (err: any) {
      error('Slot Creation Error', err.response?.data?.message || 'Failed to create slot');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSlots = [...slots].sort((a, b) => {
    const dateCmp = a.slotDate.localeCompare(b.slotDate);
    if (dateCmp !== 0) return dateCmp;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-3 py-1 rounded-full">
            Manager Control Center
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            Store Inventory, Slot Capacity & Analytics
          </h1>
        </div>

        <button
          onClick={fetchAllData}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-xs font-bold">Total Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              ₹{summary.totalRevenue.toFixed(2)}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Paid Orders</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-xs font-bold">Total Orders</span>
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{summary.totalOrders}</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">{summary.activeOrders} Active in Queue</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-xs font-bold">Low Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">{summary.lowStockCount}</p>
            <p className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold mt-1">Needs Replenishment</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-xs font-bold">Pending Returns</span>
              <RotateCcw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-purple-700 dark:text-purple-300">{summary.pendingReturnsCount}</p>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1">Awaiting Review</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-xs font-bold">Return Rate</span>
              <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{summary.returnRatePercent}%</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">Of Completed Orders</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product & Stock Master ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('slots')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition whitespace-nowrap ${
            activeTab === 'slots'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pickup Slot Capacity ({slots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>
      </div>

      {/* Tab 1: Product Master */}
      {activeTab === 'inventory' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name or SKU..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU / Category</th>
                  <th className="p-4">Selling / MRP</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{p.sku}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.category?.name || 'General'}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400">₹{p.sellingPrice.toFixed(2)}</p>
                      <p className="text-[11px] text-slate-400 line-through">₹{p.mrpPrice.toFixed(2)}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                          p.stockQuantity <= p.lowStockThreshold
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          p.active
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {p.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setAdjustingProduct(p);
                          setNewStock(p.stockQuantity);
                        }}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl font-bold border border-blue-200 dark:border-blue-800 transition"
                      >
                        Stock +/-
                      </button>
                      <button
                        onClick={() => handleToggleProduct(p.id)}
                        className={`px-3 py-1 rounded-xl font-bold transition ${
                          p.active
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {p.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Pickup Slots */}
      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add Pickup Time Slot</h3>
            <form onSubmit={handleCreateSlot} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Slot Date</label>
                <input
                  type="date"
                  required
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={slotStart}
                    onChange={(e) => setSlotStart(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={slotEnd}
                    onChange={(e) => setSlotEnd(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Order Capacity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={slotCap}
                  onChange={(e) => setSlotCap(parseInt(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
              >
                Create Pickup Slot
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Configured Store Pickup Slots ({sortedSlots.length})</span>
              <span className="text-[11px] text-slate-500 font-normal">Sorted chronologically</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
              {sortedSlots.map((s) => {
                const isFull = s.remainingCapacity <= 0;
                const fillPercent = Math.min(100, Math.round((s.bookedCount / s.maxCapacity) * 100));

                return (
                  <div key={s.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{s.slotDate}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">
                          {s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {s.bookedCount} / {s.maxCapacity} booked ({s.remainingCapacity} left)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSlot(s.id)}
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] border transition ${
                        s.active
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {s.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Categories */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-contain" />
                ) : (
                  <Layers className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">{c.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{c.description || 'Category'}</p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.2 rounded-full inline-block mt-1">
                  Active Category
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Adjust Inventory Stock</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Product: <span className="font-bold text-slate-800 dark:text-slate-200">{adjustingProduct.name}</span>
            </p>
            <form onSubmit={handleAdjustStock} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">New Stock Quantity</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-3.5 py-2 text-slate-500 font-bold hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-xl border border-slate-200 dark:border-slate-800 my-8 animate-scale-in">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Add New Catalog Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Organic Farm Tomatoes"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Product description and details..."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    placeholder="DM-VEG-999"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pack Unit</label>
                  <input
                    type="text"
                    required
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="1 kg"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodMrp}
                    onChange={(e) => setProdMrp(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Selling (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodSelling}
                    onChange={(e) => setProdSelling(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={prodImg}
                    onChange={(e) => setProdImg(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboardPage;
