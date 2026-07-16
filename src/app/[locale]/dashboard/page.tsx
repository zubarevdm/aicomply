import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { InviteBox, SignOutButton } from "@/components/DashboardWidgets";

const logoutLabel: Record<Locale, string> = { en: "Log out", nl: "Uitloggen", de: "Abmelden" };

interface MemberRow {
  id: string;
  name: string;
  email: string;
  completed: boolean;
  date: string | null;
  cert: string | null;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const d = dict.dashboard;

  const supabase = await createClient();

  // No backend configured → explain how to enable it.
  if (!supabase) {
    return (
      <Shell title={d.title}>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          {d.notConfigured}
        </div>
      </Shell>
    );
  }

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/${l}/login`);
  const user = auth.user;

  // Ensure a profile exists.
  await supabase
    .from("profiles")
    .upsert({ id: user.id, email: user.email }, { onConflict: "id" });

  let { data: profile } = await supabase
    .from("profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .maybeSingle();

  // First-time owner: create an organisation and become its admin.
  if (!profile?.org_id) {
    const { data: org } = await supabase
      .from("organizations")
      .insert({
        name: user.email?.split("@")[1] ?? "My company",
        owner_id: user.id,
      })
      .select("id")
      .single();
    if (org) {
      await supabase
        .from("profiles")
        .update({ org_id: org.id, role: "admin" })
        .eq("id", user.id);
      profile = { org_id: org.id, role: "admin" };
    }
  }

  const orgId = profile?.org_id ?? null;
  const { data: org } = orgId
    ? await supabase
        .from("organizations")
        .select("name, plan, seats, invite_token")
        .eq("id", orgId)
        .maybeSingle()
    : { data: null };

  // Members + their progress.
  const [{ data: members }, { data: enrollments }, { data: certs }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email").eq("org_id", orgId),
    supabase.from("enrollments").select("user_id, status, completed_at, score").eq("org_id", orgId),
    supabase.from("certificates").select("user_id, certificate_no").eq("org_id", orgId),
  ]);

  const enrollMap = new Map((enrollments ?? []).map((e) => [e.user_id, e]));
  const certMap = new Map((certs ?? []).map((c) => [c.user_id, c.certificate_no]));
  const rows: MemberRow[] = (members ?? []).map((m) => {
    const e = enrollMap.get(m.id);
    return {
      id: m.id,
      name: m.full_name ?? m.email,
      email: m.email,
      completed: e?.status === "completed",
      date: e?.completed_at ? e.completed_at.slice(0, 10) : null,
      cert: certMap.get(m.id) ?? null,
    };
  });

  const total = Math.max(rows.length, org?.seats ?? 0, 1);
  const trained = rows.filter((r) => r.completed).length;
  const pct = Math.round((trained / total) * 100);
  const inviteLink = `${env.appUrl}/${l}/join?token=${org?.invite_token ?? ""}`;

  return (
    <Shell title={`${d.title} · ${org?.name ?? ""}`} right={<SignOutButton label={logoutLabel[l]} />}>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label={d.coverage} value={`${pct}%`} accent />
        <Stat label={d.trained} value={`${trained}`} />
        <Stat label={d.pending} value={`${Math.max(total - trained, 0)}`} />
      </div>

      {/* Invite */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-800">{d.invite}</h2>
        <p className="mt-1 text-sm text-slate-500">{d.inviteHint}</p>
        <div className="mt-4">
          <InviteBox link={inviteLink} copyLabel={d.copyLink} copiedLabel={d.copied} />
        </div>
      </div>

      {/* Members table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-800">{d.name}</h2>
          <a
            href={`/api/audit`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-slate-400"
          >
            {d.export}
          </a>
        </div>
        {rows.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400">{d.emptyState}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">{d.name}</th>
                <th className="px-6 py-3 font-medium">{d.statusCol}</th>
                <th className="px-6 py-3 font-medium">{d.dateCol}</th>
                <th className="px-6 py-3 font-medium">{d.certCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-3">
                    <div className="font-medium text-slate-800">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.email}</div>
                  </td>
                  <td className="px-6 py-3">
                    {r.completed ? (
                      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">{d.trained}</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">{d.pending}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-slate-500">{r.date ?? "—"}</td>
                  <td className="px-6 py-3">
                    {r.cert ? (
                      <a href={`/verify/${r.cert}`} className="font-mono text-xs text-teal-700 underline">{r.cert}</a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link href={`/${l}/learn`} className="text-sm font-medium text-teal-700 underline">
          {dict.course.start} →
        </Link>
      </div>
    </Shell>
  );
}

function Shell({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {right}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 ${accent ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-white"}`}>
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${accent ? "text-teal-700" : "text-slate-900"}`}>{value}</div>
    </div>
  );
}
