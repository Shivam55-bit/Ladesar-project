import mongoose from 'mongoose';
import { SiteSettings } from '../types';

const siteSettingSchema = new mongoose.Schema({
  branding: {
    brandName: { type: String, required: true },
    subName: { type: String, required: true },
    tagline: { type: String, required: true },
    logoType: { type: String, enum: ['emblem', 'custom_image'], required: true },
    customLogoUrl: { type: String },
    faviconUrl: { type: String }
  },
  hero: {
    badgeText: { type: String, required: true },
    headingLine1: { type: String, required: true },
    headingLine2: { type: String, required: true },
    subtitle: { type: String, required: true },
    primaryBtnText: { type: String, required: true },
    primaryBtnLink: { type: String, required: true },
    secondaryBtnText: { type: String, required: true },
    secondaryBtnLink: { type: String, required: true },
    featuredProductImage: { type: String, required: true },
    featuredBadge: { type: String, required: true },
    featuredTitle: { type: String, required: true },
    featuredDescription: { type: String, required: true },
    featuredPrice: { type: Number, required: true },
    featuredMrp: { type: Number, required: true },
    featuredRating: { type: Number, required: true },
    featuredReviewsCount: { type: Number, required: true },
    featuredLabBadge: { type: String, required: true },
    featuredBtnText: { type: String, required: true },
    pillars: [{
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      iconName: { type: String, enum: ['Leaf', 'RotateCcw', 'ShieldCheck', 'Flame', 'Sparkles'], required: true }
    }]
  },
  announcementBar: {
    enabled: { type: Boolean },
    text: { type: String },
    linkText: { type: String },
    linkUrl: { type: String }
  }
}, {
  timestamps: true,
});

export default mongoose.model<SiteSettings & mongoose.Document>('SiteSetting', siteSettingSchema);
