// Agent-Service: führt einen Agent mit System-Prompt + Tools aus, loggt Activity.
import { runWithTools, calcCost } from "./llm";
import { logActivity, getAgentBySlug } from "./db";
import { pickTools, TOOL_NAMES } from "./tools";
import type { AgentRow, LLMMessage } from "./types";

const DEFAULT_TOOLS_PER_ROLE: Record<string, string[]> = {
  ceo:             ["get_kpis", "list_pending_proposals", "create_proposal"],
  cto:             ["get_kpis", "http_check", "create_proposal"],
  cmo:             ["get_kpis", "list_top_categories", "list_recent_generations", "create_proposal"],
  cro:             ["get_kpis", "list_top_categories", "create_proposal"],
  support:         ["list_open_tickets"],
  analyst:         ["get_kpis", "list_top_categories", "list_recent_generations", "fal_cost_window", "create_proposal"],
  qa:              ["http_check", "create_proposal"],
  causality:       ["get_kpis", "list_top_categories", "create_proposal"],
  guardian:        ["http_check", "get_kpis", "fal_cost_window", "create_proposal"],
  lora_master:     ["fal_cost_window", "list_recent_generations", "create_proposal"],
  gallery_curator: ["list_top_categories", "list_recent_generations", "create_proposal"],
  template_ki:     ["list_recent_generations", "list_top_categories", "create_proposal"],
  avatar_designer: ["create_proposal"],
  avatar_buyer:    ["create_proposal"],
  avatar_platform: ["create_proposal"],
};

export interface RunAgentInput {
  agent: AgentRow | string; // slug oder Row
  task: string;
  taskType?: string;
  context?: Record<string, unknown>;
  tools?: string[];
  maxRounds?: number;
}

export async function runAgent(input: RunAgentInput) {
  const agent = typeof input.agent === "string"
    ? await getAgentBySlug(input.agent)
    : input.agent;
  if (!agent) throw new Error(`Agent ${String(input.agent)} nicht gefunden`);

  const start = Date.now();
  const toolNames = input.tools || DEFAULT_TOOLS_PER_ROLE[agent.slug] || [];
  const validTools = toolNames.filter((n) => TOOL_NAMES.includes(n));
  const tools = pickTools(validTools);

  const messages: LLMMessage[] = [{
    role: "user",
    content: input.context
      ? `${input.task}\n\nKontext:\n${JSON.stringify(input.context, null, 2)}`
      : input.task,
  }];

  let result;
  let errorMsg: string | undefined;
  try {
    result = await runWithTools({
      model: agent.model || "claude-sonnet-4-6",
      system: agent.system_prompt + "\n\nNutze Tools, wenn du Daten brauchst. Sei knapp und entscheidungsreif. Antworte auf Deutsch.\n\nWICHTIG: Verwende IMMER korrekte deutsche Rechtschreibung mit echten Umlauten (ä, ö, ü) und ß. Schreibe NIEMALS ae statt ä, oe statt ö, ue statt ü oder ss statt ß.",
      messages,
      tools,
      maxRounds: input.maxRounds ?? 4,
      maxTokens: 1500,
    });
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : String(e);
    result = { text: "", toolCalls: [], stopReason: "error", usage: { input_tokens: 0, output_tokens: 0 }, rounds: 0, toolLog: [] };
  }

  const cost = calcCost(agent.model || "claude-sonnet-4-6", result.usage.input_tokens, result.usage.output_tokens);
  await logActivity({
    agent_id: agent.id,
    task_type: input.taskType || "general",
    summary: input.task.slice(0, 200),
    input: { task: input.task, context: input.context, tools: validTools },
    output: { text: result.text, toolLog: result.toolLog, rounds: result.rounds },
    tokens_in: result.usage.input_tokens,
    tokens_out: result.usage.output_tokens,
    cost_usd: cost,
    duration_ms: Date.now() - start,
    status: errorMsg ? "failed" : "completed",
    error: errorMsg,
  });

  return { ...result, cost, agent };
}
