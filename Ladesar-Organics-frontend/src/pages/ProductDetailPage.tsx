import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductVariant } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { 
  Star, 
  ShieldCheck, 
  Leaf, 
  Heart, 
  SlidersHorizontal, 
  ShoppingBag, 
  Check, 
  Truck, 
  Award, 
  FileText, 
  ChevronRight, 
  Share2, 
  Plus, 
  Minus,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Flame
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare, 
    setLabReportProduct, 
    deliveryPincode, 
    pincodeCity,
    setPincode,
    setView,
    showToast 
  } = useStore();

  const product = products.find(p => p.id === selectedProductId || p.slug === selectedProductId) || products[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product?.variants?.[0] || { id: 'v1', size: 'Standard', price: 299, mrp: 350, stock: 50, sku: 'LAD-STD' }
  );
  const [activeImage, setActiveImage] = useState(product?.heroImage || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'process' | 'ingredients' | 'nutrition' | 'ayurveda' | 'storage'>('process');
  const [isAdded, setIsAdded] = useState(false);

  React.useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
      setActiveImage(product.heroImage);
    }
  }, [product?.id, product?.heroImage]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      name: 'Priya Sharma (Gurugram)',
      rating: 5,
      date: '2 days ago',
      verified: true,
      comment: 'Authentic golden granular texture and heavenly aroma! Reminds me of my grandmother’s kitchen in Rajasthan. True Vedic Bilona quality.'
    },
    {
      id: 'rev-2',
      name: 'Col. Rajesh Verma (New Delhi)',
      rating: 5,
      date: '1 week ago',
      verified: true,
      comment: 'Checked the lab COA online and found 0% chemical residues. It has improved my morning digestion and energy levels tremendously.'
    }
  ]);

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const discountPercent = Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100);

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const bundleProduct = products.find(p => p.id !== product.id) || products[1];

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setView('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !reviewName.trim()) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      name: `${reviewName.trim()} (Verified Buyer)`,
      rating: reviewRating,
      date: 'Just now',
      verified: true,
      comment: reviewComment.trim()
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewComment('');
    setReviewName('');
    showToast('Thank you! Your verified review has been published.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <button onClick={() => setView('home')} className="hover:text-[#0F3823]">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => setView('shop')} className="hover:text-[#0F3823]">{product.categoryName}</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0F3823] font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left 6 Cols: Gallery */}
        <div className="lg:col-span-6 space-y-4 sticky top-28">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#FAF7F2] border-2 border-[#0F3823]/10 shadow-lg group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#B8860B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-xl">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Batch Lab Certified Pure
              </span>
              <button
                onClick={() => setLabReportProduct(product)}
                className="text-[#D4AF37] font-bold hover:underline"
              >
                Inspect COA Report →
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {(product.galleryImages && product.galleryImages.length > 1) && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img ? 'border-[#0F3823] scale-105 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Purity Guarantee Card */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D4AF37]/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0F3823] text-[#D4AF37] flex items-center justify-center font-bold flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs text-[#0F3823]">
              <strong className="block text-sm font-bold">100% Ayurvedic Sincerity Promise</strong>
              Direct from Rajasthan organic clusters. Bottled in heavy-gauge amber glass jars to protect active bio-compounds.
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Details & Buying Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            {/* Category & Ratings row */}
            <div className="flex items-center justify-between mb-2">
              <span className="bg-[#FAF7F2] text-[#0F3823] text-xs font-semibold px-3 py-1 rounded-full border border-[#D4AF37]/30">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#B8860B] font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            {/* Title & Hindi Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F3823] font-serif-luxury leading-tight">
              {product.name}
            </h1>
            {product.hindiName && (
              <div className="text-sm text-[#B8860B] font-serif-luxury mt-1">
                {product.hindiName}
              </div>
            )}

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl sm:text-4xl font-bold text-[#0F3823]">
                ₹{selectedVariant.price}
              </span>
              {selectedVariant.mrp > selectedVariant.price && (
                <span className="text-base text-gray-400 line-through">
                  ₹{selectedVariant.mrp}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs bg-[#B8860B] text-white px-2.5 py-1 rounded-full font-bold">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-1">
              (Price inclusive of all GST taxes • Free shipping eligible)
            </div>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            {product.shortDescription}
          </p>

          {/* Key Ayurvedic Highlights */}
          <div className="space-y-1.5 bg-[#FAF7F2] p-4 rounded-2xl border border-[#0F3823]/10">
            <div className="text-xs font-bold text-[#0F3823] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" /> Key Vedic Benefits:
            </div>
            {product.ayurvedicBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                <Leaf className="w-3.5 h-3.5 text-[#0F3823] flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pack Size Variants Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Select Pack Size / Quantity:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedVariant.id === v.id
                      ? 'border-2 border-[#0F3823] bg-emerald-50/50 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#0F3823]">{v.size}</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">₹{v.price}</div>
                  {v.mrp > v.price && (
                    <div className="text-[10px] text-gray-400 line-through">₹{v.mrp}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper & Main CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              {/* Stepper */}
              <div className="flex items-center border border-gray-300 rounded-2xl bg-white overflow-hidden p-1 flex-shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-bold text-[#0F3823]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 min-w-[150px] ${
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
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Add to Bag (₹{selectedVariant.price * quantity})
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-2xl border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Compare Button */}
                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`p-3.5 rounded-2xl border transition-colors ${
                    isCompared
                      ? 'bg-[#0F3823] text-white border-[#0F3823]'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Compare"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buy Now Full Width */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E6CA65] hover:to-[#D4AF37] text-[#0F3823] py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              Instant 1-Click Buy Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Delivery Pincode Checker Card */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#0F3823]" /> Estimated Delivery:
              </span>
              <span className="text-emerald-700 font-semibold">{pincodeCity}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={deliveryPincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Pincode (6-digits)"
                className="bg-[#FAF7F2] text-xs px-3 py-1.5 rounded-xl border border-gray-200 focus:outline-none w-32 text-center font-bold"
              />
              <span className="text-xs text-gray-500 self-center">
                Order within 3 hrs for <strong>Next-Day Express Dispatch</strong>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. FREQUENTLY BOUGHT TOGETHER BUNDLE */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/50 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-[#0F3823] font-serif-luxury mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B8860B]" /> Frequently Paired Vedic Bundle
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
              <img src={product.heroImage} alt={product.name} className="w-14 h-14 object-cover rounded-xl" />
              <div>
                <div className="text-xs font-bold text-[#0F3823] max-w-[150px] truncate">{product.name}</div>
                <div className="text-xs font-semibold text-gray-800">₹{selectedVariant.price}</div>
              </div>
            </div>

            <span className="text-lg font-bold text-[#0F3823]">+</span>

            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
              <img src={bundleProduct.heroImage} alt={bundleProduct.name} className="w-14 h-14 object-cover rounded-xl" />
              <div>
                <div className="text-xs font-bold text-[#0F3823] max-w-[150px] truncate">{bundleProduct.name}</div>
                <div className="text-xs font-semibold text-gray-800">₹{bundleProduct.variants[0]?.price}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="text-xs text-gray-500">Combo Total:</div>
              <div className="text-lg font-bold text-[#0F3823]">
                ₹{selectedVariant.price + bundleProduct.variants[0]?.price}
              </div>
            </div>
            <button
              onClick={() => {
                addToCart(product, selectedVariant, 1);
                addToCart(bundleProduct, bundleProduct.variants[0], 1);
                showToast('Paired Vedic Bundle added to bag!', 'success');
              }}
              className="bg-[#0F3823] hover:bg-[#164E31] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-md transition-colors"
            >
              Add Both to Bag
            </button>
          </div>
        </div>
      </div>

      {/* 3. TABBED SPECIFICATIONS & AYURVEDIC DETAILS */}
      <div className="bg-white rounded-3xl border border-[#0F3823]/10 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-100 overflow-x-auto bg-[#FAF7F2]/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('process')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'process'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823]'
            }`}
          >
            Vedic Extraction Method
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'ingredients'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823]'
            }`}
          >
            100% Ingredients & Farm
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'nutrition'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823]'
            }`}
          >
            Nutritional Facts
          </button>
          <button
            onClick={() => setActiveTab('ayurveda')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'ayurveda'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823]'
            }`}
          >
            Dosha Balancing
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'storage'
                ? 'bg-[#0F3823] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0F3823]'
            }`}
          >
            Storage & FSSAI Compliance
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {activeTab === 'process' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-[#0F3823] font-serif-luxury">
                Traditional Heritage Processing:
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {product.extractionMethod}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 text-xs">
                  <strong className="block text-[#0F3823] mb-1 font-bold">Zero Heat Friction</strong>
                  Temperature strictly maintained under 40°C to safeguard delicate volatile oils.
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 text-xs">
                  <strong className="block text-[#0F3823] mb-1 font-bold">No Solvent Refining</strong>
                  Free from hexane, bleaching clays, deodorizing steam, or chemical preservatives.
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 text-xs">
                  <strong className="block text-[#0F3823] mb-1 font-bold">UV Amber Glass Jar</strong>
                  Shields sensitive bioactive antioxidants from light oxidation and microplastics.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-[#0F3823] font-serif-luxury">
                Ingredients Declaration:
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FAF7F2] text-[#0F3823] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#0F3823]/20"
                  >
                    🌿 {ing}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                <strong>Origin Country:</strong> {product.countryOfOrigin} (Single estate harvest)
              </p>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="max-w-xl">
              <h3 className="text-base font-bold text-[#0F3823] mb-3">
                Nutritional Values (Per 100g serving):
              </h3>
              <div className="rounded-2xl border border-gray-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-100">
                    {product.nutritionFacts.map((n, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#FAF7F2]/50' : 'bg-white'}>
                        <td className="p-3 font-medium text-gray-700">{n.name}</td>
                        <td className="p-3 font-bold text-[#0F3823] text-right">{n.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ayurveda' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-[#0F3823] font-serif-luxury">
                Ayurvedic Classical Properties:
              </h3>
              <div className="space-y-2">
                {product.ayurvedicBenefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="text-[#B8860B] font-bold">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3 max-w-3xl text-xs text-gray-700">
              <div><strong>Storage Instructions:</strong> {product.storageInstructions}</div>
              <div><strong>Shelf Life:</strong> {product.shelfLife} from date of manufacturing.</div>
              <div><strong>FSSAI Central License:</strong> {product.fssaiNumber}</div>
            </div>
          )}
        </div>
      </div>

      {/* 4. VERIFIED REVIEWS SECTION & FORM */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F3823]/10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-[#0F3823] font-serif-luxury">
              Customer Reviews ({reviewsList.length})
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-[#B8860B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-semibold">5.0 Star Average from 100% Real Customers</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviewsList.map(rev => (
            <div key={rev.id} className="bg-[#FAF7F2]/60 p-4 rounded-2xl border border-gray-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="font-bold text-[#0F3823]">{rev.name}</div>
                <div className="text-gray-400">{rev.date}</div>
              </div>
              <div className="flex text-[#B8860B]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D4AF37]/30 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F3823]">
            Write a Verified Experience Review:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Your Name & City"
              value={reviewName}
              onChange={e => setReviewName(e.target.value)}
              className="bg-white text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
            />
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500">Rating:</span>
              <select
                value={reviewRating}
                onChange={e => setReviewRating(Number(e.target.value))}
                className="text-xs font-bold text-[#0F3823] focus:outline-none bg-transparent"
              >
                <option value={5}>★★★★★ (5/5 Outstanding)</option>
                <option value={4}>★★★★☆ (4/5 Great)</option>
                <option value={3}>★★★☆☆ (3/5 Good)</option>
              </select>
            </div>
          </div>
          <textarea
            rows={2}
            required
            placeholder="How did you enjoy the aroma, taste, and purity?"
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
            className="w-full bg-white text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37] resize-none"
          />
          <button
            type="submit"
            className="bg-[#0F3823] hover:bg-[#164E31] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* 5. RELATED PRODUCTS CAROUSEL */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#0F3823] font-serif-luxury">
            Related Vedic Essentials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
