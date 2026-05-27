// Pipeline-Trigger (Cron). POST = ausführen (mit Token).
import { NextRequest, NextResponse } from "next/server";
import { runDailyPipeline } from "@/lib/ai-firma/pipeline";
import { send } from "@/lib/ai-firma/telegram";
import { checkFirmaToken } from "@/lib/ai-firma/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const auth = checkFirmaToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.reason }, { status: 401 });

  const r = await runDailyPipeline();
  if (req.nextUrl.searchParams.get("push_telegram") !== "0") {
    await send(`🤖 Pipeline ausgeführt: ${r.ran} Agent-Läufe, ${r.proposals} neue Vorschläge.\n\n${r.log.slice(0, 5).join("\n")}`);
  }
  return NextResponse.json({ ok: true, ...r });
}
