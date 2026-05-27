// Telegram-Service: Mars-Bot direkt an Marco (Chat-ID 382863507).

const TOKEN = process.env.TELEGRAM_MARS_TOKEN || "";
const CEO_CHAT_ID = process.env.TELEGRAM_CEO_CHAT_ID || "382863507";
const DEV_CHAT_ID = process.env.TELEGRAM_DEV_CHAT_ID || "";

export type TgInlineButton = { text: string; url?: string; callback_data?: string };

export async function send(
  text: string,
  opts: {
    chat?: "ceo" | "dev" | string;
    buttons?: TgInlineButton[][];
    parseMode?: "HTML" | "Markdown" | "MarkdownV2";
    disablePreview?: boolean;
  } = {},
): Promise<{ ok: boolean; message_id?: number; error?: string }> {
  if (!TOKEN) return { ok: false, error: "TELEGRAM_MARS_TOKEN nicht gesetzt" };

  const chatId = opts.chat === "dev" ? DEV_CHAT_ID
    : opts.chat && opts.chat !== "ceo" ? opts.chat
    : CEO_CHAT_ID;
  if (!chatId) return { ok: false, error: "Keine chat_id für Telegram konfiguriert" };

  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    disable_web_page_preview: opts.disablePreview ?? true,
  };
  if (opts.parseMode) body.parse_mode = opts.parseMode;
  if (opts.buttons) {
    body.reply_markup = { inline_keyboard: opts.buttons };
  }

  try {
    const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = (await r.json()) as { ok: boolean; result?: { message_id: number }; description?: string };
    if (!j.ok) return { ok: false, error: j.description || "Telegram-Fehler" };
    return { ok: true, message_id: j.result?.message_id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function notifyProposal(p: {
  id: number;
  title: string;
  summary: string;
  risk: string;
  agentName: string;
}, baseUrl: string) {
  const { buildDecideUrl } = await import("./hmac");
  const approveUrl = buildDecideUrl(baseUrl, p.id, "approve");
  const rejectUrl = buildDecideUrl(baseUrl, p.id, "reject");
  const text =
    `📌 *Neuer Vorschlag #${p.id}* — ${p.agentName}\n` +
    `*${escapeMd(p.title)}*\n\n` +
    `${escapeMd(p.summary)}\n\n` +
    `Risiko: ${p.risk}`;
  return send(text, {
    parseMode: "MarkdownV2",
    buttons: [[
      { text: "✅ Approve", url: approveUrl },
      { text: "❌ Reject", url: rejectUrl },
    ]],
  });
}

export async function notifyImplementationResult(p: {
  id: number;
  title: string;
  ok: boolean;
  log: string;
}) {
  const head = p.ok ? "✅ Umgesetzt" : "⚠️ Fehlgeschlagen";
  const text = `${head} #${p.id} — ${p.title}\n\n${p.log.slice(0, 800)}`;
  return send(text);
}

function escapeMd(s: string): string {
  return s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, (m) => `\\${m}`);
}
