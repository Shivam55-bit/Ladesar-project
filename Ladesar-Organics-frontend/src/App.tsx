import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { RecipesPage } from './pages/RecipesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { WishlistComparePage } from './pages/WishlistComparePage';
import { AccountPage } from './pages/AccountPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { LabPurityModal } from './components/common/LabPurityModal';
import { AuthModal } from './components/common/AuthModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toasts } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'recipes':
        return <RecipesPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'wishlist':
        return <WishlistComparePage initialTab="wishlist" />;
      case 'compare':
        return <WishlistComparePage initialTab="compare" />;
      case 'account':
        return <AccountPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col frosted-bg-mesh text-gray-900 selection:bg-[#D4AF37] selection:text-[#0F3823] relative">
      {/* Soft Ambient Refractive Lights for Frosted Depth */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#D4AF37]/8 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#2D6A4F]/7 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[#D4AF37]/6 blur-[130px] pointer-events-none -z-10" />

      {/* Customer Header & Footer */}
      <Header />

      <main className="flex-1">
        {renderView()}
      </main>

      <Footer />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <LabPurityModal />
      <AuthModal />

      {/* Floating Global Toast Notifications */}
      {toasts && toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300 ${
                toast.type === 'success'
                  ? 'bg-[#0F3823]/90 text-[#FAF7F2] border-[#D4AF37]/60 shadow-[0_8px_30px_rgba(15,56,35,0.25)]'
                  : toast.type === 'error'
                  ? 'bg-rose-950/90 text-white border-rose-500/60 shadow-[0_8px_30px_rgba(225,29,72,0.25)]'
                  : 'bg-gray-900/90 text-white border-gray-700/60'
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
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
