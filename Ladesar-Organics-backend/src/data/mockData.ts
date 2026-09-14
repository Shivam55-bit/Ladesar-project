import { Product, Coupon, Recipe, CustomerUser, Order, AuditLog, CategoryItem } from '../types';

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'ghee',
    slug: 'ghee',
    name: 'A2 Vedic Desi Ghee',
    hindiName: 'वैदिक देसी घी',
    count: 4,
    itemsCount: 4,
    image: '/images/categories/dasi-ghee-category.png',
    description: 'Traditional Bilona churned curd ghee from grass-fed Gir cows',
    badge: 'Vedic Bilona',
    isActive: true,
  },
  {
    id: 'oils',
    slug: 'oils',
    name: 'Cold-Pressed Oils',
    hindiName: 'कच्ची घानी तेल',
    count: 6,
    itemsCount: 6,
    image: '/images/categories/cold-pressed-oil-category.png',
    description: 'Wood-pressed kachi ghani unrefined pure edible oils',
    badge: 'Wood Ghani',
    isActive: true,
  },
  {
    id: 'spices',
    slug: 'spices',
    name: 'Stone-Ground Spices',
    hindiName: 'शुद्ध मसाले',
    count: 12,
    itemsCount: 12,
    image: '/images/categories/ground-spices-category.png',
    description: 'Slow ground at low temperature to retain essential volatile oils',
    badge: '100% Pure',
    isActive: true,
  },
  {
    id: 'pickles',
    slug: 'pickles',
    name: 'Artisanal Pickles & Chutneys',
    hindiName: 'पारंपरिक अचार',
    count: 5,
    itemsCount: 5,
    image: '/images/categories/pickels-category.png',
    description: 'Sun-matured in cold pressed mustard oil with no vinegar or chemicals',
    badge: 'Sun-Cured',
    isActive: true,
  },
  {
    id: 'honey',
    slug: 'honey',
    name: 'Raw Forest Honey',
    hindiName: 'शुद्ध शहद',
    count: 3,
    itemsCount: 3,
    image: '/images/categories/Honey-category.png',
    description: 'Unfiltered, unpasteurized natural multifloral and single-flora honey',
    badge: 'Raw & Wild',
    isActive: true,
  },
  {
    id: 'pulses-flour',
    slug: 'pulses-flour',
    name: 'Organic Pulses & Flour',
    hindiName: 'दालें और आटा',
    count: 8,
    itemsCount: 8,
    image: '/images/categories/pules-category.png',
    description: 'Unpolished traditional heirloom grains and stone-milled flours',
    badge: 'Unpolished',
    isActive: true,
  },
  {
    id: 'dry-fruits-seeds',
    slug: 'dry-fruits-seeds',
    name: 'Dry Fruits & Seeds',
    hindiName: 'मेवे और बीज',
    count: 7,
    itemsCount: 7,
    image: '/images/categories/dry-fruit-category.png',
    description: 'Hand-picked Kashmiri walnuts, Mamra almonds and raw super seeds',
    badge: 'Grade A1',
    isActive: true,
  },
  {
    id: 'herbs-ayurveda',
    slug: 'herbs-ayurveda',
    name: 'Ayurvedic Wellness',
    hindiName: 'आयुर्वेदिक औषधियां',
    count: 6,
    itemsCount: 6,
    image: '/images/categories/Ayurvedic-wellness-category.png',
    description: 'Certified single-origin Ashwagandha, Triphala and pure Tulsi drops',
    badge: 'GMP Certified',
    isActive: true,
  },
];

