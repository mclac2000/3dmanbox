export const BOX = {
  domain: "3dmanbox.com",
  url: "https://3dmanbox.com",
  title: "3D Man Box",
  tagline: "1.000+ premium 3D-Charaktere für Business-Visuals",
};

export const CLUB = {
  domain: "3dman.club",
  url: "https://3dman.club",
  title: "3D Man Club",
  tagline: "Dein KI-Studio für unbegrenzte 3D-Charaktere",
};

export const PRICING = {
  masterBox: {
    name: "3D Man Box — Master",
    price: 197,
    originalPrice: 1728,
    sku: "MASTER_BOX",
    description: "1.000+ Premium-Charaktere, lebenslange Nutzungsrechte",
  },
  categoryBoxes: [
    { slug: "business", name: "Business-Profis", price: 27, count: 150 },
    { slug: "tech", name: "Tech & IT", price: 27, count: 120 },
    { slug: "healthcare", name: "Healthcare", price: 27, count: 100 },
    { slug: "education", name: "Bildung", price: 17, count: 80 },
    { slug: "lifestyle", name: "Lifestyle", price: 17, count: 90 },
    { slug: "creative", name: "Kreative", price: 17, count: 70 },
  ],
  credits: [
    {
      slug: "pay-as-you-go",
      name: "Pay-As-You-Go",
      price: 9,
      credits: 50,
      interval: null,
      perCredit: 0.18,
    },
    {
      slug: "starter",
      name: "Starter",
      price: 9,
      credits: 100,
      interval: "month",
      perCredit: 0.09,
    },
    {
      slug: "pro",
      name: "Pro",
      price: 29,
      credits: 500,
      interval: "month",
      perCredit: 0.058,
      featured: true,
    },
    {
      slug: "unlimited",
      name: "Unlimited",
      price: 79,
      credits: -1,
      interval: "month",
      perCredit: 0,
    },
  ],
  orderBumps: [
    {
      slug: "powerpoint-templates",
      name: "10 PowerPoint-Templates mit 3D-Charakteren",
      price: 19,
    },
    {
      slug: "canva-pack",
      name: "Canva-Pack: 50 fertige Designs",
      price: 14,
    },
  ],
  oto: {
    slug: "credits-5000",
    name: "5.000 KI-Credits",
    price: 47,
    regularPrice: 290,
    credits: 5000,
  },
};

export const TRUST = {
  customers: 2347,
  countries: 38,
  averageRating: 4.9,
  totalGenerations: 184_000,
};
