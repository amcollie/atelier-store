export type Collection = {
  slug: string;
  name: string;
  image: string;
  alt: string;
};

/** At or below this many units, the product page shows a low-stock note */
export const LOW_STOCK_THRESHOLD = 5;

const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export function productImageUrl(p: { photo: string }, width = 800) {
  return unsplash(p.photo, width);
}

export function productCloseUpUrl(
  p: { photo: string; focus?: [x: number, y: number] },
  width = 1400,
) {
  const [x, y] = p.focus ?? [0.5, 0.4];
  return `${unsplash(p.photo, width)}&h=${Math.round(width * 1.25)}&crop=focalpoint&fp-x=${x}&fp-y=${y}&fp-z=2.2`;
}

export const heroImage = {
  src: unsplash("1539109136881-3be0616acf4b", 2400),
  alt: "A model in a powder-blue wool coat standing in a cathedral square",
};

export const collections: Collection[] = [
  {
    slug: "women",
    name: "Women",
    image: unsplash("1496747611176-843222e1e57c"),
    alt: "Floral wrap dress blowing in the sea breeze",
  },
  {
    slug: "men",
    name: "Men",
    image: unsplash("1594938298603-c8148c4dae35"),
    alt: "Tailored blue check three-piece suit",
  },
  {
    slug: "accessories",
    name: "Accessories",
    image: unsplash("1584917865442-de89df76afd3"),
    alt: "Structured red leather top-handle bag",
  },
  {
    slug: "knitwear",
    name: "Knitwear",
    image: unsplash("1558769132-cb1aea458c5e"),
    alt: "Neutral knitted jumpers hanging on a rail",
  },
];

export const editorials = [
  {
    eyebrow: "The Knitwear Edit",
    title: "Soft layers for the colder months",
    cta: "Shop knitwear",
    href: "/collections/knitwear",
    image: unsplash("1445205170230-053b83016050", 1400),
    alt: "A clothing rail of camel, cream and olive coats and knits",
  },
  {
    eyebrow: "Tailoring",
    title: "Considered cuts, made to last",
    cta: "Shop tailoring",
    href: "/collections/men",
    image: unsplash("1441986300917-64674bd600d8", 1400),
    alt: "A boutique interior with shelves of folded garments",
  },
];

export const services = [
  {
    title: "Complimentary shipping",
    body: "On every order over $200, delivered in signature packaging.",
  },
  {
    title: "Thirty-day returns",
    body: "Changed your mind? Send it back, unworn, free of charge.",
  },
  {
    title: "Made to be kept",
    body: "Natural fibres, honest construction and repairs for life.",
  },
];

export const mainNav = [
  { label: "New In", href: "/collections/new" },
  { label: "Women", href: "/collections/women" },
  { label: "Men", href: "/collections/men" },
  { label: "Knitwear", href: "/collections/knitwear" },
  { label: "Accessories", href: "/collections/accessories" },
];

/** Takes a price in cents */
export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
