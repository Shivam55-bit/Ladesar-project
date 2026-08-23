import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  Truck, 
  Download, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Package, 
  MapPin, 
  Calendar 
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastCreatedOrder, setView, orders } = useStore();

  const order = lastCreatedOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <p className="text-gray-600 mb-4">No recent order found.</p>
        <button onClick={() => setView('shop')} className="bg-[#0F3823] text-white px-6 py-2.5 rounded-full text-xs font-bold">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      
      {/* Success Banner */}
      <div className="bg-[#0F3823] text-[#FAF7F2] rounded-3xl p-8 text-center space-y-3 relative overflow-hidden border-2 border-[#D4AF37]">
        <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#0F3823] flex items-center justify-center mx-auto shadow-xl font-bold">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
          Order Placed Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
          Thank you for choosing ancestral Vedic purity with Ladesar Organics. Your order is being freshly inspected and packed in sterilized amber glass.
        </p>
        <div className="pt-2 text-xs text-[#D4AF37] font-mono font-bold tracking-wider">
          Order Reference: #{order.orderNumber}
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-gray-100 text-xs">
          <div>
            <span className="text-gray-400 block mb-1">Order Date:</span>
            <strong className="text-[#0F3823]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Estimated Delivery:</span>
            <strong className="text-emerald-700">{order.estimatedDelivery}</strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Payment Method:</span>
            <strong className="text-gray-800">{order.paymentMethod} ({order.paymentStatus})</strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Total Paid:</span>
            <strong className="text-base text-[#0F3823] font-bold">₹{order.totalAmount.toFixed(2)}</strong>
          </div>
        </div>

        {/* Dispatch Timeline Progress */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F3823] flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#B8860B]" /> Farm to Doorstep Dispatch Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {order.timeline.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-xs ${
                  step.completed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                    : 'bg-gray-50 border-gray-100 text-gray-400'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  {step.completed ? '✓ ' : '○ '}{step.status}
                </div>
                <div className="text-[10px] text-gray-500 mt-1 line-clamp-2">{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F3823]">
            Items in Consignment ({order.items.length})
          </h3>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded-xl border" />
                  <div>
                    <div className="font-bold text-[#0F3823]">{item.productName}</div>
                    <div className="text-gray-400 text-[11px]">Size: {item.variantSize} • Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="text-right font-bold text-[#0F3823]">
                  ₹{item.total}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions (Print Invoice, Track, Home) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Tax Invoice
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setView('track-order')}
              className="px-5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/50 text-[#0F3823] text-xs font-bold hover:bg-[#F4EFE6] transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-[#B8860B]" /> Live Consignment Tracking
            </button>
            <button
              onClick={() => setView('home')}
              className="px-6 py-2.5 rounded-xl bg-[#0F3823] hover:bg-[#164E31] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              Continue to Home <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
