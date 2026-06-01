// Telegram-Approve/Reject-Webhook. HMAC-signiert via /lib/ai-firma/hmac.ts.
import { NextRequest, NextResponse } from "next/server";
import { verify } from "@/lib/ai-firma/hmac";
import { sb } from "@/lib/ai-firma/db";
import { send } from "@/lib/ai-firma/telegram";
import { implementProposal } from "@/lib/ai-firma/implementation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const id = Number(sp.get("id"));
  const action = sp.get("action");
  const exp = Number(sp.get("exp"));
  const sig = sp.get("sig") || "";

  if (!id || !action || !exp || !sig) {
    return NextResponse.json({ ok: false, error: "Parameter fehlen" }, { status: 400 });
  }
  if (Math.floor(Date.now() / 1000) > exp) {
    return NextResponse.json({ ok: false, error: "Link abgelaufen" }, { status: 403 });
  }
  if (!verify({ id, action, exp }, sig)) {
    return NextResponse.json({ ok: false, error: "Signatur ungültig" }, { status: 403 });
  }
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ ok: false, error: "Unbekannte Aktion" }, { status: 400 });
  }

  const { data: proposal, error } = await sb().from("ai_proposals").select("*").eq("id", id).maybeSingle();
  if (error || !proposal) {
    return NextResponse.json({ ok: false, error: "Vorschlag nicht gefunden" }, { status: 404 });
  }
  if (proposal.status !== "pending") {
    return NextResponse.json({ ok: false, error: `Status ist bereits ${proposal.status}` }, { status: 409 });
  }

  const newStatus = action === "approve" ? "approved" : "rejected";
  await sb().from("ai_proposals").update({
    status: newStatus,
    decided_by: "marco_telegram",
    decided_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  const verb = action === "approve" ? "✅ akzeptiert" : "❌ abgelehnt";
  await send(`Vorschlag #${id} — ${proposal.title} ${verb}.`);

  // Auto-Implementation bei Genehmigung (async, blockiert nicht die Response)
  if (action === "approve") {
    implementProposal(id).then((r) => {
      if (r.ok) {
        send(`🔧 Vorschlag #${id} wurde automatisch umgesetzt. QA: ${r.qaOk ? "✅" : "⚠️"}`).catch(() => {});
      } else {
        send(`⚠️ Umsetzung #${id} fehlgeschlagen: ${r.log.slice(0, 200)}`).catch(() => {});
      }
    }).catch(() => {});
  }

  return new NextResponse(
    `<html><head><meta charset="utf-8"><title>Erledigt</title>
    <style>body{font-family:system-ui;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
    .box{max-width:480px;padding:32px;border:1px solid #333;border-radius:12px;text-align:center}</style></head>
    <body><div class="box">
    <h1>${verb}</h1>
    <p>Vorschlag #${id} — ${escapeHtml(proposal.title)}</p>
    <p style="color:#888;font-size:13px;margin-top:24px">Du kannst das Tab schließen.</p>
    </div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
