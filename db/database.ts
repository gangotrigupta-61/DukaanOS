import * as SQLite from 'expo-sqlite';
import {
  CreateProductInput,
  CreateShopInput,
  DatabaseInitResult,
  InventoryInsights,
  LowStockItem,
  Product,
  RecordSaleInput,
  RecordSaleResult,
  Sale,
  Shop,
  SlowMovingItem,
} from '../types';

export const DATABASE_NAME = 'dukaanos.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Returns the shared database connection instance.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return dbInstance;
}

/**
 * Initializes the DukaanOS SQLite database schema.
 * - Idempotent: Uses CREATE TABLE IF NOT EXISTS
 * - Preserves existing data (never drops tables)
 * - Safe to run on every startup
 * - quantity is stored as REAL to fully support fractional units (e.g. 3.5 kg)
 */
export async function initDatabase(db?: SQLite.SQLiteDatabase): Promise<DatabaseInitResult> {
  const activeDb = db ?? (await getDatabase());

  try {
    // Enable Write-Ahead Logging for faster writes and concurrency
    await activeDb.execAsync('PRAGMA journal_mode = WAL;');

    // Run schema creation in a transaction
    await activeDb.withTransactionAsync(async () => {
      // Products table with fractional quantity support (REAL)
      await activeDb.execAsync(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          quantity REAL NOT NULL DEFAULT 0,
          unit TEXT NOT NULL DEFAULT 'pcs',
          low_stock_threshold REAL NOT NULL DEFAULT 5,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);

      // Shops table for store profile configuration
      await activeDb.execAsync(`
        CREATE TABLE IF NOT EXISTS shops (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          shop_name TEXT NOT NULL,
          shop_type TEXT NOT NULL DEFAULT 'kirana',
          language TEXT NOT NULL DEFAULT 'en',
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);

      // Sales table for recording completed sales
      await activeDb.execAsync(`
        CREATE TABLE IF NOT EXISTS sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          quantity REAL NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (product_id) REFERENCES products(id)
        );
      `);

      // Helpful indices for fast lookups
      await activeDb.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
        CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
      `);
    });

    const tables = await getExistingTables(activeDb);

    return {
      success: true,
      tables,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      tables: [],
      error: message,
    };
  }
}

/**
 * Inspects sqlite_master to verify existing table names.
 */
export async function getExistingTables(db: SQLite.SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'android_%' ORDER BY name;"
  );
  return rows.map((r) => r.name);
}

// ==========================================
// SHOP OPERATIONS
// ==========================================

/**
 * Fetches the active shop configuration if one exists.
 */
export async function getShop(db?: SQLite.SQLiteDatabase): Promise<Shop | null> {
  const activeDb = db ?? (await getDatabase());
  const row = await activeDb.getFirstAsync<Shop>(
    'SELECT id, shop_name, shop_type, language, created_at FROM shops ORDER BY id ASC LIMIT 1;'
  );
  return row ?? null;
}

/**
 * Saves or updates shop profile information.
 */
export async function saveShop(
  input: CreateShopInput,
  db?: SQLite.SQLiteDatabase
): Promise<Shop> {
  const activeDb = db ?? (await getDatabase());
  const existing = await getShop(activeDb);

  if (existing) {
    await activeDb.runAsync(
      'UPDATE shops SET shop_name = ?, shop_type = ?, language = ? WHERE id = ?;',
      input.shop_name.trim(),
      input.shop_type.trim(),
      input.language.trim(),
      existing.id
    );
    return {
      ...existing,
      shop_name: input.shop_name.trim(),
      shop_type: input.shop_type.trim(),
      language: input.language.trim(),
    };
  }

  const result = await activeDb.runAsync(
    "INSERT INTO shops (shop_name, shop_type, language, created_at) VALUES (?, ?, ?, datetime('now'));",
    input.shop_name.trim(),
    input.shop_type.trim(),
    input.language.trim()
  );

  const inserted = await activeDb.getFirstAsync<Shop>(
    'SELECT id, shop_name, shop_type, language, created_at FROM shops WHERE id = ?;',
    result.lastInsertRowId
  );

  if (!inserted) {
    throw new Error('Failed to retrieve newly created shop profile');
  }

  return inserted;
}

/**
 * Updates the selected language in the active shop profile.
 */
export async function updateShopLanguage(
  language: string,
  db?: SQLite.SQLiteDatabase
): Promise<void> {
  const activeDb = db ?? (await getDatabase());
  await activeDb.runAsync('UPDATE shops SET language = ?;', language.trim());
}

// ==========================================
// PRODUCT OPERATIONS
// ==========================================

