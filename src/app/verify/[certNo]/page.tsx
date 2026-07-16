import Link from "next/link";
import { getDictionary } from "@/i18n";
import { defaultLocale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

interface VerifiedCert {
  certificate_no: string;
  full_name: string;
  organisation: string | null;
  course_title: string;
  issued_at: string;
  valid: boolean;
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ certNo: string }>;
}) {
  const { certNo } = await params;
  const dict = await getDictionary(defaultLocale);
  const c = dict.certificate;

  let cert: VerifiedCert | null = null;
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.rpc("verify_certificate", { cert_no: certNo });
    if (Array.isArray(data) && data.length > 0) cert = data[0] as VerifiedCert;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2 font-bold">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-600 text-sm text-white">A</span>
        AIComply
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">{c.verifyTitle}</h1>

        {cert ? (
          <div className="mt-6">
            <div className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
              <span>✓</span> {c.verified}
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              <Row label={c.id} value={cert.certificate_no} mono />
              <Row label={c.issuedTo} value={cert.full_name} />
              {cert.organisation && <Row label={c.organisation} value={cert.organisation} />}
              <Row label={c.course} value={cert.course_title} />
              <Row label={c.issued} value={cert.issued_at.slice(0, 10)} />
              <Row label={c.status} value={c.valid} />
            </dl>
          </div>
        ) : (
          <div className="mt-6 rounded-lg bg-amber-50 px-4 py-6 text-center text-sm text-amber-700">
            {c.notFound}
            <div className="mt-1 font-mono text-xs text-amber-600">{certNo}</div>
          </div>
        )}
      </div>
      <p className="mt-6 max-w-md text-center text-xs text-slate-400">{dict.footer.disclaimer}</p>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`text-right font-medium text-slate-900 ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
