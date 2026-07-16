import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface CertificateData {
  certificateNo: string;
  fullName: string;
  organisation?: string | null;
  courseTitle: string;
  issuedAt: Date;
  verifyUrl: string;
  labels: {
    heading: string;
    subheading: string;
    awarded: string;
    completed: string;
    issued: string;
    id: string;
    verify: string;
  };
}

/** Unique, human-readable certificate number, e.g. AIC-2026-7F3A9C2B. */
export function generateCertificateNo(seedYear: number): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `AIC-${seedYear}-${hex}`;
}

// Standard fonts use WinAnsi encoding; drop code points it cannot represent
// so a user-entered name never crashes PDF generation.
function safe(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const c = ch.codePointAt(0) ?? 0;
      if (c === 0x20ac) return "EUR";
      if (c >= 0x20 && c <= 0xff) return ch;
      if (ch === "–" || ch === "—") return "-";
      if (ch === "’") return "'";
      return "";
    })
    .join("");
}

const BRAND = rgb(0.05, 0.09, 0.16); // slate-900
const ACCENT = rgb(0.02, 0.45, 0.42); // teal-700
const MUTED = rgb(0.42, 0.45, 0.5);

export async function buildCertificatePdf(
  data: CertificateData,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const serif = await doc.embedFont(StandardFonts.TimesRomanBold);

  const center = (
    text: string,
    y: number,
    size: number,
    font = reg,
    color = BRAND,
  ) => {
    const t = safe(text);
    const w = font.widthOfTextAtSize(t, size);
    page.drawText(t, { x: (width - w) / 2, y, size, font, color });
  };

  // Outer + inner border
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: ACCENT,
    borderWidth: 3,
  });
  page.drawRectangle({
    x: 34,
    y: 34,
    width: width - 68,
    height: height - 68,
    borderColor: rgb(0.8, 0.85, 0.84),
    borderWidth: 1,
  });

  // Brand
  center("AIComply", height - 92, 22, bold, ACCENT);
  center(data.labels.heading.toUpperCase(), height - 150, 34, serif, BRAND);
  center(data.labels.subheading, height - 182, 14, reg, MUTED);

  // Recipient
  center(data.labels.awarded, height - 250, 13, reg, MUTED);
  center(data.fullName, height - 295, 30, bold, BRAND);
  if (data.organisation) {
    center(data.organisation, height - 320, 14, reg, ACCENT);
  }

  // Body
  const bodyLines = wrap(safe(data.labels.completed), reg, 13, width - 220);
  let by = height - 365;
  for (const line of bodyLines) {
    center(line, by, 13, reg, rgb(0.25, 0.28, 0.33));
    by -= 20;
  }

  // Footer row: issued | cert no | verify
  const footY = 80;
  const fmt = data.issuedAt.toISOString().slice(0, 10);
  page.drawText(safe(`${data.labels.issued}: ${fmt}`), {
    x: 70,
    y: footY,
    size: 11,
    font: reg,
    color: MUTED,
  });
  const idText = safe(`${data.labels.id}: ${data.certificateNo}`);
  page.drawText(idText, {
    x: (width - reg.widthOfTextAtSize(idText, 11)) / 2,
    y: footY,
    size: 11,
    font: bold,
    color: BRAND,
  });
  const vText = safe(`${data.labels.verify}: ${data.verifyUrl}`);
  page.drawText(vText, {
    x: width - 70 - reg.widthOfTextAtSize(vText, 10),
    y: footY,
    size: 10,
    font: reg,
    color: ACCENT,
  });

  // Signature line
  page.drawLine({
    start: { x: width / 2 - 90, y: footY + 40 },
    end: { x: width / 2 + 90, y: footY + 40 },
    thickness: 0.8,
    color: rgb(0.7, 0.74, 0.73),
  });

  return doc.save();
}

function wrap(text: string, font: import("pdf-lib").PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}
