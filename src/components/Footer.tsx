import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-teal-600 text-xs text-white">A</span>
            AIComply
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-500">{dict.footer.tagline}</p>
          <p className="mt-4 max-w-md text-xs text-slate-400">{dict.footer.disclaimer}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-700">{dict.footer.product}</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><a href={`${base}#how`} className="hover:text-slate-900">{dict.nav.how}</a></li>
            <li><a href={`${base}#pricing`} className="hover:text-slate-900">{dict.nav.pricing}</a></li>
            <li><Link href={`${base}/learn`} className="hover:text-slate-900">{dict.course.start}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-700">{dict.footer.legal}</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><a href={`${base}#faq`} className="hover:text-slate-900">{dict.nav.faq}</a></li>
            <li><Link href={`${base}/login`} className="hover:text-slate-900">{dict.nav.login}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} AIComply. {dict.footer.rights}
      </div>
    </footer>
  );
}
