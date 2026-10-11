import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "New In", href: "/collections/new" },
      { label: "Women", href: "/collections/women" },
      { label: "Men", href: "/collections/men" },
      { label: "Accessories", href: "/collections/accessories" },
    ],
  },
  {
    title: "Client care",
    links: [
      { label: "Contact us", href: "/help/contact" },
      { label: "Shipping", href: "/help/shipping" },
      { label: "Returns", href: "/help/returns" },
      { label: "Size guide", href: "/help/sizing" },
    ],
  },
  {
    title: "Atelier",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Materials", href: "/about/materials" },
      { label: "Repairs", href: "/about/repairs" },
      { label: "My account", href: "/account" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="surface-inverse section-sm">
      <div className="container-page grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="stack gap-4">
          <p className="text-title tracking-[0.35em] uppercase">Atelier</p>
          <p className="max-w-xs text-muted">
            Considered clothing and accessories, made from natural materials
            and built to be worn for years.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow mb-4">{col.title}</h2>
            <ul className="stack gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-quiet text-muted hover:text-on-inverse">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-page mt-16">
        <hr className="rule" />
        <p className="pt-6 text-caption text-muted">
          Atelier Store. A sample storefront.
        </p>
      </div>
    </footer>
  );
}
