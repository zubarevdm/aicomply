import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, PLAN_SEATS } from "@/lib/stripe";
import { env, priceIds } from "@/lib/env";

export const runtime = "nodejs";

const Body = z.object({
  plan: z.enum(["starter", "team", "business"]),
  locale: z.string().max(5).default("en"),
});

export async function POST(req: NextRequest) {
  let data;
  try {
    data = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const stripe = getStripe();
  const priceId = priceIds[data.plan];
  // Not configured yet → signal the client to fall back to the lead form.
  if (!stripe || !priceId) {
    return NextResponse.json({ url: null, reason: "stripe_not_configured" });
  }

  const base = `${env.appUrl}/${data.locale}`;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/dashboard?checkout=success`,
    cancel_url: `${base}?checkout=cancelled#pricing`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    metadata: { plan: data.plan, seats: String(PLAN_SEATS[data.plan]) },
  });

  return NextResponse.json({ url: session.url });
}
