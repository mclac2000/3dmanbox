// Tool-Registry für Agenten. Alle Tools lesen aus Supabase oder verifizieren via HTTP.
import { sb } from "./db";
import type { ToolDef } from "./types";

export const TOOLS: ToolDef[] = [
  {
    name: "get_kpis",
    description: "Liefert wichtige Plattform-KPIs der letzten N Stunden: Orders, Umsatz, Generations, fal.ai-Kosten, neue Profile, offene Support-Tickets.",
    input_schema: {
      type: "object",
      properties: { hours: { type: "number", description: "Zeitfenster in Stunden, Default 24" } },
    },
    handler: async (args) => {
      const hours = Math.min(Math.max(Number(args.hours) || 24, 1), 24 * 30);
      const since = new Date(Date.now() - hours * 3600_000).toISOString();
      const client = sb();
      const [orders, gens, fal, profiles, tickets] = await Promise.all([
        client.from("orders").select("amount_total, sku", { count: "exact" }).gte("created_at", since),
        client.from("generations").select("id, status, credits_spent", { count: "exact" }).gte("created_at", since),
        client.from("fal_cost_events").select("cost_usd").gte("created_at", since),
        client.from("profiles").select("id", { count: "exact" }).gte("created_at", since),
        client.from("support_tickets").select("id, status", { count: "exact" }).eq("status", "open"),
      ]);
      const revenueCents = (orders.data || []).reduce((s, o) => s + (o.amount_total || 0), 0);
      const falCostUsd = (fal.data || []).reduce((s, e) => s + Number(e.cost_usd || 0), 0);
      return {
        hours,
        orders: orders.count ?? 0,
        revenue_eur: Math.round(revenueCents / 100),
        generations: gens.count ?? 0,
        fal_cost_usd: Math.round(falCostUsd * 100) / 100,
        new_profiles: profiles.count ?? 0,
        open_tickets: tickets.count ?? 0,
      };
    },
  },
  {
    name: "list_recent_generations",
    description: "Letzte N Generations mit Prompt, Status und Credit-Verbrauch.",
    input_schema: {
      type: "object",
      properties: { limit: { type: "number", description: "Max 50, Default 10" } },
    },
    handler: async (args) => {
      const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 50);
      const { data } = await sb().from("generations")
        .select("id, prompt, category, status, credits_spent, created_at")
        .order("created_at", { ascending: false }).limit(limit);
      return data || [];
    },
  },
  {
    name: "list_pending_proposals",
    description: "Listet alle Proposals mit Status 'pending'.",
    input_schema: { type: "object", properties: {} },
    handler: async () => {
      const { data } = await sb().from("ai_proposals")
        .select("id, title, summary, risk, impact, agent_id, created_at")
        .eq("status", "pending").order("created_at", { ascending: false });
      return data || [];
    },
  },
  {
    name: "list_open_tickets",
    description: "Offene Support-Tickets mit letzter Nachricht.",
    input_schema: {
      type: "object",
      properties: { limit: { type: "number" } },
    },
    handler: async (args) => {
      const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 50);
      const { data } = await sb().from("support_tickets")
        .select("id, email, subject, status, priority, last_message_at, created_at")
        .eq("status", "open").order("last_message_at", { ascending: false }).limit(limit);
      return data || [];
    },
  },
  {
    name: "fal_cost_window",
    description: "Summe der fal.ai-Kosten in USD über ein Zeitfenster (Stunden, Default 24).",
    input_schema: {
      type: "object",
      properties: { hours: { type: "number" } },
    },
    handler: async (args) => {
      const hours = Math.min(Math.max(Number(args.hours) || 24, 1), 24 * 90);
      const since = new Date(Date.now() - hours * 3600_000).toISOString();
      const { data } = await sb().from("fal_cost_events").select("cost_usd, model").gte("created_at", since);
      const total = (data || []).reduce((s, e) => s + Number(e.cost_usd || 0), 0);
      const byModel = (data || []).reduce<Record<string, number>>((acc, e) => {
        acc[e.model] = (acc[e.model] || 0) + Number(e.cost_usd || 0);
        return acc;
      }, {});
      return { hours, total_usd: Math.round(total * 100) / 100, by_model: byModel, events: data?.length || 0 };
    },
  },
  {
    name: "http_check",
    description: "Prüft ob eine URL einen 2xx-Statuscode liefert und (optional) einen Schlüsselbegriff im Body enthält.",
    input_schema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Vollständige URL (https://…)" },
        contains: { type: "string", description: "Begriff, der im HTML-Body vorkommen muss" },
      },
      required: ["url"],
    },
    handler: async (args) => {
      const url = String(args.url || "");
      const contains = args.contains ? String(args.contains) : null;
      try {
        const r = await fetch(url, { method: "GET", signal: AbortSignal.timeout(10000) });
        const body = await r.text();
        return {
          ok: r.ok,
          status: r.status,
          contains_found: contains ? body.includes(contains) : null,
          length: body.length,
        };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
  },
  {
    name: "create_proposal",
    description: "Legt einen neuen Proposal für Marco an. Wird sofort per Telegram geschickt (mit Approve/Reject-Buttons).",
    input_schema: {
      type: "object",
      properties: {
        agent_slug: { type: "string", description: "Slug des Absender-Agenten (z.B. 'cmo', 'cro')." },
        title: { type: "string" },
        summary: { type: "string", description: "1-2 Sätze, klar und entscheidungsreif." },
        details: { type: "string", description: "Optional ausführlich." },
        category: { type: "string", description: "z.B. marketing, tech, pricing, ux, ops" },
        risk: { type: "string", description: "low | medium | high | critical" },
        impact: { type: "string", description: "low | medium | high" },
        effort: { type: "string", description: "low | medium | high" },
      },
      required: ["agent_slug", "title", "summary"],
    },
    handler: async (args) => {
      const { getAgentBySlug, createProposal } = await import("./db");
      const { notifyProposal } = await import("./telegram");
      const agent = await getAgentBySlug(String(args.agent_slug));
      if (!agent) return { ok: false, error: `Agent ${args.agent_slug} nicht gefunden` };
      const p = await createProposal({
        agent_id: agent.id,
        title: String(args.title),
        summary: String(args.summary),
        details: args.details ? String(args.details) : undefined,
        category: args.category ? String(args.category) : "general",
        risk: (args.risk as "low" | "medium" | "high" | "critical") || "low",
        impact: (args.impact as "low" | "medium" | "high") || "medium",
        effort: (args.effort as "low" | "medium" | "high") || "medium",
      });
      const base = process.env.APP_URL_CLUB || process.env.APP_URL_BOX || "https://3dman.club";
      await notifyProposal({ id: p.id, title: p.title, summary: p.summary, risk: p.risk, agentName: agent.name }, base);
      return { ok: true, proposal_id: p.id };
    },
  },
  {
    name: "list_top_categories",
    description: "Top-Kategorien nach Generations-Volumen in Zeitfenster.",
    input_schema: {
      type: "object",
      properties: { hours: { type: "number" } },
    },
    handler: async (args) => {
      const hours = Math.min(Math.max(Number(args.hours) || 168, 1), 24 * 90);
      const since = new Date(Date.now() - hours * 3600_000).toISOString();
      const { data } = await sb().from("generations").select("category").gte("created_at", since);
      const counts = (data || []).reduce<Record<string, number>>((acc, r) => {
        const k = r.category || "uncategorized";
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    },
  },
];

export const TOOL_NAMES = TOOLS.map((t) => t.name);

export function pickTools(names: string[]): ToolDef[] {
  return TOOLS.filter((t) => names.includes(t.name));
}
