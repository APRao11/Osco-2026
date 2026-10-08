require("./initDB");
const db = require("./db");

const crafts = [
  {
    id: "kasuti",
    name: "Kasuti Embroidery",
    description:
      "Intricate hand-stitched stories inspired by Karnataka traditions and coastal heritage.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "beedu",
    name: "Beedu Craft",
    description:
      "Sacred motifs and handcrafted techniques passed through generations of makers.",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "wooden",
    name: "Wooden Craft & Furniture",
    description:
      "Warm, sculpted pieces that celebrate the artistry of coastal woodwork and design.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "palm",
    name: "Palm & Natural-Fibre Crafts",
    description:
      "Earthy, practical heirlooms woven from natural fibres and time-honoured craft.",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "textiles",
    name: "Traditional Textiles",
    description:
      "Textured weaves and dyed fabrics that carry the rhythm of the shoreline and the region.",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "coastal",
    name: "Other Coastal Crafts",
    description:
      "A varied collection of small-batch crafts shaped by coastal culture and daily rituals.",
    image:
      "https://images.unsplash.com/photo-1522383225653-115be1b0c7d6?auto=format&fit=crop&w=900&q=80",
  },
];

const products = [
  {
    name: "Kasuti Wall Hanging",
    craftId: "kasuti",
    price: 2450,
    artisanName: "Meenakshi Nayak",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Beedu Ritual Plate",
    craftId: "beedu",
    price: 980,
    artisanName: "Rukmini Shetty",
    image:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Coastal Wooden Coffee Table",
    craftId: "wooden",
    price: 6200,
    artisanName: "Harish Poojary",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Palm Weave Basket",
    craftId: "palm",
    price: 1320,
    artisanName: "Seema Bhat",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Woven Lantern",
    craftId: "palm",
    price: 1680,
    artisanName: "Naveen Gowda",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Handloom Sari Panel",
    craftId: "textiles",
    price: 2100,
    artisanName: "Suma Kulkarni",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Coastal Clay Jar",
    craftId: "coastal",
    price: 890,
    artisanName: "Lakshmi Pai",
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Sandalwood Keepsake Box",
    craftId: "wooden",
    price: 3200,
    artisanName: "Arun Naik",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kanike Embroidered Pouch",
    craftId: "kasuti",
    price: 1450,
    artisanName: "Anitha Rao",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
];

const seedDatabase = () => {
  const seed = db.transaction(() => {
    const artisanIds = new Map();
    const findArtisan = db.prepare("SELECT id FROM artisans WHERE username = ?");
    const addArtisan = db.prepare(
      "INSERT OR IGNORE INTO artisans (name, username, password, location, bio) VALUES (?, ?, ?, ?, ?)",
    );

    for (const name of new Set(products.map((product) => product.artisanName))) {
      const username = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      addArtisan.run(name, username, "osco-demo", "Coastal Karnataka", "Demo artisan account for the OSCO marketplace.");
      artisanIds.set(name, findArtisan.get(username).id);
    }

    const craftIds = new Map();
    const findCraft = db.prepare("SELECT id FROM crafts WHERE name = ?");
    const addCraft = db.prepare(
      "INSERT INTO crafts (name, description, image, category, location) VALUES (?, ?, ?, ?, ?)"
    );

    for (const craft of crafts) {
      let savedCraft = findCraft.get(craft.name);

      if (!savedCraft) {
        addCraft.run(craft.name, craft.description, craft.image, craft.id, null);
        savedCraft = findCraft.get(craft.name);
      }

      craftIds.set(craft.id, savedCraft.id);
    }

    const findProduct = db.prepare(
      "SELECT id FROM products WHERE name = ? AND craft_id = ?"
    );
    const addProduct = db.prepare(
      "INSERT INTO products (craft_id, artisan_id, name, price, image, artisan_name, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    );
    const linkExistingProduct = db.prepare(
      "UPDATE products SET artisan_id = COALESCE(artisan_id, ?), status = COALESCE(status, 'published') WHERE id = ?",
    );

    for (const product of products) {
      const craftId = craftIds.get(product.craftId);

      if (craftId === undefined) {
        throw new Error(`No craft found for product: ${product.name}`);
      }

      const artisanId = artisanIds.get(product.artisanName);
      const existingProduct = findProduct.get(product.name, craftId);

      if (!existingProduct) {
        addProduct.run(
          craftId,
          artisanId,
          product.name,
          product.price,
          product.image,
          product.artisanName,
          10,
          "published",
        );
      } else {
        linkExistingProduct.run(artisanId, existingProduct.id);
      }
    }
  });

  try {
    seed();
    console.log("Craft, product, and demo artisan data ready.");
    console.log("Demo artisan login: username=meenakshi-nayak password=osco-demo");
    console.log("Demo artisan login: username=rukmini-shetty password=osco-demo");
  } catch (error) {
    console.error("Failed to seed database:", error.message);
    throw error;
  }
};

module.exports = seedDatabase;

if (require.main === module) {
  try {
    seedDatabase();
  } finally {
    db.close();
  }
}
