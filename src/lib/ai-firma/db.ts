// Server-Client Wrapper für KI-Firma-Tabellen.
import { serverClient } from "@/lib/supabase";
import type { AgentRow, ProposalRow } from "./types";

export function sb() {
  const client = serverClient();
  if (!client) throw new Error("Supabase Service-Client nicht initialisiert");
  return client;
}

export async function getAgentBySlug(slug: string): Promise<AgentRow | null> {
  const { data, error } = await sb().from("ai_agents").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as AgentRow) || null;
}

export async function listAgents(opts: { enabled?: boolean; avatar?: boolean } = {}): Promise<AgentRow[]> {
  let q = sb().from("ai_agents").select("*").order("id");
  if (opts.enabled !== undefined) q = q.eq("enabled", opts.enabled);
  if (opts.avatar !== undefined) q = q.eq("is_avatar", opts.avatar);
  const { data, error } = await q;
  if (error) throw error;
  return (data as AgentRow[]) || [];
}

export async function logActivity(p: {
  agent_id: number;
  task_type: string;
  summary?: string;
  input?: unknown;
  output?: unknown;
  tokens_in?: number;
  tokens_out?: number;
  cost_usd?: number;
  duration_ms?: number;
  status?: string;
  error?: string;
}): Promise<number> {
  const { data, error } = await sb().from("ai_activities").insert({
    agent_id: p.agent_id,
    task_type: p.task_type,
    summary: p.summary,
    input: p.input as object,
    output: p.output as object,
    tokens_in: p.tokens_in ?? 0,
    tokens_out: p.tokens_out ?? 0,
    cost_usd: p.cost_usd ?? 0,
    duration_ms: p.duration_ms,
    status: p.status ?? "completed",
    error: p.error,
  }).select("id").single();
  if (error) throw error;
  return data!.id as number;
}

export async function createProposal(p: {
  agent_id: number;
  title: string;
  summary: string;
  details?: string;
  category?: string;
  risk?: ProposalRow["risk"];
  impact?: ProposalRow["impact"];
  effort?: ProposalRow["effort"];
  meta?: Record<string, unknown>;
}): Promise<ProposalRow> {
  const { data, error } = await sb().from("ai_proposals").insert({
    agent_id: p.agent_id,
    title: p.title,
    summary: p.summary,
    details: p.details,
    category: p.category ?? "general",
    risk: p.risk ?? "low",
    impact: p.impact ?? "medium",
    effort: p.effort ?? "medium",
    meta: p.meta ?? {},
  }).select("*").single();
  if (error) throw error;
  return data as ProposalRow;
}

export async function getConfig(key: string): Promise<unknown> {
  const { data } = await sb().from("ai_config").select("value").eq("key", key).maybeSingle();
  return data?.value ?? null;
}

export async function setConfig(key: string, value: unknown): Promise<void> {
  await sb().from("ai_config").upsert({ key, value, updated_at: new Date().toISOString() });
}
