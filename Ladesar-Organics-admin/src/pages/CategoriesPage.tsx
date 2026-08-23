import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryItem } from '../types';
import { 
  Tag, 
  ShoppingBag, 
  ArrowRight, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Upload, 
  FolderOpen, 
  FileCheck, 
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CategoriesPage: React.FC = () => {
  const { categories, products, createCategory, updateCategory, deleteCategory, showToast } = useStore();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal Form State
  const [formName, setFormName] = useState('');
  const [formHindi, setFormHindi] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formBadge, setFormBadge] = useState('100% Pure');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [categoryFileName, setCategoryFileName] = useState('');
  const [isDraggingCategoryImg, setIsDraggingCategoryImg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormHindi('');
    setFormSlug('');
    setFormBadge('100% Pure');
    setFormDesc('');
    setFormImage('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80');
    setCategoryFileName('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormHindi(cat.hindiName || '');
    setFormSlug(cat.slug || cat.id);
    setFormBadge(cat.badge || 'Organic');
    setFormDesc(cat.description || '');
    setFormImage(cat.image || '');
    setCategoryFileName('');
    setIsModalOpen(true);
  };

  const processCategoryFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'warning');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size should be less than 8 MB', 'warning');
      return;
    }

    setCategoryFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result?.success || !result?.url) {
        throw new Error(result?.message || 'Upload failed');
      }

      setFormImage(result.url);
      showToast(`Uploaded image: "${file.name}"`, 'success');
    } catch (error: any) {
      console.error('Category image upload failed:', error);
      showToast(error?.message || 'Failed to upload category image', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Category name is required', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const generatedSlug = formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (editingCategory) {
        await updateCategory({
          ...editingCategory,
          name: formName.trim(),
          hindiName: formHindi.trim(),
          slug: generatedSlug,
          badge: formBadge.trim(),
          description: formDesc.trim(),
          image: formImage.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
        });
      } else {
        await createCategory({
          name: formName.trim(),
          hindiName: formHindi.trim(),
          slug: generatedSlug,
          badge: formBadge.trim(),
          description: formDesc.trim(),
          image: formImage.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
          itemsCount: 1,
        });
      }
      setIsModalOpen(false);
    } catch {
      showToast('Failed to save category', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setDeleteTarget(null);
    await deleteCategory(targetId);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-emerald-200">
            <Tag className="w-3 h-3" />
            <span>Storefront Categories & Collections</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
            Categories & Taxonomies
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans-clean">
            Edit homepage organic staples categories, upload custom photo cards (PNG/JPG), and manage Hindi labels.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#D4AF37]/40 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => {
          const liveCount = products.filter(p => p.category === category.slug || p.category === category.id).length;

          return (
            <div
              key={category.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-[#D4AF37] transition-all group flex flex-col justify-between relative"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img
                  src={category.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'}
                  alt={category.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                {category.badge && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                    {category.badge}
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#FAF7F2] truncate">{category.name}</h3>
                  {category.hindiName && (
                    <p className="text-xs text-[#D4AF37] font-serif">{category.hindiName}</p>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 mb-4 leading-relaxed font-sans-clean line-clamp-2">
                  {category.description}
                </p>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-500">
                    <strong className="text-[#0F3823]">{liveCount}</strong> Live Products
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-1.5 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-[#0F3823] transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(category)}
                      className="p-1.5 rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-[#B8860B] flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h3>
                  <p className="text-[11px] text-stone-500">Shown in "Explore Certified Organic Staples" section</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Category English Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. A2 Vedic Desi Ghee"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Category Hindi Label
                  </label>
                  <input
                    type="text"
                    value={formHindi}
                    onChange={(e) => setFormHindi(e.target.value)}
                    placeholder="e.g. वैदिक देसी घी"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Slug / Identifier
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. ghee or cold-pressed-oils"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Card Badge / Pill
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Vedic Bilona, Wood Ghani"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Image Upload Dropzone */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                  Category Photo (Upload PNG / JPG / WebP or URL) *
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processCategoryFile(e.target.files[0]);
                    }
                  }}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                {/* Dropzone Box */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingCategoryImg(true); }}
                  onDragLeave={() => setIsDraggingCategoryImg(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingCategoryImg(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processCategoryFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isDraggingCategoryImg
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
                        {categoryFileName ? `Selected: ${categoryFileName}` : 'Click to Upload Image File'}
                      </p>
                      <p className="text-[10px] text-stone-500">PNG, JPG, WebP (Square ratio recommended)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {formImage && (
                      <img
                        src={formImage}
                        alt="Category Preview"
                        className="w-11 h-11 rounded-xl object-cover border border-stone-200 shadow-xs"
                      />
                    )}
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 font-semibold text-[10px] shadow-xs">
                      Browse
                    </span>
                  </div>
                </div>

                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="Or enter image URL (https://images.unsplash.com/...)"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-[11px] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                  Description Summary
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Traditional Bilona churned curd ghee from grass-fed Gir cows..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer border border-[#D4AF37]/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isSaving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-stone-900">Delete Category?</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to remove <strong className="text-stone-800">"{deleteTarget.name}"</strong> from the catalog?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
