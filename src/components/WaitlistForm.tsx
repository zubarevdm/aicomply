"use client";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function WaitlistForm({
  locale,
  dict,
  product = "lms",
}: {
  locale: Locale;
  dict: Dictionary;
  product?: "lms" | "scanner";
}) {
  const t = dict.waitlist;
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          company: form.get("company"),
          team_size: form.get("team_size"),
          role: form.get("role"),
          product,
          locale,
        }),
      });
      setState(res.ok ? "ok" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-6 text-center text-teal-800">
        ✓ {t.success}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <input
        name="email"
        type="email"
        required
        placeholder={t.email}
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:col-span-2"
      />
      <input
        name="company"
        placeholder={t.company}
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
      <select
        name="team_size"
        defaultValue=""
        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      >
        <option value="" disabled>{t.size}</option>
        {t.sizes.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input
        name="role"
        placeholder={t.role}
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:col-span-2"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60 sm:col-span-2"
      >
        {state === "loading" ? "…" : t.submit}
      </button>
      {state === "error" && (
        <p className="text-sm text-red-600 sm:col-span-2">{t.error}</p>
      )}
    </form>
  );
}
