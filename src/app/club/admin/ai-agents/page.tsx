// Schwarzes Brett — KI-Firma Übersicht.
// Server-Komponente, nutzt Service-Role-Client direkt.
import { sb } from "@/lib/ai-firma/db";
import { buildDailyReport } from "@/lib/ai-firma/report";

export const dynamic = "force-dynamic";

export default async function AdminAiAgentsPage() {
  const report = await buildDailyReport(24);
  const client = sb();
  const [{ data: agents }, { data: pendingProps }, { data: recentActs }, { data: tickets }, { data: falEvents }] = await Promise.all([
    client.from("ai_agents").select("*").order("id"),
    client.from("ai_proposals").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(20),
    client.from("ai_activities").select("agent_id, task_type, summary, cost_usd, tokens_in, tokens_out, status, created_at")
      .order("created_at", { ascending: false }).limit(20),
    client.from("support_tickets").select("*").eq("status", "open").order("last_message_at", { ascending: false }).limit(10),
    client.from("fal_cost_events").select("cost_usd, model, created_at")
      .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString()).order("created_at", { ascending: false }).limit(50),
  ]);

  const agentById = new Map((agents || []).map((a) => [a.id, a]));
  const falTotal7d = (falEvents || []).reduce((s, e) => s + Number(e.cost_usd || 0), 0);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-wider text-amber-300">3dman.club / admin</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">🤖 KI-Firma — Schwarzes Brett</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {agents?.length || 0} Agenten aktiv • Stand {new Date().toLocaleString("de-DE")}
          </p>
        </header>

        <section className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Kpi label="Umsatz 24h" value={`${report.kpis.revenue_eur} €`} sub={`${report.kpis.orders} Orders`} />
          <Kpi label="Generations 24h" value={String(report.kpis.generations)} sub={`fal.ai $${report.kpis.fal_cost_usd}`} />
          <Kpi label="Pending Proposals" value={String(report.kpis.pending_proposals)} sub={`${report.kpis.implemented_today} umgesetzt`} />
          <Kpi label="Support offen" value={String(report.kpis.open_tickets)} sub={`KI-Kosten $${report.kpis.ai_cost_usd}`} />
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Pending Proposals</h2>
            {(!pendingProps || pendingProps.length === 0) && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">Aktuell keine offenen Vorschläge.</div>
            )}
            <ul className="space-y-3">
              {(pendingProps || []).map((p) => (
                <li key={p.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">#{p.id} · {p.title}</div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {agentById.get(p.agent_id)?.name || "?"} · {p.category} · risk={p.risk}
                      </div>
                      <p className="mt-2 text-sm text-zinc-300">{p.summary}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase ${riskColor(p.risk)}`}>{p.risk}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Letzte Aktivitäten</h2>
            <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900">
              {(recentActs || []).slice(0, 12).map((a, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <div className="truncate">{agentById.get(a.agent_id)?.name || "?"} · {a.task_type}</div>
                    <div className="text-xs text-zinc-500">{new Date(a.created_at).toLocaleString("de-DE")}</div>
                  </div>
                  <div className="ml-3 shrink-0 text-right text-xs text-zinc-400">
                    ${Number(a.cost_usd || 0).toFixed(3)}<br/>
                    <span className="text-[10px]">{a.tokens_in}/{a.tokens_out}</span>
                  </div>
                </li>
              ))}
              {(!recentActs || recentActs.length === 0) && <li className="px-4 py-6 text-center text-sm text-zinc-500">Noch keine Aktivitäten.</li>}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">fal.ai Kosten (7 Tage)</h2>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-2xl font-semibold">${falTotal7d.toFixed(2)}</div>
              <p className="text-xs text-zinc-400">{falEvents?.length || 0} Events</p>
              {falEvents && falEvents.length > 0 && (
                <ul className="mt-3 divide-y divide-zinc-800 text-xs">
                  {falEvents.slice(0, 8).map((e, i) => (
                    <li key={i} className="flex justify-between py-1">
                      <span className="text-zinc-400">{e.model} · {new Date(e.created_at).toLocaleString("de-DE")}</span>
                      <span>${Number(e.cost_usd).toFixed(3)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Offene Support-Tickets</h2>
            <ul className="space-y-2">
              {(tickets || []).map((t) => (
                <li key={t.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">#{t.id} · {t.subject || "(ohne Betreff)"}</div>
                    <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] uppercase text-amber-300">{t.priority}</span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">{t.email || "anonym"} · {new Date(t.last_message_at).toLocaleString("de-DE")}</div>
                </li>
              ))}
              {(!tickets || tickets.length === 0) && <li className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-500">Keine offenen Tickets.</li>}
            </ul>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Agenten ({agents?.length || 0})</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(agents || []).map((a) => (
              <div key={a.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{a.name}</div>
                  {a.is_avatar && <span className="rounded bg-blue-400/20 px-2 py-0.5 text-[10px] uppercase text-blue-300">Avatar</span>}
                </div>
                <div className="mt-1 text-xs text-zinc-400">{a.role}</div>
                {a.persona && <div className="mt-1 text-xs text-zinc-500">{a.persona}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-1 text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}

function riskColor(risk: string): string {
  switch (risk) {
    case "low":      return "bg-green-400/20 text-green-300";
    case "medium":   return "bg-amber-400/20 text-amber-300";
    case "high":     return "bg-orange-400/20 text-orange-300";
    case "critical": return "bg-red-400/20 text-red-300";
    default:         return "bg-zinc-700 text-zinc-300";
  }
}
