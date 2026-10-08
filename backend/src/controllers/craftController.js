const db = require("../config/db");

function getAllCrafts(req, res) {
  try {
    const crafts = db.prepare("SELECT * FROM crafts").all();
    res.json(crafts);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve crafts" });
  }
}

function getCraftById(req, res) {
  try {
    const craft = db
      .prepare("SELECT * FROM crafts WHERE id = ?")
      .get(req.params.id);

    if (!craft) {
      return res.status(404).json({ error: "Craft not found" });
    }

    res.json(craft);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve craft" });
  }
}

module.exports = { getAllCrafts, getCraftById };
