import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { CATEGORIES_DATA } from '../data/mockData';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  Check, 
  Grid, 
  List, 
  ChevronDown,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, categories, setView } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceMax, setPriceMax] = useState<number>(3000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const allAvailableTags = [
    'Organic Certified',
    'A2 Vedic Bilona',
    'Cold-Pressed',
    'Stone Ground',
    'Zero Chemical',
    'Raw Unheated',
    'Best Seller'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceMax(3000);
    setSelectedTags([]);
    setSortBy('featured');
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category Filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Price Filter
        const minPrice = Math.min(...p.variants.map(v => v.price));
        if (minPrice > priceMax) return false;

        // Tags Filter
        if (selectedTags.length > 0) {
          const productTags = [...p.dietaryTags, ...(p.isBestSeller ? ['Best Seller'] : [])];
          const hasAllTags = selectedTags.some(tag => 
            productTags.some(pt => pt.toLowerCase().includes(tag.toLowerCase()))
          );
          if (!hasAllTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // default featured
      });
  }, [products, selectedCategory, searchQuery, priceMax, selectedTags, sortBy]);

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedTags.length) + (searchQuery ? 1 : 0) + (priceMax < 3000 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-[0_15px_35px_rgba(15,56,35,0.15)] border border-white/60 bg-[#0F3823]/95 backdrop-blur-md text-[#FAF7F2]">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 100% NABL Tested & Farm Certified
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif-luxury">
            The Vedic Organic Pantry
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            Every item is harvested in peak season, stone-ground, cold-extracted in wood kohlu, and bottled in amber glass for uncompromised prana and vitality.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* 1. DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block glass-panel rounded-3xl p-6 border border-white/80 shadow-xs space-y-6 sticky top-28">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#0F3823]/10">
            <h3 className="text-sm font-bold text-[#0F3823] uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#B8860B]" /> Filter By
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Categories
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs px-3.5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#0F3823] text-[#FAF7F2] font-semibold shadow-xs'
                    : 'text-gray-700 hover:bg-white/70'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] opacity-75">({products.length})</span>
              </button>
              {(categories && categories.length > 0 ? categories : CATEGORIES_DATA)
                .filter(c => c.isActive !== false)
                .map(cat => {
                  const count = products.filter(p => p.category === cat.slug || p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug || cat.id)}
                      className={`w-full text-left text-xs px-3.5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer ${
                        selectedCategory === (cat.slug || cat.id)
                          ? 'bg-[#0F3823] text-[#FAF7F2] font-semibold shadow-xs'
                          : 'text-gray-700 hover:bg-white/70'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] opacity-75">({count})</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Price Slider */}
          <div className="space-y-2 pt-4 border-t border-[#0F3823]/10">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-wider text-gray-700">
                Max Price
              </label>
              <span className="font-bold text-[#0F3823]">₹{priceMax}</span>
            </div>
            <input
              type="range"
              min={100}
              max={3000}
              step={50}
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#0F3823]"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>₹100</span>
              <span>₹3,000+</span>
            </div>
          </div>

          {/* Dietary & Purity Badges */}
          <div className="space-y-2 pt-4 border-t border-[#0F3823]/10">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Purity Badges
            </label>
            <div className="space-y-1.5">
              {allAvailableTags.map(tag => {
                const isChecked = selectedTags.includes(tag);
                return (
                  <label
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-[#0F3823] select-none p-1.5 rounded-xl hover:bg-white/70 transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shadow-2xs ${
                        isChecked
                          ? 'bg-[#0F3823] border-[#0F3823] text-white'
                          : 'border-gray-300 bg-white/90'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <span>{tag}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* 2. PRODUCT GRID & CONTROLS */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Filter Bar Controls */}
          <div className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            
            {/* Search within catalog */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 text-[#B8860B] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by product name, ingredient..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="glass-input w-full text-xs pl-9 pr-8 py-2 rounded-xl focus:outline-none placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden bg-white/70 backdrop-blur-xs text-[#0F3823] text-xs font-bold px-3.5 py-2 rounded-xl border border-white/80 flex items-center gap-1.5 shadow-2xs"
            >
              <Filter className="w-3.5 h-3.5 text-[#B8860B]" /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="glass-input text-xs font-semibold text-[#0F3823] px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured (Top Pick)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="reviews">Most Reviewed</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Active filter tags row */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Active:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-[#0F3823] text-white px-3 py-1 rounded-full shadow-2xs">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-white/80 backdrop-blur-xs text-[#0F3823] border border-white/80 px-3 py-1 rounded-full font-medium shadow-2xs">
                  {tag}
                  <button onClick={() => handleTagToggle(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 text-xs bg-white/80 backdrop-blur-xs text-[#0F3823] border border-white/80 px-3 py-1 rounded-full font-medium shadow-2xs">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 font-semibold hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-white/80 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/80 backdrop-blur-xs border border-white/80 flex items-center justify-center mx-auto text-[#0F3823] shadow-xs">
                <Search className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold text-[#0F3823]">No Organic Items Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No items match your active filter combination. Try resetting your search filters or adjusting the price range.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#0F3823] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#164E31] transition-all shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 3. MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="glass-panel w-4/5 max-w-sm h-full shadow-[0_25px_60px_rgba(0,0,0,0.3)] p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200 border-l border-white/80">
            <div className="flex items-center justify-between pb-3 border-b border-[#0F3823]/10">
              <h3 className="text-sm font-bold text-[#0F3823] uppercase tracking-wider">
                Filter Products
              </h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Categories
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory('all'); setIsMobileFilterOpen(false); }}
                  className={`w-full text-left text-xs px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                    selectedCategory === 'all' ? 'bg-[#0F3823] text-white font-semibold shadow-2xs' : 'text-gray-700 bg-white/70'
                  }`}
                >
                  All Categories
                </button>
                {(categories && categories.length > 0 ? categories : CATEGORIES_DATA)
                  .filter(c => c.isActive !== false)
                  .map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.slug || cat.id); setIsMobileFilterOpen(false); }}
                      className={`w-full text-left text-xs px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                        selectedCategory === (cat.slug || cat.id) ? 'bg-[#0F3823] text-white font-semibold shadow-2xs' : 'text-gray-700 bg-white/70'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Mobile Price Slider */}
            <div className="space-y-2 pt-4 border-t border-[#0F3823]/10">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-gray-700">Max Price: ₹{priceMax}</label>
              </div>
              <input
                type="range"
                min={100}
                max={3000}
                step={50}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#0F3823]"
              />
            </div>

            {/* Apply / Reset Actions */}
            <div className="pt-6 border-t border-[#0F3823]/10 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#0F3823] text-white text-xs font-bold py-3 rounded-2xl shadow-md border border-white/20"
              >
                Apply Filters ({filteredProducts.length} results)
              </button>
              <button
                onClick={() => { handleResetFilters(); setIsMobileFilterOpen(false); }}
                className="w-full bg-white/70 backdrop-blur-xs text-gray-700 text-xs font-semibold py-2.5 rounded-2xl border border-white/80"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
