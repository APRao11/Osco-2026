const db = require("./db");

const hasTable = (name) =>
  Boolean(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(name));

const hadOrdersTable = hasTable("orders");

db.exec(`
  CREATE TABLE IF NOT EXISTS crafts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    category TEXT,
    location TEXT
  );

  CREATE TABLE IF NOT EXISTS artisans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    location TEXT,
    bio TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    craft_id INTEGER,
    artisan_id INTEGER REFERENCES artisans(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    artisan_name TEXT,
    stock INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (craft_id)
      REFERENCES crafts(id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    artisan_id INTEGER NOT NULL REFERENCES artisans(id) ON DELETE RESTRICT,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT,
    buyer_phone TEXT NOT NULL,
    buyer_address TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const productColumns = new Set(
  db.prepare("PRAGMA table_info(products)").all().map((column) => column.name),
);

if (!productColumns.has("artisan_id")) {
  db.exec("ALTER TABLE products ADD COLUMN artisan_id INTEGER REFERENCES artisans(id) ON DELETE SET NULL");
}

if (!productColumns.has("status")) {
  db.exec("ALTER TABLE products ADD COLUMN status TEXT NOT NULL DEFAULT 'published'");
}

// Legacy seed products were inserted without a stock value, so they inherited 0.
// Give those pre-order demo listings initial stock only once; later zero stock stays sold out.
if (!hadOrdersTable) {
  db.exec("UPDATE products SET stock = 10 WHERE stock = 0");
}

console.log("Database tables ready.");