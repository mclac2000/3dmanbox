import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!stripe) return NextResponse.json({ error: "stripe not configured" }, { status: 503 });

  const { amount } = (await req.json()) as { amount?: number };
  const cents = Math.round(Number(amount || 0) * 100);
  if (!cents || cents < 100 || cents > 1_000_000) {
    return NextResponse.json({ error: "invalid amount" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: cents,
            product_data: {
              name: "Donation · 3D Man Box",
              description: "Thank you for keeping the library growing.",
            },
          },
          quantity: 1,
        },
      ],
      submit_type: "donate",
      success_url: `${req.headers.get("origin") || "https://3dmanbox.com"}/donate/thanks`,
      cancel_url: `${req.headers.get("origin") || "https://3dmanbox.com"}/donate`,
      billing_address_collection: "auto",
      payment_method_types: ["card"],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("donate error", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
