"use client";

import { useState } from "react";

type T = {
  amounts: string[];
  custom: string;
  cta: string;
  thanks: string;
};

export function DonateForm({ t, initial }: { t: T; initial?: string }) {
  const [amount, setAmount] = useState<string>(initial ?? t.amounts[1] ?? "9");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const n = Number(amount);
    if (!n || n < 1) {
      setErr("min 1€");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: n }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErr(data.error || "error");
        setLoading(false);
      }
    } catch {
      setErr("network error");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8">
      <div className="flex flex-wrap gap-2">
        {t.amounts.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAmount(a)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              amount === a
                ? "bg-zinc-950 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
            }`}
          >
            {a}€
          </button>
        ))}
      </div>
      <label className="mt-5 block">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{t.custom}</span>
        <input
          type="number"
          step="1"
          min="1"
          max="10000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-2 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-400"
        />
      </label>
      <button
        type="submit"
        disabled={loading || !amount}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:bg-zinc-300"
      >
        {loading ? "…" : t.cta.replace("{amount}", amount)}
      </button>
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
    </form>
  );
}
