// Proposal-Implementation: Setzt genehmigte Proposals automatisch um.
// Wird nach Approve (decide-Endpoint oder CEO-Auto) getriggert.
// Ablauf: CTO/Spezialist bekommt Auftrag → setzt um → QA prüft.

import { runAgent } from "./agent-service";
import { sb, getAgentBySlug } from "./db";

interface ImplResult {
  ok: boolean;
  log: string;
  qaOk?: boolean;
  qaLog?: string;
}

/**
 * Einzelnen Proposal umsetzen.
 */
export async function implementProposal(proposalId: number): Promise<ImplResult> {
  const { data: proposal, error } = await sb()
    .from("ai_proposals")
    .select("*, agent:agent_slug(*)")
    .eq("id", proposalId)
    .maybeSingle();

  if (error || !proposal) {
    return { ok: false, log: `Proposal #${proposalId} nicht gefunden` };
  }

  if (proposal.status !== "approved") {
    return { ok: false, log: `Status ist ${proposal.status}, nicht approved` };
  }

  // Status: implementing
  await sb().from("ai_proposals").update({
    implementation_status: "running",
    implementation_started_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", proposalId);

  // Richtigen Agent bestimmen (CTO als Fallback)
  const targetSlug = routeToAgent(proposal.risk, proposal.agent_slug);

  try {
    const result = await runAgent({
      agent: targetSlug,
      task: buildImplementationPrompt(proposal),
      taskType: "proposal_implementation",
    });

    const log = result.text || "(keine Antwort)";

    // Status: done
    await sb().from("ai_proposals").update({
      status: "implemented",
      implementation_status: "done",
      implementation_finished_at: new Date().toISOString(),
      implementation_log: log.slice(0, 5000),
      updated_at: new Date().toISOString(),
    }).eq("id", proposalId);

    // QA-Check
    let qaResult: { ok: boolean; log: string } = { ok: true, log: "" };
    try {
      qaResult = await qaVerify(proposalId, proposal, log);
    } catch (e) {
      qaResult = { ok: false, log: `QA-Fehler: ${e instanceof Error ? e.message : String(e)}` };
    }

    return { ok: true, log, qaOk: qaResult.ok, qaLog: qaResult.log };
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    await sb().from("ai_proposals").update({
      implementation_status: "failed",
      implementation_finished_at: new Date().toISOString(),
      implementation_log: `Fehler: ${errMsg}`,
      updated_at: new Date().toISOString(),
    }).eq("id", proposalId);

    return { ok: false, log: `Implementation fehlgeschlagen: ${errMsg}` };
  }
}

/**
 * QA-Agent prüft die Umsetzung.
 */
async function qaVerify(
  proposalId: number,
  proposal: Record<string, unknown>,
  implLog: string
): Promise<{ ok: boolean; log: string }> {
  const qa = await getAgentBySlug("qa");
  if (!qa) return { ok: true, log: "Kein QA-Agent vorhanden, übersprungen." };

  const result = await runAgent({
    agent: qa,
    task: `Vorschlag #${proposalId} wurde umgesetzt. Prüfe ob die Umsetzung korrekt ist.\n\n`
      + `**Titel:** ${proposal.title}\n`
      + `**Beschreibung:** ${proposal.description || "(keine)"}\n\n`
      + `**Umsetzungs-Log:**\n${implLog.slice(0, 2000)}\n\n`
      + `WICHTIG (Loop-Schutz, Lehre aus dem $104-QA-CTO-Loop): Erstelle KEINE neuen Vorschläge `
      + `(kein create_proposal). Schreibe gefundene Probleme nur als kurzen Bericht — nur Marco `
      + `entscheidet, ob ein Befund zu einem neuen Vorschlag wird.\n`
      + `Falls Probleme: liste sie knapp auf. Falls alles ok: antworte mit "QA bestanden".`,
    taskType: "qa_verification",
  });

  // Loop-Schutz (#9f): QA läuft pro Implementation genau EINMAL (inline) und darf keine
  // Folge-Proposals erzeugen. Erzeugt der QA-Agent dennoch eins (Tool ignoriert Anweisung),
  // werten wir das als NICHT bestanden — es triggert aber keine weitere QA-Runde.
  const createdFollowUp = (result.toolLog || []).some((t) => t.name === "create_proposal");
  const text = (result.text || "").toLowerCase();
  const ok = !createdFollowUp && (text.includes("bestanden")
    || (!text.includes("problem") && !text.includes("fehler") && !text.includes("kritisch")));

  return { ok, log: result.text.slice(0, 1000) };
}

/**
 * Alle genehmigten aber nicht umgesetzten Proposals abarbeiten.
 */
export async function implementPending(): Promise<{ implemented: number; failed: number }> {
  const { data: pending } = await sb()
    .from("ai_proposals")
    .select("id")
    .eq("status", "approved")
    .or("implementation_status.is.null,implementation_status.eq.pending")
    .order("created_at", { ascending: true })
    .limit(5);

  let implemented = 0;
  let failed = 0;

  for (const p of pending || []) {
    const result = await implementProposal(p.id);
    if (result.ok) implemented++;
    else failed++;
  }

  return { implemented, failed };
}

/**
 * Route zum richtigen Agenten basierend auf Risiko und Quelle.
 */
function routeToAgent(risk: string | null, sourceSlug: string | null): string {
  if (risk === "high" || risk === "critical") return "cto";
  if (sourceSlug === "cmo" || sourceSlug === "gallery_curator") return "cmo";
  if (sourceSlug === "lora_master") return "cto";
  return "cto"; // Default: CTO macht die Umsetzung
}

/**
 * Implementation-Prompt für den ausführenden Agenten.
 */
function buildImplementationPrompt(proposal: Record<string, unknown>): string {
  return `Marco hat den Vorschlag #${proposal.id} genehmigt. Du bist verantwortlich für die Umsetzung.

**Titel:** ${proposal.title}
**Beschreibung:** ${proposal.description || "(keine)"}
**Begründung:** ${proposal.rationale || "(keine)"}
**Risiko:** ${proposal.risk || "unbekannt"}

AUFGABE: Setze diesen Vorschlag um. Nutze deine verfügbaren Tools wenn möglich.
Wenn du nicht alles automatisch umsetzen kannst, dokumentiere genau was noch manuell gemacht werden muss.
Antworte mit:
- Was wurde geändert
- Was bleibt offen
- Empfohlener Verifikations-Schritt`;
}
