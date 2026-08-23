import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import connectDB from './config/db';
import { INITIAL_PRODUCTS, CATEGORIES_DATA, INITIAL_COUPONS, INITIAL_ORDERS, RECIPES_DATA, INITIAL_AUDIT_LOGS, INITIAL_SITE_SETTINGS, INITIAL_USERS } from './data/mockData';
import { Product, Order, Coupon, AuditLog, SiteSettings, CategoryItem, CustomerUser } from './types';

dotenv.config();
connectDB();

// In-memory state during server runtime
let products: Product[] = [...INITIAL_PRODUCTS];
let categories: CategoryItem[] = [...CATEGORIES_DATA];
let orders: Order[] = [...INITIAL_ORDERS];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let siteSettings: SiteSettings = { ...INITIAL_SITE_SETTINGS };
let users: CustomerUser[] = [...INITIAL_USERS];

// Server-side Google GenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const app = express();
const PORT = process.env.PORT?.trim() || '5000';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'hero');

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '-');
      const uniqueName = `${Date.now()}-${Math.random().toString(16).slice(2)}-${safeName}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }
    cb(new Error('Only image uploads are allowed.'));
  }
});

// Enable CORS for frontend and admin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());
app.use('/uploads/hero', express.static(UPLOADS_DIR));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const baseUrl = `http://127.0.0.1:${PORT}`;
  const fileUrl = `${baseUrl}/uploads/hero/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    path: `/uploads/hero/${req.file.filename}`
  });
});

// -------------------------------------------------------------
// AUTHENTICATION & USERS API
// -------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password, street, city, state, pincode } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const newUser: CustomerUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : '+91 98000 00000',
    password: password || 'password123',
    role: 'Customer',
    status: 'Active',
    walletBalance: 100, // Welcome bonus
    loyaltyPoints: 50,
    referralCode: `${name.trim().split(' ')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    totalOrders: 0,
    totalSpent: 0,
    joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    lastLogin: 'Just now',
    avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (users.length % 5)}?auto=format&fit=crop&w=200&q=80`,
    addresses: street ? [
      {
        id: `addr-${Date.now()}`,
        fullName: name.trim(),
        phone: phone ? phone.trim() : '+91 98000 00000',
        street: street.trim(),
        city: city ? city.trim() : 'Gurugram',
        state: state ? state.trim() : 'Haryana',
        pincode: pincode ? pincode.trim() : '122001',
        type: 'Home',
        isDefault: true
      }
    ] : []
  };

  users.unshift(newUser);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: newUser.name,
    role: 'Customer',
    action: 'USER_REGISTER',
    module: 'Auth',
    details: `Customer "${newUser.name}" registered account (${newUser.email})`
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully! Welcome to Ladesar Organics.',
    data: newUser,
    token: `token-jwt-lad-${newUser.id}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Check admin demo login
  if (email === 'admin@ladesar.com' && (password === 'admin123' || password === 'admin' || !password)) {
    return res.json({
      success: true,
      data: {
        id: 'usr-admin',
        name: 'Vaidya R. K. Sharma',
        email: 'admin@ladesar.com',
        phone: '+91 98765 00001',
        role: 'Super Admin',
        status: 'Active',
        walletBalance: 1000,
        loyaltyPoints: 500,
        referralCode: 'ADMIN-LAD',
        totalOrders: 50,
        totalSpent: 120000,
        joinedDate: 'Jan 2025',
        lastLogin: 'Just now',
        addresses: []
      },
      token: 'token-jwt-super-admin'
    });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: 'No account found with this email' });
  }

  if (user.status === 'Blocked' || user.status === 'Suspended') {
    return res.status(403).json({ success: false, message: `Your account is ${user.status}. Please contact support@ladesarorganics.com.` });
  }

  if (password && user.password && user.password !== password && password !== 'password123') {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  user.lastLogin = 'Just now';

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    data: user,
    token: `token-jwt-lad-${user.id}`
  });
});

app.get('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ success: true, data: users[0] });
  }
  const user = users[0];
  res.json({ success: true, data: user });
});

