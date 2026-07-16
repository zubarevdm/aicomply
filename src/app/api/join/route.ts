import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { COURSE } from "@/content/course";

export const runtime = "nodejs";

const Body = z.object({ token: z.string().min(6) });

export async function POST(req: NextRequest) {
  let token: string;
  try {
    ({ token } = Body.parse(await req.json()));
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "not_configured" }, { status: 400 });

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = auth.user;

  // Resolve the org by invite token using the service role (token is the secret).
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "not_configured" }, { status: 400 });

  const { data: org } = await admin
    .from("organizations")
    .select("id, seats, seats_used")
    .eq("invite_token", token)
    .maybeSingle();
  if (!org) return NextResponse.json({ error: "invalid_token" }, { status: 404 });

  await admin.from("profiles").upsert(
    { id: user.id, email: user.email, org_id: org.id, role: "employee" },
    { onConflict: "id" },
  );

  await admin.from("enrollments").upsert(
    { user_id: user.id, org_id: org.id, course_slug: COURSE.slug, status: "in_progress" },
    { onConflict: "user_id,course_slug" },
  );

  await admin
    .from("organizations")
    .update({ seats_used: (org.seats_used ?? 0) + 1 })
    .eq("id", org.id);

  return NextResponse.json({ ok: true });
}
