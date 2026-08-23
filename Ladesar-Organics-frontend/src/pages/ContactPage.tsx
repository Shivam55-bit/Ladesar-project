import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Customer Care & Orders',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast('Your inquiry has been forwarded to the Ladesar Farm team!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">
          Direct From Organic Estate
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0F3823] font-serif-luxury">
          Get in Touch With Our Vaidyas & Farmers
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Whether you have a query on Ayurvedic protocols, want to book an organic farm visit, or require corporate festive gifting, we are delighted to assist.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Cols: Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F3823] text-white p-8 rounded-3xl shadow-xl border-2 border-[#D4AF37]/40 space-y-6">
            <h3 className="text-lg font-bold font-serif-luxury text-[#FAF7F2]">
              Ladesar Organics Farm Headquarters
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#FAF7F2]/90">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Certified Farm & Gaushala:</strong>
                  Ladesar Heritage Organic Estate, Churu-Bikaner Highway, Sector 4, Rajasthan 331001, India.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Corporate Experience Centre:</strong>
                  Level 5, DLF Cyber City, Tower B, Gurugram, Delhi NCR 122002.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <strong className="block text-white">Toll-Free Helpline:</strong>
                  1800-LADESAR (1800-523-3727) / +91 98290 55443
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <strong className="block text-white">Email Care:</strong>
                  care@ladesarorganics.com / bulk@ladesarorganics.com
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <strong className="block text-white">Hours:</strong>
                  Monday – Saturday: 9:00 AM to 7:00 PM IST
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-[#D4AF37] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> FSSAI Central License: 10021013000451
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Interactive Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0F3823] font-serif-luxury">Message Received!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Our farm relationship manager will respond to you within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-[#0F3823] font-serif-luxury mb-4">
                Send Us a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Inquiry Purpose</label>
                  <select
                    value={formData.inquiryType}
                    onChange={e => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Customer Care & Orders">Order Assistance & Delivery</option>
                    <option value="Ayurvedic Consultation">Ayurvedic Usage Guidance</option>
                    <option value="Corporate & Festive Gifting">Corporate Bulk & Wedding Gifting</option>
                    <option value="Farm Visit & Gaushala Tour">Organic Farm & Gaushala Tour</option>
                    <option value="Distributor / Retail Dealership">Retailer & Export Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">How can we assist you? *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details of your inquiry or requirements..."
                  className="w-full bg-[#FAF7F2] text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-[#0F3823] hover:bg-[#164E31] text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-2xl shadow-md transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" /> Submit Inquiry
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
