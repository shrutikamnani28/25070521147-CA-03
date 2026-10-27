const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "velvet_vapors_db";

const perfumeData = [
  {
    name: "Oud Wood",
    brand: "Tom Ford",
    price: 6499,
    size: "100ml",
    category: "Woody",
    gender: "For Him",
    scentPyramid: {
      topNotes: ["Rosewood", "Cardamom", "Chinese Pepper"],
      heartNotes: ["Agarwood (Oud)", "Sandalwood", "Vetiver"],
      baseNotes: ["Tonka Bean", "Vanilla", "Amber"],
    },
    longevity: "10+ hours",
    sillage: "Strong",
    stock: 18,
    rating: 4.9,
    description: "One of the most rare, precious, and expensive ingredients in a perfumer's arsenal. Smoky oud wood and cardamom combine with exotic rosewood before melting into a creamy tonka bean and amber drydown.",
    image: "/perfumes/79117140_21505-10181-2-680x680.png",
  },
  {
    name: "By the Fireplace",
    brand: "Maison Margiela",
    price: 5199,
    size: "100ml",
    category: "Oriental",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Pink Pepper", "Orange Flower Petals", "Clove Oil"],
      heartNotes: ["Chestnut Accord", "Guaiac Wood", "Cade Oil"],
      baseNotes: ["Vanilla Accord", "Peru Balsam", "Cashmeran"],
    },
    longevity: "10+ hours",
    sillage: "Projection",
    stock: 20,
    rating: 4.8,
    description: "Part of the REPLICA collection, By the Fireplace evokes cozy winter evenings by a crackling hearth in Chamonix. The smoky warmth of roasted chestnuts and pink pepper is softened by sweet vanilla and cashmeran.",
    image: "/perfumes/7722169b62744a1f4d59124bbf636879.jpg",
  },
  {
    name: "Pure Musc For Her",
    brand: "Narciso Rodriguez",
    price: 5499,
    size: "100ml",
    category: "Floral",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Clean White Musk", "Orange Blossom"],
      heartNotes: ["White Flowers", "Grasse Jasmine", "Ylang-Ylang"],
      baseNotes: ["Cashmeran", "White Cedar", "Amber"],
    },
    longevity: "9+ hours",
    sillage: "Moderate",
    stock: 25,
    rating: 4.8,
    description: "The ultimate tribute to the signature Narciso musk. A heart of hypnotic musc is illuminated with a bouquet of white flowers and warmed with velvety cashmeran on skin.",
    image: "/perfumes/dark-375x500.53441.2x.avif",
  },
  {
    name: "Musc Noir For Her",
    brand: "Narciso Rodriguez",
    price: 5299,
    size: "100ml",
    category: "Oriental",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Luscious Plum", "Bergamot"],
      heartNotes: ["Signature Musk", "Heliotrope", "Rose"],
      baseNotes: ["Leather Suede", "Cedarwood", "Patchouli"],
    },
    longevity: "8+ hours",
    sillage: "Moderate",
    stock: 22,
    rating: 4.7,
    description: "An intensely sensual interpretation of feminine mystery. A top note of juicy plum mingles with heliotrope and musk, resting upon an intoxicating base of dark leather suede.",
    image: "/perfumes/dark-t.64730.2x.avif",
  },
  {
    name: "Orphéon",
    brand: "Diptyque",
    price: 6299,
    size: "75ml",
    category: "Woody",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Juniper Berries", "Pink Pepper", "Green Mandarin"],
      heartNotes: ["Powdery Jasmine", "Magnolia", "Rose"],
      baseNotes: ["Tonka Bean", "Atlas Cedar", "Warm Amber", "Musk"],
    },
    longevity: "10+ hours",
    sillage: "Strong",
    stock: 14,
    rating: 4.9,
    description: "An olfactory portrait of the legendary 1960s Parisian jazz club beside the original Diptyque boutique. Evokes warm curls of tobacco smoke, powdery stage cosmetics, and polished wood tables.",
    image: "/perfumes/dark-t.65738.2x.avif",
  },
  {
    name: "Apollonia",
    brand: "Xerjoff",
    price: 7499,
    size: "50ml",
    category: "Floral",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["White Flowers", "Ethereal Ozone Accord"],
      heartNotes: ["Italian Orris Root Butter", "Powdery Iris"],
      baseNotes: ["Luminous White Musk", "Cosmic Amber"],
    },
    longevity: "10+ hours",
    sillage: "Moderate",
    stock: 10,
    rating: 4.9,
    description: "Crafted to commemorate the Apollo moon landing, Apollonia evokes the serene, enchanting beauty of the moonlit cosmos. Ethereal white flowers and butter-soft orris float over a celestial white musk.",
    image: "/perfumes/dark-t.55970.2x.avif",
  },
  {
    name: "The Favourite",
    brand: "Penhaligon's",
    price: 6899,
    size: "100ml",
    category: "Floral",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Violet", "Freesia", "Mandarin Orange"],
      heartNotes: ["Golden Mimosa", "Iris", "Jasmine Sambac"],
      baseNotes: ["Velvet Musk", "Indian Sandalwood", "Ambroxan"],
    },
    longevity: "9+ hours",
    sillage: "Moderate",
    stock: 16,
    rating: 4.8,
    description: "Inspired by Sarah Churchill, Duchess of Marlborough. A majestic, powdery golden floral blending sweet mimosa and velvety iris wrapped in regal musk and sandalwood.",
    image: "/perfumes/dark-t.59836.2x.avif",
  },
  {
    name: "Princess",
    brand: "By Kilian",
    price: 6599,
    size: "100ml",
    category: "Oriental",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Spicy Fresh Ginger", "Lemon", "Crisp Apple"],
      heartNotes: ["Ceremonial Matcha Green Tea", "Jasmine", "Hedione"],
      baseNotes: ["Fluffy Marshmallow", "Tahitian Vanilla", "Benzoin"],
    },
    longevity: "9+ hours",
    sillage: "Moderate",
    stock: 15,
    rating: 4.8,
    description: "'I don't need a prince by my side to be a princess.' A bold, sweet, and spirited gourmand where sharp spicy ginger and earthy matcha tea melt into a cloud of airy marshmallow and vanilla.",
    image: "/perfumes/dark-t.90174.2x.avif",
  },
  {
    name: "L'Homme L'Eau",
    brand: "Prada",
    price: 4899,
    size: "100ml",
    category: "Fresh",
    gender: "For Him",
    scentPyramid: {
      topNotes: ["Italian Neroli", "Red Ginger", "Cardamom"],
      heartNotes: ["Tuscan Iris", "Amber", "Geranium"],
      baseNotes: ["Powdery Sandalwood", "Cedarwood", "Clean Amber"],
    },
    longevity: "7-8 hours",
    sillage: "Moderate",
    stock: 28,
    rating: 4.6,
    description: "The ultimate clean-linen luxury fragrance. Crisp Italian neroli and vibrant ginger give way to Prada's signature powdery iris, anchored by creamy sandalwood and warm cedar.",
    image: "/perfumes/dark-t.46400.2x.avif",
  },
  {
    name: "Iris Crush",
    brand: "Jimmy Choo",
    price: 5699,
    size: "125ml",
    category: "Floral",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Freesia", "Neroli", "Pink Pepper"],
      heartNotes: ["Noble Iris", "Heliotrope", "Violet Petals"],
      baseNotes: ["Powdery Tonka Bean", "Bourbon Vanilla", "Musk"],
    },
    longevity: "9+ hours",
    sillage: "Strong",
    stock: 19,
    rating: 4.7,
    description: "Part of the high-perfumery Seduction Collection. A glamorous floral built around velvety lipstick iris, touched with sparkling pink pepper and indulgent vanilla tonka.",
    image: "/perfumes/dark-t.60129.2x.avif",
  },
  {
    name: "Molecule 05",
    brand: "Escentric Molecules",
    price: 5199,
    size: "100ml",
    category: "Woody",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Pine Resin Breeze", "Crisp Ozone"],
      heartNotes: ["100% Pure Cashmeran Molecule"],
      baseNotes: ["Warm Dry Woods", "Velvety Musk"],
    },
    longevity: "10+ hours",
    sillage: "Strong",
    stock: 24,
    rating: 4.7,
    description: "A minimalist masterpiece consisting solely of the pure Cashmeran molecule. Evokes the warmth of Mediterranean sea cliffs, sun-baked pine needles, and dry woody musky air.",
    image: "/perfumes/dark-t.58969.2x.avif",
  },
  {
    name: "Love, Chloé",
    brand: "Chloé",
    price: 4799,
    size: "75ml",
    category: "Floral",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Pink Pepper", "African Orange Flower"],
      heartNotes: ["Iris", "Lilac", "Hyacinth", "Wisteria"],
      baseNotes: ["Powdery Rice Accord", "White Musk", "Heliotrope"],
    },
    longevity: "8+ hours",
    sillage: "Moderate",
    stock: 17,
    rating: 4.8,
    description: "A celebration of radiant femininity and vintage cosmetic glamour. A powdery cloud of lilac, wisteria, and iris dusted with rice powder and delicate pink pepper.",
    image: "/perfumes/dark-t.9370.2x.avif",
  },
  {
    name: "Lefko",
    brand: "Korres",
    price: 3999,
    size: "50ml",
    category: "Fresh",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Lily of the Valley", "Crisp Aegean Breeze"],
      heartNotes: ["White Rose", "Garden Peony"],
      baseNotes: ["Powdery Musk", "White Sandalwood"],
    },
    longevity: "7+ hours",
    sillage: "Light",
    stock: 35,
    rating: 4.5,
    description: "Inspired by the Greek word for 'white' and sun-drenched Aegean islands. Smells of fresh white laundry billowing in the sea breeze, white roses, and gentle sandalwood.",
    image: "/perfumes/dark-t.83336.2x.avif",
  },
  {
    name: "Khalis Musk",
    brand: "Lattafa",
    price: 3499,
    size: "100ml",
    category: "Oriental",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Pure White Musk", "Soft Damask Rose Water"],
      heartNotes: ["Powdery Amber", "Violet Petals", "Light Florals"],
      baseNotes: ["Velvet White Musk", "Sweet Vanilla Orchid", "Cedarwood"],
    },
    longevity: "8+ hours",
    sillage: "Moderate",
    stock: 32,
    rating: 4.6,
    description: "A legendary Arabian clean-musk fragrance. Housed in a signature bottle with floating crystal pearls, Khalis Musk envelops you in the ultimate fresh powdery white musk aura.",
    image: "/perfumes/dark-t.25880.2x.avif",
  },
  {
    name: "Vanilla Musk",
    brand: "Nemat International",
    price: 3299,
    size: "50ml",
    category: "Oriental",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Creamy Madagascar Vanilla", "Golden Sugar"],
      heartNotes: ["Warm Gourmand Baked Accord", "Tonka Bean"],
      baseNotes: ["Clean Skin Musk", "Soft White Amber"],
    },
    longevity: "8+ hours",
    sillage: "Moderate",
    stock: 40,
    rating: 4.7,
    description: "A world-famous artisanal gourmand perfume crafted with rich, authentic vanilla and warm skin musk. Indulgent, comforting, and deeply addictive.",
    image: "/perfumes/dark-t.43554.2x.avif",
  },
  {
    name: "L'Heure de Nuit",
    brand: "Guerlain",
    price: 7999,
    size: "125ml",
    category: "Floral",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Orange Blossom", "Calabrian Bergamot"],
      heartNotes: ["Florentine Iris", "Heliotrope", "May Rose", "Jasmine"],
      baseNotes: ["White Musk", "Sandalwood", "Bourbon Vanilla"],
    },
    longevity: "10+ hours",
    sillage: "Moderate",
    stock: 12,
    rating: 4.9,
    description: "Thierry Wasser's poetic modern reinterpretation of the historic L'Heure Bleue. The twilight magic of Paris captured in sweet orange blossom, iris, and Guerlain's legendary vanilla musk.",
    image: "/perfumes/dark-t.16990.2x.avif",
  },
  {
    name: "Météorites",
    brand: "Guerlain",
    price: 6199,
    size: "100ml",
    category: "Floral",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Crisp Green Apple", "Bergamot", "Violet Leaf"],
      heartNotes: ["Candied Violet", "Mimosa", "French Rose"],
      baseNotes: ["Orris Root", "White Musk", "Precious Wood"],
    },
    longevity: "8+ hours",
    sillage: "Moderate",
    stock: 18,
    rating: 4.8,
    description: "The iconic, nostalgic fragrance of Guerlain's world-famous Météorites powder pearls. A delicate, intoxicating veil of candied violets, mimosa, and aristocratic orris.",
    image: "/perfumes/dark-t.4045.2x.avif",
  },
  {
    name: "Bare Vanilla",
    brand: "Victoria's Secret",
    price: 2899,
    size: "100ml",
    category: "Oriental",
    gender: "For Her",
    scentPyramid: {
      topNotes: ["Whipped Vanilla", "Apple Blossom"],
      heartNotes: ["Vanilla Orchid", "Cashmere Fluff"],
      baseNotes: ["Spun Sugar", "Soft Cashmeran", "Warm Skin Musk"],
    },
    longevity: "7+ hours",
    sillage: "Moderate",
    stock: 45,
    rating: 4.6,
    description: "The iconic, cozy amber gourmand classic. Soft, whipped vanilla meets warm cashmeran for an effortlessly comforting and feminine everyday skin scent.",
    image: "/perfumes/dark-t.56836.2x.avif",
  },
  {
    name: "What the Fluff",
    brand: "Aspiring Aromas",
    price: 4499,
    size: "50ml",
    category: "Oriental",
    gender: "Unisex",
    scentPyramid: {
      topNotes: ["Fluffy Marshmallow", "Powdered Sugar"],
      heartNotes: ["Whipped Sweet Cream", "Vanilla Meringue"],
      baseNotes: ["Tahitian Vanilla Bean", "White Musk"],
    },
    longevity: "8+ hours",
    sillage: "Moderate",
    stock: 20,
    rating: 4.8,
    description: "A viral artisanal gourmand masterpiece built entirely around a photorealistic, pillowy marshmallow accord with whipped sweet cream and Tahitian vanilla.",
    image: "/perfumes/dark-t.115009.2x.avif",
  },
];

