import mongoose from 'mongoose';
import { SiteSettings } from '../types';

const siteSettingSchema = new mongoose.Schema({
  branding: {
    brandName: { type: String, default: 'Ladesar' },
    subName: { type: String, default: 'Organics' },
    tagline: { type: String, default: 'Rooted in Purity' },
    logoType: { type: String, default: 'emblem' },
    customLogoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' }
  },
  hero: {
    badgeText: { type: String, default: '100% Certified Organic • Farm-Harvested in Rajasthan' },
    headingLine1: { type: String, default: 'Purity As Nature &' },
    headingLine2: { type: String, default: 'Vedic Wisdom Intended' },
    subtitle: { type: String, default: 'Handcrafted A2 Bilona Desi Ghee, Wood-Pressed Kachi Ghani Mustard Oil, Single-Origin High-Curcumin Spices, and Raw Wild Honey. Packed exclusively in UV-protected glass.' },
    primaryBtnText: { type: String, default: 'Explore Organic Pantry' },
    primaryBtnLink: { type: String, default: 'shop' },
    secondaryBtnText: { type: String, default: 'Consult AI Ayurvedic Vaidya' },
    secondaryBtnLink: { type: String, default: 'ai-advisor' },
    featuredProductImage: { type: String, default: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80' },
    featuredBadge: { type: String, default: 'Vedic Masterpiece' },
    featuredTitle: { type: String, default: 'A2 Bilona Vedic Desi Gir Cow Ghee' },
    featuredDescription: { type: String, default: 'Prepared through the traditional 5-stage Bilona method from curdled A2 Gir cow milk over slow cow dung fire in brass vessels.' },
    featuredPrice: { type: Number, default: 1099 },
    featuredMrp: { type: Number, default: 1299 },
    featuredRating: { type: Number, default: 4.9 },
    featuredReviewsCount: { type: Number, default: 184 },
    featuredLabBadge: { type: String, default: 'NABL Lab Tested' },
    featuredBtnText: { type: String, default: 'Add to Bag' },
    pillars: [{
      title: { type: String },
      subtitle: { type: String },
      iconName: { type: String }
    }]
  },
  announcementBar: {
    enabled: { type: Boolean, default: true },
    text: { type: String, default: '' },
    linkText: { type: String, default: '' },
    linkUrl: { type: String, default: '' }
  }
}, {
  timestamps: true,
  strict: false
});

export default mongoose.model<SiteSettings & mongoose.Document>('SiteSetting', siteSettingSchema);
