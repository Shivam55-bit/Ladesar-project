import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';
import { 
  ShieldCheck, 
  Leaf, 
  Award, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView, showToast, setLabReportProduct, products, categories, user, setIsAuthModalOpen, setAuthMode } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setIsSubscribed(true);
      showToast('Welcome to Ladesar Family! Your ₹100 off code is FIRST15', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#092416]/95 backdrop-blur-xl text-[#FAF7F2] border-t border-[#D4AF37]/30 pt-16 pb-8 overflow-hidden relative">
      {/* Background ambient glow inside footer */}
      <div className="absolute top-0 right-[15%] w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-[10%] w-96 h-96 rounded-full bg-[#2D6A4F]/10 blur-[100px] pointer-events-none" />

      {/* 1. TRUST BADGES CAROUSEL / STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 border-b border-[#FAF7F2]/10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 hover:border-[#D4AF37]/40 transition-all hover:bg-white/10 shadow-sm">
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 border border-[#D4AF37]/30">
              <Leaf className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">100% Certified</div>
              <div className="text-sm font-semibold text-white">India Organic & Jaivik</div>
              <div className="text-[11px] text-gray-300">Zero synthetic chemicals</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 hover:border-[#D4AF37]/40 transition-all hover:bg-white/10 shadow-sm">
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 border border-[#D4AF37]/30">
              <Award className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Ancestral Vedic</div>
              <div className="text-sm font-semibold text-white">Bilona & Wood Kohlu</div>
              <div className="text-[11px] text-gray-300">Slow cold extraction</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 hover:border-[#D4AF37]/40 transition-all hover:bg-white/10 shadow-sm">
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 border border-[#D4AF37]/30">
              <ShieldCheck className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Batch Tested</div>
              <div className="text-sm font-semibold text-white">Lab Purity Reports</div>
              <div className="text-[11px] text-gray-300">Scan & verify GC-MS purity</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 hover:border-[#D4AF37]/40 transition-all hover:bg-white/10 shadow-sm">
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 border border-[#D4AF37]/30">
              <Heart className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Pure Sincerity</div>
              <div className="text-sm font-semibold text-white">Farm to Table Glass</div>
              <div className="text-[11px] text-gray-300">Packed in UV amber glass</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" variant="light" onClick={() => setView('home')} />
            <p className="text-xs text-[#FAF7F2]/75 leading-relaxed max-w-sm mt-3">
              Ladesar Organics is dedicated to resurrecting India’s ancestral food wisdom. We produce authentic A2 Bilona Vedic Desi Ghee, Wood-Pressed Kachi Ghani Mustard Oil, Single-Origin Lakadong Turmeric, and Traditional Pickles on our certified organic farms in Rajasthan.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-[#D4AF37]">
              <span className="font-semibold">FSSAI Central Lic. No:</span> 10021013000451
            </div>

            {/* Newsletter */}
            <div className="pt-4 max-w-md">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Subscribe to Organic Harvest Journal
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email for ₹100 off..."
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-xs px-4 py-2.5 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 flex-1 transition-all"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E6CA65] hover:to-[#D4AF37] text-[#0F3823] font-bold text-xs px-4 py-2.5 rounded-2xl transition-all flex items-center gap-1 shadow-md"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {isSubscribed && (
                <div className="text-xs text-[#D4AF37] mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Thank you! Code FIRST15 is ready for your checkout.
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Vedic Pantry</h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/80">
              {(categories && categories.length > 0 ? categories : [])
                .filter(c => c.isActive !== false)
                .slice(0, 6)
                .map(cat => (
                  <li key={cat.id}>
                    <button onClick={() => setView('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left">
                      {cat.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Customer & Story */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Heritage & Care</h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/80">
              <li>
                <button onClick={() => setView('about')} className="hover:text-[#D4AF37] transition-colors">
                  Our Bilona & Vedic Story
                </button>
              </li>
              <li>
                <button onClick={() => setView('recipes')} className="hover:text-[#D4AF37] transition-colors">
                  Ayurvedic Healing Recipes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLabReportProduct(products[0])}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Lab Test Certificates
                </button>
              </li>
              <li>
                <button onClick={() => setView('track-order')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Track Consignment
                </button>
              </li>
              <li>
                {user && user.email ? (
                  <button onClick={() => setView('account')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                    My Account & Orders
                  </button>
                ) : (
                  <button 
                    onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} 
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer text-[#D4AF37] font-semibold"
                  >
                    Customer Sign In / Register
                  </button>
                )}
              </li>
              <li>
                <button onClick={() => setView('contact')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Farm Visit Enquiries
                </button>
              </li>
              <li>
                <button onClick={() => setView('admin')} className="hover:text-[#D4AF37] transition-colors text-[#D4AF37] font-semibold cursor-pointer">
                  Admin ERP Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Farm Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Farm Office</h4>
            <div className="space-y-2.5 text-xs text-[#FAF7F2]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Ladesar Heritage Organic Estate, Churu-Bikaner Highway, Rajasthan 331001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>+91 98290 55443 / 1800-LADESAR</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>care@ladesarorganics.com</span>
              </div>
              <div className="pt-2">
                <span className="inline-block bg-white/10 backdrop-blur-sm text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-semibold border border-white/10">
                  🌿 100% Recyclable Glass & Eco Tins
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM LEGAL & PAYMENT GATEWAYS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60 relative z-10">
        <div>
          © {new Date().getFullYear()} Ladesar Organics Pvt. Ltd. All Rights Reserved. Rooted in Purity.
        </div>

        {/* Payment badges */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-[#D4AF37]">
            <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted Checkout
          </span>
          <span>•</span>
          <span>Razorpay</span>
          <span>•</span>
          <span>UPI / PhonePe</span>
          <span>•</span>
          <span>Cards & COD</span>
        </div>
      </div>
    </footer>
  );
};
