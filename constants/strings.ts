/**
 * DukaanOS Bilingual & Hinglish-friendly UI Strings
 * Designed for Indian Kirana & Neighbourhood Retailers.
 */

export const Strings = {
  // Common / Brand
  appName: 'DukaanOS',
  tagline: 'Simple stock management for your shop',
  taglineBilingual: 'Simple stock management • आपकी दुकान का सरल स्टॉक',
  offlineBadge: 'Offline-first • Data stored on this device (बिना इंटरनेट सुरक्षित)',
  offlineShort: 'Offline • बिना इंटरनेट',

  // Navigation & Actions
  quickSale: 'Quick Sale / जल्दी बिक्री',
  quickSaleShort: '⚡ Quick Sale',
  quickSaleDesc: 'Record sale and automatically decrease stock • तुरंत बिक्री दर्ज करें',
  
  products: 'Products / सामान सूची',
  productsShort: '📦 Products',
  productsDesc: 'View stock levels for all items • सारा सामान देखें',

  addProduct: 'Add Product / नया सामान',
  addProductShort: '➕ Add Product',
  addProductDesc: 'Add new items to your inventory • नया सामान जोड़ें',

  lowStock: 'Low Stock / कम स्टॉक',
  lowStockShort: '⚠ Low Stock',
  lowStockDesc: 'Items needing restock • सामान जो खत्म होने वाला है',

  slowMoving: 'Slow Moving / धीमी बिक्री',
  slowMovingShort: '🐌 Slow Moving',
  slowMovingDesc: 'No sales in 30+ days or never sold • सामान जो नहीं बिक रहा',

  shopSetup: 'Shop Setup / दुकान सेटअप',
  shopDetails: 'Store Profile / दुकान विवरण',
  editShop: 'Edit / बदलें',

  // Status Labels
  statusInStock: 'IN STOCK',
  statusLowStock: 'LOW STOCK / कम स्टॉक',
  statusOutOfStock: 'OUT OF STOCK / खत्म',
  statusNeverSold: 'NEVER SOLD / कभी नहीं बिका',
  statusSlowMoving: 'SLOW MOVING / धीमी बिक्री',
  allStockHealthy: 'All stock looks good • सब सामान पर्याप्त है',
  activeMovement: 'Active movement • सभी सामान बिक रहे हैं',

  // Form & Action Buttons
  btnRecordSale: 'Record Sale / बिक्री दर्ज करें',
  btnSaveProduct: 'Save Product / सामान सेव करें',
  btnSaveShop: 'Save Shop Details / दुकान सेव करें',
  btnCancel: '← Back / वापस',
  btnAddFirstProduct: '+ Add Your First Product / पहला सामान जोड़ें',
  btnViewProducts: 'View Products List / सारा सामान देखें →',

  // Validation Messages
  valEnterName: 'Please enter product name • सामान का नाम लिखें',
  valEnterQty: 'Please enter valid quantity • सही मात्रा लिखें (e.g. 20 or 16.5)',
  valEnterThreshold: 'Please enter alert threshold • अलर्ट मात्रा लिखें (e.g. 5)',
  valEnterShopName: 'Please enter shop name • दुकान का नाम लिखें',
  valNotEnoughStock: 'Not enough stock • दुकान में इतना सामान उपलब्ध नहीं है',
  valQtyPositive: 'Quantity must be greater than 0 • मात्रा 0 से अधिक होनी चाहिए',
};
