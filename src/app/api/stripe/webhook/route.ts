import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { serverClient } from "@/lib/supabase";
import type Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!stripe || !WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe nicht konfiguriert" },
      { status: 503 },
    );
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = serverClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const email = s.customer_details?.email ?? s.customer_email ?? null;
      const sku = s.metadata?.sku ?? "UNKNOWN";

      if (supabase && email) {
        await supabase.from("orders").insert({
          stripe_session_id: s.id,
          stripe_customer_id: s.customer as string | null,
          email,
          sku,
          amount_total: s.amount_total ?? 0,
          currency: s.currency ?? "eur",
          mode: s.mode,
          status: "paid",
        });

        // Credit allocation per SKU
        const CREDIT_MAP: Record<string, number> = {
          MASTER_BOX: 100,
          OTO_CREDITS_5000: 5000,
          CREDITS_PAY_AS_YOU_GO: 50,
          CREDITS_STARTER: 100,
          CREDITS_PRO: 500,
        };
        const credits = CREDIT_MAP[sku];
        if (credits) {
          await supabase.rpc("grant_credits", { user_email: email, amount: credits });
        }
      }
      break;
    }
    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      if (supabase && inv.customer_email) {
        await supabase.from("invoices").insert({
          stripe_invoice_id: inv.id,
          email: inv.customer_email,
          amount_paid: inv.amount_paid,
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      if (supabase) {
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", sub.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