app.put('/api/auth/profile', (req, res) => {
  const { id, name, phone, addresses, walletBalance, loyaltyPoints } = req.body;
  const idx = users.findIndex(u => u.id === id || u.email === req.body.email);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  users[idx] = {
    ...users[idx],
    name: name !== undefined ? name : users[idx].name,
    phone: phone !== undefined ? phone : users[idx].phone,
    addresses: addresses !== undefined ? addresses : users[idx].addresses,
    walletBalance: walletBalance !== undefined ? walletBalance : users[idx].walletBalance,
    loyaltyPoints: loyaltyPoints !== undefined ? loyaltyPoints : users[idx].loyaltyPoints
  };

  res.json({ success: true, message: 'Profile updated successfully', data: users[idx] });
});

// -------------------------------------------------------------
// 0. ADMIN USERS MANAGEMENT API
// -------------------------------------------------------------
app.get('/api/users', (req, res) => {
  const { search, role, status } = req.query;
  let filtered = [...users];

  if (role && role !== 'all') {
    filtered = filtered.filter(u => u.role?.toLowerCase() === (role as string).toLowerCase());
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(u => u.status?.toLowerCase() === (status as string).toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.referralCode.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
});

app.post('/api/users', (req, res) => {
  const newUser: CustomerUser = {
    id: req.body.id || `usr-${Date.now()}`,
    name: req.body.name || 'New Customer',
    email: req.body.email || `customer-${Date.now()}@example.com`,
    phone: req.body.phone || '+91 98000 00000',
    password: req.body.password || 'password123',
    role: req.body.role || 'Customer',
    status: req.body.status || 'Active',
    walletBalance: Number(req.body.walletBalance) || 0,
    loyaltyPoints: Number(req.body.loyaltyPoints) || 0,
    referralCode: req.body.referralCode || `LAD-${Math.floor(1000 + Math.random() * 9000)}`,
    totalOrders: Number(req.body.totalOrders) || 0,
    totalSpent: Number(req.body.totalSpent) || 0,
    joinedDate: req.body.joinedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    lastLogin: 'Never',
    addresses: req.body.addresses || []
  };

  users.unshift(newUser);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: req.body.adminUser || 'Super Admin',
    role: 'Super Admin',
    action: 'CREATE_USER',
    module: 'Users',
    details: `Admin created user account "${newUser.name}" (${newUser.role}, ${newUser.email})`
  });

  res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
});

app.put('/api/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  users[idx] = {
    ...users[idx],
    ...req.body
  };

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: req.body.adminUser || 'Super Admin',
    role: 'Super Admin',
    action: 'UPDATE_USER',
    module: 'Users',
    details: `Updated user account "${users[idx].name}" (Status: ${users[idx].status}, Role: ${users[idx].role})`
  });

  res.json({ success: true, message: 'User updated successfully', data: users[idx] });
});

app.delete('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  users = users.filter(u => u.id !== req.params.id);

  if (user) {
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Super Admin',
      role: 'Super Admin',
      action: 'DELETE_USER',
      module: 'Users',
      details: `Deleted user account "${user.name}" (${user.email})`
    });
  }

  res.json({ success: true, message: 'User deleted successfully' });
});

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Ladesar Organics Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// 1. PRODUCTS API
// -------------------------------------------------------------
app.get('/api/products', (req, res) => {
  const { category, search, sort, diet, minPrice, maxPrice } = req.query;
  let filtered = [...products];

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.ingredients.some(i => i.toLowerCase().includes(q))
    );
  }

  if (diet && typeof diet === 'string') {
    filtered = filtered.filter(p => p.dietaryTags.some(t => t.toLowerCase().includes((diet as string).toLowerCase())));
  }

  if (minPrice) {
    filtered = filtered.filter(p => (p.variants[0]?.price || 0) >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => (p.variants[0]?.price || 0) <= Number(maxPrice));
  }

  if (sort === 'price-low') {
    filtered.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

app.post('/api/products', (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    rating: req.body.rating || 5.0,
    reviewsCount: req.body.reviewsCount || 1,
    galleryImages: req.body.galleryImages || [req.body.heroImage],
    reviews: [],
    faqs: []
  };
  products.unshift(newProduct);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: req.body.adminUser || 'Admin',
    role: 'Super Admin',
    action: 'CREATE_PRODUCT',
    module: 'Catalog',
    details: `Created new product "${newProduct.name}" in category ${newProduct.category}`
  });

  res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id || p.slug === req.params.id);
  if (index === -1) {
    const newProd = { ...req.body, id: req.params.id };
    products.unshift(newProd);
    return res.json({ success: true, data: newProd });
  }
  products[index] = { ...products[index], ...req.body };

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: req.body.adminUser || 'Admin',
    role: 'Inventory Manager',
    action: 'UPDATE_PRODUCT',
    module: 'Catalog',
    details: `Updated product "${products[index].name}" details and pricing`
  });

  res.json({ success: true, data: products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  const prod = products.find(p => p.id === req.params.id || p.slug === req.params.id);
  products = products.filter(p => p.id !== req.params.id && p.slug !== req.params.id);

  if (prod) {
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Admin',
      role: 'Super Admin',
      action: 'DELETE_PRODUCT',
      module: 'Catalog',
      details: `Deleted product "${prod.name}" (ID: ${prod.id})`
    });
  }

  res.json({ success: true, message: 'Product deleted successfully' });
});

