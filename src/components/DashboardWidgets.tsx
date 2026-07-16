"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function InviteBox({ link, copyLabel, copiedLabel }: { link: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        readOnly
        value={link}
        onFocus={(e) => e.currentTarget.select()}
        className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600"
      />
      <button
        onClick={copy}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

export function SignOutButton({ label }: { label: string }) {
  const supabase = createClient();
  const router = useRouter();
  async function signOut() {
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={signOut} className="text-sm text-slate-400 underline hover:text-slate-600">
      {label}
    </button>
  );
}
