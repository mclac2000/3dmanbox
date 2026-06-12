// /api/ai-firma/ingest-idea — Contract A.5.
// Aurelius (insight-dispatch / external-ingest) reicht Cross-Project-Insights oder
// Mars-Tasks hierher. Die Idee landet als Proposal (category=external_idea, risk=low,
// status=pending) in der normalen Decision-Pipeline.
// Auth: X-Ai-Firma-Token (oder ?token=). Dedup ueber meta.source_ref.
import { NextRequest, NextResponse } from "next/server";
import { checkFirmaToken } from "@/lib/ai-firma/auth";
import { sb, createProposal, getAgentBySlug, listAgents } from "@/lib/ai-firma/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Supabase ist aktuell teils via DNS nicht erreichbar — Netz-/DNS-Fehler als 503
// klassifizieren (reparierbare Degradation fuer den Aurelius HTTP-Monitor), nicht 500.
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
    { ok: false, project: "3dmanbox", reason: "backend_unreachable", error: `DB-Backend nicht erreichbar: ${message}` },
    { status: 503 },
  );
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

export async function POST(req: NextRequest) {
  const auth = checkFirmaToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.reason }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body ungültig (JSON erwartet)" }, { status: 400 });
  }

  const title = str(body.title);
  const source = str(body.source);
  if (!title || !source) {
    return NextResponse.json({ ok: false, error: "title und source erforderlich" }, { status: 422 });
  }

  const sourceRef = str(body.source_ref);
  const sourceProject = str(body.source_project);
  const metrics = str(body.metrics);
  const reference = str(body.reference_implementation);
  const targetProject = str(body.target_project);
  const suggestedAgent = str(body.suggested_agent);
  const priority = ["low", "medium", "high", "critical"].includes(String(body.priority))
    ? (body.priority as string)
    : "medium";

  try {
    // Dedup ueber meta.source_ref (nur external_idea-Proposals).
    if (sourceRef) {
      const { data: existing, error } = await sb()
        .from("ai_proposals")
        .select("id, title, status, created_at")
        .eq("category", "external_idea")
        .eq("meta->>source_ref", sourceRef)
        .maybeSingle();
      if (error) {
        if (isBackendUnreachable(error)) return backendDownResponse(error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
      if (existing) {
        return NextResponse.json(
          {
            ok: true,
            duplicate: true,
            idea: { id: existing.id, title: existing.title, source, status: existing.status, created_at: existing.created_at },
          },
          { status: 200 },
        );
      }
    }

    // Ziel-Agent aufloesen: suggested_agent → ceo → erster aktiver Agent.
    let agent = suggestedAgent ? await getAgentBySlug(suggestedAgent) : null;
    if (!agent) agent = await getAgentBySlug("ceo");
    if (!agent) {
      const agents = await listAgents({ enabled: true });
      agent = agents[0] ?? null;
    }
    if (!agent) {
      return NextResponse.json({ ok: false, error: "Kein Agent vorhanden, dem die Idee zugeordnet werden kann" }, { status: 500 });
    }

    const proposal = await createProposal({
      agent_id: agent.id,
      title,
      summary: str(body.description) ?? title,
      details: reference ?? undefined,
      category: "external_idea",
      risk: "low",
      meta: {
        source,
        source_project: sourceProject,
        source_ref: sourceRef,
        target_project: targetProject,
        metrics,
        priority,
        suggested_agent: suggestedAgent,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        duplicate: false,
        idea: { id: proposal.id, title: proposal.title, source, status: proposal.status, created_at: proposal.created_at },
      },
      { status: 201 },
    );
  } catch (e) {
    if (isBackendUnreachable(e)) return backendDownResponse(e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
