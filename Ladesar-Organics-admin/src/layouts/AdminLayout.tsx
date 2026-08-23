import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { Header } from './Header.tsx';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  X, 
  ShoppingBag, 
  Package, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info 
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { products, orders, toasts } = useStore();
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProducts = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredOrders = searchQuery.trim()
    ? orders.filter(o => 
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.shippingAddress?.fullName || o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0F3823]">
      
      {/* Ambient background mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(#0F3823_0.75px,transparent_0.75px)] [background-size:24px_24px]" />
      <div className="fixed top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#2D6A4F]/5 blur-[140px] pointer-events-none -z-10" />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area Offset by Sidebar on Desktop */}
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        
        {/* Sticky Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
        />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>

        {/* Global Toast Notifications */}
        {toasts && toasts.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs sm:text-sm font-semibold border pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300 ${
                  toast.type === 'success'
                    ? 'bg-[#0F3823]/95 text-[#FAF7F2] border-[#D4AF37]/60 shadow-[0_8px_30px_rgba(15,56,35,0.25)]'
                    : toast.type === 'error'
                    ? 'bg-rose-950/95 text-white border-rose-500/60 shadow-[0_8px_30px_rgba(225,29,72,0.25)]'
                    : 'bg-stone-900/95 text-white border-stone-700/60'
                }`}
              >
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-sky-300" />}
                <span>{toast.message}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Global Quick Search & Command Palette Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/40 overflow-hidden"
          >
            {/* Search Input Box */}
            <div className="p-4 border-b border-stone-100 flex items-center gap-3 bg-[#FAF7F2]">
              <Search className="w-5 h-5 text-[#0F3823]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, orders, categories, SKU..."
                className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="p-4 max-h-96 overflow-y-auto space-y-4">
              {searchQuery.trim() ? (
                <>
                  {filteredProducts.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Products ({filteredProducts.length})
                      </p>
                      <div className="space-y-1">
                        {filteredProducts.map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              navigate('/products');
                              setIsSearchModalOpen(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-[#FAF7F2] flex items-center justify-between cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img src={p.heroImage} alt={p.name} className="w-9 h-9 rounded-lg object-cover border" />
                              <div>
                                <p className="text-xs font-bold text-stone-900 group-hover:text-[#0F3823]">{p.name}</p>
                                <p className="text-[11px] text-stone-500">{p.categoryName} • ₹{p.variants[0]?.price}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#D4AF37]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredOrders.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Orders ({filteredOrders.length})
                      </p>
                      <div className="space-y-1">
                        {filteredOrders.map(o => (
                          <div
                            key={o.id}
                            onClick={() => {
                              navigate('/orders');
                              setIsSearchModalOpen(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-[#FAF7F2] flex items-center justify-between cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                                📦
                              </div>
                              <div>
                                <p className="text-xs font-bold text-stone-900 group-hover:text-[#0F3823]">Order #{o.orderNumber}</p>
                                <p className="text-[11px] text-stone-500">{o.shippingAddress?.fullName || o.customerName || 'Customer'} • ₹{o.totalAmount} • {o.status}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#D4AF37]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProducts.length === 0 && filteredOrders.length === 0 && (
                    <div className="py-8 text-center text-xs text-stone-400">
                      No matching products or orders found for "{searchQuery}".
                    </div>
                  )}
                </>
              ) : (
                <div className="py-6 text-center text-xs text-stone-400">
                  <p className="font-semibold text-stone-600 mb-1">Quick Navigation Commands</p>
                  <p>Type product names like "Ghee", "Mustard Oil", or order IDs like "LAD-2026".</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#FAF7F2] border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 px-4">
              <span>Press <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border">ESC</kbd> to exit</span>
              <span className="text-[#0F3823] font-semibold">Ladesar Fast Search</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
