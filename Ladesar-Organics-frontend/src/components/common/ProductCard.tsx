import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star, 
  ShieldCheck, 
  SlidersHorizontal,
  Check
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare, 
    setQuickViewProduct,
    setView
  } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'v1',
      size: 'Standard',
      price: 299,
      mrp: 350,
      stock: 50,
      sku: 'LAD-STD'
    }
  );

  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);

  const discountPercent = Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div
      onClick={() => setView('product-detail', product.id)}
      className="group relative glass-card rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      {/* Top Badges & Actions */}
      <div className="relative aspect-square w-full bg-[#FAF7F2]/60 overflow-hidden">
        <img
          src={product.heroImage || '/images/products/Gir-Cow-Ghee-product.png'}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/products/Gir-Cow-Ghee-product.png';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount & Special Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#B8860B]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-white/30">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#0F3823]/90 backdrop-blur-md text-[#FAF7F2] text-[9.5px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-white/20">
              ★ Best Seller
            </span>
          )}
          {product.dietaryTags[0] && (
            <span className="bg-white/80 backdrop-blur-md text-[#0F3823] text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/60 shadow-2xs">
              {product.dietaryTags[0]}
            </span>
          )}
        </div>

        {/* Quick Action Floating Buttons with Clean Glass Circles */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-200 active:scale-90 ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100'
                : 'bg-white/90 text-gray-700 hover:text-rose-600 hover:bg-white border border-white/80 hover:shadow-md'
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-current scale-110' : 'group-hover/btn:scale-110'}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:text-[#0F3823] hover:bg-white backdrop-blur-md shadow-sm border border-white/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center hover:shadow-md active:scale-90"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 border border-white/80 active:scale-90 ${
              isCompared
                ? 'bg-[#0F3823] text-[#FAF7F2] shadow-xs'
                : 'bg-white/90 text-gray-700 hover:text-[#0F3823] hover:bg-white hover:shadow-md'
            }`}
            title={isCompared ? "Remove from Compare" : "Compare Product"}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Purity Tag on Image */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-[#FAF7F2] bg-[#0F3823]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-xs">
          <span className="flex items-center gap-1.5 font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> NABL Tested
          </span>
          <span className="text-[#D4AF37] font-semibold tracking-wider text-[9px] uppercase">{product.categoryName}</span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating & Review Count */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-[#B8860B] text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 font-normal text-[11px]">({product.reviewsCount})</span>
            </div>
            {product.hindiName && (
              <span className="text-[11px] text-[#0F3823]/70 font-serif-luxury truncate max-w-[130px]">
                {product.hindiName}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-bold text-[#0F3823] group-hover:text-[#B8860B] transition-colors line-clamp-2 leading-snug mb-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div>
          {/* Variant Selector Pills */}
          {product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-lg font-medium transition-all ${
                    selectedVariant.id === v.id
                      ? 'bg-[#0F3823] text-white shadow-xs'
                      : 'bg-white/60 backdrop-blur-xs text-[#0F3823] hover:bg-white border border-white/60'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          )}

          {/* Pricing & Add to Bag */}
          <div className="pt-2 border-t border-[#0F3823]/5 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-bold text-[#0F3823]">
                  ₹{selectedVariant.price}
                </span>
                {selectedVariant.mrp > selectedVariant.price && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{selectedVariant.mrp}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">
                (Inclusive of all taxes)
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 border border-white/20 ${
                isAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#0F3823] text-[#FAF7F2] hover:bg-[#164E31]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
