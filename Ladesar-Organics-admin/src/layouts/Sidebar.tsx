import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/common/BrandLogo';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Tag, 
  TicketPercent, 
  Sparkles, 
  ShieldCheck, 
  Settings, 
  X,
  LogOut,
  ChevronRight,
  TrendingUp,
  Palette,
  Users
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { products, orders, coupons, users, showToast } = useStore();
  const navigate = useNavigate();

  const lowStockCount = products.filter(p => p.variants.some(v => v.stock < 30)).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Placed' || o.status === 'Processing').length;

  const navItems = [
    {
      title: 'Store Customization',
      items: [
        { name: 'Hero & Brand Customizer', path: '/appearance', icon: Palette, badge: 'Live', badgeColor: 'bg-[#D4AF37] text-[#0F3823]' },
      ]
    },
    {
      title: 'Core Management',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, badge: null },
        { name: 'Products Catalog', path: '/products', icon: ShoppingBag, badge: `${products.length}` },
        { name: 'Customer Orders', path: '/orders', icon: Package, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null, badgeColor: 'bg-amber-500 text-white' },
        { name: 'Users & Customers', path: '/users', icon: Users, badge: `${users.length}`, badgeColor: 'bg-[#0F3823] text-[#D4AF37]' },
        { name: 'Inventory & Stock', path: '/inventory', icon: Layers, badge: lowStockCount > 0 ? `${lowStockCount} Low` : null, badgeColor: 'bg-rose-500 text-white' },
        { name: 'Categories', path: '/categories', icon: Tag, badge: null },
      ]
    },
    {
      title: 'Marketing & Offers',
      items: [
        { name: 'Coupons & Promo', path: '/coupons', icon: TicketPercent, badge: `${coupons.length}` },
      ]
    },
    {
      title: 'System & Governance',
      items: [
        { name: 'Audit Logs & Roles', path: '/audit-logs', icon: ShieldCheck, badge: null },
        { name: 'Store Settings', path: '/settings', icon: Settings, badge: null },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    showToast('Signed out of Admin console', 'info');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0A1B14] text-white flex flex-col border-r border-[#D4AF37]/20 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10 relative">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" variant="light" showTagline={false} />
            <div className="flex flex-col">
              <span className="font-serif tracking-wider font-bold text-sm text-[#FAF7F2]">
                Ladesar Admin
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37]">
                Enterprise Suite
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navItems.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 mb-2">
                {section.title}
              </p>
              
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#D4AF37] border border-[#D4AF37]/40 shadow-lg shadow-[#0F3823]/50'
                        : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-white/10 text-white/90 border border-white/10'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Profile Bar */}
        <div className="p-4 border-t border-white/10 bg-[#06120D]">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name || 'Admin'}
                className="w-8 h-8 rounded-xl object-cover border border-[#D4AF37]"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Vaidya Admin'}</p>
                <p className="text-[10px] text-[#D4AF37] truncate">{user?.role || 'Super Admin'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};
