// CEO-Auto-Approval (Pact-KI-Kernel #9d/#9e) — autonome Freigabe pending Vorschlaege.
//
// Regelbasiertes Modell (deterministisch, portiert aus CoachPact/CongressPact):
//   LOW/MEDIUM Risk + sichere Kategorie + kein Kill-Switch-Keyword → auto-approve + implementieren
//   HIGH/CRITICAL Risk / Geld-/Rechts-Kategorie / Kill-Switch-Treffer  → eskaliert (bleibt pending,
//   Marco/Aurelius holt ab; decided_by gesetzt → wird nicht erneut betrachtet).
//
// Loop-Schutz (#9f): es werden NUR noch nicht entschiedene Proposals betrachtet
// (decided_by IS NULL). Ein bereits versuchter/eskalierter Vorschlag wird nie erneut
// auto-approved.
import { sb } from "@/lib/ai-firma/db";
import { implementProposal } from "@/lib/ai-firma/implementation";

const NEVER_AUTO_CATEGORIES = [
  "pricing",
  "marketing",
  "compliance",
  "legal",
  "payment",
  "billing",
  "finance",
];

const KILL_SWITCH_KEYWORDS = [
  "preis", "pricing", "tarif", "stripe", "paypal", "bezahl", "zahlung",
  "payout", "auszahlung", "refund", "rückerstatt", "rueckerstatt",
  "loesch", "lösch", "delete", "drop ", "truncate", "migration",
  "dsgvo", "datenschutz", "consent", "oauth", "api-key", "api key",
  "secret", "passwort", "password", "token", "vertrag", "kündig", "kuendig",
];

export type Decision = "auto_approve" | "escalate";

export interface AutoApprovalResult {
  ok: boolean;
  processed: number;
  autoApproved: number;
  escalated: number;
  dryRun: boolean;
  details: Array<{ id: number; title: string; decision: Decision; reason: string }>;
}

interface PendingProposal {
  id: number;
  title: string;
  summary: string | null;
  details: string | null;
  category: string | null;
  risk: "low" | "medium" | "high" | "critical";
  meta: Record<string, unknown> | null;
}

const RISK_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export async function runCeoAutoApproval(limit = 25, dryRun = false): Promise<AutoApprovalResult> {
  // Loop-/Dedup-Schutz: nur Proposals ohne Entscheidung.
  const { data, error } = await sb()
    .from("ai_proposals")
    .select("id, title, summary, details, category, risk, meta")
    .eq("status", "pending")
    .is("decided_by", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    return { ok: false, processed: 0, autoApproved: 0, escalated: 0, dryRun, details: [] };
  }

  const pending = (data || []) as PendingProposal[];
  pending.sort((a, b) => (RISK_RANK[a.risk] ?? 9) - (RISK_RANK[b.risk] ?? 9));

  const details: AutoApprovalResult["details"] = [];
  let autoApproved = 0;
  let escalated = 0;

  for (const p of pending) {
    const { decision, reason } = decide(p);
    details.push({ id: p.id, title: p.title, decision, reason });

    if (dryRun) {
      decision === "auto_approve" ? autoApproved++ : escalated++;
      continue;
    }

    if (decision === "auto_approve") {
      await applyAutoApproval(p.id, reason);
      autoApproved++;
    } else {
      await markEscalated(p, reason);
      escalated++;
    }
  }

  return { ok: true, processed: pending.length, autoApproved, escalated, dryRun, details };
}

/** Deterministische Kern-Entscheidung. */
export function decide(p: PendingProposal): { decision: Decision; reason: string } {
  if (p.risk === "critical" || p.risk === "high") {
    return { decision: "escalate", reason: `${p.risk} Risk — immer Eskalation.` };
  }
  const category = (p.category ?? "").toLowerCase();
  if (NEVER_AUTO_CATEGORIES.includes(category)) {
    return { decision: "escalate", reason: `Kategorie "${category}" wird nie automatisch genehmigt (Geld/Recht/Marketing).` };
  }
  if (hasKillSwitchHit(p)) {
    return { decision: "escalate", reason: "Kill-Switch-Keyword erkannt — Eskalation." };
  }
  if (p.risk === "low" || p.risk === "medium") {
    return { decision: "auto_approve", reason: `Sichere Kategorie "${category || "—"}" mit ${p.risk} Risk.` };
  }
  return { decision: "escalate", reason: "Unklarer Fall — Eskalation (Default deny)." };
}

function hasKillSwitchHit(p: PendingProposal): boolean {
  const haystack = `${p.category ?? ""} ${p.title} ${p.summary ?? ""} ${p.details ?? ""}`.toLowerCase();
  return KILL_SWITCH_KEYWORDS.some((kw) => haystack.includes(kw));
}

async function applyAutoApproval(id: number, reason: string): Promise<void> {
  await sb().from("ai_proposals").update({
    status: "approved",
    decided_by: "ceo-auto",
    decided_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  // Implementierung asynchron anstossen (blockiert die Cron-Response nicht).
  implementProposal(id).catch(() => {});
}

async function markEscalated(p: PendingProposal, reason: string): Promise<void> {
  const meta = { ...(p.meta ?? {}), escalated: true, escalation_reason: reason };
  await sb().from("ai_proposals").update({
    // Status bleibt pending → Marco kann via HMAC weiterhin entscheiden.
    decided_by: "ceo-auto-escalated",
    meta,
    updated_at: new Date().toISOString(),
  }).eq("id", p.id);
}
