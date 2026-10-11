import { config } from "dotenv";
import { eq, sql } from "drizzle-orm";

// Drizzle Kit loads .env.local itself; do the same before @/db reads DATABASE_URL.
config({ path: ".env.local" });

const clothingSizes = ["XS", "S", "M", "L", "XL"];

const categorySeed = [
  { slug: "knitwear", name: "Knitwear" },
  { slug: "outerwear", name: "Outerwear" },
  { slug: "jersey", name: "Jersey" },
  { slug: "shirts", name: "Shirts" },
  { slug: "accessories", name: "Accessories" },
  { slug: "dresses", name: "Dresses" },
];

type ProductSeed = {
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  photo: string;
  imageAlt: string;
  focus?: [x: number, y: number];
  badge?: string;
  sku: string;
  stock: number;
  sizes?: string[];
  description: string;
  details: string[];
};

// Listed newest first; created_at is staggered from this order.
const productSeed: ProductSeed[] = [
  {
    slug: "fringe-knit-poncho",
    name: "Fringe Knit Poncho",
    category: "knitwear",
    priceCents: 24500,
    photo: "1434389677669-e08b4cac3105",
    imageAlt: "Cream open-knit poncho with fringed hem on a wooden hanger",
    focus: [0.5, 0.85],
    badge: "New",
    sku: "AT-KN-0101",
    stock: 12,
    description:
      "An airy open-knit poncho with a hand-finished fringe. Layer it over a shirt in early autumn or over a roll neck when the weather turns.",
    details: [
      "100% organic cotton",
      "Relaxed, one-size fit",
      "Hand-finished fringe hem",
      "Hand wash cold, dry flat",
    ],
  },
  {
    slug: "satin-bomber-jacket",
    name: "Satin Bomber Jacket",
    category: "outerwear",
    priceCents: 48000,
    photo: "1591047139829-d91aecb6caea",
    imageAlt: "Terracotta bomber jacket on a hanger",
    focus: [0.5, 0.3],
    badge: "New",
    sku: "AT-OW-0214",
    stock: 3,
    sizes: clothingSizes,
    description:
      "A lightweight bomber in a matte terracotta satin, cut slightly boxy with ribbed cuffs and hem. Lined, with a zip front and two welt pockets.",
    details: [
      "Outer: 100% recycled polyester satin",
      "Lining: 100% viscose",
      "Regular fit, true to size",
      "Dry clean only",
    ],
  },
  {
    slug: "heavyweight-crewneck",
    name: "Heavyweight Crewneck",
    category: "jersey",
    priceCents: 13500,
    photo: "1620799140408-edc6dcb6d633",
    imageAlt: "White crewneck sweatshirt laid flat",
    focus: [0.5, 0.35],
    sku: "AT-JS-0330",
    stock: 0,
    sizes: clothingSizes,
    description:
      "A dense, brushed-back loopback sweatshirt in off-white. Cut with a dropped shoulder and a clean ribbed neckline that holds its shape.",
    details: [
      "100% organic cotton, 480gsm",
      "Relaxed fit, true to size",
      "Pre-washed to limit shrinkage",
      "Machine wash cold",
    ],
  },
  {
    slug: "belted-wool-coat",
    name: "Belted Wool Coat",
    category: "outerwear",
    priceCents: 89000,
    photo: "1483985988355-763728e1935b",
    imageAlt: "Burgundy wool coat with a high collar",
    focus: [0.5, 0.6],
    sku: "AT-OW-0188",
    stock: 8,
    sizes: clothingSizes,
    description:
      "A double-faced wool coat in deep burgundy with a generous collar and a removable belt. Fully lined and cut to sit over knitwear.",
    details: [
      "90% wool, 10% cashmere",
      "Lining: 100% cupro",
      "Regular fit, true to size",
      "Dry clean only",
    ],
  },
  {
    slug: "linen-shirt-ivory",
    name: "Linen Shirt, Ivory",
    category: "shirts",
    priceCents: 16500,
    photo: "1490481651871-ab68de25d43d",
    imageAlt: "Ivory linen shirts hanging on a rail",
    focus: [0.3, 0.3],
    sku: "AT-SH-0412",
    stock: 20,
    sizes: clothingSizes,
    description:
      "A softly washed European linen shirt with a relaxed collar and mother-of-pearl buttons. It gets better with every wash.",
    details: [
      "100% European linen",
      "Relaxed fit, true to size",
      "Mother-of-pearl buttons",
      "Machine wash cold",
    ],
  },
  {
    slug: "organic-cotton-tee-sage",
    name: "Organic Cotton Tee, Sage",
    category: "jersey",
    priceCents: 7000,
    photo: "1523381210434-271e8be1f52b",
    imageAlt: "Sage green t-shirts on wooden hangers",
    focus: [0.5, 0.6],
    sku: "AT-JS-0306",
    stock: 40,
    sizes: clothingSizes,
    description:
      "The everyday tee, in a mid-weight organic cotton jersey dyed a muted sage. A close, clean neckline and a slightly longer body.",
    details: [
      "100% organic cotton, 220gsm",
      "Regular fit, true to size",
      "Garment dyed",
      "Machine wash cold",
    ],
  },
  {
    slug: "top-handle-bag-vermilion",
    name: "Top-Handle Bag, Vermilion",
    category: "accessories",
    priceCents: 125000,
    photo: "1584917865442-de89df76afd3",
    imageAlt: "Red leather top-handle bag with a silver clasp",
    focus: [0.5, 0.55],
    badge: "Bestseller",
    sku: "AT-AC-0907",
    stock: 2,
    description:
      "A structured top-handle bag in vegetable-tanned leather, finished with a silver turn-lock and a detachable shoulder strap.",
    details: [
      "Vegetable-tanned Italian calf leather",
      "Suede-lined interior with one zip pocket",
      "24 × 19 × 11 cm; 10 cm handle drop",
      "Includes dust bag",
    ],
  },
  {
    slug: "printed-wrap-dress",
    name: "Printed Wrap Dress",
    category: "dresses",
    priceCents: 32000,
    photo: "1496747611176-843222e1e57c",
    imageAlt: "Floral wrap dress with short sleeves",
    focus: [0.5, 0.5],
    sku: "AT-DR-0525",
    stock: 6,
    sizes: clothingSizes,
    description:
      "A fluid wrap dress in a sun-faded floral print, with a self-tie waist and a hem that moves. Cut from a crisp, breathable viscose.",
    details: [
      "100% LENZING™ viscose",
      "Regular fit, true to size",
      "Self-tie wrap waist",
      "Machine wash cold, gentle cycle",
    ],
  },
];