export const INITIAL_CATEGORIES = CATEGORIES_DATA;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'ghee-01',
    name: 'A2 Bilona Vedic Desi Gir Cow Ghee',
    hindiName: 'ए2 बिलोना वैदिक देसी गाय का घी',
    slug: 'a2-bilona-vedic-desi-gir-cow-ghee',
    category: 'ghee',
    categoryName: 'A2 Vedic Desi Ghee',
    shortDescription: 'Hand-churned from curd of free-grazing Indian Gir cows using the ancient Vedic Bilona method.',
    description: 'Ladesar Organics A2 Desi Cow Ghee is prepared using the traditional 5-step Vedic Bilona method. Free-grazing Gir cows feed on natural organic pastures. Fresh milk is boiled in clay pots, naturally cultured into curd, and hand-churned with bi-directional wooden churners (Bilona). The extracted butter (Makkhan) is then slow-simmered over low firewood flames in copper vessels until golden, fragrant, and grainy. Rich in A2 beta-casein, butyric acid, and essential fat-soluble vitamins (A, D, E, K).',
    heroImage: '/images/products/Gir-Cow-Ghee-product.png',
    galleryImages: [
      '/images/products/Gir-Cow-Ghee-product.png',
      'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'ghee-v1', size: '500 ml Glass Jar', price: 1099, mrp: 1299, stock: 45, sku: 'LAD-GHE-500' },
      { id: 'ghee-v2', size: '1000 ml Glass Jar', price: 2099, mrp: 2499, stock: 32, sku: 'LAD-GHE-1000' },
      { id: 'ghee-v3', size: '5 Litre Family Pack', price: 9800, mrp: 11500, stock: 12, sku: 'LAD-GHE-5000' },
    ],
    selectedVariantId: 'ghee-v1',
    rating: 4.9,
    reviewsCount: 184,
    isBestSeller: true,
    isOrganicCertified: true,
    certifications: ['India Organic', 'Jaivik Bharat', 'FSSAI Certified', 'Lab Tested 100% Pure'],
    dietaryTags: ['Vedic Bilona', '100% Grass-Fed', 'A2 Beta-Casein', 'Non-GMO', 'No Preservatives'],
    ingredients: ['100% Pure Cultured A2 Desi Gir Cow Milk Fat'],
    ayurvedicBenefits: [
      'Balances Vata & Pitta doshas naturally',
      'Nourishes brain cells and enhances Ojas (vital energy)',
      'Promotes digestive agni and gut lining health',
      'Lubricates joints and improves skin luminosity'
    ],
    extractionMethod: '5-Step Ancient Vedic Curd Churning (Bilona) in Wooden Churns & Slow Simmered in Brass/Copper',
    nutritionFacts: [
      { name: 'Energy', amount: '899 kcal', dailyValue: '45%' },
      { name: 'Total Fat', amount: '99.8 g', dailyValue: '128%' },
      { name: 'Saturated Fat', amount: '64.5 g', dailyValue: '320%' },
      { name: 'Monounsaturated Fat', amount: '28.2 g' },
      { name: 'Omega-3 Fatty Acids', amount: '380 mg' },
      { name: 'Vitamin A', amount: '3000 IU', dailyValue: '60%' },
      { name: 'Cholesterol', amount: '220 mg' }
    ],
    storageInstructions: 'Store in a cool, dark and dry place. Keep jar tightly sealed. Do not use wet spoon. No refrigeration needed.',
    shelfLife: '12 Months from packing date',
    countryOfOrigin: 'India (Rajasthan & Gujarat Organic Farms)',
    labCertificateBatch: 'LAB-LAD-2026-G84',
    fssaiNumber: '10021013000451',
    frequentlyBoughtTogetherIds: ['spice-02', 'spice-01', 'oil-01'],
    reviews: [
      {
        id: 'r1',
        userName: 'Pooja Sharma',
        userLocation: 'Jaipur, Rajasthan',
        rating: 5,
        date: '14 May 2026',
        title: 'Authentic Daadi ke haath ka swaad!',
        comment: 'The aroma when opening the bottle is heavenly! Golden granulated texture that melts instantly on warm rotis. You can truly tell this is authentic Bilona ghee without adulteration.',
        verifiedPurchase: true,
        helpfulCount: 42
      },
      {
        id: 'r2',
        userName: 'Dr. Arvind Mehra',
        userLocation: 'Bengaluru, Karnataka',
        rating: 5,
        date: '02 June 2026',
        title: 'Outstanding purity and digestibility',
        comment: 'As an Ayurvedic practitioner, I recommend Ladesar A2 Ghee to my patients for gut healing and memory support. Excellent quality packaging in dark glass.',
        verifiedPurchase: true,
        helpfulCount: 29
      }
    ],
    faqs: [
      {
        id: 'q1',
        question: 'Is this ghee made from direct cream or cultured curd?',
        askedBy: 'Vikas R.',
        date: '2026-04-10',
        answer: 'Ladesar A2 Ghee is 100% made from cultured curd (Dahi) using the traditional Vedic Bilona method, never from direct industrial milk cream.',
        answeredBy: 'Ladesar Quality Team'
      }
    ]
  },
  {
    id: 'oil-01',
    name: 'Kachi Ghani Cold-Pressed Mustard Oil (Wood Pressed)',
    hindiName: 'कच्ची घानी लकड़ी का कोहलू सरसों का तेल',
    slug: 'kachi-ghani-cold-pressed-mustard-oil',
    category: 'oils',
    categoryName: 'Cold-Pressed Oils',
    shortDescription: 'Extracted at ambient temperature using traditional wooden Kohlu presses to retain pungent aroma and natural antioxidants.',
    description: 'Our Kachi Ghani Mustard Oil is pressed from selectively harvested, pesticide-free black and yellow organic mustard seeds. Extracted slowly at low temperature (under 40°C) in wooden Kolhus without any chemical refinement, argemone oil, or artificial pungent additives. Delivers the authentic spicy pungency (allyl isothiocyanate) and deep golden clarity prized in North and East Indian heritage cuisine.',
    heroImage: '/images/products/Mustard-Oil-product.png',
    galleryImages: [
      '/images/products/Mustard-Oil-product.png',
      'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'oil-v1', size: '1 Litre Glass Bottle', price: 349, mrp: 420, stock: 80, sku: 'LAD-OIL-MUS-1L' },
      { id: 'oil-v2', size: '5 Litre Tin Canister', price: 1650, mrp: 1950, stock: 24, sku: 'LAD-OIL-MUS-5L' },
    ],
    selectedVariantId: 'oil-v1',
    rating: 4.8,
    reviewsCount: 142,
    isBestSeller: true,
    isOrganicCertified: true,
    certifications: ['India Organic', 'Jaivik Bharat', 'Zero Argemone Tested', 'Cold Pressed'],
    dietaryTags: ['Wood Pressed', 'Unrefined', 'Zero Cholesterol', 'Rich in MUFA', 'Heart Healthy'],
    ingredients: ['100% Pure Certified Organic Mustard Seeds'],
    ayurvedicBenefits: [
      'Stimulates digestion and warms the bodily channels (Deepana & Pachana)',
      'Rich in Alpha-Linolenic Acid (ALA) supporting cardiovascular wellness',
      'Natural antimicrobial and antifungal properties for traditional pickles and cooking'
    ],
    extractionMethod: 'Single cold pressing in wooden churner (Lakdi Kohlu) at under 38°C, naturally gravity filtered through cotton cloth.',
    nutritionFacts: [
      { name: 'Energy', amount: '884 kcal', dailyValue: '44%' },
      { name: 'Monounsaturated Fat (MUFA)', amount: '62.5 g' },
      { name: 'Polyunsaturated Fat (PUFA)', amount: '22.0 g' },
      { name: 'Saturated Fat', amount: '11.5 g' },
      { name: 'Omega-3', amount: '10.2 g' },
      { name: 'Omega-6', amount: '14.8 g' }
    ],
    storageInstructions: 'Keep in a dark, cool place away from direct sunlight. Reseal cap tightly.',
    shelfLife: '9 Months from crushing date',
    countryOfOrigin: 'India (Rajasthan Certified Organic Clusters)',
    labCertificateBatch: 'LAB-LAD-2026-M19',
    fssaiNumber: '10021013000451',
    frequentlyBoughtTogetherIds: ['pickle-01', 'spice-02', 'ghee-01'],
    reviews: [
      {
        id: 'r3',
        userName: 'Rameshwar Lal',
        userLocation: 'Alwar, Rajasthan',
        rating: 5,
        date: '28 April 2026',
        title: 'Original jhaanjh and natural yellow color',
        comment: 'Tastes like real village oil from 40 years ago. Perfect for making traditional mango and mirchi pickles.',
        verifiedPurchase: true,
        helpfulCount: 34
      }
    ]
  },
  {
    id: 'spice-01',
    name: 'Organic Dhaniya Powder (Stone Ground Coriander)',
    hindiName: 'ऑर्गेनिक शुद्ध धनिया पाउडर',
    slug: 'organic-dhaniya-powder-stone-ground',
    category: 'spices',
    categoryName: 'Stone-Ground Spices',
    shortDescription: 'Slow stone-ground from fragrant green coriander seeds with high natural linalool oil content.',
    description: 'Ladesar Organics Dhaniya Powder is harvested from organic farms in Ramganj Mandi, renowned for the sweetest and most fragrant coriander seeds. Ground at low RPM on natural emery stone mills to avoid heat degradation, keeping all essential volatile oils intact. Bright, citrusy, and earthy fragrance that elevates curries, dals, and marinades.',
    heroImage: '/images/products/Organic-Dhaniya-Powder-product.png',
    galleryImages: [
      '/images/products/Organic-Dhaniya-Powder-product.png',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'sp-dh-1', size: '250 g Eco Pouch', price: 145, mrp: 175, stock: 110, sku: 'LAD-SP-DHA-250' },
      { id: 'sp-dh-2', size: '500 g Eco Pouch', price: 275, mrp: 330, stock: 75, sku: 'LAD-SP-DHA-500' },
    ],
    selectedVariantId: 'sp-dh-1',
    rating: 4.9,
    reviewsCount: 96,
    isBestSeller: false,
    isNewArrival: true,
    isOrganicCertified: true,
    certifications: ['India Organic', 'USDA Organic Equivalent', 'Zero Adulteration Certified'],
    dietaryTags: ['Stone Ground', 'Zero Additives', 'Sun Dried', 'Gluten Free'],
    ingredients: ['100% Certified Organic Whole Coriander Seeds (Coriandrum sativum)'],
    ayurvedicBenefits: [
      'Cooling spice (Sheeta Veerya) that balances excess Pitta body heat',
      'Supports healthy urinary tract function and kidneys',
      'Aids digestion and prevents bloating'
    ],
    extractionMethod: 'Slow cold stone grinding below 35°C',
    nutritionFacts: [
      { name: 'Dietary Fiber', amount: '41.9 g' },
      { name: 'Iron', amount: '16.3 mg', dailyValue: '90%' },
      { name: 'Calcium', amount: '709 mg', dailyValue: '71%' },
      { name: 'Magnesium', amount: '330 mg', dailyValue: '82%' }
    ],
    storageInstructions: 'Store in an airtight container away from moisture and direct sunlight.',
    shelfLife: '12 Months',
    countryOfOrigin: 'India',
    fssaiNumber: '10021013000451'
  },
  {
    id: 'spice-02',
    name: 'Lakadong High-Curcumin Organic Turmeric Powder',
    hindiName: 'लकडोंग हल्दी पाउडर (उच्च करक्यूमिन)',
    slug: 'lakadong-high-curcumin-turmeric-powder',
    category: 'spices',
    categoryName: 'Stone-Ground Spices',
    shortDescription: 'Grown in the pristine Jaintia Hills with 7.5%+ natural Curcumin content for potent immunity and healing.',
    description: 'Sourced directly from native farmers in Meghalaya, Lakadong Turmeric is globally celebrated as the world’s finest turmeric. While ordinary market turmeric contains only 2–3% curcumin, our Lakadong batch is lab-certified at over 7.8% active Curcumin. Deep golden-orange hue, intense earthy fragrance, and medicinal grade antioxidant power.',
    heroImage: '/images/products/Turmeric-Powder-product.png',
    galleryImages: [
      '/images/products/Turmeric-Powder-product.png',
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'sp-tur-1', size: '250 g Eco Pouch', price: 220, mrp: 270, stock: 95, sku: 'LAD-SP-TUR-250' },
      { id: 'sp-tur-2', size: '500 g Eco Pouch', price: 410, mrp: 510, stock: 60, sku: 'LAD-SP-TUR-500' },
    ],
    selectedVariantId: 'sp-tur-1',
    rating: 4.95,
    reviewsCount: 230,
    isBestSeller: true,
    isOrganicCertified: true,
    certifications: ['India Organic', 'Lab Certified 7.8% Curcumin', 'Non-GMO', 'Lead Free Tested'],
    dietaryTags: ['7.8% Curcumin', 'Unpolished', 'Immunity Booster', 'Zero Lead Chromate'],
    ingredients: ['100% Pure Organic Lakadong Turmeric Rhizomes (Curcuma longa)'],
    ayurvedicBenefits: [
      'Powerful natural anti-inflammatory and cellular antioxidant',
      'Purifies blood (Rakta Shodhaka) and enhances skin glow',
      'Ideal for Golden Milk (Haldi Doodh) with A2 Desi Ghee & Black Pepper'
    ],
    extractionMethod: 'Sun-cured and slow milled on water-cooled stone grinders',
    nutritionFacts: [
      { name: 'Active Curcumin', amount: '7.82%' },
      { name: 'Iron', amount: '41.4 mg' },
      { name: 'Potassium', amount: '2525 mg' }
    ],
    storageInstructions: 'Store in a cool dry dark place.',
    shelfLife: '18 Months',
    countryOfOrigin: 'India (Meghalaya Hills)',
    labCertificateBatch: 'LAB-LAD-2026-TUR99',
    fssaiNumber: '10021013000451'
  },
  {
    id: 'spice-03',
    name: 'Vedic Royal Garam Masala (17 Whole Spice Blend)',
    hindiName: 'शाही गरम मसाला (१७ जड़ी-बूटियों का मिश्रण)',
    slug: 'vedic-royal-garam-masala-blend',
    category: 'spices',
    categoryName: 'Stone-Ground Spices',
    shortDescription: 'Masterful blend of 17 sun-dried whole spices including Tellicherry pepper, green cardamom, star anise, and mace.',
    description: 'An ancestral royal recipe handed down through generations. Crafted using only highest grade whole spices: green cardamom, black cardamom, cloves, cinnamon, mace (Javitri), nutmeg (Jaiphal), star anise, bay leaf, coriander, cumin, caraway, fennel, ginger, stone flower (Dagad phool), and Tellicherry black pepper. Hand-roasted in small batches to awaken aromatic ketones.',
    heroImage: '/images/products/Garam-Masala-product.png',
    galleryImages: [
      '/images/products/Garam-Masala-product.png'
    ],
    variants: [
      { id: 'sp-gm-1', size: '100 g Glass Jar', price: 185, mrp: 220, stock: 65, sku: 'LAD-SP-GM-100' },
      { id: 'sp-gm-2', size: '250 g Glass Jar', price: 395, mrp: 480, stock: 40, sku: 'LAD-SP-GM-250' },
    ],
    selectedVariantId: 'sp-gm-1',
    rating: 4.88,
    reviewsCount: 88,
    isBestSeller: false,
    isOrganicCertified: true,
    certifications: ['India Organic', 'Handcrafted', 'Zero Fillers'],
    dietaryTags: ['17 Whole Spices', 'No Starch or Preservatives', 'Aromatic'],
    ingredients: ['Coriander, Cumin, Black Pepper, Green Cardamom, Black Cardamom, Cloves, Cinnamon, Mace, Nutmeg, Bay Leaves, Star Anise, Fennel, Ginger, Stone Flower'],
    ayurvedicBenefits: ['Ignites digestive fire (Deepana)', 'Relieves sluggish metabolism', 'Warming effect in winter months'],
    extractionMethod: 'Slow pan roasting and stone pulverizing',
    nutritionFacts: [{ name: 'Dietary Fiber', amount: '35.4 g' }],
    storageInstructions: 'Keep in glass jar tightly shut.',
    shelfLife: '12 Months',
    countryOfOrigin: 'India',
    fssaiNumber: '10021013000451'
  },
  {
    id: 'pickle-01',
    name: 'Traditional Sun-Cured Mango Pickle (Aam ka Achar)',
    hindiName: 'पारंपरिक कच्ची घानी आम का अचार',
    slug: 'traditional-sun-cured-mango-pickle',
    category: 'pickles',
    categoryName: 'Artisanal Pickles & Chutneys',
    shortDescription: 'Made with raw Ramkela mangoes, hand-ground spices, and cold-pressed mustard oil, matured in ceramic Barnis under the Rajasthan sun.',
    description: 'Authentic grandma style mango pickle prepared using non-fibrous tangy Ramkela raw mangoes. Tossed with stone-ground fenugreek seeds, fennel, nigella (Kalonji), turmeric, red chilli, and submerged in pure cold-pressed Kachi Ghani mustard oil. Matured under natural sun heat for 21 days in traditional glazed earthenware jars (Martaban). 100% free of synthetic acetic acid/vinegar or sodium benzoate.',
    heroImage: '/images/products/Mango-Pickle-product.png',
    galleryImages: [
      '/images/products/Mango-Pickle-product.png'
    ],
    variants: [
      { id: 'pck-m-1', size: '400 g Glass Barni', price: 299, mrp: 360, stock: 55, sku: 'LAD-PCK-MNG-400' },
      { id: 'pck-m-2', size: '1000 g Glass Barni', price: 599, mrp: 720, stock: 30, sku: 'LAD-PCK-MNG-1000' },
    ],
    selectedVariantId: 'pck-m-1',
    rating: 4.92,
    reviewsCount: 118,
    isBestSeller: true,
    isOrganicCertified: true,
    certifications: ['India Organic', 'Sun-Matured', 'Zero Chemical Preservatives'],
    dietaryTags: ['Matured in Cold-Pressed Oil', 'No Vinegar', 'Probiotic Heritage', 'Gluten Free'],
    ingredients: ['Organic Raw Mango Pieces, Cold-Pressed Mustard Oil, Fenugreek, Fennel, Kalonji, Turmeric, Red Chilli Powder, Rock Salt (Sendha Namak), Asafoetida (Hing)'],
    ayurvedicBenefits: [
      'Natural probiotic fermentation aids gut microbiome',
      'Enhances saliva secretion and taste perception',
      'Traditional cooling spices balance sour fruit nature'
    ],
    extractionMethod: 'Natural 21-Day Solar Fermentation in Ceramic Barnis',
    nutritionFacts: [
      { name: 'Energy', amount: '185 kcal' },
      { name: 'Dietary Fiber', amount: '4.8 g' },
      { name: 'Vitamin C', amount: '18 mg' }
    ],
    storageInstructions: 'Always use a dry spoon. Ensure mango pieces are covered in oil. Keep in cool place.',
    shelfLife: '18 Months',
    countryOfOrigin: 'India',
    fssaiNumber: '10021013000451'
  },
  {
    id: 'paste-01',
    name: 'Stone-Ground Organic Ginger Garlic Paste',
    hindiName: 'सिलबट्टे पर पिसा अदरक-लहसुन पेस्ट',
    slug: 'stone-ground-organic-ginger-garlic-paste',
    category: 'natural-foods',
    categoryName: 'Natural Foods',
    shortDescription: 'Freshly ground native Pahadi ginger and garlic with a drop of cold-pressed oil and rock salt. No water or preservatives added.',
    description: 'Unlike commercial watery pastes loaded with acidity regulators and starches, Ladesar Organics Ginger Garlic Paste is prepared by crushing fresh pungent ginger and desi garlic on granite stone grinders. Blended with pure mustard oil and Himalayan pink salt as natural preservative barriers. Intense aroma and restaurant-quality flavor.',
    heroImage: '/images/products/Garlic-Paste-product.png',
    galleryImages: [
      '/images/products/Garlic-Paste-product.png'
    ],
    variants: [
      { id: 'pst-1', size: '300 g Glass Jar', price: 165, mrp: 195, stock: 70, sku: 'LAD-PST-GG-300' },
    ],
    selectedVariantId: 'pst-1',
    rating: 4.85,
    reviewsCount: 64,
    isBestSeller: false,
    isOrganicCertified: true,
    certifications: ['India Organic', 'Zero Preservatives Added'],
    dietaryTags: ['Stone Ground', 'Zero Water Added', '100% Natural'],
    ingredients: ['Fresh Organic Ginger (50%), Desi Garlic (45%), Cold-Pressed Mustard Oil (3%), Himalayan Pink Salt (2%)'],
    ayurvedicBenefits: ['Anti-inflammatory', 'Cardiovascular support', 'Aids digestion'],
    extractionMethod: 'Granite Stone Crushing',
    nutritionFacts: [{ name: 'Energy', amount: '82 kcal' }],
    storageInstructions: 'Refrigerate after opening.',
    shelfLife: '6 Months',
    countryOfOrigin: 'India',
    fssaiNumber: '10021013000451'
  },
  {
    id: 'honey-01',
    name: 'Raw Himalayan Wild Forest Honey',
    hindiName: 'शुद्ध जंगली हिमालयन कच्चा शहद',
    slug: 'raw-himalayan-wild-forest-honey',
    category: 'honey',
    categoryName: 'Raw Forest Honey',
    shortDescription: 'Unfiltered, unpasteurized honey sustainably harvested from wild Apis Dorsata bees in the Himalayan biosphere.',
    description: 'Collected by indigenous tribal beekeepers from pristine wild flower valleys in Uttarakhand. This honey is never heated, micro-filtered, or adulterated with sugar/C3/C4 syrups. Contains live bee pollen, propolis, royal jelly traces, and active enzymes that promote immunity and longevity.',
    heroImage: '/images/products/Forest-Honey-product.png',
    galleryImages: [
      '/images/products/Forest-Honey-product.png'
    ],
    variants: [
      { id: 'hny-1', size: '500 g Glass Jar', price: 549, mrp: 650, stock: 50, sku: 'LAD-HNY-500' },
      { id: 'hny-2', size: '1000 g Glass Jar', price: 999, mrp: 1200, stock: 25, sku: 'LAD-HNY-1000' },
    ],
    selectedVariantId: 'hny-1',
    rating: 4.96,
    reviewsCount: 160,
    isBestSeller: true,
    isOrganicCertified: true,
    certifications: ['India Organic', 'NMR Tested 100% Pure', 'Raw & Unpasteurized'],
    dietaryTags: ['Raw & Unfiltered', 'Pollen Rich', 'Sugar Syrup Free NMR Certified'],
    ingredients: ['100% Pure Raw Multifloral Forest Honey'],
    ayurvedicBenefits: [
      'Yogavahi property (deep carrier of herbs and remedies)',
      'Natural soother for throat irritations and coughs',
      'Supports healthy metabolism and gut enzymes'
    ],
    extractionMethod: 'Ethical tribal hive extraction, single coarse cotton filtration',
    nutritionFacts: [
      { name: 'Natural Carbohydrates', amount: '82 g' },
      { name: 'Natural Sugars', amount: '80 g' },
      { name: 'Proteins & Enzymes', amount: '0.5 g' }
    ],
    storageInstructions: 'Store at room temperature. Natural crystallization is proof of purity—place jar in warm water if needed.',
    shelfLife: '24 Months',
    countryOfOrigin: 'India (Himalayan Forest)',
    fssaiNumber: '10021013000451'
  },
  {
    id: 'ayur-01',
    name: 'Vedic Ashwagandha Root Churna (Withania Somnifera)',
    hindiName: 'वैदिक शुद्ध अश्वगंधा चूर्ण',
    slug: 'vedic-ashwagandha-root-churna',
    category: 'herbs-ayurveda',
    categoryName: 'Ayurvedic Wellness',
    shortDescription: 'Certified organic Nagori Ashwagandha root powder to reduce stress, improve sleep, and boost vitality.',
    description: 'Sourced from the arid organic soils of Nagaur, renowned for the most potent Ashwagandha roots. Rich in Withanolides and Withaferin A. Cultivated using regenerative organic farming without chemical fertilizers.',
    heroImage: '/images/products/Ashwagandha-Root-Churna-product.png',
    galleryImages: [
      '/images/products/Ashwagandha-Root-Churna-product.png'
    ],
    variants: [
      { id: 'ash-1', size: '200 g Jar', price: 280, mrp: 340, stock: 60, sku: 'LAD-AYU-ASH-200' },
    ],
    selectedVariantId: 'ash-1',
    rating: 4.89,
    reviewsCount: 75,
    isBestSeller: false,
    isNewArrival: true,
    isOrganicCertified: true,
    certifications: ['India Organic', 'GMP Certified Ayurvedic Formulation', 'Heavy Metal Tested'],
    dietaryTags: ['Adaptogen', 'Stress Relief', 'Vedic Rasayana', 'Vegan'],
    ingredients: ['100% Pure Organic Nagori Ashwagandha Root Powder'],
    ayurvedicBenefits: [
      'Potent adaptogen that lowers cortisol and promotes restful sleep',
      'Enhances physical stamina, muscle strength, and stamina (Bala)',
      'Nourishes nervous system and reproductive tissues (Shukra Dhatu)'
    ],
    extractionMethod: 'Sun-dried root micropulverization',
    nutritionFacts: [{ name: 'Withanolides', amount: '>2.5%' }],
    storageInstructions: 'Store in a cool and dry location.',
    shelfLife: '24 Months',
    countryOfOrigin: 'India',
    fssaiNumber: '10021013000451'
  },
  {
    id: 'flour-01',
    name: 'Organic Sharbati MP Whole Wheat Flour (Stone Milled Chakki Atta)',
    hindiName: 'ऑर्गेनिक शरबती गेहूं का आटा (पत्थर की चक्की)',
    slug: 'organic-sharbati-mp-wheat-flour',
    category: 'pulses-flour',
    categoryName: 'Organic Pulses & Flour',
    shortDescription: 'Golden grain Sharbati wheat grown in the black soils of Sehore, stone-ground with 100% bran and germ intact for ultra-soft rotis.',
    description: 'Sehore Sharbati wheat is globally celebrated as the king of wheat. Our whole wheat flour is cold stone ground at low temperatures so the delicate nutrients, dietary fiber, and wheatgerm oils are preserved. Yields naturally sweet, super soft rotis that stay fresh all day.',
    heroImage: '/images/products/Wheat-Flour-product.png',
    galleryImages: [
      '/images/products/Wheat-Flour-product.png'
    ],
    variants: [
      { id: 'fl-1', size: '5 Kg Eco Fabric Bag', price: 380, mrp: 440, stock: 90, sku: 'LAD-FL-SHAR-5K' },
      { id: 'fl-2', size: '10 Kg Eco Fabric Bag', price: 740, mrp: 860, stock: 45, sku: 'LAD-FL-SHAR-10K' },
    ],
    selectedVariantId: 'fl-1',
    rating: 4.9,
    reviewsCount: 110,
    isBestSeller: true,
    isOrganicCertified: true,
    certifications: ['India Organic', 'Stone Milled', '100% Whole Grain'],
    dietaryTags: ['100% Bran & Germ', 'Non-GMO', 'No Maida/Bleaching Agents'],
    ingredients: ['100% Certified Organic Sharbati Wheat Grains'],
    ayurvedicBenefits: ['Provides sustained energy', 'High dietary fiber aids bowel motility'],
    extractionMethod: 'Slow speed stone milling (Traditional Chakki)',
    nutritionFacts: [
      { name: 'Dietary Fiber', amount: '12.8 g' },
      { name: 'Protein', amount: '13.2 g' }
    ],
    storageInstructions: 'Store in dry airtight container.',
    shelfLife: '6 Months',
    countryOfOrigin: 'India (Madhya Pradesh)',
    fssaiNumber: '10021013000451'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'FIRST15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 499,
    description: '15% Off on your first organic order (Orders above ₹499)',
    expiresAt: '2027-12-31',
    isActive: true,
  },
  {
    code: 'VEDIC20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 1999,
    description: '20% Off on Vedic Ghee & Spices combos above ₹1999',
    expiresAt: '2027-12-31',
    isActive: true,
  },
  {
    code: 'ORGANIC10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 999,
    description: 'Flat 10% Off on all pure cold-pressed oils and flours',
    expiresAt: '2027-12-31',
    isActive: true,
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 499,
    description: 'Free Express Shipping nationwide',
    expiresAt: '2027-12-31',
    isActive: true,
  },
];

