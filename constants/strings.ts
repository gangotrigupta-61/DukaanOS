/**
 * DukaanOS Comprehensive Global Language & Localization System
 * Supports:
 *  1. English ('en')
 *  2. Hindi ('hi') - Proper Devanagari Hindi
 *  3. Hinglish ('hi-en') - Natural WhatsApp-style Roman Hindi
 */

export type Language = 'hi-en' | 'hi' | 'en';

export interface TranslationStrings {
  // Brand & Common
  appName: string;
  tagline: string;
  offlineBadge: string;
  offlineShort: string;
  welcomeTagline: string;
  welcomeSubtitle: string;
  welcomeWorksOffline: string;
  welcomeNoInternet: string;
  welcomeOfflineDesc: string;
  welcomeShuruKarein: string;
  welcomeSetupTime: string;
  welcomeWhyRetailers: string;
  welcomeFeatureStockTitle: string;
  welcomeFeatureStockDesc: string;
  welcomeFeatureSalesTitle: string;
  welcomeFeatureSalesDesc: string;
  welcomeFeatureAlertsTitle: string;
  welcomeFeatureAlertsDesc: string;
  welcomeFeatureInsightsTitle: string;
  welcomeFeatureInsightsDesc: string;
  welcomeStoreSign: string;
  welcomeStoreSub: string;

  // Navigation & Actions
  quickSale: string;
  quickSaleShort: string;
  quickSaleDesc: string;
  products: string;
  productsShort: string;
  productsDesc: string;
  addProduct: string;
  addProductShort: string;
  addProductDesc: string;
  lowStock: string;
  lowStockShort: string;
  lowStockDesc: string;
  slowMoving: string;
  slowMovingShort: string;
  slowMovingDesc: string;

  // Shop Setup & Profile
  shopSetup: string;
  shopDetails: string;
  shopSetupSubtitle: string;
  shopNameLabel: string;
  shopNamePlaceholder: string;
  shopTypeLabel: string;
  languageLabel: string;
  activeStore: string;
  editShop: string;
  setupShopBannerTitle: string;
  setupShopBannerSubtitle: string;
  btnSaveShop: string;
  shopTypeKirana: string;
  shopTypeGeneral: string;
  shopTypeDairy: string;
  shopTypeVegetables: string;
  shopTypeChemist: string;
  shopTypeOther: string;

  // Home Dashboard
  inventoryHealth: string;
  quickActions: string;
  allStockHealthy: string;
  activeMovement: string;
  footerNote: string;
  offlineStorageHeader: string;
  offlineStorageActive: string;
  offlineConnecting: string;
  verifiedTables: string;

  // Products Screen
  productsSubtitle: string;
  btnAddProduct: string;
  btnSale: string;
  noProductsTitle: string;
  noProductsSubtitle: string;
  btnAddFirstProduct: string;
  currentStock: string;
  threshold: string;
  loadingStock: string;

  // Add Product Screen
  addProductTitle: string;
  addProductSubtitle: string;
  productNameLabel: string;
  productNamePlaceholder: string;
  unitLabel: string;
  quantityLabel: string;
  quantityPlaceholder: string;
  thresholdLabel: string;
  thresholdPlaceholder: string;
  fractionalTip: string;
  btnSaveProduct: string;

  // Quick Sale Screen
  quickSaleSubtitle: string;
  stepSelectProduct: string;
  stepEnterQuantity: string;
  searchPlaceholder: string;
  saleSummary: string;
  productLabel: string;
  soldLabel: string;
  remainingLabel: string;
  btnRecordSale: string;
  saleRecordedSuccess: string;
  btnViewProducts: string;
  noProductsSaleSubtitle: string;
  presetQuarter: string;
  presetHalf: string;
  presetOne: string;
  presetAll: string;
  quantitySoldLabel: string;
  quantitySoldPlaceholder: string;
  soldDetails: string;
  remainingStockText: string;

  // Low Stock & Slow Moving Screens
  lowStockSubtitle: string;
  itemsNeedAttention: string;
  allGoodStock: string;
  allGoodStockSubtitle: string;
  slowMovingSubtitle: string;
  productsNeedMovement: string;
  allProductsMoving: string;
  allProductsMovingSubtitle: string;
  lastSoldDaysAgo: string;

  // Status Badges
  statusInStock: string;
  statusLowStock: string;
  statusOutOfStock: string;
  statusNeverSold: string;
  statusSlowMoving: string;

