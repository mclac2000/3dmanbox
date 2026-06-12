// CEO-Auto-Approval — Cron-Endpoint (Pact-KI-Kernel #9e).
// Genehmigt pending Low/Medium-Vorschlaege ohne Kill-Switch selbst und stoesst die
// Umsetzung an; riskante/Geld-/Rechts-Vorschlaege werden eskaliert (bleiben pending).
//
// Aufruf per System-Cron auf pact-prod (stuendlich):
//   0 * * * * curl -sf -H "x-ai-firma-token: $AI_FIRMA_REPORT_TOKEN" \
//     http://localhost:<port>/api/ai-firma/ceo-auto-approve >> /var/log/3dmanbox-ai-firma.log 2>&1
import { NextRequest, NextResponse } from "next/server";
import { checkFirmaToken } from "@/lib/ai-firma/auth";
import { runCeoAutoApproval } from "@/lib/ai-firma/auto-approval";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function handle(req: NextRequest) {
  const auth = checkFirmaToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.reason }, { status: 401 });

  const dry = req.nextUrl.searchParams.get("dry");
  const limit = Number(req.nextUrl.searchParams.get("limit") || 25);
  const result = await runCeoAutoApproval(
    Math.min(Math.max(limit, 1), 100),
    dry === "1" || dry === "true",
  );

  return NextResponse.json({ ...result, timestamp: new Date().toISOString() });
}

export const GET = handle;
export const POST = handle;
