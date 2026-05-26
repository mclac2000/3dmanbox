import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Check, X } from "@/components/ui/Icon";
import { PRICING } from "@/lib/site";
import { formatEUR } from "@/lib/utils";

export const metadata = {
  title: "Preise & Pakete",
  description:
    "Credit-Pakete für KI-Generierungen, Master Box und Kategorie-Pakete. Pay-As-You-Go, Starter, Pro oder Unlimited.",
};

export default function PricingPage() {
  return (
    <>
      <section className="bg-navy-gradient text-white">
        <div className="container-base py-16 md:py-20 text-center">
          <Badge variant="gold" className="bg-gold-400/10 border-gold-400/30 text-gold-200">
            Transparente Preise
          </Badge>
          <h1 className="h-display mt-5 text-3xl text-white md:text-5xl">
            Wähle, was zu dir passt.
          </h1>
          <p className="mt-5 text-lg text-navy-100">
            Vom einmaligen Box-Kauf bis zum unbegrenzten KI-Tarif — alles ohne versteckte Kosten.
          </p>
        </div>
      </section>

      {/* Master Box callout */}
      <Section background="white" className="py-12">
        <div className="container-base">
          <div className="rounded-2xl border-2 border-gold-300 bg-gold-50 p-7 md:p-10">
            <div className="grid items-center gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Badge variant="gold">Bestseller — einmalige Investition</Badge>
                <h2 className="h-display mt-3 text-2xl text-navy-900 md:text-3xl">
                  3D Man Master Box
                </h2>
                <p className="mt-2 text-navy-700">
                  1.000+ Premium-Charaktere, lebenslange Lizenz, 100 KI-Credits inklusive. Einmal kaufen, lebenslang nutzen.
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-sm text-navy-500 line-through">{formatEUR(1728)}</div>
                <div className="font-display text-5xl font-bold text-navy-900">
                  {formatEUR(197)}
                </div>
                <div className="mt-1 text-xs text-navy-500">einmalig</div>
                <ButtonLink href="https://3dmanbox.com" external variant="gold" size="lg" className="mt-4">
                  Box kaufen
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Credit Plans */}
      <Section background="soft">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="h-display text-3xl text-navy-900 md:text-4xl">
              KI-Credit-Pakete
            </h2>
            <p className="mt-3 text-navy-700">
              Eine Generierung = 1 Credit (4 Variationen). Credits verfallen bei Abos nicht im Monat.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PRICING.credits.map((p) => (
              <div
                key={p.slug}
                className={`relative rounded-2xl bg-white p-7 shadow-soft ${p.featured ? "ring-2 ring-gold-400 shadow-card" : "border border-navy-100"}`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gold">Beliebtester Plan</Badge>
                  </div>
                )}
                <h3 className="font-display text-xl font-semibold text-navy-900">{p.name}</h3>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-navy-900">
                    {formatEUR(p.price)}
                  </span>
                  {p.interval && (
                    <span className="text-sm text-navy-500"> / Monat</span>
                  )}
                </div>
                <div className="mt-1 text-sm text-navy-500">
                  {p.credits === -1
                    ? "Unbegrenzte Credits"
                    : `${p.credits} Credits${p.interval ? " / Monat" : ""}`}
                </div>
                <div className="mt-1 text-xs text-navy-400">
                  {p.credits === -1
                    ? "Fair-Use bis 2.000/Monat"
                    : `${formatEUR(p.perCredit)} pro Credit`}
                </div>

                <ul className="mt-6 space-y-2 text-sm">
                  {[
                    "4 Variationen pro Generierung",
                    "4K-Auflösung Downloads",
                    "Kommerzielle Nutzung",
                    p.featured ? "Vorrang in der Queue" : "Standard-Queue",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-navy-700">
                      <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {p.slug !== "unlimited" && (
                    <li className="flex items-start gap-2 text-navy-400">
                      <X size={16} className="mt-0.5 shrink-0" />
                      <span>Custom-LoRA-Training (separat)</span>
                    </li>
                  )}
                </ul>

                <ButtonLink
                  href={`/api/stripe/checkout?sku=CREDITS_${p.slug.toUpperCase()}`}
                  variant={p.featured ? "gold" : "outline"}
                  size="md"
                  fullWidth
                  className="mt-6"
                >
                  {p.interval ? "Plan starten" : "Credits kaufen"}
                </ButtonLink>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-navy-600">
            Alle Pläne jederzeit kündbar. Keine Mindestlaufzeit. Preise inkl. MwSt. für Privatkunden / netto für EU-B2B.
          </p>
        </div>
      </Section>

      {/* Category Boxes */}
      <Section background="white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="soft">Bevorzugst du einzelne Kategorien?</Badge>
            <h2 className="h-display mt-4 text-3xl text-navy-900 md:text-4xl">
              Kategorie-Pakete einzeln kaufen
            </h2>
            <p className="mt-3 text-navy-700">
              Nicht alle 1.000 Charaktere nötig? Kauf nur die Kategorie, die du wirklich brauchst.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PRICING.categoryBoxes.map((b) => (
              <div key={b.slug} className="flex items-center justify-between rounded-xl border border-navy-100 bg-white p-5 shadow-soft">
                <div>
                  <div className="font-semibold text-navy-900">{b.name}</div>
                  <div className="text-sm text-navy-500">{b.count} Charaktere</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-navy-900">
                    {formatEUR(b.price)}
                  </div>
                  <ButtonLink
                    href={`/api/stripe/checkout?sku=CAT_${b.slug.toUpperCase()}`}
                    variant="ghost"
                    size="sm"
                  >
                    Kaufen →
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
