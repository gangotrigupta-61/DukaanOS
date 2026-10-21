/**
 * DukaanOS Data Models
 * Designed for offline-first neighbourhood Kirana stores.
 */

export const SUPPORTED_UNITS = [
  'kg',
  'g',
  'litre',
  'ml',
  'pcs',
  'packet',
  'box',
] as const;

export type SupportedUnit = (typeof SUPPORTED_UNITS)[number];

export interface Product {
  id: number;
  name: string;
  /**
   * Supports fractional values (e.g. 20 kg -> sell 3.5 kg -> remaining 16.5 kg)
   */
  quantity: number;
  unit: string;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
}

export type CreateProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export interface Shop {
  id: number;
  shop_name: string;
  shop_type: string;
  language: string;
  created_at: string;
}

export type CreateShopInput = Omit<Shop, 'id' | 'created_at'>;

export interface Sale {
  id: number;
  product_id: number;
  quantity: number;
  created_at: string;
}

export interface RecordSaleInput {
  product_id: number;
  quantity: number;
}

export interface RecordSaleResult {
  sale: Sale;
  product: Product;
  previous_quantity: number;
  remaining_quantity: number;
}

export interface LowStockItem extends Product {
  is_out_of_stock: boolean;
}

export interface SlowMovingItem extends Product {
  last_sale_at: string | null;
  days_since_last_sale: number | null;
  is_never_sold: boolean;
}

export interface InventoryInsights {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  slowMovingCount: number;
  neverSoldCount: number;
}

export interface DatabaseInitResult {
  success: boolean;
  tables: string[];
  error?: string;
}

export type Screen =
  | 'home'
  | 'products'
  | 'add_product'
  | 'shop_setup'
  | 'quick_sale'
  | 'low_stock'
  | 'slow_moving';
