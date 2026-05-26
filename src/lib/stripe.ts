import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;

// Stripe Price-ID mapping — must be set in env or replaced by stripe price lookups
export const STRIPE_PRICES: Record<string, string | undefined> = {
  MASTER_BOX: process.env.STRIPE_PRICE_MASTER_BOX,
  // Kategorie-Boxen (10 Stück)
  CAT_BUSINESS: process.env.STRIPE_PRICE_CAT_BUSINESS,
  CAT_SPORT: process.env.STRIPE_PRICE_CAT_SPORT,
  CAT_WELLNESS: process.env.STRIPE_PRICE_CAT_WELLNESS,
  CAT_FAMILIE: process.env.STRIPE_PRICE_CAT_FAMILIE,
  CAT_REISEN: process.env.STRIPE_PRICE_CAT_REISEN,
  CAT_FOOD: process.env.STRIPE_PRICE_CAT_FOOD,
  CAT_EVENTS: process.env.STRIPE_PRICE_CAT_EVENTS,
  CAT_COMPUTER: process.env.STRIPE_PRICE_CAT_COMPUTER,
  CAT_BILDUNG: process.env.STRIPE_PRICE_CAT_BILDUNG,
  CAT_TIERE: process.env.STRIPE_PRICE_CAT_TIERE,
  // Credits
  CREDITS_PAY_AS_YOU_GO: process.env.STRIPE_PRICE_CREDITS_PAYG,
  CREDITS_STARTER: process.env.STRIPE_PRICE_CREDITS_STARTER,
  CREDITS_PRO: process.env.STRIPE_PRICE_CREDITS_PRO,
  CREDITS_UNLIMITED: process.env.STRIPE_PRICE_CREDITS_UNLIMITED,
  OTO_CREDITS_5000: process.env.STRIPE_PRICE_OTO_CREDITS,
  // Bumps
  BUMP_POWERPOINT: process.env.STRIPE_PRICE_BUMP_POWERPOINT,
  BUMP_CANVA: process.env.STRIPE_PRICE_BUMP_CANVA,
};

export const STRIPE_MODES: Record<string, "payment" | "subscription"> = {
  MASTER_BOX: "payment",
  CAT_BUSINESS: "payment",
  CAT_SPORT: "payment",
  CAT_WELLNESS: "payment",
  CAT_FAMILIE: "payment",
  CAT_REISEN: "payment",
  CAT_FOOD: "payment",
  CAT_EVENTS: "payment",
  CAT_COMPUTER: "payment",
  CAT_BILDUNG: "payment",
  CAT_TIERE: "payment",
  CREDITS_PAY_AS_YOU_GO: "payment",
  CREDITS_STARTER: "subscription",
  CREDITS_PRO: "subscription",
  CREDITS_UNLIMITED: "subscription",
  OTO_CREDITS_5000: "payment",
  BUMP_POWERPOINT: "payment",
  BUMP_CANVA: "payment",
};
