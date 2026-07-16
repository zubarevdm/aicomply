"use client";
import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Question } from "@/content/course";
import { interpolateClient } from "@/lib/interpolate";

type Phase = "answering" | "passed" | "failed";

export function Quiz({
  questions,
  passMark,
  locale,
  dict,
}: {
  questions: Question[];
  passMark: number;
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.quiz;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>("answering");
  const [score, setScore] = useState(0);
  const [issuing, setIssuing] = useState(false);
  const [cert, setCert] = useState<{ no: string; verifyUrl: string } | null>(null);

  function submit() {
    let correct = 0;
    for (const q of questions) if (answers[q.id] === q.correct) correct++;
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setPhase(pct >= passMark ? "passed" : "failed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function issue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIssuing(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          company: form.get("company"),
          score,
          locale,
        }),
      });
      if (!res.ok) throw new Error("issue failed");
      const no = res.headers.get("X-Certificate-No") ?? "";
      const verifyUrl = res.headers.get("X-Verify-Url") ?? "";
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${no || "AIComply-certificate"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setCert({ no, verifyUrl });
    } catch {
      alert(dict.waitlist.error);
    } finally {
      setIssuing(false);
    }
  }

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  if (phase === "passed") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-3xl text-teal-700">✓</div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">{t.passTitle}</h1>
        <p className="mt-3 text-slate-600">{interpolateClient(t.passBody, { score })}</p>

        {cert ? (
          <div className="mt-8 rounded-2xl border border-teal-200 bg-teal-50 p-6 text-left">
            <div className="text-sm text-slate-500">{dict.certificate.id}</div>
            <div className="font-mono text-lg font-bold text-slate-900">{cert.no}</div>
            <p className="mt-3 text-sm text-slate-600">
              {dict.certificate.download} ✓
            </p>
            {cert.verifyUrl && (
              <a href={cert.verifyUrl} className="mt-2 inline-block text-sm font-medium text-teal-700 underline">
                {dict.certificate.verify}: {cert.no}
              </a>
            )}
            <div className="mt-4">
              <Link href={`/${locale}`} className="text-sm text-slate-500 underline">← {dict.nav.product}</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={issue} className="mt-8 grid gap-3 text-left">
            <input
              name="fullName"
              required
              placeholder={t.fullName}
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <input
              name="company"
              placeholder={t.company}
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <button
              type="submit"
              disabled={issuing}
              className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {issuing ? t.generating : t.getCertificate}
            </button>
          </form>
        )}
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-3xl text-amber-600">!</div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">{t.failTitle}</h1>
        <p className="mt-3 text-slate-600">{interpolateClient(t.failBody, { score, pass: passMark })}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={`/${locale}/learn`} className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
            {t.retry}
          </Link>
          <button
            onClick={() => { setPhase("answering"); setAnswers({}); }}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-400"
          >
            {dict.quiz.submit}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
      <p className="mt-2 text-slate-600">{interpolateClient(t.intro, { pass: passMark })}</p>

      <div className="mt-8 space-y-6">
        {questions.map((q, qi) => (
          <fieldset key={q.id} className="rounded-2xl border border-slate-200 p-5">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
              {t.question} {qi + 1}
            </legend>
            <p className="font-medium text-slate-800">{q.q}</p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                    answers[q.id] === oi
                      ? "border-teal-500 bg-teal-50 text-slate-900"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === oi}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className="accent-teal-600"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={!allAnswered}
        className="mt-8 w-full rounded-xl bg-teal-600 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
      >
        {t.submit}
      </button>
    </div>
  );
}
