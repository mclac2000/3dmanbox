// Schlanker Anthropic-Client via fetch — kein SDK nötig.
// Unterstützt Tool-Use Loop.

import type { LLMMessage, LLMResult, ToolDef } from "./types";

const API_KEY = process.env.ANTHROPIC_API_KEY || "";
const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";

const PRICING: Record<string, { in: number; out: number }> = {
  "claude-opus-4-7": { in: 15, out: 75 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-haiku-4-5": { in: 0.8, out: 4 },
};

export interface CompletionOpts {
  model?: string;
  system: string;
  messages: LLMMessage[];
  tools?: ToolDef[];
  maxTokens?: number;
  temperature?: number;
}

export async function complete(opts: CompletionOpts): Promise<LLMResult> {
  if (!API_KEY) throw new Error("ANTHROPIC_API_KEY nicht gesetzt");

  const model = opts.model || "claude-sonnet-4-6";
  const body: Record<string, unknown> = {
    model,
    max_tokens: opts.maxTokens ?? 1024,
    system: opts.system,
    messages: opts.messages,
  };
  if (opts.temperature !== undefined) body.temperature = opts.temperature;
  if (opts.tools && opts.tools.length > 0) {
    body.tools = opts.tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema,
    }));
  }

  const r = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": API_VERSION,
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Anthropic-API ${r.status}: ${txt.slice(0, 500)}`);
  }
  const j = (await r.json()) as {
    content: Array<{ type: string; text?: string; name?: string; input?: Record<string, unknown>; id?: string }>;
    stop_reason: string;
    usage: { input_tokens: number; output_tokens: number };
  };

  let text = "";
  const toolCalls: LLMResult["toolCalls"] = [];
  for (const blk of j.content) {
    if (blk.type === "text" && blk.text) text += blk.text;
    if (blk.type === "tool_use" && blk.name && blk.id) {
      toolCalls.push({ name: blk.name, args: blk.input || {}, id: blk.id });
    }
  }

  return { text: text.trim(), toolCalls, stopReason: j.stop_reason, usage: j.usage };
}

export function calcCost(model: string, inTokens: number, outTokens: number): number {
  const p = PRICING[model] || PRICING["claude-sonnet-4-6"];
  return (inTokens * p.in + outTokens * p.out) / 1_000_000;
}

/** Tool-Use-Loop: bis zu maxRounds Iterationen. */
export async function runWithTools(opts: CompletionOpts & { maxRounds?: number }): Promise<LLMResult & { rounds: number; toolLog: Array<{ name: string; args: unknown; result: unknown }> }> {
  const maxRounds = opts.maxRounds ?? 4;
  const messages: LLMMessage[] = [...opts.messages];
  const toolMap = new Map((opts.tools || []).map((t) => [t.name, t]));
  const toolLog: Array<{ name: string; args: unknown; result: unknown }> = [];
  let totalIn = 0, totalOut = 0;
  let lastText = "";
  let lastStop = "end_turn";

  for (let round = 0; round < maxRounds; round++) {
    const res = await complete({ ...opts, messages });
    totalIn += res.usage.input_tokens;
    totalOut += res.usage.output_tokens;
    lastText = res.text;
    lastStop = res.stopReason;

    if (res.toolCalls.length === 0) {
      return { text: res.text, toolCalls: [], stopReason: res.stopReason, usage: { input_tokens: totalIn, output_tokens: totalOut }, rounds: round + 1, toolLog };
    }

    // Assistant-Turn mit tool_use Blöcken
    messages.push({
      role: "assistant",
      content: [
        ...(res.text ? [{ type: "text", text: res.text }] : []),
        ...res.toolCalls.map((tc) => ({ type: "tool_use", id: tc.id, name: tc.name, input: tc.args })),
      ],
    });

    // tool_result-Blöcke
    const toolResultBlocks: Array<Record<string, unknown>> = [];
    for (const tc of res.toolCalls) {
      const tool = toolMap.get(tc.name);
      let result: unknown;
      try {
        if (!tool) throw new Error(`Tool ${tc.name} nicht registriert`);
        result = await tool.handler(tc.args);
      } catch (e) {
        result = { error: e instanceof Error ? e.message : String(e) };
      }
      toolLog.push({ name: tc.name, args: tc.args, result });
      toolResultBlocks.push({
        type: "tool_result",
        tool_use_id: tc.id,
        content: typeof result === "string" ? result : JSON.stringify(result).slice(0, 4000),
      });
    }
    messages.push({ role: "user", content: toolResultBlocks });
  }
  return { text: lastText, toolCalls: [], stopReason: lastStop, usage: { input_tokens: totalIn, output_tokens: totalOut }, rounds: maxRounds, toolLog };
}
