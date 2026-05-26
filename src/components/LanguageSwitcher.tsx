"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_FLAGS, LOCALE_NAMES, type Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({ current }: { current: Locale }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function change(locale: Locale) {
    setOpen(false);
    if (locale === current) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={pending}
      >
        <span className="font-mono">{LOCALE_FLAGS[current]}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
          >
            {LOCALES.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  onClick={() => change(l)}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-sm transition hover:bg-zinc-50 ${
                    l === current ? "font-semibold text-zinc-900" : "text-zinc-700"
                  }`}
                  role="option"
                  aria-selected={l === current}
                >
                  <span>{LOCALE_NAMES[l]}</span>
                  <span className="font-mono text-xs text-zinc-400">{LOCALE_FLAGS[l]}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
