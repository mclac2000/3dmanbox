// Decision-Pipeline: täglich Avatare → CMO/CRO → CEO konsolidiert → Marco.
// Wird vom /api/ai-firma/pipeline-Cron getriggert.

import { runAgent } from "./agent-service";
import { listAgents, sb } from "./db";

export async function runDailyPipeline(): Promise<{ ran: number; proposals: number; log: string[] }> {
  const log: string[] = [];
  let proposalCount = 0;
  let runCount = 0;

  // Stand-Aufnahme (KPIs für Kontext)
  const since = new Date(Date.now() - 24 * 3600_000).toISOString();
  const { count: ordersCount } = await sb().from("orders").select("id", { count: "exact", head: true }).gte("created_at", since);
  const { count: genCount } = await sb().from("generations").select("id", { count: "exact", head: true }).gte("created_at", since);
  log.push(`Stand 24h: ${ordersCount ?? 0} Orders, ${genCount ?? 0} Generations.`);

  const all = await listAgents({ enabled: true });
  const avatars = all.filter((a) => a.is_avatar);
  const cmo = all.find((a) => a.slug === "cmo");
  const cro = all.find((a) => a.slug === "cro");
  const ceo = all.find((a) => a.slug === "ceo");
  const analyst = all.find((a) => a.slug === "analyst");
  const lora = all.find((a) => a.slug === "lora_master");

  // 1. Avatare reflektieren (knapp)
  const avatarFeedback: string[] = [];
  for (const a of avatars) {
    try {
      const r = await runAgent({
        agent: a,
        task: "Schreibe 2-3 Sätze: Was würdest du dir aktuell von 3D Man Box wünschen? Was nervt? Wenn ein konkreter Wunsch lohnt: lege via create_proposal einen Vorschlag an (agent_slug: dein slug, risk: low|medium).",
        taskType: "avatar_reflection",
      });
      avatarFeedback.push(`${a.name}: ${r.text.slice(0, 300)}`);
      runCount++;
      if ((r.toolLog || []).some((t) => t.name === "create_proposal")) proposalCount++;
    } catch (e) {
      log.push(`⚠️ Avatar ${a.slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // 2. Analyst macht Bestandsaufnahme
  if (analyst) {
    try {
      const r = await runAgent({
        agent: analyst,
        task: "Hole get_kpis (24h), list_top_categories (168h) und fal_cost_window (24h). Schreibe maximal 3 priorisierte Empfehlungen. Für die wichtigste: lege via create_proposal (agent_slug: 'analyst') einen Vorschlag an.",
        taskType: "daily_analysis",
      });
      log.push(`Analyst: ${r.text.slice(0, 300)}`);
      runCount++;
      if ((r.toolLog || []).some((t) => t.name === "create_proposal")) proposalCount++;
    } catch (e) {
      log.push(`⚠️ Analyst: ${e instanceof Error ? e.message : e}`);
    }
  }

  // 3. LoRA-Meister checkt fal.ai-Kosten
  if (lora) {
    try {
      const r = await runAgent({
        agent: lora,
        task: "Prüfe fal_cost_window (24h und 168h). Wenn 24h > 30 USD oder ungewöhnlich hoch: create_proposal mit agent_slug 'lora_master', risk medium, Empfehlung zur Kosten-Optimierung.",
        taskType: "fal_cost_review",
      });
      log.push(`LoRA: ${r.text.slice(0, 200)}`);
      runCount++;
      if ((r.toolLog || []).some((t) => t.name === "create_proposal")) proposalCount++;
    } catch (e) {
      log.push(`⚠️ LoRA: ${e instanceof Error ? e.message : e}`);
    }
  }

  // 4. CMO konsolidiert Marketing-Input
  if (cmo) {
    try {
      const r = await runAgent({
        agent: cmo,
        task: `Avatar-Stimmen aus heute:\n${avatarFeedback.join("\n")}\n\nHole KPIs und Top-Kategorien. Wenn eine Marketing-Maßnahme lohnt (z.B. Kampagne, Headline-Test, Pricing-Hinweis), lege via create_proposal (agent_slug: 'cmo') einen Vorschlag an. Maximal 2 Vorschläge.`,
        taskType: "marketing_review",
      });
      runCount++;
      log.push(`CMO: ${r.text.slice(0, 300)}`);
      if ((r.toolLog || []).some((t) => t.name === "create_proposal")) proposalCount++;
    } catch (e) {
      log.push(`⚠️ CMO: ${e instanceof Error ? e.message : e}`);
    }
  }

  // 5. CRO designt einen A/B-Test (sparsam)
  if (cro && (proposalCount > 0 || (genCount ?? 0) > 5)) {
    try {
      const r = await runAgent({
        agent: cro,
        task: "Hole KPIs und Top-Kategorien. Schlage genau einen konkreten A/B-Test vor (Hypothese, Variante A vs B, Erfolgs-Metrik). Lege via create_proposal (agent_slug 'cro', category 'ab_test', risk low) an, wenn sinnvoll.",
        taskType: "ab_test_design",
      });
      runCount++;
      log.push(`CRO: ${r.text.slice(0, 200)}`);
      if ((r.toolLog || []).some((t) => t.name === "create_proposal")) proposalCount++;
    } catch (e) {
      log.push(`⚠️ CRO: ${e instanceof Error ? e.message : e}`);
    }
  }

  // 6. CEO sieht pending Proposals und priorisiert (kein neues Proposal, nur Kommentar)
  if (ceo) {
    try {
      const r = await runAgent({
        agent: ceo,
        task: "Hole list_pending_proposals. Priorisiere die Top-3 für Marco in 2-3 Sätzen. Erstelle KEIN neues Proposal — du konsolidierst nur.",
        taskType: "ceo_briefing",
        tools: ["list_pending_proposals", "get_kpis"],
      });
      runCount++;
      log.push(`CEO: ${r.text.slice(0, 300)}`);
    } catch (e) {
      log.push(`⚠️ CEO: ${e instanceof Error ? e.message : e}`);
    }
  }

  return { ran: runCount, proposals: proposalCount, log };
}
