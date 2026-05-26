"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown } from "@/components/ui/Icon";

const items = [
  {
    q: "Sind die 3D-Charaktere wirklich für kommerzielle Nutzung freigegeben?",
    a: "Ja, absolut. Mit dem Kauf erhältst du lebenslange Nutzungsrechte für alle kommerziellen Projekte — Webseiten, Landing Pages, bezahlte Werbung, Pitch-Decks, Social Media, Kursinhalte. Die einzigen Einschränkungen: Du darfst die Charaktere nicht selbst als Bibliothek oder Pack weiterverkaufen.",
  },
  {
    q: "Wie hochauflösend sind die Charaktere?",
    a: "Alle Charaktere kommen in 4K-Auflösung (3840×2160), mit transparentem Hintergrund (PNG) und zusätzlich als WebP für schnelle Web-Ladezeiten. Du kannst sie ohne Qualitätsverlust für Print und große Displays einsetzen.",
  },
  {
    q: "Ist das ein Abo? Gibt es Folgekosten?",
    a: "Nein. Die 197€ sind eine einmalige Zahlung. Kein Abo, keine Folgekosten, keine Upgrade-Zwänge. Die 100 KI-Credits sind ebenfalls inklusive. Wenn du mehr KI-Generierungen willst, kannst du optional Credit-Pakete im Club nachkaufen — musst du aber nicht.",
  },
  {
    q: "Was passiert, wenn ich nicht zufrieden bin?",
    a: "Du hast 60 Tage Zeit für eine vollständige Rückerstattung — ohne Begründung. Schreibst du uns eine Mail an refund@3dmanbox.com, bekommst du innerhalb von 48 Stunden die 197€ zurück auf das ursprüngliche Zahlungsmittel.",
  },
  {
    q: "Wie schnell bekomme ich Zugriff auf die Box?",
    a: "Sofort. Nach dem Kauf wirst du direkt auf eine Bestätigungsseite weitergeleitet, wo du die Box als ZIP-Datei (ca. 2,4 GB) herunterladen kannst. Parallel bekommst du eine E-Mail mit deinen Login-Daten für den Club, falls du KI-Generierungen nutzen willst.",
  },
  {
    q: "Brauche ich Vorkenntnisse oder spezielle Software?",
    a: "Nein. Die Charaktere sind als PNG/WebP-Dateien — du ziehst sie einfach per Drag-and-Drop in Canva, PowerPoint, Keynote, Figma, Webflow oder jedes andere Tool. Wer mehr will: Wir liefern auch PSD-Dateien für Photoshop mit.",
  },
  {
    q: "Was ist der Unterschied zwischen 3dmanbox.com und 3dman.club?",
    a: "3dmanbox.com ist der Shop für die einmalige Master-Box (197€) und Kategorie-Pakete. 3dman.club ist die Plattform, auf der du KI-Generierungen, Galerie-Browsing und Members-Features findest. Mit dem Kauf der Box bekommst du automatisch einen Club-Zugang — kein zweiter Kauf nötig.",
  },
  {
    q: "Welche Charaktere sind enthalten?",
    a: "Über 1.000 Charaktere in sechs Kategorien: Business-Profis (CEOs, Berater, Vertrieb), Tech & IT (Devs, Engineers, Founders), Healthcare (Ärzte, Pflege, Therapeut:innen), Education (Lehrkräfte, Coaches, Studenten), Lifestyle (Sport, Fitness, Freizeit) und Creative (Designer, Künstler, Musiker). Vielfältige Hauttöne, Alter und Outfits inklusive.",
  },
  {
    q: "Kann ich die Box mit meinem Team nutzen?",
    a: "Ja. Die Lizenz umfasst dich plus bis zu 5 Personen in deinem Team. Für größere Organisationen (10+ Personen) gibt es eine Team-Lizenz für 397€ — schreib uns dazu einfach kurz.",
  },
  {
    q: "Werden neue Charaktere hinzugefügt?",
    a: "Ja, im ersten Jahr bekommst du monatlich 30+ neue Charaktere kostenlos dazu. Du kriegst eine E-Mail, sobald sie verfügbar sind, und kannst sie direkt im Club herunterladen.",
  },
  {
    q: "Ist die Bezahlung sicher?",
    a: "Wir nutzen Stripe als Zahlungsabwickler — denselben Anbieter, dem Shopify, Substack und Notion vertrauen. Deine Kartendaten erreichen unsere Server nie. Wir akzeptieren Visa, Mastercard, Amex, SEPA-Lastschrift und PayPal.",
  },
  {
    q: "Was, wenn ich mehr als 100 KI-Generierungen brauche?",
    a: "Im Club kannst du jederzeit Credit-Pakete nachkaufen: 50 Credits für 9€, oder ein monatliches Pro-Paket mit 500 Credits für 29€/Monat. Die meisten Kunden kommen mit den 100 Start-Credits 3-6 Monate aus.",
  },
  {
    q: "Ist die Box DSGVO-konform und für EU-Kunden geeignet?",
    a: "Ja. Wir sind ein EU-Unternehmen mit Servern in Falkenstein (Deutschland). Es gibt eine AVV auf Anfrage, und wir geben keine Daten an Dritte weiter. Alle Zahlungen laufen über Stripe (PCI-DSS Level 1 zertifiziert).",
  },
  {
    q: "Gibt es Rechnungen für Geschäftskunden?",
    a: "Selbstverständlich. Nach dem Kauf erhältst du automatisch eine USt-konforme Rechnung per E-Mail. Bei EU-VAT-Reverse-Charge (B2B außerhalb Deutschlands) kannst du deine USt-IdNr. im Checkout angeben.",
  },
  {
    q: "Wie kontaktiere ich den Support?",
    a: "Per Mail an hello@3dmanbox.com — wir antworten innerhalb von 24 Stunden (oft schneller). Für Kunden mit dringenden Fragen gibt es einen Chat im Club-Dashboard.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" background="white">
      <div className="container-base">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="gold">Häufige Fragen</Badge>
          <h2 className="h-display mt-5 text-3xl text-navy-900 md:text-5xl">
            Alles, was du wissen musst — bevor du klickst.
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white shadow-soft">
          {items.map((it, idx) => {
            const isOpen = open === idx;
            return (
              <div key={it.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-navy-50/50"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-navy-900 md:text-lg">
                    {it.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-navy-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-[15px] leading-relaxed text-navy-700">
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-navy-600">
          Noch eine Frage offen?{" "}
          <a href="mailto:hello@3dmanbox.com" className="font-semibold text-navy-900 underline">
            Schreib uns
          </a>{" "}
          — wir antworten innerhalb von 24 Stunden.
        </p>
      </div>
    </Section>
  );
}
