// Daily-Report-Builder: aggregiert KPIs, Proposals, Aktivitäten für /api/ai-firma/daily-report.
import { sb } from "./db";

export async function buildDailyReport(hours = 24) {
  const since = new Date(Date.now() - hours * 3600_000).toISOString();
  const client = sb();

  const [orders, gens, falEvents, profiles, tickets, proposalsAll, activitiesAll, agents] = await Promise.all([
    client.from("orders").select("amount_total, sku, created_at").gte("created_at", since),
    client.from("generations").select("id, status, credits_spent, category, created_at").gte("created_at", since),
    client.from("fal_cost_events").select("cost_usd, model, created_at").gte("created_at", since),
    client.from("profiles").select("id, total_credits, used_credits, created_at").gte("created_at", since),
    client.from("support_tickets").select("id, status, priority, created_at").gte("created_at", since),
    client.from("ai_proposals").select("id, agent_id, title, summary, risk, impact, status, created_at").gte("created_at", since).order("created_at", { ascending: false }),
    client.from("ai_activities").select("agent_id, task_type, cost_usd, tokens_in, tokens_out, status, created_at").gte("created_at", since),
    client.from("ai_agents").select("id, slug, name, role"),
  ]);

  const revenueCents = (orders.data || []).reduce((s, o) => s + (o.amount_total || 0), 0);
  const falCostUsd = (falEvents.data || []).reduce((s, e) => s + Number(e.cost_usd || 0), 0);
  const agentById = new Map((agents.data || []).map((a) => [a.id, a]));

  const byTaskType: Record<string, { activities: number; cost_usd: number; tokens_in: number; tokens_out: number }> = {};
  for (const a of activitiesAll.data || []) {
    const k = a.task_type;
    byTaskType[k] ||= { activities: 0, cost_usd: 0, tokens_in: 0, tokens_out: 0 };
    byTaskType[k].activities++;
    byTaskType[k].cost_usd += Number(a.cost_usd || 0);
    byTaskType[k].tokens_in += a.tokens_in || 0;
    byTaskType[k].tokens_out += a.tokens_out || 0;
  }

  const byCategory: Record<string, number> = {};
  for (const g of gens.data || []) {
    const c = g.category || "uncategorized";
    byCategory[c] = (byCategory[c] || 0) + 1;
  }

  const openTickets = (tickets.data || []).filter((t) => t.status === "open").length;
  const pendingProposals = (proposalsAll.data || []).filter((p) => p.status === "pending");
  const implementedToday = (proposalsAll.data || []).filter((p) => p.status === "implemented").length;

  return {
    period: { hours, since, until: new Date().toISOString() },
    kpis: {
      orders: orders.data?.length || 0,
      revenue_eur: Math.round(revenueCents / 100),
      generations: gens.data?.length || 0,
      fal_cost_usd: Math.round(falCostUsd * 100) / 100,
      new_profiles: profiles.data?.length || 0,
      open_tickets: openTickets,
      pending_proposals: pendingProposals.length,
      implemented_today: implementedToday,
      ai_cost_usd: Math.round(Object.values(byTaskType).reduce((s, t) => s + t.cost_usd, 0) * 100) / 100,
    },
    by_category: byCategory,
    proposals: (proposalsAll.data || []).slice(0, 20).map((p) => ({
      id: p.id,
      title: p.title,
      summary: p.summary,
      risk: p.risk,
      impact: p.impact,
      status: p.status,
      agent: agentById.get(p.agent_id)?.name || "?",
      created_at: p.created_at,
    })),
    agents_by_task: byTaskType,
    agents_count: agents.data?.length || 0,
  };
}

export function formatReportForTelegram(report: Awaited<ReturnType<typeof buildDailyReport>>): string {
  const k = report.kpis;
  const lines: string[] = [];
  lines.push(`📊 3D Man Box — Tagesbericht (${report.period.hours}h)`);
  lines.push("");
  lines.push(`💶 Umsatz: ${k.revenue_eur}€ • Orders: ${k.orders}`);
  lines.push(`🎨 Generations: ${k.generations} • fal.ai: $${k.fal_cost_usd}`);
  lines.push(`👤 Neue Profile: ${k.new_profiles} • Tickets offen: ${k.open_tickets}`);
  lines.push(`🤖 KI-Kosten 24h: $${k.ai_cost_usd}`);
  lines.push(`📝 Pending: ${k.pending_proposals} • Implementiert: ${k.implemented_today}`);

  if (report.proposals.filter((p) => p.status === "pending").length > 0) {
    lines.push("");
    lines.push("Pending Proposals:");
    for (const p of report.proposals.filter((x) => x.status === "pending").slice(0, 5)) {
      lines.push(`• #${p.id} [${p.risk}] ${p.title} — ${p.agent}`);
    }
  }

  return lines.join("\n");
}
