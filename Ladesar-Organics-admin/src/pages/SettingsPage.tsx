import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  Store, 
  CreditCard, 
  Truck, 
  Save, 
  ShieldCheck, 
  CheckCircle2, 
  Bell,
  Mail,
  Phone
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useStore();
  const { user } = useAuth();

  const [storeName, setStoreName] = useState('Ladesar Organics Pvt. Ltd.');
  const [supportEmail, setSupportEmail] = useState('care@ladesarorganics.com');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [gstin, setGstin] = useState('08AABCL1234F1Z8');
  const [fssai, setFssai] = useState('12224026000189');
  const [minFreeShipping, setMinFreeShipping] = useState(799);
  const [standardShipping, setStandardShipping] = useState(60);

  const [codEnabled, setCodEnabled] = useState(true);
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [upiEnabled, setUpiEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Store settings and payment policies saved successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-stone-200">
          <Settings className="w-3 h-3" />
          <span>System Configurations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
          Store Settings & Compliance
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-sans-clean">
          Configure business credentials, FSSAI certificates, tax rates, and checkout rules
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Card 1: Enterprise Profile */}
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0F3823] flex items-center gap-2">
            <Store className="w-4 h-4 text-[#B8860B]" />
            <span>Store Identity & Statutory Licenses</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                Registered Enterprise Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                GSTIN Tax Number
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                FSSAI Central Organic License
              </label>
              <input
                type="text"
                value={fssai}
                onChange={(e) => setFssai(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Payment Gateways */}
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0F3823] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#B8860B]" />
            <span>Payment Methods & Checkout</span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <label className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-bold text-xs text-stone-900">Razorpay Cards & Netbanking</p>
                <p className="text-[10px] text-stone-500">256-bit encrypted gateway</p>
              </div>
              <input
                type="checkbox"
                checked={razorpayEnabled}
                onChange={(e) => setRazorpayEnabled(e.target.checked)}
                className="rounded text-[#0F3823]"
              />
            </label>

            <label className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-bold text-xs text-stone-900">Direct UPI (GPay/PhonePe)</p>
                <p className="text-[10px] text-stone-500">Zero surcharge instant intent</p>
              </div>
              <input
                type="checkbox"
                checked={upiEnabled}
                onChange={(e) => setUpiEnabled(e.target.checked)}
                className="rounded text-[#0F3823]"
              />
            </label>

            <label className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-bold text-xs text-stone-900">Cash on Delivery (COD)</p>
                <p className="text-[10px] text-stone-500">OTP verified delivery</p>
              </div>
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="rounded text-[#0F3823]"
              />
            </label>
          </div>
        </div>

        {/* Card 3: Shipping Thresholds */}
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0F3823] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#B8860B]" />
            <span>Shipping & Logistics Rules</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={minFreeShipping}
                onChange={(e) => setMinFreeShipping(Number(e.target.value))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={standardShipping}
                onChange={(e) => setStandardShipping(Number(e.target.value))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0F3823] to-[#164E31] text-[#FAF7F2] font-bold text-xs shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 border border-[#D4AF37]/50 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#D4AF37]" />
            <span>Save All Store Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
