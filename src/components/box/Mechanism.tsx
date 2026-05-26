import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Box, Sparkles, Zap } from "@/components/ui/Icon";

export function Mechanism() {
  return (
    <Section id="mechanism" background="soft">
      <div className="container-base">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="gold">Die Lösung</Badge>
          <h2 className="h-display mt-5 text-3xl text-navy-900 md:text-5xl">
            Statischer Bestand <span className="text-gold-500">+</span> KI-Power <span className="text-gold-500">=</span> unbegrenztes Inventar
          </h2>
          <p className="mt-5 text-lg text-navy-700">
            Die 3D Man Box kombiniert das Beste aus zwei Welten: <strong>1.000+ fertige Premium-Charaktere</strong>, die du heute herunterlädst — plus den optionalen Zugang zu unserem <strong>KI-Studio</strong>, das auf Knopfdruck unendliche Variationen für dich erstellt.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-7 shadow-soft">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-navy-100 text-navy-700">
              <Box size={24} />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
              1. Sofort 1.000+ Charaktere
            </h3>
            <p className="mt-3 text-[15px] text-navy-600">
              Lade direkt nach dem Kauf die komplette Master-Box herunter. Business, Tech, Healthcare, Education, Lifestyle, Creative — alles dabei.
            </p>
          </div>

          <div className="rounded-2xl bg-navy-gradient p-7 text-white shadow-card ring-2 ring-gold-400">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gold-shine text-navy-900">
              <Sparkles size={24} />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">
              2. KI generiert weitere
            </h3>
            <p className="mt-3 text-[15px] text-navy-100">
              Brauchst du einen Charakter, den es noch nicht gibt? Beschreibe ihn in einem Satz — unsere KI erstellt ihn passend zum Style deiner Box.
            </p>
            <Badge variant="gold" className="mt-4 bg-white text-navy-900">
              Mit jedem Box-Kauf inklusive: 100 KI-Credits
            </Badge>
          </div>

          <div className="rounded-2xl bg-white p-7 shadow-soft">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700">
              <Zap size={24} />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
              3. Einsetzen — überall
            </h3>
            <p className="mt-3 text-[15px] text-navy-600">
              Lebenslange Nutzungsrechte für kommerzielle Projekte. Webseiten, Ads, Pitch-Decks, Social Media, Produkte. Keine Limits, keine Folgekosten.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-navy-100 bg-white p-7 md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <Badge variant="soft">Stil-Konsistenz</Badge>
              <h3 className="h-display mt-4 text-2xl text-navy-900 md:text-3xl">
                Alle Charaktere — ein einheitlicher Look
              </h3>
              <p className="mt-4 text-navy-700">
                Jeder Charakter wurde im selben hochwertigen 3D-Stil entwickelt. Dein Pitch-Deck wirkt aus einem Guss. Deine Landing Page sieht professionell aus. Deine Ads schreien nicht „KI-generiert“.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["👨‍💼","👩‍💻","🧑‍⚕️","👨‍🏫","👩‍🔬","🧑‍🎨","👨‍🚀","👩‍🍳","🧑‍✈️","👨‍🌾","👩‍🚒","🧑‍🔧"].map((e, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-navy-50 grid place-items-center text-3xl"
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
