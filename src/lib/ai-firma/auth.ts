// Token-Auth für /api/ai-firma/*-Endpunkte.
import { NextRequest } from "next/server";

const REPORT_TOKEN = process.env.AI_FIRMA_REPORT_TOKEN || "";

export function checkFirmaToken(req: NextRequest): { ok: boolean; reason?: string } {
  if (!REPORT_TOKEN) return { ok: false, reason: "AI_FIRMA_REPORT_TOKEN nicht gesetzt" };
  const header = req.headers.get("x-ai-firma-token");
  const q = req.nextUrl.searchParams.get("token");
  const provided = header || q || "";
  if (provided !== REPORT_TOKEN) return { ok: false, reason: "Token ungültig" };
  return { ok: true };
}
