// fal.ai-Cost-Event posten. Vom Generator nach jedem fal-Call aufrufen.
import { NextRequest, NextResponse } from "next/server";
import { sb } from "@/lib/ai-firma/db";
import { send } from "@/lib/ai-firma/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  user_id?: string;
  generation_id?: string;
  model: string;
  cost_usd: number;
  tokens_or_steps?: number;
  meta?: Record<string, unknown>;
  // optional: internal token to allow direct calls from frontend (skip for now)
}

export async function POST(req: NextRequest) {
  // Akzeptiert nur Server-Side-Aufrufe mit Service-Token oder Anthropic-internem Aufruf.
  const token = req.headers.get("x-ai-firma-token");
  const expected = process.env.AI_FIRMA_REPORT_TOKEN || "";
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: "Token erforderlich" }, { status: 401 });
  }

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Body ungültig" }, { status: 400 }); }
  if (!body.model || typeof body.cost_usd !== "number") {
    return NextResponse.json({ ok: false, error: "model + cost_usd erforderlich" }, { status: 400 });
  }

  await sb().from("fal_cost_events").insert({
    user_id: body.user_id || null,
    generation_id: body.generation_id || null,
    model: body.model,
    cost_usd: body.cost_usd,
    tokens_or_steps: body.tokens_or_steps || null,
    meta: body.meta || {},
  });

  // Tageslimit prüfen
  const since = new Date(Date.now() - 24 * 3600_000).toISOString();
  const { data: dayEvents } = await sb().from("fal_cost_events").select("cost_usd").gte("created_at", since);
  const total = (dayEvents || []).reduce((s, e) => s + Number(e.cost_usd || 0), 0);

  const { data: limitCfg } = await sb().from("ai_config").select("value").eq("key", "fal_daily_limit_usd").maybeSingle();
  const limit = Number(limitCfg?.value) || 50;
  if (total > limit) {
    await send(`⚠️ fal.ai-Tageslimit überschritten: $${total.toFixed(2)} > $${limit.toFixed(2)} (24h).`);
  }

  return NextResponse.json({ ok: true, total_24h_usd: Math.round(total * 100) / 100, limit_usd: limit });
}
