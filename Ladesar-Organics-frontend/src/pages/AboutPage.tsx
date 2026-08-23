import React from 'react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { 
  ShieldCheck, 
  Leaf, 
  Award, 
  Heart, 
  Users, 
  CheckCircle2, 
  Sun, 
  MapPin,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setView } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. HERO STORY BANNER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <BrandLogo size="lg" className="mx-auto" />
        <h1 className="text-3xl sm:text-5xl font-bold text-[#0F3823] font-serif-luxury leading-tight pt-4">
          Rooted in Ancient Soil. <br />
          <span className="text-[#B8860B]">Committed to Uncompromised Purity.</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Founded with a sacred commitment to resurrect India's ancestral food wisdom, Ladesar Organics operates certified organic regenerative farms in Rajasthan. We reject synthetic chemicals, solvent extractions, and industrial shortcuts.
        </p>
      </div>

      {/* 2. THE THREE FOUNDATIONAL PILLARS (From uploaded logo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#D4AF37]/40 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#0F3823] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F3823] uppercase tracking-wider font-serif-luxury">
            Pure Ingredients
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            100% single-origin, certified organic heirloom seeds. Grown using Jeevamrutha and vermicompost with zero pesticide residues.
          </p>
        </div>

        <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#D4AF37]/40 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#0F3823] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F3823] uppercase tracking-wider font-serif-luxury">
            Traditional Values
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Preserving classical 5-stage Bilona curd-churning, wood-ghani cold press (Kohlu), and stone-grinding that safeguards life-giving enzymes.
          </p>
        </div>

        <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#D4AF37]/40 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#0F3823] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F3823] uppercase tracking-wider font-serif-luxury">
            Made For Every Family
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Direct from farm to your kitchen in heavy amber glass jars. Transparent NABL laboratory batch testing available for every single bottle.
          </p>
        </div>
      </div>

      {/* 3. THE REGENERATIVE FARM & GAUSHALA */}
      <div className="bg-[#0F3823] text-white rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-[#D4AF37]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            🌿 The Gaushala & Native Breeds
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury">
            Ahimsa Gaushala & Cruelty-Free Milking
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Our indigenous Gir and Tharparkar cows graze freely across pristine chemical-free pastures in Rajasthan, feeding on wild medicinal herbs, moringa leaves, and fresh grass. Calves are always fed their full share of mother's milk first before any milking commences.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Zero Injections or Hormones
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> A2 Beta-Casein Certified
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Solar-Powered Extraction
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> 100% Zero Plastic Jars
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="aspect-4/3 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=80"
              alt="Organic Farm Cows"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 4. CTA BANNER */}
      <div className="bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/50 text-center space-y-4">
        <h3 className="text-2xl font-bold text-[#0F3823] font-serif-luxury">
          Taste the Sincerity of Pure Vedic Nourishment
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          Explore our certified organic harvest today with 100% refund guarantee if you do not fall in love with the pure aroma.
        </p>
        <button
          onClick={() => setView('shop')}
          className="bg-[#0F3823] hover:bg-[#164E31] text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full shadow-lg transition-all inline-flex items-center gap-2"
        >
          Shop The Vedic Catalog <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </button>
      </div>

    </div>
  );
};