export const RECIPES_DATA: Recipe[] = [
  {
    id: 'rec-01',
    title: 'Immunity-Boosting Ayurvedic Golden Milk (Haldi Doodh)',
    hindiTitle: 'वैदिक स्वर्ण दूध (रोग प्रतिरोधक हल्दी दूध)',
    timeMinutes: 10,
    prepTime: '10 mins',
    servings: 2,
    difficulty: 'Easy',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    description: 'The supreme ancient remedy for deep sleep, cellular regeneration, joint health, and immunity against seasonal colds.',
    ayurvedicBenefits: 'Curcumin in Lakadong Turmeric is fat-soluble and its bioavailability increases by 2000% when paired with warm A2 Desi Ghee and freshly crushed Black Pepper.',
    ingredients: [
      { item: 'A2 Desi Cow Milk or Almond Milk', quantity: '2 Cups' },
      { item: 'Ladesar Lakadong Turmeric Powder', quantity: '1 tsp', matchedProductId: 'spice-02' },
      { item: 'Ladesar A2 Bilona Desi Ghee', quantity: '1/2 tsp', matchedProductId: 'ghee-01' },
      { item: 'Crushed Tellicherry Black Pepper', quantity: '1 pinch' },
      { item: 'Ladesar Raw Forest Honey', quantity: '1 tsp (added after cooling slightly)', matchedProductId: 'honey-01' }
    ],
    instructions: [
      'Gently heat the milk in a brass or stainless steel pan over medium flame.',
      'Add 1 tsp of Lakadong Turmeric Powder, crushed black pepper, and 1/2 tsp of A2 Desi Ghee.',
      'Whisk well and allow to simmer gently on low heat for 3 to 5 minutes to activate the active curcuminoids.',
      'Turn off flame and let cool to lukewarm temperature (never add raw honey to boiling liquid as per Ayurveda).',
      'Stir in 1 tsp of Raw Forest Honey and sip warmly before bedtime for restorative sleep.'
    ],
    recommendedProductIds: ['ghee-01', 'spice-02', 'honey-01']
  },
  {
    id: 'rec-02',
    title: 'Heritage Rajasthani Tadka Dal with Mustard Oil & Royal Garam Masala',
    hindiTitle: 'राजस्थानी सरसों तड़का दाल',
    timeMinutes: 25,
    prepTime: '25 mins',
    servings: 4,
    difficulty: 'Medium',
    heroImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    description: 'Fragrant comfort dal tempered in authentic cold-pressed mustard oil with stone-ground coriander and royal garam masala.',
    ayurvedicBenefits: 'Mustard oil stimulates digestive fire (Agni) and breaks down complex plant proteins in pulses with ease.',
    ingredients: [
      { item: 'Organic Yellow Moong / Toor Dal', quantity: '1 Cup' },
      { item: 'Ladesar Cold-Pressed Mustard Oil', quantity: '2 tbsp', matchedProductId: 'oil-01' },
      { item: 'Ladesar Dhaniya Powder', quantity: '1 tsp', matchedProductId: 'spice-01' },
      { item: 'Ladesar Stone-Ground Ginger Garlic Paste', quantity: '1 tbsp', matchedProductId: 'paste-01' },
      { item: 'Ladesar Royal Garam Masala', quantity: '1/2 tsp', matchedProductId: 'spice-03' },
      { item: 'Cumin seeds & Asafoetida (Hing)', quantity: '1/2 tsp' }
    ],
    instructions: [
      'Pressure cook rinsed dal with water, a pinch of turmeric and rock salt until soft.',
      'In a heavy-bottomed pan, heat 2 tbsp of Kachi Ghani Mustard Oil until it reaches smoking point, then lower flame.',
      'Add cumin seeds, hing, and 1 tbsp of fresh Ginger Garlic Paste; sauté till aromatic.',
      'Add Dhaniya Powder and pour in the cooked dal. Simmer for 7 minutes.',
      'Sprinkle Royal Garam Masala on top, cover with lid for 2 minutes, and serve hot with Sharbati Wheat rotis!'
    ],
    recommendedProductIds: ['oil-01', 'spice-01', 'spice-03', 'paste-01']
  }
];

