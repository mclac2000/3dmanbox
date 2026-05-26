import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Check, Sparkles, Zap, Box } from "@/components/ui/Icon";
import { TRUST } from "@/lib/site";
import { formatNumber } from "@/lib/utils";

export const metadata = {
  title: "3D Man Club — Dein KI-Studio für unbegrenzte 3D-Charaktere",
  description:
    "Generiere, kuratiere und teile professionelle 3D-Charaktere für Marketing, Produkte und Inhalte — von der Master-Box bis zur unbegrenzten KI-Generierung.",
};

const previewChars = [
  "👨‍💼","👩‍💻","🧑‍⚕️","👨‍🏫","👩‍🔬","🧑‍🎨","👨‍🚀","👩‍🍳",
  "🧑‍✈️","👨‍🌾","👩‍🚒","🧑‍🔧","👨‍🎤","👩‍🎓","🧑‍💼","👨‍🦰",
];

export default function ClubHome() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-gradient text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-400/20 blur-3xl" />
        </div>
        <div className="container-wide relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gold" className="bg-gold-400/10 border-gold-400/30 text-gold-200">
              3D Man Club · Members Hub
            </Badge>
            <h1 className="h-display mt-5 text-4xl text-white md:text-6xl">
              Dein <span className="bg-gold-shine bg-clip-text text-transparent">KI-Studio</span> für unbegrenzte 3D-Charaktere
            </h1>
            <p className="mt-6 text-lg text-navy-100 md:text-xl">
              Generiere, kuratiere und teile professionelle Charaktere — passend zu deinem Stil, deiner Marke und deinem Projekt. Kostenlos starten, mit Credits skalieren.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/pricing" variant="gold" size="xl">
                Kostenlos starten
              </ButtonLink>
              <ButtonLink href="https://3dmanbox.com" external variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-navy-900">
                Master Box für 197€
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs text-navy-300">
              Keine Kreditkarte nötig · 10 KI-Credits Start-Guthaben
            </p>
          </div>

          {/* Char Grid */}
          <div className="mt-16">
            <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
              {previewChars.map((c, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-white/5 ring-1 ring-white/10 backdrop-blur grid place-items-center text-3xl md:text-4xl"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Section background="white" className="py-12">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Aktive Mitglieder", value: `${formatNumber(TRUST.customers)}+` },
              { label: "Charaktere generiert", value: `${formatNumber(TRUST.totalGenerations)}+` },
              { label: "Länder", value: TRUST.countries },
              { label: "Ø Bewertung", value: `${TRUST.averageRating}/5` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-navy-900 md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-navy-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section background="soft">
        <div className="container-base">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gold">Was du im Club bekommst</Badge>
            <h2 className="h-display mt-5 text-3xl text-navy-900 md:text-5xl">
              Vom statischen Bestand bis zur unbegrenzten KI-Generierung
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Box size={24} />,
                title: "Master-Galerie",
                text: "Browse durch 1.000+ kuratierte Charaktere. Filter nach Kategorie, Stil, Alter, Outfit.",
                color: "bg-navy-100 text-navy-700",
              },
              {
                icon: <Sparkles size={24} />,
                title: "KI-Generator",
                text: "Beschreibe deinen Wunsch-Charakter in einem Satz — und bekomme in 30 Sekunden 4 Variationen.",
                color: "bg-gold-100 text-gold-700",
              },
              {
                icon: <Zap size={24} />,
                title: "Custom-LoRA",
                text: "Trainiere unsere KI auf deinen eigenen Stil — und generiere unbegrenzt im Markendesign.",
                color: "bg-emerald-100 text-emerald-700",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-7 shadow-soft">
                <div className={`grid h-12 w-12 place-items-center rounded-full ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
                  {f.title}
                </h3>
                <p className="mt-3 text-[15px] text-navy-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Tiered Pitch */}
      <Section background="white">
        <div className="container-base">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Badge variant="gold">Master Box + Club</Badge>
              <h2 className="h-display mt-5 text-3xl text-navy-900 md:text-4xl">
                Einmal die Box. Lebenslang Zugriff. Optional unbegrenzt mit KI.
              </h2>
              <p className="mt-5 text-navy-700">
                Mit dem Kauf der 3D Man Box bekommst du automatisch einen Club-Account inklusive 100 KI-Credits. Wenn du mehr willst, upgrade jederzeit auf ein Credit-Paket — oder bleib auf Pay-As-You-Go.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "1.000+ Premium-Charaktere zum Sofort-Download",
                  "100 KI-Generierungen Start-Guthaben",
                  "Web-Galerie mit Such- und Filterfunktionen",
                  "Lebenslange kommerzielle Lizenz",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-navy-700">
                    <Check size={20} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="https://3dmanbox.com" external variant="gold" size="lg">
                  Master Box für 197€
                </ButtonLink>
                <ButtonLink href="/pricing" variant="outline" size="lg">
                  Nur Club-Plan ansehen
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-2xl bg-navy-gradient p-7 text-white md:p-10">
              <h3 className="font-display text-2xl font-semibold">Live-Beispiel</h3>
              <p className="mt-2 text-sm text-navy-200">
                So fragt unser KI-Studio nach deinem Wunsch-Charakter:
              </p>
              <div className="mt-5 rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
                <code className="text-sm text-gold-200">
                  „Ein freundlicher Software-Engineer Anfang 30, lockere Brille, dunkelblauer Pullover, hält ein Notebook unter dem Arm."
                </code>
              </div>
              <div className="mt-4 text-xs text-navy-300">→ Generiert in 28 Sekunden · 4 Variationen · 1 Credit pro Generierung</div>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {["🧑‍💻","👨‍💻","👩‍💻","🧑‍💼"].map((e, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-white/5 ring-1 ring-white/10 grid place-items-center text-3xl"
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section background="navy" className="py-16">
        <div className="container-base text-center">
          <h2 className="h-display text-3xl text-white md:text-5xl">
            Bereit, deinen visuellen Standard zu heben?
          </h2>
          <p className="mt-5 text-lg text-navy-100">
            Starte kostenlos mit 10 Credits — oder hol dir die Master Box samt 100 Credits für einmalig 197€.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/pricing" variant="gold" size="xl">
              Kostenlos starten
            </ButtonLink>
            <Link href="https://3dmanbox.com" className="text-sm font-semibold text-gold-300 underline">
              → oder Master Box für 197€
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
