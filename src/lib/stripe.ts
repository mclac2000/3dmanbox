import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;

// Stripe Price-ID mapping — must be set in env or replaced by stripe price lookups
export const STRIPE_PRICES: Record<string, string | undefined> = {
  MASTER_BOX: process.env.STRIPE_PRICE_MASTER_BOX,
  CAT_BUSINESS: process.env.STRIPE_PRICE_CAT_BUSINESS,
  CAT_TECH: process.env.STRIPE_PRICE_CAT_TECH,
  CAT_HEALTHCARE: process.env.STRIPE_PRICE_CAT_HEALTHCARE,
  CAT_EDUCATION: process.env.STRIPE_PRICE_CAT_EDUCATION,
  CAT_LIFESTYLE: process.env.STRIPE_PRICE_CAT_LIFESTYLE,
  CAT_CREATIVE: process.env.STRIPE_PRICE_CAT_CREATIVE,
  CREDITS_PAY_AS_YOU_GO: process.env.STRIPE_PRICE_CREDITS_PAYG,
  CREDITS_STARTER: process.env.STRIPE_PRICE_CREDITS_STARTER,
  CREDITS_PRO: process.env.STRIPE_PRICE_CREDITS_PRO,
  CREDITS_UNLIMITED: process.env.STRIPE_PRICE_CREDITS_UNLIMITED,
  OTO_CREDITS_5000: process.env.STRIPE_PRICE_OTO_CREDITS,
  BUMP_POWERPOINT: process.env.STRIPE_PRICE_BUMP_POWERPOINT,
  BUMP_CANVA: process.env.STRIPE_PRICE_BUMP_CANVA,
};

export const STRIPE_MODES: Record<string, "payment" | "subscription"> = {
  MASTER_BOX: "payment",
  CAT_BUSINESS: "payment",
  CAT_TECH: "payment",
  CAT_HEALTHCARE: "payment",
  CAT_EDUCATION: "payment",
  CAT_LIFESTYLE: "payment",
  CAT_CREATIVE: "payment",
  CREDITS_PAY_AS_YOU_GO: "payment",
  CREDITS_STARTER: "subscription",
  CREDITS_PRO: "subscription",
  CREDITS_UNLIMITED: "subscription",
  OTO_CREDITS_5000: "payment",
  BUMP_POWERPOINT: "payment",
  BUMP_CANVA: "payment",
};
