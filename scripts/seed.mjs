import {existsSync, mkdirSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import mongoose from "mongoose";
import {loadEnv} from "./load-env.mjs";
import {Category, Product, SiteSettings} from "../src/models/index.js";

const COLORS = {
  accent: "#f9b2c0",
  text: "#c95d78",
  textSoft: "#a54863",
  bgStart: "#fff7f9",
  bgEnd: "#f9d3db",
};

function escapeXml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(text, max = 26) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if ([...candidate].length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function svgPlaceholder({title, subtitle, width = 480, height = 360}) {
  const lines = wrapText(title, 26).slice(0, 3);
  const small = width < 300;
  const lineHeight = small ? 30 : 46;
  const midY = subtitle ? 150 : 170;
  const startY = midY - ((lines.length - 1) * lineHeight) / 2;

  const titleText = lines
    .map(
      (line, i) =>
        `<text x="${width / 2}" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${small ? 20 : 26}" font-weight="700" fill="${COLORS.text}">${escapeXml(line)}</text>`
    )
    .join("");

  const subtitleText = subtitle
    ? `<text x="${width / 2}" y="${midY + lines.length * lineHeight + 16}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${small ? 13 : 18}" fill="${COLORS.textSoft}">${escapeXml(subtitle)}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${COLORS.bgStart}"/>
      <stop offset="1" stop-color="${COLORS.bgEnd}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${width / 2}" cy="150" r="${small ? 45 : 65}" fill="#ffffff" opacity="0.5"/>
  ${titleText}
  ${subtitleText}
</svg>
`;
}

function writeSvgIfMissing(relativePath, content) {
  const absolutePath = resolve(process.cwd(), relativePath);
  if (existsSync(absolutePath)) {
    return false;
  }
  mkdirSync(dirname(absolutePath), {recursive: true});
  writeFileSync(absolutePath, content, "utf8");
  return true;
}

function createPlaceholders({brandSlug, categoryItems, productItems}) {
  const written = [];

  const brandFiles = [
    {
      path: "public/placeholders/brand/logo.svg",
      svg: svgPlaceholder({title: brandSlug.en, subtitle: brandSlug.ar}),
    },
    {
      path: "public/placeholders/brand/favicon.svg",
      svg: svgPlaceholder({title: "SK", width: 256, height: 256}),
    },
  ];

  for (const item of [...brandFiles, ...categoryItems, ...productItems]) {
    if (writeSvgIfMissing(item.path, item.svg)) {
      written.push(item.path);
    }
  }

  return written;
}

function measureOption(ar, en, price) {
  return {name: {ar, en}, price};
}

function measuringUnit(unitType, ar, en, opts, {addOns = []} = {}) {
  return {unitType, options: opts, addOns};
}

const CATEGORIES = [
  {slug: "honey-cake", name: {ar: "هاني كيك", en: "Honey Cake"}},
  {slug: "cinnamon-rolls", name: {ar: "سينابون", en: "Cinnamon Rolls"}},
  {slug: "cookies-and-tart", name: {ar: "بسكويت وتارت", en: "Cookies & Tart"}},
  {slug: "profiterole", name: {ar: "بريفيتريول", en: "Profiterole"}},
  {slug: "cookies", name: {ar: "كوكيز", en: "Cookies"}},
  {slug: "cupcakes", name: {ar: "كب كيك", en: "Cupcakes"}},
  {slug: "tiramisu", name: {ar: "تيراميسو", en: "Tiramisu"}},
  {slug: "cheesecake", name: {ar: "تشيز كيك", en: "Cheesecake"}},
  {slug: "tagines", name: {ar: "طواجن", en: "Tagines"}},
];

const PRODUCTS = [
  {
    name: {ar: "تورتة هاني كيك", en: "Honey Cake Torta"},
    slug: "honey-cake-torta",
    category: "honey-cake",
    featured: true,
    measuringUnit: measuringUnit("size", "النوع والمقاس", "Type & Size", [
      measureOption("تورتة هاني كيك كلاسيك مقاس 18", "Classic Honey Cake Torta - Size 18", 230),
      measureOption("تورتة هاني كيك كلاسيك مقاس 24", "Classic Honey Cake Torta - Size 24", 320),
      measureOption("تورتة هاني كيك مقاس 18 كراميل وعين جمل", "Honey Cake Torta - Caramel & Walnut - Size 18", 470),
      measureOption("تورتة هاني كيك مقاس 24 كراميل وعين جمل", "Honey Cake Torta - Caramel & Walnut - Size 24", 630),
      measureOption("تورتة هاني كيك مانجا مقاس 18", "Mango Honey Cake Torta - Size 18", 450),
      measureOption("تورتة هاني كيك مانجا مقاس 24", "Mango Honey Cake Torta - Size 24", 650),
      measureOption("تورتة هاني كيك مقاس 18", "Honey Cake Torta - Size 18", 450),
    ]),
  },
  {
    name: {ar: "قطعة هاني كيك", en: "Honey Cake Piece"},
    slug: "honey-cake-piece",
    category: "honey-cake",
    featured: true,
    measuringUnit: measuringUnit("pieces", "النوع", "Flavor", [
      measureOption("قطعة هاني كيك نوتيلا وبندق", "Nutella & Hazelnut Honey Cake Piece", 70),
      measureOption("قطعة هاني كيك كراميل وعين جمل", "Caramel & Walnut Honey Cake Piece", 70),
      measureOption("قطعة هاني كيك كلاسيك", "Classic Honey Cake Piece", 50),
    ]),
  },
  {
    name: {ar: "سينابون", en: "Cinnamon Rolls"},
    slug: "cinnamon-rolls",
    category: "cinnamon-rolls",
    featured: true,
    measuringUnit: measuringUnit("pieces", "النكهة", "Flavor", [
      measureOption("سينابون لوتس", "Lotus Cinnamon Roll", 95),
      measureOption("سينابون كراميل", "Caramel Cinnamon Roll", 95),
      measureOption("سينابون النوتيلا", "Nutella Cinnamon Roll", 95),
      measureOption("سينابون كندر", "Kinder Cinnamon Roll", 95),
      measureOption("سينابون وايت شوكليت", "White Chocolate Cinnamon Roll", 95),
      measureOption("سينابون كلاسيك", "Classic Cinnamon Roll", 90),
      measureOption("سينابون بستاشيو", "Pistachio Cinnamon Roll", 100),
      measureOption("سينابون بلوبيري", "Blueberry Cinnamon Roll", 100),
    ], {
      addOns: [
        {name: {ar: "إضافة مكسرات على السينابون", en: "Extra Nuts on Cinnamon Rolls"}, price: 50},
      ],
    }),
  },
  {
    name: {ar: "نص كيلو بسكويت زبدة", en: "Half Kilo Butter Cookies"},
    slug: "half-kilo-butter-cookies",
    category: "cookies-and-tart",
    featured: true,
    price: 300,
    unitLabel: {ar: "نصف كيلو", en: "0.5 kg"},
  },
  {
    name: {ar: "نص كيلو ميني تارت", en: "Half Kilo Mini Tart"},
    slug: "half-kilo-mini-tart",
    category: "cookies-and-tart",
    featured: true,
    price: 425,
    unitLabel: {ar: "نصف كيلو", en: "0.5 kg"},
  },
  {
    name: {ar: "شومسيو بالبلجيان شوكليت", en: "Belgian Chocolate Shumseau"},
    slug: "belgian-chocolate-shumseau",
    category: "cookies-and-tart",
    price: 90,
  },
  {
    name: {ar: "بريفيتريو", en: "Profiterole"},
    slug: "profiterole",
    category: "profiterole",
    featured: true,
    measuringUnit: measuringUnit("pieces", "النكهة", "Flavor", [
      measureOption("بريفيتريو وايت شوكليت بلوبيري", "White Chocolate Blueberry Profiterole", 75),
      measureOption("بريفيتريو لوتس", "Lotus Profiterole", 75),
      measureOption("بريفيتريو نوتيلا", "Nutella Profiterole", 75),
      measureOption("بريفيتريو بستاشيو", "Pistachio Profiterole", 80),
      measureOption("بريفيتريو كندر", "Kinder Profiterole", 75),
    ]),
  },
  {
    name: {ar: "كوكيز", en: "Cookies Mix"},
    slug: "cookies-mix",
    category: "cookies",
    featured: true,
    measuringUnit: measuringUnit("pieces", "النوع", "Flavor", [
      measureOption("قطعة كوكيز ميكس وشوكليت", "Cookies Mix & Chocolate Piece", 100),
      measureOption("قطعة كوكيز ميكس بيلجن شوكليت", "Cookies Mix Belgian Chocolate Piece", 90),
      measureOption("قطعة كوكيز ميكس شوكليت كيندر", "Cookies Mix Chocolate Kinder Piece", 100),
    ]),
  },
  {
    name: {ar: "علبة جوزيه ست قطع ميكس", en: "Jozia Mix Box - 6 Pieces"},
    slug: "jozia-mix-box-6-pieces",
    category: "cookies",
    featured: true,
    price: 100,
    unitLabel: {ar: "6 قطع", en: "6 pieces"},
  },
  {
    name: {ar: "كب كيك ماتيلدا", en: "Matilda Cupcakes"},
    slug: "matilda-cupcakes",
    category: "cupcakes",
    featured: true,
    measuringUnit: measuringUnit("pieces", "النكهة", "Flavor", [
      measureOption("كنافة وبستاشيو", "Kunafa & Pistachio", 95),
      measureOption("نوتيلا وبندق", "Nutella & Hazelnut", 95),
      measureOption("كندر", "Kinder", 95),
    ]),
  },
  {
    name: {ar: "تيراميسو بالمانجا", en: "Mango Tiramisu"},
    slug: "mango-tiramisu",
    category: "tiramisu",
    featured: true,
    measuringUnit: measuringUnit("size", "الحجم", "Size", [
      measureOption("كب تيراميسو بالمانجا", "Mango Tiramisu Cup", 95),
      measureOption("تيراميسو بالمانجا مقاس 15×15، يكفي 3 أفراد", "Mango Tiramisu 15x15 - Serves 3", 370),
    ]),
  },
  {
    name: {ar: "تيراميسو كوفي", en: "Coffee Tiramisu"},
    slug: "coffee-tiramisu",
    category: "tiramisu",
    featured: true,
    measuringUnit: measuringUnit("size", "الحجم", "Size", [
      measureOption("تيراميسو كوفي كب", "Coffee Tiramisu Cup", 90),
      measureOption("تيراميسو كوفي 15×15، يكفي 3 أفراد", "Coffee Tiramisu 15x15 - Serves 3", 290),
    ]),
  },
  {
    name: {ar: "تشيز كيك", en: "Cheesecake"},
    slug: "cheesecake",
    category: "cheesecake",
    featured: true,
    measuringUnit: measuringUnit("pieces", "النكهة", "Flavor", [
      measureOption("تشيز كيك مانجا", "Mango Cheesecake", 90),
      measureOption("تشيز كيك بلوبيري", "Blueberry Cheesecake", 95),
      measureOption("تشيز كيك بستاشيو", "Pistachio Cheesecake", 95),
      measureOption("تشيز كيك كندر", "Kinder Cheesecake", 85),
      measureOption("تشيز كيك لوتس", "Lotus Cheesecake", 85),
      measureOption("تشيز كيك نوتيلا", "Nutella Cheesecake", 85),
    ]),
  },
  {
    name: {ar: "طاجن نوتيلا كونو", en: "Nutella Cono Tagine"},
    slug: "nutella-cono-tagine",
    category: "tagines",
    featured: true,
    price: 80,
  },
  {
    name: {ar: "طاجن كيندر بوينو", en: "Kinder Bueno Tagine"},
    slug: "kinder-bueno-tagine",
    category: "tagines",
    price: 85,
  },
  {
    name: {ar: "طاجن نوتيلا كراميل وعين جمل", en: "Nutella Caramel & Walnut Tagine"},
    slug: "nutella-caramel-walnut-tagine",
    category: "tagines",
    price: 80,
  },
  {
    name: {ar: "طاجن اكسترا نوتيلا وبندق", en: "Extra Nutella & Hazelnut Tagine"},
    slug: "extra-nutella-hazelnut-tagine",
    category: "tagines",
    price: 85,
  },
  {
    name: {ar: "طاجن لوتس بعين الجمل", en: "Lotus & Walnut Tagine"},
    slug: "lotus-walnut-tagine",
    category: "tagines",
    price: 80,
  },
  {
    name: {ar: "طاجن نوتيلا بوريو", en: "Nutella Bureo Tagine"},
    slug: "nutella-bureo-tagine",
    category: "tagines",
    price: 80,
  },
  {
    name: {ar: "طاجن ميكس", en: "Mix Tagine"},
    slug: "mix-tagine",
    category: "tagines",
    featured: true,
    measuringUnit: measuringUnit("size", "الحجم", "Size", [
      measureOption("طاجن ميكس وسط، يكفي 4 أفراد", "Medium Mix Tagine - Serves 4", 270),
      measureOption("طاجن ميكس عائلي، يكفي 6 أفراد", "Family Mix Tagine - Serves 6", 320),
    ]),
  },
];

const SITE_SETTINGS = {
  singletonKey: "site",
  brandName: {ar: "حلواني سُكّرية", en: "Sokkariya Sweets"},
  logo: {
    url: "/placeholders/brand/logo.svg",
    alt: {ar: "شعار حلواني سُكّرية", en: "Sokkariya Sweets logo"},
  },
  favicon: {
    url: "/placeholders/brand/favicon.svg",
    alt: {ar: "شعار حلواني سُكّرية", en: "Sokkariya Sweets logo"},
  },
  phone: "+201000000000",
  whatsapp: "+201000000000",
  instagram: "https://instagram.com/example.sweets",
  facebook: "https://facebook.com/example.sweets",
  address: {ar: "القاهرة، مصر — عنوان تجريبي", en: "Cairo, Egypt — Demo Address"},
  openingHours: {
    ar: "يوميًا من 10:00 صباحًا حتى 11:00 مساءً",
    en: "Daily from 10:00 AM to 11:00 PM",
  },
  contactMessage: {
    ar: "مرحبًا، يسعدنا تواصلك معنا.",
    en: "Hello, we are happy to hear from you.",
  },
  mapEmbedUrl: "",
  mapLatitude: 30.0444,
  mapLongitude: 31.2357,
};

function buildCategoryDocs() {
  return CATEGORIES.map((category, index) => ({
    name: category.name,
    slug: category.slug,
    description: category.name,
    isActive: true,
    sortOrder: index + 1,
    image: {
      url: `/placeholders/categories/${category.slug}.svg`,
      alt: category.name,
    },
  }));
}

function buildProductDocs() {
  return PRODUCTS.map((product) => {
    const unit = product.measuringUnit;

    const hasMeasuringUnit = Boolean(unit && unit.options.length > 0);

    const measuringUnit = hasMeasuringUnit
      ? {
          unitType: unit.unitType,
          options: unit.options.map((opt, optionIndex) => ({
            name: opt.name,
            price: opt.price,
            isActive: true,
            sortOrder: optionIndex,
          })),
        }
      : {unitType: "size", options: []};

    const addOns = (product.measuringUnit?.addOns ?? []).map((opt, addOnIndex) => ({
      name: opt.name,
      price: opt.price,
      isActive: true,
      sortOrder: addOnIndex,
    }));

    const unitPrices = measuringUnit.options.map((opt) => opt.price);

    return {
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.name,
      price: unitPrices.length > 0 ? Math.min(...unitPrices) : product.price,
      ...(product.unitLabel ? {unitLabel: product.unitLabel} : {}),
      isActive: true,
      isAvailable: true,
      isFeatured: Boolean(product.featured),
      sortOrder: 0,
      images: [
        {
          url: `/placeholders/products/${product.slug}.svg`,
          alt: product.name,
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      hasMeasuringUnit,
      measuringUnit,
      addOns,
    };
  });
}

function buildPlaceholderItems() {
  const categoryItems = CATEGORIES.map((category) => ({
    path: `public/placeholders/categories/${category.slug}.svg`,
    svg: svgPlaceholder({title: category.name.en, subtitle: category.name.ar}),
  }));

  const productItems = PRODUCTS.map((product) => ({
    path: `public/placeholders/products/${product.slug}.svg`,
    svg: svgPlaceholder({title: product.name.en, subtitle: product.name.ar}),
  }));

  return {categoryItems, productItems};
}

async function main() {
  loadEnv();

  const force = process.argv.includes("--force");
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    console.error(
      "MONGODB_URI is not defined. Load an .env.local or .env file with MONGODB_URI and try again."
    );
    process.exit(1);
  }

  try {
    const {connectDB} = await import("../src/lib/db.js");
    await connectDB();

    const writtenFiles = createPlaceholders({
      brandSlug: SITE_SETTINGS.brandName,
      ...buildPlaceholderItems(),
    });
    console.log(`Placeholder images ready (${writtenFiles.length} new, rest already exist).`);

    const [categoryCount, productCount] = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments(),
    ]);

    if ((categoryCount > 0 || productCount > 0) && !force) {
      console.log(
        `Database already has data (categories: ${categoryCount}, products: ${productCount}). ` +
          "Run `npm run seed:force` to delete and reseed. No changes were made."
      );
      return;
    }

    if (force) {
      await Product.deleteMany({});
      await Category.deleteMany({});
      await SiteSettings.deleteMany({});
    }

    const categoryDocs = buildCategoryDocs();
    const insertedCategories = await Category.insertMany(categoryDocs);
    const categoryMap = new Map(
      insertedCategories.map((category) => [category.slug, category._id])
    );

    const productDocs = buildProductDocs().map((doc) => ({
      ...doc,
      category: categoryMap.get(doc.category),
    }));
    const insertedProducts = await Product.insertMany(productDocs);

    const existingSettings = force
      ? null
      : await SiteSettings.findOne({singletonKey: "site"});
    let settingsCreated = false;

    if (!existingSettings) {
      await SiteSettings.create(SITE_SETTINGS);
      settingsCreated = true;
    }

    console.log(`Seeded ${insertedCategories.length} categories.`);
    console.log(`Seeded ${insertedProducts.length} products.`);
    console.log(
      settingsCreated
        ? "Seeded site settings."
        : "Site settings already existed; left unchanged."
    );
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

main().catch((error) => {
  console.error(`Seed failed: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});