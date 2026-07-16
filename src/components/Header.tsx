import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={base} className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-600 text-sm text-white">
            A
          </span>
          <span className="text-lg">AIComply</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <a href={`${base}#how`} className="hover:text-slate-900">{dict.nav.how}</a>
          <a href={`${base}#pricing`} className="hover:text-slate-900">{dict.nav.pricing}</a>
          <a href={`${base}#faq`} className="hover:text-slate-900">{dict.nav.faq}</a>
          <Link href={`${base}/login`} className="hover:text-slate-900">{dict.nav.login}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher current={locale} />
          <a
            href={`${base}#pricing`}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            {dict.nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
