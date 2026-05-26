"use client";

import { useEffect, useState } from "react";

export function StickyBuy({
  sku,
  label,
  altLabel,
  price,
}: {
  sku: string;
  label: string;
  altLabel: string;
  price: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="wrap flex flex-col items-stretch justify-between gap-3 py-3 sm:flex-row sm:items-center">
          <div className="text-sm">
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              {altLabel}
            </p>
            <p className="font-display text-base font-semibold text-zinc-950">{label}</p>
          </div>
          <a
            href={`/api/stripe/checkout?sku=${sku}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            {price}€
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
