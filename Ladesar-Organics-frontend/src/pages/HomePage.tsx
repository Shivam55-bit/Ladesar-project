import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { CATEGORIES_DATA } from '../data/mockData';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Award, 
  Truck, 
  Heart, 
  Star, 
  CheckCircle2, 
  Flame, 
  Check, 
  ChevronRight, 
  Eye, 
  Droplets, 
  Sun, 
  XCircle, 
  Shield, 
  RotateCcw 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, siteSettings, recipes, setView, addToCart, setIsAiAdvisorOpen, setLabReportProduct, showToast } = useStore();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [activeRecipeIndex, setActiveRecipeIndex] = useState<number>(0);

  const hero = siteSettings?.hero || {
    badgeText: '100% Certified Organic • Farm-Harvested in Rajasthan',
    headingLine1: 'Purity As Nature &',
    headingLine2: 'Vedic Wisdom Intended',
    subtitle: 'Handcrafted A2 Bilona Desi Ghee, Wood-Pressed Kachi Ghani Mustard Oil, Single-Origin High-Curcumin Spices, and Raw Wild Honey. Packed exclusively in UV-protected glass.',
    primaryBtnText: 'Explore Organic Pantry',
    primaryBtnLink: 'shop',
    secondaryBtnText: 'Consult AI Ayurvedic Vaidya',
    secondaryBtnLink: 'ai-advisor',
    featuredProductImage: 'https://images.unsplash.com/photo-1589927986086-3d10fb5555ca?auto=format&fit=crop&w=800&q=80',
    featuredBadge: 'Vedic Masterpiece',
    featuredTitle: 'A2 Bilona Vedic Desi Gir Cow Ghee',
    featuredDescription: 'Prepared through the traditional 5-stage Bilona method from curdled A2 Gir cow milk over slow cow dung fire in brass vessels.',
    featuredPrice: 1099,
    featuredMrp: 1299,
    featuredRating: 4.9,
    featuredReviewsCount: 184,
    featuredLabBadge: 'NABL Lab Tested',
    featuredBtnText: 'Add to Bag',
    pillars: [
      { title: '100%', subtitle: 'Chemical Free', iconName: 'Leaf' as const },
      { title: 'A2 Bilona', subtitle: 'Curd Churned', iconName: 'RotateCcw' as const },
      { title: 'Glass Jar', subtitle: 'Zero Plastic', iconName: 'ShieldCheck' as const },
    ]
  };

  const featuredGhee = products.find(p => p.id === 'ghee-01') || products[0];
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);

  const displayedProducts = selectedCategoryTab === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === selectedCategoryTab);

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0F3823] text-[#FAF7F2] overflow-hidden pt-8 pb-16 lg:py-20">
        {/* Background decorative patterns & radial gold glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#2D6A4F]/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#D4AF37] shadow-sm">
                <Leaf className="w-3.5 h-3.5" />
                <span>{hero.badgeText}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white font-serif-luxury leading-[1.15]">
                {hero.headingLine1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E7C4] via-[#D4AF37] to-[#E6CA65]">
                  {hero.headingLine2}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#FAF7F2]/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => setView('shop')}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E6CA65] hover:to-[#D4AF37] text-[#0F3823] text-sm font-bold px-7 py-3.5 rounded-2xl shadow-xl transition-all flex items-center gap-2 active:scale-95 group cursor-pointer"
                >
                  <span>{hero.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setIsAiAdvisorOpen(true)}
                  className="bg-white/10 hover:bg-white/20 text-[#FAF7F2] border border-white/20 text-sm font-semibold px-6 py-3.5 rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{hero.secondaryBtnText}</span>
                </button>
              </div>

              {/* Trust Pillars strip with styled icon pills */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                {hero.pillars && hero.pillars.length > 0 ? (
                  hero.pillars.map((pillar, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 border border-[#D4AF37]/30">
                        {idx === 0 ? <Leaf className="w-4 h-4" /> : idx === 1 ? <RotateCcw className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#D4AF37]">{pillar.title}</div>
                        <div className="text-[10px] text-gray-300">{pillar.subtitle}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 border border-[#D4AF37]/30">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#D4AF37]">100%</div>
                        <div className="text-[10px] text-gray-300">Chemical Free</div>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 border border-[#D4AF37]/30">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#D4AF37]">A2 Bilona</div>
                        <div className="text-[10px] text-gray-300">Curd Churned</div>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 border border-[#D4AF37]/30">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#D4AF37]">Glass Jar</div>
                        <div className="text-[10px] text-gray-300">Zero Plastic</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Hero Visual Right Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#D4AF37]/30 to-[#2D6A4F]/40 transform rotate-3 filter blur-md" />
                
                {/* Hero Showcase Card */}
                <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-[#D4AF37]/50 text-gray-900 overflow-hidden">
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-[#FAF7F2]">
                    <img
                      src={hero.featuredProductImage || featuredGhee.heroImage}
                      alt={hero.featuredTitle || featuredGhee.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0F3823] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#D4AF37]" /> {hero.featuredBadge || 'Vedic Masterpiece'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1 text-[#B8860B] text-xs font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{(hero.featuredRating || 4.9).toFixed(1)}</span>
                      <span className="text-gray-400 font-normal">({hero.featuredReviewsCount || 184} reviews)</span>
                    </div>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {hero.featuredLabBadge || 'NABL Lab Tested'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0F3823] line-clamp-1">
                    {hero.featuredTitle || featuredGhee.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">
                    {hero.featuredDescription || 'Prepared through the traditional 5-stage Bilona method from curdled A2 Gir cow milk over slow cow dung fire in brass vessels.'}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-bold text-[#0F3823]">₹{hero.featuredPrice || featuredGhee.variants[0]?.price}</span>
                      {(hero.featuredMrp || featuredGhee.variants[0]?.mrp) > (hero.featuredPrice || featuredGhee.variants[0]?.price) && (
                        <span className="text-xs text-gray-400 line-through ml-2">₹{hero.featuredMrp || featuredGhee.variants[0]?.mrp}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(featuredGhee, featuredGhee.variants[0], 1)}
                      className="bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      {hero.featuredBtnText || 'Add to Bag'}
                    </button>
                  </div>
                </div>

                {/* Floating Certification Badge */}
                <div className="absolute -bottom-4 -left-4 bg-[#FAF7F2] text-[#0F3823] p-3 rounded-2xl shadow-xl border border-[#D4AF37]/60 hidden sm:flex items-center gap-3 animate-bounce duration-1000">
                  <div className="w-9 h-9 rounded-xl bg-[#0F3823] text-[#D4AF37] flex items-center justify-center font-bold shadow-xs border border-[#D4AF37]/40">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F3823]">Lab Certified Pure</div>
                    <div className="text-[10px] text-gray-600">Zero Synthetic Adulterants</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#B8860B] mb-1">
              Pure Farm Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F3823] font-serif-luxury">
              Explore Certified Organic Staples
            </h2>
          </div>
          <button
            onClick={() => setView('shop')}
            className="text-xs sm:text-sm font-bold text-[#0F3823] hover:text-[#B8860B] flex items-center gap-1 mt-2 md:mt-0 transition-colors"
          >
            View Entire Catalog ({products.length} items) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
          {(categories && categories.length > 0 ? categories : CATEGORIES_DATA)
            .filter(cat => cat.isActive !== false)
            .map((cat) => {
              const liveCount = products.filter(p => p.category === cat.slug || p.category === cat.id).length || cat.itemsCount || 1;

              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryTab(cat.slug);
                    setView('shop');
                  }}
                  className="group bg-white rounded-2xl p-3 border border-[#0F3823]/10 hover:border-[#D4AF37] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-between relative overflow-hidden"
                >
                  {cat.badge && (
                    <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-[#0F3823]/90 text-[#D4AF37] text-[8px] font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs">
                      {cat.badge}
                    </div>
                  )}

                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] mb-3 relative">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'}
                      alt={cat.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <h3 className="text-xs sm:text-sm font-bold font-serif-luxury text-[#0F3823] group-hover:text-[#B8860B] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  {cat.hindiName && (
                    <p className="text-[10px] text-emerald-800/80 font-serif font-medium line-clamp-1">{cat.hindiName}</p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{liveCount}+ Products</p>
                </div>
              );
            })}
        </div>
      </section>

      {/* 3. BEST SELLERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#B8860B] mb-1">
              Household Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F3823] font-serif-luxury">
              Top Rated Vedic Essentials
            </h2>
          </div>

          {/* Dynamic Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => setSelectedCategoryTab('all')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                selectedCategoryTab === 'all'
                  ? 'bg-[#0F3823] text-[#D4AF37] shadow-xs font-bold'
                  : 'bg-[#F4EFE6] text-[#0F3823] hover:bg-[#FAF7F2]'
              }`}
            >
              All Items
            </button>
            {(categories && categories.length > 0 ? categories : CATEGORIES_DATA)
              .filter(c => c.isActive !== false)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.slug || cat.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                    selectedCategoryTab === (cat.slug || cat.id)
                      ? 'bg-[#0F3823] text-[#D4AF37] shadow-xs font-bold'
                      : 'bg-[#F4EFE6] text-[#0F3823] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. THE VEDIC BILONA PROMISE COMPARISON SECTION */}
      <section className="bg-[#FAF7F2] py-16 border-y border-[#0F3823]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-[#B8860B] mb-1">
              Ancient Process vs Modern Industry
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F3823] font-serif-luxury">
              Why Ladesar Vedic Bilona Ghee Is Pure Amrit
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Unlike 95% of market ghee produced from chemical milk cream (malai), Ladesar Ghee is prepared using the 5,000-year-old Vedic Bilona method.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Ladesar Column */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#0F3823] text-[#D4AF37] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
                🌿 The Ladesar Standard
              </div>

              <h3 className="text-lg font-bold text-[#0F3823] font-serif-luxury mb-4">
                Authentic 5-Stage Vedic Bilona
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F3823]">A2 Desi Gir Cow Whole Milk:</strong> Freshly milked from free-grazing indigenous cows feeding on medicinal grasses.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F3823]">Clay Pot Curd Fermentation:</strong> Milk is boiled in brass vessels and naturally cultured into whole curd overnight.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F3823]">Bidirectional Wood Churning (Bilona):</strong> Curd is hand-churned with wooden valona churners during Brahma Muhurta.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F3823]">Slow Cow Dung Fire Boiling:</strong> Makkhan (butter) is clarified over slow herbal cow dung fire without scorching.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F3823]">Granular Amber Glass Packing:</strong> Packed fresh in sterilized glass jars with natural golden aroma and granular texture.
                  </div>
                </div>
              </div>
            </div>

            {/* Industrial Market Column */}
            <div className="bg-gray-100/80 rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">
                ⚠️ Commercial / Industrial Ghee
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Machine Separator Cream Ghee
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong>Mixed Jersey/HF Buffalo Milk:</strong> Milk collected from hormone/oxytocin injected high-yield hybrid cows.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong>Centrifugal Cream Separation:</strong> Raw fat is mechanically spun out without curd fermentation.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong>Chemical Heating & Bleaching:</strong> Cream is high-pressure boiled at extreme temperatures, killing probiotics.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong>Synthetic Colors & Palm Oil Adulteration:</strong> Beta-carotene added to mimic golden glow; packed in plastic pouches.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AYURVEDIC RECIPE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0F3823] to-[#164E31] rounded-3xl p-6 sm:p-10 text-white shadow-2xl border-2 border-[#D4AF37]/50 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5" /> Recipe of the Week
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury">
                {recipes?.[0]?.title || 'Traditional Ayurvedic Rasayana'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {recipes?.[0]?.description || 'Holistic Vedic preparation packed with essential micro-nutrients.'}
              </p>

              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  🌿 Ayurvedic Healing Benefits:
                </div>
                <p className="text-xs text-gray-200">
                  {recipes?.[0]?.ayurvedicBenefits || 'Balances tri-doshas and kindle digestive Agni.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setView('recipes')}
                  className="bg-[#D4AF37] hover:bg-[#E6CA65] text-[#0F3823] text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  View Full Recipe Steps <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const prod1 = products.find(p => p.id === 'spice-02') || products[0];
                    const prod2 = products.find(p => p.id === 'ghee-01') || products[1];
                    addToCart(prod1, prod1.variants[0], 1);
                    addToCart(prod2, prod2.variants[0], 1);
                  }}
                  className="bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl border border-white/20 transition-colors"
                >
                  Add Recipe Staples to Bag (₹1,248)
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
                <img
                  src={recipes?.[0]?.image || recipes?.[0]?.heroImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                  alt={recipes?.[0]?.title || 'Ayurvedic Recipe'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LAB PURITY CERTIFICATE VERIFICATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#D4AF37]/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0F3823] text-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F3823] font-serif-luxury">
                Every Single Batch Tested for 48 Chemical Parameters
              </h3>
              <p className="text-xs text-gray-600 max-w-xl">
                We believe in radical transparency. Inspect real GC-MS analysis, pesticide residue tests, and FSSAI compliance for your batch right now.
              </p>
            </div>
          </div>

          <button
            onClick={() => setLabReportProduct(products[0])}
            className="bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 flex-shrink-0"
          >
            <Eye className="w-4 h-4 text-[#D4AF37]" /> Inspect Sample Lab COA
          </button>
        </div>
      </section>

    </div>
  );
};
