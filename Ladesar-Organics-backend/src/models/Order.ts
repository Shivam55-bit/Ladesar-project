import mongoose from 'mongoose';
import { Order } from '../types';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true, unique: true },
  createdAt: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    variantSize: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  shippingAddress: {
    id: { type: String },
    fullName: { type: String },
    phone: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    isDefault: { type: Boolean },
    type: { type: String, enum: ['Home', 'Work', 'Other'] }
  },
  paymentMethod: { type: String, enum: ['Razorpay', 'UPI / PhonePe', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery', 'Wallet'], required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'COD'], required: true },
  transactionId: { type: String },
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, required: true },
  couponApplied: { type: String },
  shippingFee: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'], required: true },
  estimatedDelivery: { type: String, required: true },
  timeline: [{
    status: { type: String, enum: ['Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] },
    timestamp: { type: String },
    description: { type: String },
    completed: { type: Boolean }
  }],
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true }
}, {
  timestamps: true,
});

export default mongoose.model<Order & mongoose.Document>('Order', orderSchema);
