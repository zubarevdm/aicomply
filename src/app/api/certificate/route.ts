import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDictionary } from "@/i18n";
import { isLocale, defaultLocale } from "@/i18n/config";
import { COURSE } from "@/content/course";
import {
  buildCertificatePdf,
  generateCertificateNo,
} from "@/lib/certificate";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const Body = z.object({
  fullName: z.string().min(1).max(120),
  company: z.string().max(160).optional().nullable(),
  score: z.number().int().min(0).max(100),
  locale: z.string().default(defaultLocale),
});

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (parsed.score < COURSE.passMark) {
    return NextResponse.json({ error: "not_passed" }, { status: 403 });
  }

  const locale = isLocale(parsed.locale) ? parsed.locale : defaultLocale;
  const dict = await getDictionary(locale);

  const issuedAt = new Date();
  const certNo = generateCertificateNo(issuedAt.getFullYear());
  const courseTitle = COURSE.titleByLocale[locale];
  const verifyUrl = `${env.appUrl}/verify/${certNo}`;

  // Who is taking it (optional — anonymous demo issuance is allowed).
  let userId: string | null = null;
  let orgId: string | null = null;
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      userId = data.user.id;
      const { data: profile } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", userId)
        .maybeSingle();
      orgId = profile?.org_id ?? null;
    }
  }

  // Persist with the service-role client so RLS doesn't block issuance.
  const admin = createAdminClient();
  if (admin) {
    await admin.from("certificates").insert({
      certificate_no: certNo,
      user_id: userId,
      org_id: orgId,
      full_name: parsed.fullName,
      organisation: parsed.company ?? null,
      course_slug: COURSE.slug,
      course_title: courseTitle,
      score: parsed.score,
      locale,
    });
    if (userId) {
      await admin
        .from("enrollments")
        .upsert(
          {
            user_id: userId,
            org_id: orgId,
            course_slug: COURSE.slug,
            status: "completed",
            score: parsed.score,
            completed_at: issuedAt.toISOString(),
          },
          { onConflict: "user_id,course_slug" },
        );
    }
  }

  const pdf = await buildCertificatePdf({
    certificateNo: certNo,
    fullName: parsed.fullName,
    organisation: parsed.company ?? null,
    courseTitle,
    issuedAt,
    verifyUrl,
    labels: {
      heading: dict.certificate.heading,
      subheading: dict.certificate.subheading,
      awarded: dict.certificate.awarded,
      completed: dict.certificate.completed,
      issued: dict.certificate.issued,
      id: dict.certificate.id,
      verify: dict.certificate.verify,
    },
  });

  return new NextResponse(pdf as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${certNo}.pdf"`,
      "X-Certificate-No": certNo,
      "X-Verify-Url": verifyUrl,
      "Cache-Control": "no-store",
    },
  });
}
