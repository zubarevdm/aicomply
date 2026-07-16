export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  stripeSecret: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePublishable: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey,
);

export const isStripeConfigured = Boolean(env.stripeSecret);

export const priceIds = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "",
  team: process.env.STRIPE_PRICE_TEAM ?? "",
  business: process.env.STRIPE_PRICE_BUSINESS ?? "",
};
