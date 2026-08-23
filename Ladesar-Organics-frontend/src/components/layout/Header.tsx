import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';
import { CATEGORIES_DATA } from '../../data/mockData';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Menu, 
  X, 
  SlidersHorizontal, 
  ChevronDown, 
  User, 
  ArrowRight, 
  Shield, 
  Phone,
  LogOut,
  Package,
  Gift
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    cart, 
    wishlist, 
    compareList, 
    deliveryPincode, 
    pincodeCity, 
    setPincode,
    setIsCartOpen, 
    setIsAiAdvisorOpen, 
    setView,
    currentView,
    products,
    categories,
    user,
    setIsAuthModalOpen,
    setAuthMode,
    logout,
    setQuickViewProduct
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState(deliveryPincode);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const filteredSearchResults = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim().length === 6) {
      setPincode(pincodeInput.trim());
      setIsPincodeModalOpen(false);
    }
  };

  const trendingTags = ['A2 Bilona Ghee', 'Lakadong Turmeric', 'Cold-Pressed Mustard Oil', 'Mango Pickle', 'Raw Wild Honey'];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/85 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_30px_rgba(15,56,35,0.03)] transition-all">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0F3823]/95 backdrop-blur-md text-[#FAF7F2] text-xs font-medium py-1.5 px-4 overflow-hidden relative border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#FAF7F2]/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> 100% Certified Organic & Vedic
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Free Express Shipping Over ₹499
            </span>
          </div>

          <div className="mx-auto md:mx-0 flex items-center gap-2 text-center text-xs">
            <span className="text-[#D4AF37] font-semibold">Festive Harvest Sale:</span>
            <span>Use Code <strong className="text-[#D4AF37] tracking-wider font-bold bg-white/10 px-1.5 py-0.5 rounded backdrop-blur-xs">FIRST15</strong> for 15% OFF</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {user && user.email ? (
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-semibold hidden sm:inline">
                  Namaste, {user.name.split(' ')[0]}
                </span>
                <span className="hidden sm:inline opacity-40">•</span>
                <button
                  onClick={() => setView('account')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  My Account
                </button>
                <span className="opacity-40">•</span>
                <button
                  onClick={logout}
                  className="text-rose-300 hover:text-rose-200 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="hover:text-[#D4AF37] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <User className="w-3 h-3 text-[#D4AF37]" /> Sign In
                </button>
                <span className="opacity-40">•</span>
                <button
                  onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                  className="text-[#D4AF37] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Gift className="w-3 h-3" /> Register (Get ₹100)
                </button>
              </div>
            )}
            
            <span className="hidden lg:inline opacity-40">•</span>
            <button 
              onClick={() => setView('admin')}
              className="hidden lg:flex text-[#D4AF37] font-semibold hover:underline items-center gap-1 bg-[#164E31]/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] border border-white/10"
            >
              <Shield className="w-3 h-3" /> Admin ERP
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECONDARY UTILITY BAR (Pincode + Fast Contacts) */}
      <div className="hidden md:block bg-[#F4EFE6]/60 backdrop-blur-md border-b border-[#0F3823]/5 py-1 px-4 text-xs text-[#0F3823]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Delivering to: <strong className="text-[#0F3823] font-semibold">{pincodeCity} ({deliveryPincode})</strong></span>
            <button 
              onClick={() => setIsPincodeModalOpen(true)}
              className="text-[#B8860B] font-semibold underline hover:text-[#0F3823] ml-1 text-[11px]"
            >
              Change
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#0F3823]" /> Toll-Free: 1800-LADESAR (1800-523-3727)
            </span>
            <span>•</span>
            <span>Farm Location: Churu & Alwar Heritage Organic Clusters, Rajasthan</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#0F3823] hover:bg-white/60 rounded-xl backdrop-blur-sm border border-transparent hover:border-white/50 transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <BrandLogo size="md" onClick={() => setView('home')} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-medium text-[#1A2E26]">
            <button
              onClick={() => setView('home')}
              className={`hover:text-[#0F3823] font-semibold transition-colors pb-1 border-b-2 ${
                currentView === 'home' ? 'border-[#0F3823] text-[#0F3823]' : 'border-transparent text-[#2D6A4F]'
              }`}
            >
              Home
            </button>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                onClick={() => setView('shop')}
                className={`flex items-center gap-1 hover:text-[#0F3823] transition-colors pb-1 border-b-2 ${
                  currentView === 'shop' ? 'border-[#0F3823] text-[#0F3823]' : 'border-transparent text-[#2D6A4F]'
                }`}
              >
                Organic Pantry <ChevronDown className="w-3.5 h-3.5 text-[#B8860B]" />
              </button>

              {/* Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div className="absolute top-full left-0 w-[580px] glass-panel rounded-3xl p-5 grid grid-cols-2 gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="col-span-2 pb-2 border-b border-[#0F3823]/10 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F3823]">
                      🌿 Certified Organic Collections
                    </span>
                    <button 
                      onClick={() => { setIsMegaMenuOpen(false); setView('shop'); }}
                      className="text-xs text-[#B8860B] hover:underline font-semibold flex items-center gap-1"
                    >
                      View All Products <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {(categories && categories.length > 0 ? categories : CATEGORIES_DATA)
                    .filter(c => c.isActive !== false)
                    .map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setIsMegaMenuOpen(false);
                          setView('shop');
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/80 transition-all text-left group border border-transparent hover:border-white/60 hover:shadow-sm cursor-pointer"
                      >
                        <img 
                          src={cat.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'} 
                          alt={cat.name} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-11 h-11 rounded-xl object-cover border border-[#D4AF37]/30 group-hover:scale-105 transition-transform shadow-xs" 
                        />
                        <div>
                          <div className="text-sm font-semibold text-[#0F3823] group-hover:text-[#B8860B] transition-colors line-clamp-1">
                            {cat.name}
                          </div>
                          {cat.hindiName && (
                            <div className="text-[10px] text-emerald-800/80 font-serif">{cat.hindiName}</div>
                          )}
                          <div className="text-[11px] text-gray-500 line-clamp-1">{cat.description}</div>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setView('recipes')}
              className={`hover:text-[#0F3823] transition-colors pb-1 border-b-2 ${
                currentView === 'recipes' ? 'border-[#0F3823] text-[#0F3823]' : 'border-transparent text-[#2D6A4F]'
              }`}
            >
              Ayurvedic Recipes
            </button>

            <button
              onClick={() => setView('about')}
              className={`hover:text-[#0F3823] transition-colors pb-1 border-b-2 ${
                currentView === 'about' ? 'border-[#0F3823] text-[#0F3823]' : 'border-transparent text-[#2D6A4F]'
              }`}
            >
              Our Vedic Story
            </button>

            <button
              onClick={() => setView('contact')}
              className={`hover:text-[#0F3823] transition-colors pb-1 border-b-2 ${
                currentView === 'contact' ? 'border-[#0F3823] text-[#0F3823]' : 'border-transparent text-[#2D6A4F]'
              }`}
            >
              Farm Contact
            </button>
          </nav>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm lg:max-w-md hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#B8860B] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="Search A2 Ghee, Mustard Oil, Lakadong Haldi..."
                className="w-full glass-input text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-full shadow-xs transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Live Search Popup Overlay */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-3xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                {searchQuery.trim() === '' ? (
                  <div>
                    <div className="text-[11px] font-bold text-[#0F3823] uppercase tracking-wider mb-2">
                      🔥 Trending Organic Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {trendingTags.map(tag => (
                        <button
                          key={tag}
                          onMouseDown={() => {
                            setSearchQuery(tag);
                            setView('shop');
                          }}
                          className="text-xs bg-white/70 backdrop-blur-sm text-[#0F3823] hover:bg-[#0F3823] hover:text-[#FAF7F2] px-3 py-1 rounded-full border border-white/80 shadow-2xs transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : filteredSearchResults.length > 0 ? (
                  <div>
                    <div className="text-[11px] font-bold text-[#0F3823] uppercase tracking-wider mb-2">
                      Matching Products ({filteredSearchResults.length})
                    </div>
                    <div className="divide-y divide-gray-100/60">
                      {filteredSearchResults.map(prod => (
                        <div
                          key={prod.id}
                          onMouseDown={() => {
                            setView('product-detail', prod.id);
                          }}
                          className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/80 px-2 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img src={prod.heroImage} alt={prod.name} className="w-10 h-10 object-cover rounded-xl border border-white/60 shadow-xs" />
                            <div>
                              <div className="text-xs font-bold text-[#0F3823]">{prod.name}</div>
                              <div className="text-[11px] text-gray-500">₹{prod.variants[0]?.price} • {prod.categoryName}</div>
                            </div>
                          </div>
                          <span className="text-xs text-[#B8860B] font-semibold">View →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-gray-500">
                    No organic items found for "{searchQuery}". Try "Ghee" or "Turmeric".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons (Wishlist, Compare, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Compare items badge */}
            {compareList.length > 0 && (
              <button
                onClick={() => setView('compare')}
                className="relative w-9 h-9 rounded-2xl flex items-center justify-center text-[#0F3823] bg-white/70 hover:bg-white backdrop-blur-md transition-all border border-white/80 shadow-2xs hover:shadow-sm active:scale-90"
                title="Compare Products"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-[#B8860B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => setView('wishlist')}
              className="relative w-9 h-9 rounded-2xl flex items-center justify-center text-[#0F3823] bg-white/70 hover:bg-white backdrop-blur-md transition-all border border-white/80 shadow-2xs hover:shadow-sm active:scale-90 hidden sm:flex"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-600 fill-current' : 'hover:text-rose-600'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0F3823] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Auth Trigger */}
            {user && user.email ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-[#0F3823] border border-emerald-900/20 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                  title="My Account & Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0F3823] text-[#D4AF37] flex items-center justify-center text-[10px] font-bold shadow-2xs">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold max-w-[80px] truncate hidden md:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {isUserMenuOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-amber-200/50 mb-1.5">
                      <p className="text-xs font-bold text-[#0F3823] truncate">{user.name}</p>
                      <p className="text-[10.5px] text-stone-500 truncate">{user.email}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/40 text-[11px]">
                        <span className="text-stone-600">Wallet: <strong className="text-emerald-800">₹{user.walletBalance || 0}</strong></span>
                        <span className="text-[#B8860B] font-bold">{user.loyaltyPoints || 0} Pts</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setIsUserMenuOpen(false); setView('account'); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-[#0F3823] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#0F3823]" /> My Profile & Addresses
                    </button>

                    <button
                      onClick={() => { setIsUserMenuOpen(false); setView('track-order'); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-[#0F3823] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5 text-[#0F3823]" /> My Orders & Tracking
                    </button>

                    <button
                      onClick={() => { setIsUserMenuOpen(false); logout(); }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer mt-1 border-t border-stone-100"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-2xl border border-stone-200 shadow-2xs">
                <button
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] transition-all font-bold text-xs shadow-xs cursor-pointer active:scale-95"
                  title="Sign In to your account"
                >
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Login</span>
                </button>
                
                <button
                  onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[#0F3823] hover:bg-stone-100 transition-all font-bold text-xs cursor-pointer"
                  title="Register new account"
                >
                  <Gift className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] px-3.5 py-2 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 border border-white/20"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. PINCODE MODAL */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#0F3823] font-bold text-base">
                <MapPin className="w-5 h-5 text-[#B8860B]" /> Check Delivery Pincode
              </div>
              <button onClick={() => setIsPincodeModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Enter your 6-digit postal pincode to check farm-fresh express delivery timelines.
            </p>
            <form onSubmit={handlePincodeSubmit} className="space-y-3">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={e => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 110001 or 400001"
                className="w-full text-center tracking-widest text-lg font-bold text-[#0F3823] px-4 py-2.5 rounded-2xl glass-input shadow-xs"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-[#0F3823] hover:bg-[#164E31] text-white py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-md"
              >
                Apply Location
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex">
          <div className="glass-panel w-4/5 max-w-sm h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#0F3823]/10 mb-6">
                <BrandLogo size="sm" onClick={() => { setIsMobileMenuOpen(false); setView('home'); }} />
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#0F3823] p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search pure organic foods..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setIsMobileMenuOpen(false);
                      setView('shop');
                    }
                  }}
                  className="w-full text-xs glass-input rounded-2xl px-4 py-2.5 shadow-xs"
                />
              </div>

              {/* Mobile User Profile or Login/Register Box */}
              {user && user.email ? (
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-amber-200/70 mb-4 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F3823] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#0F3823] truncate">{user.name}</div>
                      <div className="text-[10.5px] text-stone-500 truncate">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-amber-200/40 text-xs">
                    <span className="text-stone-600">Wallet: <strong className="text-emerald-800">₹{user.walletBalance || 0}</strong></span>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 mb-4 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#0F3823]">Vedic Member Portal</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); setAuthMode('login'); setIsAuthModalOpen(true); }}
                      className="py-2 rounded-xl bg-[#0F3823] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" /> Login
                    </button>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); setAuthMode('register'); setIsAuthModalOpen(true); }}
                      className="py-2 rounded-xl bg-[#FAF7F2] text-[#0F3823] border border-[#D4AF37]/50 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Gift className="w-3.5 h-3.5 text-[#B8860B]" /> Sign Up
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation list */}
              <div className="space-y-3 font-medium text-sm text-[#0F3823]">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setView('home'); }}
                  className="block w-full text-left py-2 hover:text-[#B8860B] transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setView('shop'); }}
                  className="block w-full text-left py-2 hover:text-[#B8860B] font-bold transition-colors"
                >
                  Shop All Products ({products.length})
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setView('recipes'); }}
                  className="block w-full text-left py-2 hover:text-[#B8860B] transition-colors"
                >
                  Ayurvedic Recipes & Remedies
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setView('about'); }}
                  className="block w-full text-left py-2 hover:text-[#B8860B] transition-colors"
                >
                  Our Vedic Bilona Story
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setView('track-order'); }}
                  className="block w-full text-left py-2 hover:text-[#B8860B] transition-colors"
                >
                  Track Order
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setView('account'); }}
                  className="block w-full text-left py-2 hover:text-[#B8860B] transition-colors"
                >
                  My Account & Orders
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#0F3823]/10 space-y-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); setView('admin'); }}
                className="w-full bg-[#0F3823] text-[#FAF7F2] py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <Shield className="w-4 h-4 text-[#D4AF37]" /> Enterprise Admin ERP
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
