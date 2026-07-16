import Stripe from "stripe";
import { env } from "@/lib/env";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!env.stripeSecret) return null;
  if (!cached) cached = new Stripe(env.stripeSecret);
  return cached;
}

export const PLAN_SEATS: Record<string, number> = {
  starter: 15,
  team: 50,
  business: 150,
};
