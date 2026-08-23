import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  Search, 
  Bell, 
  LogOut, 
  Shield, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  ShoppingBag,
  ChevronDown,
  User
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSearch }) => {
  const { user, logout, loginAsDemo } = useAuth();
  const { orders, products, showToast } = useStore();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const lowStockItems = products.filter(p => p.variants.some(v => v.stock < 30));
  const pendingOrders = orders.filter(o => o.status === 'Placed' || o.status === 'Processing');
  const totalAlerts = lowStockItems.length + (pendingOrders.length > 0 ? 1 : 0);

  const handleLogout = () => {
    logout();
    showToast('Logged out of admin console successfully', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#0F3823]/10 px-4 sm:px-6 flex items-center justify-between transition-all">
      
      {/* Left side: Hamburger & Global Quick Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-stone-700 hover:text-[#0F3823] hover:bg-[#0F3823]/5 transition-colors lg:hidden cursor-pointer"
          title="Toggle Navigation"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Global Live Search Bar */}
        <div 
          onClick={onOpenSearch}
          className="relative max-w-md w-full hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 border border-stone-200 text-stone-500 hover:border-[#D4AF37] hover:bg-white transition-all cursor-pointer shadow-sm text-xs group"
        >
          <Search className="w-4 h-4 text-stone-400 group-hover:text-[#0F3823] transition-colors" />
          <span className="flex-1 font-sans-clean">Search products, orders, customers, SKU...</span>
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-stone-100 text-stone-500 rounded border border-stone-200">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right side: Live Server status, Notifications, Role Badge & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Backend Online Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Vedic API Online</span>
        </div>

        {/* Customer Store Front Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0F3823] hover:bg-[#0F3823]/10 transition-colors border border-[#0F3823]/20"
          title="Open Customer Front"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#B8860B]" />
        </a>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl text-stone-700 hover:text-[#0F3823] hover:bg-[#0F3823]/5 transition-colors relative cursor-pointer"
            title="System Alerts & Notifications"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                {totalAlerts}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif font-bold text-[#0F3823] text-sm">Store Alerts & Live Feed</h3>
                <span className="text-[10px] uppercase font-bold text-[#B8860B] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {totalAlerts} Active
                </span>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {lowStockItems.slice(0, 3).map(p => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-900">Low Stock: {p.name}</p>
                      <p className="text-stone-600 text-[11px]">Only {p.variants[0]?.stock} units remaining in warehouse</p>
                    </div>
                  </div>
                ))}

                {pendingOrders.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-2.5 text-xs">
                    <Package className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-900">{pendingOrders.length} Orders awaiting fulfillment</p>
                      <p className="text-stone-600 text-[11px]">Dispatch before 4:00 PM for next-day courier pickup</p>
                    </div>
                  </div>
                )}

                {totalAlerts === 0 && (
                  <div className="py-6 text-center text-xs text-stone-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1 opacity-70" />
                    <p>All stock levels & orders optimal</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 rounded-2xl hover:bg-[#0F3823]/5 border border-stone-200 hover:border-[#D4AF37] transition-all cursor-pointer"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name || 'Admin'}
              className="w-8 h-8 rounded-xl object-cover border border-[#D4AF37]/50 shadow-sm"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-[#0F3823] leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#B8860B] font-medium leading-none">
                {user?.role || 'Super Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden lg:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              
              <div className="p-3 border-b border-stone-100 flex items-center gap-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user?.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#D4AF37]"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#0F3823] truncate">{user?.name}</p>
                  <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                  <span className="inline-block text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 mt-1">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Role Switcher in Menu */}
              <div className="p-2 border-b border-stone-100">
                <p className="text-[10px] font-bold uppercase text-stone-400 px-2 mb-1.5 tracking-wider">
                  Switch Admin Persona:
                </p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <button
                    onClick={() => { loginAsDemo('Super Admin'); setIsProfileOpen(false); }}
                    className={`px-2 py-1 rounded-lg text-left transition-colors cursor-pointer ${
                      user?.role === 'Super Admin' ? 'bg-[#0F3823] text-white font-bold' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    👑 Super Admin
                  </button>
                  <button
                    onClick={() => { loginAsDemo('Inventory Manager'); setIsProfileOpen(false); }}
                    className={`px-2 py-1 rounded-lg text-left transition-colors cursor-pointer ${
                      user?.role === 'Inventory Manager' ? 'bg-[#0F3823] text-white font-bold' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    📦 Catalog Mgr
                  </button>
                </div>
              </div>

              <div className="p-1 space-y-0.5 text-xs">
                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <User className="w-4 h-4 text-stone-400" />
                  <span>Store Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-stone-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors text-xs font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
};
