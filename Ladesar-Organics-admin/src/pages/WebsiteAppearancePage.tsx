import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { SiteSettings } from '../types';
import { 
  Palette, 
  Sparkles, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon, 
  Eye, 
  Save, 
  RotateCcw, 
  Check, 
  Leaf, 
  ShieldCheck, 
  Flame, 
  Star, 
  ArrowRight, 
  Upload, 
  Crown, 
  Layout, 
  Sliders, 
  ExternalLink, 
  X, 
  FileCheck, 
  RefreshCw, 
  FolderOpen,
  Tag
} from 'lucide-react';

const PRESET_IMAGES = [
  {
    name: 'A2 Vedic Bilona Ghee',
    url: 'https://images.unsplash.com/photo-1589927986086-3d10fb5555ca?auto=format&fit=crop&w=800&q=80',
    title: 'A2 Bilona Vedic Desi Gir Cow Ghee',
    badge: 'Vedic Masterpiece',
    price: 1099,
    mrp: 1299
  },
  {
    name: 'Wood-Pressed Mustard Oil',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    title: 'Kachi Ghani Cold-Pressed Mustard Oil',
    badge: 'Wood Ghani Pressed',
    price: 349,
    mrp: 420
  },
  {
    name: 'Lakadong Turmeric Powder',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    title: 'Lakadong High-Curcumin Turmeric',
    badge: '8.5% Curcumin Tested',
    price: 220,
    mrp: 270
  },
  {
    name: 'Raw Wild Forest Honey',
    url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    title: 'Raw Multi-Flora Forest Honey',
    badge: 'Unpasteurized & Pure',
    price: 499,
    mrp: 599
  }
];

