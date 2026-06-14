require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 4000;

// ── CORS ── Allow frontend domain
app.use(
  cors({
    origin: [
      "http://nextjs.canvasbagbd.com",
      "https://nextjs.canvasbagbd.com",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "2mb" }));

// ── MySQL Pool ──
let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "127.0.0.1",
      port: parseInt(process.env.MYSQL_PORT || "3306", 10),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }
  return pool;
}

// ── Health Check ──
app.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// ── POST /api/order ── Place a new COD order
app.post("/api/order", async (req, res) => {
  const { name, phone, city, area, address, note, items } = req.body;

  // Basic validation
  if (!name || !phone || !city || !area || !address || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing required order fields." });
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 2500 || subtotal === 0 ? 0 : 80;
  const discount = subtotal >= 3200 ? 250 : 0;
  const total = Math.max(subtotal + deliveryFee - discount, 0);
  const orderId = uuidv4();

  try {
    const db = getPool();

    // Insert order
    await db.query(
      `INSERT INTO orders (id, customer_name, phone, city, area, address, note, status, payment_method, subtotal, delivery_fee, discount, total, attribution)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'cod', ?, ?, ?, ?, '{}')`,
      [orderId, name, phone, city, area, address, note ?? null, subtotal, deliveryFee, discount, total]
    );

    // Insert order items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_name, unit_price, quantity, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.productId,
          item.variantId,
          item.name,
          item.variantName,
          item.price,
          item.quantity,
          item.price * item.quantity,
        ]
      );
    }

    return res.status(201).json({ orderId, total });
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ error: "Database error. Please try again." });
  }
});

// ── Global error handler ──
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

app.listen(PORT, () => {
  console.log(`CanvasBag API running on port ${PORT}`);
});
