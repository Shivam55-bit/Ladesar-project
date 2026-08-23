import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Package, 
  Phone, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { orders, setView } = useStore();
  const [searchQuery, setSearchQuery] = useState(orders[0]?.orderNumber || 'LAD-2026-8492');
  const [searchedOrder, setSearchedOrder] = useState<any>(orders[0] || null);
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const found = orders.find(
      o => o.orderNumber.toLowerCase().includes(query) ||
           o.customerPhone.includes(query) ||
           o.id.toLowerCase().includes(query)
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#FAF7F2] text-[#0F3823] text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37]/40">
          <Truck className="w-3.5 h-3.5 text-[#B8860B]" /> Live Farm-to-Doorstep Tracking
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3823] font-serif-luxury">
          Track Your Organic Consignment
        </h1>
        <p className="text-xs text-gray-500">
          Enter your 11-digit Order Number (e.g. LAD-2026-8492) or registered 10-digit mobile number.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#B8860B] absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            required
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Enter Order ID or Mobile (e.g. LAD-2026-8492)"
            className="w-full bg-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="bg-[#0F3823] hover:bg-[#164E31] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-md transition-colors flex items-center gap-2"
        >
          Track Consignment
        </button>
      </form>

      {/* Track Result Details */}
      {hasSearched && (
        searchedOrder ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div>
                <div className="text-xs text-gray-400">Consignment Number:</div>
                <div className="text-lg font-bold text-[#0F3823] font-mono">#{searchedOrder.orderNumber}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Current Status: {searchedOrder.status}
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                  Carrier: BlueDart Air Express
                </span>
              </div>
            </div>

            {/* Step-by-Step Vertical Timeline */}
            <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {searchedOrder.timeline.map((step: any, i: number) => (
                <div key={i} className="relative space-y-1">
                  <div
                    className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 transition-colors ${
                      step.completed
                        ? 'bg-[#0F3823] border-[#D4AF37]'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${step.completed ? 'text-[#0F3823]' : 'text-gray-400'}`}>
                      {step.status}
                    </span>
                    <span className="text-[11px] text-gray-400">{step.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Delivery Destination & Consignment Contents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 text-xs text-gray-700">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gray-200/80 space-y-1">
                <strong className="text-[#0F3823] block text-sm font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#B8860B]" /> Shipping Destination
                </strong>
                <div>{searchedOrder.shippingAddress?.street}</div>
                <div>{searchedOrder.shippingAddress?.city}, {searchedOrder.shippingAddress?.state} - {searchedOrder.shippingAddress?.pincode}</div>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gray-200/80 space-y-1">
                <strong className="text-[#0F3823] block text-sm font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> Vedic Purity Seal
                </strong>
                <div>Package contains 100% certified organic foods in break-resistant amber glass.</div>
                <div className="text-[11px] text-emerald-700 font-semibold">Total Paid: ₹{searchedOrder.totalAmount} ({searchedOrder.paymentMethod})</div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto font-bold">
              ✕
            </div>
            <h3 className="text-base font-bold text-gray-800">Consignment Not Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We couldn't find an order matching "{searchQuery}". Please check your order reference number or contact farm customer care at 1800-LADESAR.
            </p>
          </div>
        )
      )}

    </div>
  );
};
