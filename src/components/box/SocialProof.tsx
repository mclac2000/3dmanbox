import { Section } from "@/components/ui/Section";
import { Star } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";

const testimonials = [
  {
    name: "Sarah Müller",
    role: "Marketing Lead, B2B SaaS",
    text: "Wir haben in einer Woche unsere komplette Landing Page und 12 LinkedIn-Ads damit gestaltet. Konsistent, schnell, professionell. Die beste 197€-Investition dieses Jahres.",
    rating: 5,
    initials: "SM",
    color: "from-purple-400 to-pink-500",
  },
  {
    name: "Tobias Reiter",
    role: "Solo-Berater & Speaker",
    text: "Meine Pitch-Decks sahen vorher aus wie 1000 andere. Mit der 3D Man Box bekomme ich jetzt regelmäßig Komplimente von Investoren. Der visuelle Unterschied ist gewaltig.",
    rating: 5,
    initials: "TR",
    color: "from-blue-400 to-cyan-500",
  },
  {
    name: "Anna Vogt",
    role: "Founder, EdTech-Startup",
    text: "Die Charaktere passen in jede Nische — Bildung, Tech, Healthcare. Ich kann ohne Designer hochwertige Inhalte produzieren. Das spart uns 4-stellige Beträge pro Monat.",
    rating: 5,
    initials: "AV",
    color: "from-emerald-400 to-teal-500",
  },
  {
    name: "Daniel Krause",
    role: "Agentur-Inhaber",
    text: "Wir nutzen die Box jetzt für alle Kunden. Statt jedes Mal neu zu rendern, haben wir einen einheitlichen Stil. Spart 5-10 Stunden pro Projekt.",
    rating: 5,
    initials: "DK",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Julia Hauser",
    role: "Online-Coach",
    text: "Ich hätte nie gedacht, dass ich als nicht-Designerin so professionell aussehende Slides bauen kann. Mein Kursumsatz hat sich verdoppelt — die Optik macht den Unterschied.",
    rating: 5,
    initials: "JH",
    color: "from-rose-400 to-fuchsia-500",
  },
  {
    name: "Marcus Bauer",
    role: "Head of Content",
    text: "Hatte vorher 4 verschiedene Bildlösungen parallel. Jetzt nur noch eine. Sauber, schnell, rechtssicher. Genau, wie es sein sollte.",
    rating: 5,
    initials: "MB",
    color: "from-indigo-400 to-violet-500",
  },
];

export function SocialProof() {
  return (
    <Section id="social-proof" background="soft">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="gold">Über 2.300 zufriedene Kunden</Badge>
          <h2 className="h-display mt-5 text-3xl text-navy-900 md:text-5xl">
            Was Kunden über die 3D Man Box sagen
          </h2>
          <p className="mt-5 text-lg text-navy-700">
            Marketingteams, Solopreneure, Agenturen und Coaches nutzen die Box täglich — von Berlin bis Buenos Aires.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-navy-100 bg-white p-7 shadow-soft"
            >
              <div className="flex">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-navy-700">
                „{t.text}“
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-navy-100 pt-4">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${t.color} font-display text-sm font-bold text-white`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-navy-900">{t.name}</div>
                  <div className="text-xs text-navy-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Logos / Brand Strip */}
        <div className="mt-14 rounded-2xl border border-navy-100 bg-white p-7 md:p-10">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-navy-500">
            Im Einsatz bei Teams in
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 text-center text-navy-400 md:grid-cols-6">
            {["Berlin", "München", "Wien", "Zürich", "Amsterdam", "London"].map((c) => (
              <div key={c} className="font-display text-2xl font-semibold tracking-tight">
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
