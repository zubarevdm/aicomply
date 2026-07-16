"use client";
import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { setLocaleCookie } from "@/lib/locale-cookie";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    setLocaleCookie(next);
    const rest = pathname.replace(/^\/(en|nl|de)/, "");
    router.push(`/${next}${rest || ""}`);
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-current={l === current}
          className={`rounded px-2 py-1 uppercase transition ${
            l === current
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:bg-slate-100"
          }`}
          title={localeNames[l]}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
