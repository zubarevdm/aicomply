import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { WaitlistForm } from "@/components/WaitlistForm";
import { notFound } from "next/navigation";

export default async function Landing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const base = `/${l}`;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
            {dict.hero.badge}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            {dict.hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {dict.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`${base}#pricing`}
              className="rounded-xl bg-teal-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              {dict.hero.ctaPrimary}
            </a>
            <Link
              href={`${base}/learn`}
              className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-400"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400">{dict.hero.trust}</p>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight">{dict.problem.title}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">{dict.problem.body}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {dict.problem.points.map((p) => (
              <div key={p.k} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-wide text-teal-700">{p.k}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight">{dict.how.title}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {dict.how.steps.map((s) => (
              <div key={s.t} className="rounded-2xl border border-slate-200 bg-white p-7">
                <div className="text-lg font-bold text-teal-700">{s.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight">{dict.features.title}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dict.features.items.map((f) => (
              <div key={f.t} className="rounded-2xl border border-slate-200 p-6">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal-50 text-teal-700">◆</div>
                <h3 className="mt-4 font-semibold text-slate-800">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-16 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">{dict.pricing.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">{dict.pricing.subtitle}</p>
          </div>
          <div className="mt-12">
            <Pricing locale={l} dict={dict} />
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">{dict.pricing.note}</p>
        </div>
      </section>

      {/* Upsell + waitlist */}
      <section id="waitlist" className="scroll-mt-16 bg-slate-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{dict.upsell.title}</h2>
            <p className="mt-5 leading-relaxed text-slate-300">{dict.upsell.body}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-slate-900">
            <h3 className="text-lg font-bold">{dict.waitlist.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{dict.waitlist.subtitle}</p>
            <div className="mt-5">
              <WaitlistForm locale={l} dict={dict} product="scanner" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight">{dict.faq.title}</h2>
          <div className="mt-12">
            <Faq dict={dict} />
          </div>
        </div>
      </section>
    </div>
  );
}