export const MOCK_RECIPES = RECIPES_DATA;

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'LAD-2026-8941',
    createdAt: '2026-08-16T14:30:00.000Z',
    items: [
      {
        productId: 'ghee-01',
        productName: 'A2 Bilona Vedic Desi Gir Cow Ghee',
        productImage: '/images/products/Gir-Cow-Ghee-product.png',
        variantSize: '1000 ml Glass Jar',
        unitPrice: 2099,
        quantity: 1,
        total: 2099,
      },
      {
        productId: 'spice-02',
        productName: 'Lakadong High-Curcumin Organic Turmeric Powder',
        productImage: '/images/products/Turmeric-Powder-product.png',
        variantSize: '250 g Eco Pouch',
        unitPrice: 220,
        quantity: 2,
        total: 440,
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Vikramaditya Rathore',
      phone: '+91 98290 12345',
      street: '14, Royal Greens Enclave, Civil Lines',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302006',
      type: 'Home',
      isDefault: true
    },
    paymentMethod: 'UPI / PhonePe',
    paymentStatus: 'Paid',
    transactionId: 'TXN-UPI-98234710',
    subtotal: 2539,
    discountAmount: 380.85,
    couponApplied: 'FIRST15',
    shippingFee: 0,
    taxAmount: 107.90,
    totalAmount: 2266.05,
    status: 'Shipped',
    estimatedDelivery: '18 Aug 2026',
    timeline: [
      { status: 'Placed', timestamp: '16 Aug 2026, 02:30 PM', description: 'Order confirmed & payment verified', completed: true },
      { status: 'Processing', timestamp: '16 Aug 2026, 04:15 PM', description: 'Quality inspection & batch certification verified', completed: true },
      { status: 'Packed', timestamp: '16 Aug 2026, 06:00 PM', description: 'Packed safely in shockproof eco-cushioning glass containers', completed: true },
      { status: 'Shipped', timestamp: '17 Aug 2026, 09:30 AM', description: 'Handed over to BlueDart Express Air Courier (AWB #BD-9817234)', completed: true },
      { status: 'Delivered', timestamp: 'Estimated 18 Aug 2026', description: 'Out for doorstep delivery', completed: false }
    ],
    customerEmail: 'vikram.rathore@example.com',
    customerPhone: '+91 98290 12345'
  },
  {
    id: 'ord-1002',
    orderNumber: 'LAD-2026-8942',
    createdAt: '2026-08-17T08:15:00.000Z',
    items: [
      {
        productId: 'oil-01',
        productName: 'Kachi Ghani Cold-Pressed Mustard Oil',
        productImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80',
        variantSize: '1 Litre Glass Bottle',
        unitPrice: 349,
        quantity: 2,
        total: 698,
      },
      {
        productId: 'pickle-01',
        productName: 'Traditional Sun-Cured Mango Pickle',
        productImage: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=200&q=80',
        variantSize: '400 g Glass Barni',
        unitPrice: 299,
        quantity: 1,
        total: 299,
      }
    ],
    shippingAddress: {
      id: 'addr-2',
      fullName: 'Ananya Deshmukh',
      phone: '+91 98200 67890',
      street: 'Flat 802, Palm Heights, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      type: 'Home'
    },
    paymentMethod: 'Credit / Debit Card',
    paymentStatus: 'Paid',
    transactionId: 'TXN-CRD-77123901',
    subtotal: 997,
    discountAmount: 99.70,
    couponApplied: 'ORGANIC10',
    shippingFee: 0,
    taxAmount: 44.85,
    totalAmount: 942.15,
    status: 'Processing',
    estimatedDelivery: '19 Aug 2026',
    timeline: [
      { status: 'Placed', timestamp: '17 Aug 2026, 08:15 AM', description: 'Order confirmed & paid via Razorpay Secure', completed: true },
      { status: 'Processing', timestamp: '17 Aug 2026, 08:45 AM', description: 'Fresh batch batching from organic warehouse', completed: true },
      { status: 'Packed', timestamp: 'Pending', description: 'Packing in temperature-controlled amber jars', completed: false },
      { status: 'Shipped', timestamp: 'Pending', description: 'Dispatch via Express Air', completed: false },
      { status: 'Delivered', timestamp: 'Pending', description: 'Doorstep delivery with OTP confirmation', completed: false }
    ],
    customerEmail: 'ananya.deshmukh@example.com',
    customerPhone: '+91 98200 67890'
  }
];