  // Buttons & Controls
  btnCancel: string;

  // Validation Messages
  valEnterName: string;
  valEnterQty: string;
  valEnterThreshold: string;
  valEnterShopName: string;
  valNotEnoughStock: string;
  valQtyPositive: string;
}

export const DICTIONARY: Record<Language, TranslationStrings> = {
  // ==========================================
  // ENGLISH
  // ==========================================
  en: {
    appName: 'DukaanOS',
    tagline: 'Simple stock management for your shop',
    offlineBadge: 'Offline-first • Data stored safely on this device',
    offlineShort: 'Offline',
    welcomeTagline: 'Every Shop\'s Smart Partner',
    welcomeSubtitle: 'Simple inventory management for your everyday shop.',
    welcomeWorksOffline: 'Works Offline',
    welcomeNoInternet: 'No internet? No problem.',
    welcomeOfflineDesc: 'DukaanOS keeps your inventory available even without internet.',
    welcomeShuruKarein: 'Start Setup →',
    welcomeSetupTime: 'Takes less than 1 minute to setup',
    welcomeWhyRetailers: 'Why Indian Retailers Choose DukaanOS',
    welcomeFeatureStockTitle: 'Manage Stock',
    welcomeFeatureStockDesc: 'Keep your products and stock organized.',
    welcomeFeatureSalesTitle: 'Quick Sales',
    welcomeFeatureSalesDesc: 'Record sales in just a few taps.',
    welcomeFeatureAlertsTitle: 'Low Stock Alerts',
    welcomeFeatureAlertsDesc: 'Know which products need attention.',
    welcomeFeatureInsightsTitle: 'Smart Insights',
    welcomeFeatureInsightsDesc: 'Get simple AI-powered inventory recommendations.',
    welcomeStoreSign: 'KIRANA STORE',
    welcomeStoreSub: 'DUKAAN-OS SMART STORE',

    quickSale: 'Quick Sale',
    quickSaleShort: '⚡ Quick Sale',
    quickSaleDesc: 'Record sale and automatically decrease stock',
    products: 'Products',
    productsShort: '📦 Products',
    productsDesc: 'View stock levels for all items',
    addProduct: 'Add Product',
    addProductShort: '➕ Add Product',
    addProductDesc: 'Add new items to your inventory',
    lowStock: 'Low Stock',
    lowStockShort: '⚠ Low Stock',
    lowStockDesc: 'Items needing restock',
    slowMoving: 'Slow Moving',
    slowMovingShort: '🐌 Slow Moving',
    slowMovingDesc: 'No sales in 30+ days or never sold',

    shopSetup: 'Shop Setup',
    shopDetails: 'Store Profile',
    shopSetupSubtitle: 'Configure your local store profile. Everything works 100% offline.',
    shopNameLabel: 'Shop Name',
    shopNamePlaceholder: 'e.g. Gupta General Store',
    shopTypeLabel: 'Shop Type',
    languageLabel: 'Language Preference',
    activeStore: 'Active Store',
    editShop: 'Edit',
    setupShopBannerTitle: 'Setup Your Shop',
    setupShopBannerSubtitle: 'Add your shop name and preferences to personalize DukaanOS',
    btnSaveShop: 'Save Shop Details',
    shopTypeKirana: 'Kirana / Grocery',
    shopTypeGeneral: 'General Store',
    shopTypeDairy: 'Dairy & Milk',
    shopTypeVegetables: 'Fruits & Vegetables',
    shopTypeChemist: 'Stationery & Chemist',
    shopTypeOther: 'Other Retail',

    inventoryHealth: 'Inventory Health',
    quickActions: 'Quick Actions',
    allStockHealthy: 'All stock healthy',
    activeMovement: 'Active movement',
    footerNote: 'DukaanOS • Designed for Indian Small Retailers',
    offlineStorageHeader: 'Local Offline Storage',
    offlineStorageActive: 'Local SQLite storage active (Saved on device)',
    offlineConnecting: 'Connecting to local database...',
    verifiedTables: 'Verified tables',

    productsSubtitle: 'items in inventory',
    btnAddProduct: '+ Add Product',
    btnSale: '⚡ Quick Sale',
    noProductsTitle: 'No products added yet',
    noProductsSubtitle: 'Start adding your shop\'s stock items to keep track of inventory completely offline.',
    btnAddFirstProduct: '+ Add Your First Product',
    currentStock: 'Current Stock',
    threshold: 'Alert Level',
    loadingStock: 'Loading stock...',

    addProductTitle: 'Add New Product',
    addProductSubtitle: 'Add item details with opening stock and alert threshold.',
    productNameLabel: 'Product Name',
    productNamePlaceholder: 'e.g. Basmati Rice, Chana Dal, Sugar',
    unitLabel: 'Unit of Measurement',
    quantityLabel: 'Initial Stock Quantity',
    quantityPlaceholder: 'e.g. 20, 15.5, 0.5',
    thresholdLabel: 'Low Stock Alert Threshold',
    thresholdPlaceholder: 'e.g. 5 (Alerts when stock is at or below this)',
    fractionalTip: 'Tip: Fractional quantities are supported (e.g. 3.5 kg, 0.5 litre)',
    btnSaveProduct: 'Save Product',

    quickSaleSubtitle: 'Select product, enter quantity, record sale',
    stepSelectProduct: '1. Select Product',
    stepEnterQuantity: '2. Enter Sale Quantity',
    searchPlaceholder: 'Search product by name...',
    saleSummary: 'Sale Summary',
    productLabel: 'Product',
    soldLabel: 'Sold Quantity',
    remainingLabel: 'Remaining Stock',
    btnRecordSale: 'Record Sale',
    saleRecordedSuccess: 'Sale Recorded Successfully!',
    btnViewProducts: 'View Products List →',
    noProductsSaleSubtitle: 'You need to add products to your stock before you can record sales.',
    presetQuarter: '+0.25',
    presetHalf: '+0.5',
    presetOne: '+1',
    presetAll: 'All',
    quantitySoldLabel: 'Quantity Sold',
    quantitySoldPlaceholder: 'e.g. 3.5, 1, 0.5 (decimals supported)',
    soldDetails: 'Sold',
    remainingStockText: 'Remaining stock',

    lowStockSubtitle: 'Products that need restocking for your shop',
    itemsNeedAttention: 'items need attention',
    allGoodStock: 'All good!',
    allGoodStockSubtitle: 'No products are currently low on stock. All items are above their alert threshold.',
    slowMovingSubtitle: 'Products with no sales recorded in the last 30+ days or never sold',
    productsNeedMovement: 'products need movement',
    allProductsMoving: 'All products are moving!',
    allProductsMovingSubtitle: 'Great news! Every product in your store has recorded sales within the last 30 days.',
    lastSoldDaysAgo: 'Last sold {days} days ago',

    statusInStock: 'IN STOCK',
    statusLowStock: 'LOW STOCK',
    statusOutOfStock: 'OUT OF STOCK',
    statusNeverSold: 'NEVER SOLD',
    statusSlowMoving: 'SLOW MOVING',

    btnCancel: '← Back',
    valEnterName: 'Please enter product name',
    valEnterQty: 'Please enter valid quantity (e.g. 20 or 16.5)',
    valEnterThreshold: 'Please enter alert threshold (e.g. 5)',
    valEnterShopName: 'Please enter shop name',
    valNotEnoughStock: 'Not enough stock available in store',
    valQtyPositive: 'Quantity must be greater than 0',
  },

  // ==========================================
  // HINDI (Devanagari)
  // ==========================================
  hi: {
    appName: 'DukaanOS',
    tagline: 'आपकी दुकान का सरल स्टॉक प्रबंधन',
    offlineBadge: 'ऑफ़लाइन सुरक्षित • सारा डेटा इस फ़ोन पर सुरक्षित है',
    offlineShort: 'बिना इंटरनेट',
    welcomeTagline: 'हर दुकान का स्मार्ट साथी',
    welcomeSubtitle: 'आपकी रोज़मर्रा की दुकान के लिए सरल स्टॉक प्रबंधन।',
    welcomeWorksOffline: 'बिना इंटरनेट काम करता है',
    welcomeNoInternet: 'इंटरनेट नहीं है? कोई बात नहीं।',
    welcomeOfflineDesc: 'DukaanOS आपके स्टॉक का हिसाब बिना इंटरनेट भी सुरक्षित रखता है।',
    welcomeShuruKarein: 'शुरू करें →',
    welcomeSetupTime: 'सेटअप में 1 मिनट से भी कम समय लगता है',
    welcomeWhyRetailers: 'भारतीय दुकानदार DukaanOS क्यों चुनते हैं',
    welcomeFeatureStockTitle: 'स्टॉक प्रबंधन',
    welcomeFeatureStockDesc: 'अपने सभी सामान और स्टॉक का सही हिसाब रखें।',
    welcomeFeatureSalesTitle: 'त्वरित बिक्री',
    welcomeFeatureSalesDesc: 'बस कुछ ही सेकंड में बिक्री दर्ज करें।',
    welcomeFeatureAlertsTitle: 'कम स्टॉक अलर्ट',
    welcomeFeatureAlertsDesc: 'जानें कौन सा सामान खत्म होने वाला है।',
    welcomeFeatureInsightsTitle: 'स्मार्ट सुझाव',
    welcomeFeatureInsightsDesc: 'इन्वेंटरी के लिए सरल और उपयोगी सुझाव पाएं।',
    welcomeStoreSign: 'किराना स्टोर',
    welcomeStoreSub: 'DUKAAN-OS स्मार्ट स्टोर',

    quickSale: 'त्वरित बिक्री',
    quickSaleShort: '⚡ त्वरित बिक्री',
    quickSaleDesc: 'बिक्री दर्ज करें और स्टॉक अपने आप कम होगा',
    products: 'सामान सूची',
    productsShort: '📦 सामान सूची',
    productsDesc: 'सभी सामान का स्टॉक स्तर देखें',
    addProduct: 'नया सामान जोड़ें',
    addProductShort: '➕ नया सामान',
    addProductDesc: 'इन्वेंटरी में नया सामान जोड़ें',
    lowStock: 'कम स्टॉक',
    lowStockShort: '⚠ कम स्टॉक',
    lowStockDesc: 'सामान जिसे दोबारा मंगाने की ज़रूरत है',
    slowMoving: 'धीमी बिक्री',
    slowMovingShort: '🐌 धीमी बिक्री',
    slowMovingDesc: 'पिछले 30+ दिनों से कोई बिक्री नहीं या कभी नहीं बिका',

    shopSetup: 'दुकान सेटअप',
    shopDetails: 'दुकान विवरण',
    shopSetupSubtitle: 'अपनी स्थानीय दुकान की जानकारी सेट करें। सब कुछ 100% बिना इंटरनेट चलता है।',
    shopNameLabel: 'दुकान का नाम',
    shopNamePlaceholder: 'उदा. गुप्ता किराना स्टोर',
    shopTypeLabel: 'दुकान का प्रकार',
    languageLabel: 'भाषा प्राथमिकता',
    activeStore: 'सक्रिय दुकान',
    editShop: 'बदलें',
    setupShopBannerTitle: 'अपनी दुकान जोड़ें',
    setupShopBannerSubtitle: 'दुकान का नाम और प्राथमिकताएं जोड़कर DukaanOS शुरू करें',
    btnSaveShop: 'दुकान विवरण सेव करें',
    shopTypeKirana: 'किराना स्टोर',
    shopTypeGeneral: 'जनरल स्टोर',
    shopTypeDairy: 'डेयरी और दूध',
    shopTypeVegetables: 'फल और सब्ज़ी',
    shopTypeChemist: 'स्टेशनरी और मेडिकल',
    shopTypeOther: 'अन्य खुदरा',

    inventoryHealth: 'स्टॉक की स्थिति',
    quickActions: 'मुख्य कार्य',
    allStockHealthy: 'सब सामान पर्याप्त है',
    activeMovement: 'सभी सामान बिक रहे हैं',
    footerNote: 'DukaanOS • भारतीय छोटे दुकानदारों के लिए विशेष रूप से निर्मित',
    offlineStorageHeader: 'स्थानीय ऑफ़लाइन स्टोरेज',
    offlineStorageActive: 'स्थानीय SQLite स्टोरेज सक्रिय (फ़ोन पर सुरक्षित)',
    offlineConnecting: 'लोकल डेटाबेस से जुड़ रहे हैं...',
    verifiedTables: 'सत्यापित तालिकाएं',

    productsSubtitle: 'सामान स्टॉक में उपलब्ध',
    btnAddProduct: '+ नया सामान',
    btnSale: '⚡ बिक्री',
    noProductsTitle: 'अभी तक कोई सामान नहीं जोड़ा गया',
    noProductsSubtitle: 'ऑफ़लाइन स्टॉक हिसाब रखने के लिए अपनी दुकान का पहला सामान जोड़ें।',
    btnAddFirstProduct: '+ पहला सामान जोड़ें',
    currentStock: 'वर्तमान स्टॉक',
    threshold: 'अलर्ट स्तर',
    loadingStock: 'स्टॉक लोड हो रहा है...',

    addProductTitle: 'नया सामान जोड़ें',
    addProductSubtitle: 'शुरुआती स्टॉक और कम स्टॉक अलर्ट स्तर के साथ सामान जोड़ें।',
    productNameLabel: 'सामान का नाम',
    productNamePlaceholder: 'उदा. बासमती चावल, चना दाल, चीनी',
    unitLabel: 'माप की इकाई',
    quantityLabel: 'शुरुआती स्टॉक मात्रा',
    quantityPlaceholder: 'उदा. 20, 15.5, 0.5',
    thresholdLabel: 'कम स्टॉक अलर्ट स्तर',
    thresholdPlaceholder: 'उदा. 5 (स्टॉक इतना या इससे कम होने पर अलर्ट मिलेगा)',
    fractionalTip: 'सुझाव: दशमलव मात्रा समर्थित है (उदा. 3.5 kg, 0.5 litre)',
    btnSaveProduct: 'सामान सेव करें',

    quickSaleSubtitle: 'सामान चुनें, मात्रा लिखें, तुरंत बिक्री दर्ज करें',
    stepSelectProduct: '1. सामान चुनें',
    stepEnterQuantity: '2. बिक्री मात्रा लिखें',
    searchPlaceholder: 'नाम से सामान खोजें...',
    saleSummary: 'बिक्री सारांश',
    productLabel: 'सामान',
    soldLabel: 'बिक्री मात्रा',
    remainingLabel: 'बचा हुआ स्टॉक',
    btnRecordSale: 'बिक्री दर्ज करें',
    saleRecordedSuccess: 'बिक्री सफलतापूर्वक दर्ज हुई!',
    btnViewProducts: 'सामान सूची देखें →',
    noProductsSaleSubtitle: 'बिक्री दर्ज करने से पहले आपको अपनी दुकान में सामान जोड़ना होगा।',
    presetQuarter: '+0.25 (पाव)',
    presetHalf: '+0.5 (आधा)',
    presetOne: '+1 (एक)',
    presetAll: 'पूरा',
    quantitySoldLabel: 'बेची गई मात्रा',
    quantitySoldPlaceholder: 'उदा. 3.5, 1, 0.5 (दशमलव समर्थित)',
    soldDetails: 'बिक्री',
    remainingStockText: 'बचा हुआ स्टॉक',

    lowStockSubtitle: 'दुकान का सामान जिसे दोबारा मंगाने की ज़रूरत है',
    itemsNeedAttention: 'सामान पर ध्यान देने की ज़रूरत है',
    allGoodStock: 'सब ठीक है!',
    allGoodStockSubtitle: 'कोई भी सामान कम स्टॉक पर नहीं है। सारा स्टॉक सुरक्षित स्तर पर है।',
    slowMovingSubtitle: 'सामान जिनकी पिछले 30+ दिनों में कोई बिक्री नहीं हुई या कभी नहीं बिका',
    productsNeedMovement: 'सामान की बिक्री धीमी है',
    allProductsMoving: 'सभी सामान बिक रहे हैं!',
    allProductsMovingSubtitle: 'बधाई! आपकी दुकान के सभी सामान पिछले 30 दिनों में बिके हैं। कोई रुका हुआ स्टॉक नहीं है।',
    lastSoldDaysAgo: 'आखिरी बिक्री {days} दिन पहले',

    statusInStock: 'स्टॉक में है',
    statusLowStock: 'कम स्टॉक',
    statusOutOfStock: 'स्टॉक खत्म',
    statusNeverSold: 'कभी नहीं बिका',
    statusSlowMoving: 'धीमी बिक्री',

    btnCancel: '← वापस',
    valEnterName: 'कृपया सामान का नाम लिखें',
    valEnterQty: 'कृपया सही मात्रा लिखें (उदा. 20 या 16.5)',
    valEnterThreshold: 'कृपया अलर्ट मात्रा लिखें (उदा. 5)',
    valEnterShopName: 'कृपया दुकान का नाम लिखें',
    valNotEnoughStock: 'दुकान में इतना सामान उपलब्ध नहीं है',
    valQtyPositive: 'मात्रा 0 से अधिक होनी चाहिए',
  },

  // ==========================================
  // HINGLISH (Natural WhatsApp-style Roman Hindi)
  // ==========================================
  'hi-en': {
    appName: 'DukaanOS',
    tagline: 'Aapki dukaan ka simple stock hisab',
    offlineBadge: 'Offline-first • Data is phone pe safe hai',
    offlineShort: 'Offline',
    welcomeTagline: 'Har Dukaan Ka Smart Saathi',
    welcomeSubtitle: 'Aapki everyday shop ke liye simple stock management.',
    welcomeWorksOffline: 'Offline Kaam Karta Hai',
    welcomeNoInternet: 'Internet nahi hai? Koi problem nahi.',
    welcomeOfflineDesc: 'DukaanOS bina internet bhi aapka saara inventory hisab rakhta hai.',
    welcomeShuruKarein: 'Shuru Karein →',
    welcomeSetupTime: 'Setup mein 1 minute se kam lagta hai',
    welcomeWhyRetailers: 'Indian Retailers DukaanOS Kyun Chunte Hain',
    welcomeFeatureStockTitle: 'Manage Stock',
    welcomeFeatureStockDesc: 'Apne products aur stock ko organized rakhein.',
    welcomeFeatureSalesTitle: 'Quick Sales',
    welcomeFeatureSalesDesc: 'Bas kuch taps mein sale record karein.',
    welcomeFeatureAlertsTitle: 'Low Stock Alerts',
    welcomeFeatureAlertsDesc: 'Jaanein kaunsa samaan khatm hone wala hai.',
    welcomeFeatureInsightsTitle: 'Smart Insights',
    welcomeFeatureInsightsDesc: 'Inventory ke simple smart suggestions paayein.',
    welcomeStoreSign: 'KIRANA STORE',
    welcomeStoreSub: 'DUKAAN-OS SMART STORE',

    quickSale: 'Quick Sale',
    quickSaleShort: '⚡ Quick Sale',
    quickSaleDesc: 'Turant sale record karein aur stock automatically kam hoga',
    products: 'Products List',
    productsShort: '📦 Products',
    productsDesc: 'Sabhi items ka stock level check karein',
    addProduct: 'Product Add Karein',
    addProductShort: '➕ Add Product',
    addProductDesc: 'Apni inventory mein naya item add karein',
    lowStock: 'Kam Stock',
    lowStockShort: '⚠ Kam Stock',
    lowStockDesc: 'Woh items jinka stock kam ho raha hai',
    slowMoving: 'Slow Moving',
    slowMovingShort: '🐌 Slow Moving',
    slowMovingDesc: 'Pichhle 30+ din se nahi bika ya kabhi nahi bika',

    shopSetup: 'Dukaan Setup',
    shopDetails: 'Dukaan Details',
    shopSetupSubtitle: 'Apni local dukaan ki details set karein. Sab kuch 100% offline chalega.',
    shopNameLabel: 'Dukaan Ka Naam',
    shopNamePlaceholder: 'e.g. Gupta General Store',
    shopTypeLabel: 'Dukaan Ka Type',
    languageLabel: 'Language Preference',
    activeStore: 'Active Dukaan',
    editShop: 'Change',
    setupShopBannerTitle: 'Apni Dukaan Setup Karein',
    setupShopBannerSubtitle: 'Dukaan ka naam aur details daal kar DukaanOS start karein',
    btnSaveShop: 'Dukaan Details Save Karein',
    shopTypeKirana: 'Kirana / Grocery',
    shopTypeGeneral: 'General Store',
    shopTypeDairy: 'Dairy & Milk',
    shopTypeVegetables: 'Fruits & Sabzi',
    shopTypeChemist: 'Stationery & Medical',
    shopTypeOther: 'Other Retail',

    inventoryHealth: 'Inventory Health',
    quickActions: 'Quick Actions',
    allStockHealthy: 'Sabhi stock safe hai',
    activeMovement: 'Sabhi samaan regularly bik raha hai',
    footerNote: 'DukaanOS • Indian Small Retailers ke liye banaya gaya',
    offlineStorageHeader: 'Local Offline Storage',
    offlineStorageActive: 'Local SQLite storage active (Phone pe safe hai)',
    offlineConnecting: 'Local database se connect ho rahe hain...',
    verifiedTables: 'Verified tables',

    productsSubtitle: 'items stock mein available',
    btnAddProduct: '+ Product Add Karein',
    btnSale: '⚡ Sale Karein',
    noProductsTitle: 'Abhi tak koi product add nahi kiya',
    noProductsSubtitle: 'Offline hisab-kitab shuru karne ke liye pehla product add karein.',
    btnAddFirstProduct: '+ Pehla Product Add Karein',
    currentStock: 'Current Stock',
    threshold: 'Alert Level',
    loadingStock: 'Stock load ho raha hai...',

    addProductTitle: 'Naya Product Add Karein',
    addProductSubtitle: 'Starting stock aur alert threshold ke sath product add karein.',
    productNameLabel: 'Product Ka Naam',
    productNamePlaceholder: 'e.g. Basmati Rice, Chana Dal, Cheeni',
    unitLabel: 'Unit of Measurement',
    quantityLabel: 'Starting Stock Quantity',
    quantityPlaceholder: 'e.g. 20, 15.5, 0.5',
    thresholdLabel: 'Low Stock Alert Threshold',
    thresholdPlaceholder: 'e.g. 5 (Stock isse kam hone par alert milega)',
    fractionalTip: 'Tip: Point wali quantity chalegi (jaise 3.5 kg, 0.5 litre)',
    btnSaveProduct: 'Product Save Karein',

    quickSaleSubtitle: 'Product select karein, quantity enter karein, sale record karein',
    stepSelectProduct: '1. Product Select Karein',
    stepEnterQuantity: '2. Sale Quantity Enter Karein',
    searchPlaceholder: 'Naam se product search karein...',
    saleSummary: 'Sale Summary',
    productLabel: 'Product',
    soldLabel: 'Sold Quantity',
    remainingLabel: 'Bacha Hua Stock',
    btnRecordSale: 'Sale Record Karein',
    saleRecordedSuccess: 'Sale Successfully Record Ho Gayi!',
    btnViewProducts: 'Products List Dekhein →',
    noProductsSaleSubtitle: 'Sale record karne se pehle dukaan mein products add karein.',
    presetQuarter: '+0.25 (Paav)',
    presetHalf: '+0.5 (Aadha)',
    presetOne: '+1 (Ek)',
    presetAll: 'Poora',
    quantitySoldLabel: 'Bechi Gayi Quantity',
    quantitySoldPlaceholder: 'e.g. 3.5, 1, 0.5 (decimals chalenge)',
    soldDetails: 'Sold',
    remainingStockText: 'Bacha hua stock',

    lowStockSubtitle: 'Woh products jinhe restock karne ki zaroorat hai',
    itemsNeedAttention: 'products par dhyan dein',
    allGoodStock: 'Sab Theek Hai!',
    allGoodStockSubtitle: 'Filhal koi bhi product low stock par nahi hai. Sabhi items safe hain.',
    slowMovingSubtitle: 'Pichhle 30+ dino mein nahi bika ya kabhi nahi bika',
    productsNeedMovement: 'products slow moving hain',
    allProductsMoving: 'Sabhi products regular bik rahe hain!',
    allProductsMovingSubtitle: 'Badhiya! Aapki dukaan ka har product pichhle 30 din mein bika hai.',
    lastSoldDaysAgo: 'Last sale {days} din pehle',

    statusInStock: 'IN STOCK',
    statusLowStock: 'KAM STOCK',
    statusOutOfStock: 'STOCK KHATM',
    statusNeverSold: 'KABHI NAHI BIKA',
    statusSlowMoving: 'SLOW MOVING',

    btnCancel: '← Wapas',
    valEnterName: 'Product ka naam enter karein',
    valEnterQty: 'Valid quantity enter karein (jaise 20 ya 16.5)',
    valEnterThreshold: 'Alert threshold enter karein (jaise 5)',
    valEnterShopName: 'Dukaan ka naam enter karein',
    valNotEnoughStock: 'Dukaan mein itna stock available nahi hai',
    valQtyPositive: 'Quantity 0 se zyada honi chahiye',
  },
};

/**
 * Returns translation strings for the given language. Defaults to Hinglish.
 */
export function getStrings(lang: Language = 'hi-en'): TranslationStrings {
  return DICTIONARY[lang] || DICTIONARY['hi-en'];
}

/**
 * Default strings exported for backward compatibility.
 */
export const Strings: TranslationStrings = DICTIONARY['hi-en'];