export const WebsiteAppearancePage: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast } = useStore();

  const [formState, setFormState] = useState<SiteSettings>(siteSettings);
  const [activeTab, setActiveTab] = useState<'branding' | 'hero_text' | 'hero_card' | 'hero_buttons'>('branding');
  const [isSaving, setIsSaving] = useState(false);

  // Logo Upload State
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [logoFileSize, setLogoFileSize] = useState<string>('');
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Hero Card Image Upload State
  const [heroCardFileName, setHeroCardFileName] = useState<string>('');
  const [heroCardFileSize, setHeroCardFileSize] = useState<string>('');
  const [isDraggingHero, setIsDraggingHero] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  // Dirty flag to ensure background polling sync doesn't clobber active edits/uploads
  const isDirtyRef = useRef(false);

  // Sync with siteSettings from store only on initial mount or when user has no unsaved local changes
  useEffect(() => {
    if (!isDirtyRef.current) {
      setFormState(siteSettings);
    }
  }, [siteSettings]);

  // Helper to upload file to backend server or fallback to FileReader
  const uploadImageToServer = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && (data.path || data.url)) {
          return data.path || data.url;
        }
      } else {
        const errData = await res.json().catch(() => null);
        console.warn('Backend upload returned error status:', res.status, errData);
      }
    } catch (err) {
      console.warn('Backend upload request failed, falling back to base64:', err);
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  // Handle Logo File Upload (PNG, JPG, SVG, WebP)
  const processLogoFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, SVG, WebP)', 'warning');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file size should be less than 8 MB', 'warning');
      return;
    }

    isDirtyRef.current = true;
    setLogoFileName(file.name);
    setLogoFileSize((file.size / 1024).toFixed(1) + ' KB');

    const imageUrl = await uploadImageToServer(file);
    setFormState(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        logoType: 'custom_image',
        customLogoUrl: imageUrl,
      }
    }));
    showToast(`Uploaded Logo: "${file.name}"`, 'success');
  };

  // Handle Hero Image File Upload (PNG, JPG, WebP)
  const processHeroFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'warning');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Hero image file size should be under 10 MB', 'warning');
      return;
    }

    isDirtyRef.current = true;
    setHeroCardFileName(file.name);
    setHeroCardFileSize((file.size / 1024).toFixed(1) + ' KB');

    const imageUrl = await uploadImageToServer(file);
    setFormState(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        featuredProductImage: imageUrl,
      }
    }));
    showToast(`Uploaded Hero Image: "${file.name}"`, 'success');
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings(formState);
      isDirtyRef.current = false;
    } catch {
      showToast('Failed to update website appearance', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all website branding and hero banner settings to Vedic defaults?')) {
      isDirtyRef.current = false;
      setFormState(siteSettings);
      setLogoFileName('');
      setLogoFileSize('');
      setHeroCardFileName('');
      setHeroCardFileSize('');
      showToast('Settings reloaded from saved state', 'info');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#B8860B] text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-[#D4AF37]/30">
            <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Storefront Appearance & Hero Customizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
            Website Logo & Hero Section
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans-clean">
            Upload custom logo (PNG/JPG), edit main hero banner headlines, CTA buttons, and showcase product image.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-2xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#0F3823] via-[#164E31] to-[#0F3823] text-[#FAF7F2] font-bold text-xs shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 border border-[#D4AF37]/50 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#D4AF37]" />
            <span>{isSaving ? 'Publishing...' : 'Publish to Live Store'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'branding'
              ? 'bg-[#0F3823] text-white shadow-md font-bold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
        >
          <Crown className="w-4 h-4 text-[#D4AF37]" />
          <span>1. Website Logo & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('hero_text')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'hero_text'
              ? 'bg-[#0F3823] text-white shadow-md font-bold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
        >
          <Type className="w-4 h-4 text-[#D4AF37]" />
          <span>2. Hero Content & Headlines</span>
        </button>

        <button
          onClick={() => setActiveTab('hero_buttons')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'hero_buttons'
              ? 'bg-[#0F3823] text-white shadow-md font-bold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#D4AF37]" />
          <span>3. Hero Action Buttons</span>
        </button>

        <button
          onClick={() => setActiveTab('hero_card')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'hero_card'
              ? 'bg-[#0F3823] text-white shadow-md font-bold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
          <span>4. Hero Featured Visual Card</span>
        </button>

        <Link
          to="/categories"
          className="px-4 py-2.5 rounded-xl text-[#0F3823] hover:bg-emerald-50 transition-all flex items-center gap-1.5 shrink-0 border border-emerald-200 bg-white ml-auto font-bold"
        >
          <Tag className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>Manage Categories Grid ➔</span>
        </Link>
      </div>

      {/* Main Settings Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Settings Controls Form */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* TAB 1: WEBSITE LOGO & BRANDING */}
          {activeTab === 'branding' && (
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#B8860B] flex items-center justify-center font-bold">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">Website Logo & Brand Identity</h3>
                  <p className="text-[11px] text-stone-500">Upload your store logo image (PNG, JPG, SVG) and customize brand name</p>
                </div>
              </div>

              {/* Logo Mode Switcher */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-2">
                  Logo Display Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormState({
                      ...formState,
                      branding: { ...formState.branding, logoType: 'custom_image' }
                    })}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                      formState.branding.logoType === 'custom_image'
                        ? 'border-[#0F3823] bg-[#0F3823]/5 shadow-sm'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900">📁 Upload Custom Logo</span>
                      {formState.branding.logoType === 'custom_image' && <Check className="w-4 h-4 text-[#0F3823]" />}
                    </div>
                    <p className="text-[11px] text-stone-500">Upload PNG, JPG, SVG, or WebP logo file from your computer</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormState({
                      ...formState,
                      branding: { ...formState.branding, logoType: 'emblem' }
                    })}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                      formState.branding.logoType === 'emblem'
                        ? 'border-[#0F3823] bg-[#0F3823]/5 shadow-sm'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900">✨ Vedic Royal Emblem</span>
                      {formState.branding.logoType === 'emblem' && <Check className="w-4 h-4 text-[#0F3823]" />}
                    </div>
                    <p className="text-[11px] text-stone-500">Gold Lotus & Kalash Vector Emblem with typography text</p>
                  </button>
                </div>
              </div>

              {/* DIRECT FILE UPLOADER FOR LOGO */}
              {formState.branding.logoType === 'custom_image' && (
                <div className="space-y-3">
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                    Upload Logo File (PNG / JPG / SVG / WebP) *
                  </label>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processLogoFile(e.target.files[0]);
                      }
                    }}
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                    className="hidden"
                  />

                  {/* Upload Dropzone Box */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
                    onDragLeave={() => setIsDraggingLogo(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingLogo(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        processLogoFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => logoFileInputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                      isDraggingLogo
                        ? 'border-[#0F3823] bg-[#0F3823]/10 scale-[1.01]'
                        : 'border-stone-300 hover:border-[#D4AF37] bg-stone-50/70 hover:bg-amber-50/20'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#B8860B] flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Upload className="w-6 h-6" />
                    </div>

                    <p className="font-bold text-xs text-stone-800">
                      Click to choose image file or drag & drop here
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Supports PNG (with transparent background recommended), JPG, SVG, WebP (Max 8MB)
                    </p>

                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-stone-700 text-[10px] font-semibold border border-stone-200 shadow-xs">
                      <FolderOpen className="w-3 h-3 text-[#B8860B]" />
                      <span>Browse Files from Device</span>
                    </div>
                  </div>

                  {/* Live Uploaded Logo Card Preview */}
                  {formState.branding.customLogoUrl && (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-14 h-14 bg-[#0F3823] rounded-2xl p-1.5 flex items-center justify-center border border-[#D4AF37]/50 shrink-0 shadow-sm">
                          <img
                            src={formState.branding.customLogoUrl}
                            alt="Uploaded Logo"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                            <FileCheck className="w-3.5 h-3.5" />
                            <span className="truncate">{logoFileName || 'Custom Logo File Loaded'}</span>
                          </div>
                          {logoFileSize && <p className="text-[10px] text-stone-500">{logoFileSize}</p>}
                          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Active as Header Logo</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); logoFileInputRef.current?.click(); }}
                          className="px-3 py-1.5 rounded-xl bg-white text-stone-700 font-semibold text-[11px] hover:bg-stone-50 border border-stone-200 cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormState(prev => ({
                              ...prev,
                              branding: { ...prev.branding, customLogoUrl: '' }
                            }));
                            setLogoFileName('');
                            setLogoFileSize('');
                          }}
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Remove Logo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Or Enter Web Link Option */}
                  <details className="text-[11px] text-stone-500 pt-1">
                    <summary className="cursor-pointer font-semibold hover:text-stone-800">Or paste an Image Web URL</summary>
                    <div className="mt-2">
                      <input
                        type="url"
                        value={formState.branding.customLogoUrl || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          branding: { ...formState.branding, customLogoUrl: e.target.value }
                        })}
                        placeholder="https://example.com/logo.png"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </details>
                </div>
              )}

              {/* Brand Typography Details */}
              <div className="space-y-4 text-xs pt-2 border-t border-stone-100">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Brand Main Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.branding.brandName}
                      onChange={(e) => setFormState({
                        ...formState,
                        branding: { ...formState.branding, brandName: e.target.value }
                      })}
                      placeholder="e.g. Ladesar"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37] font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Sub-Brand Label *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.branding.subName}
                      onChange={(e) => setFormState({
                        ...formState,
                        branding: { ...formState.branding, subName: e.target.value }
                      })}
                      placeholder="e.g. Organics"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37] tracking-widest uppercase font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formState.branding.tagline}
                    onChange={(e) => setFormState({
                      ...formState,
                      branding: { ...formState.branding, tagline: e.target.value }
                    })}
                    placeholder="e.g. Rooted in Purity"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: HERO CONTENT & HEADLINES */}
          {activeTab === 'hero_text' && (
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0F3823] flex items-center justify-center font-bold">
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">Hero Section Headlines</h3>
                  <p className="text-[11px] text-stone-500">Edit the prominent text visitors see above the fold</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Top Organic Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={formState.hero.badgeText}
                    onChange={(e) => setFormState({
                      ...formState,
                      hero: { ...formState.hero, badgeText: e.target.value }
                    })}
                    placeholder="e.g. 100% Certified Organic • Farm-Harvested in Rajasthan"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Main Headline Line 1 (White Classical Serif) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.hero.headingLine1}
                    onChange={(e) => setFormState({
                      ...formState,
                      hero: { ...formState.hero, headingLine1: e.target.value }
                    })}
                    placeholder="e.g. Purity As Nature &"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-serif text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Main Headline Line 2 (Vedic Gold Gradient Highlight) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.hero.headingLine2}
                    onChange={(e) => setFormState({
                      ...formState,
                      hero: { ...formState.hero, headingLine2: e.target.value }
                    })}
                    placeholder="e.g. Vedic Wisdom Intended"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-[#B8860B] focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-serif font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Hero Subtitle & Brand Philosophy Summary
                  </label>
                  <textarea
                    rows={4}
                    value={formState.hero.subtitle}
                    onChange={(e) => setFormState({
                      ...formState,
                      hero: { ...formState.hero, subtitle: e.target.value }
                    })}
                    placeholder="Provide a compelling 2-3 sentence Vedic food description..."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HERO ACTION BUTTONS */}
          {activeTab === 'hero_buttons' && (
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#B8860B] flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">Hero Call-To-Action Buttons</h3>
                  <p className="text-[11px] text-stone-500">Configure button labels and target navigation</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Primary Button */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span className="font-bold text-[#0F3823] text-xs">Primary CTA Button (Golden Gradient)</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Button Label Text
                    </label>
                    <input
                      type="text"
                      value={formState.hero.primaryBtnText}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, primaryBtnText: e.target.value }
                      })}
                      placeholder="e.g. Explore Organic Pantry"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Target Link / View Action
                    </label>
                    <input
                      type="text"
                      value={formState.hero.primaryBtnLink}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, primaryBtnLink: e.target.value }
                      })}
                      placeholder="e.g. shop or /products"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Secondary Button */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F3823]" />
                    <span className="font-bold text-stone-800 text-xs">Secondary CTA Button (Glassmorphism)</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Button Label Text
                    </label>
                    <input
                      type="text"
                      value={formState.hero.secondaryBtnText}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, secondaryBtnText: e.target.value }
                      })}
                      placeholder="e.g. Consult AI Ayurvedic Vaidya"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Target Link / Action
                    </label>
                    <input
                      type="text"
                      value={formState.hero.secondaryBtnLink}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, secondaryBtnLink: e.target.value }
                      })}
                      placeholder="e.g. ai-advisor or /consult"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: HERO FEATURED VISUAL CARD */}
          {activeTab === 'hero_card' && (
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0F3823] flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">Hero Featured Showcase Card</h3>
                  <p className="text-[11px] text-stone-500">Upload custom product image or pick from presets</p>
                </div>
              </div>

              {/* DIRECT FILE UPLOADER FOR HERO PRODUCT IMAGE */}
              <div className="space-y-3">
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                  Upload Showcase Product Photo (PNG / JPG / WebP) *
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={heroFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processHeroFile(e.target.files[0]);
                    }
                  }}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                {/* Upload Dropzone Box */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingHero(true); }}
                  onDragLeave={() => setIsDraggingHero(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingHero(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processHeroFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => heroFileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                    isDraggingHero
                      ? 'border-[#0F3823] bg-[#0F3823]/10 scale-[1.01]'
                      : 'border-stone-300 hover:border-[#D4AF37] bg-stone-50/70 hover:bg-amber-50/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0F3823] flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Upload className="w-6 h-6" />
                  </div>

                  <p className="font-bold text-xs text-stone-800">
                    Click to choose photo or drag & drop here
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    PNG, JPG, WebP (High resolution square or 4:3 ratio recommended)
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-stone-700 text-[10px] font-semibold border border-stone-200 shadow-xs">
                    <FolderOpen className="w-3 h-3 text-[#0F3823]" />
                    <span>Upload from Computer / Phone</span>
                  </div>
                </div>

                {heroCardFileName && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <FileCheck className="w-4 h-4" />
                      <span>{heroCardFileName} ({heroCardFileSize})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="text-[11px] text-stone-600 underline font-semibold cursor-pointer"
                    >
                      Replace
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Pick Preset Images */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-2">
                  Or Quick Pick from Vedic Product Presets:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormState({
                          ...formState,
                          hero: {
                            ...formState.hero,
                            featuredProductImage: preset.url,
                            featuredTitle: preset.title,
                            featuredBadge: preset.badge,
                            featuredPrice: preset.price,
                            featuredMrp: preset.mrp,
                          }
                        });
                        setHeroCardFileName('');
                      }}
                      className={`p-2 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        formState.hero.featuredProductImage === preset.url
                          ? 'border-[#0F3823] bg-[#0F3823]/5 font-bold shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div className="overflow-hidden">
                        <p className="text-[11px] text-stone-800 truncate font-semibold">{preset.name}</p>
                        <p className="text-[10px] text-[#B8860B]">₹{preset.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 text-xs pt-2 border-t border-stone-100">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Top Showcase Badge
                    </label>
                    <input
                      type="text"
                      value={formState.hero.featuredBadge}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, featuredBadge: e.target.value }
                      })}
                      placeholder="e.g. Vedic Masterpiece"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Lab Certification Tag
                    </label>
                    <input
                      type="text"
                      value={formState.hero.featuredLabBadge}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, featuredLabBadge: e.target.value }
                      })}
                      placeholder="e.g. NABL Lab Tested"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Showcase Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.hero.featuredTitle}
                    onChange={(e) => setFormState({
                      ...formState,
                      hero: { ...formState.hero, featuredTitle: e.target.value }
                    })}
                    placeholder="e.g. A2 Bilona Vedic Desi Gir Cow Ghee"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Showcase Description Summary
                  </label>
                  <textarea
                    rows={2}
                    value={formState.hero.featuredDescription}
                    onChange={(e) => setFormState({
                      ...formState,
                      hero: { ...formState.hero, featuredDescription: e.target.value }
                    })}
                    placeholder="e.g. Prepared through traditional 5-stage Bilona method..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formState.hero.featuredPrice}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, featuredPrice: Number(e.target.value) }
                      })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={formState.hero.featuredMrp}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, featuredMrp: Number(e.target.value) }
                      })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Rating (⭐)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={1}
                      max={5}
                      value={formState.hero.featuredRating}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, featuredRating: Number(e.target.value) }
                      })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                      Card Button
                    </label>
                    <input
                      type="text"
                      value={formState.hero.featuredBtnText}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, featuredBtnText: e.target.value }
                      })}
                      placeholder="Add to Bag"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Real-Time Storefront Preview */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-xs text-stone-800 uppercase tracking-wider">Live Storefront Preview</span>
            </div>
            <span className="text-[10px] text-stone-400 font-semibold">Updates in real-time</span>
          </div>

          {/* Preview Container simulating Live Storefront */}
          <div className="rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl overflow-hidden bg-[#0F3823] text-white">
            
            {/* Mock Store Header */}
            <div className="bg-[#0A2718] p-4 border-b border-white/10 flex items-center justify-between">
              
              {/* Header Brand Logo Live Preview */}
              <div className="flex items-center gap-2">
                {formState.branding.logoType === 'custom_image' && formState.branding.customLogoUrl ? (
                  <img
                    src={formState.branding.customLogoUrl}
                    alt={formState.branding.brandName}
                    className="h-9 max-w-[150px] object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="font-serif tracking-[0.2em] font-bold text-sm text-[#FAF7F2] uppercase">
                      {formState.branding.brandName}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="h-[1px] w-2 bg-[#D4AF37]" />
                      <span className="text-[8px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                        {formState.branding.subName}
                      </span>
                      <div className="h-[1px] w-2 bg-[#D4AF37]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-white/70">
                <span className="hidden sm:inline">Home</span>
                <span className="hidden sm:inline">Organic Pantry</span>
                <span className="px-2 py-1 rounded-lg bg-[#D4AF37] text-[#0F3823] font-bold">Bag (0)</span>
              </div>
            </div>

            {/* Mock Live Hero Section */}
            <div className="p-6 relative overflow-hidden space-y-6">
              
              {/* Top Organic Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-[#D4AF37]/40 px-3 py-1 rounded-full text-[10px] font-semibold text-[#D4AF37]">
                <Leaf className="w-3 h-3" />
                <span>{formState.hero.badgeText}</span>
              </div>

              {/* Headlines */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight">
                  {formState.hero.headingLine1}
                </h2>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F3E7C4] via-[#D4AF37] to-[#E6CA65] leading-tight">
                  {formState.hero.headingLine2}
                </h2>
              </div>

              {/* Subtitle */}
              <p className="text-xs text-stone-300 leading-relaxed max-w-md">
                {formState.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0F3823] font-bold text-xs shadow-md flex items-center gap-1.5 cursor-default"
                >
                  <span>{formState.hero.primaryBtnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 cursor-default"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{formState.hero.secondaryBtnText}</span>
                </button>
              </div>

              {/* Showcase Featured Card */}
              <div className="mt-6 p-4 rounded-2xl bg-white text-stone-900 border-2 border-[#D4AF37]/60 shadow-xl space-y-3">
                <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src={formState.hero.featuredProductImage}
                    alt={formState.hero.featuredTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#0F3823] text-[#FAF7F2] text-[9px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 text-[#D4AF37]" />
                    <span>{formState.hero.featuredBadge}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-[#B8860B] font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{formState.hero.featuredRating}</span>
                    <span className="text-stone-400 font-normal">({formState.hero.featuredReviewsCount})</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{formState.hero.featuredLabBadge}</span>
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#0F3823] truncate">{formState.hero.featuredTitle}</h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{formState.hero.featuredDescription}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <div>
                    <span className="font-bold text-stone-900 text-sm">₹{formState.hero.featuredPrice}</span>
                    {formState.hero.featuredMrp > formState.hero.featuredPrice && (
                      <span className="text-[10px] text-stone-400 line-through ml-1.5">₹{formState.hero.featuredMrp}</span>
                    )}
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-[#0F3823] text-white font-bold text-[10px]">
                    {formState.hero.featuredBtnText}
                  </span>
                </div>
              </div>

              {/* 3 Pillars Preview */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px]">
                {formState.hero.pillars?.map((p, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="font-bold text-[#D4AF37]">{p.title}</div>
                    <div className="text-stone-300 text-[9px]">{p.subtitle}</div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
