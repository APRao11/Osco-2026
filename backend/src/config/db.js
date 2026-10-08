const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const defaultDataDir = path.join(__dirname, "../../data");
const databasePath = process.env.OSCO_DB_PATH
  ? path.resolve(process.env.OSCO_DB_PATH)
  : path.join(defaultDataDir, "osco.db");
const dataDir = path.dirname(databasePath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(databasePath);

db.pragma("foreign_keys = ON");

module.exports = db;