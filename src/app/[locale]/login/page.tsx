import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { AuthForm } from "@/components/AuthForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">{dict.nav.login}</h1>
      <p className="mt-2 text-sm text-slate-500">{dict.dashboard.title}</p>
      <div className="mt-8">
        <AuthForm
          next={`/${l}/dashboard`}
          cta={dict.nav.login}
          notConfiguredText={dict.dashboard.notConfigured}
        />
      </div>
    </div>
  );
}
