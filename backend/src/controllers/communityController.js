const db = require("../config/db");

function createCustomOrderRequest(req, res) {
  const body = req.body || {};
  const productId = body.product_id == null || body.product_id === "" ? null : Number(body.product_id);
  const craftId = body.craft_id == null || body.craft_id === "" ? null : Number(body.craft_id);
  const buyerName = typeof body.buyer_name === "string" ? body.buyer_name.trim() : "";
  const buyerContact = typeof body.buyer_contact === "string" ? body.buyer_contact.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (productId !== null && (!Number.isInteger(productId) || productId < 1)) {
    return res.status(400).json({ error: "Invalid product reference" });
  }
  if (craftId !== null && (!Number.isInteger(craftId) || craftId < 1)) {
    return res.status(400).json({ error: "Invalid craft reference" });
  }
  if (productId === null && craftId === null) {
    return res.status(400).json({ error: "A product or craft reference is required" });
  }
  if (!buyerName || buyerName.length > 120) {
    return res.status(400).json({ error: "Buyer name is required and must be under 120 characters" });
  }
  if (!buyerContact || buyerContact.length > 160) {
    return res.status(400).json({ error: "Contact information is required and must be under 160 characters" });
  }
  if (description.length < 10 || description.length > 2000) {
    return res.status(400).json({ error: "Please describe the request in 10 to 2000 characters" });
  }

  try {
    if (productId !== null) {
      const product = db.prepare("SELECT id, craft_id FROM products WHERE id = ?").get(productId);
      if (!product) return res.status(404).json({ error: "Referenced product not found" });
      if (craftId !== null && Number(product.craft_id) !== craftId) {
        return res.status(400).json({ error: "The selected craft does not match the referenced product" });
      }
    }
    if (craftId !== null && !db.prepare("SELECT id FROM crafts WHERE id = ?").get(craftId)) {
      return res.status(404).json({ error: "Referenced craft not found" });
    }
    const result = db.prepare(`INSERT INTO custom_order_requests
      (product_id, craft_id, buyer_name, buyer_contact, description)
      VALUES (?, ?, ?, ?, ?)`)
      .run(productId, craftId, buyerName, buyerContact, description);
    const request = db.prepare("SELECT * FROM custom_order_requests WHERE id = ?").get(result.lastInsertRowid);
    return res.status(201).json({ message: "Custom order request received", request });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save custom order request" });
  }
}

function createArtisanSupport(req, res) {
  const body = req.body || {};
  const artisanId = Number(body.artisan_id);
  const productId = body.product_id == null || body.product_id === "" ? null : Number(body.product_id);
  const supporterName = typeof body.supporter_name === "string" ? body.supporter_name.trim() : "";
  const supporterContact = typeof body.supporter_contact === "string" ? body.supporter_contact.trim() : null;
  const amount = Number(body.amount);

  if (!Number.isInteger(artisanId) || artisanId < 1) return res.status(400).json({ error: "Valid artisan_id is required" });
  if (productId !== null && (!Number.isInteger(productId) || productId < 1)) return res.status(400).json({ error: "Invalid product reference" });
  if (!supporterName || supporterName.length > 120) return res.status(400).json({ error: "Supporter name is required and must be under 120 characters" });
  if (supporterContact && supporterContact.length > 160) return res.status(400).json({ error: "Contact information must be under 160 characters" });
  if (!Number.isFinite(amount) || amount < 1 || amount > 1000000) return res.status(400).json({ error: "Contribution amount must be between ₹1 and ₹1,000,000" });

  try {
    if (!db.prepare("SELECT id FROM artisans WHERE id = ?").get(artisanId)) return res.status(404).json({ error: "Artisan not found" });
    if (productId !== null && !db.prepare("SELECT id FROM products WHERE id = ? AND artisan_id = ?").get(productId, artisanId)) {
      return res.status(400).json({ error: "Product is not linked to this artisan" });
    }
    const result = db.prepare(`INSERT INTO artisan_supports
      (artisan_id, product_id, supporter_name, supporter_contact, amount)
      VALUES (?, ?, ?, ?, ?)`)
      .run(artisanId, productId, supporterName, supporterContact || null, amount);
    return res.status(201).json({
      message: "Demo contribution recorded. No money was transferred.",
      support: db.prepare("SELECT * FROM artisan_supports WHERE id = ?").get(result.lastInsertRowid),
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to record demo contribution" });
  }
}

module.exports = { createCustomOrderRequest, createArtisanSupport };