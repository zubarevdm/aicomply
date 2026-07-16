"use client";
import { useState } from "react";
import type { Dictionary } from "@/i18n/types";

export function Faq({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {dict.faq.items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
          >
            <span className="font-medium text-slate-800">{item.q}</span>
            <span className="text-xl text-slate-400">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
