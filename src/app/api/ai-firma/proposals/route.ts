// /api/ai-firma/proposals — Aurelius-kompatibler Endpoint.
// GET  = pending + escalated Proposals abrufen
// POST = Entscheidung (approve/reject/escalate) auf ein Proposal anwenden
import { NextRequest, NextResponse } from "next/server";
import { checkFirmaToken } from "@/lib/ai-firma/auth";
import { sb } from "@/lib/ai-firma/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Fehlerklassifikation: Ist das DB-Backend (Supabase) nicht erreichbar?
// supabase-js liefert bei Netz-/DNS-Fehlern ein error-Objekt mit "fetch failed";
// sb() wirft, wenn der Service-Client nicht initialisiert werden konnte.
// Solche Fälle sind Infrastruktur-Ausfälle → 503 (Service Unavailable), nicht 500.
// So kann der Aurelius HTTP-Monitor sie als reparierbare Degradation klassifizieren
// statt als opaken Code-Crash, und der Stacktrace wird nicht durchgereicht.
// ---------------------------------------------------------------------------
function isBackendUnreachable(err: unknown): boolean {
  const msg =
    err instanceof Error
      ? err.message
      : String((err as { message?: unknown })?.message ?? err ?? "");
  return /fetch failed|failed to fetch|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|getaddrinfo|network|socket hang up|nicht initialisiert/i.test(
    msg,
  );
}

function backendDownResponse(err: unknown) {
  const message = err instanceof Error ? err.message : String((err as { message?: unknown })?.message ?? err);
  return NextResponse.json(
    {
      ok: false,
      project: "3dmanbox",
      reason: "backend_unreachable",
      error: `DB-Backend nicht erreichbar: ${message}`,
    },
    { status: 503 },
  );
}

// ---------------------------------------------------------------------------
// GET — Alle pending + escalated Proposals für Aurelius
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const auth = checkFirmaToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.reason }, { status: 401 });

  try {
    const client = sb();

    // Proposals mit Status pending oder escalated
    const { data: proposals, error } = await client
      .from("ai_proposals")
      .select("id, agent_id, title, summary, details, category, risk, impact, effort, status, meta, created_at")
      .in("status", ["pending", "escalated"])
      .order("created_at", { ascending: false });

    if (error) {
      if (isBackendUnreachable(error)) return backendDownResponse(error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Agent-Namen auflösen (Fehler hier sind nicht fatal → leere Map)
    const agentIds = Array.from(new Set((proposals || []).map((p) => p.agent_id)));
    let agentMap = new Map<number, string>();
    if (agentIds.length > 0) {
      const { data: agents } = await client
        .from("ai_agents")
        .select("id, name, slug")
        .in("id", agentIds);
      agentMap = new Map((agents || []).map((a) => [a.id, a.name]));
    }

    const mapped = (proposals || []).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.summary,
      type: p.category || "general",
      priority: p.risk || "low",
      status: p.status,
      agent: agentMap.get(p.agent_id) || "unknown",
      created_at: p.created_at,
      // Zusätzliche Felder für Aurelius-Kontext
      details: p.details,
      impact: p.impact,
      effort: p.effort,
      meta: p.meta,
    }));

    return NextResponse.json({
      ok: true,
      project: "3dmanbox",
      count: mapped.length,
      proposals: mapped,
    });
  } catch (e) {
    if (isBackendUnreachable(e)) return backendDownResponse(e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST — Entscheidung von Aurelius annehmen
// Body: { id: number, action: "approve"|"reject"|"escalate", reason: string }
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const auth = checkFirmaToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.reason }, { status: 401 });

  let body: { id: number; action: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body ungültig (JSON erwartet)" }, { status: 400 });
  }

  const { id, action, reason } = body;
  if (!id || !action) {
    return NextResponse.json({ ok: false, error: "id und action erforderlich" }, { status: 400 });
  }

  const validActions = ["approve", "reject", "escalate"];
  if (!validActions.includes(action)) {
    return NextResponse.json(
      { ok: false, error: `action muss eines von ${validActions.join(", ")} sein` },
      { status: 400 },
    );
  }

  try {
    const client = sb();

    // Proposal finden
    const { data: proposal, error: fetchErr } = await client
      .from("ai_proposals")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) {
      if (isBackendUnreachable(fetchErr)) return backendDownResponse(fetchErr);
      return NextResponse.json({ ok: false, error: fetchErr.message }, { status: 500 });
    }
    if (!proposal) {
      return NextResponse.json({ ok: false, error: "Proposal nicht gefunden" }, { status: 404 });
    }

    // Status-Mapping: action → DB-Status
    const statusMap: Record<string, string> = {
      approve: "approved",
      reject: "rejected",
      escalate: "escalated",
    };
    const newStatus = statusMap[action];

    // Update
    const { error: updateErr } = await client
      .from("ai_proposals")
      .update({
        status: newStatus,
        decided_by: "aurelius",
        decided_at: new Date().toISOString(),
        decision_note: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateErr) {
      if (isBackendUnreachable(updateErr)) return backendDownResponse(updateErr);
      return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      id,
      old_status: proposal.status,
      new_status: newStatus,
      decided_by: "aurelius",
    });
  } catch (e) {
    if (isBackendUnreachable(e)) return backendDownResponse(e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
