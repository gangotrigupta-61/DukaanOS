import * as SQLite from 'expo-sqlite';
import { CreateProductInput, CreateShopInput, DatabaseInitResult, Product, Shop } from '../types';

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

      // Helpful indices for fast lookups
      await activeDb.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
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
