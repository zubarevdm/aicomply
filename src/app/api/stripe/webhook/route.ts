import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 400 });
  }

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig ?? "", env.stripeWebhookSecret);
  } catch {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = session.metadata?.plan ?? "starter";
    const seats = Number(session.metadata?.seats ?? 0);
    const email = session.customer_details?.email ?? null;
    const customerId =
      typeof session.customer === "string" ? session.customer : null;

    const admin = createAdminClient();
    if (admin) {
      // Provision a seat allocation keyed by the Stripe customer. The buyer
      // claims/links it on signup (see README onboarding notes).
      await admin.from("organizations").upsert(
        {
          name: session.customer_details?.name ?? email ?? "New customer",
          plan,
          seats,
          stripe_customer_id: customerId,
        },
        { onConflict: "stripe_customer_id" },
      );
    }
  }

  return NextResponse.json({ received: true });
}
