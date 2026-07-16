import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales, defaultLocale, isLocale } from "@/i18n/config";
import { env, isSupabaseConfigured } from "@/lib/env";

function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get("locale")?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const accept = req.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Paths that must never be locale-prefixed.
  const isExempt =
    pathname.startsWith("/api") ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".");

  // 1. Locale routing: redirect bare paths to a locale prefix.
  if (!isExempt) {
    const hasLocale = locales.some(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
    );
    if (!hasLocale) {
      const locale = detectLocale(req);
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // 2. Refresh the Supabase auth session so Server Components see a fresh user.
  let res = NextResponse.next({ request: req });
  if (isSupabaseConfigured) {
    const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
        },
      },
    });
    await supabase.auth.getUser();
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
