import mongoose from 'mongoose';
import { CustomerUser } from '../types';

const customerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String },
  role: { type: String, default: 'Customer' },
  status: { type: String, default: 'Active' },
  walletBalance: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  referralCode: { type: String },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  addresses: [{
    id: { type: String },
    fullName: { type: String },
    phone: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    isDefault: { type: Boolean },
    type: { type: String, enum: ['Home', 'Work', 'Other'] }
  }],
  joinedDate: { type: String },
  lastLogin: { type: String },
  avatarUrl: { type: String }
}, {
  timestamps: true,
});

export default mongoose.model<CustomerUser & mongoose.Document>('Customer', customerSchema);
