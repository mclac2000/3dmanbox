import { NextRequest, NextResponse } from "next/server";
import { buildDailyReport, formatReportForTelegram } from "@/lib/ai-firma/report";
import { send } from "@/lib/ai-firma/telegram";
import { checkFirmaToken } from "@/lib/ai-firma/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(req: NextRequest) {
  const auth = checkFirmaToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.reason }, { status: 401 });

  const hours = Number(req.nextUrl.searchParams.get("hours") || 24);
  const report = await buildDailyReport(Math.min(Math.max(hours, 1), 24 * 30));

  const push = req.nextUrl.searchParams.get("push_telegram") === "1" || req.method === "POST";
  let pushResult: { ok: boolean; message_id?: number; error?: string } | null = null;
  if (push) {
    pushResult = await send(formatReportForTelegram(report));
  }

  return NextResponse.json({ ok: true, report, push: pushResult });
}

export const GET = handle;
export const POST = handle;
