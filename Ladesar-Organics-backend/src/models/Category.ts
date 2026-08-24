import mongoose from 'mongoose';
import { CategoryItem } from '../types';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hindiName: { type: String },
  count: { type: Number, default: 0 },
  itemsCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  description: { type: String, required: true },
  badge: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

export default mongoose.model<CategoryItem & mongoose.Document>('Category', categorySchema);
