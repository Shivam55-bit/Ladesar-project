import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { 
  Search, 
  Filter, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  X, 
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';

const ORDER_STATUS_LIST: { id: string; label: string; color: string }[] = [
  { id: 'all', label: 'All Orders', color: 'bg-stone-100 text-stone-700' },
  { id: 'Placed', label: 'Placed', color: 'bg-amber-100 text-amber-800' },
  { id: 'Processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { id: 'Packed', label: 'Packed', color: 'bg-purple-100 text-purple-800' },
  { id: 'Shipped', label: 'Shipped', color: 'bg-sky-100 text-sky-800' },
  { id: 'Delivered', label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
];

export const OrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useStore();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status.toLowerCase() === selectedStatus.toLowerCase();
    const custName = order.shippingAddress?.fullName || order.customerName || '';
    const custCity = order.shippingAddress?.city || order.customerCity || '';
    const custEmail = order.customerEmail || '';
    const matchesSearch = !searchQuery ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to "${newStatus}"`, 'success');
    if (activeOrderModal && activeOrderModal.id === orderId) {
      setActiveOrderModal({ ...activeOrderModal, status: newStatus });
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-blue-200">
            <Package className="w-3 h-3" />
            <span>Fulfillment Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
            Customer Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans-clean">
            Track organic parcels, packaging inspections, and dispatch status
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {ORDER_STATUS_LIST.map((tab) => {
            const count = tab.id === 'all' 
              ? orders.length 
              : orders.filter(o => o.status.toLowerCase() === tab.id.toLowerCase()).length;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStatus === tab.id
                    ? 'bg-[#0F3823] text-white shadow-md font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedStatus === tab.id ? 'bg-[#D4AF37] text-[#0F3823]' : 'bg-stone-200 text-stone-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID (e.g. LAD-2026), Customer Name, Email, or City..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
          />
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer & Location</th>
                <th className="p-4">Items & Details</th>
                <th className="p-4">Amount & Payment</th>
                <th className="p-4">Date</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Invoice / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/80 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono font-bold text-[#0F3823] text-sm block">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[10px] text-stone-400">ID: {order.id.slice(-6)}</span>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-stone-900">{order.shippingAddress?.fullName || order.customerName || 'Customer'}</p>
                    <p className="text-[11px] text-stone-500">
                      {order.shippingAddress?.city || order.customerCity || 'India'}
                      {order.shippingAddress?.pincode ? `, ${order.shippingAddress.pincode}` : order.customerPincode ? `, ${order.customerPincode}` : ''}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate max-w-xs">{order.customerEmail}</p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-stone-800">
                        {order.items.length} Product{order.items.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate max-w-[200px]">
                        {order.items.map(i => `${i.productName} (${i.variantSize}) x${i.quantity}`).join(', ')}
                      </p>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-stone-900 text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mt-0.5">
                      {order.paymentMethod}
                    </span>
                  </td>

                  <td className="p-4 text-stone-500 text-[11px]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>

                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : order.status === 'Shipped'
                          ? 'bg-sky-50 text-sky-800 border-sky-300'
                          : order.status === 'Packed'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setActiveOrderModal(order)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#0F3823] hover:text-white text-[#0F3823] font-semibold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-[#0F3823]/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-400">
            No customer orders found matching this filter.
          </div>
        )}
      </div>

      {/* Order Details & Packing Slip Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-[#0F3823] text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-lg text-[#FAF7F2]">
                    Order #{activeOrderModal.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-[#0F3823]">
                    {activeOrderModal.status}
                  </span>
                </div>
                <p className="text-xs text-white/70">
                  Placed on {new Date(activeOrderModal.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSlip}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  title="Print Packing Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveOrderModal(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {/* Customer & Shipping Details */}
              <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Customer Info
                  </p>
                  <p className="font-bold text-stone-900 text-sm">{activeOrderModal.shippingAddress?.fullName || activeOrderModal.customerName || 'Customer'}</p>
                  <p className="text-stone-600">{activeOrderModal.customerEmail}</p>
                  <p className="text-stone-600">{activeOrderModal.customerPhone || activeOrderModal.shippingAddress?.phone || '+91 98765 43210'}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Delivery Address
                  </p>
                  <p className="text-stone-800">{activeOrderModal.shippingAddress?.street || 'House 42, Organic Valley Marg'}</p>
                  <p className="text-stone-800 font-semibold">{activeOrderModal.shippingAddress?.city || activeOrderModal.customerCity || 'Jaipur'}, {activeOrderModal.shippingAddress?.pincode || activeOrderModal.customerPincode || '302001'}</p>
                  <p className="text-emerald-700 font-bold text-[11px] mt-1">Payment: {activeOrderModal.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Purchased Items ({activeOrderModal.items.length})
                </p>
                <div className="border border-stone-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 text-stone-500 font-bold text-[10px] uppercase">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Variant</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Qty</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {activeOrderModal.items.map((item, idx) => {
                        const itemPrice = item.unitPrice || item.price || 0;
                        return (
                          <tr key={idx}>
                            <td className="p-3 font-semibold text-stone-900">{item.productName}</td>
                            <td className="p-3 text-stone-600">{item.variantSize}</td>
                            <td className="p-3 text-stone-600">₹{itemPrice}</td>
                            <td className="p-3 font-bold text-stone-800">x{item.quantity}</td>
                            <td className="p-3 text-right font-bold text-[#0F3823]">
                              ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-3 text-right">
                  <div className="space-y-1 text-xs">
                    <p className="text-stone-500">Subtotal: <span className="font-semibold text-stone-800">₹{activeOrderModal.subtotal || activeOrderModal.totalAmount}</span></p>
                    <p className="text-stone-500">Shipping: <span className="font-semibold text-emerald-700">Free Vedic Delivery</span></p>
                    <p className="text-base font-serif font-bold text-[#0F3823] pt-1 border-t">
                      Total: ₹{activeOrderModal.totalAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fulfillment Timeline */}
              {activeOrderModal.timeline && activeOrderModal.timeline.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                    Fulfillment Track
                  </p>
                  <div className="space-y-3">
                    {activeOrderModal.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          step.completed ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900">{step.status} <span className="text-[10px] font-normal text-stone-400 ml-2">{step.timestamp}</span></p>
                          <p className="text-stone-600 text-[11px]">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Change Status:</span>
                <select
                  value={activeOrderModal.status}
                  onChange={(e) => handleStatusChange(activeOrderModal.id, e.target.value as Order['status'])}
                  className="p-1.5 rounded-xl border border-stone-300 text-xs font-bold bg-white"
                >
                  <option value="Placed">Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setActiveOrderModal(null)}
                className="px-4 py-2 rounded-xl bg-[#0F3823] text-white font-bold text-xs"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
