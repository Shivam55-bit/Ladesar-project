import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Layers, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  Download,
  Filter,
  Eye,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardOverviewPage: React.FC = () => {
  const { products, categories, orders, coupons, updateOrderStatus, showToast } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // KPI Calculations dynamically from live backend/store orders
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const lowStockProducts = products.filter(p => p.variants.some(v => v.stock < 30));
  const pendingOrders = orders.filter(o => o.status === 'Placed' || o.status === 'Processing');

  // Sales Trend calculated from actual orders data
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOrderMap: Record<string, { revenue: number; orders: number }> = {
    Mon: { revenue: 0, orders: 0 },
    Tue: { revenue: 0, orders: 0 },
    Wed: { revenue: 0, orders: 0 },
    Thu: { revenue: 0, orders: 0 },
    Fri: { revenue: 0, orders: 0 },
    Sat: { revenue: 0, orders: 0 },
    Sun: { revenue: 0, orders: 0 },
  };

  orders.forEach(o => {
    const d = new Date(o.createdAt || Date.now());
    const day = daysOfWeek[d.getDay()] || 'Mon';
    dayOrderMap[day].revenue += Number(o.totalAmount || 0);
    dayOrderMap[day].orders += 1;
  });

  const salesData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    revenue: dayOrderMap[day].revenue,
    orders: dayOrderMap[day].orders
  }));

  // Dynamic Category Distribution calculated from store products & orders
  const categorySales = (categories && categories.length > 0 ? categories : [])
    .slice(0, 6)
    .map((cat, i) => {
      let catRevenue = 0;
      orders.forEach(o => {
        (o.items || []).forEach(item => {
          const prod = products.find(p => p.id === item.productId);
          if (prod && (prod.category === cat.id || prod.category === cat.slug)) {
            catRevenue += item.price * item.quantity;
          }
        });
      });
      const prodsInCat = products.filter(p => p.category === cat.slug || p.category === cat.id);
      const colors = ['#D4AF37', '#2D6A4F', '#B8860B', '#C59B27', '#1E4620', '#A0522D'];
      return {
        name: cat.name,
        value: catRevenue > 0 ? catRevenue : Math.max(1, prodsInCat.length),
        color: colors[i % colors.length]
      };
    });


  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Top Banner & Greetings */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#0F3823] via-[#164E31] to-[#0A2618] text-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
            Namaste, {user?.name || 'Administrator'}
          </h1>
          <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl font-sans-clean">
            Organic store metrics are up <span className="text-emerald-400 font-semibold">+23.8%</span> this month. All cold-pressed oil & A2 bilona ghee batches are certified.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#0F3823] font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Manage Orders</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Total Revenue */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs last month</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* KPI 2: Total Orders */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
              {totalOrdersCount}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-1">
              <span>{pendingOrders.length} pending dispatch</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* KPI 3: Average Order Value */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Avg Order Value</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
              ₹{avgOrderValue.toLocaleString('en-IN')}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-1">
              <span>High Vedic Bilona basket</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* KPI 4: Low Stock Alert */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Low Stock SKUs</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-rose-900">
              {lowStockProducts.length} Items
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-1">
              <Link to="/inventory" className="hover:underline">Action required in warehouse →</Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

      </div>

      {/* Analytics Charts & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Sales Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#0F3823]">
                Revenue & Sales Trajectory (₹)
              </h3>
              <p className="text-xs text-stone-500">Weekly organic orders breakdown</p>
            </div>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              {(['7d', '30d', '90d'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTimeRange(tab)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    timeRange === tab ? 'bg-[#0F3823] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab === '7d' ? 'Last 7 Days' : tab === '30d' ? '30 Days' : 'Quarterly'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F3823" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0F3823" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1px solid #D4AF37', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0F3823" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut / Card (1 Col) */}
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#0F3823] mb-1">
              Top Category Revenue Share
            </h3>
            <p className="text-xs text-stone-500 mb-4">Highest margin organic foods</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Share']}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-2 pt-3 border-t border-stone-100">
            {categorySales.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-medium text-stone-700">{c.name}</span>
                </div>
                <span className="font-bold text-[#0F3823]">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lower Section: Recent Orders & Quick Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#0F3823]">
                Recent Orders
              </h3>
              <p className="text-xs text-stone-500">Live order fulfillment stream</p>
            </div>
            <Link
              to="/orders"
              className="text-xs font-bold text-[#B8860B] hover:text-[#0F3823] flex items-center gap-1 transition-colors"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider text-[10px] rounded-xl">
                <tr>
                  <th className="p-3 rounded-l-xl">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#0F3823]">
                      #{order.orderNumber}
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-stone-900">{order.shippingAddress?.fullName || order.customerName || 'Customer'}</p>
                      <p className="text-[10px] text-stone-400">{order.shippingAddress?.city || order.customerCity || 'Verified Customer'}</p>
                    </td>
                    <td className="p-3 font-bold text-stone-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate('/orders')}
                        className="px-2 py-1 rounded-lg bg-[#FAF7F2] hover:bg-stone-200 text-[#0F3823] font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warehouse Watchlist (1 Col) */}
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-rose-950">
                  Critical Stock Warnings
                </h3>
                <p className="text-xs text-stone-500">Batches below 30 units threshold</p>
              </div>
              <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                {lowStockProducts.length}
              </span>
            </div>

            <div className="space-y-3">
              {lowStockProducts.slice(0, 4).map(prod => (
                <div key={prod.id} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={prod.heroImage} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border" />
                    <div>
                      <p className="font-bold text-xs text-stone-900 leading-tight">{prod.name}</p>
                      <p className="text-[10px] text-stone-500">{prod.categoryName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-700 block">
                      {prod.variants[0]?.stock} Left
                    </span>
                    <Link
                      to="/inventory"
                      className="text-[10px] font-bold text-[#0F3823] hover:underline"
                    >
                      + Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <Link
              to="/inventory"
              className="w-full py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs text-center block transition-colors"
            >
              Open Full Warehouse Manager →
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