/**
 * Retrieves all products sorted alphabetically by name.
 */
export async function getProducts(db?: SQLite.SQLiteDatabase): Promise<Product[]> {
  const activeDb = db ?? (await getDatabase());
  const rows = await activeDb.getAllAsync<Product>(
    'SELECT id, name, quantity, unit, low_stock_threshold, created_at, updated_at FROM products ORDER BY name COLLATE NOCASE ASC;'
  );
  return rows;
}

/**
 * Adds a new product to the inventory.
 * Supports decimal values for quantity and low_stock_threshold.
 */
export async function addProduct(
  input: CreateProductInput,
  db?: SQLite.SQLiteDatabase
): Promise<Product> {
  const activeDb = db ?? (await getDatabase());

  const cleanName = input.name.trim();
  const quantity = Number(input.quantity);
  const unit = input.unit.trim();
  const lowStock = Number(input.low_stock_threshold);

  if (!cleanName) {
    throw new Error('Product name cannot be empty');
  }
  if (isNaN(quantity) || quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }
  if (isNaN(lowStock) || lowStock < 0) {
    throw new Error('Low stock threshold cannot be negative');
  }

  const result = await activeDb.runAsync(
    "INSERT INTO products (name, quantity, unit, low_stock_threshold, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'));",
    cleanName,
    quantity,
    unit,
    lowStock
  );

  const created = await activeDb.getFirstAsync<Product>(
    'SELECT id, name, quantity, unit, low_stock_threshold, created_at, updated_at FROM products WHERE id = ?;',
    result.lastInsertRowId
  );

  if (!created) {
    throw new Error('Failed to retrieve newly created product');
  }

  return created;
}

/**
 * Fetches a single product by ID.
 */
export async function getProductById(
  id: number,
  db?: SQLite.SQLiteDatabase
): Promise<Product | null> {
  const activeDb = db ?? (await getDatabase());
  const row = await activeDb.getFirstAsync<Product>(
    'SELECT id, name, quantity, unit, low_stock_threshold, created_at, updated_at FROM products WHERE id = ?;',
    id
  );
  return row ?? null;
}

// ==========================================
// SALE OPERATIONS
// ==========================================

/**
 * Atomically records a product sale and decreases inventory stock.
 * - Validates product existence
 * - Validates requested quantity > 0
 * - Validates requested quantity <= available stock
 * - Uses SQLite transaction to guarantee atomicity
 * - Stock never becomes negative
 * - Decimal quantities supported (e.g. 3.5 kg, 0.5 litre)
 */
