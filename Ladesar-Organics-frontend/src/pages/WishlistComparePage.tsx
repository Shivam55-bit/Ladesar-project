import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { 
  Heart, 
  SlidersHorizontal, 
  Trash2, 
  ShoppingBag, 
  Check, 
  X, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

interface WishlistCompareProps {
  initialTab?: 'wishlist' | 'compare';
}

export const WishlistComparePage: React.FC<WishlistCompareProps> = ({ initialTab = 'wishlist' }) => {
  const { 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare, 
    products, 
    addToCart, 
    setView 
  } = useStore();

  const [activeTab, setActiveTab] = React.useState<'wishlist' | 'compare'>(initialTab);

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
  const comparedProducts = products.filter(p => compareList.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3823] font-serif-luxury">
            {activeTab === 'wishlist' ? 'Your Saved Vedic Favorites' : 'Side-by-Side Product Comparison'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {activeTab === 'wishlist'
              ? `${wishlistedProducts.length} items saved for future harvest orders`
              : `Comparing ${comparedProducts.length} of 4 items`}
          </p>
        </div>

        <div className="flex gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'wishlist'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" /> Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Compare ({compareList.length})
          </button>
        </div>
      </div>

      {/* 1. WISHLIST VIEW */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#D4AF37] flex items-center justify-center mx-auto text-[#0F3823]">
                <Heart className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3823]">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore our pure organic pantry and click the heart icon on any product to save it here.
              </p>
              <button
                onClick={() => setView('shop')}
                className="bg-[#0F3823] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#164E31] transition-colors inline-flex items-center gap-2"
              >
                Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SIDE-BY-SIDE COMPARISON TABLE */}
      {activeTab === 'compare' && (
        <div>
          {comparedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#D4AF37] flex items-center justify-center mx-auto text-[#0F3823]">
                <SlidersHorizontal className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3823]">No Products Selected for Comparison</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Click the compare icon on product cards to evaluate ingredients, extraction methods, and prices side-by-side.
              </p>
              <button
                onClick={() => setView('shop')}
                className="bg-[#0F3823] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#164E31] transition-colors inline-flex items-center gap-2"
              >
                Add Items to Compare <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  {/* Product Header Row */}
                  <tr className="border-b border-gray-200 bg-[#FAF7F2]/60">
                    <td className="p-4 font-bold text-gray-500 w-48">Product</td>
                    {comparedProducts.map(prod => (
                      <td key={prod.id} className="p-4 min-w-[220px]">
                        <div className="relative">
                          <button
                            onClick={() => toggleCompare(prod.id)}
                            className="absolute -top-2 -right-2 text-gray-400 hover:text-rose-600 p-1"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <img src={prod.heroImage} alt={prod.name} className="w-20 h-20 object-cover rounded-xl mb-2 border" />
                          <h4 className="font-bold text-[#0F3823] text-sm">{prod.name}</h4>
                          <span className="text-[11px] text-gray-500">{prod.categoryName}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Price Row */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-bold text-gray-700">Price & Pack Size</td>
                    {comparedProducts.map(prod => (
                      <td key={prod.id} className="p-4 font-bold text-[#0F3823] text-sm">
                        ₹{prod.variants[0]?.price} <span className="text-xs font-normal text-gray-500">({prod.variants[0]?.size})</span>
                      </td>
                    ))}
                  </tr>

                  {/* Extraction Method */}
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-700">Extraction Method</td>
                    {comparedProducts.map(prod => (
                      <td key={prod.id} className="p-4 text-gray-700 leading-relaxed">
                        {prod.extractionMethod}
                      </td>
                    ))}
                  </tr>

                  {/* Certifications */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-bold text-gray-700">Certifications</td>
                    {comparedProducts.map(prod => (
                      <td key={prod.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {prod.certifications.map((c, idx) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold border border-emerald-200">
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Packaging */}
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-700">Packaging Type</td>
                    {comparedProducts.map(prod => (
                      <td key={prod.id} className="p-4 text-[#0F3823] font-semibold">
                        UV Amber Glass Jar (Zero Plastic)
                      </td>
                    ))}
                  </tr>

                  {/* Shelf life */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-bold text-gray-700">Shelf Life</td>
                    {comparedProducts.map(prod => (
                      <td key={prod.id} className="p-4 text-gray-700">
                        {prod.shelfLife}
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="p-4 font-bold text-gray-700">Actions</td>
                    {comparedProducts.map(prod => (
                      <td key={prod.id} className="p-4">
                        <button
                          onClick={() => {
                            addToCart(prod, prod.variants[0], 1);
                          }}
                          className="w-full bg-[#0F3823] hover:bg-[#164E31] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" /> Add to Bag
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
