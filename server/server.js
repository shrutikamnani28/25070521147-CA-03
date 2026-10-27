const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "velvet_vapors_db";
const PORT = process.env.PORT || 5001;
const SECRET = process.env.JWT_SECRET || "VELVET_VAPORS_SECRET";

const ADMIN_EMAILS = ["admin@velvetvapors.com"];

const mongoClient = new MongoClient(MONGO_URI);
const db = () => mongoClient.db(DB_NAME);
const users = () => db().collection("users");
const perfumes = () => db().collection("perfumes");
const orders = () => db().collection("orders");
const reviews = () => db().collection("reviews");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const validId = (id) => ObjectId.isValid(id) && String(id).length === 24;

const publicUser = (u) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  role: u.role,
  wishlist: u.wishlist || [],
  createdAt: u.createdAt,
});

// ─── Middleware ────────────────────────────────────────────────────────────────

async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ msg: "Not authorized, no token" });

  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch {
    return res.status(401).json({ msg: "Token invalid or expired" });
  }

  if (!validId(payload.id)) return res.status(401).json({ msg: "Invalid token" });
  const user = await users().findOne({ _id: new ObjectId(payload.id) });
  if (!user) return res.status(401).json({ msg: "User no longer exists" });

  req.user = user;
  next();
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  res.status(403).json({ msg: "Admin access required" });
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ msg: "Name, email and password are required" });
  if (String(name).trim().length < 2)
    return res.status(400).json({ msg: "Name must be at least 2 characters" });
  if (!/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ msg: "Please enter a valid email" });
  if (String(password).length < 6)
    return res.status(400).json({ msg: "Password must be at least 6 characters" });

  const cleanEmail = String(email).trim().toLowerCase();
  const exists = await users().findOne({ email: cleanEmail });
  if (exists) return res.status(409).json({ msg: "An account with this email already exists" });

  const hashedPass = await bcrypt.hash(password, 10);
  const role = ADMIN_EMAILS.includes(cleanEmail) ? "admin" : "customer";

  const result = await users().insertOne({
    name: String(name).trim(),
    email: cleanEmail,
    password: hashedPass,
    role,
    wishlist: [],
    createdAt: new Date(),
  });

  const newUser = await users().findOne({ _id: result.insertedId });
  const token = jwt.sign({ id: String(newUser._id), email: newUser.email, role: newUser.role }, SECRET, { expiresIn: "7d" });

  res.status(201).json({ token, user: publicUser(newUser), msg: "Account created successfully" });
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Email and password are required" });

  const user = await users().findOne({ email: String(email).trim().toLowerCase() });
  if (!user) return res.status(422).json({ msg: "Invalid email or password" });

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) return res.status(401).json({ msg: "Invalid email or password" });

  const token = jwt.sign({ id: String(user._id), email: user.email, role: user.role }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me
app.get("/api/auth/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// ─── Perfumes Routes ──────────────────────────────────────────────────────────

// GET /api/perfumes
app.get("/api/perfumes", async (req, res) => {
  const { search, category, gender, minPrice, maxPrice, sort } = req.query;
  const filter = {};

  if (search) {
    const re = new RegExp(search, "i");
    filter.$or = [
      { name: re },
      { brand: re },
      { description: re },
      { "scentPyramid.topNotes": re },
      { "scentPyramid.heartNotes": re },
      { "scentPyramid.baseNotes": re },
    ];
  }
  if (category) filter.category = category;
  if (gender) filter.gender = gender;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortObj = { createdAt: -1 };
  if (sort === "price_asc") sortObj = { price: 1 };
  else if (sort === "price_desc") sortObj = { price: -1 };
  else if (sort === "rating") sortObj = { rating: -1 };
  else if (sort === "newest") sortObj = { createdAt: -1 };

  const data = await perfumes().find(filter).sort(sortObj).toArray();
  res.json({ perfumes: data });
});

// GET /api/perfumes/:id
app.get("/api/perfumes/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ msg: "Invalid ID" });
  const p = await perfumes().findOne({ _id: new ObjectId(req.params.id) });
  if (!p) return res.status(404).json({ msg: "Perfume not found" });
  res.json({ perfume: p });
});

// POST /api/perfumes (admin)
app.post("/api/perfumes", protect, adminOnly, async (req, res) => {
  const { name, brand, price, size, category, gender, scentPyramid, longevity, sillage, stock, rating, description, image } = req.body;
  if (!name || !brand || !price || !category || !gender)
    return res.status(400).json({ msg: "name, brand, price, category, gender are required" });

  const doc = {
    name, brand,
    price: Number(price),
    size: size || "100ml",
    category, gender,
    scentPyramid: scentPyramid || { topNotes: [], heartNotes: [], baseNotes: [] },
    longevity: longevity || "6-8 hours",
    sillage: sillage || "Moderate",
    stock: Number(stock) || 20,
    rating: Number(rating) || 4.5,
    description: description || "",
    image: image || "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400",
    createdAt: new Date(),
  };

  const result = await perfumes().insertOne(doc);
  res.status(201).json({ perfume: { ...doc, _id: result.insertedId } });
});

// PUT /api/perfumes/:id (admin)
app.put("/api/perfumes/:id", protect, adminOnly, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ msg: "Invalid ID" });
  const update = { ...req.body };
  delete update._id;
  if (update.price) update.price = Number(update.price);
  if (update.stock) update.stock = Number(update.stock);
  if (update.rating) update.rating = Number(update.rating);

  const result = await perfumes().findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: update },
    { returnDocument: "after" }
  );
  if (!result) return res.status(404).json({ msg: "Perfume not found" });
  res.json({ perfume: result });
});