export const INITIAL_USERS: CustomerUser[] = [
  {
    id: 'usr-1',
    name: 'Shivam Shishodia',
    email: 'shivamshishodia2000@gmail.com',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'VIP Member',
    status: 'Active',
    walletBalance: 450,
    loyaltyPoints: 320,
    referralCode: 'SHIVAM-ORG-2026',
    totalOrders: 14,
    totalSpent: 16890,
    joinedDate: '12 Jan 2026',
    lastLogin: 'Today, 02:15 PM',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Shivam Shishodia',
        phone: '+91 98765 43210',
        street: 'House No. 42, Organic Valley Lane, Sector 14',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
        type: 'Home',
        isDefault: true
      },
      {
        id: 'addr-2',
        fullName: 'Shivam Shishodia (Office)',
        phone: '+91 98765 43210',
        street: 'Tower 4, Cyber City Phase 2',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        type: 'Work',
        isDefault: false
      }
    ]
  },
  {
    id: 'usr-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98112 34567',
    password: 'password123',
    role: 'Customer',
    status: 'Active',
    walletBalance: 120,
    loyaltyPoints: 180,
    referralCode: 'PRIYA-VEDIC',
    totalOrders: 8,
    totalSpent: 9450,
    joinedDate: '28 Jan 2026',
    lastLogin: 'Yesterday, 06:40 PM',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-p1',
        fullName: 'Priya Sharma',
        phone: '+91 98112 34567',
        street: 'B-402, Nirvana Country, Sector 50',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122018',
        type: 'Home',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-3',
    name: 'Rajesh K. Mehta',
    email: 'rajesh.mehta@example.com',
    phone: '+91 98450 98765',
    password: 'password123',
    role: 'Wholesale Partner',
    status: 'Active',
    walletBalance: 2500,
    loyaltyPoints: 1200,
    referralCode: 'RAJESH-BULK',
    totalOrders: 22,
    totalSpent: 84200,
    joinedDate: '05 Feb 2026',
    lastLogin: '16 Aug 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-r1',
        fullName: 'Rajesh Mehta (Mehta Organic Store)',
        phone: '+91 98450 98765',
        street: 'Shop 12, Main Market, Jayanagar 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560041',
        type: 'Work',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-4',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@example.com',
    phone: '+91 98200 67890',
    password: 'password123',
    role: 'Customer',
    status: 'Active',
    walletBalance: 0,
    loyaltyPoints: 95,
    referralCode: 'ANANYA-BIO',
    totalOrders: 3,
    totalSpent: 3200,
    joinedDate: '10 Feb 2026',
    lastLogin: '3 days ago',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-a1',
        fullName: 'Ananya Deshmukh',
        phone: '+91 98200 67890',
        street: 'Flat 901, Palm Heights, Vashi',
        city: 'Navi Mumbai',
        state: 'Maharashtra',
        pincode: '400703',
        type: 'Home',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-5',
    name: 'Dr. Arvind Joshi',
    email: 'arvind.joshi@ayurveda.org',
    phone: '+91 94140 12345',
    password: 'password123',
    role: 'VIP Member',
    status: 'Active',
    walletBalance: 600,
    loyaltyPoints: 540,
    referralCode: 'VAIDYA-JOSHI',
    totalOrders: 18,
    totalSpent: 27500,
    joinedDate: '15 Jan 2026',
    lastLogin: 'Yesterday',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-j1',
        fullName: 'Dr. Arvind Joshi (Ayurvedic Clinic)',
        phone: '+91 94140 12345',
        street: 'Ayur Heritage Bhawan, C-Scheme',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        type: 'Work',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-6',
    name: 'Sunita Meena',
    email: 'sunita.meena@example.com',
    phone: '+91 97850 33221',
    password: 'password123',
    role: 'Customer',
    status: 'Suspended',
    walletBalance: 0,
    loyaltyPoints: 10,
    referralCode: 'SUNITA-M',
    totalOrders: 1,
    totalSpent: 450,
    joinedDate: '01 Mar 2026',
    lastLogin: '10 days ago',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-s1',
        fullName: 'Sunita Meena',
        phone: '+91 97850 33221',
        street: 'Plot 18, Tonk Road',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302015',
        type: 'Home',
        isDefault: true
      }
    ]
  }
];

