const db = require("../config/db");

const productQuery = `
  SELECT products.*, crafts.name AS craft_name, crafts.category AS craft_category
  FROM products
  LEFT JOIN crafts ON products.craft_id = crafts.id
`;

function login(req, res) {
  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const artisan = db
      .prepare("SELECT id, name, username, location, bio FROM artisans WHERE username = ? AND password = ?")
      .get(username.trim(), password);

    if (!artisan) return res.status(401).json({ error: "Invalid username or password" });
    return res.json({ message: "Login successful", artisan });
  } catch (error) {
    return res.status(500).json({ error: "Could not log in" });
  }
}

function getArtisanProducts(req, res) {
  const artisanId = Number(req.params.artisanId);
  if (!Number.isInteger(artisanId) || artisanId < 1) {
    return res.status(400).json({ error: "Invalid artisan ID" });
  }

  try {
    const artisan = db.prepare("SELECT id FROM artisans WHERE id = ?").get(artisanId);
    if (!artisan) return res.status(404).json({ error: "Artisan not found" });

    const products = db
      .prepare(`${productQuery} WHERE products.artisan_id = ? ORDER BY products.created_at DESC, products.id DESC`)
      .all(artisanId);
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve artisan products" });
  }
}

function getArtisanOrders(req, res) {
  const artisanId = Number(req.params.artisanId);
  if (!Number.isInteger(artisanId) || artisanId < 1) {
    return res.status(400).json({ error: "Invalid artisan ID" });
  }

  try {
    const artisan = db.prepare("SELECT id FROM artisans WHERE id = ?").get(artisanId);
    if (!artisan) return res.status(404).json({ error: "Artisan not found" });

    const orders = db.prepare(`
      SELECT orders.*, products.name AS product_name, products.image AS product_image,
        artisans.name AS artisan_name
      FROM orders
      JOIN products ON products.id = orders.product_id
      JOIN artisans ON artisans.id = orders.artisan_id
      WHERE orders.artisan_id = ?
      ORDER BY orders.created_at DESC, orders.id DESC
    `).all(artisanId);
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve artisan orders" });
  }
}

module.exports = { login, getArtisanProducts, getArtisanOrders };
