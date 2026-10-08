const db = require("../config/db");

const allowedStatuses = new Set([
  "Pending",
  "Confirmed",
  "In Progress",
  "Ready",
  "Completed",
  "Cancelled",
]);

const orderQuery = `
  SELECT orders.*, products.name AS product_name, products.image AS product_image,
    crafts.name AS craft_name, artisans.name AS artisan_name,
    artisans.location AS artisan_location
  FROM orders
  JOIN products ON products.id = orders.product_id
  JOIN crafts ON crafts.id = products.craft_id
  JOIN artisans ON artisans.id = orders.artisan_id
`;

function createRequestError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function getAllOrders(req, res) {
  try {
    const orders = db.prepare(`${orderQuery} ORDER BY orders.created_at DESC, orders.id DESC`).all();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve orders" });
  }
}

function getOrderById(req, res) {
  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId) || orderId < 1) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const order = db.prepare(`${orderQuery} WHERE orders.id = ?`).get(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve order" });
  }
}

function createOrder(req, res) {
  const body = req.body || {};
  const productId = Number(body.product_id);
  const quantity = Number(body.quantity);
  const buyerName = typeof body.buyer_name === "string" ? body.buyer_name.trim() : "";
  const buyerPhone = typeof body.buyer_phone === "string" ? body.buyer_phone.trim() : "";
  const buyerAddress = typeof body.buyer_address === "string" ? body.buyer_address.trim() : "";
  const buyerEmail = typeof body.buyer_email === "string" ? body.buyer_email.trim() : null;

  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ error: "A valid product_id is required" });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: "Quantity must be a positive integer" });
  }
  if (!buyerName || !buyerPhone || !buyerAddress) {
    return res.status(400).json({ error: "Buyer name, phone, and address are required" });
  }

  try {
    const create = db.transaction(() => {
      const product = db
        .prepare("SELECT id, artisan_id, price, stock, status FROM products WHERE id = ?")
        .get(productId);
      if (!product) throw createRequestError(404, "Product not found");
      if (product.status !== "published") throw createRequestError(400, "This product is not available to order");
      if (!product.artisan_id) throw createRequestError(400, "This product is not linked to an artisan");
      if (quantity > product.stock) throw createRequestError(400, "Requested quantity exceeds available stock");

      const totalPrice = Number((product.price * quantity).toFixed(2));
      const result = db.prepare(`
        INSERT INTO orders (
          product_id, artisan_id, buyer_name, buyer_email, buyer_phone,
          buyer_address, quantity, unit_price, total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        product.id,
        product.artisan_id,
        buyerName,
        buyerEmail || null,
        buyerPhone,
        buyerAddress,
        quantity,
        product.price,
        totalPrice,
      );

      const stockUpdate = db
        .prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?")
        .run(quantity, product.id, quantity);
      if (stockUpdate.changes !== 1) {
        throw createRequestError(400, "Requested quantity exceeds available stock");
      }

      return db.prepare(`${orderQuery} WHERE orders.id = ?`).get(result.lastInsertRowid);
    });

    const order = create();
    return res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    return res.status(500).json({ error: "Failed to create order" });
  }
}

function updateOrderStatus(req, res) {
  const orderId = Number(req.params.id);
  const { status } = req.body || {};

  if (!Number.isInteger(orderId) || orderId < 1) {
    return res.status(400).json({ error: "Invalid order ID" });
  }
  if (typeof status !== "string" || !allowedStatuses.has(status)) {
    return res.status(400).json({ error: "Invalid order status" });
  }

  try {
    const result = db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, orderId);
    if (result.changes === 0) return res.status(404).json({ error: "Order not found" });
    const order = db.prepare(`${orderQuery} WHERE orders.id = ?`).get(orderId);
    return res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update order status" });
  }
}

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus };
