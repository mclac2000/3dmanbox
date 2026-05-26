"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type T = {
  promptLabel: string;
  promptPlaceholder: string;
  generate: string;
  generating: string;
  result: string;
  downloadNeedsClub: string;
  joinClub: string;
  tryAgain: string;
  limitReached: string;
  error: string;
};

export function TryForm({ t }: { t: T }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [limit, setLimit] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/try", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setLimit(true);
        return;
      }
      if (!res.ok) {
        setErr(t.error);
        return;
      }
      setImg(data.image);
    } catch {
      setErr(t.error);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setImg(null);
    setPrompt("");
    setErr(null);
  }

  if (limit) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
        <p className="font-display text-xl text-zinc-950">{t.limitReached}</p>
        <a
          href="https://3dman.club/pricing"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          {t.joinClub}
        </a>
      </div>
    );
  }

  if (img) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{t.result}</p>
        <div className="relative mt-3 aspect-square overflow-hidden rounded-xl bg-zinc-50">
          <Image src={img} alt="generated" fill sizes="600px" className="object-contain" unoptimized />
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-zinc-950/0">
            <div className="rounded-md bg-white/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-700 backdrop-blur">
              3dmanbox.com · preview
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-zinc-600">{t.downloadNeedsClub}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://3dman.club/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            {t.joinClub}
          </a>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{t.promptLabel}</span>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.promptPlaceholder}
          rows={4}
          maxLength={400}
          className="mt-2 block w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-400"
        />
      </label>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[10px] text-zinc-400">{prompt.length}/400</span>
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:bg-zinc-300"
        >
          {loading ? (
            <>
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-300" />
              {t.generating}
            </>
          ) : (
            <>
              {t.generate}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </>
          )}
        </button>
      </div>
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
    </form>
  );
}
