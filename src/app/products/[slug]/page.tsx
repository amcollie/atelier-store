import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import {
  LOW_STOCK_THRESHOLD,
  formatPrice,
  productCloseUpUrl,
  productImageUrl,
} from "@/data/catalog";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
  getStock,
  type ProductDetail,
} from "@/lib/products";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [productImageUrl(product, 1200)] },
  };
}

async function StockStatus({ productId }: { productId: number }) {
  const stock = await getStock(productId);
  const soldOut = stock === 0;
  const low = !soldOut && stock <= LOW_STOCK_THRESHOLD;
  return (
    <p className="flex items-center gap-2 text-body">
      <span
        aria-hidden
        className={`size-2 rounded-full ${soldOut ? "bg-danger" : low ? "bg-foreground" : "bg-success"}`}
      />
      {soldOut
        ? "Sold out"
        : low
          ? `Low stock: only ${stock} left`
          : "In stock"}
    </p>
  );
}

async function Purchase({ product }: { product: ProductDetail }) {
  const stock = await getStock(product.id);
  return (
    <ProductPurchase
      key={product.slug}
      name={product.name}
      sizes={product.sizes}
      soldOut={stock === 0}
    />
  );
}

function Gallery({ product }: { product: ProductDetail }) {
  const images = [
    { src: productImageUrl(product, 1400), alt: product.imageAlt },
    {
      src: productCloseUpUrl(product),
      alt: `${product.name}, close-up detail`,
    },
  ];
  return (
    <div
      aria-label={`${product.name} images`}
      className="bleed flex snap-x snap-mandatory gap-(--spacing-grid-gap) overflow-x-auto [scrollbar-width:none] lg:mx-0 lg:grid lg:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          className="media aspect-product w-[85%] shrink-0 snap-center first:ml-0 lg:w-auto"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 85vw"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}
    </div>
  );
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.slug, product.categoryId);
  const categoryHref = `/collections/${product.category.slug}`;

  return (
    <main>
      <div className="container-page pt-6 pb-6 lg:pb-10">
        <nav aria-label="Breadcrumb" className="eyebrow text-muted">
          <ol className="flex flex-wrap gap-x-2">
            <li>
              <Link href="/" className="link-quiet">
                Home
              </Link>
              <span aria-hidden> /</span>
            </li>
            <li>
              <Link href={categoryHref} className="link-quiet">
                {product.category.name}
              </Link>
              <span aria-hidden> /</span>
            </li>
            <li aria-current="page" className="text-foreground">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_30rem]">
        <Gallery product={product} />

        <section
          aria-labelledby="product-title"
          className="lg:sticky lg:top-[calc(var(--spacing-header)+1.5rem)] lg:self-start"
        >
          <div className="stack gap-8">
            <div className="stack gap-3">
              <Link href={categoryHref} className="eyebrow link-quiet text-muted self-start">
                {product.category.name}
              </Link>
              <h1 id="product-title" className="text-headline">
                {product.name}
              </h1>
              <p className="text-title">{formatPrice(product.priceCents)}</p>
              <Suspense fallback={<p className="text-body text-muted">Checking stock…</p>}>
                <StockStatus productId={product.id} />
              </Suspense>
            </div>

            <p className="text-body-lg text-muted">{product.description}</p>

            <Suspense fallback={<div className="min-h-24" aria-hidden />}>
              <Purchase product={product} />
            </Suspense>

            <div className="border-t">
              <details className="group border-b py-4" open>
                <summary className="eyebrow flex cursor-pointer list-none items-center justify-between">
                  Details &amp; care
                  <span aria-hidden className="text-title group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <ul className="mt-4 stack gap-2 text-muted">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="mt-4 text-caption text-muted">
                  SKU {product.sku}
                </p>
              </details>
              <details className="group border-b py-4">
                <summary className="eyebrow flex cursor-pointer list-none items-center justify-between">
                  Shipping &amp; returns
                  <span aria-hidden className="text-title group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-muted">
                  Complimentary shipping on orders over $200. Returns are free
                  within thirty days for unworn items in their original
                  packaging.
                </p>
              </details>
            </div>
          </div>
        </section>
      </div>

      <section
        aria-labelledby="related-title"
        className="section container-page"
      >
        <h2 id="related-title" className="mb-8 text-headline md:mb-12">
          You may also like
        </h2>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
