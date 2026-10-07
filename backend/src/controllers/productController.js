const db = require("../config/db");

const productQuery = `
  SELECT products.*, crafts.name AS craft_name, crafts.category AS craft_category
  FROM products
  LEFT JOIN crafts ON products.craft_id = crafts.id
`;

function getAllProducts(req, res) {
  try {
    const products = db.prepare(productQuery).all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
}

function getProductById(req, res) {
  try {
    const product = db
      .prepare(`${productQuery} WHERE products.id = ?`)
      .get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve product" });
  }
}

module.exports = { getAllProducts, getProductById };