// Sample Patron Reviews for each perfume
const perfumeReviewsMap = {
  "Oud Wood": [
    { userName: "Devendra Kapoor", rating: 5, comment: "Tom Ford Oud Wood is pure aristocratic luxury. The blend of smoky agarwood, cardamom, and rosewood is unmatched. Sprayed it before a black-tie gala and received numerous compliments. Lasts over 11 hours on wool suits." },
    { userName: "Tanvi Mehra", rating: 5, comment: "Dark, smooth, and breathtakingly sophisticated. Unlike aggressive animalic ouds, Tom Ford's composition is velvety and balanced with tonka bean. Stays close to the skin as an alluring aura all night." },
    { userName: "Arjun Shenoy", rating: 4, comment: "A modern classic that defines niche woody fragrances. Sillage is potent for the first 4 hours before transitioning into an intimate, warm sandalwood and amber drydown. Worth every single rupee." },
    { userName: "Rhea Malhotra", rating: 5, comment: "Gifted this bottle to my partner and we ended up sharing it! The cardamom and Chinese pepper give it a spicy kick that dries down into the coziest vanilla amber base. An absolute masterpiece." },
  ],
  "By the Fireplace": [
    { userName: "Bhavna Saxena", rating: 5, comment: "Maison Margiela By the Fireplace smells exactly like roasted chestnuts over a crackling wood fire. The smoky guaiac wood and sweet Bourbon vanilla create pure cozy nostalgia." },
    { userName: "Rajiv Chawla", rating: 5, comment: "A masterclass in evocative niche perfumery. The pink pepper and clove opening is delightfully spicy, evolving into a creamy cashmeran and Peru balsam drydown that lasts 10+ hours." },
    { userName: "Meenakshi Sharma", rating: 5, comment: "The ultimate cold-weather fragrance. Wrapping yourself in a cashmere scarf with two sprays of By the Fireplace is the height of comfort and indulgence." },
    { userName: "Sanjay Dutta", rating: 4, comment: "Incredibly atmospheric and authentic. It doesn't smell synthetic at all; you literally feel the warmth of amber and embers. Exceptional creation." },
  ],
  "Pure Musc For Her": [
    { userName: "Dr. Meera Nambiar", rating: 5, comment: "Narciso Rodriguez Pure Musc is pure understated elegance. The clean white flowers and velvet cashmeran bloom into the most angelic skin scent. I wear this every day to my clinic." },
    { userName: "Pooja Hegde", rating: 5, comment: "The cleanest, most comforting musk ever created. It smells like luxury Egyptian cotton sheets dried in the morning sun. Received compliments from colleagues immediately." },
    { userName: "Ananya Iyer", rating: 4, comment: "Subtle yet tenacious. Stays close to the body for a solid 9 hours. If you love white floral musks, this is an indispensable masterpiece." },
  ],
  "Musc Noir For Her": [
    { userName: "Tara Singhal", rating: 5, comment: "The dark plum opening combined with heliotrope and soft leather suede is intoxicating. Much more mysterious and seductive than typical designer florals." },
    { userName: "Natasha Fernandes", rating: 5, comment: "Wore this to a rooftop dinner in Mumbai and it was an instant confidence booster. The plum and suede accord feels couture, rich, and unforgettable." },
    { userName: "Kavita Rao", rating: 4, comment: "Sensual, velvety, and deeply feminine. Sillage is intimate but leaves an addictive scent trail whenever you walk by." },
  ],
  "Orphéon": [
    { userName: "Vikram Sethi", rating: 5, comment: "Diptyque Orphéon captures vintage Parisian jazz clubs with incredible accuracy. Juniper berries and cedar mingle with powdery jasmine and tonka. A true artistic triumph." },
    { userName: "Pallavi Das", rating: 5, comment: "Unisex perfection. It has a clean, intellectual, bohemian charm that stands out from everything else. Stays strong for 10 hours effortlessly." },
    { userName: "Nikhil Parekh", rating: 4, comment: "The drydown of powdery cedar and warm tonka bean is sublime. Diptyque's craftsmanship shines in every phase of this fragrance." },
  ],
  "Apollonia": [
    { userName: "Zoya Merchant", rating: 5, comment: "Xerjoff Apollonia is otherworldly. The butter-soft Italian orris and white flowers smell like moon dust and celestial silence. Pure quiet luxury." },
    { userName: "Kunal Varma", rating: 5, comment: "The finest white musk on the market today. Delicate, powdery, and aristocratic. You immediately feel the high concentration of natural raw materials." },
    { userName: "Farhan Qureshi", rating: 4, comment: "Cosmic elegance in a bottle. Not loud or aggressive, but it lingers like a luminous silver halo for over 10 hours." },
  ],
  "The Favourite": [
    { userName: "Ananya Sen", rating: 5, comment: "Penhaligon's The Favourite is British royalty bottled. Sweet mimosa and violet dance with iris and sandalwood. Soft, regal, and deeply feminine." },
    { userName: "Priyanka Joshi", rating: 5, comment: "The velvet pink bow on the bottle matches the fragrance perfectly. Powdery, golden, and uplifting. A staple for garden teas and formal afternoons." },
    { userName: "Vikramaditya Roy", rating: 4, comment: "Bought this for my wife. The unboxing felt like opening a historic treasure, and the mimosa floral heart is truly delightful." },
  ],
  "Princess": [
    { userName: "Aarav Singhania", rating: 5, comment: "By Kilian Princess is sweet gourmand perfection. The spicy ginger and matcha green tea cut through the fluffy marshmallow so it never feels cloying. Outstanding!" },
    { userName: "Simran Bedi", rating: 5, comment: "I am completely addicted to this marshmallow matcha accord. Projects like a dreamy confectionary cloud for 9 hours. Endless compliments!" },
    { userName: "Esha Mukherjee", rating: 4, comment: "Fun, flirtatious, and luxurious. The marshmallow drydown with vanilla and benzoin is the ultimate cozy scent for cold nights." },
  ],
  "L'Homme L'Eau": [
    { userName: "Rohan Chhabra", rating: 5, comment: "Prada L'Homme L'Eau is the gold standard of fresh office fragrances. The Italian neroli and red ginger give way to clean powdery iris that smells like crisp bespoke tailoring." },
    { userName: "Maya Kulkarni", rating: 4, comment: "Clean, professional, and refined. Never causes headaches and projects a gentle, spotless aura of modern poise." },
    { userName: "Aditya Nair", rating: 5, comment: "My daily signature scent. The combination of iris and cedarwood is timeless. Stays crisp and fresh throughout long workdays." },
  ],
  "Iris Crush": [
    { userName: "Madhuri Hegde", rating: 5, comment: "Jimmy Choo Iris Crush is glamour in liquid form. The velvety lipstick iris and pink pepper dry down into decadent vanilla tonka bean. An unforgettable evening scent." },
    { userName: "Gauri Nambiar", rating: 5, comment: "Dramatic, luxurious, and opulent. The bottle is heavy crystal and the sillage commands attention in any room. 10/10!" },
    { userName: "Akash Khanna", rating: 4, comment: "Rich and feminine. The floral heart has a velvety cosmetic texture that my partner absolutely loves. Projects for over 8 hours." },
  ],
  "Molecule 05": [
    { userName: "Colonel R. K. Bakshi", rating: 5, comment: "Escentric Molecules Molecule 05 is fascinating. Just pure Cashmeran, yet it evokes pine resin, sun-drenched coastal rocks, and warm dry wood. Truly unique." },
    { userName: "Karthik Raman", rating: 4, comment: "Minimalist and modern. People notice a clean, woody, slightly pine-infused aura around you without knowing you're wearing perfume." },
    { userName: "Zara Contractor", rating: 5, comment: "The ultimate skin scent. Warm, cozy, and woody. Great on its own or layered under sweet vanillas to add grounding depth." },
  ],
  "Love, Chloé": [
    { userName: "Shalini Kashyap", rating: 5, comment: "Love, Chloé is the crown jewel of powdery vintage florals. The lilac, hyacinth, and rice powder create a delicate, nostalgic cloud that feels like pure romance." },
    { userName: "Varun Agnihotri", rating: 4, comment: "Classy, delicate, and timeless. Smells like luxury cosmetic powder and fresh spring blossoms. A rare beauty." },
    { userName: "Anuradha Bose", rating: 5, comment: "I searched for years to find a perfume that captures soft wisteria and rice powder like this. An absolute masterclass." },
  ],
  "Lefko": [
    { userName: "Siddharth Verma", rating: 5, comment: "Korres Lefko smells like the Greek islands in spring. Lily of the valley and white roses blown by an Aegean sea breeze onto crisp white cotton. Sublime!" },
    { userName: "Manish Bhatia", rating: 4, comment: "Fresh, airy, and calming. Perfect for hot humid days when you want something uplifting, natural, and never heavy." },
    { userName: "Divya Sundaram", rating: 5, comment: "The white sandalwood and musk base is so soothing. An effortless daytime fragrance for anyone who loves crisp clean scents." },
  ],
  "Khalis Musk": [
    { userName: "Sameer Al-Mansoor", rating: 5, comment: "Lattafa Khalis Musk is the benchmark of pure white musk. Clean, powdery, and soft as velvet. The floating crystal pearls inside the bottle add a lovely touch of charm." },
    { userName: "Harshavardhan Rao", rating: 4, comment: "Smells like the cleanest luxury soap and white rose water. Inexpensive yet performs wonderfully for 8 hours on skin." },
    { userName: "Kavita Deshmukh", rating: 5, comment: "Gentle, pure, and comforting. I spray it after evening baths and it leaves a peaceful musky trail on nightwear." },
  ],
  "Vanilla Musk": [
    { userName: "Tara Singhal", rating: 5, comment: "Nemat Vanilla Musk is iconic for a reason. Real Madagascar vanilla with warm skin musk that melts into your natural scent. The ultimate layering essential." },
    { userName: "Sunita Iyer", rating: 5, comment: "Creamy, cozy, and never artificial. It smells like warm homemade vanilla cake without being overly sweet. Endless compliments!" },
    { userName: "Rohan Malhotra", rating: 4, comment: "Simple, honest, and comforting. Incredible value and lasting power for a fragrance oil. Always in my carry-on bag." },
  ],
  "L'Heure de Nuit": [
    { userName: "Dr. Neil D'Souza", rating: 5, comment: "Guerlain L'Heure de Nuit is poetry in a flacon. Orange blossom and iris floating over the famous Guerlinade vanilla musk. Thierry Wasser at his best." },
    { userName: "Simran Bedi", rating: 5, comment: "The twilight hour of Paris bottled. Romantic, melancholy, and aristocratic. Lasts 10+ hours on skin with graceful sillage." },
    { userName: "Meera Bhat", rating: 4, comment: "Vintage French perfumery updated for the modern connoisseur. Delicate powdery heliotrope that feels like soft cashmere." },
  ],
  "Météorites": [
    { userName: "Priyanka Joshi", rating: 5, comment: "Guerlain Météorites is pure nostalgia. Smells exactly like the violet-scented powder pearls on my mother's vanity. Candied violets and iris perfection." },
    { userName: "Natasha Fernandes", rating: 5, comment: "Airy, playful, and feminine. The crisp green apple and mimosa keep the candied violet fresh and sparkling all day." },
    { userName: "Aanya R.", rating: 4, comment: "Delightful cosmetic violet fragrance. If you love classic Guerlain powder scents, this is an absolute joy to own." },
  ],
  "Bare Vanilla": [
    { userName: "Sneha Patil", rating: 5, comment: "Victoria's Secret Bare Vanilla is the coziest sweet scent imaginable. Whipped vanilla and cashmere fluff that wraps you in a comforting cloud." },
    { userName: "Maya Kulkarni", rating: 4, comment: "My go-to comfort scent for lazy weekends and relaxed evenings. Soft, warm, and sweet without ever being harsh." },
    { userName: "Rhea Malhotra", rating: 5, comment: "Delicious and warm. Smells like sweet spun sugar and soft skin musk. Excellent value and very crowd-pleasing." },
  ],
  "What the Fluff": [
    { userName: "Zoya Merchant", rating: 5, comment: "Aspiring Aromas What the Fluff is photorealistic marshmallow heaven. It smells like opening a fresh bag of artisanal vanilla marshmallows. Truly delicious!" },
    { userName: "Kunal Varma", rating: 5, comment: "The whipped sweet cream and meringue accord is unlike anything else. High quality gourmand that doesn't turn sour or chemical on skin." },
    { userName: "Farhan Qureshi", rating: 4, comment: "Addictive, airy sweetness. If you love marshmallow notes, this is the holy grail. Lasts 8 hours easily on clothes." },
  ],
};

