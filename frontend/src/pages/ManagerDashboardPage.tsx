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
  Calendar
} from 'lucide-react';
import api from '../api/client';
import { Product, Category, PickupSlot, StoreDashboardSummary } from '../types';

const ManagerDashboardPage: React.FC = () => {
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
      setAdjustingProduct(null);
      fetchAllData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to adjust stock');
    }
  };

  const handleToggleProduct = async (id: number) => {
    try {
      await api.patch(`/products/${id}/toggle`);
      fetchAllData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle product status');
    }
  };

  const handleToggleSlot = async (id: number) => {
    try {
      await api.patch(`/slots/${id}/toggle`);
      fetchAllData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle slot');
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
      setIsAddProductOpen(false);
      setProdName('');
      setProdDesc('');
      setProdSku('');
      setProdImg('');
      fetchAllData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create product');
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
      fetchAllData();
      alert('Pickup slot created successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create slot');
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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
            Manager Control Center
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Store Inventory & Analytics</h1>
        </div>

        <button
          onClick={fetchAllData}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-bold">Total Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-gray-900">₹{summary.totalRevenue.toFixed(2)}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Paid Orders</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-bold">Total Orders</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl font-black text-gray-900">{summary.totalOrders}</p>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{summary.activeOrders} Active in Queue</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-bold">Low Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-black text-amber-600">{summary.lowStockCount}</p>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Needs Replenishment</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-bold">Pending Returns</span>
              <RotateCcw className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl font-black text-purple-700">{summary.pendingReturnsCount}</p>
            <p className="text-[10px] text-purple-600 font-semibold mt-0.5">Awaiting Staff Review</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-bold">Return Rate</span>
              <RotateCcw className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-gray-900">{summary.returnRatePercent}%</p>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Of Completed Orders</p>
          </div>
        </div>
      )}

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product & Stock Master ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('slots')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'slots'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pickup Slot Capacity ({slots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>
      </div>

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name or SKU..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:bg-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">SKU / Category</th>
                  <th className="p-3.5">Selling / MRP</th>
                  <th className="p-3.5">Stock Level</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg p-1 border border-gray-200 flex items-center justify-center flex-shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{p.name}</p>
                          <p className="text-[11px] text-gray-500">{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <p className="font-mono font-bold text-gray-800">{p.sku}</p>
                      <p className="text-[11px] text-gray-500">{p.category?.name || 'General'}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-emerald-800">₹{p.sellingPrice.toFixed(2)}</p>
                      <p className="text-[11px] text-gray-400 line-through">₹{p.mrpPrice.toFixed(2)}</p>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          p.stockQuantity <= p.lowStockThreshold
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {p.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setAdjustingProduct(p);
                          setNewStock(p.stockQuantity);
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold transition"
                      >
                        Stock +/-
                      </button>
                      <button
                        onClick={() => handleToggleProduct(p.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${
                          p.active ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
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

      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Add Pickup Time Slot</h3>
            <form onSubmit={handleCreateSlot} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Slot Date</label>
                <input
                  type="date"
                  required
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={slotStart}
                    onChange={(e) => setSlotStart(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={slotEnd}
                    onChange={(e) => setSlotEnd(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Max Order Capacity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={slotCap}
                  onChange={(e) => setSlotCap(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
              >
                Create Pickup Slot
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-xs text-gray-900 flex items-center justify-between">
              <span>Active Store Pickup Slots ({sortedSlots.length})</span>
              <span className="text-[11px] text-gray-500 font-normal">Sorted chronologically</span>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {sortedSlots.map((s) => {
                const isFull = s.remainingCapacity <= 0;
                const fillPercent = Math.min(100, Math.round((s.bookedCount / s.maxCapacity) * 100));

                return (
                  <div key={s.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-gray-50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold text-gray-900 font-mono">{s.slotDate}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-bold text-emerald-800">
                          {s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-gray-500">
                          {s.bookedCount} / {s.maxCapacity} booked ({s.remainingCapacity} left)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleSlot(s.id)}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                          s.active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {s.active ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 p-1 border border-gray-100 flex items-center justify-center flex-shrink-0">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-contain" />
                ) : (
                  <Layers className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-xs truncate">{c.name}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-1">{c.description || 'Category'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-200">
            <h3 className="font-bold text-sm text-gray-900">Adjust Inventory Stock</h3>
            <p className="text-xs text-gray-500">
              Product: <span className="font-bold text-gray-800">{adjustingProduct.name}</span>
            </p>
            <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">New Stock Quantity</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-3 py-1.5 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-gray-200 my-8">
            <h3 className="font-bold text-base text-gray-900">Add New Catalog Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Organic Farm Tomatoes"
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Product description and details..."
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    placeholder="DM-VEG-999"
                    className="w-full p-2 border border-gray-300 rounded-xl font-mono uppercase bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Pack Unit</label>
                  <input
                    type="text"
                    required
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="1 kg"
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodMrp}
                    onChange={(e) => setProdMrp(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Selling (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodSelling}
                    onChange={(e) => setProdSelling(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={prodImg}
                    onChange={(e) => setProdImg(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:bg-blue-700 transition"
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
