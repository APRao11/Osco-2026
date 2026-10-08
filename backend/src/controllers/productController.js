const db = require("../config/db");

const productQuery = `
  SELECT products.*, crafts.name AS craft_name, crafts.category AS craft_category
  FROM products
  LEFT JOIN crafts ON products.craft_id = crafts.id
`;

function getAllProducts(req, res) {
  try {
    const products = db
      .prepare(`${productQuery} WHERE products.status = 'published' ORDER BY products.id`)
      .all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
}

function getProductById(req, res) {
  const productId = Number(req.params.id);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = db
      .prepare(`${productQuery} WHERE products.id = ?`)
      .get(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve product" });
  }
}

function validateProductFields(body, { creating = false } = {}) {
  const data = {};
  const allowedFields = ["craft_id", "artisan_id", "name", "description", "price", "image", "stock", "status"];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) data[field] = body[field];
  }

  if (creating && (!data.craft_id || !data.artisan_id || !data.name || data.price === undefined)) {
    return { error: "craft_id, artisan_id, name, and price are required" };
  }
  if (data.name !== undefined && (typeof data.name !== "string" || !data.name.trim())) {
    return { error: "Product name is required" };
  }
  if (data.price !== undefined && (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0)) {
    return { error: "Price must be a positive number" };
  }
  if (data.stock !== undefined && (!Number.isInteger(Number(data.stock)) || Number(data.stock) < 0)) {
    return { error: "Stock must be a non-negative integer" };
  }
  if (data.status !== undefined && !["published", "draft"].includes(data.status)) {
    return { error: "Status must be published or draft" };
  }
  if (data.craft_id !== undefined && (!Number.isInteger(Number(data.craft_id)) || Number(data.craft_id) < 1)) {
    return { error: "Invalid craft_id" };
  }
  if (data.artisan_id !== undefined && (!Number.isInteger(Number(data.artisan_id)) || Number(data.artisan_id) < 1)) {
    return { error: "Invalid artisan_id" };
  }

  if (data.name !== undefined) data.name = data.name.trim();
  if (data.description !== undefined) data.description = data.description || null;
  if (data.price !== undefined) data.price = Number(data.price);
  if (data.stock !== undefined) data.stock = Number(data.stock);
  if (data.craft_id !== undefined) data.craft_id = Number(data.craft_id);
  if (data.artisan_id !== undefined) data.artisan_id = Number(data.artisan_id);
  return { data };
}

function getRelatedRecords({ craftId, artisanId }, res) {
  if (craftId !== undefined && !db.prepare("SELECT id FROM crafts WHERE id = ?").get(craftId)) {
    res.status(400).json({ error: "Craft not found" });
    return false;
  }
  if (artisanId !== undefined && !db.prepare("SELECT id FROM artisans WHERE id = ?").get(artisanId)) {
    res.status(400).json({ error: "Artisan not found" });
    return false;
  }
  return true;
}

function createProduct(req, res) {
  const { data, error } = validateProductFields(req.body || {}, { creating: true });
  if (error) return res.status(400).json({ error });

  try {
    if (!getRelatedRecords({ craftId: data.craft_id, artisanId: data.artisan_id }, res)) return;
    const artisan = db.prepare("SELECT name FROM artisans WHERE id = ?").get(data.artisan_id);
    const result = db.prepare(`
      INSERT INTO products (craft_id, artisan_id, name, description, price, image, artisan_name, stock, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.craft_id,
      data.artisan_id,
      data.name,
      data.description ?? null,
      data.price,
      data.image ?? null,
      artisan.name,
      data.stock ?? 0,
      data.status ?? "published",
    );
    const product = db.prepare(`${productQuery} WHERE products.id = ?`).get(result.lastInsertRowid);
    return res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create product" });
  }
}

function updateProduct(req, res) {
  const productId = Number(req.params.id);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  const { data, error } = validateProductFields(req.body || {});
  if (error) return res.status(400).json({ error });
  const fields = Object.keys(data);
  if (fields.length === 0) return res.status(400).json({ error: "No valid product fields provided" });

  try {
    const existingProduct = db.prepare("SELECT id FROM products WHERE id = ?").get(productId);
    if (!existingProduct) return res.status(404).json({ error: "Product not found" });
    if (!getRelatedRecords({ craftId: data.craft_id, artisanId: data.artisan_id }, res)) return;

    const updates = { ...data };
    if (updates.artisan_id !== undefined) {
      updates.artisan_name = db.prepare("SELECT name FROM artisans WHERE id = ?").get(updates.artisan_id).name;
    }
    const updateFields = Object.keys(updates);
    const assignments = updateFields.map((field) => `${field} = @${field}`).join(", ");
    db.prepare(`UPDATE products SET ${assignments} WHERE id = @id`).run({ ...updates, id: productId });
    const product = db.prepare(`${productQuery} WHERE products.id = ?`).get(productId);
    return res.json({ message: "Product updated successfully", product });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product" });
  }
}

function deleteProduct(req, res) {
  const productId = Number(req.params.id);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const result = db.prepare("DELETE FROM products WHERE id = ?").run(productId);
    if (result.changes === 0) return res.status(404).json({ error: "Product not found" });
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return res.status(409).json({ error: "Product has existing orders and cannot be deleted" });
    }
    return res.status(500).json({ error: "Failed to delete product" });
  }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
