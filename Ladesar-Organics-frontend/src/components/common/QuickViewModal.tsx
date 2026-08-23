import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductVariant } from '../../types';
import { 
  X, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Heart, 
  Truck, 
  Check, 
  Leaf,
  ExternalLink 
} from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    wishlist, 
    toggleWishlist,
    setView,
    setLabReportProduct 
  } = useStore();

  if (!quickViewProduct) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    quickViewProduct.variants[0]
  );
  const [activeImage, setActiveImage] = useState(quickViewProduct.heroImage);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.includes(quickViewProduct.id);
  const discountPercent = Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100);

  const handleAdd = () => {
    addToCart(quickViewProduct, selectedVariant, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleFullDetail = () => {
    const id = quickViewProduct.id;
    setQuickViewProduct(null);
    setView('product-detail', id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl max-w-3xl w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-white/80 animate-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/70 hover:bg-white text-gray-700 shadow-md backdrop-blur-sm border border-white/60 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="bg-white/40 backdrop-blur-md p-6 flex flex-col items-center justify-center border-r border-white/60">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/70 border border-white/80 shadow-xs mb-3">
              <img
                src={activeImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail switcher */}
            {quickViewProduct.galleryImages.length > 1 && (
              <div className="flex gap-2">
                {quickViewProduct.galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shadow-xs ${
                      activeImage === img ? 'border-[#0F3823] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Certifications */}
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/80 backdrop-blur-xs text-[#0F3823] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/70 shadow-2xs">
                  {quickViewProduct.categoryName}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Certified Organic
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#0F3823] leading-snug">
                {quickViewProduct.name}
              </h2>
              {quickViewProduct.hindiName && (
                <div className="text-xs text-[#B8860B] font-serif-luxury mt-0.5">
                  {quickViewProduct.hindiName}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[#B8860B] text-xs font-bold gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{quickViewProduct.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-400">({quickViewProduct.reviewsCount} verified reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mt-3">
                <span className="text-2xl font-bold text-[#0F3823]">
                  ₹{selectedVariant.price}
                </span>
                {selectedVariant.mrp > selectedVariant.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{selectedVariant.mrp}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs bg-[#B8860B]/90 backdrop-blur-xs text-white px-2 py-0.5 rounded-md font-bold">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                {quickViewProduct.shortDescription}
              </p>

              {/* Key Benefits Pill list */}
              <div className="mt-3 space-y-1">
                {quickViewProduct.ayurvedicBenefits.slice(0, 2).map((benefit, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-[#0F3823]">
                    <Leaf className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Variant Selector */}
              {quickViewProduct.variants.length > 1 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Select Pack Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                          selectedVariant.id === v.id
                            ? 'bg-[#0F3823] text-white border-[#0F3823] shadow-xs'
                            : 'bg-white/70 backdrop-blur-xs text-gray-700 border-white/80 hover:border-[#D4AF37]'
                        }`}
                      >
                        {v.size} — ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-4 border-t border-[#0F3823]/10">
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 border border-white/20 ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#0F3823] text-white hover:bg-[#164E31]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Add to Bag (₹{selectedVariant.price})
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-3 rounded-2xl border transition-colors shadow-xs backdrop-blur-xs ${
                    isWishlisted
                      ? 'bg-rose-50/90 border-rose-200 text-rose-600'
                      : 'bg-white/70 border-white/80 text-gray-600 hover:bg-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => {
                    const prod = quickViewProduct;
                    setQuickViewProduct(null);
                    setLabReportProduct(prod);
                  }}
                  className="text-[#B8860B] hover:underline font-semibold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> View Purity Lab Report
                </button>

                <button
                  onClick={handleFullDetail}
                  className="text-[#0F3823] hover:underline font-bold flex items-center gap-1"
                >
                  Full Product Details <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
