"use client";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const planKeys = ["starter", "team", "business"] as const;

export function Pricing({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function buy(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Stripe not configured yet — fall back to the lead form.
        window.location.href = `/${locale}#waitlist`;
      }
    } catch {
      window.location.href = `/${locale}#waitlist`;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {dict.pricing.plans.map((plan, i) => {
        const key = planKeys[i];
        return (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-6 ${
              plan.popular
                ? "border-teal-500 bg-white shadow-lg shadow-teal-100 ring-1 ring-teal-500"
                : "border-slate-200 bg-white"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-6 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
                ★
              </span>
            )}
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{plan.unit}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-teal-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => buy(key)}
              disabled={loading === key}
              className={`mt-6 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                plan.popular
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-slate-900 text-white hover:bg-slate-700"
              }`}
            >
              {loading === key ? "…" : dict.pricing.cta}
            </button>
          </div>
        );
      })}
    </div>
  );
}