// DELETE /api/perfumes/:id (admin)
app.delete("/api/perfumes/:id", protect, adminOnly, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ msg: "Invalid ID" });
  const result = await perfumes().deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).json({ msg: "Perfume not found" });
  res.json({ msg: "Perfume deleted" });
});

// ─── Orders Routes ────────────────────────────────────────────────────────────

// POST /api/orders
app.post("/api/orders", protect, async (req, res) => {
  const { items, totalAmount, shippingAddress, couponCode, paymentMethod } = req.body;
  if (!items || !items.length || !shippingAddress)
    return res.status(400).json({ msg: "items and shippingAddress are required" });

  let finalTotal = Number(totalAmount);
  let discountApplied = false;
  if (couponCode && couponCode.toUpperCase() === "VELVET10") {
    finalTotal = Math.round(finalTotal * 0.9);
    discountApplied = true;
  }

  const doc = {
    user: String(req.user._id),
    userName: req.user.name,
    items,
    totalAmount: finalTotal,
    discountApplied,
    couponCode: discountApplied ? "VELVET10" : null,
    shippingAddress,
    paymentMethod: paymentMethod || "COD",
    status: "Placed",
    createdAt: new Date(),
  };

  const result = await orders().insertOne(doc);

  // Decrement stock for each item
  for (const item of items) {
    if (validId(item._id)) {
      await perfumes().updateOne(
        { _id: new ObjectId(item._id) },
        { $inc: { stock: -item.qty } }
      ).catch(() => {});
    }
  }

  res.status(201).json({ order: { ...doc, _id: result.insertedId } });
});

// GET /api/orders/my
app.get("/api/orders/my", protect, async (req, res) => {
  const data = await orders()
    .find({ user: String(req.user._id) })
    .sort({ createdAt: -1 })
    .toArray();
  res.json({ orders: data });
});

// GET /api/orders (admin)
app.get("/api/orders", protect, adminOnly, async (req, res) => {
  const data = await orders().find().sort({ createdAt: -1 }).toArray();
  res.json({ orders: data });
});

// GET /api/orders/:id
app.get("/api/orders/:id", protect, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ msg: "Invalid ID" });
  const order = await orders().findOne({ _id: new ObjectId(req.params.id) });
  if (!order) return res.status(404).json({ msg: "Order not found" });
  if (order.user !== String(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ msg: "Not authorized" });
  res.json({ order });
});

// PUT /api/orders/:id/status (admin)
app.put("/api/orders/:id/status", protect, adminOnly, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ msg: "Invalid ID" });
  const { status } = req.body;
  const valid = ["Placed", "Packed", "Shipped", "Delivered"];
  if (!valid.includes(status)) return res.status(400).json({ msg: "Invalid status" });

  const result = await orders().findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: { status } },
    { returnDocument: "after" }
  );
  if (!result) return res.status(404).json({ msg: "Order not found" });
  res.json({ order: result });
});

// ─── Reviews Routes ───────────────────────────────────────────────────────────

// GET /api/reviews/:perfumeId
app.get("/api/reviews/:perfumeId", async (req, res) => {
  const { perfumeId } = req.params;
  const data = await reviews().find({ perfumeId }).sort({ createdAt: -1 }).toArray();
  res.json({ reviews: data });
});

