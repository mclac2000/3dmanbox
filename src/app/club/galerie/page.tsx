import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Lock } from "@/components/ui/Icon";

export const metadata = {
  title: "Galerie — 3D Man Club",
  description: "Browse durch 1.000+ kuratierte 3D-Charaktere für Business-Visuals.",
};

const categories = [
  { name: "Business-Profis", count: 150, emoji: "👨‍💼" },
  { name: "Tech & IT", count: 120, emoji: "👩‍💻" },
  { name: "Healthcare", count: 100, emoji: "🧑‍⚕️" },
  { name: "Education", count: 80, emoji: "👨‍🏫" },
  { name: "Lifestyle", count: 90, emoji: "🧑‍🎨" },
  { name: "Creative", count: 70, emoji: "👩‍🎤" },
  { name: "Logistik & Industrie", count: 60, emoji: "🧑‍🔧" },
  { name: "Hospitality", count: 55, emoji: "👨‍🍳" },
];

const previewChars = ["👨‍💼","👩‍💻","🧑‍⚕️","👨‍🏫","👩‍🔬","🧑‍🎨","👨‍🚀","👩‍🍳","🧑‍✈️","👨‍🌾","👩‍🚒","🧑‍🔧","👨‍🎤","👩‍🎓","🧑‍💼","👨‍🦰","🧑‍💻","👩‍🍳","🧑‍🎤","👨‍🎓","👩‍🎨","🧑‍🏫","👨‍🍳","👩‍🚒"];

export default function Galerie() {
  return (
    <>
      <section className="bg-navy-gradient text-white">
        <div className="container-base py-16 md:py-20 text-center">
          <Badge variant="gold" className="bg-gold-400/10 border-gold-400/30 text-gold-200">
            Galerie · Vorschau
          </Badge>
          <h1 className="h-display mt-5 text-3xl text-white md:text-5xl">
            1.000+ Charaktere in 8 Kategorien
          </h1>
          <p className="mt-4 text-lg text-navy-100">
            Logge dich ein, um in voller Auflösung herunterzuladen.
          </p>
        </div>
      </section>

      <Section background="white">
        <div className="container-wide">
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
            {previewChars.map((c, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl bg-navy-50 grid place-items-center text-4xl shadow-soft transition hover:shadow-card md:text-5xl"
              >
                {c}
                {i >= 8 && (
                  <div className="absolute inset-0 grid place-items-center bg-navy-900/50 opacity-0 transition group-hover:opacity-100">
                    <Lock size={20} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-navy-50 p-7 text-center md:p-10">
            <h3 className="h-display text-2xl font-semibold text-navy-900 md:text-3xl">
              Vollen Zugriff freischalten
            </h3>
            <p className="mt-3 max-w-xl mx-auto text-navy-700">
              Mit der Master Box (197€) bekommst du alle 1.000+ Charaktere sofort plus 100 KI-Credits — oder starte kostenlos im Club mit 10 Credits.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="https://3dmanbox.com" external variant="gold" size="lg">
                Master Box · 197€
              </ButtonLink>
              <ButtonLink href="/login" variant="outline" size="lg">
                Kostenlos starten
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section background="soft">
        <div className="container-base">
          <h2 className="h-display text-3xl text-navy-900 md:text-4xl text-center">
            Kategorien
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <div key={c.name} className="rounded-2xl bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <div className="text-4xl">{c.emoji}</div>
                <div className="mt-4 font-display text-lg font-semibold text-navy-900">{c.name}</div>
                <div className="mt-1 text-sm text-navy-500">{c.count} Charaktere</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
