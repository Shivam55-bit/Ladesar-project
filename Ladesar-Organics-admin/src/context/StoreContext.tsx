import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ProductVariant, Coupon, Order, CustomerUser, AdminRole, SiteSettings, CategoryItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_USER, INITIAL_USERS, INITIAL_ORDERS, INITIAL_SITE_SETTINGS, INITIAL_CATEGORIES } from '../data/mockData';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  products: Product[];
  categories: CategoryItem[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  compareList: string[]; // product IDs (max 4)
  user: CustomerUser;
  users: CustomerUser[];
  orders: Order[];
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  siteSettings: SiteSettings;
  discountAmount: number;
  deliveryPincode: string;
  pincodeCity: string;
  isCartOpen: boolean;
  isAiAdvisorOpen: boolean;
  quickViewProduct: Product | null;
  labReportProduct: Product | null;
  activeAdminRole: AdminRole;
  toasts: Toast[];
  currentView: 'home' | 'shop' | 'product-detail' | 'recipes' | 'about' | 'contact' | 'track-order' | 'wishlist' | 'compare' | 'account' | 'checkout' | 'order-success' | 'admin';
  selectedProductId: string | null;
  lastCreatedOrder: Order | null;
  
  // Actions
  setView: (view: StoreContextType['currentView'], productId?: string) => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  setPincode: (code: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsAiAdvisorOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setLabReportProduct: (product: Product | null) => void;
  setActiveAdminRole: (role: AdminRole) => void;
  showToast: (message: string, type?: Toast['type']) => void;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  createProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  createCategory: (cat: Partial<CategoryItem>) => Promise<void>;
  updateCategory: (cat: CategoryItem) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  updateSiteSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  createUser: (userData: Partial<CustomerUser>) => Promise<void>;
  updateUser: (userData: CustomerUser) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  createCoupon: (couponData: Partial<Coupon>) => Promise<void>;
  toggleCouponStatus: (code: string) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
  cartSubtotal: number;

  cartTotal: number;
  freeShippingThreshold: number;
  shippingFee: number;
  taxAmount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const normalizeSiteSettings = (settings: Partial<SiteSettings> | null | undefined): SiteSettings => ({
  ...INITIAL_SITE_SETTINGS,
  ...settings,
  branding: {
    ...INITIAL_SITE_SETTINGS.branding,
    ...(settings?.branding || {})
  },
  hero: {
    ...INITIAL_SITE_SETTINGS.hero,
    ...(settings?.hero || {}),
    pillars: settings?.hero?.pillars || INITIAL_SITE_SETTINGS.hero.pillars
  },
  announcementBar: {
    ...INITIAL_SITE_SETTINGS.announcementBar,
    ...(settings?.announcementBar || {})
  }
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Self-cleaning pass: automatically purge oversized legacy Base64 entries from localStorage to free memory
  try {
    ['lad_site_settings', 'lad_products', 'lad_categories', 'lad_orders', 'lad_users'].forEach(k => {
      const raw = localStorage.getItem(k);
      if (raw && (raw.includes('data:image') || raw.length > 300000)) {
        console.info(`[LocalStorage Purger] Clearing bloated item "${k}" (${(raw.length / 1024).toFixed(1)} KB)`);
        localStorage.removeItem(k);
      }
    });
  } catch {}

  const [products, setProducts] = useState<Product[]>(() => {

    const saved = localStorage.getItem('lad_products');
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(p => 
          p.heroImage?.includes('1589927986086-3d10fb5555ca') || 
          p.heroImage?.includes('1587049352846-4a222e784d38') ||
          (p.id === 'spice-02' && p.heroImage?.includes('1615485290382-441e4d049cb5'))
        )) {
          return INITIAL_PRODUCTS;
        }
        return parsed;
      } catch {}
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('lad_categories');
    if (saved) {
      try {
        const parsed: CategoryItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(c => 
          c.image?.includes('1589927986086-3d10fb5555ca') || 
          c.image?.includes('1587049352846-4a222e784d38') || 
          c.image?.includes('1608797178974-15b35a64a66a')
        )) {
          return INITIAL_CATEGORIES;
        }
        return parsed;
      } catch {}
    }
    return INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lad_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('lad_wishlist');
    return saved ? JSON.parse(saved) : ['ghee-01', 'spice-02'];
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('lad_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<CustomerUser>(() => {
    const saved = localStorage.getItem('lad_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [users, setUsers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem('lad_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lad_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('lad_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('lad_site_settings');
    return normalizeSiteSettings(saved ? JSON.parse(saved) : INITIAL_SITE_SETTINGS);
  });
  const [deliveryPincode, setDeliveryPincode] = useState<string>('122001');
  const [pincodeCity, setPincodeCity] = useState<string>('Gurugram, HR');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [labReportProduct, setLabReportProduct] = useState<Product | null>(null);
  const [activeAdminRole, setActiveAdminRole] = useState<AdminRole>('Super Admin');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentView, setCurrentView] = useState<StoreContextType['currentView']>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Sync to local storage safely without throwing QuotaExceededError
  const safeSetLocalStorage = (key: string, value: any) => {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (err) {
      console.warn(`[LocalStorage] Unable to write key "${key}". Executing emergency cache purge...`, err);
      try {
        ['lad_site_settings', 'lad_products', 'lad_categories', 'lad_orders'].forEach(k => {
          if (k !== key) {
            const item = localStorage.getItem(k);
            if (item && (item.includes('data:image') || item.length > 150000)) {
              localStorage.removeItem(k);
            }
          }
        });
        const retrySerialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, retrySerialized);
      } catch (retryErr) {
        console.warn(`[LocalStorage] Storage recovery failed for "${key}". Continuing safely in-memory.`, retryErr);
      }
    }
  };


  useEffect(() => {
    safeSetLocalStorage('lad_cart', cart);
  }, [cart]);

  useEffect(() => {
    safeSetLocalStorage('lad_wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    safeSetLocalStorage('lad_compare', compareList);
  }, [compareList]);

  useEffect(() => {
    safeSetLocalStorage('lad_orders', orders);
  }, [orders]);

  useEffect(() => {
    safeSetLocalStorage('lad_products', products);
  }, [products]);

  useEffect(() => {
    safeSetLocalStorage('lad_categories', categories);
  }, [categories]);

  useEffect(() => {
    safeSetLocalStorage('lad_users', users);
  }, [users]);

  useEffect(() => {
    safeSetLocalStorage('lad_site_settings', siteSettings);
  }, [siteSettings]);


  // Live Real-Time Synchronizer across Backend API and Frontend
  const refreshAllData = async () => {
    try {
      const [prodRes, catRes, setRes, usrRes, ordRes, coupRes] = await Promise.all([
        fetch('/api/products').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/categories').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/site-settings').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/users').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/orders').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/coupons').then(r => r.ok ? r.json() : null).catch(() => null),
      ]);

      if (prodRes?.success && Array.isArray(prodRes.data)) {
        setProducts(prev => JSON.stringify(prev) === JSON.stringify(prodRes.data) ? prev : prodRes.data);
      }
      if (catRes?.success && Array.isArray(catRes.data)) {
        setCategories(prev => JSON.stringify(prev) === JSON.stringify(catRes.data) ? prev : catRes.data);
      }
      if (setRes?.success && setRes.data) {
        const normalizedSettings = normalizeSiteSettings(setRes.data);
        setSiteSettings(prev => JSON.stringify(prev) === JSON.stringify(normalizedSettings) ? prev : normalizedSettings);
      }
      if (usrRes?.success && Array.isArray(usrRes.data)) {
        setUsers(prev => JSON.stringify(prev) === JSON.stringify(usrRes.data) ? prev : usrRes.data);
      }
      if (ordRes?.success && Array.isArray(ordRes.data)) {
        setOrders(prev => JSON.stringify(prev) === JSON.stringify(ordRes.data) ? prev : ordRes.data);
      }
      if (coupRes?.success && Array.isArray(coupRes.data)) {
        setCoupons(prev => JSON.stringify(prev) === JSON.stringify(coupRes.data) ? prev : coupRes.data);
      }
    } catch {}
  };

  // Sync on Mount, Cross-Tab Broadcast, Tab Focus, and gentle 3s auto-polling
  useEffect(() => {
    refreshAllData();

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('ladesar_sync_channel');
      channel.onmessage = () => {
        refreshAllData();
      };
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('lad_')) {
        refreshAllData();
      }
    };
    window.addEventListener('storage', handleStorage);

    const handleFocus = () => refreshAllData();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    const interval = setInterval(refreshAllData, 3000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
      clearInterval(interval);
    };
  }, []);


  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const setView = (view: StoreContextType['currentView'], productId?: string) => {
    setCurrentView(view);
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const activeVariant = variant || product.variants[0];
    if (!activeVariant) return;

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variant.id === activeVariant.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, variant: activeVariant, quantity }];
      }
    });

    showToast(`Added "${product.name} (${activeVariant.size})" to bag!`, 'success');
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.variant.id === variantId)));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, variantId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId && item.variant.id === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast(`Removed "${prod?.name || 'Item'}" from wishlist`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast(`Saved "${prod?.name || 'Item'}" to your wishlist!`, 'success');
        return [...prev, productId];
      }
    });
  };

  const toggleCompare = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setCompareList(prev => {
      if (prev.includes(productId)) {
        showToast(`Removed from comparison`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 items simultaneously', 'warning');
          return prev;
        }
        showToast(`Added "${prod?.name || 'Item'}" to compare list`, 'success');
        return [...prev, productId];
      }
    });
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount: cartSubtotal }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (found) {
          setAppliedCoupon(found);
          showToast(`Coupon ${found.code} applied!`, 'success');
          return { success: true, message: `Yay! ${found.description}` };
        }
      }
      return { success: false, message: json.message || 'Invalid coupon' };
    } catch {
      // Local check fallback
      const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
      if (found) {
        if (cartSubtotal < found.minOrderAmount) {
          return { success: false, message: `Minimum order amount for ${found.code} is ₹${found.minOrderAmount}` };
        }
        setAppliedCoupon(found);
        showToast(`Coupon ${found.code} applied!`, 'success');
        return { success: true, message: `Applied ${found.description}` };
      }
      return { success: false, message: 'Invalid or expired coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const setPincode = (code: string) => {
    setDeliveryPincode(code);
    if (code.startsWith('11') || code.startsWith('12')) {
      setPincodeCity('Delhi NCR (Next Day Delivery)');
    } else if (code.startsWith('40') || code.startsWith('41')) {
      setPincodeCity('Mumbai / Pune (Express 2-Day)');
    } else if (code.startsWith('56')) {
      setPincodeCity('Bengaluru (Express 2-Day)');
    } else if (code.startsWith('30') || code.startsWith('31') || code.startsWith('32')) {
      setPincodeCity('Rajasthan Direct Farm (Same/Next Day)');
    } else {
      setPincodeCity('All India Express Delivery (3-4 Days)');
    }
    showToast(`Delivery location set to ${code}`, 'success');
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  const freeShippingThreshold = 499;
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 70;

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (cartSubtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  // 5% GST included / calculated on organic groceries
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const taxAmount = Number((taxableAmount * 0.05).toFixed(2));
  const cartTotal = Number((taxableAmount + shippingFee + taxAmount).toFixed(2));

  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const orderPayload = {
      ...orderData,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.heroImage,
        variantSize: item.variant.size,
        unitPrice: item.variant.price,
        quantity: item.quantity,
        total: item.variant.price * item.quantity,
      })),
      subtotal: cartSubtotal,
      discountAmount,
      couponApplied: appliedCoupon?.code,
      shippingFee,
      taxAmount,
      totalAmount: cartTotal,
      customerEmail: user.email,
      customerPhone: user.phone,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const created: Order = data.data;
        setOrders(prev => [created, ...prev]);
        setLastCreatedOrder(created);
        clearCart();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0F3823', '#D4AF37', '#FAF7F2', '#2D6A4F']
        });
        showToast(`Order #${created.orderNumber} placed successfully!`, 'success');
        return created;
      }
    } catch {
      // Fallback
    }

    // Local fallback order creation
    const fallbackOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `LAD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      items: orderPayload.items,
      shippingAddress: orderData.shippingAddress || user.addresses[0],
      paymentMethod: orderData.paymentMethod || 'UPI / PhonePe',
      paymentStatus: 'Paid',
      transactionId: `TXN-${Date.now()}`,
      subtotal: cartSubtotal,
      discountAmount,
      couponApplied: appliedCoupon?.code,
      shippingFee,
      taxAmount,
      totalAmount: cartTotal,
      status: 'Placed',
      estimatedDelivery: '3-4 Business Days',
      timeline: [
        {
          status: 'Placed',
          timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          description: 'Order placed & payment verified',
          completed: true,
        },
        {
          status: 'Processing',
          timestamp: 'Pending',
          description: 'Quality inspection & batch certification',
          completed: false,
        },
        {
          status: 'Packed',
          timestamp: 'Pending',
          description: 'Safely packed in amber glass',
          completed: false,
        },
        {
          status: 'Shipped',
          timestamp: 'Pending',
          description: 'Handed to Express BlueDart Air',
          completed: false,
        },
        {
          status: 'Delivered',
          timestamp: 'Pending',
          description: 'Doorstep delivery with OTP',
          completed: false,
        }
      ],
      customerEmail: user.email,
      customerPhone: user.phone,
    };

    setOrders(prev => [fallbackOrder, ...prev]);
    setLastCreatedOrder(fallbackOrder);
    clearCart();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0F3823', '#D4AF37', '#FAF7F2', '#2D6A4F']
    });
    showToast(`Order #${fallbackOrder.orderNumber} placed successfully!`, 'success');
    return fallbackOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminUser: activeAdminRole }),
      });
    } catch {}

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId || o.orderNumber === orderId) {
          return {
            ...o,
            status,
            timeline: o.timeline.map(t => (t.status === status ? { ...t, completed: true, timestamp: 'Updated just now' } : t)),
          };
        }
        return o;
      })
    );
    showToast(`Order status updated to ${status}`, 'info');
  };

  const broadcastChange = (type: string) => {
    try {
      const channel = new BroadcastChannel('ladesar_sync_channel');
      channel.postMessage({ type, timestamp: Date.now() });
      channel.close();
    } catch {}
    try {
      safeSetLocalStorage('lad_sync_trigger', Date.now().toString());
    } catch {}
  };


  const createProduct = async (productData: Partial<Product>) => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || 'New Organic Product',
      hindiName: productData.hindiName || '',
      slug: (productData.name || 'product').toLowerCase().replace(/\s+/g, '-'),
      category: productData.category || 'spices',
      categoryName: productData.categoryName || 'Organic Spices',
      shortDescription: productData.shortDescription || '',
      description: productData.description || '',
      heroImage: productData.heroImage || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      galleryImages: [productData.heroImage || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
      variants: productData.variants && productData.variants.length > 0 ? productData.variants : [
        { id: `var-${Date.now()}`, size: '500 g', price: 299, mrp: 350, stock: 50, sku: `LAD-${Date.now().toString().slice(-4)}` }
      ],
      rating: 5.0,
      reviewsCount: 1,
      isOrganicCertified: true,
      certifications: ['India Organic', 'Jaivik Bharat', 'Lab Tested 100% Pure'],
      dietaryTags: productData.dietaryTags || ['100% Pure', 'Stone Ground', 'Zero Chemical'],
      ingredients: productData.ingredients || ['100% Pure Organic Ingredients'],
      ayurvedicBenefits: productData.ayurvedicBenefits || ['Balances doshas and revitalizes digestion'],
      extractionMethod: productData.extractionMethod || 'Traditional Stone-Ground & Vedic Cold-Processing',
      nutritionFacts: [{ name: 'Energy', amount: '350 kcal' }],
      storageInstructions: 'Store in cool, dark airtight glass container.',
      shelfLife: '12 Months',
      countryOfOrigin: 'India',
      fssaiNumber: '10021013000451',
    };

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProd, adminUser: activeAdminRole }),
      });
    } catch {}

    setProducts(prev => {
      const next = [newProd, ...prev.filter(p => p.id !== newProd.id)];
      safeSetLocalStorage('lad_products', next);
      return next;
    });
    broadcastChange('PRODUCTS_UPDATED');
    showToast(`Published product "${newProd.name}"`, 'success');
  };

  const updateProduct = async (prod: Product) => {
    try {
      await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prod, adminUser: activeAdminRole }),
      });
    } catch {}

    setProducts(prev => {
      const next = prev.map(p => (p.id === prod.id ? prod : p));
      safeSetLocalStorage('lad_products', next);
      return next;
    });
    broadcastChange('PRODUCTS_UPDATED');
    showToast(`Saved changes for "${prod.name}"`, 'success');
  };

  const deleteProduct = async (productId: string) => {
    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    } catch {}

    setProducts(prev => {
      const next = prev.filter(p => p.id !== productId);
      safeSetLocalStorage('lad_products', next);
      return next;
    });
    broadcastChange('PRODUCTS_UPDATED');
    showToast('Product removed from catalog', 'info');
  };


  const createCategory = async (cat: Partial<CategoryItem>) => {
    const slug = cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
    const newCat: CategoryItem = {
      id: cat.id || slug,
      slug,
      name: cat.name || 'New Category',
      hindiName: cat.hindiName || '',
      image: cat.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      description: cat.description || '100% Certified pure farm organic staple',
      badge: cat.badge || 'Organic',
      itemsCount: cat.itemsCount || 1,
      count: cat.itemsCount || 1,
      isActive: true,
    };

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat),
      });
    } catch {}

    setCategories(prev => {
      const next = [...prev, newCat];
      safeSetLocalStorage('lad_categories', next);
      return next;
    });
    broadcastChange('CATEGORIES_UPDATED');
    showToast(`Created category "${newCat.name}"`, 'success');
  };

  const updateCategory = async (cat: CategoryItem) => {
    try {
      await fetch(`/api/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
    } catch {}

    setCategories(prev => {
      const next = prev.map(c => (c.id === cat.id ? cat : c));
      safeSetLocalStorage('lad_categories', next);
      return next;
    });
    broadcastChange('CATEGORIES_UPDATED');
    showToast(`Updated category "${cat.name}"`, 'success');
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
    } catch {}

    setCategories(prev => {
      const next = prev.filter(c => c.id !== categoryId);
      safeSetLocalStorage('lad_categories', next);
      return next;
    });
    broadcastChange('CATEGORIES_UPDATED');
    showToast('Category removed successfully', 'info');
  };

  const updateSiteSettings = async (newSettings: Partial<SiteSettings>) => {
    const merged: SiteSettings = {
      ...siteSettings,
      ...newSettings,
      branding: { ...siteSettings.branding, ...(newSettings.branding || {}) },
      hero: { 
        ...siteSettings.hero, 
        ...(newSettings.hero || {}),
        pillars: newSettings.hero?.pillars || siteSettings.hero.pillars
      },
      announcementBar: { ...siteSettings.announcementBar, ...(newSettings.announcementBar || {}) }
    };

    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...merged, adminUser: activeAdminRole }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSiteSettings(json.data);
          safeSetLocalStorage('lad_site_settings', json.data);
          broadcastChange('SETTINGS_UPDATED');
          showToast('✨ Website Logo & Hero Section updated and published live!', 'success');
          return;
        }
      }
    } catch (e) {
      console.warn('Backend site settings sync failed, saved locally', e);
    }

    setSiteSettings(merged);
    safeSetLocalStorage('lad_site_settings', merged);
    broadcastChange('SETTINGS_UPDATED');
    showToast('✨ Website Logo & Hero Section updated and published live!', 'success');
  };


  const createUser = async (userData: Partial<CustomerUser>) => {
    const newUser: CustomerUser = {
      id: userData.id || `usr-${Date.now()}`,
      name: userData.name || 'New Customer',
      email: userData.email || `customer-${Date.now()}@example.com`,
      phone: userData.phone || '+91 98000 00000',
      password: userData.password || 'password123',
      role: userData.role || 'Customer',
      status: userData.status || 'Active',
      walletBalance: Number(userData.walletBalance) || 0,
      loyaltyPoints: Number(userData.loyaltyPoints) || 0,
      referralCode: userData.referralCode || `LAD-${Math.floor(1000 + Math.random() * 9000)}`,
      totalOrders: Number(userData.totalOrders) || 0,
      totalSpent: Number(userData.totalSpent) || 0,
      joinedDate: userData.joinedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastLogin: 'Never',
      addresses: userData.addresses || []
    };

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, adminUser: activeAdminRole }),
      });
    } catch (e) {
      console.warn('Backend user create failed, saved locally', e);
    }

    setUsers(prev => [newUser, ...prev]);
    safeSetLocalStorage('lad_users', [newUser, ...users]);
    broadcastChange('USER_CREATED');
    showToast(`Created user account for "${newUser.name}"`, 'success');
  };

  const updateUser = async (userData: CustomerUser) => {
    try {
      await fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, adminUser: activeAdminRole }),
      });
    } catch (e) {
      console.warn('Backend user update failed, saved locally', e);
    }

    setUsers(prev => prev.map(u => (u.id === userData.id ? userData : u)));
    safeSetLocalStorage('lad_users', users.map(u => (u.id === userData.id ? userData : u)));
    broadcastChange('USER_UPDATED');
    showToast(`Updated user account "${userData.name}"`, 'success');
  };

  const deleteUser = async (userId: string) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Backend user delete failed, saved locally', e);
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    safeSetLocalStorage('lad_users', users.filter(u => u.id !== userId));
    broadcastChange('USER_DELETED');
    showToast('User account deleted from directory', 'info');
  };


  const toggleUserStatus = async (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const newStatus: CustomerUser['status'] = target.status === 'Active' ? 'Suspended' : 'Active';
    const updated = { ...target, status: newStatus };
    await updateUser(updated);
  };

  const createCoupon = async (couponData: Partial<Coupon>) => {
    const newCoupon: Coupon = {
      code: (couponData.code || `LAD${Math.floor(100 + Math.random() * 900)}`).toUpperCase().trim(),
      discountType: couponData.discountType || 'percentage',
      discountValue: Number(couponData.discountValue) || 10,
      minOrderAmount: Number(couponData.minOrderAmount) || 0,
      description: couponData.description || 'Special Discount Offer',
      expiresAt: couponData.expiresAt || '2026-12-31',
      isActive: true,
    };

    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
    } catch (e) {
      console.warn('Backend coupon create failed, saved locally', e);
    }

    setCoupons(prev => {
      const next = [newCoupon, ...prev.filter(c => c.code.toUpperCase() !== newCoupon.code.toUpperCase())];
      safeSetLocalStorage('lad_coupons', next);
      return next;
    });
    broadcastChange('COUPONS_UPDATED');
    showToast(`Created promo code "${newCoupon.code}"`, 'success');
  };

  const toggleCouponStatus = async (code: string) => {
    try {
      await fetch(`/api/coupons/${code}/status`, {
        method: 'PUT',
      });
    } catch (e) {
      console.warn('Backend coupon status update failed, saved locally', e);
    }

    setCoupons(prev => {
      const next = prev.map(c => c.code.toUpperCase() === code.toUpperCase() ? { ...c, isActive: !c.isActive } : c);
      safeSetLocalStorage('lad_coupons', next);
      return next;
    });
    broadcastChange('COUPONS_UPDATED');
    showToast(`Coupon status updated`, 'info');
  };

  const deleteCoupon = async (code: string) => {
    try {
      await fetch(`/api/coupons/${code}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Backend coupon delete failed, saved locally', e);
    }

    setCoupons(prev => {
      const next = prev.filter(c => c.code.toUpperCase() !== code.toUpperCase());
      safeSetLocalStorage('lad_coupons', next);
      return next;
    });
    broadcastChange('COUPONS_UPDATED');
    showToast(`Deleted coupon "${code}"`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        compareList,
        user,
        users,
        orders,
        coupons,
        appliedCoupon,
        siteSettings,
        discountAmount,
        deliveryPincode,
        pincodeCity,
        isCartOpen,
        isAiAdvisorOpen,
        quickViewProduct,
        labReportProduct,
        activeAdminRole,
        toasts,
        currentView,
        selectedProductId,
        lastCreatedOrder,
        setView,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        toggleCompare,
        applyCoupon,
        removeCoupon,
        setPincode,
        setIsCartOpen,
        setIsAiAdvisorOpen,
        setQuickViewProduct,
        setLabReportProduct,
        setActiveAdminRole,
        showToast,
        placeOrder,
        updateOrderStatus,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        updateSiteSettings,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        createCoupon,
        toggleCouponStatus,
        deleteCoupon,
        cartSubtotal,
        cartTotal,
        freeShippingThreshold,
        shippingFee,
        taxAmount,
      }}
    >
      {children}

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium border transition-all transform translate-y-0 ${
              t.type === 'success'
                ? 'bg-[#0F3823] text-[#FAF7F2] border-[#D4AF37]/40 shadow-[#0F3823]/30'
                : t.type === 'warning'
                ? 'bg-[#8B5A00] text-white border-amber-400/40'
                : t.type === 'error'
                ? 'bg-rose-900 text-white border-rose-500/40'
                : 'bg-[#1C2826] text-white border-gray-700'
            }`}
          >
            <span className="text-base">
              {t.type === 'success' ? '🌿' : t.type === 'warning' ? '⚠️' : t.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