export const INITIAL_USER: CustomerUser = INITIAL_USERS[0];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-17 09:12:00',
    user: 'Super Admin',
    role: 'Super Admin',
    action: 'INVENTORY_UPDATE',
    module: 'Inventory',
    details: 'Restocked 50 units of A2 Bilona Vedic Desi Ghee 1000ml (Batch #G84)'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-17 08:30:15',
    user: 'Marketing Head',
    role: 'Marketing Head',
    action: 'COUPON_CREATED',
    module: 'Coupons',
    details: 'Created coupon code VEDIC20 with 20% discount on orders above ₹1999'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-16 16:45:00',
    user: 'Inventory Manager',
    role: 'Inventory Manager',
    action: 'PRODUCT_PRICE_ADJUST',
    module: 'Catalog',
    details: 'Updated MRP & sale pricing for Kachi Ghani Cold-Pressed Mustard Oil 1L'
  }
];

export const INITIAL_SITE_SETTINGS = {
  branding: {
    brandName: 'Ladesar',
    subName: 'Organics',
    tagline: 'Rooted in Purity',
    logoType: 'emblem' as const,
    customLogoUrl: '',
    faviconUrl: '',
  },
  hero: {
    badgeText: '100% Certified Organic • Farm-Harvested in Rajasthan',
    headingLine1: 'Purity As Nature &',
    headingLine2: 'Vedic Wisdom Intended',
    subtitle: 'Handcrafted A2 Bilona Desi Ghee, Wood-Pressed Kachi Ghani Mustard Oil, Single-Origin High-Curcumin Spices, and Raw Wild Honey. Packed exclusively in UV-protected glass.',
    primaryBtnText: 'Explore Organic Pantry',
    primaryBtnLink: 'shop',
    secondaryBtnText: 'Consult AI Ayurvedic Vaidya',
    secondaryBtnLink: 'ai-advisor',
    
    // Featured Showcase Product Card
    featuredProductImage: '/images/products/Gir-Cow-Ghee-product.png',
    featuredBadge: 'Vedic Masterpiece',
    featuredTitle: 'A2 Bilona Vedic Desi Gir Cow Ghee',
    featuredDescription: 'Prepared through the traditional 5-stage Bilona method from curdled A2 Gir cow milk over slow cow dung fire in brass vessels.',
    featuredPrice: 1099,
    featuredMrp: 1299,
    featuredRating: 4.9,
    featuredReviewsCount: 184,
    featuredLabBadge: 'NABL Lab Tested',
    featuredBtnText: 'Add to Bag',

    // 3 Trust Pillars
    pillars: [
      { title: '100%', subtitle: 'Chemical Free', iconName: 'Leaf' as const },
      { title: 'A2 Bilona', subtitle: 'Curd Churned', iconName: 'RotateCcw' as const },
      { title: 'Glass Jar', subtitle: 'Zero Plastic', iconName: 'ShieldCheck' as const },
    ]
  },
  announcementBar: {
    enabled: true,
    text: '🌿 Special Vedic Harvest Offer: Use code FIRST15 for flat 15% OFF + Free Express Shipping above ₹499',
    linkText: 'Claim Offer',
    linkUrl: '#',
  }
};
