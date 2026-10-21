import * as SQLite from 'expo-sqlite';
import { DatabaseInitResult } from '../types';

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
