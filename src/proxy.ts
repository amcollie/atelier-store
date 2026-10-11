import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { db } from "@/db";
import { products } from "@/db/schema";

// The product page is partially prerendered, so its response starts streaming
// before notFound() can run and an unknown slug would answer 200. Checking here,
// before anything renders, lets unknown or inactive slugs return a real 404.
export const config = {
  matcher: "/products/:slug",
};

export async function proxy(request: NextRequest) {
  const slug = decodeURIComponent(request.nextUrl.pathname.split("/")[2] ?? "");

  const [row] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  if (row) return NextResponse.next();

  // A path with no route renders the app's not-found UI with a 404 status.
  return NextResponse.rewrite(new URL("/not-found", request.url));
}
