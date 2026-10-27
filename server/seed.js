const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "velvet_vapors_db";

const perfumeData = [
  {
    name: "Noir Mystique",
    brand: "Velvet Vapors",
    price: 4999,
    size: "100ml",
    category: "Woody",
    gender: "For Him",
    scentPyramid: {
      topNotes: ["Black Pepper", "Bergamot", "Cardamom"],
      heartNotes: ["Cedarwood", "Vetiver", "Leather"],
      baseNotes: ["Dark Musk", "Benzoin", "Sandalwood"],
    },
    longevity: "10+ hours",
    sillage: "Strong",
    stock: 18,
    rating: 4.8,
    description: "A brooding, seductive woody fragrance for the modern enigma. Dark spices melt into rich cedarwood before resting on a hypnotic base of leather and musk.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&auto=format&fit=crop",
  },
  {
    name: "Rose Velvet",
    brand: "Velvet Vapors",
    price: 3999,
    size: "100ml",
    category: "Floral",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Bulgarian Rose", "Pink Pepper", "Lychee"],
      heartNotes: ["Peony", "Iris", "Magnolia"],
      baseNotes: ["White Musk", "Sandalwood", "Ambergris"],
    },
    longevity: "8+ hours",
    sillage: "Moderate",
    stock: 25,
    rating: 4.7,
    description: "The quintessential feminine floral. Bulgarian rose blooms over a bed of soft iris and peony, leaving a trail of luminous white musk.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop",
  },
  {
    name: "Saffron Dreams",
    brand: "Velvet Vapors",
    price: 5499,
    size: "100ml",
    category: "Oriental",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Saffron", "Cinnamon", "Cardamom"],
      heartNotes: ["Rose Absolute", "Oud", "Amber"],
      baseNotes: ["Vanilla", "Benzoin", "Patchouli"],
    },
    longevity: "12+ hours",
    sillage: "Projection",
    stock: 12,
    rating: 4.9,
    description: "Liquid gold in a bottle. The intoxicating warmth of Iranian saffron weaves with precious oud and rose before settling into a sumptuous vanilla amber base.",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&auto=format&fit=crop",
  },
  {
    name: "Citrus Bloom",
    brand: "Velvet Vapors",
    price: 3299,
    size: "50ml",
    category: "Fresh",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Sicilian Lemon", "Bergamot", "Grapefruit"],
      heartNotes: ["Jasmine", "Neroli", "Green Tea"],
      baseNotes: ["White Musk", "Oakmoss", "Cedar"],
    },
    longevity: "5-6 hours",
    sillage: "Light",
    stock: 40,
    rating: 4.3,
    description: "A joyful burst of Mediterranean sunshine. Zesty citrus dances with delicate jasmine before fading into a clean, fresh musky finish.",
    image: "https://images.unsplash.com/photo-1566977776052-6e61e35bf9be?w=500&auto=format&fit=crop",
  },
  {
    name: "Oud Royale",
    brand: "Velvet Vapors",
    price: 5999,
    size: "100ml",
    category: "Woody",
    gender: "For Him",
    scentPyramid: {
      topNotes: ["Oud", "Smoky Accord", "Pink Pepper"],
      heartNotes: ["Incense", "Rose", "Leather"],
      baseNotes: ["Amber", "Vetiver", "Dark Musk"],
    },
    longevity: "12+ hours",
    sillage: "Projection",
    stock: 8,
    rating: 4.9,
    description: "The king of all ouds. A commanding, regal scent that blends the smokiest agarwood with rich incense and leather — an olfactory statement of absolute authority.",
    image: "https://images.unsplash.com/photo-1600612253971-8b8e8d49a44b?w=500&auto=format&fit=crop",
  },
  {
    name: "Jasmine Dusk",
    brand: "Velvet Vapors",
    price: 4299,
    size: "100ml",
    category: "Floral",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Night-Blooming Jasmine", "Ylang-Ylang", "Bergamot"],
      heartNotes: ["Gardenia", "Tuberose", "Orris"],
      baseNotes: ["Warm Amber", "Vanilla", "Musk"],
    },
    longevity: "9+ hours",
    sillage: "Moderate",
    stock: 22,
    rating: 4.6,
    description: "Evocative of twilight garden strolls. Night-blooming jasmine and heady tuberose envelop you in a romantic warmth that lingers through the evening.",
    image: "https://images.unsplash.com/photo-1601315379734-425a2064028a?w=500&auto=format&fit=crop",
  },
  {
    name: "Vanilla Aura",
    brand: "Velvet Vapors",
    price: 3799,
    size: "50ml",
    category: "Oriental",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Madagascar Vanilla", "Tonka Bean", "Almond"],
      heartNotes: ["Heliotrope", "Rose", "Jasmine"],
      baseNotes: ["Sandalwood", "White Musk", "Benzoin"],
    },
    longevity: "8+ hours",
    sillage: "Moderate",
    stock: 30,
    rating: 4.5,
    description: "A warm, enveloping gourmand oriental. Rich Madagascar vanilla and creamy tonka bean melt with soft florals into the most comforting scent imaginable.",
    image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=500&auto=format&fit=crop",
  },
  {
    name: "Cedar & Smoke",
    brand: "Velvet Vapors",
    price: 4599,
    size: "100ml",
    category: "Woody",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Birch Tar", "Smoked Elemi", "Black Tea"],
      heartNotes: ["Atlas Cedar", "Guaiac Wood", "Vetiver"],
      baseNotes: ["Iso E Super", "Labdanum", "Ambergris"],
    },
    longevity: "10+ hours",
    sillage: "Strong",
    stock: 15,
    rating: 4.7,
    description: "A bold, architectural woody fragrance that evokes ancient forests and cedar fires. Smoky, raw, and utterly captivating for those who dare to be different.",
    image: "https://images.unsplash.com/photo-1547997985-24b4c2e8ad23?w=500&auto=format&fit=crop",
  },
  {
    name: "Aqua Lumiere",
    brand: "Velvet Vapors",
    price: 3499,
    size: "50ml",
    category: "Fresh",
    gender: "For Him",
    scentPyramid: {
      topNotes: ["Sea Salt", "Aquatic Accord", "Lime"],
      heartNotes: ["Ambrette", "Cyclamen", "Marine Notes"],
      baseNotes: ["Driftwood", "White Musk", "Ambergris"],
    },
    longevity: "6-7 hours",
    sillage: "Light",
    stock: 35,
    rating: 4.2,
    description: "The essence of pristine coastal waters. Crisp sea salt and zesty lime dissolve into a luminous marine heart before anchoring on warm driftwood and ambergris.",
    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500&auto=format&fit=crop",
  },
  {
    name: "Amber Glow",
    brand: "Velvet Vapors",
    price: 4799,
    size: "100ml",
    category: "Oriental",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Bergamot", "Ginger", "Pink Pepper"],
      heartNotes: ["Amber Absolute", "Frankincense", "Ylang-Ylang"],
      baseNotes: ["Labdanum", "Opoponax", "Dark Musk"],
    },
    longevity: "10+ hours",
    sillage: "Projection",
    stock: 20,
    rating: 4.8,
    description: "A luminous amber-soaked masterpiece. Golden ginger and bergamot open like morning light before settling into the deepest, most radiant amber accord you will ever experience.",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&auto=format&fit=crop",
  },
  {
    name: "White Iris",
    brand: "Velvet Vapors",
    price: 3999,
    size: "100ml",
    category: "Floral",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Iris Root", "Violet Leaf", "Aldehydes"],
      heartNotes: ["White Iris", "Lily of the Valley", "Rose"],
      baseNotes: ["Powdery Musk", "Cedarwood", "Sandalwood"],
    },
    longevity: "8+ hours",
    sillage: "Moderate",
    stock: 28,
    rating: 4.4,
    description: "Pure, powdery elegance. The luminous iris root at its most refined — delicate yet complex, with an almost ethereal quality that transcends gender and trend.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop",
  },
  {
    name: "Vetiver Spirit",
    brand: "Velvet Vapors",
    price: 4199,
    size: "100ml",
    category: "Woody",
    gender: "For Him",
    scentPyramid: {
      topNotes: ["Haitian Vetiver", "Violet Leaf", "Grapefruit"],
      heartNotes: ["Tobacco", "Birch", "Leather"],
      baseNotes: ["Smoky Vetiver", "Dark Amber", "Tonka"],
    },
    longevity: "10+ hours",
    sillage: "Strong",
    stock: 17,
    rating: 4.6,
    description: "An earthy, grounding masterwork built around raw Haitian vetiver. Smoky, leathery, and unmistakably masculine — the scent of uncompromising character.",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&auto=format&fit=crop",
  },
];

async function seed() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    const usersCol = db.collection("users");
    const perfumesCol = db.collection("perfumes");

    // Seed perfumes — drop and re-insert
    await perfumesCol.drop().catch(() => {});
    const withDates = perfumeData.map((p) => ({ ...p, createdAt: new Date() }));
    await perfumesCol.insertMany(withDates);
    console.log(`🌹 Seeded ${perfumeData.length} perfumes`);

    // Ensure email index
    await usersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});

    // Upsert admin user
    const adminEmail = "admin@velvetvapors.com";
    const adminPass = await bcrypt.hash("admin123", 10);
    await usersCol.updateOne(
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
    console.log("👑 Admin user ready: admin@velvetvapors.com / admin123");
    console.log("✅ Seed complete!");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    if (require.main === module) {
      await client.close();
      process.exit(0);
    }
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed, perfumeData };
