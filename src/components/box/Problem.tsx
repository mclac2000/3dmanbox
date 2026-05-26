import { Section } from "@/components/ui/Section";
import { X } from "@/components/ui/Icon";

const pains = [
  {
    title: "Stockfoto-Hölle",
    text: "Du verlierst Stunden bei der Suche nach passenden Bildern — und am Ende sehen sie aus wie auf jeder zweiten Webseite.",
  },
  {
    title: "Generische KI-Bilder",
    text: "Mit jedem Generierungs-Versuch verschwendest du Credits — und die Ergebnisse passen weder zu deinem Stil noch zueinander.",
  },
  {
    title: "Inkonsistente Visuals",
    text: "Deine Landing Page, dein Pitch-Deck und deine Ads sehen aus, als kämen sie aus drei verschiedenen Firmen.",
  },
  {
    title: "Teure Lizenzfallen",
    text: "Premium-Bildbanken kosten 30€+ pro Bild — und du darfst sie oft nicht mal in Werbeanzeigen einsetzen.",
  },
  {
    title: "Designer-Engpass",
    text: "Jedes neue Visual braucht eine Bestellung beim Designer — und kostet dich Tage Wartezeit für ein einziges Bild.",
  },
];

export function Problem() {
  return (
    <Section id="problem" background="white">
      <div className="container-base">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="h-display text-3xl text-navy-900 md:text-5xl">
            Kennst du eines dieser fünf Probleme?
          </h2>
          <p className="mt-5 text-lg text-navy-700">
            Wenn du in den letzten 12 Monaten Visuals für dein Business gebraucht hast, ist mindestens eines davon dir wahrscheinlich passiert:
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pains.map((p) => (
            <li
              key={p.title}
              className="group relative rounded-2xl border border-navy-100 bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
                <X size={22} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-navy-600">{p.text}</p>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl bg-navy-50 p-7 text-center md:p-9">
          <p className="font-display text-xl font-semibold text-navy-800 md:text-2xl">
            Was wäre, wenn du diese fünf Probleme mit einer einzigen Investition für immer löst?
          </p>
        </div>
      </div>
    </Section>
  );
}
