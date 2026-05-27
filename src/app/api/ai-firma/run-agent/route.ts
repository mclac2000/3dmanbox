// Adhoc Agent-Lauf — für Admin-UI und Tests.
import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/ai-firma/agent-service";
import { checkFirmaToken } from "@/lib/ai-firma/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const auth = checkFirmaToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.reason }, { status: 401 });

  let body: { agent_slug: string; task: string; task_type?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Body ungültig" }, { status: 400 }); }
  if (!body.agent_slug || !body.task) return NextResponse.json({ ok: false, error: "agent_slug + task erforderlich" }, { status: 400 });

  const r = await runAgent({
    agent: body.agent_slug,
    task: body.task.slice(0, 2000),
    taskType: body.task_type || "adhoc",
  });

  return NextResponse.json({
    ok: true,
    text: r.text,
    rounds: r.rounds,
    cost_usd: r.cost,
    tokens: r.usage,
    tool_log: r.toolLog,
  });
}
