import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "@/components/AuthForm";
import { JoinClient } from "@/components/JoinClient";

export default async function JoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">{dict.hero.ctaPrimary}</h1>
      <p className="mt-2 text-sm text-slate-500">{dict.course.estTime} · {dict.course.start}</p>
      <div className="mt-8">
        {!supabase ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            {dict.dashboard.notConfigured}
          </div>
        ) : !token ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Missing invite token.
          </div>
        ) : user ? (
          <JoinClient token={token} locale={l} />
        ) : (
          <AuthForm
            next={`/${l}/join?token=${token}`}
            cta={dict.nav.login}
            notConfiguredText={dict.dashboard.notConfigured}
          />
        )}
      </div>
    </div>
  );
}
