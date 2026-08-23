import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserAddress } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  Tag,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartTotal, 
    discountAmount, 
    appliedCoupon, 
    shippingFee, 
    taxAmount, 
    user, 
    placeOrder, 
    setView 
  } = useStore();

  const [contactName, setContactName] = useState(user.name);
  const [contactEmail, setContactEmail] = useState(user.email);
  const [contactPhone, setContactPhone] = useState(user.phone);
  
  const [shippingAddress, setShippingAddress] = useState<UserAddress>(
    user.addresses[0] || {
      id: 'addr-1',
      fullName: user.name || 'Aditi Sharma',
      phone: user.phone || '+91 98765 43210',
      street: 'Flat 402, Heritage Greens Estate, Sector 54',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122001',
      isDefault: true,
      type: 'Home',
    }
  );

  const [paymentMethod, setPaymentMethod] = useState<'UPI / PhonePe' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery'>('UPI / PhonePe');
  const [isPlacing, setIsPlacing] = useState(false);
  const [upiId, setUpiId] = useState('user@okhdfcbank');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#D4AF37] flex items-center justify-center mx-auto text-[#0F3823]">
          <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h2 className="text-xl font-bold text-[#0F3823]">Your bag is currently empty</h2>
        <p className="text-xs text-gray-500">Please add pure organic staples to your cart before proceeding to checkout.</p>
        <button
          onClick={() => setView('shop')}
          className="bg-[#0F3823] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#164E31] transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacing(true);

    const created = await placeOrder({
      shippingAddress,
      paymentMethod,
      customerEmail: contactEmail,
      customerPhone: contactPhone,
    });

    setIsPlacing(false);
    setView('order-success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <button
          onClick={() => setView('shop')}
          className="text-xs font-bold text-[#0F3823] hover:text-[#B8860B] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>
        <div className="flex items-center gap-2 text-xs text-[#0F3823] font-semibold">
          <Lock className="w-4 h-4 text-emerald-700" /> 256-Bit SSL Encrypted Checkout
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Address & Payment Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Contact Information */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F3823] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0F3823] text-[#FAF7F2] text-xs flex items-center justify-center font-bold">1</span>
              Customer Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Mobile Phone (for delivery OTP)</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Address (for tax invoice & tracking)</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F3823] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0F3823] text-[#FAF7F2] text-xs flex items-center justify-center font-bold">2</span>
              Shipping & Delivery Destination
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Flat / House No / Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={shippingAddress.pincode}
                    onChange={e => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F3823] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0F3823] text-[#FAF7F2] text-xs flex items-center justify-center font-bold">3</span>
              Payment Method (Razorpay & Instant UPI)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'UPI / PhonePe', label: 'UPI / GPay / PhonePe / Paytm', desc: 'Instant QR scan or UPI ID (Fastest)', icon: QrCode },
                { id: 'Credit / Debit Card', label: 'Credit / Debit Cards', desc: 'Visa, Mastercard, RuPay, Amex', icon: CreditCard },
                { id: 'Net Banking', label: 'Net Banking', desc: 'All Indian major banks supported', icon: Lock },
                { id: 'Cash on Delivery', label: 'Cash on Delivery', desc: 'Pay cash or UPI at delivery doorstep', icon: Truck },
              ].map(pm => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-2 border-[#0F3823] bg-[#FAF7F2] shadow-xs'
                        : 'border-gray-200 hover:border-[#D4AF37]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#0F3823]">{pm.label}</span>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#0F3823]' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-[11px] text-gray-500">{pm.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* UPI ID preview if UPI is selected */}
            {paymentMethod === 'UPI / PhonePe' && (
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D4AF37]/40 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F3823]">Enter UPI ID or Scan QR:</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">Zero Surcharge</span>
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. mobileNumber@upi"
                  className="w-full bg-white text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            )}
          </div>

        </div>

        {/* Right 5 Cols: Order Review & Final Place CTA */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          
          <div className="bg-white p-6 rounded-3xl border border-[#0F3823]/10 shadow-lg space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F3823]">
              Order Summary ({cart.length} items)
            </h3>

            {/* Items list */}
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.variant.id}`} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={item.product.heroImage} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg border" />
                    <div>
                      <div className="font-bold text-[#0F3823] max-w-[170px] truncate">{item.product.name}</div>
                      <div className="text-gray-400 text-[11px]">{item.variant.size} × {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-[#0F3823]">₹{item.variant.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-gray-800">₹{cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>BlueDart Express Shipping:</span>
                <span className="font-bold text-gray-800">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>5% GST (Included):</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#0F3823] border-t border-gray-100 pt-3">
                <span>Total Amount Payable:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isPlacing}
              className="w-full bg-gradient-to-r from-[#0F3823] to-[#164E31] hover:from-[#164E31] hover:to-[#0F3823] text-white py-4 rounded-2xl text-sm font-bold shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isPlacing ? (
                <span>Generating Order Invoice & Payment Token...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Pay ₹{cartTotal.toFixed(2)} & Place Order
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-gray-400 space-y-1">
              <div>🌿 100% Money-Back Vedic Purity Guarantee</div>
              <div>Ships safely in bubble-wrapped thermocol & glass packaging</div>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