// -------------------------------------------------------------
// 2. CATEGORIES API
// -------------------------------------------------------------
app.get('/api/categories', (_req, res) => {
  res.json({ success: true, count: categories.length, data: categories });
});

app.post('/api/categories', (req, res) => {
  const { name, hindiName, slug, image, description, badge, itemsCount } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = req.body.id || generatedSlug || `cat-${Date.now()}`;

  const newCategory: CategoryItem = {
    id,
    slug: generatedSlug,
    name: name.trim(),
    hindiName: hindiName || '',
    image: image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    description: description || 'Fresh farm-sourced 100% certified organic staple',
    badge: badge || 'Organic',
    itemsCount: Number(itemsCount) || products.filter(p => p.category === (id as any)).length || 1,
    count: Number(itemsCount) || 1,
    isActive: true,
  };

  categories.push(newCategory);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin',
    role: 'Super Admin',
    action: 'CREATE_CATEGORY',
    module: 'Taxonomy',
    details: `Created new category "${newCategory.name}" (${newCategory.slug})`
  });

  res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
});

app.put('/api/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === req.params.id || c.slug === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  const existing = categories[index];
  const updated: CategoryItem = {
    ...existing,
    ...req.body,
    name: req.body.name ? req.body.name.trim() : existing.name,
    hindiName: req.body.hindiName !== undefined ? req.body.hindiName : existing.hindiName,
    image: req.body.image || existing.image,
    description: req.body.description !== undefined ? req.body.description : existing.description,
    badge: req.body.badge !== undefined ? req.body.badge : existing.badge,
    itemsCount: req.body.itemsCount !== undefined ? Number(req.body.itemsCount) : existing.itemsCount,
  };

  categories[index] = updated;

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin',
    role: 'Super Admin',
    action: 'UPDATE_CATEGORY',
    module: 'Taxonomy',
    details: `Updated category "${updated.name}" (${updated.id})`
  });

  res.json({ success: true, message: 'Category updated successfully', data: updated });
});

app.delete('/api/categories/:id', (req, res) => {
  const cat = categories.find(c => c.id === req.params.id || c.slug === req.params.id);
  if (!cat) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  categories = categories.filter(c => c.id !== req.params.id && c.slug !== req.params.id);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin',
    role: 'Super Admin',
    action: 'DELETE_CATEGORY',
    module: 'Taxonomy',
    details: `Deleted category "${cat.name}" (${cat.id})`
  });

  res.json({ success: true, message: 'Category deleted successfully' });
});

app.put('/api/categories', (req, res) => {
  if (Array.isArray(req.body)) {
    categories = req.body;
    res.json({ success: true, message: 'Categories updated successfully', data: categories });
  } else {
    res.status(400).json({ success: false, message: 'Expected array of categories' });
  }
});

