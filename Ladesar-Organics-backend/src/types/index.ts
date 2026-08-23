export type ProductCategory = 
  | 'spices'
  | 'oils'
  | 'ghee'
  | 'pickles'
  | 'honey'
  | 'pulses-flour'
  | 'dry-fruits-seeds'
  | 'herbs-ayurveda'
  | 'tea'
  | 'natural-foods';

export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  mrp: number;
  stock: number;
  sku: string;
}

export interface NutritionFact {
  name: string;
  amount: string;
  dailyValue?: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  userLocation: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface ProductQA {
  id: string;
  question: string;
  askedBy: string;
  date: string;
  answer: string;
  answeredBy: string;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  slug: string;
  category: ProductCategory;
  categoryName: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  variants: ProductVariant[];
  selectedVariantId?: string;
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOrganicCertified?: boolean;
  certifications: string[];
  dietaryTags: string[];
  ingredients: string[];
  ayurvedicBenefits: string[];
  extractionMethod: string;
  nutritionFacts: NutritionFact[];
  storageInstructions: string;
  shelfLife: string;
  countryOfOrigin: string;
  labCertificateBatch?: string;
  fssaiNumber: string;
  frequentlyBoughtTogetherIds?: string[];
  reviews?: ProductReview[];
  faqs?: ProductQA[];
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  description: string;
  expiresAt: string;
  isActive: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  type: 'Home' | 'Work' | 'Other';
}

export type UserAddress = Address;

export type OrderStatus = 'Placed' | 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    variantSize: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }[];
  shippingAddress: Address;
  paymentMethod: 'Razorpay' | 'UPI / PhonePe' | 'Credit / Debit Card' | 'Cash on Delivery' | 'Wallet';
  paymentStatus: 'Paid' | 'Pending' | 'COD';
  transactionId?: string;
  subtotal: number;
  discountAmount: number;
  couponApplied?: string;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  status: OrderStatus;
  estimatedDelivery: string;
  timeline: OrderTimelineItem[];
  customerEmail: string;
  customerPhone: string;
}

export interface Recipe {
  id: string;
  title: string;
  hindiTitle?: string;
  timeMinutes: number;
  prepTime?: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  heroImage: string;
  image?: string;
  description: string;
  ayurvedicBenefits: string;
  ingredients: {
    item: string;
    quantity: string;
    matchedProductId?: string;
    productId?: string;
  }[];
  instructions: string[];
  recommendedProductIds: string[];
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  loyaltyPoints: number;
  referralCode: string;
  addresses: Address[];
  joinedDate: string;
}

export type AdminRole = 'Super Admin' | 'Inventory Manager' | 'Customer Support' | 'Marketing Head' | 'Store Manager';

export interface AdminUser {
  id: string;
  name: string;
  role: AdminRole;
  email: string;
  avatar: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details: string;
}
