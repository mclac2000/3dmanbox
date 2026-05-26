"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Shield, Lock } from "@/components/ui/Icon";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function getDeadline() {
  // Always 3 days from now (rolling) — switch to fixed launch date later
  const d = new Date();
  d.setHours(23, 59, 0, 0);
  d.setDate(d.getDate() + 3);
  return d;
}

export function ScarcityCTA() {
  const [remaining, setRemaining] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => {
      const diff = Math.max(0, deadline.getTime() - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setRemaining({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Section id="angebot" background="navy" className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-400/30 blur-3xl" />
      </div>

      <div className="container-base relative">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="gold" className="bg-gold-shine text-navy-900">
            ⏰ Launch-Angebot endet bald
          </Badge>
          <h2 className="h-display mt-5 text-3xl text-white md:text-5xl">
            Heute 197€. Ab nächste Woche 297€. Danach 397€.
          </h2>
          <p className="mt-5 text-lg text-navy-100">
            Wir limitieren den Launch auf <strong className="text-gold-300">500 Plätze</strong> zum Sonderpreis. Sobald die 500 weg sind, steigt der Preis auf den regulären Tarif. Es gibt keinen Tarifrabatt-Reset und keine Wiederöffnung.
          </p>

          {/* Plätze-Zähler */}
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between text-sm text-navy-100">
              <span>Plätze vergeben</span>
              <span className="font-semibold text-white">347 / 500</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gold-shine animate-pulse-soft"
                style={{ width: "69.4%" }}
              />
            </div>
            <div className="mt-2 text-xs text-navy-300">
              Noch <strong className="text-gold-300">153 Plätze</strong> zum Launch-Preis
            </div>
          </div>

          {/* Countdown */}
          <div className="mx-auto mt-8 grid max-w-md grid-cols-4 gap-3">
            {[
              { val: remaining.d, label: "Tage" },
              { val: remaining.h, label: "Std" },
              { val: remaining.m, label: "Min" },
              { val: remaining.s, label: "Sek" },
            ].map((u) => (
              <div
                key={u.label}
                className="rounded-xl bg-white/10 p-4 backdrop-blur"
              >
                <div className="font-display text-3xl font-bold text-white md:text-4xl">
                  {pad(u.val)}
                </div>
                <div className="text-xs uppercase tracking-wider text-navy-200">
                  {u.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <ButtonLink href="/api/stripe/checkout?sku=MASTER_BOX" variant="gold" size="xl">
              Box jetzt sichern — 197€
            </ButtonLink>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-navy-200">
            <span className="inline-flex items-center gap-1.5">
              <Shield size={16} className="text-gold-300" /> 60-Tage-Garantie
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock size={16} className="text-gold-300" /> Sichere Zahlung via Stripe
            </span>
            <span className="inline-flex items-center gap-1.5">
              ⚡ Sofort-Download
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
