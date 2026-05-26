export const BOX = {
  domain: "3dmanbox.com",
  url: "https://3dmanbox.com",
  title: "3D Man Box",
  tagline: "The largest 3D character library on the internet",
};

export const CLUB = {
  domain: "3dman.club",
  url: "https://3dman.club",
  title: "3D Man Club",
  tagline: "AI-powered 3D characters on tap",
};

// Pricing aligned with Stripe products (see src/lib/stripe.ts)
export const PRICING = {
  masterBox: {
    name: "Master Box",
    price: 197,
    originalPrice: 1728,
    sku: "MASTER_BOX",
  },
  categoryBoxes: [
    { slug: "business", price: 27, sku: "CAT_BUSINESS" },
    { slug: "sport", price: 22, sku: "CAT_SPORT" },
    { slug: "wellness", price: 25, sku: "CAT_WELLNESS" },
    { slug: "family", price: 22, sku: "CAT_FAMILIE" },
    { slug: "travel", price: 25, sku: "CAT_REISEN" },
    { slug: "food", price: 22, sku: "CAT_FOOD" },
    { slug: "events", price: 25, sku: "CAT_EVENTS" },
    { slug: "tech", price: 25, sku: "CAT_COMPUTER" },
    { slug: "education", price: 22, sku: "CAT_BILDUNG" },
    { slug: "animals", price: 22, sku: "CAT_TIERE" },
  ],
  credits: [
    { slug: "pay-as-you-go", name: "Pay-As-You-Go", price: 9, credits: 50, interval: null, perCredit: 0.18, sku: "CREDITS_PAY_AS_YOU_GO" },
    { slug: "starter", name: "Starter", price: 9, credits: 100, interval: "month", perCredit: 0.09, sku: "CREDITS_STARTER" },
    { slug: "pro", name: "Pro", price: 29, credits: 500, interval: "month", perCredit: 0.058, featured: true, sku: "CREDITS_PRO" },
    { slug: "unlimited", name: "Unlimited", price: 79, credits: -1, interval: "month", perCredit: 0, sku: "CREDITS_UNLIMITED" },
  ],
  oto: { slug: "credits-5000", name: "5,000 AI Credits", price: 47, regularPrice: 290, credits: 5000, sku: "OTO_CREDITS_5000" },
};

export const TRUST = {
  customers: 2347,
  countries: 38,
  averageRating: 4.9,
  totalGenerations: 184_000,
  totalRenders: 15_000,
};

export function categoryPrice(slug: string): number {
  const b = PRICING.categoryBoxes.find((c) => c.slug === slug);
  return b?.price ?? 22;
}

export function categorySku(slug: string): string {
  const b = PRICING.categoryBoxes.find((c) => c.slug === slug);
  return b?.sku ?? "CAT_BUSINESS";
}
