import mongoose from 'mongoose';
import { Coupon } from '../types';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, required: true },
  description: { type: String, required: true },
  expiresAt: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

export default mongoose.model<Coupon & mongoose.Document>('Coupon', couponSchema);
