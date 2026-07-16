import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function csvCell(v: string): string {
  return `"${v.replace(/"/g, '""')}"`;
}

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "not_configured" }, { status: 400 });

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", auth.user.id)
    .maybeSingle();
  const orgId = profile?.org_id;
  if (!orgId) return NextResponse.json({ error: "no_org" }, { status: 404 });

  const [{ data: members }, { data: enrollments }, { data: certs }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email").eq("org_id", orgId),
    supabase.from("enrollments").select("user_id, status, completed_at, score").eq("org_id", orgId),
    supabase.from("certificates").select("user_id, certificate_no").eq("org_id", orgId),
  ]);

  const eMap = new Map((enrollments ?? []).map((e) => [e.user_id, e]));
  const cMap = new Map((certs ?? []).map((c) => [c.user_id, c.certificate_no]));

  const header = ["Name", "Email", "Status", "Score", "Completed", "Certificate No"];
  const lines = [header.map(csvCell).join(",")];
  for (const m of members ?? []) {
    const e = eMap.get(m.id);
    lines.push(
      [
        m.full_name ?? "",
        m.email ?? "",
        e?.status === "completed" ? "Trained" : "Pending",
        e?.score != null ? String(e.score) : "",
        e?.completed_at ? e.completed_at.slice(0, 10) : "",
        cMap.get(m.id) ?? "",
      ]
        .map(csvCell)
        .join(","),
    );
  }

  const csv = "﻿" + lines.join("\r\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="aicomply-audit-report.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
