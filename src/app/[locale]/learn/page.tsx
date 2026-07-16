import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { getCourseContent, COURSE } from "@/content/course";
import { CoursePlayer } from "@/components/CoursePlayer";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const content = getCourseContent(l);

  return (
    <div className="bg-white">
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            {dict.course.estTime} · v{COURSE.version}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{COURSE.titleByLocale[l]}</h1>
        </div>
      </div>
      <CoursePlayer lessons={content.lessons} locale={l} dict={dict} />
    </div>
  );
}
