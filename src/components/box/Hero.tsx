import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Star, Check, Shield } from "@/components/ui/Icon";
import { TRUST } from "@/lib/site";
import { formatNumber } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-gradient text-white">
      {/* Decorative blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-navy-300/20 blur-3xl" />
      </div>

      <div className="container-wide relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <Badge variant="gold" className="bg-gold-400/10 border-gold-400/30 text-gold-200">
            ⚡ Limitierter Launch — nur 500 Plätze
          </Badge>
          <h1 className="h-display mt-5 text-4xl text-white md:text-6xl">
            1.000+ Premium <span className="bg-gold-shine bg-clip-text text-transparent">3D-Charaktere</span> für deine Visuals — einmal kaufen, lebenslang nutzen.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-100 md:text-xl">
            Stoppe die Suche nach passenden Bildern. Mit der <strong>3D Man Box</strong> hast du sofort einen kompletten Bestand professioneller Charaktere für Pitch-Decks, Landing Pages, Werbeanzeigen und Social Media.
          </p>

          <ul className="mt-8 grid gap-3 text-navy-100 md:grid-cols-2">
            {[
              "1.000+ einsatzbereite Charaktere",
              "Lebenslange Nutzungsrechte",
              "Sofort-Download in 4K",
              "60 Tage Geld-zurück-Garantie",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Check size={20} className="mt-0.5 shrink-0 text-gold-300" />
                <span className="font-medium">{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#angebot" variant="gold" size="xl">
              Jetzt die Box sichern — 197€
            </ButtonLink>
            <span className="text-sm text-navy-200">
              <Shield size={16} className="-mt-0.5 mr-1 inline-block text-gold-300" />
              60-Tage-Garantie · Sofort verfügbar
            </span>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={18} className="fill-gold-300 text-gold-300" />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">
                {TRUST.averageRating} / 5
              </span>
              <span className="text-xs text-navy-200">aus {formatNumber(TRUST.customers)} Bewertungen</span>
            </div>
            <div className="text-sm text-navy-200">
              <span className="font-semibold text-white">{formatNumber(TRUST.customers)}+</span> aktive Nutzer
            </div>
            <div className="text-sm text-navy-200">
              In <span className="font-semibold text-white">{TRUST.countries}</span> Ländern im Einsatz
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              { emoji: "👨‍💼", bg: "from-blue-400 to-blue-600" },
              { emoji: "👩‍💻", bg: "from-purple-400 to-purple-600" },
              { emoji: "🧑‍⚕️", bg: "from-emerald-400 to-emerald-600" },
              { emoji: "👨‍🏫", bg: "from-orange-400 to-orange-600" },
              { emoji: "👩‍🔬", bg: "from-pink-400 to-pink-600" },
              { emoji: "🧑‍🎨", bg: "from-amber-400 to-amber-600" },
              { emoji: "👨‍🚀", bg: "from-indigo-400 to-indigo-600" },
              { emoji: "👩‍🍳", bg: "from-red-400 to-red-600" },
              { emoji: "🧑‍✈️", bg: "from-cyan-400 to-cyan-600" },
            ].map((c, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${c.bg} grid place-items-center text-5xl shadow-card transition-transform hover:scale-105 hover:rotate-2 md:text-6xl`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {c.emoji}
              </div>
            ))}
          </div>
          <div className="absolute -bottom-3 -right-3 rounded-2xl bg-white px-4 py-3 shadow-card text-navy-800">
            <div className="text-2xs uppercase font-semibold text-navy-500">Insgesamt</div>
            <div className="font-display text-2xl font-bold">+1.000 Charaktere</div>
          </div>
        </div>
      </div>
    </section>
  );
}
