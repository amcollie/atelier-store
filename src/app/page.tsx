import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { collections, editorials, heroImage, services } from "@/data/catalog";
import { getNewArrivals } from "@/lib/products";

export default async function Home() {
  const newArrivals = await getNewArrivals();
  return (
    <main>
      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="media relative h-[75svh] min-h-[28rem] md:h-[calc(100svh-var(--spacing-header)-2.5rem)] md:max-h-[60rem]"
      >
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-[50%_25%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-scrim via-transparent to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-10 text-on-inverse md:pb-16">
          <p className="eyebrow mb-4">Autumn / Winter</p>
          <h1 id="hero-title" className="max-w-3xl text-display">
            Outerwear, redefined
          </h1>
          <p className="mt-4 max-w-md text-body-lg">
            Sculpted coats and soft layers in wool, cashmere and cotton.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/collections/women" className="btn btn-inverse">
              Shop women
            </Link>
            <Link href="/collections/men" className="btn btn-inverse">
              Shop men
            </Link>
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section aria-labelledby="collections-title" className="section container-page">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <h2 id="collections-title" className="text-headline">
            Featured collections
          </h2>
          <Link href="/collections" className="link eyebrow shrink-0">
            View all
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-(--spacing-grid-gap) gap-y-8 lg:grid-cols-4">
          {collections.map((c, i) => (
            <li key={c.slug}>
              <Link href={`/collections/${c.slug}`} className="group block">
                <div className="media aspect-portrait">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="transition-transform duration-700 ease-brand md:group-hover:scale-105"
                  />
                </div>
                <p className="eyebrow mt-4 flex items-center justify-between px-(--spacing-grid-gap)">
                  <span>
                    <span className="mr-3 text-muted">0{i + 1}</span>
                    {c.name}
                  </span>
                  <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* New arrivals */}
      <section
        aria-labelledby="arrivals-title"
        className="container-page pb-(--spacing-section)"
      >
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <div>
            <p className="eyebrow mb-3 text-muted">Just landed</p>
            <h2 id="arrivals-title" className="text-headline">
              New arrivals
            </h2>
          </div>
          <Link href="/collections/new" className="btn btn-outline btn-sm hidden sm:inline-flex">
            Shop all new in
          </Link>
        </div>
        <div className="product-grid">
          {newArrivals.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <Link
          href="/collections/new"
          className="btn btn-outline btn-block mt-10 sm:hidden"
        >
          Shop all new in
        </Link>
      </section>

      {/* Editorial pair */}
      <section aria-label="Editorial" className="split">
        {editorials.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="media group block aspect-[4/5] md:aspect-[3/4]"
          >
            <Image
              src={e.image}
              alt={e.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="transition-transform duration-700 ease-brand md:group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-scrim to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-(--spacing-gutter) text-on-inverse">
              <p className="eyebrow mb-3">{e.eyebrow}</p>
              <h2 className="max-w-sm text-headline">{e.title}</h2>
              <span className="link eyebrow mt-5 inline-block">{e.cta}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Brand statement + services */}
      <section aria-labelledby="promise-title" className="section">
        <div className="container-content">
          <h2
            id="promise-title"
            className="mx-auto max-w-3xl text-center text-headline"
          >
            Clothing designed to be worn, repaired and worn again.
          </h2>
          <ul className="mt-section-sm grid gap-10 border-t pt-10 md:grid-cols-3 md:gap-8">
            {services.map((s) => (
              <li key={s.title} className="stack gap-2">
                <h3 className="eyebrow">{s.title}</h3>
                <p className="text-muted">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
