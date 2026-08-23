import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AdminRoleType } from '../../../context/AuthContext';
import { useStore } from '../../../context/StoreContext';
import { BrandLogo } from '../../../components/common/BrandLogo';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Leaf,
  Layers,
  ShoppingBag,
  Truck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isAuthenticated } = useAuth();
  const { showToast } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@ladesar.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already authenticated, redirect to /
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your admin email address');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back to Ladesar Organics Admin Portal`, 'success');
        navigate('/');
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (role: AdminRoleType) => {
    loginAsDemo(role);
    showToast(`Logged in as ${role}`, 'success');
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0A1B14] overflow-hidden selection:bg-[#D4AF37] selection:text-[#0F3823]">
      {/* Background Decorative Mesh & Lights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#1B4332]/50 via-[#0A1B14] to-[#050E0A] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#D4AF37]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#2D6A4F]/20 blur-[160px] pointer-events-none" />
      
      {/* Subtle Sacred Geometry Gold Pattern Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 relative z-10 items-center">
        
        {/* Left Side Brand Showcase (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-[#0F3823]/80 to-[#082216]/90 border border-[#D4AF37]/25 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-white min-h-[580px]">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vedic Governance Portal</span>
            </div>

            <BrandLogo size="lg" variant="light" className="items-start text-left mb-6" />

            <p className="text-white/80 text-sm leading-relaxed font-sans-clean mt-4">
              Real-time enterprise administrative console for managing organic food supply chains, certified lab batches, cold-pressed harvesting records, and omnichannel customer fulfillment.
            </p>
          </div>

          <div className="space-y-3.5 my-8">
            <div className="flex items-center gap-3 text-xs text-white/90 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">100% Certified Organic Batches</p>
                <p className="text-white/60 text-[11px]">Lab-tested Vedic Bilona & Mustard harvests</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/90 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">AI Vedic & Ayurvedic Engine</p>
                <p className="text-white/60 text-[11px]">Automated SEO & Charaka Samhita wisdom generator</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
            <span>© 2026 Ladesar Organics Pvt. Ltd.</span>
            <span className="text-[#D4AF37]">v2.4 Enterprise</span>
          </div>
        </div>

        {/* Right Side Login Card */}
        <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-[#D4AF37]/30 backdrop-blur-xl">
          
          <div className="mb-6">
            <div className="lg:hidden mb-4 flex justify-center">
              <BrandLogo size="md" variant="dark" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823] tracking-tight">
              Executive Sign In
            </h1>
            <p className="text-sm text-stone-600 mt-1 font-sans-clean">
              Enter your credentials to access store analytics and management
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3823] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ladesar.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-2xl text-sm text-stone-800 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3823]">
                  Security Password
                </label>
                <span className="text-xs text-[#B8860B] hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-white border border-stone-300 rounded-2xl text-sm text-stone-800 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="rounded text-[#0F3823] focus:ring-[#D4AF37]" />
                <span>Keep me signed in on this device</span>
              </label>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 256-bit SSL
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0F3823] via-[#164E31] to-[#0F3823] text-[#FAF7F2] font-semibold text-sm shadow-xl shadow-[#0F3823]/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/40 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter Admin</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Selector */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 text-center">
              ⚡ 1-Click Quick Demo Login (Role-based):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Super Admin')}
                className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-900 text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700 font-bold">
                  👑
                </div>
                <span className="text-[11px]">Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('Inventory Manager')}
                className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-700">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[11px]">Catalog & Stock</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('Order Fulfillment')}
                className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-900 text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-700">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[11px]">Orders & Delivery</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
