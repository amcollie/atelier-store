import Image from "next/image";
import Link from "next/link";
import { formatPrice, productImageUrl } from "@/data/catalog";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const badge = product.stock === 0 ? "Sold out" : product.badge;
  return (
    <article className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="media aspect-product">
          <Image
            src={productImageUrl(product)}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="transition-transform duration-700 ease-brand md:group-hover:scale-105"
          />
          {badge && (
            <span className="eyebrow absolute top-3 left-3 bg-background px-2 py-1">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-4 px-(--spacing-grid-gap)">
          <div>
            <h3 className="text-body">{product.name}</h3>
            <p className="text-caption text-muted">{product.category.name}</p>
          </div>
          <p className="text-body">{formatPrice(product.priceCents)}</p>
        </div>
      </Link>
    </article>
  );
}