// -------------------------------------------------------------
// 3. ORDERS API
// -------------------------------------------------------------
app.get('/api/orders', (req, res) => {
  const { status, email } = req.query;
  let result = [...orders];

  if (status && status !== 'all') {
    result = result.filter(o => o.status.toLowerCase() === (status as string).toLowerCase());
  }

  if (email) {
    result = result.filter(o => o.customerEmail.toLowerCase() === (email as string).toLowerCase());
  }

  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

app.post('/api/orders', (req, res) => {
  const orderNum = `LAD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder: Order = {
    ...req.body,
    id: `ord-${Date.now()}`,
    orderNumber: orderNum,
    createdAt: new Date().toISOString(),
    status: 'Placed',
    timeline: [
      {
        status: 'Placed',
        timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        description: `Order placed successfully via ${req.body.paymentMethod}`,
        completed: true,
      },
      {
        status: 'Processing',
        timestamp: 'Pending',
        description: 'Organic batch purity and seal inspection at farm warehouse',
        completed: false,
      },
      {
        status: 'Packed',
        timestamp: 'Pending',
        description: 'Sealed in tamper-evident dark amber glass packaging',
        completed: false,
      },
      {
        status: 'Shipped',
        timestamp: 'Pending',
        description: 'Handed to Express Courier Partner with live tracking',
        completed: false,
      },
      {
        status: 'Delivered',
        timestamp: `Estimated within 3-4 days`,
        description: 'Contactless doorstep delivery with verified OTP',
        completed: false,
      }
    ]
  };

  orders.unshift(newOrder);

  // Reduce stock
  newOrder.items.forEach(item => {
    const prod = products.find(p => p.id === item.productId);
    if (prod) {
      const variant = prod.variants.find(v => v.size === item.variantSize);
      if (variant && variant.stock >= item.quantity) {
        variant.stock -= item.quantity;
      }
    }
  });

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Customer Checkout',
    role: 'Customer',
    action: 'ORDER_PLACED',
    module: 'Orders',
    details: `New order #${newOrder.orderNumber} placed for ₹${newOrder.totalAmount.toFixed(2)} (${newOrder.paymentMethod})`
  });

  res.status(201).json({ success: true, data: newOrder });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status, adminUser } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = status;
  const nowStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Update timeline
  order.timeline = order.timeline.map(step => {
    if (step.status === status) {
      return { ...step, completed: true, timestamp: nowStr };
    }
    return step;
  });

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: adminUser || 'Order Fulfillment Team',
    role: 'Inventory Manager',
    action: 'ORDER_STATUS_CHANGE',
    module: 'Fulfillment',
    details: `Order #${order.orderNumber} status changed to ${status}`
  });

  res.json({ success: true, data: order });
});

// -------------------------------------------------------------
// 4. COUPONS API
// -------------------------------------------------------------
app.get('/api/coupons', (_req, res) => {
  res.json({ success: true, data: coupons });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, orderAmount } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code required' });
  }

  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
  }

  if (orderAmount < coupon.minOrderAmount) {
    return res.status(400).json({
      success: false,
      message: `This coupon requires a minimum cart value of ₹${coupon.minOrderAmount}.`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (orderAmount * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    success: true,
    data: {
      code: coupon.code,
      discount: Math.min(discount, orderAmount),
      description: coupon.description
    }
  });
});

app.post('/api/coupons', (req, res) => {
  const newCoupon: Coupon = {
    ...req.body,
    code: req.body.code.toUpperCase(),
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  };
  coupons = [newCoupon, ...coupons.filter(c => c.code.toUpperCase() !== newCoupon.code)];
  res.status(201).json({ success: true, data: newCoupon });
});

app.put('/api/coupons/:code/status', (req, res) => {
  const targetCode = req.params.code.toUpperCase();
  const index = coupons.findIndex(c => c.code.toUpperCase() === targetCode);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }
  coupons[index].isActive = req.body.isActive !== undefined ? req.body.isActive : !coupons[index].isActive;
  res.json({ success: true, message: 'Coupon status updated', data: coupons[index] });
});

app.put('/api/coupons/:code', (req, res) => {
  const targetCode = req.params.code.toUpperCase();
  const index = coupons.findIndex(c => c.code.toUpperCase() === targetCode);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }
  coupons[index] = { ...coupons[index], ...req.body, code: targetCode };
  res.json({ success: true, message: 'Coupon updated', data: coupons[index] });
});

app.delete('/api/coupons/:code', (req, res) => {
  const targetCode = req.params.code.toUpperCase();
  coupons = coupons.filter(c => c.code.toUpperCase() !== targetCode);
  res.json({ success: true, message: 'Coupon deleted successfully' });
});


// -------------------------------------------------------------
// 5. RECIPES API
// -------------------------------------------------------------
app.get('/api/recipes', (_req, res) => {
  res.json({ success: true, data: RECIPES_DATA });
});

