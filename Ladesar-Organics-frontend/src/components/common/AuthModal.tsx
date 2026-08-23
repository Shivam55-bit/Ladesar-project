import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  Gift,
  KeyRound
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode, 
    login, 
    register, 
    showToast 
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [state, setState] = useState('Haryana');
  const [pincode, setPincode] = useState('122001');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address', 'warning');
      return;
    }
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please fill all required fields', 'warning');
      return;
    }
    setIsLoading(true);
    await register({
      name,
      email,
      phone: phone || '+91 98000 00000',
      password: password || 'password123',
      street,
      city,
      state,
      pincode
    });
    setIsLoading(false);
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoName: string) => {
    setIsLoading(true);
    await login(demoEmail, 'password123');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.35)] border border-white/80 animate-in zoom-in-95 duration-200 flex flex-col my-8"
      >
        
        {/* Header with Luxury Emerald background & Gold accents */}
        <div className="bg-[#0F3823] text-[#FAF7F2] p-6 relative border-b border-[#D4AF37]/30">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <BrandLogo size="sm" variant="light" />
          </div>

          <h2 className="text-xl font-bold font-serif-luxury text-white">
            {authMode === 'login' ? 'Welcome to Ladesar Family' : 'Create Your Vedic Account'}
          </h2>
          <p className="text-xs text-[#D4AF37] mt-1">
            {authMode === 'login' 
              ? 'Sign in to access your orders, saved addresses & loyalty points.' 
              : 'Join today & get instant ₹100 Welcome Credit + 50 Reward Points!'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-2xl bg-white/10 p-1 mt-4 border border-white/15">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#D4AF37] text-[#0F3823] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#D4AF37] text-[#0F3823] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5 bg-white/90">
          
          {authMode === 'login' ? (
            /* --- LOGIN FORM --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F3823] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. shivam@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#0F3823] focus:bg-white transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#0F3823] uppercase tracking-wider">
                    Password *
                  </label>
                  <span className="text-[11px] text-[#B8860B] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#0F3823] focus:bg-white transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? 'Signing in...' : 'Sign In to Vedic Account'} <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              {/* 1-Click Quick Demo Sign-Ins */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="flex-shrink mx-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    Quick Demo 1-Click Test Login
                  </span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('shivamshishodia2000@gmail.com', 'Shivam Shishodia')}
                    className="p-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 text-left transition-colors cursor-pointer shadow-2xs"
                  >
                    <div className="text-xs font-bold text-[#0F3823]">👑 Shivam Shishodia</div>
                    <div className="text-[10px] text-amber-800 font-semibold">VIP Member (₹450 Wallet)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('priya.sharma@example.com', 'Priya Sharma')}
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-left transition-colors cursor-pointer shadow-2xs"
                  >
                    <div className="text-xs font-bold text-[#0F3823]">🌿 Priya Sharma</div>
                    <div className="text-[10px] text-gray-500">Regular Customer</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* --- REGISTER FORM --- */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Special Reward Promo Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3 text-amber-950 text-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0 font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-bold">Signup Bonus Added to Wallet!</strong>
                  <span className="text-[11px] text-amber-800">You'll receive ₹100 instant wallet cash + 50 points.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F3823] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-none focus:border-[#0F3823] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F3823] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-none focus:border-[#0F3823] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F3823] uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-none focus:border-[#0F3823] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F3823] uppercase tracking-wider mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-none focus:border-[#0F3823] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-[#0F3823] uppercase tracking-wider">
                  Primary Delivery Address (Optional)
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House/Flat No., Street, Landmark"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-none focus:border-[#0F3823]"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {isLoading ? 'Creating Account...' : 'Complete Free Registration'} <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </form>
          )}

          {/* Privacy & Trust Footnote */}
          <div className="pt-2 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> 256-Bit SSL Encrypted • 100% Privacy Protected
          </div>
        </div>
      </div>
    </div>
  );
};
