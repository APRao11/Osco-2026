const db = require("../config/db");

const productQuery = `
  SELECT products.*, crafts.name AS craft_name, crafts.category AS craft_category,
    product_stories.technique, product_stories.materials,
    product_stories.cultural_significance, product_stories.story_behind_craft,
    product_stories.making_time
  FROM products
  LEFT JOIN crafts ON products.craft_id = crafts.id
  LEFT JOIN product_stories ON product_stories.product_id = products.id
`;

function login(req, res) {
  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const artisan = db
      .prepare(`SELECT id, name, username, location, bio, photo, workshop_name,
        craft_speciality, craft_background, maker_story, years_of_experience
        FROM artisans WHERE username = ? AND password = ?`)
      .get(username.trim(), password);

    if (!artisan) return res.status(401).json({ error: "Invalid username or password" });
    return res.json({ message: "Login successful", artisan });
  } catch (error) {
    return res.status(500).json({ error: "Could not log in" });
  }
}

function getArtisanProfile(req, res) {
  const artisanId = Number(req.params.artisanId);
  if (!Number.isInteger(artisanId) || artisanId < 1) {
    return res.status(400).json({ error: "Invalid artisan ID" });
  }
  try {
    const artisan = db.prepare(`SELECT id, name, username, location, bio, photo,
      workshop_name, craft_speciality, craft_background, maker_story, years_of_experience
      FROM artisans WHERE id = ?`).get(artisanId);
    if (!artisan) return res.status(404).json({ error: "Artisan not found" });
    return res.json({ artisan });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve artisan profile" });
  }
}

function updateArtisanProfile(req, res) {
  const artisanId = Number(req.params.artisanId);
  if (!Number.isInteger(artisanId) || artisanId < 1) {
    return res.status(400).json({ error: "Invalid artisan ID" });
  }

  const allowedFields = new Set([
    "name", "location", "bio", "photo", "workshop_name", "craft_speciality",
    "craft_background", "maker_story", "years_of_experience",
  ]);
  const data = {};
  for (const [key, value] of Object.entries(req.body || {})) {
    if (allowedFields.has(key)) data[key] = value;
  }
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No profile fields provided" });
  }
  for (const [key, value] of Object.entries(data)) {
    if (key === "years_of_experience") {
      if (!Number.isInteger(Number(value)) || Number(value) < 0) {
        return res.status(400).json({ error: "Years of experience must be a non-negative integer" });
      }
      data[key] = Number(value);
    } else if (value !== null && typeof value !== "string") {
      return res.status(400).json({ error: `${key} must be a string` });
    } else if (typeof value === "string") {
      const maxLength = key === "photo" ? 4900000 : 5000;
      if (value.length > maxLength) return res.status(400).json({ error: `${key} exceeds its maximum length` });
      data[key] = value.trim() || null;
    }
  }
  if (data.name === null) return res.status(400).json({ error: "Artisan name cannot be empty" });

  try {
    const assignments = Object.keys(data).map((key) => `${key} = @${key}`).join(", ");
    const result = db.prepare(`UPDATE artisans SET ${assignments} WHERE id = @id`).run({ ...data, id: artisanId });
    if (result.changes === 0) return res.status(404).json({ error: "Artisan not found" });
    const artisan = db.prepare(`SELECT id, name, username, location, bio, photo,
      workshop_name, craft_speciality, craft_background, maker_story, years_of_experience
      FROM artisans WHERE id = ?`).get(artisanId);
    return res.json({ message: "Artisan profile updated successfully", artisan });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update artisan profile" });
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
    return res.json(products.map((product) => ({
      ...product,
      craft_story: {
        technique: product.technique,
        materials: product.materials,
        cultural_significance: product.cultural_significance,
        story_behind_craft: product.story_behind_craft,
        making_time: product.making_time,
      },
    })));
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

module.exports = { login, getArtisanProfile, updateArtisanProfile, getArtisanProducts, getArtisanOrders };