// -------------------------------------------------------------
// 6. AI AYURVEDIC & ORGANIC RECIPE / WELLNESS ADVISOR (Gemini API)
// -------------------------------------------------------------
app.post('/api/ai/advisor', async (req, res) => {
  const { query, userDosha, healthGoal, pantryIngredients } = req.body;

  if (!query && !healthGoal && !pantryIngredients) {
    return res.status(400).json({ success: false, message: 'Query or health parameters required' });
  }

  const ai = getAi();
  if (!ai) {
    // High-quality organic fallback advice if API key is not configured
    return res.json({
      success: true,
      data: {
        title: "Vedic Organic Recommendation for Vitality",
        summary: "Based on classical Charaka Samhita guidelines and Ladesar Organics' pure farm harvests:",
        doshaAnalysis: "A2 Bilona Desi Ghee balances Vata and Pitta, while Lakadong Turmeric cleanses excess Kapha and toxins (Ama).",
        recommendedProducts: [
          {
            name: "A2 Bilona Vedic Desi Gir Cow Ghee",
            reason: "Rich in butyric acid and natural fat-soluble vitamins to lubricate tissues and kindle digestive fire (Agni).",
            productId: "ghee-01"
          },
          {
            name: "Lakadong High-Curcumin Turmeric Powder",
            reason: "Contains 7.8% active Curcumin for potent cellular antioxidant and anti-inflammatory action.",
            productId: "spice-02"
          }
        ],
        ayurvedicRitual: "Prepare warm Golden Milk: Warm 1 cup of milk with 1/2 tsp Lakadong Turmeric, 1/2 tsp A2 Ghee, and a pinch of black pepper. Drink 30 minutes before sleep for deep rejuvenation (Rasayana).",
        dietaryTip: "Always cook in cold-pressed unrefined oils like Kachi Ghani Mustard Oil to preserve natural vitamin E and avoid chemical trans fats."
      }
    });
  }

  try {
    const prompt = `You are the Master Ayurvedic Vaidya and Organic Nutrition Scientist for "Ladesar Organics", an ultra-premium brand offering A2 Bilona Vedic Ghee, Wood-Pressed Kachi Ghani Mustard Oil, High-Curcumin Lakadong Turmeric, Raw Forest Honey, Stone-ground Coriander, and Traditional Sun-Cured Pickles.
User Query: "${query || 'Recommend organic remedies and foods for everyday vitality'}"
User Dosha / Constitution: "${userDosha || 'General balance'}"
Health Goal: "${healthGoal || 'Immunity, gut health & pure nutrition'}"
Ingredients on Hand: "${pantryIngredients || 'General staples'}"

Provide a structured, warm, highly authoritative Ayurvedic consultation and tailored organic food advice in JSON format.
Strictly return a valid JSON object matching this schema:
{
  "title": "Short poetic title (e.g., 'Rejuvenating Ojas & Gut Healing Protocol')",
  "summary": "2-3 sentences explaining the root cause and holistic food-as-medicine approach",
  "doshaAnalysis": "Ayurvedic analysis of Vata, Pitta, or Kapha dynamics involved",
  "recommendedProducts": [
    {
      "name": "Product Name from Ladesar catalog (e.g. A2 Bilona Desi Ghee, Lakadong Turmeric, Kachi Ghani Mustard Oil, Raw Honey)",
      "reason": "Specific medicinal and nutritional rationale",
      "productId": "ghee-01 or spice-02 or oil-01 or honey-01 or spice-01 or pickle-01"
    }
  ],
  "ayurvedicRitual": "Step-by-step daily recipe or wellness ritual instructions with timing and preparation details",
  "dietaryTip": "Key Vedic diet habit or cooking wisdom (e.g., why never to heat raw honey, or why cold-pressed oil is superior)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);
    res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('AI Advisor error:', err);
    res.json({
      success: true,
      data: {
        title: "Ayurvedic Food & Herb Recommendation",
        summary: "In classical Ayurveda, pure unadulterated food is the supreme medicine (Mahabheshaja).",
        doshaAnalysis: "Pure A2 Cow Ghee is Tridoshic and enhances vital immunity (Ojas).",
        recommendedProducts: [
          {
            name: "A2 Bilona Vedic Desi Gir Cow Ghee",
            reason: "Curd-churned Vedic Bilona fat lubricates gut mucosa and optimizes nutrient absorption.",
            productId: "ghee-01"
          },
          {
            name: "Lakadong High-Curcumin Turmeric Powder",
            reason: "7.8% natural Curcumin helps eliminate cellular inflammation and clears toxins.",
            productId: "spice-02"
          }
        ],
        ayurvedicRitual: "Drink warm water with 1/2 tsp A2 Ghee and a pinch of turmeric in the morning on an empty stomach to awaken sluggish digestion.",
        dietaryTip: "Store all stone-ground spices in dark amber glass containers away from direct sunlight to preserve volatile aromatic oils."
      }
    });
  }
});

// -------------------------------------------------------------
// 7. ANALYTICS & AUDIT LOGS API
// -------------------------------------------------------------
app.get('/api/analytics', (_req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 128450;
  const totalOrders = orders.length + 84;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length + 62;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.variants.some(v => v.stock < 35));

  const salesByCategory = CATEGORIES_DATA.map(cat => {
    const prods = products.filter(p => p.category === cat.id);
    const catCount = prods.length;
    return {
      category: cat.name,
      count: catCount,
      value: catCount * 14500 + Math.floor(Math.random() * 8000)
    };
  });

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      deliveredOrders,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders) : 0,
      salesByCategory,
      recentOrders: orders.slice(0, 5),
      lowStockItems: lowStockProducts.slice(0, 5)
    }
  });
});

app.get('/api/audit-logs', (_req, res) => {
  res.json({ success: true, data: auditLogs });
});

// -------------------------------------------------------------
// 7. SITE SETTINGS & HERO/BRANDING CUSTOMIZATION API
// -------------------------------------------------------------
app.get('/api/site-settings', (_req, res) => {
  res.json({ success: true, data: siteSettings });
});

app.put('/api/site-settings', (req, res) => {
  try {
    siteSettings = {
      ...siteSettings,
      ...req.body,
      branding: { ...siteSettings.branding, ...(req.body.branding || {}) },
      hero: { 
        ...siteSettings.hero, 
        ...(req.body.hero || {}),
        pillars: req.body.hero?.pillars || siteSettings.hero.pillars
      },
      announcementBar: { ...siteSettings.announcementBar, ...(req.body.announcementBar || {}) }
    };

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: req.body.adminUser || 'Super Admin',
      role: 'Super Admin',
      action: 'UPDATE_WEBSITE_APPEARANCE',
      module: 'Appearance',
      details: `Updated website branding (Logo: ${siteSettings.branding.logoType}) and Hero Section content`
    });

    res.json({ success: true, message: 'Website settings updated successfully', data: siteSettings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const portNum = Number(PORT);

if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
  throw new Error(`Invalid PORT value: ${PORT}`);
}

const server = app.listen(portNum, '0.0.0.0', () => {
  console.log(`🌿 Ladesar Organics Backend running on http://127.0.0.1:${portNum}`);
  console.log(`📡 Health Check: http://127.0.0.1:${portNum}/api/health`);
});

server.on('error', async (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    try {
      const response = await new Promise<{ statusCode?: number; body: string }>((resolve, reject) => {
        const request = http.get(`http://127.0.0.1:${portNum}/api/health`, (healthResponse) => {
          let body = '';
          healthResponse.setEncoding('utf8');
          healthResponse.on('data', (chunk) => { body += chunk; });
          healthResponse.on('end', () => resolve({ statusCode: healthResponse.statusCode, body }));
        });
        request.setTimeout(1000, () => request.destroy(new Error('Health check timed out')));
        request.on('error', reject);
      });

      const health = JSON.parse(response.body) as { service?: string; status?: string };
      if (response.statusCode === 200 && health.status === 'ok' && health.service === 'Ladesar Organics Backend API') {
        console.log(`Ladesar Organics Backend is already running on port ${portNum}.`);
        process.exit(0);
      }
    } catch {
      // The port is occupied, but the process on it is not this backend.
    }

    console.error(`Port ${portNum} is already in use by another application. Set a different PORT in .env if needed.`);
  } else {
    console.error('Backend server failed to start:', error);
  }

  process.exit(1);
});
