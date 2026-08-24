import mongoose from 'mongoose';
import { Product } from '../types';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hindiName: { type: String },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  categoryName: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  heroImage: { type: String, required: true },
  galleryImages: [{ type: String }],
  variants: [{
    id: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    stock: { type: Number, required: true },
    sku: { type: String, required: true }
  }],
  selectedVariantId: { type: String },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isOrganicCertified: { type: Boolean, default: true },
  certifications: [{ type: String }],
  dietaryTags: [{ type: String }],
  ingredients: [{ type: String }],
  ayurvedicBenefits: [{ type: String }],
  extractionMethod: { type: String },
  nutritionFacts: [{
    name: { type: String, required: true },
    amount: { type: String, required: true },
    dailyValue: { type: String }
  }],
  storageInstructions: { type: String },
  shelfLife: { type: String },
  countryOfOrigin: { type: String },
  labCertificateBatch: { type: String },
  fssaiNumber: { type: String },
  frequentlyBoughtTogetherIds: [{ type: String }],
  reviews: [{
    id: { type: String },
    userName: { type: String },
    userLocation: { type: String },
    rating: { type: Number },
    date: { type: String },
    title: { type: String },
    comment: { type: String },
    verifiedPurchase: { type: Boolean },
    helpfulCount: { type: Number }
  }],
  faqs: [{
    id: { type: String },
    question: { type: String },
    askedBy: { type: String },
    date: { type: String },
    answer: { type: String },
    answeredBy: { type: String }
  }]
}, {
  timestamps: true,
});

export default mongoose.model<Product & mongoose.Document>('Product', productSchema);