// POST /api/reviews/:perfumeId
app.post("/api/reviews/:perfumeId", protect, async (req, res) => {
  const { perfumeId } = req.params;
  const { rating, comment } = req.body;
  if (!rating || !comment)
    return res.status(400).json({ msg: "Rating and comment are required" });
  if (Number(rating) < 1 || Number(rating) > 5)
    return res.status(400).json({ msg: "Rating must be between 1 and 5" });

  const doc = {
    perfumeId,
    userName: req.user.name,
    userId: String(req.user._id),
    rating: Number(rating),
    comment: String(comment).trim(),
    createdAt: new Date(),
  };

  const result = await reviews().insertOne(doc);

  // Update perfume average rating
  const allReviews = await reviews().find({ perfumeId }).toArray();
  const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await perfumes().updateOne(
    { _id: new ObjectId(perfumeId) },
    { $set: { rating: Math.round(avgRating * 10) / 10 } }
  ).catch(() => {});

  res.status(201).json({ review: { ...doc, _id: result.insertedId } });
});

// ─── Wishlist Routes ──────────────────────────────────────────────────────────

// GET /api/wishlist
app.get("/api/wishlist", protect, async (req, res) => {
  const user = await users().findOne({ _id: req.user._id });
  const wishlistIds = (user.wishlist || []).filter(validId);
  const items = wishlistIds.length
    ? await perfumes().find({ _id: { $in: wishlistIds.map((id) => new ObjectId(id)) } }).toArray()
    : [];
  res.json({ wishlist: items });
});

// POST /api/wishlist/:perfumeId (toggle)
app.post("/api/wishlist/:perfumeId", protect, async (req, res) => {
  const { perfumeId } = req.params;
  if (!validId(perfumeId)) return res.status(400).json({ msg: "Invalid perfume ID" });

  const user = await users().findOne({ _id: req.user._id });
  const wishlist = user.wishlist || [];
  const idx = wishlist.indexOf(perfumeId);

  let updatedWishlist;
  let action;
  if (idx === -1) {
    updatedWishlist = [...wishlist, perfumeId];
    action = "added";
  } else {
    updatedWishlist = wishlist.filter((id) => id !== perfumeId);
    action = "removed";
  }

  await users().updateOne({ _id: req.user._id }, { $set: { wishlist: updatedWishlist } });
  res.json({ wishlist: updatedWishlist, action });
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// GET /api/admin/users
app.get("/api/admin/users", protect, adminOnly, async (req, res) => {
  const data = await users().find({}, { projection: { password: 0 } }).sort({ createdAt: -1 }).toArray();
  res.json({ users: data });
});

// PUT /api/admin/users/:id/role
app.put("/api/admin/users/:id/role", protect, adminOnly, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ msg: "Invalid ID" });
  if (req.params.id === String(req.user._id))
    return res.status(400).json({ msg: "Cannot change your own role" });

  const { role } = req.body;
  if (!["admin", "customer"].includes(role))
    return res.status(400).json({ msg: "Role must be admin or customer" });

  await users().updateOne({ _id: new ObjectId(req.params.id) }, { $set: { role } });
  res.json({ msg: "Role updated" });
});

// DELETE /api/admin/users/:id
app.delete("/api/admin/users/:id", protect, adminOnly, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ msg: "Invalid ID" });
  if (req.params.id === String(req.user._id))
    return res.status(400).json({ msg: "Cannot delete yourself" });

  const result = await users().deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).json({ msg: "User not found" });
  res.json({ msg: "User deleted" });
});

// GET /api/admin/stats
app.get("/api/admin/stats", protect, adminOnly, async (req, res) => {
  const [totalUsers, totalPerfumes, allOrders] = await Promise.all([
    users().countDocuments(),
    perfumes().countDocuments(),
    orders().find().toArray(),
  ]);
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  res.json({ totalUsers, totalPerfumes, totalOrders, totalRevenue });
});

// ─── Fallbacks ────────────────────────────────────────────────────────────────

app.use((req, res) => res.status(404).json({ msg: "Route not found" }));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ msg: "Server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────

async function startServer() {
  try {
    await mongoClient.connect();
    console.log(`✅ Connected to MongoDB (${DB_NAME})`);

    // Ensure indexes
    await users().createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await perfumes().createIndex({ name: "text", brand: "text" }).catch(() => {});

    // Auto-seed if perfumes collection is empty
    if ((await perfumes().countDocuments()) === 0) {
      console.log("🌸 Fresh database detected, auto-seeding sample perfumes...");
      const { perfumeData } = require("./seed");
      const withDates = perfumeData.map((p) => ({ ...p, createdAt: new Date() }));
      await perfumes().insertMany(withDates);

      const adminEmail = "admin@velvetvapors.com";
      const adminPass = await bcrypt.hash("admin123", 10);
      await users().updateOne(
        { email: adminEmail },
        {
          $set: {
            name: "Velvet Vapors Admin",
            email: adminEmail,
            password: adminPass,
            role: "admin",
            wishlist: [],
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      console.log("👑 Auto-seeded admin user: admin@velvetvapors.com / admin123");
    }

    app.listen(PORT, () => {
      console.log(`🌹 Velvet Vapors server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
