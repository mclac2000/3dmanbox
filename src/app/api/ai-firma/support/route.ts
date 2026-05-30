// Support-Chat-Endpoint. POST = neue Nachricht (legt Ticket bei Bedarf an), GET = Ticket-History.
import { NextRequest, NextResponse } from "next/server";
import { sb } from "@/lib/ai-firma/db";
import { runAgent } from "@/lib/ai-firma/agent-service";
import { send } from "@/lib/ai-firma/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PostBody {
  ticket_id?: number;
  email?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  let body: PostBody;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Body ungültig" }, { status: 400 }); }
  if (!body.message || body.message.length > 2000) return NextResponse.json({ ok: false, error: "Nachricht fehlt oder zu lang" }, { status: 400 });

  const client = sb();
  let ticketId = body.ticket_id;
  let isNew = false;

  if (!ticketId) {
    const subject = body.message.slice(0, 80);
    const { data: t, error } = await client.from("support_tickets").insert({
      email: body.email?.toLowerCase() || null,
      subject,
      status: "open",
      source: "chat",
    }).select("id").single();
    if (error || !t) return NextResponse.json({ ok: false, error: error?.message }, { status: 500 });
    ticketId = t.id as number;
    isNew = true;
  }

  // Nutzer-Nachricht speichern
  await client.from("support_messages").insert({
    ticket_id: ticketId, sender: "user", body: body.message,
  });
  await client.from("support_tickets").update({
    last_message_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", ticketId);

  // History laden (für Kontext)
  const { data: history } = await client.from("support_messages")
    .select("sender, body").eq("ticket_id", ticketId).order("created_at").limit(20);

  // Tim antwortet
  const dialog = (history || []).map((m) => `${m.sender === "user" ? "Kunde" : "Tim"}: ${m.body}`).join("\n");
  let reply = "Danke für deine Nachricht — Marco meldet sich bald persönlich.";
  let agentId: number | null = null;
  try {
    const { data: timAgent } = await client.from("ai_agents").select("*").eq("slug", "support").maybeSingle();
    if (timAgent) {
      agentId = timAgent.id as number;
      const r = await runAgent({
        agent: timAgent,
        task: `Antworte als Tim auf die letzte Kunden-Nachricht. Du-Form, knapp (max 4 Sätze), freundlich, hilfsbereit. Verwende korrekte deutsche Umlaute (ä, ö, ü, ß) — niemals ae/oe/ue/ss als Ersatz. Wenn du nicht weiterhilfst, kündige an dass du Marco informierst.\n\nDialog:\n${dialog}`,
        taskType: "support_reply",
        tools: [],
        maxRounds: 1,
      });
      if (r.text) reply = r.text.slice(0, 1500);
    }
  } catch (e) {
    console.error("support agent failed", e);
  }

  await client.from("support_messages").insert({
    ticket_id: ticketId, sender: "agent", agent_id: agentId, body: reply,
  });

  // Erste Nachricht → sofortige Telegram-Eskalation an Marco
  if (isNew) {
    await send(
      `🆘 Neues Support-Ticket #${ticketId}${body.email ? ` (${body.email})` : ""}\n\nKunde: ${body.message.slice(0, 400)}\n\nTim: ${reply.slice(0, 300)}`,
    );
  }

  return NextResponse.json({ ok: true, ticket_id: ticketId, reply });
}

export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("ticket_id"));
  if (!id) return NextResponse.json({ ok: false, error: "ticket_id fehlt" }, { status: 400 });
  const { data } = await sb().from("support_messages")
    .select("sender, body, created_at").eq("ticket_id", id).order("created_at");
  return NextResponse.json({ ok: true, messages: data || [] });
}