const siteReviewsData = [
  {
    patronName: "Dr. Meera Nambiar",
    city: "Bangalore",
    category: "Product Quality",
    rating: 5,
    title: "Artisanal Purity Rivaling Historic European Maisons",
    comment:
      "I was initially skeptical ordering niche luxury perfumery online, but Velvet Vapors completely exceeded my expectations. The oil concentration and ingredient purity in Tom Ford Oud Wood are astonishing. The website guided me effortlessly through scent notes with their olfactory quiz, making discovery enjoyable. This is truly masterclass craftsmanship that easily rivals heritage European houses.",
    verifiedPurchase: "Tom Ford Oud Wood 100ml",
    createdAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    patronName: "Rohan Malhotra",
    city: "Mumbai",
    category: "Bespoke Packaging",
    rating: 5,
    title: "Unboxing That Feels Like High Haute Horlogerie",
    comment:
      "Unboxing my order felt like receiving fine bespoke jewelry. The bottle arrived cushioned in a magnetic velvet-lined presentation box adorned with champagne gold hot-stamping and a personalized handwritten parchment seal. Even the glass bottle has reassuring heft with a precision ultra-fine atomizer. You can instantly perceive the uncompromised devotion to artistic luxury.",
    verifiedPurchase: "By the Fireplace 100ml",
    createdAt: new Date(Date.now() - 6 * 86400000),
  },
  {
    patronName: "Sunita Krishnamurthy",
    city: "Chennai",
    category: "Express Delivery",
    rating: 5,
    title: "Lightning Dispatch with Flawless Temperature Control",
    comment:
      "Express delivery to Chennai was lightning fast, arriving within 48 hours of placing the order online. The outer transit carton was heavily insulated, shock-proof, and tamper-sealed, ensuring the delicate fragrance glass remained pristine and temperature-controlled throughout transit. The live step-by-step courier dispatch tracking gave complete peace of mind from dispatch to doorstep.",
    verifiedPurchase: "Prada L'Homme L'Eau 100ml",
    createdAt: new Date(Date.now() - 9 * 86400000),
  },
  {
    patronName: "Kabir Singhania",
    city: "New Delhi",
    category: "Customer Concierge",
    rating: 5,
    title: "White-Glove Guidance and Knowledgeable Scent Advice",
    comment:
      "The customer concierge service here sets a gold standard. When I contacted them for consultation on choosing between Diptyque Orphéon and Xerjoff Apollonia for my brother's wedding, their scent specialist responded within minutes with detailed guidance and even included complimentary sample vials in my package. Courteous, knowledgeable, and genuinely passionate about fine fragrance curation.",
    verifiedPurchase: "Diptyque Orphéon 75ml",
    createdAt: new Date(Date.now() - 12 * 86400000),
  },
  {
    patronName: "Avantika Deshmukh",
    city: "Pune",
    category: "Product Quality",
    rating: 5,
    title: "Extraordinary Tenacity and All-Day Projection",
    comment:
      "The sheer longevity of Narciso Rodriguez Pure Musc is extraordinary. I sprayed it before my morning commute and could still savor soft white floral and cashmeran notes at dinner ten hours later. There are zero synthetic alcohol overtones, just pure, intoxicating botanical elegance that blooms on skin. Velvet Vapors has gained a devoted lifelong collector in me.",
    verifiedPurchase: "Pure Musc For Her 100ml",
    createdAt: new Date(Date.now() - 15 * 86400000),
  },
  {
    patronName: "Siddharth Khurana",
    city: "Hyderabad",
    category: "Site Experience",
    rating: 5,
    title: "A Digital Sanctuary for Fragrance Connoisseurs",
    comment:
      "Navigating the Velvet Vapors platform is pure pleasure. The noir aesthetic paired with the visual olfactory pyramid breakdown helped me understand how each note evolves before buying. Applying promotional vouchers, selecting custom bottle sizes, and completing checkout was completely frictionless. Finding an artisanal luxury brand with this level of digital polish in India is refreshing.",
    verifiedPurchase: "Escentric Molecules Molecule 05 100ml",
    createdAt: new Date(Date.now() - 18 * 86400000),
  },
  {
    patronName: "Tanya Roy",
    city: "Kolkata",
    category: "Bespoke Packaging",
    rating: 5,
    title: "Breathtaking Presentation Worthy of Gifting Royalty",
    comment:
      "Every single detail reflects pure luxury. The magnetic velvet case, the embossed gold emblem, and the protective satin sleeve make it an unforgettable gifting experience. You genuinely feel valued as a patron from the moment the courier hands you the parcel. Velvet Vapors transforms perfume purchasing into an elevated sensory journey.",
    verifiedPurchase: "Penhaligon's The Favourite 100ml",
    createdAt: new Date(Date.now() - 22 * 86400000),
  },
  {
    patronName: "Vikramaditya Verma",
    city: "Jaipur",
    category: "Express Delivery",
    rating: 5,
    title: "Thermal Cushioning and Precision Logistical Execution",
    comment:
      "Living in Rajasthan, I was concerned about heat exposure during fragrance transit, but Velvet Vapors took extreme care. The package was air-cushioned and double-boxed with thermal insulation. Dispatch notifications were prompt, and the courier delivered directly to my desk without delay. Flawless logistical execution that matches the prestige of the brand.",
    verifiedPurchase: "By the Fireplace 100ml",
    createdAt: new Date(Date.now() - 26 * 86400000),
  },
  {
    patronName: "Ananya Joshi",
    city: "Gurugram",
    category: "Customer Concierge",
    rating: 5,
    title: "Unmatched Post-Purchase Attention and Warm Care",
    comment:
      "I made a typo in my shipping address during late-night checkout, but their concierge team replied instantly over support chat and rectified it before morning dispatch. They even followed up post-delivery to ensure I loved the formulation. That proactive warmth and professionalism is unheard of in contemporary retail. A five-star atelier in every regard.",
    verifiedPurchase: "By Kilian Princess 100ml",
    createdAt: new Date(Date.now() - 30 * 86400000),
  },
  {
    patronName: "Farhan Merchant",
    city: "Ahmedabad",
    category: "Product Quality",
    rating: 5,
    title: "World-Class Sillage Backed by Genuine Raw Ingredients",
    comment:
      "Finding authentic artisanal perfumes with natural agarwood, Italian orris butter, and pure vanilla musk at transparent pricing is rare. Velvet Vapors proves that homegrown luxury can compete on the world stage. From seamless online browsing to prompt delivery and heavenly sillage, every rupee spent feels thoroughly rewarded. My vanity will never be without their signature scents.",
    verifiedPurchase: "Xerjoff Apollonia 50ml",
    createdAt: new Date(Date.now() - 35 * 86400000),
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
    const reviewsCol = db.collection("reviews");
    const siteReviewsCol = db.collection("site_reviews");

    // 1. Seed perfumes — drop and re-insert
    await perfumesCol.drop().catch(() => {});
    const withDates = perfumeData.map((p) => ({ ...p, createdAt: new Date() }));
    await perfumesCol.insertMany(withDates);
    console.log(`🌹 Seeded ${perfumeData.length} perfumes from desktop photos`);

    // 2. Seed Detailed Reviews for EACH Perfume
    await reviewsCol.drop().catch(() => {});
    const allInsertedPerfumes = await perfumesCol.find({}).toArray();

    let totalReviewsSeeded = 0;
    for (const p of allInsertedPerfumes) {
      const sampleReviews = perfumeReviewsMap[p.name] || [];
      if (sampleReviews.length > 0) {
        const reviewDocs = sampleReviews.map((r, idx) => ({
          perfumeId: String(p._id),
          userId: new ObjectId().toString(),
          userName: r.userName,
          rating: r.rating,
          comment: r.comment,
          createdAt: new Date(Date.now() - (idx + 1) * 3 * 86400000),
        }));
        await reviewsCol.insertMany(reviewDocs);
        totalReviewsSeeded += reviewDocs.length;

        // Update perfume's computed average rating
        const avgRating =
          sampleReviews.reduce((sum, r) => sum + r.rating, 0) /
          sampleReviews.length;
        await perfumesCol.updateOne(
          { _id: p._id },
          { $set: { rating: Math.round(avgRating * 10) / 10 } }
        );
      }
    }
    console.log(
      `⭐ Seeded ${totalReviewsSeeded} reviews across all ${allInsertedPerfumes.length} perfumes`
    );

    // 3. Seed Site-Wide Comprehensive Reviews
    await siteReviewsCol.drop().catch(() => {});
    await siteReviewsCol.insertMany(siteReviewsData);
    console.log(`💬 Seeded ${siteReviewsData.length} comprehensive site reviews`);

    // 4. Ensure email index on users
    await usersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});

    // 5. Upsert admin user
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

module.exports = { seed, perfumeData, siteReviewsData };
