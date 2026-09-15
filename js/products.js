/**
 * MALAIKA FABRICS — Product Catalog
 * =========================================
 * Add, remove, or edit products here.
 * Each product supports the full field set below.
 * Only fields with values will be displayed.
 *
 * colorGradient: CSS gradient string used as visual placeholder when
 *                no photo is available. Replace `image` with a real
 *                photo path once product photography is ready.
 */

const PRODUCTS = [
  {
    id:            "MF-C01",
    name:          "Signature 3-Piece — Rose Pink",
    category:      "Ready-to-Wear",
    price:         3500,
    salePrice:     null,
    image:         "assets/products/product_1.jpg",
    images:        ["assets/products/product_1.jpg"],
    badge:         "New",
    colorName:     "Rose Pink",
    colorHex:      "#e87399",
    colorGradient: "linear-gradient(155deg, #ffeaf1 0%, #fcd5e5 35%, #f08ab3 70%, #c94f7a 100%)",
    description:   "Our best-selling Signature 3-Piece Suit in a romantic Rose Pink. Crafted in soft lawn fabric with a beautifully embroidered neckline and a matching chiffon dupatta. Light, elegant, and perfect for everyday occasions.",
    fabric:        "Lawn / Chiffon Dupatta",
    embroidery:    "Embroidered Neckline",
    occasion:      "Casual / Semi-Formal",
    includes:      "Kameez, Dupatta, Shalwar",
    stock:         true,
    featured:      true,
    tags:          ["Rose Pink", "Lawn", "Everyday Wear"],
  },

  {
    id:            "MF-C02",
    name:          "Signature 3-Piece — Sky Blue",
    category:      "Ready-to-Wear",
    price:         3500,
    salePrice:     null,
    image:         "assets/products/product_2.jpg",
    images:        ["assets/products/product_2.jpg"],
    badge:         "New",
    colorName:     "Sky Blue",
    colorHex:      "#60a5c9",
    colorGradient: "linear-gradient(155deg, #e8f4fd 0%, #b8ddf5 35%, #5ba8d4 70%, #2d7db3 100%)",
    description:   "A fresh and serene Sky Blue variant of our Signature 3-Piece Suit. The cool blue tones with a delicately embroidered neckline create an effortlessly chic look. Paired with a matching chiffon dupatta and comfortable shalwar.",
    fabric:        "Lawn / Chiffon Dupatta",
    embroidery:    "Embroidered Neckline",
    occasion:      "Casual / Semi-Formal",
    includes:      "Kameez, Dupatta, Shalwar",
    stock:         true,
    featured:      true,
    tags:          ["Sky Blue", "Lawn", "Everyday Wear"],
  },

  {
    id:            "MF-C03",
    name:          "Signature 3-Piece — Sage Green",
    category:      "Ready-to-Wear",
    price:         3500,
    salePrice:     null,
    image:         "assets/products/product_3.jpg",
    images:        ["assets/products/product_3.jpg"],
    badge:         "New",
    colorName:     "Sage Green",
    colorHex:      "#6aab8e",
    colorGradient: "linear-gradient(155deg, #edf7f1 0%, #b8dfc8 35%, #68aa8c 70%, #3d8a68 100%)",
    description:   "Elegant and earthy, the Sage Green Signature 3-Piece Suit brings a refreshing natural palette to your wardrobe. The soft green tones are complemented by a beautifully embroidered neckline and a flowing chiffon dupatta.",
    fabric:        "Lawn / Chiffon Dupatta",
    embroidery:    "Embroidered Neckline",
    occasion:      "Casual / Semi-Formal",
    includes:      "Kameez, Dupatta, Shalwar",
    stock:         true,
    featured:      true,
    tags:          ["Sage Green", "Lawn", "Everyday Wear"],
  },

  {
    id:            "MF-C04",
    name:          "Signature 3-Piece — Lavender",
    category:      "Ready-to-Wear",
    price:         3500,
    salePrice:     null,
    image:         "assets/products/product_1.jpg",
    images:        ["assets/products/product_1.jpg"],
    badge:         "New",
    colorName:     "Lavender",
    colorHex:      "#9b7ec8",
    colorGradient: "linear-gradient(155deg, #f3eeff 0%, #d9c5f5 35%, #9f7dd0 70%, #6e45b0 100%)",
    description:   "Dreamy and feminine, the Lavender Signature 3-Piece Suit is a timeless choice for any occasion. The soft purple hues with a matching embroidered neckline and chiffon dupatta create an effortlessly graceful silhouette.",
    fabric:        "Lawn / Chiffon Dupatta",
    embroidery:    "Embroidered Neckline",
    occasion:      "Casual / Semi-Formal",
    includes:      "Kameez, Dupatta, Shalwar",
    stock:         true,
    featured:      false,
    tags:          ["Lavender", "Lawn", "Everyday Wear"],
  },

  {
    id:            "MF-C05",
    name:          "Signature 3-Piece — Peach",
    category:      "Ready-to-Wear",
    price:         3500,
    salePrice:     null,
    image:         "assets/products/product_2.jpg",
    images:        ["assets/products/product_2.jpg"],
    badge:         "New",
    colorName:     "Peach",
    colorHex:      "#e8956d",
    colorGradient: "linear-gradient(155deg, #fff3ee 0%, #f5c9b0 35%, #e8916a 70%, #c96040 100%)",
    description:   "Warm and glowing, the Peach Signature 3-Piece Suit radiates a soft warmth that flatters every skin tone. The peach lawn fabric with a delicately embroidered neckline and chiffon dupatta is a perfect everyday ensemble.",
    fabric:        "Lawn / Chiffon Dupatta",
    embroidery:    "Embroidered Neckline",
    occasion:      "Casual / Semi-Formal",
    includes:      "Kameez, Dupatta, Shalwar",
    stock:         true,
    featured:      false,
    tags:          ["Peach", "Lawn", "Everyday Wear"],
  },

  {
    id:            "MF-C06",
    name:          "Signature 3-Piece — Deep Maroon",
    category:      "Ready-to-Wear",
    price:         3500,
    salePrice:     null,
    image:         "assets/products/product_3.jpg",
    images:        ["assets/products/product_3.jpg"],
    badge:         "New",
    colorName:     "Deep Maroon",
    colorHex:      "#8b2252",
    colorGradient: "linear-gradient(155deg, #f9edf2 0%, #dba0bb 35%, #a03468 70%, #6b1840 100%)",
    description:   "Rich and regal, the Deep Maroon Signature 3-Piece Suit is a statement of classic Pakistani elegance. The deep maroon lawn with a beautifully crafted embroidered neckline and flowing dupatta is ideal for festive occasions and family gatherings.",
    fabric:        "Lawn / Chiffon Dupatta",
    embroidery:    "Embroidered Neckline",
    occasion:      "Festive / Semi-Formal",
    includes:      "Kameez, Dupatta, Shalwar",
    stock:         true,
    featured:      false,
    tags:          ["Maroon", "Lawn", "Festive Wear"],
  },
];

// Helper to format price
function formatPrice(amount) {
  const sym = window.MF_CONFIG?.STORE_CURRENCY_SYMBOL || "Rs.";
  return `${sym} ${amount.toLocaleString('en-PK')}`;
}

window.MF_PRODUCTS = PRODUCTS;
window.MF_formatPrice = formatPrice;
