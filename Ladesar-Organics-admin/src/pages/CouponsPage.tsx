import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Coupon } from '../types';
import { 
  TicketPercent, 
  Plus, 
  Tag, 
  Calendar, 
  CheckCircle2, 
  X, 
  Copy, 
  Trash2,
  Sparkles
} from 'lucide-react';

export const CouponsPage: React.FC = () => {
  const { coupons, createCoupon, toggleCouponStatus, deleteCoupon, showToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Coupon Form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [minOrderAmount, setMinOrderAmount] = useState(999);
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      description: description || `${discountValue}${discountType === 'percentage' ? '%' : '₹'} Off on orders above ₹${minOrderAmount}`,
      expiresAt,
      isActive: true
    };

    await createCoupon(newCoupon);
    setIsModalOpen(false);
    setCode('');
    setDescription('');
  };

  const handleToggleActive = async (couponCode: string) => {
    await toggleCouponStatus(couponCode);
  };

  const handleDelete = async (couponCode: string) => {
    await deleteCoupon(couponCode);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied code "${text}"`, 'success');
  };


  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-amber-200">
            <TicketPercent className="w-3 h-3" />
            <span>Growth & Discounts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
            Coupons & Marketing Offers
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans-clean">
            Create promotional discount codes for festival campaigns and Vedic subscriptions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0F3823] to-[#164E31] text-[#FAF7F2] font-bold text-xs shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 border border-[#D4AF37]/50 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
              coupon.isActive 
                ? 'bg-white border-stone-200 shadow-sm hover:border-[#D4AF37] hover:shadow-xl' 
                : 'bg-stone-50 border-stone-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold text-sm tracking-wider">
                  <span>{coupon.code}</span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="text-stone-400 hover:text-stone-700 cursor-pointer"
                    title="Copy Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  coupon.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}>
                  {coupon.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-[#0F3823] mb-1">
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
              </h3>

              <p className="text-xs text-stone-600 mb-4 font-sans-clean">
                {coupon.description}
              </p>

              <div className="space-y-1 text-[11px] text-stone-500 py-2 border-t border-stone-100">
                <p>Min Order Value: <strong className="text-stone-800">₹{coupon.minOrderAmount}</strong></p>
                <p className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>Valid until {coupon.expiresAt}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(coupon.code)}
                className="text-xs font-bold text-[#0F3823] hover:underline cursor-pointer"
              >
                {coupon.isActive ? 'Deactivate' : 'Activate'}
              </button>

              <button
                onClick={() => handleDelete(coupon.code)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                title="Delete Coupon"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden"
          >
            <div className="p-5 bg-[#0F3823] text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#FAF7F2]">
                Create Campaign Promo Code
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                  Promo Code (e.g. VEDIC20) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SHUDDH15"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono font-bold uppercase focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Min Cart Value (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 15% discount for first-time organic ghee buyers"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F3823] text-white font-bold hover:bg-[#164E31] transition-colors cursor-pointer border border-[#D4AF37]/50"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
