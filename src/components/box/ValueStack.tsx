import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Check } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { formatEUR } from "@/lib/utils";

const stack = [
  { name: "1.000+ Premium 3D-Charaktere (Master-Pack)", value: 970, note: "0,97€ pro Charakter Wert" },
  { name: "6 Kategorie-Pakete (Business, Tech, Healthcare, Education, Lifestyle, Creative)", value: 162, note: "regulär 27€ pro Pack" },
  { name: "100 KI-Credits für eigene Charaktere", value: 29, note: "im Club regulär als Add-on" },
  { name: "Stil-Guide & Best-Practice-Mappe (PDF)", value: 49, note: "Verwendung in Decks, Webs & Ads" },
  { name: "10 fertige PowerPoint-Layouts mit 3D-Visuals", value: 97, note: "Pitch-Deck-ready" },
  { name: "Canva-Pack: 50 Templates mit eingebauten Charakteren", value: 79, note: "Social Media direkt einsatzbereit" },
  { name: "Lebenslange Nutzungsrechte für kommerzielle Projekte", value: 197, note: "auch für bezahlte Werbung" },
  { name: "Updates: monatlich neue Charaktere", value: 145, note: "12 Monate inklusive" },
];

const total = stack.reduce((s, x) => s + x.value, 0);

export function ValueStack() {
  return (
    <Section id="wert" background="white">
      <div className="container-base">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="gold">Was ist drin?</Badge>
          <h2 className="h-display mt-5 text-3xl text-navy-900 md:text-5xl">
            Acht Komponenten im Gesamtwert von {formatEUR(total)} — heute für 197€.
          </h2>
          <p className="mt-5 text-lg text-navy-700">
            Wir haben jedes einzelne Element so kalkuliert, wie wir es auch im freien Verkauf anbieten würden. Heute bekommst du alles in einem Paket — für weniger als 12% des Einzelpreises.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <ul className="space-y-3">
            {stack.map((it) => (
              <li
                key={it.name}
                className="flex items-start justify-between gap-6 rounded-xl border border-navy-100 bg-white p-5 shadow-soft md:items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-navy-900">{it.name}</div>
                    <div className="text-sm text-navy-500">{it.note}</div>
                  </div>
                </div>
                <div className="text-right font-display text-lg font-semibold text-navy-700">
                  {formatEUR(it.value)}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl bg-navy-gradient p-7 text-white md:p-10">
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm uppercase tracking-wider text-navy-200">Gesamtwert</div>
              <div className="font-display text-3xl text-navy-200 line-through md:text-4xl">
                {formatEUR(total)}
              </div>
              <div className="mt-2 text-sm uppercase tracking-wider text-gold-300">Heute nur</div>
              <div className="font-display text-5xl font-bold text-gold-shine bg-gold-shine bg-clip-text text-transparent md:text-6xl">
                197€
              </div>
              <div className="text-sm text-navy-200">einmalig — keine Folgekosten, kein Abo</div>
            </div>

            <div className="mt-7 flex justify-center">
              <ButtonLink href="#angebot" variant="gold" size="xl">
                Box jetzt sichern — 197€
              </ButtonLink>
            </div>
            <p className="mt-4 text-center text-xs text-navy-300">
              ⚡ Sofort-Download · 60-Tage-Garantie · Bezahlung per Karte, SEPA, PayPal
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
