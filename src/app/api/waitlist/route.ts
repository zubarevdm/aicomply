import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  company: z.string().max(160).optional().nullable(),
  team_size: z.string().max(40).optional().nullable(),
  role: z.string().max(120).optional().nullable(),
  product: z.enum(["lms", "scanner"]).default("lms"),
  locale: z.string().max(5).default("en"),
});

export async function POST(req: NextRequest) {
  let data;
  try {
    data = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Preferred: store in Supabase.
  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    if (admin) {
      const { error } = await admin.from("waitlist").insert({
        email: data.email,
        company: data.company ?? null,
        team_size: data.team_size ?? null,
        role: data.role ?? null,
        product: data.product,
        locale: data.locale,
      });
      if (!error) return NextResponse.json({ ok: true });
    }
  }

  // Dev/no-backend fallback: append to a local JSONL file so leads are never lost.
  try {
    const dir = path.join(process.cwd(), ".data");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(
      path.join(dir, "waitlist.jsonl"),
      JSON.stringify({ ...data, ts: new Date().toISOString() }) + "\n",
      "utf8",
    );
  } catch {
    // Filesystem may be read-only (serverless) — still acknowledge so the
    // user isn't blocked; configure Supabase for durable capture.
  }

  return NextResponse.json({ ok: true });
}
