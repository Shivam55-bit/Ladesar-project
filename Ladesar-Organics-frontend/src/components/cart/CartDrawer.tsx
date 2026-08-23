import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  Truck 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    cartTotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    shippingFee,
    taxAmount,
    setView 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCoupon(couponInput.trim());
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md glass-panel shadow-[0_25px_60px_rgba(0,0,0,0.3)] flex flex-col justify-between border-l border-white/70 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 bg-white/70 backdrop-blur-md border-b border-[#0F3823]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#0F3823]" />
                <h2 className="text-lg font-bold text-[#0F3823]">Your Organic Bag</h2>
                <span className="bg-white/80 backdrop-blur-xs text-[#0F3823] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/70 shadow-2xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white/80 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="mt-4 bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-medium text-[#0F3823] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#B8860B]" />
                  {amountNeededForFreeShipping === 0 ? (
                    <strong className="text-emerald-700">🎉 You unlocked FREE Express Shipping!</strong>
                  ) : (
                    <span>
                      Add <strong>₹{amountNeededForFreeShipping}</strong> more for <strong>FREE Shipping</strong>
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-[#B8860B]">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200/80 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#D4AF37] to-[#0F3823] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-3xl bg-white/70 backdrop-blur-md border border-white/80 shadow-sm flex items-center justify-center mx-auto mb-4 text-[#0F3823]">
                  <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-base font-bold text-[#0F3823] mb-1">Your bag is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
                  Experience pure Vedic Ghee, cold-pressed oils, and handcrafted organic spices.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setView('shop');
                  }}
                  className="bg-[#0F3823] text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-[#164E31] transition-all shadow-md inline-flex items-center gap-2"
                >
                  Explore Organic Pantry <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.id}`}
                  className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/80 shadow-xs flex items-center gap-3.5 hover:bg-white/95 transition-all"
                >
                  <img
                    src={item.product.heroImage}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl border border-white/80 flex-shrink-0 shadow-2xs"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#0F3823] truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-[#B8860B] font-medium">
                      Pack: {item.variant.size}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#0F3823]">
                        ₹{item.variant.price}
                      </span>
                      {item.variant.mrp > item.variant.price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{item.variant.mrp}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.id, item.variant.id)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-white/80 rounded-xl bg-white/70 backdrop-blur-xs overflow-hidden shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.variant.id, -1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-200/60 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-[#0F3823]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.variant.id, 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-200/60 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-5 bg-white/80 backdrop-blur-lg border-t border-[#0F3823]/10 space-y-4">
              
              {/* Promo Coupon Bar */}
              <div>
                {appliedCoupon ? (
                  <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 p-2.5 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount.toFixed(2)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 font-bold hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. FIRST15, VEDIC20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="glass-input text-xs px-3.5 py-2 rounded-xl flex-1 uppercase tracking-wider focus:outline-none placeholder:text-gray-400"
                      />
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="bg-[#0F3823] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#164E31] transition-all disabled:opacity-50 shadow-xs"
                      >
                        {isApplying ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-200/60 pt-3">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Vedic Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-semibold text-gray-800">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Estimated 5% GST</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#0F3823] border-t border-gray-200/60 pt-2">
                  <span>Total Amount</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#0F3823] to-[#164E31] hover:from-[#164E31] hover:to-[#0F3823] text-[#FAF7F2] py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 border border-white/20"
              >
                Proceed to Secure Checkout <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Secure Encrypted Organic Checkout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
