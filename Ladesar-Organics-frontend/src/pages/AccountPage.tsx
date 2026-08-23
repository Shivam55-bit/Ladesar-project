import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Truck, 
  FileText, 
  CheckCircle2, 
  Printer, 
  ShieldCheck,
  LogOut,
  Edit2,
  Plus,
  Trash2,
  Save,
  Wallet,
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { 
    user, 
    orders, 
    setView, 
    showToast, 
    logout, 
    updateUserProfile, 
    addUserAddress, 
    deleteUserAddress, 
    setDefaultUserAddress,
    setIsAuthModalOpen,
    setAuthMode 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'rewards'>('orders');

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);

  // Add Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Gurugram');
  const [addrState, setAddrState] = useState('Haryana');
  const [addrPincode, setAddrPincode] = useState('122001');
  const [addrType, setAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (!user || !user.email) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#0F3823] text-[#D4AF37] flex items-center justify-center mx-auto shadow-xl">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#0F3823]">
          Sign In to Access Your Vedic Account
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          View your order tracking, download invoices, manage delivery addresses, and check your Vedic loyalty rewards wallet balance.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
            className="px-6 py-3 rounded-2xl bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            Sign In to Account <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
          <button
            onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
            className="px-6 py-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#0F3823] border border-[#D4AF37]/50 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            Create New Account
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({ name: editName, phone: editPhone });
    setIsEditingProfile(false);
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrPincode) {
      showToast('Please fill all required address fields', 'warning');
      return;
    }
    await addUserAddress({
      fullName: addrName || user.name,
      phone: addrPhone || user.phone,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
      type: addrType,
      isDefault: user.addresses.length === 0
    });
    setIsAddingAddress(false);
    setAddrStreet('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* User Header Profile Card */}
      <div className="bg-[#0F3823] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 relative overflow-hidden border-2 border-[#D4AF37]/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#0F3823] flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
              <Sparkles className="w-3.5 h-3.5" /> {user.role || 'Verified Vedic Member'}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
              {user.name}
            </h1>
            <div className="text-xs text-gray-300">
              {user.email} • {user.phone}
            </div>
          </div>
        </div>

        {/* Quick Wallet Stats Strip & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <div className="text-center pr-3 border-r border-white/20">
              <span className="text-[10px] text-gray-300 uppercase block font-semibold">Wallet Cash</span>
              <strong className="text-sm sm:text-base text-emerald-300">₹{user.walletBalance || 0}</strong>
            </div>
            <div className="text-center pl-1">
              <span className="text-[10px] text-gray-300 uppercase block font-semibold">Loyalty Points</span>
              <strong className="text-sm sm:text-base text-[#D4AF37]">{user.loyaltyPoints || 0} Pts</strong>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-3 rounded-2xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Sign out of this device"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-gray-200 shadow-xs space-y-1.5">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <span className="flex items-center gap-2"><Package className="w-4 h-4 text-[#D4AF37]" /> Order History ({orders.length})</span>
            <span className="text-[11px] opacity-80">→</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4AF37]" /> Delivery Addresses ({user.addresses.length})</span>
            <span className="text-[11px] opacity-80">→</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <span className="flex items-center gap-2"><Wallet className="w-4 h-4 text-[#D4AF37]" /> Vedic Wallet & Rewards</span>
            <span className="text-[11px] opacity-80">→</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <span className="flex items-center gap-2"><User className="w-4 h-4 text-[#D4AF37]" /> Profile Details</span>
            <span className="text-[11px] opacity-80">→</span>
          </button>

          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out from Account
            </button>
          </div>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#0F3823] font-serif-luxury">
                  Your Orders & Shipments
                </h2>
                <span className="text-xs text-stone-500 font-medium">Showing {orders.length} orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center border border-stone-200 text-xs text-gray-500 space-y-3">
                  <Package className="w-8 h-8 mx-auto text-stone-300" />
                  <p>You haven't placed any orders yet.</p>
                  <button
                    onClick={() => setView('shop')}
                    className="px-4 py-2 bg-[#0F3823] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100 text-xs">
                      <div>
                        <span className="text-gray-400 block">Order Number:</span>
                        <strong className="text-[#0F3823] font-mono">#{order.orderNumber}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Placed On:</span>
                        <strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Total Amount:</span>
                        <strong className="text-base text-[#0F3823]">₹{order.totalAmount}</strong>
                      </div>
                      <div>
                        <span className="inline-block bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 text-xs">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover rounded-lg border" />
                            <div>
                              <div className="font-bold text-[#0F3823]">{item.productName}</div>
                              <div className="text-gray-400 text-[11px]">Size: {item.variantSize} × {item.quantity}</div>
                            </div>
                          </div>
                          <span className="font-bold text-[#0F3823]">₹{item.total}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => window.print()}
                        className="text-xs text-gray-600 hover:text-[#0F3823] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Download Tax Invoice
                      </button>
                      <button
                        onClick={() => setView('track-order')}
                        className="bg-[#FAF7F2] text-[#0F3823] hover:bg-[#F4EFE6] px-4 py-2 rounded-xl text-xs font-bold border border-[#D4AF37]/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#B8860B]" /> Track Live Delivery
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#0F3823] font-serif-luxury">
                    Saved Delivery Addresses
                  </h2>
                  <p className="text-xs text-stone-500">Manage multiple addresses for home, office or gifts.</p>
                </div>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="px-3.5 py-2 rounded-xl bg-[#0F3823] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              </div>

              {/* Add Address Form Modal / Box */}
              {isAddingAddress && (
                <form onSubmit={handleSaveNewAddress} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in">
                  <h3 className="text-xs font-bold text-[#0F3823] uppercase tracking-wider">New Delivery Location</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      className="p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Recipient Phone Number"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Street, Landmark"
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Pincode"
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      className="p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#0F3823] text-white text-xs font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    className={`p-4 rounded-2xl border-2 transition-all text-xs space-y-2 relative ${
                      addr.isDefault 
                        ? 'border-[#0F3823] bg-[#FAF7F2]' 
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-bold text-[#0F3823]">{addr.fullName || addr.type}</strong>
                      {addr.isDefault ? (
                        <span className="bg-[#0F3823] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full">Default</span>
                      ) : (
                        <button
                          onClick={() => setDefaultUserAddress(addr.id)}
                          className="text-[11px] text-[#B8860B] hover:underline cursor-pointer font-semibold"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{addr.street}</p>
                    <p className="text-gray-700 font-semibold">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-gray-500">{addr.phone}</p>
                    <div className="pt-2 border-t border-stone-100 flex justify-end">
                      <button
                        onClick={() => deleteUserAddress(addr.id)}
                        className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. REWARDS & WALLET TAB */}
          {activeTab === 'rewards' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#0F3823] font-serif-luxury">
                  Vedic Loyalty Club & Wallet
                </h2>
                <p className="text-xs text-stone-500">Redeem loyalty points for instant checkout discounts.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Available Wallet Balance</span>
                  <h3 className="text-3xl font-serif font-bold text-[#0F3823]">₹{user.walletBalance || 0}</h3>
                  <p className="text-xs text-emerald-700">100% redeemable on any organic food order without minimum cart limit.</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Loyalty Points (1 Pt = ₹1)</span>
                  <h3 className="text-3xl font-serif font-bold text-amber-900">{user.loyaltyPoints || 0} Pts</h3>
                  <p className="text-xs text-amber-800">Earn 5% points on every stone-ground spice & cold-pressed oil order.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-amber-200/60 space-y-2 text-xs">
                <span className="font-bold text-[#0F3823] block">👑 Your Referral Code:</span>
                <div className="flex items-center gap-2">
                  <code className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 font-mono font-bold text-sm text-[#0F3823]">
                    {user.referralCode || 'LAD-2026'}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.referralCode || 'LAD-2026');
                      showToast('Referral code copied!', 'success');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0F3823] text-white text-xs font-bold cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>
                <p className="text-stone-600 text-[11px]">Share with friends and family to give them ₹100 off; you receive ₹100 in your wallet upon their first purchase!</p>
              </div>
            </div>
          )}

          {/* 4. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#0F3823] font-serif-luxury">
                  Personal Information
                </h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setEditName(user.name);
                      setEditPhone(user.phone);
                      setIsEditingProfile(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-stone-700 hover:text-[#0F3823] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Details
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="text-stone-700 font-bold block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-stone-700 font-bold block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-xl border border-stone-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#0F3823] text-white font-bold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Full Name</label>
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 font-bold text-stone-900">{user.name}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Email Address</label>
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 font-bold text-stone-900">{user.email}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Phone Number</label>
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 font-bold text-stone-900">{user.phone}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Account Tier</label>
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 text-[#B8860B] font-bold">
                      {user.role || 'VIP Member'} (100% Organic Club)
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
