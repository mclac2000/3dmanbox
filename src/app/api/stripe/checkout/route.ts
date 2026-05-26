import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICES, STRIPE_MODES } from "@/lib/stripe";

const APP_URL = process.env.APP_URL_BOX || "https://3dmanbox.com";

export async function GET(req: NextRequest) {
  const sku = req.nextUrl.searchParams.get("sku") || "MASTER_BOX";

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured on this deployment." },
      { status: 503 },
    );
  }

  const price = STRIPE_PRICES[sku];
  if (!price) {
    return NextResponse.json(
      { error: `Missing Stripe price for ${sku}. Set STRIPE_PRICE_${sku} in env.` },
      { status: 500 },
    );
  }

  const mode = STRIPE_MODES[sku] || "payment";

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      success_url: `${APP_URL}/thanks?session_id={CHECKOUT_SESSION_ID}&sku=${sku}`,
      cancel_url: `${APP_URL}/?cancelled=1`,
      automatic_tax: { enabled: true },
      customer_creation: mode === "payment" ? "always" : undefined,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      metadata: { sku },
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err) {
    console.error("Stripe Checkout Error", err);
    return NextResponse.json(
      { error: "Checkout konnte nicht erstellt werden." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
