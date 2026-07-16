"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({
  next,
  cta,
  notConfiguredText,
}: {
  next: string;
  cta: string;
  notConfiguredText: string;
}) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  if (!supabase) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        {notConfiguredText}
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirect },
    });
    setState(error ? "error" : "sent");
  }

  if (state === "sent") {
    return (
      <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
        ✓ {email}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {state === "loading" ? "…" : cta}
      </button>
      {state === "error" && (
        <p className="text-sm text-red-600">Could not send the link. Try again.</p>
      )}
    </form>
  );
}
