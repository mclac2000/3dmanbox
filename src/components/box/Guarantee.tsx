import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Shield, Clock } from "@/components/ui/Icon";

export function Guarantee() {
  return (
    <Section id="garantie" background="soft">
      <div className="container-base">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="gold">Doppelte Garantie</Badge>
          <h2 className="h-display mt-5 text-3xl text-navy-900 md:text-5xl">
            Das gesamte Risiko liegt bei uns.
          </h2>
          <p className="mt-5 text-lg text-navy-700">
            Wir glauben so sehr an die 3D Man Box, dass wir dir <strong>zwei Garantien</strong> geben. Du musst keine Sekunde überlegen, ob das für dich funktioniert — wenn nicht, bekommst du jeden Cent zurück.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-8 shadow-card">
            <div className="absolute -right-6 -top-6 grid h-28 w-28 rotate-12 place-items-center rounded-full bg-emerald-50">
              <Shield size={40} className="text-emerald-600" />
            </div>
            <Badge variant="success">Garantie 1</Badge>
            <h3 className="h-display mt-4 text-2xl text-navy-900 md:text-3xl">
              60 Tage Geld zurück
            </h3>
            <p className="mt-3 text-navy-700">
              Du hast volle 60 Tage Zeit, die Box auf Herz und Nieren zu testen. Wenn du in dieser Zeit aus <em>irgendeinem</em> Grund nicht zufrieden bist, schreibst du uns eine kurze Mail — und wir erstatten dir die kompletten 197€. Ohne Diskussion, ohne Fragen.
            </p>
            <p className="mt-3 text-sm font-semibold text-emerald-700">
              ✓ Keine Begründung nötig · Erstattung in 48h
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-gold-300 bg-white p-8 shadow-card">
            <div className="absolute -right-6 -top-6 grid h-28 w-28 -rotate-12 place-items-center rounded-full bg-gold-50">
              <Clock size={40} className="text-gold-600" />
            </div>
            <Badge variant="gold">Garantie 2</Badge>
            <h3 className="h-display mt-4 text-2xl text-navy-900 md:text-3xl">
              7-Tage-Ergebnis-Garantie
            </h3>
            <p className="mt-3 text-navy-700">
              Wenn du innerhalb von 7 Tagen nach dem Kauf <strong>kein einziges fertiges Visual</strong> mit der Box erstellt hast (Slide, Landing-Page-Sektion oder Ad), zeigen wir dir persönlich, wie es geht — oder geben dir dein Geld zurück <em>und</em> du behältst die Box.
            </p>
            <p className="mt-3 text-sm font-semibold text-gold-700">
              ✓ Persönlicher 1:1-Setup-Call inklusive
            </p>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-navy-600">
          Wir haben diese Garantien, weil wir wissen: Die Box funktioniert. Über{" "}
          <strong>97% unserer Kunden</strong> sind nach den ersten 7 Tagen so begeistert, dass sie ihre Erfahrung in einer Bewertung teilen.
        </p>
      </div>
    </Section>
  );
}
