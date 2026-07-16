"use client";
import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Lesson, Block } from "@/content/course";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h":
      return <h3 className="mt-6 text-lg font-semibold text-slate-800">{block.text}</h3>;
    case "p":
      return <p className="mt-4 leading-relaxed text-slate-600">{block.text}</p>;
    case "list":
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-slate-600">
              <span className="mt-1 text-teal-600">•</span>
              <span className="leading-relaxed">{it}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-4">
          <div className="text-sm font-semibold text-teal-800">{block.title}</div>
          <p className="mt-1 text-sm leading-relaxed text-teal-900/80">{block.text}</p>
        </div>
      );
  }
}

export function CoursePlayer({
  lessons,
  locale,
  dict,
}: {
  lessons: Lesson[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const lesson = lessons[i];
  const isLast = i === lessons.length - 1;
  const progress = Math.round((seen.size / lessons.length) * 100);

  function go(next: number) {
    setI(next);
    setSeen((s) => new Set(s).add(next));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {dict.course.progress} · {progress}%
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <ol className="space-y-1">
          {lessons.map((ls, idx) => (
            <li key={ls.id}>
              <button
                onClick={() => go(idx)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                  idx === i ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs ${
                  seen.has(idx) ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {idx + 1}
                </span>
                <span className="truncate">{ls.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      {/* Content */}
      <article>
        <div className="text-sm text-slate-400">
          {dict.course.lesson} {i + 1} {dict.course.of} {lessons.length} · {lesson.minutes} min
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{lesson.title}</h2>
        <div className="mt-2">
          {lesson.blocks.map((b, idx) => (
            <BlockView key={idx} block={b} />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
          <button
            onClick={() => go(Math.max(0, i - 1))}
            disabled={i === 0}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 disabled:opacity-40"
          >
            ← {dict.course.prev}
          </button>
          {isLast ? (
            <Link
              href={`/${locale}/quiz`}
              className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              {dict.course.toQuiz} →
            </Link>
          ) : (
            <button
              onClick={() => go(i + 1)}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {dict.course.next} →
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
