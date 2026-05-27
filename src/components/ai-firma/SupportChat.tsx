"use client";

import { useEffect, useRef, useState } from "react";

interface Msg { sender: "user" | "agent"; body: string; created_at?: string }

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("3dm_ticket");
    if (t) setTicketId(Number(t));
    const e = localStorage.getItem("3dm_email");
    if (e) setEmail(e);
  }, []);

  useEffect(() => {
    if (!open || !ticketId) return;
    fetch(`/api/ai-firma/support?ticket_id=${ticketId}`)
      .then((r) => r.json())
      .then((j) => { if (j.ok) setMessages(j.messages); });
  }, [open, ticketId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    const userMsg: Msg = { sender: "user", body: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      const r = await fetch("/api/ai-firma/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, email: email || undefined, message: text }),
      });
      const j = await r.json();
      if (j.ok) {
        if (!ticketId && j.ticket_id) {
          setTicketId(j.ticket_id);
          localStorage.setItem("3dm_ticket", String(j.ticket_id));
          if (email) localStorage.setItem("3dm_email", email);
        }
        setMessages((m) => [...m, { sender: "agent", body: j.reply }]);
      } else {
        setMessages((m) => [...m, { sender: "agent", body: "⚠️ Etwas ist schiefgelaufen — bitte später nochmal." }]);
      }
    } catch {
      setMessages((m) => [...m, { sender: "agent", body: "⚠️ Verbindungsfehler — bitte später nochmal." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Support-Chat öffnen"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-zinc-950 shadow-xl transition hover:scale-105 hover:bg-amber-300"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[560px] max-h-[80vh] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Tim vom Support</div>
              <div className="text-xs text-zinc-400">Antwortet meist in &lt; 1 Min.</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Schließen" className="text-zinc-400 hover:text-white">✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="rounded-lg bg-zinc-900 p-3 text-sm text-zinc-300">
                Hey, ich bin Tim. Was kann ich für dich tun?
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.sender === "user" ? "bg-amber-400 text-zinc-950" : "bg-zinc-900 text-zinc-100"}`}>
                  {m.body}
                </div>
              </div>
            ))}
            {sending && (
              <div className="text-xs text-zinc-500">Tim tippt …</div>
            )}
          </div>

          {!ticketId && (
            <div className="border-t border-zinc-800 px-4 pt-2">
              <input
                type="email"
                placeholder="Deine E-Mail (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500"
              />
            </div>
          )}

          <div className="flex gap-2 border-t border-zinc-800 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Nachricht …"
              disabled={sending}
              className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              className="rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-50"
            >
              Senden
            </button>
          </div>
        </div>
      )}
    </>
  );
}
