export type AgentSlug =
  | "ceo" | "cto" | "cmo" | "cro" | "support" | "analyst" | "qa"
  | "causality" | "guardian" | "lora_master" | "gallery_curator" | "template_ki"
  | "avatar_designer" | "avatar_buyer" | "avatar_platform";

export interface AgentRow {
  id: number;
  slug: AgentSlug | string;
  name: string;
  role: string;
  persona: string | null;
  system_prompt: string;
  model: string;
  enabled: boolean;
  is_avatar: boolean;
  config: Record<string, unknown>;
}

export interface ProposalRow {
  id: number;
  agent_id: number;
  title: string;
  summary: string;
  details: string | null;
  category: string;
  risk: "low" | "medium" | "high" | "critical";
  impact: "low" | "medium" | "high";
  effort: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected" | "implemented" | "failed";
  meta: Record<string, unknown>;
  created_at: string;
}

export interface ToolDef {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface LLMMessage {
  role: "user" | "assistant";
  content: string | Array<Record<string, unknown>>;
}

export interface LLMResult {
  text: string;
  toolCalls: Array<{ name: string; args: Record<string, unknown>; id: string }>;
  stopReason: string;
  usage: { input_tokens: number; output_tokens: number };
}
