import { and, desc, eq, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { db } from "@/db";
import { products } from "@/db/schema";

/** What a product card needs. `stock` comes from a short-lived cache. */
export type Product = {
  id: number;
  slug: string;
  name: string;
  category: { slug: string; name: string };
  /** Price in cents */
  priceCents: number;
  /** Unsplash photo id; see productImageUrl */
  photo: string;
  imageAlt: string;
  badge?: string;
  /** Units available; 0 means sold out */
  stock: number;
};

/** The product page reads stock separately (see getStock) so it is never stale. */
export type ProductDetail = Omit<Product, "stock"> & {
  categoryId: number;
  sku: string;
  description: string;
  details: string[];
  /** Omitted for one-size items */
  sizes?: string[];
  /** Focal point (0 to 1) used for the close-up crop */
  focus?: [x: number, y: number];
};

const withCategory = { category: { columns: { slug: true, name: true } } } as const;

type SummaryRow = typeof products.$inferSelect & {
  category: { slug: string; name: string };
  stock: { quantity: number } | null;
};

function toProduct(row: SummaryRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    priceCents: row.priceCents,
    photo: row.photo,
    imageAlt: row.imageAlt,
    badge: row.badge ?? undefined,
    stock: row.stock?.quantity ?? 0,
  };
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");

  const rows = await db.query.products.findMany({
    where: eq(products.isActive, true),
    orderBy: desc(products.createdAt),
    limit,
    with: { ...withCategory, stock: { columns: { quantity: true } } },
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  const row = await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
    with: withCategory,
  });
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    categoryId: row.categoryId,
    priceCents: row.priceCents,
    photo: row.photo,
    imageAlt: row.imageAlt,
    badge: row.badge ?? undefined,
    sku: row.sku,
    description: row.description,
    details: row.details,
    sizes: row.sizes ?? undefined,
    focus:
      row.focusX !== null && row.focusY !== null
        ? [row.focusX, row.focusY]
        : undefined,
  };
}

/** Same-category products first, then the rest, excluding the given one */
export async function getRelatedProducts(
  slug: string,
  categoryId: number,
  count = 4,
): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");

  const rows = await db.query.products.findMany({
    where: and(eq(products.isActive, true), ne(products.slug, slug)),
    orderBy: [
      sql`(${products.categoryId} = ${categoryId}) desc`,
      desc(products.createdAt),
    ],
    limit: count,
    with: { ...withCategory, stock: { columns: { quantity: true } } },
  });
  return rows.map(toProduct);
}

export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.isActive, true));
  return rows.map((r) => r.slug);
}

/**
 * Deliberately not `use cache`: call it inside <Suspense> so stock is always
 * current. React's `cache` only dedupes calls within a single render.
 */
export const getStock = cache(async (productId: number): Promise<number> => {
  const row = await db.query.stock.findFirst({
    where: (s, { eq }) => eq(s.productId, productId),
    columns: { quantity: true },
  });
  return row?.quantity ?? 0;
});
