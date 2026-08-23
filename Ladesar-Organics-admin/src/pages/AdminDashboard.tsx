import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, AdminRole, Coupon } from '../types';
import { BrandLogo } from '../components/common/BrandLogo';
import { 
  Shield, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Truck, 
  ArrowLeft, 
  Search, 
  Filter, 
  Sparkles, 
  AlertCircle, 
  X,
  FileText,
  Sliders,
  DollarSign
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    coupons, 
    activeAdminRole, 
    setActiveAdminRole, 
    updateOrderStatus, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    setView, 
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons'>('analytics');
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdHindi, setNewProdHindi] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('spices');
  const [newProdCatName, setNewProdCatName] = useState('Organic Spices');
  const [newProdPrice, setNewProdPrice] = useState(399);
  const [newProdMrp, setNewProdMrp] = useState(499);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdSize, setNewProdSize] = useState('500 g');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80');

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 128450;
  const totalOrdersCount = orders.length + 84;
  const avgOrderValue = Math.round(totalRevenue / totalOrdersCount);
  const lowStockProducts = products.filter(p => p.variants.some(v => v.stock < 30));

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.status.toLowerCase() === orderFilter.toLowerCase());

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: newProdName,
        hindiName: newProdHindi,
        category: newProdCategory as any,
        categoryName: newProdCatName,
        shortDescription: newProdDesc,
        heroImage: newProdImage,
        variants: [
          {
            id: editingProduct.variants[0]?.id || `var-${Date.now()}`,
            size: newProdSize,
            price: Number(newProdPrice),
            mrp: Number(newProdMrp),
            stock: Number(newProdStock),
            sku: editingProduct.variants[0]?.sku || `LAD-${Date.now().toString().slice(-4)}`
          }
        ]
      };
      await updateProduct(updated);
      setEditingProduct(null);
    } else {
      await createProduct({
        name: newProdName,
        hindiName: newProdHindi,
        category: newProdCategory as any,
        categoryName: newProdCatName,
        shortDescription: newProdDesc,
        heroImage: newProdImage,
        variants: [
          {
            id: `var-${Date.now()}`,
            size: newProdSize,
            price: Number(newProdPrice),
            mrp: Number(newProdMrp),
            stock: Number(newProdStock),
            sku: `LAD-${Date.now().toString().slice(-4)}`
          }
        ]
      });
    }

    setIsAddProductModalOpen(false);
    setNewProdName('');
    setNewProdHindi('');
    setNewProdDesc('');
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setNewProdName(prod.name);
    setNewProdHindi(prod.hindiName || '');
    setNewProdCategory(prod.category);
    setNewProdCatName(prod.categoryName);
    setNewProdPrice(prod.variants[0]?.price || 299);
    setNewProdMrp(prod.variants[0]?.mrp || 350);
    setNewProdStock(prod.variants[0]?.stock || 50);
    setNewProdSize(prod.variants[0]?.size || '500 g');
    setNewProdDesc(prod.shortDescription || '');
    setNewProdImage(prod.heroImage);
    setIsAddProductModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-gray-900 pb-20">
      
      {/* 1. TOP ADMIN CONTROL BAR */}
      <div className="bg-[#0F3823] text-[#FAF7F2] border-b border-[#D4AF37]/30 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <BrandLogo size="sm" variant="light" onClick={() => setView('home')} />
          <div className="h-6 w-px bg-white/20 hidden md:block" />
          <div className="flex items-center gap-1.5 bg-[#164E31] px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/30">
            <Shield className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate">Enterprise ERP Suite</span>
          </div>
        </div>

        {/* RBAC Role Switcher & Storefront Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#FAF7F2]/80 flex-1 sm:flex-none">
            <span className="hidden md:inline">Role:</span>
            <select
              value={activeAdminRole}
              onChange={e => {
                setActiveAdminRole(e.target.value as AdminRole);
                showToast(`Switched active ERP role to ${e.target.value}`, 'info');
              }}
              className="bg-[#164E31] text-[#D4AF37] text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 focus:outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Orders Dispatcher">Orders Dispatcher</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>

          <button
            onClick={() => setView('home')}
            className="bg-[#FAF7F2] text-[#0F3823] hover:bg-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 shadow-xs flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden xs:inline">View</span> Store
          </button>
        </div>
      </div>

      {/* 2. ADMIN DASHBOARD CONTAINER */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5 sm:space-y-6">
        
        {/* Navigation Tabs (Scrollable on mobile/tablet) */}
        <div className="bg-white p-1.5 sm:p-2 rounded-2xl border border-gray-200 shadow-xs flex overflow-x-auto sm:flex-wrap gap-1.5 sm:gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823] hover:bg-[#FAF7F2]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" /> Analytics
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'products'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823] hover:bg-[#FAF7F2]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Catalog & Stock ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823] hover:bg-[#FAF7F2]'
            }`}
          >
            <Package className="w-4 h-4 text-[#D4AF37]" /> Fulfillment ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'coupons'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823] hover:bg-[#FAF7F2]'
            }`}
          >
            <Tag className="w-4 h-4 text-[#D4AF37]" /> Coupons ({coupons.length})
          </button>
        </div>

        {/* 3. TAB 1: EXECUTIVE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>Gross Platform Revenue</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">+24.8% YoY</span>
                </div>
                <div className="text-2xl font-bold text-[#0F3823]">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-gray-400">All India Farm Dispatches</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>Total Consignments</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">+18.2%</span>
                </div>
                <div className="text-2xl font-bold text-[#0F3823]">{totalOrdersCount} Orders</div>
                <div className="text-[11px] text-gray-400">99.4% On-time BlueDart Delivery</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>Average Order Value (AOV)</span>
                  <span className="text-[#B8860B] font-bold">Premium Cart</span>
                </div>
                <div className="text-2xl font-bold text-[#0F3823]">₹{avgOrderValue}</div>
                <div className="text-[11px] text-gray-400">Avg 2.8 items per customer bag</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>Catalog SKU Count</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">100% Organic</span>
                </div>
                <div className="text-2xl font-bold text-[#0F3823]">{products.length} Products</div>
                <div className="text-[11px] text-emerald-700 font-semibold">All NABL COA Certified</div>
              </div>
            </div>

            {/* Visual Charts & Health Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Category Sales Distribution */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#0F3823] uppercase tracking-wider flex items-center justify-between">
                  <span>Category Revenue Share</span>
                  <span className="text-xs text-gray-400 font-normal">Live Harvest Data</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-gray-700 mb-1">
                      <span>A2 Vedic Bilona Ghee (Amrit Grade)</span>
                      <span className="text-[#0F3823]">48%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#0F3823] h-full rounded-full" style={{ width: '48%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-gray-700 mb-1">
                      <span>Wood-Pressed Mustard & Sesame Oils</span>
                      <span className="text-[#0F3823]">24%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#B8860B] h-full rounded-full" style={{ width: '24%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-gray-700 mb-1">
                      <span>Stone-Ground Spices & High Curcumin Haldi</span>
                      <span className="text-[#0F3823]">16%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2D6A4F] h-full rounded-full" style={{ width: '16%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-gray-700 mb-1">
                      <span>Artisanal Pickles & Himalayan Honey</span>
                      <span className="text-[#0F3823]">12%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-600 h-full rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#0F3823] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <AlertCircle className="w-4 h-4" /> Warehouse Inventory Alerts
                  </span>
                  <span className="text-xs text-gray-400 font-normal">Re-order threshold: &lt; 40 units</span>
                </h3>

                <div className="divide-y divide-gray-100 text-xs">
                  {products.slice(0, 4).map(prod => (
                    <div key={prod.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={prod.heroImage} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border" />
                        <div>
                          <div className="font-bold text-[#0F3823] max-w-[200px] truncate">{prod.name}</div>
                          <div className="text-gray-400 text-[11px]">{prod.categoryName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{prod.variants[0]?.stock} units remaining</div>
                        <span className="text-[10px] text-emerald-700 font-semibold">Fresh Batch in Churn</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 4. TAB 2: PRODUCT INVENTORY MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search catalog by title or category..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setNewProdName('');
                  setNewProdHindi('');
                  setNewProdDesc('');
                  setIsAddProductModalOpen(true);
                }}
                className="bg-[#0F3823] hover:bg-[#164E31] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" /> Add New Organic Product
              </button>
            </div>

            {/* Mobile Card List View (< sm screens) */}
            <div className="grid grid-cols-1 gap-3 sm:hidden">
              {filteredProducts.map(prod => (
                <div key={prod.id} className="bg-[#FAF7F2]/60 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={prod.heroImage} alt={prod.name} className="w-14 h-14 object-cover rounded-xl border flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#0F3823] text-sm truncate">{prod.name}</div>
                      {prod.hindiName && <div className="text-[11px] text-[#B8860B] truncate">{prod.hindiName}</div>}
                      <div className="text-[10px] text-gray-500 mt-0.5">{prod.categoryName} • {prod.variants[0]?.size}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
                    <div>
                      <span className="font-bold text-[#0F3823] text-sm">₹{prod.variants[0]?.price}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        prod.variants[0]?.stock > 30 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {prod.variants[0]?.stock} in stock
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-2 bg-white rounded-xl text-gray-700 hover:text-[#0F3823] border border-gray-200 shadow-2xs"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-2 bg-white rounded-xl text-rose-500 hover:text-rose-700 border border-gray-200 shadow-2xs"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= sm screens) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#FAF7F2] text-gray-600 font-bold uppercase tracking-wider">
                    <th className="p-3">Product Name & Category</th>
                    <th className="p-3">Base Pack</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <img src={prod.heroImage} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border" />
                        <div>
                          <div className="font-bold text-[#0F3823] text-sm">{prod.name}</div>
                          {prod.hindiName && <div className="text-[11px] text-[#B8860B]">{prod.hindiName}</div>}
                          <div className="text-[10px] text-gray-400">{prod.categoryName}</div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold">{prod.variants[0]?.size}</td>
                      <td className="p-3 font-bold text-[#0F3823]">₹{prod.variants[0]?.price}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          prod.variants[0]?.stock > 30 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {prod.variants[0]?.stock} units
                        </span>
                      </td>
                      <td className="p-3 font-semibold">★ {prod.rating.toFixed(1)} ({prod.reviewsCount})</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-[#0F3823]"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 5. TAB 3: ORDER FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-[#0F3823] uppercase tracking-wider">
                Live Customer Orders & Consignments
              </h3>

              <div className="flex gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-gray-200 text-xs overflow-x-auto no-scrollbar">
                {['all', 'Placed', 'Processing', 'Packed', 'Shipped', 'Delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold capitalize transition-colors whitespace-nowrap flex-shrink-0 ${
                      orderFilter.toLowerCase() === status.toLowerCase()
                        ? 'bg-[#0F3823] text-white shadow-xs'
                        : 'text-gray-600 hover:text-[#0F3823]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders list */}
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-[#FAF7F2]/50 p-5 rounded-2xl border border-gray-200 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200 text-xs">
                    <div>
                      <span className="text-gray-400 block">Order Ref:</span>
                      <strong className="text-[#0F3823] font-mono text-sm">#{order.orderNumber}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Customer:</span>
                      <strong>{order.customerEmail} ({order.customerPhone})</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Destination:</span>
                      <strong>{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Order Value:</span>
                      <strong className="text-base text-[#0F3823] font-bold">₹{order.totalAmount}</strong>
                    </div>
                    <div>
                      <span className="inline-block bg-[#0F3823] text-white font-bold px-3 py-1 rounded-full text-xs">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="flex items-center gap-4 overflow-x-auto py-1">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border flex-shrink-0 text-xs">
                        <img src={it.productImage} alt={it.productName} className="w-8 h-8 object-cover rounded-lg" />
                        <div>
                          <div className="font-bold text-[#0F3823] max-w-[140px] truncate">{it.productName}</div>
                          <div className="text-[10px] text-gray-400">{it.variantSize} × {it.quantity} (₹{it.total})</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status update buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200 text-xs">
                    <span className="text-gray-500 font-semibold">Advance Dispatch Stage:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(['Placed', 'Processing', 'Packed', 'Shipped', 'Delivered'] as Order['status'][]).map(st => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(order.id, st)}
                          className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
                            order.status === st
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-[#0F3823]'
                          }`}
                        >
                          Mark as {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 6. TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F3823] uppercase tracking-wider">
                Active Promotional Discount Coupons
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map(cp => (
                <div key={cp.code} className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D4AF37]/50 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#0F3823] text-[#D4AF37] font-mono font-bold text-sm px-3 py-1 rounded-lg">
                      {cp.code}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">{cp.description}</p>
                  <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-200">
                    Min Order: <strong>₹{cp.minOrderAmount}</strong> • Discount: <strong>{cp.discountValue}{cp.discountType === 'percentage' ? '%' : '₹'}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 7. ADD / EDIT PRODUCT MODAL */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-[#D4AF37] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#0F3823]">
                {editingProduct ? 'Edit Organic Product' : 'Add New Organic Harvest SKU'}
              </h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-gray-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title (English)</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="e.g. A2 Vedic Desi Gir Cow Ghee (Bilona Churned)"
                  className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Hindi Heritage Name</label>
                  <input
                    type="text"
                    value={newProdHindi}
                    onChange={e => setNewProdHindi(e.target.value)}
                    placeholder="e.g. शुद्ध ए२ बिलोना देसी गाय का घी"
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={e => {
                      setNewProdCategory(e.target.value);
                      const nameMap: any = {
                        ghee: 'A2 Vedic Desi Ghee',
                        oils: 'Cold-Pressed Oils',
                        spices: 'Organic Spices',
                        pickles: 'Traditional Pickles',
                        honey: 'Raw Forest Honey',
                        staples: 'Flours & Pulses',
                        wellness: 'Ayurvedic Wellness'
                      };
                      setNewProdCatName(nameMap[e.target.value] || 'Organic Food');
                    }}
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="ghee">A2 Vedic Desi Ghee</option>
                    <option value="oils">Cold-Pressed Oils</option>
                    <option value="spices">Organic Spices</option>
                    <option value="pickles">Traditional Pickles</option>
                    <option value="honey">Raw Forest Honey</option>
                    <option value="staples">Flours & Pulses</option>
                    <option value="wellness">Ayurvedic Wellness</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Pack Size</label>
                  <input
                    type="text"
                    required
                    value={newProdSize}
                    onChange={e => setNewProdSize(e.target.value)}
                    placeholder="e.g. 500 ml or 1 L"
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdMrp}
                    onChange={e => setNewProdMrp(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Warehouse Stock Units</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={e => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    required
                    value={newProdImage}
                    onChange={e => setNewProdImage(e.target.value)}
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  placeholder="Traditional stone-ground, cold extracted..."
                  className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F3823] hover:bg-[#164E31] text-white font-bold"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