async function main() {
  const { db } = await import("./index");
  const { categories, products, stock } = await import("./schema");

  await db
    .insert(categories)
    .values(categorySeed)
    .onConflictDoUpdate({
      target: categories.slug,
      set: { name: sql`excluded.name` },
    });

  const categoryRows = await db.select().from(categories);
  const categoryIds = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const now = Date.now();
  const productRows = productSeed.map((p, i) => {
    const categoryId = categoryIds.get(p.category);
    if (categoryId === undefined) throw new Error(`Unknown category ${p.category}`);
    return {
      slug: p.slug,
      sku: p.sku,
      name: p.name,
      description: p.description,
      priceCents: p.priceCents,
      categoryId,
      photo: p.photo,
      imageAlt: p.imageAlt,
      focusX: p.focus?.[0] ?? null,
      focusY: p.focus?.[1] ?? null,
      badge: p.badge ?? null,
      sizes: p.sizes ?? null,
      details: p.details,
      createdAt: new Date(now - i * 60_000),
    };
  });

  // created_at is left out of `set` so re-seeding keeps the original ordering.
  await db
    .insert(products)
    .values(productRows)
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        sku: sql`excluded.sku`,
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        priceCents: sql`excluded.price_cents`,
        categoryId: sql`excluded.category_id`,
        photo: sql`excluded.photo`,
        imageAlt: sql`excluded.image_alt`,
        focusX: sql`excluded.focus_x`,
        focusY: sql`excluded.focus_y`,
        badge: sql`excluded.badge`,
        sizes: sql`excluded.sizes`,
        details: sql`excluded.details`,
        updatedAt: sql`now()`,
      },
    });

  const idRows = await db.select({ id: products.id, slug: products.slug }).from(products);
  const productIds = new Map(idRows.map((p) => [p.slug, p.id]));

  // Stock only seeds missing rows, so re-running never overwrites live quantities.
  await db
    .insert(stock)
    .values(
      productSeed.map((p) => ({
        productId: productIds.get(p.slug)!,
        quantity: p.stock,
      })),
    )
    .onConflictDoNothing();

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.isActive, true));
  console.log(`Seeded ${categorySeed.length} categories; ${count} active products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
