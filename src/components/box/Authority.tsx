import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Check } from "@/components/ui/Icon";
import { TRUST } from "@/lib/site";
import { formatNumber } from "@/lib/utils";

export function Authority() {
  return (
    <Section id="authority" background="white">
      <div className="container-base">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Badge variant="gold">Wer steht dahinter</Badge>
            <h2 className="h-display mt-5 text-3xl text-navy-900 md:text-5xl">
              Aufgebaut von einem Team, das 10+ Jahre digitale Produkte für DACH-Marken liefert.
            </h2>
            <p className="mt-5 text-navy-700">
              Hinter der 3D Man Box steht ein Team aus 3D-Artists, KI-Engineers und Performance-Marketers. Wir haben in den letzten Jahren visuelle Produkte für Software-Anbieter, Coaches und Agenturen entwickelt — und genau gesehen, was an typischen Bildbanken kaputt ist.
            </p>
            <p className="mt-4 text-navy-700">
              Diese Box ist die Antwort, die wir uns selbst gewünscht hätten: <strong>einmal kaufen, lebenslang nutzen, ohne Mini-Print im Lizenzvertrag.</strong>
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Eigenes Render-Studio in Zürich",
                "DSGVO-konformer EU-Hosting (Hetzner Falkenstein)",
                "Lizenzmodell mit unabhängiger Rechtsprüfung",
                "Persönlicher Support per Mail & Chat",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2 text-navy-700">
                  <Check size={20} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-navy-gradient p-8 text-white shadow-card md:p-10">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="font-display text-4xl font-bold text-gold-300 md:text-5xl">
                  {formatNumber(TRUST.customers)}+
                </div>
                <div className="mt-1 text-sm text-navy-200">Aktive Kunden</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-gold-300 md:text-5xl">
                  {TRUST.countries}
                </div>
                <div className="mt-1 text-sm text-navy-200">Länder</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-gold-300 md:text-5xl">
                  {formatNumber(TRUST.totalGenerations)}+
                </div>
                <div className="mt-1 text-sm text-navy-200">Charaktere generiert</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-gold-300 md:text-5xl">
                  {TRUST.averageRating}/5
                </div>
                <div className="mt-1 text-sm text-navy-200">Ø Bewertung</div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
              <p className="text-sm text-navy-100">
                <strong className="text-white">Made in Switzerland 🇨🇭</strong> — entwickelt, getestet und supportet aus der Schweiz. Unsere Server stehen in der EU. Deine Daten verlassen DACH nicht.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