export async function recordSale(
  input: RecordSaleInput,
  db?: SQLite.SQLiteDatabase
): Promise<RecordSaleResult> {
  const activeDb = db ?? (await getDatabase());
  const productId = input.product_id;
  const saleQty = Number(input.quantity);

  if (isNaN(saleQty) || saleQty <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  let resultData: RecordSaleResult | null = null;

  await activeDb.withTransactionAsync(async () => {
    // 1. Fetch current product record
    const product = await activeDb.getFirstAsync<Product>(
      'SELECT id, name, quantity, unit, low_stock_threshold, created_at, updated_at FROM products WHERE id = ?;',
      productId
    );

    if (!product) {
      throw new Error('Product not found');
    }

    // 2. Validate sufficient stock
    if (saleQty > product.quantity) {
      throw new Error(`Not enough stock. Available: ${product.quantity} ${product.unit}`);
    }

    // 3. Compute remaining stock with rounding to avoid IEEE-754 precision artifacts
    const rawRemaining = product.quantity - saleQty;
    const remaining = Math.round(rawRemaining * 1000000) / 1000000;

    // 4. Update product quantity and updated_at
    await activeDb.runAsync(
      "UPDATE products SET quantity = ?, updated_at = datetime('now') WHERE id = ?;",
      remaining,
      productId
    );

    // 5. Insert sale record
    const saleInsert = await activeDb.runAsync(
      "INSERT INTO sales (product_id, quantity, created_at) VALUES (?, ?, datetime('now'));",
      productId,
      saleQty
    );

    const saleRecord = await activeDb.getFirstAsync<Sale>(
      'SELECT id, product_id, quantity, created_at FROM sales WHERE id = ?;',
      saleInsert.lastInsertRowId
    );

    if (!saleRecord) {
      throw new Error('Failed to record sale transaction');
    }

    const updatedProduct = await activeDb.getFirstAsync<Product>(
      'SELECT id, name, quantity, unit, low_stock_threshold, created_at, updated_at FROM products WHERE id = ?;',
      productId
    );

    if (!updatedProduct) {
      throw new Error('Failed to retrieve updated product');
    }

    resultData = {
      sale: saleRecord,
      product: updatedProduct,
      previous_quantity: product.quantity,
      remaining_quantity: remaining,
    };
  });

  if (!resultData) {
    throw new Error('Sale transaction could not be completed');
  }

  return resultData;
}

/**
 * Retrieves all completed sales records.
 */
export async function getSales(db?: SQLite.SQLiteDatabase): Promise<Sale[]> {
  const activeDb = db ?? (await getDatabase());
  const rows = await activeDb.getAllAsync<Sale>(
    'SELECT id, product_id, quantity, created_at FROM sales ORDER BY id DESC;'
  );
  return rows;
}

// ==========================================
// INVENTORY INSIGHTS (Phase 4)
// ==========================================

/**
 * Retrieves products where current quantity <= low_stock_threshold.
 * Out of stock items (quantity = 0) are ordered first, followed by lowest quantity.
 */
export async function getLowStockProducts(
  db?: SQLite.SQLiteDatabase
): Promise<LowStockItem[]> {
  const activeDb = db ?? (await getDatabase());
  const rows = await activeDb.getAllAsync<
    Product & { is_out_of_stock: number }
  >(`
    SELECT 
      id, 
      name, 
      quantity, 
      unit, 
      low_stock_threshold, 
      created_at, 
      updated_at,
      CASE WHEN quantity <= 0 THEN 1 ELSE 0 END AS is_out_of_stock
    FROM products
    WHERE quantity <= low_stock_threshold
    ORDER BY 
      is_out_of_stock DESC, 
      quantity ASC, 
      name COLLATE NOCASE ASC;
  `);

  return rows.map((r) => ({
    ...r,
    is_out_of_stock: r.is_out_of_stock === 1,
  }));
}

/**
 * Retrieves slow-moving products where:
 * - No sale has ever been recorded ("Never Sold")
 * - OR latest sale was recorded >= daysThreshold days ago (default: 30 days)
 */
export async function getSlowMovingProducts(
  daysThreshold: number = 30,
  db?: SQLite.SQLiteDatabase
): Promise<SlowMovingItem[]> {
  const activeDb = db ?? (await getDatabase());
  const rows = await activeDb.getAllAsync<{
    id: number;
    name: string;
    quantity: number;
    unit: string;
    low_stock_threshold: number;
    created_at: string;
    updated_at: string;
    last_sale_at: string | null;
    days_since_last_sale: number | null;
  }>(
    `
    SELECT 
      p.id,
      p.name,
      p.quantity,
      p.unit,
      p.low_stock_threshold,
      p.created_at,
      p.updated_at,
      MAX(s.created_at) AS last_sale_at,
      CASE 
        WHEN MAX(s.created_at) IS NULL THEN NULL 
        ELSE CAST(ROUND(julianday('now') - julianday(MAX(s.created_at))) AS INTEGER) 
      END AS days_since_last_sale
    FROM products p
    LEFT JOIN sales s ON p.id = s.product_id
    GROUP BY p.id
    HAVING MAX(s.created_at) IS NULL 
        OR julianday('now') - julianday(MAX(s.created_at)) >= ?
    ORDER BY 
      CASE WHEN MAX(s.created_at) IS NULL THEN 0 ELSE 1 END ASC,
      days_since_last_sale DESC,
      p.name COLLATE NOCASE ASC;
    `,
    daysThreshold
  );

  return rows.map((r) => ({
    ...r,
    is_never_sold: r.last_sale_at === null,
  }));
}

/**
 * Computes consolidated inventory insight counts from local SQLite data.
 */
export async function getInventoryInsights(
  db?: SQLite.SQLiteDatabase
): Promise<InventoryInsights> {
  const activeDb = db ?? (await getDatabase());
  const lowStock = await getLowStockProducts(activeDb);
  const slowMoving = await getSlowMovingProducts(30, activeDb);
  const totalRow = await activeDb.getFirstAsync<{ count: number }>(
    'SELECT count(*) AS count FROM products;'
  );

  const outOfStockCount = lowStock.filter((i) => i.is_out_of_stock).length;
  const lowStockCount = lowStock.filter((i) => !i.is_out_of_stock).length;
  const neverSoldCount = slowMoving.filter((i) => i.is_never_sold).length;
  const slowMovingCount = slowMoving.filter((i) => !i.is_never_sold).length;

  return {
    totalProducts: totalRow?.count ?? 0,
    lowStockCount,
    outOfStockCount,
    slowMovingCount,
    neverSoldCount,
  };
}
