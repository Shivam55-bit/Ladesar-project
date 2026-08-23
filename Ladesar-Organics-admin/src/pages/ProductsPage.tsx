import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink,
  Tag,
  Leaf,
  Layers,
  Image as ImageIcon,
  AlertTriangle,
  Upload,
  FolderOpen,
  FileCheck
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, categories, createProduct, updateProduct, deleteProduct, showToast } = useStore();

  const dynamicCategories = [
    { id: 'all', name: 'All Products', labelHindi: 'सभी उत्पाद' },
    ...(categories || []).map(c => ({
      id: c.slug || c.id,
      name: c.name,
      labelHindi: c.hindiName || ''
    }))
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTargetProduct, setDeleteTargetProduct] = useState<Product | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formHindi, setFormHindi] = useState('');
  const [formCategory, setFormCategory] = useState<string>('spices');
  const [formCategoryName, setFormCategoryName] = useState('Organic Spices');
  const [formPrice, setFormPrice] = useState(399);
  const [formMrp, setFormMrp] = useState(499);
  const [formStock, setFormStock] = useState(50);
  const [formSize, setFormSize] = useState('500 g');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80');
  const [formDietaryTags, setFormDietaryTags] = useState('100% Pure, Zero Chemicals');
  const [productFileName, setProductFileName] = useState('');
  const [isDraggingProductImg, setIsDraggingProductImg] = useState(false);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  const processProductFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'warning');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file size should be less than 8 MB', 'warning');
      return;
    }
    setProductFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFormImage(dataUrl);
      showToast(`Selected image: "${file.name}"`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.hindiName && p.hindiName.includes(searchQuery)) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormHindi('');
    setFormCategory('spices');
    setFormCategoryName('Organic Spices');
    setFormPrice(399);
    setFormMrp(499);
    setFormStock(60);
    setFormSize('500 g');
    setFormDesc('');
    setFormImage('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80');
    setFormDietaryTags('100% Pure, Stone Ground, Certified Organic');
    setProductFileName('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormHindi(product.hindiName || '');
    setFormCategory(product.category);
    setFormCategoryName(product.categoryName);
    setFormPrice(product.variants[0]?.price || 0);
    setFormMrp(product.variants[0]?.mrp || 0);
    setFormStock(product.variants[0]?.stock || 0);
    setFormSize(product.variants[0]?.size || '500 g');
    setFormDesc(product.shortDescription || '');
    setFormImage(product.heroImage || '');
    setFormDietaryTags(product.dietaryTags?.join(', ') || '100% Pure, Certified Organic');
    setProductFileName('');
    setIsModalOpen(true);
  };

  const handleGenerateAiDescription = async () => {
    if (!formName.trim()) {
      showToast('Please enter a product title first to generate AI copy', 'warning');
      return;
    }
    setIsAiGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      setFormDesc(`100% Certified Organic ${formName}. Handcrafted in small batches using traditional Vedic wisdom. Free from synthetic additives, preservatives, or chemical processing. Rich in natural bio-active nutrients and essential prana.`);
      if (!formHindi) {
        setFormHindi(`शुद्ध प्राकृतिक ${formName}`);
      }
      showToast('✨ AI Vedic Description generated successfully', 'success');
    } catch {
      showToast('Failed to generate AI copy', 'error');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const tagsArray = formDietaryTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingProduct) {
      const updatedVariants = editingProduct.variants && editingProduct.variants.length > 0 
        ? [
            {
              ...editingProduct.variants[0],
              size: formSize,
              price: Number(formPrice),
              mrp: Number(formMrp),
              stock: Number(formStock),
            },
            ...editingProduct.variants.slice(1)
          ]
        : [
            {
              id: `var-${Date.now()}`,
              size: formSize,
              price: Number(formPrice),
              mrp: Number(formMrp),
              stock: Number(formStock),
              sku: `LAD-${Date.now().toString().slice(-4)}`
            }
          ];

      const updated: Product = {
        ...editingProduct,
        name: formName.trim(),
        hindiName: formHindi.trim(),
        category: formCategory,
        categoryName: formCategoryName,
        shortDescription: formDesc.trim(),
        heroImage: formImage.trim(),
        dietaryTags: tagsArray.length > 0 ? tagsArray : ['100% Pure'],
        variants: updatedVariants
      };

      await updateProduct(updated);
    } else {
      await createProduct({
        name: formName.trim(),
        hindiName: formHindi.trim(),
        category: formCategory,
        categoryName: formCategoryName,
        shortDescription: formDesc.trim(),
        heroImage: formImage.trim(),
        dietaryTags: tagsArray.length > 0 ? tagsArray : ['100% Pure'],
        variants: [
          {
            id: `var-${Date.now()}`,
            size: formSize,
            price: Number(formPrice),
            mrp: Number(formMrp),
            stock: Number(formStock),
            sku: `LAD-${Date.now().toString().slice(-4)}`
          }
        ]
      });
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetProduct) return;
    const targetId = deleteTargetProduct.id;
    setDeleteTargetProduct(null);
    await deleteProduct(targetId);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-emerald-200">
            <Leaf className="w-3 h-3" />
            <span>Organic Catalog Master</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
            Products Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans-clean">
            Manage Vedic A2 Ghee, cold-pressed oils, stone-ground spices, and pure honey stocks
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0F3823] to-[#164E31] text-[#FAF7F2] font-bold text-xs shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 border border-[#D4AF37]/50 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Publish New Product</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
        
        {/* Dynamic Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {dynamicCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0F3823] text-white shadow-md font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, Hindi name, or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
          />
        </div>

      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="p-4">Product Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Size & SKU</th>
                <th className="p-4">Price / MRP</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Organic Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((product) => {
                const primaryVariant = product.variants[0] || { price: 0, mrp: 0, stock: 0, size: 'N/A', sku: 'N/A' };
                const isLowStock = primaryVariant.stock < 30;

                return (
                  <tr key={product.id} className="hover:bg-stone-50/80 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.heroImage}
                          alt={product.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-stone-200 shadow-sm shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-[#0F3823] transition-colors">
                            {product.name}
                          </p>
                          {product.hindiName && (
                            <p className="text-[11px] text-[#B8860B] font-serif">
                              {product.hindiName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
                        {product.categoryName}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-stone-800">{primaryVariant.size}</p>
                      <p className="text-[10px] font-mono text-stone-400">{primaryVariant.sku}</p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-stone-900 text-sm">₹{primaryVariant.price}</span>
                        {primaryVariant.mrp > primaryVariant.price && (
                          <span className="text-[10px] text-stone-400 line-through">₹{primaryVariant.mrp}</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-bold ${isLowStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {primaryVariant.stock} units
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isLowStock ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, (primaryVariant.stock / 100) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {product.dietaryTags?.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-xl text-stone-600 hover:text-[#0F3823] hover:bg-[#0F3823]/10 transition-colors cursor-pointer border border-transparent hover:border-[#0F3823]/20"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetProduct(product)}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-400">
            No organic products match the selected filters.
          </div>
        )}
      </div>

      {/* In-App Delete Confirmation Modal */}
      {deleteTargetProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden p-6 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Remove Product from Store?
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Are you sure you want to permanently delete <strong className="text-stone-900">"{deleteTargetProduct.name}"</strong>? This will remove it from the catalog and customer storefront.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetProduct(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 bg-[#0F3823] text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#FAF7F2]">
                  {editingProduct ? `Edit "${editingProduct.name}"` : 'Publish New Vedic Product'}
                </h3>
                <p className="text-xs text-white/70">Organic farm specifications & SKU pricing</p>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}
                className="p-1.5 rounded-lg text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. A2 Bilona Desi Gir Cow Ghee"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Hindi Name (देवनागरी)
                  </label>
                  <input
                    type="text"
                    value={formHindi}
                    onChange={(e) => setFormHindi(e.target.value)}
                    placeholder="e.g. वैदिक बिलोना देशी गिर गाय घी"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Product Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormCategory(val);
                      const found = dynamicCategories.find(c => c.id === val);
                      if (found) setFormCategoryName(found.name);
                    }}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  >
                    {dynamicCategories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Variant Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    placeholder="e.g. 500 ml, 1 L, 250 g"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formMrp}
                    onChange={(e) => setFormMrp(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                  Dietary Tags & Badges (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formDietaryTags}
                  onChange={(e) => setFormDietaryTags(e.target.value)}
                  placeholder="e.g. 100% Pure, Vedic Bilona, Wood Pressed, Zero Chemical"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Image Input with File Upload & Live Preview */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                  Product Image (Upload PNG / JPG or Enter URL)
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={productFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processProductFile(e.target.files[0]);
                    }
                  }}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                {/* Dropzone Box */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingProductImg(true); }}
                  onDragLeave={() => setIsDraggingProductImg(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingProductImg(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processProductFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => productFileInputRef.current?.click()}
                  className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isDraggingProductImg
                      ? 'border-[#0F3823] bg-[#0F3823]/10'
                      : 'border-stone-200 hover:border-[#D4AF37] bg-stone-50/80 hover:bg-amber-50/20'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">
                        {productFileName ? `Selected: ${productFileName}` : 'Click to Upload Image File'}
                      </p>
                      <p className="text-[10px] text-stone-500">Supports PNG, JPG, WebP (Max 8MB)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {formImage && (
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-11 h-11 rounded-xl object-cover border border-stone-200 shadow-xs"
                      />
                    )}
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 font-semibold text-[10px] shadow-xs">
                      Browse
                    </span>
                  </div>
                </div>

                {/* Or paste URL */}
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="Or paste image URL (https://images.unsplash.com/...)"
                    className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-[11px] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Short Description with AI Assistance Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                    Short Vedic Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isAiGenerating}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0F3823] hover:text-[#B8860B] cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isAiGenerating ? 'Generating...' : '✨ Generate with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Short health and organic harvesting summary..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F3823] text-white font-bold hover:bg-[#164E31] transition-colors cursor-pointer border border-[#D4AF37]/50"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
