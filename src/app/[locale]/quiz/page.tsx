import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { getCourseContent, COURSE } from "@/content/course";
import { Quiz } from "@/components/Quiz";

export default async function QuizPage({
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
      <Quiz
        questions={content.quiz}
        passMark={COURSE.passMark}
        locale={l}
        dict={dict}
      />
    </div>
  );
}
