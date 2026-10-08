const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/initDB");
const seedDatabase = require("./config/seedDb");
const craftRoutes = require("./routes/craftRoutes");
const productRoutes = require("./routes/productRoutes");
const artisanRoutes = require("./routes/artisanRoutes");
const orderRoutes = require("./routes/orderRoutes");

seedDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/crafts", craftRoutes);
app.use("/api/products", productRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "OSCO backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});