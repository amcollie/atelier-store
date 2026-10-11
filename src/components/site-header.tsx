import Link from "next/link";
import { BagIcon, SearchIcon, UserIcon } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { mainNav } from "@/data/catalog";

export function SiteHeader() {
  return (
    <>
      <div className="surface-inverse eyebrow py-2.5 text-center">
        <p className="container-page">
          Complimentary shipping on orders over $200
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container-page relative grid h-header grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center">
            <MobileNav items={mainNav} />
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex gap-8 eyebrow">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-quiet">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link
            href="/"
            className="text-title tracking-[0.35em] uppercase"
            aria-label="Atelier, home"
          >
            Atelier
          </Link>

          <div className="flex items-center justify-end gap-1">
            <Link
              href="/search"
              className="btn btn-ghost size-10 px-0"
              aria-label="Search"
            >
              <SearchIcon />
            </Link>
            <Link
              href="/account"
              className="btn btn-ghost hidden size-10 px-0 sm:inline-flex"
              aria-label="Account"
            >
              <UserIcon />
            </Link>
            <Link
              href="/cart"
              className="btn btn-ghost size-10 px-0"
              aria-label="Shopping bag"
            >
              <BagIcon />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
