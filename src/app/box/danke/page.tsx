import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Check, Download, Mail, Sparkles } from "@/components/ui/Icon";
import { PRICING } from "@/lib/site";
import { formatEUR } from "@/lib/utils";

export const metadata = {
  title: "Danke für deine Bestellung 🎉",
  description: "Deine 3D Man Box ist bereit. Lade sie herunter und leg los.",
};

type SearchParams = { session_id?: string; sku?: string };

export default async function Danke({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sku = params.sku || "MASTER_BOX";

  return (
    <>
      {/* Confirmation Header */}
      <section className="bg-navy-gradient text-white">
        <div className="container-base py-16 md:py-20 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-300">
            <Check size={32} className="text-emerald-300" />
          </div>
          <Badge variant="gold" className="mt-6 bg-gold-shine text-navy-900">
            Bestellung bestätigt
          </Badge>
          <h1 className="h-display mt-5 text-3xl text-white md:text-5xl">
            Herzlichen Glückwunsch — die Box gehört dir.
          </h1>
          <p className="mt-5 text-lg text-navy-100">
            Wir haben deine Zahlung erhalten. Eine Bestätigungs-Mail mit Rechnung und Download-Link ist unterwegs zu dir.
          </p>
        </div>
      </section>

      {/* Downloads + Schnellstart */}
      <Section background="white" className="py-12">
        <div className="container-base">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-navy-100 bg-white p-7 shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Download size={20} />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold text-navy-900">
                1. Erste Lieferung herunterladen
              </h2>
              <p className="mt-2 text-[15px] text-navy-600">
                Die komplette Master-Box (2,4 GB ZIP) ist sofort verfügbar. Lade sie herunter und entpacke sie auf deinem Rechner.
              </p>
              <ButtonLink
                href="https://3dman.club/dashboard/downloads"
                variant="navy"
                size="md"
                className="mt-5"
              >
                <Download size={18} className="mr-2" /> Master-Box ZIP laden
              </ButtonLink>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-7 shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-100 text-gold-700">
                <Mail size={20} />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold text-navy-900">
                2. Schnellstart-Guide (PDF)
              </h2>
              <p className="mt-2 text-[15px] text-navy-600">
                Wir zeigen dir Schritt für Schritt, wie du die Charaktere in PowerPoint, Canva oder Figma einsetzt — in unter 10 Minuten startklar.
              </p>
              <ButtonLink
                href="/downloads/schnellstart.pdf"
                variant="outline"
                size="md"
                className="mt-5"
              >
                Guide öffnen
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* OTO — One-Time-Offer */}
      <Section background="navy" className="py-16">
        <div className="container-base">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border-2 border-gold-400 bg-white p-8 shadow-card md:p-10">
              <Badge variant="gold">⚡ Einmaliges Angebot — nur jetzt verfügbar</Badge>
              <h2 className="h-display mt-4 text-2xl text-navy-900 md:text-3xl">
                Spare 84%: {formatEUR(PRICING.oto.regularPrice)} → nur {formatEUR(PRICING.oto.price)}
              </h2>
              <p className="mt-4 text-navy-700">
                Du hast jetzt die Box — und 100 KI-Credits dazu. Aber wenn du wirklich systematisch Content produzieren willst, brauchst du mehr.
              </p>
              <p className="mt-3 font-semibold text-navy-900">
                Heute einmalig: 5.000 KI-Credits für {formatEUR(PRICING.oto.price)} statt {formatEUR(PRICING.oto.regularPrice)}.
              </p>

              <ul className="mt-5 grid gap-2 md:grid-cols-2">
                {[
                  "5.000 KI-Generierungen (= 20.000 Variationen)",
                  "Vorrang in der Queue",
                  "Reicht für ~12-18 Monate intensiven Einsatz",
                  "Niemals als Folge-Angebot verfügbar",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-navy-700">
                    <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span className="text-sm">{line}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/api/stripe/checkout?sku=OTO_CREDITS_5000"
                variant="gold"
                size="xl"
                fullWidth
                className="mt-7"
              >
                <Sparkles size={20} className="mr-2" /> 5.000 Credits sichern — 47€
              </ButtonLink>
              <p className="mt-3 text-center text-xs text-navy-500">
                Dieses Angebot erscheint nicht wieder. Im Club zahlst du regulär 0,058€ pro Credit.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Order Bumps */}
      <Section background="soft">
        <div className="container-base">
          <h2 className="font-display text-2xl text-navy-900 md:text-3xl text-center">
            Beliebt mit der 3D Man Box
          </h2>
          <p className="mt-3 text-center text-navy-700">
            Maximiere den Wert deiner Box mit diesen Ergänzungen.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PRICING.orderBumps.map((b) => (
              <div
                key={b.slug}
                className="flex items-center justify-between rounded-xl border border-navy-100 bg-white p-5 shadow-soft"
              >
                <div>
                  <div className="font-semibold text-navy-900">{b.name}</div>
                  <div className="mt-1 text-sm text-navy-500">Einmaliger Kauf, sofort verfügbar</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-navy-900">
                    {formatEUR(b.price)}
                  </div>
                  <ButtonLink
                    href={`/api/stripe/checkout?sku=BUMP_${b.slug.toUpperCase().replace(/-/g, "_")}`}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Hinzufügen
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Affiliate */}
      <Section background="white" className="py-16">
        <div className="container-base">
          <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-600 p-8 text-white shadow-card md:p-12">
            <Badge variant="gold" className="bg-gold-shine text-navy-900">
              Verdiene mit, wenn du die Box weiterempfiehlst
            </Badge>
            <h2 className="h-display mt-5 text-2xl text-white md:text-3xl">
              30% Provision auf jeden Verkauf, den du vermittelst.
            </h2>
            <p className="mt-4 text-navy-100">
              Du teilst die Box mit Kollegen, Kunden oder deiner Community? Werde Affiliate — und bekomme 30% von jedem Verkauf, plus 20% lebenslang von Folge-Käufen.
            </p>
            <ButtonLink href="https://3dman.club/affiliate" external variant="gold" size="lg" className="mt-6">
              Kostenlos Affiliate werden
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Footer Hint */}
      <Section background="soft" className="py-12 text-center">
        <div className="container-narrow">
          <p className="text-sm text-navy-600">
            Bestätigungs-Mail nicht erhalten? Schau im Spam-Ordner oder schreib uns an{" "}
            <a className="font-semibold text-navy-900 underline" href="mailto:hello@3dmanbox.com">
              hello@3dmanbox.com
            </a>
            . Bestellung #<code className="text-navy-700">{params.session_id?.slice(-12) || "—"}</code> · SKU: <code className="text-navy-700">{sku}</code>
          </p>
        </div>
      </Section>
    </>
  );
}
